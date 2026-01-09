// /app/api/payment/save-credentials/route.js
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { encrypt, maskKey } from '@/lib/encryption';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  console.log("═══════════════════════════════════════");
  console.log("🔐 SAVE CREDENTIALS API - Started");
  console.log("═══════════════════════════════════════");
  
  try {
    const body = await request.json();
    const { businessId, razorpay_key_id, razorpay_key_secret } = body;

    // Validation
    if (!businessId) {
      return NextResponse.json({ 
        success: false, 
        error: "Business ID required" 
      }, { status: 400 });
    }

    if (!razorpay_key_id || !razorpay_key_secret) {
      return NextResponse.json({ 
        success: false, 
        error: "Both Key ID and Key Secret are required" 
      }, { status: 400 });
    }

    // Validate key format
    if (!razorpay_key_id.startsWith('rzp_test_') && !razorpay_key_id.startsWith('rzp_live_')) {
      return NextResponse.json({ 
        success: false, 
        error: "Invalid Key ID format. Must start with rzp_test_ or rzp_live_" 
      }, { status: 400 });
    }

    // Validate secret length (Razorpay secrets are typically 20+ characters)
    if (razorpay_key_secret.length < 15) {
      return NextResponse.json({ 
        success: false, 
        error: "Key Secret appears too short. Please check and try again." 
      }, { status: 400 });
    }

    // Verify business exists
    const { data: business, error: bizError } = await supabase
      .from("businesses")
      .select("id, slug")
      .eq("id", businessId)
      .single();

    if (bizError || !business) {
      return NextResponse.json({ 
        success: false, 
        error: "Business not found" 
      }, { status: 404 });
    }

    console.log("✅ Business verified:", business.slug);

    // ═══════════════════════════════════════
    // ENCRYPT CREDENTIALS
    // ═══════════════════════════════════════
    
    console.log("🔐 Encrypting credentials...");
    
    const encryptedKeyId = encrypt(razorpay_key_id);
    const encryptedKeySecret = encrypt(razorpay_key_secret);
    
    console.log("✅ Credentials encrypted");
    console.log("🔑 Encrypted Key ID length:", encryptedKeyId?.length);
    console.log("🔑 Encrypted Secret length:", encryptedKeySecret?.length);

    // ═══════════════════════════════════════
    // SAVE TO DATABASE
    // ═══════════════════════════════════════
    
    const { error: updateError } = await supabase
      .from("businesses")
      .update({
        razorpay_key_id: encryptedKeyId,
        razorpay_key_secret: encryptedKeySecret,
        razorpay_enabled: true,
        payment_methods: { cod: true, online: true },
        updated_at: new Date().toISOString(),
      })
      .eq("id", businessId);

    if (updateError) {
      console.error("❌ Database error:", updateError);
      return NextResponse.json({ 
        success: false, 
        error: "Failed to save credentials" 
      }, { status: 500 });
    }

    console.log("✅ Credentials saved securely");
    console.log("═══════════════════════════════════════");

    return NextResponse.json({
      success: true,
      message: "Razorpay credentials saved securely",
      masked_key: maskKey(razorpay_key_id),
    });

  } catch (error) {
    console.error("❌ Save credentials error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Failed to save credentials"
    }, { status: 500 });
  }
}