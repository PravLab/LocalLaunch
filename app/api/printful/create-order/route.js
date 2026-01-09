import { NextResponse } from "next/server";

const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;
const PRINTFUL_API_URL = "https://api.printful.com";

export async function POST(request) {
  try {
    const { orderData } = await request.json();

    console.log("📦 Creating Printful order...", {
      customer: orderData.name,
      product: orderData.variantId,
      quantity: orderData.quantity,
    });

    // ✅ Printful will calculate shipping automatically
    const printfulPayload = {
      recipient: {
        name: orderData.name,
        address1: orderData.address,
        city: orderData.city,
        state_code: orderData.state,
        country_code: "IN",
        zip: orderData.zipCode,
        phone: orderData.phone,
        email: orderData.email,
      },
      items: [
        {
          variant_id: parseInt(orderData.variantId),
          quantity: parseInt(orderData.quantity),
        },
      ],
      // ✅ No shipping cost sent - Printful calculates it
    };

    console.log("Sending to Printful:", JSON.stringify(printfulPayload, null, 2));

    const response = await fetch(`${PRINTFUL_API_URL}/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PRINTFUL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(printfulPayload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("❌ Printful API Error:", result);
      throw new Error(result.error?.message || "Printful order creation failed");
    }

    console.log("✅ Printful order created:", result.result.id);
    console.log("📊 Printful calculated costs:", result.result.costs);

    return NextResponse.json({
      success: true,
      orderId: result.result.id,
      printfulData: result.result,
      shippingCost: result.result.costs?.shipping, // Printful ki shipping cost
      totalCost: result.result.costs?.total, // Total with shipping
    });

  } catch (error) {
    console.error("❌ Printful Order Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}