import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { slug, email, password } = await req.json();

    // Step 1: Check if business exists with that slug
    const { data: business, error } = await supabase
      .from("businesses")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !business) {
      return NextResponse.json({ error: "Business not found." }, { status: 404 });
    }

    // Step 2: Prevent multiple admin registrations
    if (business.admin_password) {
      return NextResponse.json({
        error: "Admin already registered. Use 'Admin Access' on LocalLaunch to log in.",
      }, { status: 403 });
    }

    // ✅ Step 3: Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 4: Save admin credentials
    const { error: updateError } = await supabase
      .from("businesses")
      .update({
        admin_email: email,
        admin_password: hashedPassword
      })
      .eq("slug", slug);

    if (updateError) {
      return NextResponse.json({ error: "Failed to register admin." }, { status: 500 });
    }

    // ✅ Set cookies using async
    const cookieStore = await cookies();
    cookieStore.set("admin_email", email, {
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    cookieStore.set("slug", slug, {
  path: "/",
  maxAge: 60 * 60 * 24 * 365 * 10, // safe and long lasting
});


    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
