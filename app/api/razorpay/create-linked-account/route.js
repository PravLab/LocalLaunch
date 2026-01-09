// app/api/razorpay/create-linked-account/route.js
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,        // YOUR platform's key
  key_secret: process.env.RAZORPAY_KEY_SECRET, // YOUR platform's secret
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { businessId, ownerName, email, phone } = body;

    // Create a linked account (sub-merchant)
    const account = await razorpay.accounts.create({
      email: email,
      phone: phone,
      type: "route",
      legal_business_name: ownerName,
      business_type: "individual",
      contact_name: ownerName,
      profile: {
        category: "retail",
        subcategory: "others",
        addresses: {
          registered: {
            street1: "Address",
            city: "City",
            state: "State",
            postal_code: 123456,
            country: "IN",
          },
        },
      },
      legal_info: {
        pan: "XXXXXXXXXX", // Owner's PAN
      },
    });

    // Save account ID to your database
    // await supabase.from("businesses").update({ razorpay_account_id: account.id }).eq("id", businessId);

    return NextResponse.json({ success: true, accountId: account.id });
  } catch (error) {
    console.error("Create linked account error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}