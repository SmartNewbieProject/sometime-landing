import { expect, test } from "bun:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { DownloadPreviewGallery } from "../src/app/download/DownloadPreviewGallery.tsx";
import { artworkNames, decodeShippedQr, qrPayload, rasterizeQr } from "./download-assets.mjs";

const publicFile = (path) => new URL(`../public${path}`, import.meta.url).pathname;

test("all six shipped portraits retain their source aspect ratio within an asset budget", async () => {
  for (const name of artworkNames) {
    const path = publicFile(`/images/download/${name}.webp`);
    expect(await new Bun.Image(path).metadata()).toEqual({ width: 990, height: 2151, format: "webp" });
    expect(Bun.file(path).size).toBeLessThan(150_000);
    expect(990 / 2151).toBe(1320 / 2868);
  }
});

test("the exact social asset is a compressed 1200x630 JPEG", async () => {
  const path = publicFile("/images/social/sometime-share-20260908.jpg");
  expect(await new Bun.Image(path).metadata()).toEqual({ width: 1200, height: 630, format: "jpeg" });
  expect(Bun.file(path).size).toBeLessThan(150_000);
});

test("Apple Vision decodes the shipped SVG modules to the direct apex download URL", async () => {
  expect(await decodeShippedQr()).toBe(qrPayload);
}, 30_000);

test("the QR rasterizer rejects empty artwork instead of supplying a fallback code", () => {
  expect(() => rasterizeQr('<svg viewBox="0 0 41 41"></svg>')).toThrow();
});

test("gallery controls resolve to every item and expose the shipped full-size images without JS", () => {
  const html = renderToStaticMarkup(createElement(DownloadPreviewGallery));
  const targets = [...html.matchAll(/<li[^>]* id="([^"]+)"/g)].map((match) => match[1]);
  const fragments = [...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
  expect(targets).toEqual(artworkNames.slice(1).map((name) => `download-preview-${name}`));
  expect(fragments).toEqual(targets);
  expect(html).toMatch(/role="region"[^>]*tabindex="0"/);
  expect([...html.matchAll(/<img /g)]).toHaveLength(5);
  for (const name of artworkNames.slice(1)) {
    expect(html).toContain(`href="/images/download/${name}.webp" target="_blank" rel="noopener noreferrer"`);
  }
});
