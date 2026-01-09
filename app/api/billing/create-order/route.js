// app/api/billing/create-order/route.js
import Razorpay from "razorpay";
import crypto from "crypto";
import { cookies } from "next/headers";
import { SignJWT } from "jose";

// Rate limiting (use Redis in production)
const rateLimitStore = new Map();

function checkRateLimit(ip, maxRequests = 10, windowMs = 60000) {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, []);
  }
  
  const requests = rateLimitStore.get(ip).filter(time => time > windowStart);
  requests.push(now);
  rateLimitStore.set(ip, requests);
  
  return requests.length <= maxRequests;
}

export async function POST(req) {
  try {
    // Get client IP for rate limiting
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

    // Rate limit check
    if (!checkRateLimit(ip)) {
      return Response.json(
        { success: false, error: "Too many requests. Please wait a moment." },
        { status: 429 }
      );
    }

    // Validate environment variables
    const requiredEnvVars = [
      "NEXT_PUBLIC_RAZORPAY_KEY_ID",
      "RAZORPAY_KEY_SECRET",
      "JWT_SECRET"
    ];

    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        console.error(`Missing env var: ${envVar}`);
        return Response.json(
          { success: false, error: "Server configuration error." },
          { status: 500 }
        );
      }
    }

    // Create Razorpay order
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Generate unique order reference
    const orderRef = `LL_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;

    const order = await razorpay.orders.create({
      amount: 19900, // ₹199 in paise
      currency: "INR",
      receipt: orderRef,
      notes: {
        plan: "pro_monthly",
        created_at: new Date().toISOString(),
      },
    });

    // Store order reference in a secure cookie for verification
    const cookieStore = await cookies(); // ← ADD await here
    
    // Create a temporary token for this order session
    const orderToken = await new SignJWT({
      orderId: order.id,
      orderRef,
      amount: 19900,
      createdAt: Date.now(),
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("30m") // Order valid for 30 minutes
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));

    cookieStore.set({
      name: "pending_order",
      value: orderToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 30, // 30 minutes
    });

    return Response.json({
      success: true,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });

  } catch (error) {
    console.error("Create order error:", error);
    return Response.json(
      { success: false, error: "Unable to create order. Please try again." },
      { status: 500 }
    );
  }
}