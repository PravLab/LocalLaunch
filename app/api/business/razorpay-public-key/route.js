// app/api/business/razorpay-public-key/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("businessId");

    if (!businessId) {
      return NextResponse.json({ error: "Business ID required" }, { status: 400 });
    }

    const { data: business, error } = await supabase
      .from("businesses")
      .select("razorpay_key_id, razorpay_enabled, payment_methods")
      .eq("id", businessId)
      .single();

    if (error || !business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    if (!business.razorpay_enabled || !business.razorpay_key_id) {
      return NextResponse.json({ 
        razorpay_key_id: null,
        online_enabled: false,
        cod_enabled: business.payment_methods?.cod ?? true,
      });
    }

    // ✅ Return key directly (assuming plain text storage now)
    let key = business.razorpay_key_id;
    
    // If it looks encrypted (contains a dot), try to decrypt
    if (key && key.includes('.')) {
      try {
        key = Buffer.from(key.split('.')[0], 'base64').toString('utf-8');
      } catch (e) {
        console.error("Decryption failed, using as-is");
      }
    }

    // Validate key format
    if (!key || !key.startsWith('rzp_')) {
      return NextResponse.json({ 
        razorpay_key_id: null,
        error: "Invalid key format",
      }, { status: 400 });
    }

    return NextResponse.json({
      razorpay_key_id: key,
      online_enabled: true,
      cod_enabled: business.payment_methods?.cod ?? true,
    });

  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}