#!/usr/bin/env node

const DEFAULT_BASE = process.env.SEO_SMOKE_BASE_URL ?? "https://info.some-in-univ.com";
const DEFAULT_VALID_UNIVERSITY_CODE =
  process.env.SEO_SMOKE_VALID_UNIVERSITY_CODE ?? "DJU";
const DEFAULT_INVALID_UNIVERSITY_CODE =
  process.env.SEO_SMOKE_INVALID_UNIVERSITY_CODE ?? "__INVALID_SEO_CODE__";
const DEFAULT_TIMEOUT_MS = Number(process.env.SEO_SMOKE_TIMEOUT_MS ?? 8000);

function parseArgs(argv) {
  const options = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) continue;

    const [rawKey, inlineValue] = token.slice(2).split("=", 2);
    if (inlineValue !== undefined) {
      options[rawKey] = inlineValue;
      continue;
    }

    const nextValue = argv[index + 1];
    if (!nextValue || nextValue.startsWith("--")) {
      options[rawKey] = "true";
      continue;
    }

    options[rawKey] = nextValue;
    index += 1;
  }

  return options;
}

function normalizeOrigin(value) {
  const url = new URL(value);
  return url.origin;
}

function normalizeComparableUrl(value, fallbackBase) {
  const url = new URL(value, fallbackBase);
  const pathname = url.pathname.replace(/\/+$/, "") || "/";
  return `${url.origin}${pathname}`;
}

function decodeXmlText(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function ensure(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function fetchWithChecks(url, timeoutMs, redirect = "manual") {
  const response = await fetch(url, {
    redirect,
    headers: {
      "user-agent": "seo-public-smoke/1.0",
      accept: "text/html,application/xhtml+xml,application/xml,text/xml;q=0.9,*/*;q=0.8",
    },
    signal: AbortSignal.timeout(timeoutMs),
  });

  const text = await response.text();

  return {
    response,
    text,
    finalUrl: response.url,
    contentType: response.headers.get("content-type") ?? "",
  };
}

function extractCanonicalHref(html, baseUrl) {
  const linkTags = html.match(/<link\b[^>]*>/gi) ?? [];

  for (const tag of linkTags) {
    if (!/rel=["']canonical["']/i.test(tag)) continue;
    const hrefMatch = tag.match(/href=["']([^"']+)["']/i);
    if (!hrefMatch) continue;
    return new URL(decodeXmlText(hrefMatch[1]), baseUrl).toString();
  }

  return null;
}

async function checkRobots({ robotsUrl, expectedSitemapUrl, timeoutMs }) {
  const { response, text } = await fetchWithChecks(robotsUrl, timeoutMs);
  ensure(response.ok, `robots fetch failed: ${response.status} ${robotsUrl}`);

  const normalizedText = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  ensure(
    normalizedText.includes(`Sitemap: ${expectedSitemapUrl}`),
    `robots.txt must advertise canonical sitemap ${expectedSitemapUrl}`,
  );
}

async function checkSitemap({ sitemapUrl, timeoutMs }) {
  const { response, text, contentType } = await fetchWithChecks(sitemapUrl, timeoutMs);
  ensure(response.ok, `sitemap fetch failed: ${response.status} ${sitemapUrl}`);
  ensure(
    contentType.includes("xml") || /<urlset\b|<sitemapindex\b/i.test(text),
    `sitemap response is not XML: ${contentType || "unknown content-type"}`,
  );

  const locs = [...text.matchAll(/<loc>(.*?)<\/loc>/gsi)].map((match) => decodeXmlText(match[1].trim()));
  ensure(locs.length > 0, "sitemap does not contain any <loc> entries");

  for (const loc of locs) {
    const parsed = new URL(loc);
    ensure(!parsed.pathname.startsWith("/jp/"), `sitemap must not include JP route: ${loc}`);
    ensure(parsed.pathname !== "/jp", `sitemap must not include JP route: ${loc}`);
    ensure(
      !parsed.pathname.startsWith("/university/"),
      `sitemap must not include university route: ${loc}`,
    );
    ensure(parsed.pathname !== "/event", `sitemap must not include /event: ${loc}`);
  }

  return locs;
}

async function checkPage(url, timeoutMs) {
  const { response, text, finalUrl, contentType } = await fetchWithChecks(url, timeoutMs);
  ensure(response.status === 200, `page must return direct 200: ${response.status} ${url}`);
  ensure(
    contentType.includes("text/html") || contentType.includes("application/xhtml+xml"),
    `page is not HTML: ${url} (${contentType || "unknown content-type"})`,
  );

  const canonicalHref = extractCanonicalHref(text, finalUrl);
  ensure(canonicalHref, `missing canonical link: ${finalUrl}`);

  const normalizedFinalUrl = normalizeComparableUrl(finalUrl);
  const normalizedCanonicalUrl = normalizeComparableUrl(canonicalHref, finalUrl);

  ensure(
    normalizedFinalUrl === normalizedCanonicalUrl,
    `canonical mismatch: expected ${normalizedFinalUrl}, got ${normalizedCanonicalUrl}`,
  );
}

async function checkUniversityRoutes({ base, validCode, invalidCode, timeoutMs }) {
  const validUrl = `${base}/university/${encodeURIComponent(validCode)}`;
  const invalidUrl = `${base}/university/${encodeURIComponent(invalidCode)}`;

  const validResponse = await fetch(validUrl, {
    redirect: "manual",
    headers: { "user-agent": "seo-public-smoke/1.0" },
    signal: AbortSignal.timeout(timeoutMs),
  });
  ensure(validResponse.status === 200, `valid university must return 200: ${validUrl}`);
  const validHtml = await validResponse.text();
  const validCanonical = extractCanonicalHref(validHtml, validUrl);
  ensure(validCanonical, `valid university missing canonical: ${validUrl}`);
  ensure(
    normalizeComparableUrl(validCanonical, validUrl) === normalizeComparableUrl(validUrl, validUrl),
    `valid university must self-canonicalize: ${validUrl} (got ${validCanonical})`,
  );

  const invalidResponse = await fetch(invalidUrl, {
    redirect: "manual",
    headers: { "user-agent": "seo-public-smoke/1.0" },
    signal: AbortSignal.timeout(timeoutMs),
  });
  ensure(
    invalidResponse.status === 404,
    `invalid university must return 404: ${invalidUrl} (got ${invalidResponse.status})`,
  );
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const base = normalizeOrigin(args.base ?? DEFAULT_BASE);
  const robotsBase = normalizeOrigin(args["robots-base"] ?? base);
  const sitemapUrl = args["sitemap-url"] ?? `${base}/sitemap.xml`;
  const timeoutMs = Number(args["timeout-ms"] ?? DEFAULT_TIMEOUT_MS);
  const validUniversityCode =
    args["valid-university-code"] ?? DEFAULT_VALID_UNIVERSITY_CODE;
  const invalidUniversityCode =
    args["invalid-university-code"] ?? DEFAULT_INVALID_UNIVERSITY_CODE;

  ensure(Number.isFinite(timeoutMs) && timeoutMs > 0, `invalid timeout-ms: ${timeoutMs}`);

  console.log(`SEO smoke start: base=${base}`);
  await checkRobots({
    robotsUrl: `${robotsBase}/robots.txt`,
    expectedSitemapUrl: `${base}/sitemap.xml`,
    timeoutMs,
  });
  console.log("✓ robots.txt advertises canonical sitemap");

  const locs = await checkSitemap({ sitemapUrl, timeoutMs });
  console.log(`✓ sitemap XML OK (${locs.length} urls)`);

  for (const loc of locs) {
    await checkPage(loc, timeoutMs);
  }
  console.log("✓ sitemap URLs return 200 and self-canonicalize");

  await checkUniversityRoutes({
    base,
    validCode: validUniversityCode,
    invalidCode: invalidUniversityCode,
    timeoutMs,
  });
  console.log("✓ representative university routes behave as expected");

  console.log("SEO smoke passed");
}

main().catch((error) => {
  console.error(`SEO smoke failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
