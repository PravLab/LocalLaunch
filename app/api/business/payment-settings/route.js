// app/api/business/payment-settings/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { jwtVerify } from "jose";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// Simple Base64 encryption for credentials
function encryptCredential(text) {
  if (!text) return null;
  const salt = process.env.ENCRYPTION_KEY?.slice(0, 8) || "llsecret";
  return Buffer.from(text).toString('base64') + "." + Buffer.from(salt).toString('base64');
}

// Verify admin
async function verifyAdmin() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

// POST - Save payment settings
export async function POST(request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { 
      businessId, 
      razorpay_key_id, 
      razorpay_key_secret,
      payment_methods 
    } = body;

    if (!businessId) {
      return NextResponse.json({ error: "Business ID required" }, { status: 400 });
    }

    // Verify ownership
    const { data: business, error: fetchError } = await supabase
      .from("businesses")
      .select("id, slug")
      .eq("id", businessId)
      .single();

    if (fetchError || !business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    if (business.slug !== admin.slug) {
      return NextResponse.json({ error: "Unauthorized - not your business" }, { status: 403 });
    }

    // Prepare update
    const updateData = {
      updated_at: new Date().toISOString(),
    };

    if (payment_methods) {
      updateData.payment_methods = payment_methods;
    }

    // Handle Razorpay credentials
    if (razorpay_key_id && razorpay_key_secret) {
      // Validate format
      if (!razorpay_key_id.startsWith('rzp_')) {
        return NextResponse.json({ 
          error: "Invalid Key ID format" 
        }, { status: 400 });
      }

      // Encrypt and store
      updateData.razorpay_key_id = encryptCredential(razorpay_key_id);
      updateData.razorpay_key_secret = encryptCredential(razorpay_key_secret);
      updateData.razorpay_enabled = true;
      updateData.payment_methods = {
        ...(payment_methods || { cod: true }),
        online: true,
      };
    }

    // Update database
    const { error: updateError } = await supabase
      .from("businesses")
      .update(updateData)
      .eq("id", businessId);

    if (updateError) {
      console.error("Update error:", updateError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Payment settings saved!",
    });

  } catch (error) {
    console.error("POST payment settings error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// GET - Get payment settings
export async function GET(request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("businessId");

    if (!businessId) {
      return NextResponse.json({ error: "Business ID required" }, { status: 400 });
    }

    const { data: business, error } = await supabase
      .from("businesses")
      .select("id, slug, razorpay_enabled, razorpay_key_id, payment_methods")
      .eq("id", businessId)
      .single();

    if (error || !business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    if (business.slug !== admin.slug) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      settings: {
        razorpay_enabled: business.razorpay_enabled || false,
        razorpay_key_masked: business.razorpay_key_id 
          ? `rzp_****${business.razorpay_key_id.slice(-8, -4) || ''}` 
          : null,
        payment_methods: business.payment_methods || { cod: true, online: false },
      }
    });

  } catch (error) {
    console.error("GET payment settings error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}