// app/api/payment/capture/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();
    const { paymentId, amount, businessId } = body;

    if (!paymentId || !amount || !businessId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get business Razorpay credentials
    const { data: business, error: bizError } = await supabase
      .from("businesses")
      .select("razorpay_key_id, razorpay_key_secret")
      .eq("id", businessId)
      .single();

    if (bizError || !business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    let keyId = business.razorpay_key_id;
    let keySecret = business.razorpay_key_secret;

    // Decrypt if needed
    if (keyId?.includes('.')) {
      try {
        keyId = Buffer.from(keyId.split('.')[0], 'base64').toString('utf-8');
      } catch (e) {}
    }
    if (keySecret?.includes('.')) {
      try {
        keySecret = Buffer.from(keySecret.split('.')[0], 'base64').toString('utf-8');
      } catch (e) {}
    }

    if (!keyId || !keySecret) {
      return NextResponse.json({ error: "Payment credentials not configured" }, { status: 400 });
    }

    // Capture the payment
    const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    
    const captureRes = await fetch(
      `https://api.razorpay.com/v1/payments/${paymentId}/capture`,
      {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount, // Amount in paise
          currency: 'INR',
        }),
      }
    );

    const captureData = await captureRes.json();

    if (!captureRes.ok) {
      console.error("Capture failed:", captureData);
      return NextResponse.json({ 
        error: captureData.error?.description || "Capture failed",
        details: captureData
      }, { status: 400 });
    }

    console.log("✅ Payment captured:", paymentId);

    return NextResponse.json({
      success: true,
      payment_id: paymentId,
      status: captureData.status,
    });

  } catch (error) {
    console.error("Capture error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}