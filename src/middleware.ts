import { NextResponse, type NextRequest } from "next/server";

const OFFICIAL_ORIGIN = "https://info.some-in-univ.com";
const INDEXABLE_HOSTS = new Set(["some-in-univ.com", "info.some-in-univ.com"]);

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0];

  if (!host || INDEXABLE_HOSTS.has(host)) {
    return NextResponse.next();
  }

  if (host.endsWith(".vercel.app")) {
    return NextResponse.redirect(new URL(request.nextUrl.pathname || "/", OFFICIAL_ORIGIN), 308);
  }

  return NextResponse.next();
}
