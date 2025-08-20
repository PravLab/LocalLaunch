import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("businesses")
    .select("slug")
    .eq("admin_email", email)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "You need to create your site to access the admin panel." },
      { status: 401 }
    );
  }

  // Create encrypted token
  const token = jwt.sign(
    { slug: data.slug, email },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  return NextResponse.json({ token, slug: data.slug });
}
