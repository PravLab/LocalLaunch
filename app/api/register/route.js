import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("📥 Incoming Request Body:", body);

    const {
      businessName = "",
      ownerName = "",
      phone = "",
      type = "",
      description = "",
      address = "",
      whatsapp = "",
      logo = "",
      products = [],
      enable_subdomain = false,
    } = body;

    if (
      !businessName.trim() ||
      !ownerName.trim() ||
      !phone.trim() ||
      !type.trim() ||
      !description.trim() ||
      !address.trim() ||
      !whatsapp.trim() ||
      !Array.isArray(products) ||
      products.length === 0
    ) {
      return Response.json(
        {
          error:
            "Please fill all required fields and add at least one product.",
        },
        { status: 400 }
      );
    }

    const slug = businessName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "")
      .slice(0, 50);
    console.log("🔧 Generated Slug:", slug);

    try {
      const { data: testConnection, error: connectionError } = await supabase
        .from("businesses")
        .select("count", { count: "exact", head: true });

      if (connectionError) {
        console.error("❌ Supabase connection error:", connectionError);
        return Response.json(
          { error: "Database connection failed. Please check configuration." },
          { status: 500 }
        );
      }
    } catch (connErr) {
      console.error("❌ Supabase connection test failed:", connErr);
      return Response.json(
        { error: "Database service unavailable. Please try again later." },
        { status: 503 }
      );
    }

    let existing;
    try {
      const { data, error: checkError } = await supabase
        .from("businesses")
        .select("slug")
        .eq("slug", slug)
        .maybeSingle();

      if (checkError) {
        console.error("❌ Slug check error:", checkError);
        return Response.json(
          { error: "Server error while checking business name." },
          { status: 500 }
        );
      }

      existing = data;
    } catch (checkErr) {
      console.error("❌ Unexpected slug check error:", checkErr);
      return Response.json(
        { error: "Database query failed. Please try again." },
        { status: 500 }
      );
    }

    if (existing) {
      return Response.json(
        { error: "Business name already exists. Try a different name." },
        { status: 409 }
      );
    }

    let inserted;
    try {
      const { data, error: insertError } = await supabase
        .from("businesses")
        .insert([
          {
            business_name: businessName.trim(),
            owner_name: ownerName.trim(),
            phone: phone.trim(),
            type: type.trim(),
            description: description.trim(),
            address: address.trim(),
            whatsapp: whatsapp.trim(),
            logo,
            slug,
            products,
            enable_subdomain,
          },
        ])
        .select("slug")
        .single();

      if (insertError) {
        console.error("❌ Insert error:", insertError);
        return Response.json(
          { error: "Failed to register business. Please try again." },
          { status: 500 }
        );
      }

      inserted = data;
    } catch (insertErr) {
      console.error("❌ Unexpected insert error:", insertErr);
      return Response.json(
        { error: "Database insertion failed. Please try again." },
        { status: 500 }
      );
    }

    // ✅ Create JWT token for preview access
    const token = jwt.sign(
      { slug: inserted.slug },
      process.env.JWT_SECRET,
      { expiresIn: "10m" } // expires in 10 minutes
    );

    console.log("✅ Registration successful with slug:", inserted.slug);
    return Response.json(
      { slug: inserted.slug, token },
      { status: 200 }
    );

  } catch (err) {
    console.error("❌ Unexpected server error:", err);
    return Response.json(
      { error: "Unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
