import { NextResponse } from "next/server";

const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;
const PRINTFUL_API_URL = "https://api.printful.com";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { success: false, error: "Product ID required" },
        { status: 400 }
      );
    }

    // Get product variants from Printful
    const response = await fetch(
      `${PRINTFUL_API_URL}/sync/products/${productId}`,
      {
        headers: {
          "Authorization": `Bearer ${PRINTFUL_API_KEY}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || "Failed to fetch variants");
    }

    return NextResponse.json({
      success: true,
      variants: result.result.sync_variants,
      product: result.result.sync_product,
    });

  } catch (error) {
    console.error("Printful Variants Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}