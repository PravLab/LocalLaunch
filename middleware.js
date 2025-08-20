import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request) {
  const url = request.nextUrl;
  const pathname = url.pathname;
  const host = request.headers.get("host") || "";
  const token = request.cookies.get("admin_token")?.value || null;

  // ✅ Skip static and known safe paths
  const skipPaths = [
    "/favicon.ico",
    "/admin-auth-handler",
    "/register",
    "/register/preview",
    "/login",
    "/sw.js", // 👈 add this
  "/manifest.json", // 👈 add this
    "/api",
    "/_next",
    "/site",
    "/static"
  ];
  const isSkip = skipPaths.some((p) => pathname.startsWith(p));
  if (isSkip) return NextResponse.next();



  const resetProtected = pathname.match(/^\/site\/[^/]+\/admin\/reset-password$/);

  if (resetProtected) {
    const cookies = request.cookies;
    const resetToken = cookies.get("allow_reset");

    if (!resetToken || resetToken.value !== "yes") {
      // Block and redirect
      return NextResponse.redirect(new URL("/", request.url)); // or `/site/[slug]/admin`
    }
  }

  // ✅ Extract slug from subdomain or localhost ?preview param
  let slug = "";
  const isLocalhost = host.includes("localhost") || host.startsWith("127.0.0.1");

  if (isLocalhost) {
    slug = url.searchParams.get("preview") || "demo";
  } else {
    const mainDomains = ["locallaunch.in", "www.locallaunch.in"];
    if (mainDomains.includes(host)) {
      return NextResponse.next();
    }

    const parts = host.split(".");
    if (parts.length > 2) {
      slug = parts[0]; // subdomain
    }
  }

  if (!slug) return NextResponse.next();

  // ✅ Avoid rewriting if already correct
  if (
    pathname.startsWith(`/site/${slug}`) ||
    pathname.startsWith(`/${slug}`)
  ) {
    return NextResponse.next();
  }

  // ✅ Rewrite only if subdomain is detected and not in skip paths
  const newUrl = url.clone();
  newUrl.pathname = `/site/${slug}${pathname}`;
  return NextResponse.rewrite(newUrl);
}

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|site|api|static|sw\\.js|manifest\\.json|icon-|apple-touch-icon|android-chrome|browserconfig\\.xml|safari-pinned-tab\\.svg).*)",
    "/site/:slug/admin/reset-password",
  ],
};
