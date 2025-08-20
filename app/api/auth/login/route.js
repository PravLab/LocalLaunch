// /app/api/auth/login/route.js
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { email, password } = await req.json();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // fetch slug from `businesses` table using email
  const { data: business } = await supabase
    .from("businesses")
    .select("slug")
    .eq("email", email)
    .single();

  if (!business) {
    return NextResponse.json(
      { error: "Business not found for this email." },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, redirect: `/site/${business.slug}/admin` });
}
