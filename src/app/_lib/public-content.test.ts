import assert from "node:assert/strict";
import test from "node:test";
import {
  getAllBlogArticles,
  getAllCardNews,
  getBlogArticle,
  getBlogArticles,
  PublicContentFetchError,
} from "./public-content";

const originalFetch = globalThis.fetch;

test.afterEach(() => {
  globalThis.fetch = originalFetch;
});

function useFakeFetch(
  handler: (url: URL, init?: RequestInit) => Response | Promise<Response>,
): URL[] {
  const requests: URL[] = [];
  globalThis.fetch = (async (input, init) => {
    const url = new URL(input instanceof Request ? input.url : input.toString());
    requests.push(url);
    return handler(url, init);
  }) as typeof fetch;
  return requests;
}

test("detail fetches return null only for a genuine upstream 404", async () => {
  useFakeFetch(() => new Response(null, { status: 404 }));

  assert.equal(await getBlogArticle("missing-article"), null);
});

test("public-content requests always carry a bounded abort signal", async () => {
  let signal: AbortSignal | null | undefined;
  useFakeFetch((_url, init) => {
    signal = init?.signal;
    return new Response(null, { status: 404 });
  });

  await getBlogArticle("bounded-request");

  assert.ok(signal instanceof AbortSignal);
});

test("successful null JSON is not mistaken for missing content", async () => {
  useFakeFetch(() => Response.json(null));

  await assert.rejects(getBlogArticle("invalid-null"), PublicContentFetchError);
});

test("detail fetches preserve non-404 upstream failures for the error boundary", async () => {
  useFakeFetch(() =>
    Response.json(
      { message: "temporarily unavailable" },
      { status: 503, statusText: "Service Unavailable" },
    ),
  );

  await assert.rejects(
    getBlogArticle("upstream-outage"),
    (error: unknown) => {
      assert.ok(error instanceof PublicContentFetchError);
      assert.equal(error.status, 503);
      assert.equal(error.path, "/sometime-articles/upstream-outage");
      return true;
    },
  );
});

test("list fetches do not turn upstream failures into an empty archive", async () => {
  useFakeFetch(() => new Response(null, { status: 502, statusText: "Bad Gateway" }));

  await assert.rejects(getBlogArticles(), PublicContentFetchError);
});

test("list fetches distinguish invalid payloads from genuine empty lists", async () => {
  useFakeFetch(() => Response.json({ success: true }));
  await assert.rejects(getBlogArticles(47), PublicContentFetchError);

  useFakeFetch(() => Response.json({ items: [] }));
  assert.deepEqual(await getBlogArticles(46), []);
});

test("200 error envelopes are failures rather than missing content", async () => {
  useFakeFetch(() =>
    Response.json({ success: false, errorCode: "CONTENT_BACKEND_FAILED" }),
  );

  await assert.rejects(
    getBlogArticle("error-envelope"),
    (error: unknown) => {
      assert.ok(error instanceof PublicContentFetchError);
      assert.equal(error.status, 200);
      assert.equal(error.errorCode, "CONTENT_BACKEND_FAILED");
      return true;
    },
  );
});

test("getAllBlogArticles follows a full first page even when API metadata is wrong", async () => {
  const pageOne = Array.from({ length: 50 }, (_, index) => ({
    id: `article-${index + 1}`,
    slug: `article-${index + 1}`,
  }));
  const pageTwo = [{ id: "article-51", slug: "article-51" }];
  const requests = useFakeFetch((url) => {
    const page = url.searchParams.get("page");
    return Response.json({
      items: page === "1" ? pageOne : pageTwo,
      meta: {
        currentPage: Number(page),
        itemsPerPage: 50,
        totalItems: 51,
        // The production endpoint currently reports false on page 1.
        hasNextPage: false,
      },
    });
  });

  const articles = await getAllBlogArticles();

  assert.equal(articles.length, 51);
  assert.deepEqual(
    requests.map((request) => request.searchParams.get("page")),
    ["1", "2"],
  );
});

test("getAllBlogArticles has no arbitrary page cap", async () => {
  useFakeFetch((url) => {
    const page = Number(url.searchParams.get("page"));
    const count = page <= 20 ? 50 : 1;
    return Response.json({
      items: Array.from({ length: count }, (_, index) => ({
        id: `article-${page}-${index}`,
        slug: `article-${page}-${index}`,
      })),
      meta: { hasNextPage: false },
    });
  });

  assert.equal((await getAllBlogArticles()).length, 1001);
});

test("getAllCardNews has no arbitrary cursor-page cap", async () => {
  useFakeFetch((url) => {
    const page = Number(url.searchParams.get("cursor") ?? "1");
    return Response.json({
      data: [{ id: `card-${page}`, title: `Card ${page}` }],
      hasMore: page < 31,
      nextCursor: page < 31 ? String(page + 1) : null,
    });
  });

  assert.equal((await getAllCardNews()).length, 31);
});

test("getAllCardNews follows cursors and returns the complete archive", async () => {
  const requests = useFakeFetch((url) => {
    if (!url.searchParams.has("cursor")) {
      return Response.json({
        data: [{ id: "card-1", title: "First" }],
        hasMore: true,
        nextCursor: "next page",
      });
    }
    return Response.json({
      data: [{ id: "card-2", title: "Second" }],
      hasMore: false,
      nextCursor: null,
    });
  });

  const cards = await getAllCardNews();

  assert.deepEqual(cards.map((card) => card.id), ["card-1", "card-2"]);
  assert.equal(requests[1]?.searchParams.get("cursor"), "next page");
});
