// File: app/api/get-slug-by-email/route.js

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return new Response(JSON.stringify({ error: "Email is required" }), { status: 400 });
  }

  const { data, error } = await supabase
    .from("businesses")
    .select("slug")
    .eq("email", email)
    .single();

  if (error || !data) {
    return new Response(JSON.stringify({ error: "Business not found" }), { status: 404 });
  }

  return new Response(JSON.stringify({ slug: data.slug }), { status: 200 });
}
