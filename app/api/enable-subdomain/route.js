// /app/api/enable-subdomain/route.js
import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { slug } = await req.json();

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const { error } = await supabase
    .from("businesses")
    .update({ enable_subdomain: true })
    .eq("slug", slug);

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
