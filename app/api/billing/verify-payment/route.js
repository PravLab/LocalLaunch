// app/api/billing/verify-payment/route.js
import crypto from "crypto";
import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";
import { createClient } from "@supabase/supabase-js";

function timingSafeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const pendingOrderToken = cookieStore.get("pending_order")?.value;

    // Validate pending order token exists
    if (!pendingOrderToken) {
      return Response.json(
        { success: false, error: "Invalid session. Please start again." },
        { status: 400 }
      );
    }

    // Verify the pending order token
    let orderData;
    try {
      const { payload } = await jwtVerify(
        pendingOrderToken,
        new TextEncoder().encode(process.env.JWT_SECRET)
      );
      orderData = payload;
    } catch (e) {
      return Response.json(
        { success: false, error: "Session expired. Please start again." },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await req.json().catch(() => null);
    
    if (!body) {
      return Response.json(
        { success: false, error: "Invalid request." },
        { status: 400 }
      );
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return Response.json(
        { success: false, error: "Missing payment information." },
        { status: 400 }
      );
    }

    // Verify order ID matches
    if (razorpay_order_id !== orderData.orderId) {
      console.error("Order ID mismatch");
      return Response.json(
        { success: false, error: "Payment verification failed." },
        { status: 400 }
      );
    }

    // Verify Razorpay signature
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    if (!timingSafeEqual(expectedSignature, razorpay_signature)) {
      console.error("Signature verification failed");
      return Response.json(
        { success: false, error: "Payment verification failed." },
        { status: 400 }
      );
    }

    // Store payment in database
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabaseAdmin = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );

      await supabaseAdmin.from("payments").insert({
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
        order_ref: orderData.orderRef,
        amount: orderData.amount,
        currency: "INR",
        status: "captured",
        plan: "pro_monthly",
        created_at: new Date().toISOString(),
      });
    }

    // Create registration access token (valid for 24 hours)
    const accessToken = await new SignJWT({
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      orderRef: orderData.orderRef,
      amount: orderData.amount,
      plan: "pro_monthly",
      paidAt: Date.now(),
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));

    // Set access cookie
    cookieStore.set({
      name: "registration_access",
      value: accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    // Clear pending order cookie
    cookieStore.delete("pending_order");

    return Response.json({ success: true });

  } catch (error) {
    console.error("Verify payment error:", error);
    return Response.json(
      { success: false, error: "Payment verification failed." },
      { status: 500 }
    );
  }
}