// /app/api/logout-admin/route.js
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Clear admin cookies
  response.cookies.set("admin_email", "", {
    path: "/",
    maxAge: 0,
  });



  response.cookies.set("admin_token", "", {
    path: "/",
    maxAge: 0,
  });

  return response;
}
