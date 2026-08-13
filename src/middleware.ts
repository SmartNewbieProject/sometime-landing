import { NextResponse, type NextRequest } from "next/server";
import { getCanonicalRedirect } from "./seo-canary-policy";

const OFFICIAL_ORIGIN = "https://some-in-univ.com";
const INTERNAL_RENDER_HOST = "sometime-landing.vercel.app";
const INDEXABLE_HOSTS = new Set(["some-in-univ.com", "info.some-in-univ.com", "www.some-in-univ.com"]);

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase();
  const { pathname, search } = request.nextUrl;

  const canonicalRedirect = getCanonicalRedirect(host, pathname, search);
  if (canonicalRedirect) {
    return NextResponse.redirect(new URL(canonicalRedirect), 308);
  }

  // Preview / 임시 도메인은 공식 호스트로 통일 (SEO 중복 방지)
  if (host?.endsWith(".vercel.app") && host !== INTERNAL_RENDER_HOST) {
    return NextResponse.redirect(
      new URL(`${pathname}${search}` || "/", OFFICIAL_ORIGIN),
      308,
    );
  }

  // www → apex/info 정본 도메인으로 정규화
  if (host === "www.some-in-univ.com" || host === "www.info.some-in-univ.com") {
    return NextResponse.redirect(
      new URL(`${pathname}${search}` || "/", OFFICIAL_ORIGIN),
      308,
    );
  }

  if (!host || INDEXABLE_HOSTS.has(host)) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|txt)$).*)",
  ],
};
