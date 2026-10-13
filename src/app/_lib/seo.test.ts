import assert from "node:assert/strict";
import test from "node:test";
import {
  articleJsonLd,
  buildPageMetadata,
  DEFAULT_OG_IMAGE,
  ORGANIZATION_ID,
  ORGANIZATION_SAME_AS,
  organizationJsonLd,
  softwareApplicationJsonLd,
  websiteJsonLd,
} from "./seo";
import { metadata as eventMetadata } from "../event/layout";
import { APP_STORE_URL, GOOGLE_PLAY_URL } from "./store-links";

function collectByType(value: unknown, type: string): Record<string, unknown>[] {
  if (Array.isArray(value)) return value.flatMap((item) => collectByType(item, type));
  if (value && typeof value === "object") {
    const node = value as Record<string, unknown>;
    const self = node["@type"] === type ? [node] : [];
    return [...self, ...Object.values(node).flatMap((item) => collectByType(item, type))];
  }
  return [];
}

test("seasonal campaign keeps its actual info-origin canonical, not the app event route", () => {
  assert.equal(eventMetadata.alternates?.canonical, "https://info.some-in-univ.com/event");
  assert.equal(eventMetadata.openGraph?.url, "https://info.some-in-univ.com/event");
});

test("default sharing image uses the public image namespace and its actual dimensions", () => {
  const metadata = buildPageMetadata({ title: "Example", description: "Description", path: "/faq" });
  assert.equal(new URL(DEFAULT_OG_IMAGE).pathname.startsWith("/images/"), true);
  assert.deepEqual(metadata.openGraph?.images, [{
    url: DEFAULT_OG_IMAGE,
    secureUrl: DEFAULT_OG_IMAGE,
    width: 1200,
    height: 630,
    alt: "Example",
    type: "image/jpeg",
  }]);
});

test("custom content images do not claim unverified dimensions", () => {
  const metadata = buildPageMetadata({ title: "Example", description: "Description", path: "/blog/example", image: "https://example.org/portrait.png" });
  assert.deepEqual(metadata.openGraph?.images, [{
    url: "https://example.org/portrait.png",
    secureUrl: "https://example.org/portrait.png",
    alt: "Example",
    type: "image/png",
  }]);
  assert.equal(metadata.other?.["og:image:width"], undefined);
});

test("empty descriptions have one nonempty consistent fallback", () => {
  const metadata = buildPageMetadata({ title: "Example", description: "  ", path: "/card-news/example" });
  assert.ok(metadata.description?.trim());
  assert.equal(metadata.description, metadata.openGraph?.description);
  assert.equal(metadata.description, metadata.twitter?.description);
});

test("Organization is declared once with a stable @id and unified sameAs", () => {
  const organization = organizationJsonLd();
  const website = websiteJsonLd();
  const article = articleJsonLd({
    title: "Example",
    description: "Description",
    path: "/blog/university-dating-app-guide",
  });
  const application = softwareApplicationJsonLd();
  const pageGraph = [organization, website, application, article];

  assert.equal(organization["@id"], ORGANIZATION_ID);
  assert.equal(ORGANIZATION_ID, "https://some-in-univ.com/#organization");
  assert.deepEqual(organization.sameAs, [
    APP_STORE_URL,
    GOOGLE_PLAY_URL,
    "https://www.instagram.com/sometime.in.univ/",
    "https://blog.naver.com/smartnewb",
    "https://youtube.com/@sometime_in_univ",
  ]);
  assert.ok(ORGANIZATION_SAME_AS.includes("https://youtube.com/@sometime_in_univ"));
  assert.deepEqual(website.publisher, { "@id": ORGANIZATION_ID });
  assert.deepEqual(article.publisher, { "@id": ORGANIZATION_ID });
  assert.deepEqual(application.publisher, { "@id": ORGANIZATION_ID });
  assert.equal(collectByType(pageGraph, "Organization").length, 1);
});
