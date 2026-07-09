import { NextResponse, type NextRequest } from "next/server";

const OFFICIAL_ORIGIN = "https://info.some-in-univ.com";
const INDEXABLE_HOSTS = new Set(["some-in-univ.com", "info.some-in-univ.com", "www.some-in-univ.com"]);

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase();
  const { pathname, search } = request.nextUrl;

  // Preview / 임시 도메인은 공식 호스트로 통일 (SEO 중복 방지)
  if (host?.endsWith(".vercel.app")) {
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
    const response = NextResponse.next();
    // 검색엔진이 정본 호스트를 빠르게 인지하도록 힌트
    if (host && host !== "info.some-in-univ.com") {
      response.headers.set(
        "Link",
        `<${OFFICIAL_ORIGIN}${pathname}>; rel="canonical"`,
      );
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|txt)$).*)",
  ],
};
