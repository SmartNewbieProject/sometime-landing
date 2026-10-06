import assert from "node:assert/strict";
import test from "node:test";
import { getListedUniversities } from "./university-listing";

const originalFetch = globalThis.fetch;

test.afterEach(() => {
  globalThis.fetch = originalFetch;
});

function useFakeApi(verifiedCounts: Record<string, number | "missing">) {
  globalThis.fetch = (async (input) => {
    const url = new URL(input instanceof Request ? input.url : input.toString());
    if (url.pathname.endsWith("/universities/top")) {
      return Response.json(
        Object.keys(verifiedCounts).map((code) => ({ id: `id-${code}`, code, name: `${code} 대학교`, region: "SEL" })),
      );
    }
    const code = url.pathname.split("/").pop() as string;
    const count = verifiedCounts[code];
    if (count === "missing") return new Response(null, { status: 404 });
    return Response.json({
      university: { name: `${code} 대학교`, code, region: "SEL" },
      stats: { verifiedCount: count },
    });
  }) as typeof fetch;
}

test("only universities at or above the verified threshold are listed", async () => {
  useFakeApi({ AAA: 58, BBB: 19, CCC: 20, DDD: "missing" });

  const listed = await getListedUniversities();

  assert.deepEqual(
    listed.map((university) => university.code),
    ["AAA", "CCC"],
  );
});

test("the listing is capped at the sitemap limit", async () => {
  const counts: Record<string, number> = {};
  for (let i = 0; i < 20; i += 1) counts[`U${String(i).padStart(2, "0")}`] = 30;
  useFakeApi(counts);

  const listed = await getListedUniversities();

  assert.equal(listed.length, 18);
});
