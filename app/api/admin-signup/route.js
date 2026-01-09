import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const body = await req.json();
    
    console.log("=== ADMIN SIGNUP DEBUG ===");
    console.log("Received body:", JSON.stringify(body, null, 2));
    
    // Extract all fields from body
    const { 
      business_name, 
      email, 
      password, 
      phone,
      slug,
      owner_name,
      type,
      description,
      address,
      whatsapp,
      logo
    } = body;
    
    // Validate required fields
    if (!business_name || typeof business_name !== 'string' || business_name.trim() === '') {
      return NextResponse.json({ error: "Business name is required." }, { status: 400 });
    }
    
    if (!email || typeof email !== 'string' || email.trim() === '') {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }
    
    // ✅ CHANGED: Password minimum from 8 to 6 characters to match frontend
    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    }

    // Generate slug from business name if not provided
    const cleanSlug = (slug || business_name)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')          // Replace spaces with hyphens
      .replace(/-+/g, '-')           // Replace multiple hyphens with single
      .replace(/^-|-$/g, '');        // Remove leading/trailing hyphens
    
    const cleanEmail = email.trim().toLowerCase();
    const cleanBusinessName = business_name.trim();
    const cleanPhone = phone?.trim() || null;

    console.log("Clean values:", { cleanSlug, cleanEmail, cleanBusinessName });

    // Step 1: Check if slug already exists
    const { data: existingBusiness, error: checkError } = await supabase
      .from("businesses")
      .select("id, slug, admin_password, admin_email")
      .eq("slug", cleanSlug)
      .maybeSingle();

    console.log("Existing business check:", { existingBusiness, checkError });

    if (checkError && checkError.code !== 'PGRST116') {
      console.error("Check error:", checkError);
      return NextResponse.json({ error: "Database error." }, { status: 500 });
    }

    // Step 2: If business exists, check if admin is already registered
    if (existingBusiness) {
      console.log("Business already exists:", existingBusiness);
      
      if (existingBusiness.admin_password && existingBusiness.admin_email) {
        // ✅ CHANGED: Return success with redirect instead of error
        return NextResponse.json({
          success: true,
          alreadyRegistered: true,
          slug: cleanSlug,
          redirectTo: `/site/${cleanSlug}/admin`,
          message: "Business already exists. Redirecting to dashboard..."
        }, { status: 200 }); // ✅ Changed from 403 to 200
      }
      
      // Business exists but no admin - update with admin credentials
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const { error: updateError } = await supabase
        .from("businesses")
        .update({
          admin_email: cleanEmail,
          admin_password: hashedPassword,
          admin_created: true,
          admin_created_at: new Date().toISOString(),
          phone: cleanPhone || existingBusiness.phone,
        })
        .eq("slug", cleanSlug);

      if (updateError) {
        console.error("Update error:", updateError);
        return NextResponse.json({ error: "Failed to register admin." }, { status: 500 });
      }

      // Set cookies
      const cookieStore = await cookies();
      cookieStore.set("admin_email", cleanEmail, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
      cookieStore.set("slug", cleanSlug, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });

      console.log("=== ADMIN ACCOUNT UPDATED - REDIRECTING TO DASHBOARD ===");

      return NextResponse.json({ 
        success: true,
        slug: cleanSlug,
        redirectTo: `/site/${cleanSlug}/admin`,
        message: "Admin account created successfully"
      });
    }

    // Step 3: Business doesn't exist - CREATE NEW BUSINESS
    console.log("Creating new business...");
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const newBusiness = {
      business_name: cleanBusinessName,
      slug: cleanSlug,
      admin_email: cleanEmail,
      admin_password: hashedPassword,
      phone: cleanPhone,
      email: cleanEmail,
      owner_name: owner_name?.trim() || null,
      type: type?.trim() || 'general',
      description: description?.trim() || null,
      address: address?.trim() || null,
      whatsapp: whatsapp?.trim() || cleanPhone,
      logo: logo || null,
      admin_created: true,
      admin_created_at: new Date().toISOString(),
      is_active: true,
      is_verified: false,
      enable_subdomain: true,
      template_id: 1,
      products: [],
      orders: [],
      payment_methods: { cod: true, online: false },
      charges_gst: false,
      gst_rate: 0,
      chatbot_enabled: false,
      has_paid: false,
      razorpay_enabled: false,
    };

    console.log("New business data:", newBusiness);

    const { data: createdBusiness, error: insertError } = await supabase
      .from("businesses")
      .insert(newBusiness)
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      
      // Handle duplicate slug error
      if (insertError.code === '23505') {
        return NextResponse.json({ 
          error: "This business name is already taken. Please choose a different name.",
          code: "DUPLICATE_SLUG"
        }, { status: 409 });
      }
      
      return NextResponse.json({ error: "Failed to create business." }, { status: 500 });
    }

    console.log("Business created successfully:", createdBusiness);

    // Step 4: Set cookies
    const cookieStore = await cookies();
    
    cookieStore.set("admin_email", cleanEmail, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    cookieStore.set("slug", cleanSlug, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    console.log("=== ADMIN SIGNUP SUCCESS - REDIRECTING TO DASHBOARD ===");
    console.log("Dashboard URL:", `/site/${cleanSlug}/admin`);

    // ✅ IMPORTANT: Return the redirect URL clearly
    return NextResponse.json({ 
      success: true,
      slug: cleanSlug,
      businessId: createdBusiness.id,
      redirectTo: `/site/${cleanSlug}/admin`, // ✅ Added explicit redirect URL
      message: "Business and admin account created successfully"
    });

  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}