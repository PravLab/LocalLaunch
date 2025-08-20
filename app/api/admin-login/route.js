import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(req) {
  const { email, password } = await req.json();

  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("admin_email", email)
    .single();

  if (!data || error) {
    return NextResponse.json({ message: "Email not found" }, { status: 404 });
  }

  if (!data.admin_password) {
    return NextResponse.json({ message: "Admin not registered" }, { status: 401 });
  }

  // ✅ Compare hashed password
  const isValid = await bcrypt.compare(password, data.admin_password);
  if (!isValid) {
    return NextResponse.json({ message: "Incorrect password" }, { status: 401 });
  }

  // ✅ Create JWT token
  const token = await new SignJWT({ slug: data.slug, email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("3d")
    .sign(JWT_SECRET);

  const res = NextResponse.json({ slug: data.slug });

  // ✅ Set secure cookies
  res.cookies.set("admin_token", token, {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
    maxAge: 60 * 60 * 24 * 3, // 3 days
  });

  res.cookies.set("admin_email", email, {
    path: "/",
    maxAge: 60 * 60 * 24 * 3,
  });

  return res;
}
