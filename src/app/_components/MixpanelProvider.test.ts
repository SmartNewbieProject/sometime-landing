import assert from "node:assert/strict";
import test from "node:test";
import { buildMixpanelPageViewInput } from "./MixpanelProvider";

test("page view input follows route changes without exposing navigation objects", () => {
  const first = buildMixpanelPageViewInput(
    "/download",
    new URLSearchParams("utm_source=search&utm_campaign=launch"),
  );
  const second = buildMixpanelPageViewInput(
    "/safety",
    new URLSearchParams("utm_source=search&utm_campaign=launch"),
  );

  assert.deepEqual(first, {
    pathname: "/download",
    search: "utm_source=search&utm_campaign=launch",
  });
  assert.deepEqual(second, {
    pathname: "/safety",
    search: "utm_source=search&utm_campaign=launch",
  });
  assert.notDeepEqual(first, second);
  assert.deepEqual(buildMixpanelPageViewInput(null, null), { pathname: null, search: "" });
});
