import assert from "node:assert/strict";
import test from "node:test";
import { parseAppStoreRating } from "./app-store-rating";

test("parses a verified App Store rating response", () => {
  assert.deepEqual(
    parseAppStoreRating({
      results: [
        {
          averageUserRating: 4.31278,
          userRatingCount: 227,
          version: "5.1.9",
          trackViewUrl: "https://apps.apple.com/kr/app/id6746120889",
        },
      ],
    }),
    {
      ratingValue: 4.31,
      ratingCount: 227,
      version: "5.1.9",
      storeUrl: "https://apps.apple.com/kr/app/id6746120889",
    },
  );
});

test("rejects incomplete or empty rating responses", () => {
  assert.equal(parseAppStoreRating({ results: [] }), null);
  assert.equal(parseAppStoreRating({ results: [{ averageUserRating: 4.3 }] }), null);
});
