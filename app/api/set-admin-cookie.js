// /app/api/set-admin-cookie/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  const { email, slug } = await req.json();

  const response = NextResponse.json({ success: true });

  // Set cookies
  response.cookies.set("admin_email", email, {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
    maxAge: 60 * 60 * 24 * 3, // 7 days
  });

  response.cookies.set("slug", slug, {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
    maxAge: 60 * 60 * 24 * 3,
  });

  return response;
}
