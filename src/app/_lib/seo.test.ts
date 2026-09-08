import assert from "node:assert/strict";
import test from "node:test";
import { buildPageMetadata, DEFAULT_OG_IMAGE } from "./seo";
import { metadata as eventMetadata } from "../event/layout";

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
