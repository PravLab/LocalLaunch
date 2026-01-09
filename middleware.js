  // middleware.js
  import { NextResponse } from "next/server";
  import { jwtVerify } from "jose";

  export async function middleware(request) {
    const url = request.nextUrl;
    const pathname = url.pathname;
    const host = request.headers.get("host") || "";

    // Skip static and API paths
    const skipPaths = [
      "/favicon.ico",
      "/sw.js",
      "/manifest.json",
      "/_next",
      "/api",
      "/static",
      "/checkout",
      "/login",
      "/",
    ];

    const isSkip = skipPaths.some((p) => 
      pathname === p || pathname.startsWith(p + "/") || pathname.startsWith("/_next")
    );
    
    if (isSkip) return NextResponse.next();

    // PROTECT /register route but allow preview and success paths
    if (pathname.startsWith("/register")) {
      // Allow preview paths without payment token
      if (pathname.startsWith("/register/preview/")) {
        return NextResponse.next();
      }
      
      // Allow success page without payment token
      if (pathname.startsWith("/register/success")) {
        return NextResponse.next();
      }

      // For /register main page, check payment token
      if (pathname === "/register" || pathname === "/register/") {
        const accessToken = request.cookies.get("registration_access")?.value;

        if (!accessToken) {
          // No payment token - redirect to checkout
          return NextResponse.redirect(new URL("/checkout", request.url));
        }

        // Verify the token
        try {
          const secret = new TextEncoder().encode(process.env.JWT_SECRET);
          const { payload } = await jwtVerify(accessToken, secret);

          // Check if token has required fields
          if (!payload.paymentId || !payload.orderId) {
            throw new Error("Invalid token payload");
          }

          // Token is valid - allow access to register
          const response = NextResponse.next();
          response.headers.set("x-payment-id", payload.paymentId);
          response.headers.set("x-order-id", payload.orderId);
          response.headers.set("x-order-ref", payload.orderRef || "");
          response.headers.set("x-plan", payload.plan || "pro_monthly");
          return response;

        } catch (error) {
          console.error("Token verification failed:", error.message);
          
          // Clear invalid cookie and redirect
          const response = NextResponse.redirect(new URL("/checkout", request.url));
          response.cookies.delete("registration_access");
          return response;
        }
      }
    }

    // Handle admin reset password protection
    const resetProtected = pathname.match(/^\/site\/[^/]+\/admin\/reset-password$/);
    if (resetProtected) {
      const resetToken = request.cookies.get("allow_reset");
      if (!resetToken || resetToken.value !== "yes") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    // Subdomain handling
    let slug = "";
    const isLocalhost = host.includes("localhost") || host.startsWith("127.0.0.1");

    if (isLocalhost) {
      const previewSlug = url.searchParams.get("preview");
      if (previewSlug) slug = previewSlug;
      else slug = "";
    } else {
      const mainDomains = ["locallaunch.in", "www.locallaunch.in"];
      if (mainDomains.includes(host)) return NextResponse.next();

      const parts = host.split(".");
      if (parts.length > 2) slug = parts[0];
    }

    if (!slug) return NextResponse.next();

    if (
      pathname.startsWith(`/site/${slug}`) ||
      pathname.startsWith(`/${slug}`)
    ) {
      return NextResponse.next();
    }

    const newUrl = url.clone();
    newUrl.pathname = `/site/${slug}${pathname}`;
    return NextResponse.rewrite(newUrl);
  }

  export const config = {
    matcher: [
      "/((?!_next|favicon.ico|site|api|static|sw\\.js|manifest\\.json|icon-|apple-touch-icon|android-chrome|browserconfig\\.xml|safari-pinned-tab\\.svg).*)",
      "/register/:path*",
      "/site/:slug/admin/reset-password",
    ],
  };