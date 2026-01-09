import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const cleanSlug = slug.trim().toLowerCase();

    const { data: business, error } = await supabase
      .from("businesses")
      .select("admin_email, admin_password, admin_created, business_name")
      .eq("slug", cleanSlug)
      .single();

    if (error || !business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    // Check if admin is already registered
    const isAdminRegistered = !!(business.admin_email && business.admin_password);

    return NextResponse.json({
      isAdminRegistered,
      businessName: business.business_name
    });

  } catch (err) {
    console.error("Check admin status error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}