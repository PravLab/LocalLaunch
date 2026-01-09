// /app/api/payment/create-order/route.js
import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { decrypt } from '@/lib/encryption';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  console.log("═══════════════════════════════════════");
  console.log("📦 CREATE ORDER API - Started");
  console.log("═══════════════════════════════════════");
  
  try {
    const body = await request.json();
    
    const {
      businessId, businessSlug, amount,
      customerName, customerPhone, customerEmail,
      productId, productName, productImage, productSlug,
      address, landmark, city, state, pincode,
    } = body;

    console.log("📋 Business:", businessId);
    console.log("📋 Amount:", amount);

    // Validation
    if (!businessId || !amount || amount <= 0) {
      return NextResponse.json({ 
        success: false, 
        error: "Invalid business or amount" 
      }, { status: 400 });
    }

    // Get business with encrypted credentials
    const { data: business, error: bizError } = await supabase
      .from("businesses")
      .select("id, slug, business_name, razorpay_key_id, razorpay_key_secret, razorpay_enabled")
      .eq("id", businessId)
      .single();

    if (bizError || !business) {
      return NextResponse.json({ 
        success: false, 
        error: "Business not found" 
      }, { status: 404 });
    }

    if (!business.razorpay_enabled) {
      return NextResponse.json({ 
        success: false, 
        error: "Online payment not enabled" 
      }, { status: 400 });
    }

    // ═══════════════════════════════════════
    // DECRYPT CREDENTIALS
    // ═══════════════════════════════════════
    
    console.log("🔐 Decrypting credentials...");
    
    const keyId = decrypt(business.razorpay_key_id);
    const keySecret = decrypt(business.razorpay_key_secret);

    console.log("🔑 Key ID decrypted:", keyId ? `${keyId.substring(0, 12)}...` : "FAILED");
    console.log("🔑 Secret decrypted:", keySecret ? "YES" : "FAILED");

    if (!keyId || !keySecret) {
      return NextResponse.json({ 
        success: false, 
        error: "Payment credentials not configured" 
      }, { status: 400 });
    }

    if (!keyId.startsWith('rzp_')) {
      return NextResponse.json({ 
        success: false, 
        error: "Invalid Razorpay configuration" 
      }, { status: 400 });
    }

    // ═══════════════════════════════════════
    // CREATE RAZORPAY ORDER
    // ═══════════════════════════════════════
    
    console.log("🔄 Creating Razorpay order...");
    
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const amountInPaise = Math.round(parseFloat(amount) * 100);

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
      notes: {
        business_id: businessId,
        product_name: productName || 'Product',
      }
    });

    console.log("✅ Razorpay order:", razorpayOrder.id);

    // ═══════════════════════════════════════
    // CALCULATE 5% COMMISSION
    // ═══════════════════════════════════════
    
    const totalAmount = parseFloat(amount);
    const commissionAmount = parseFloat((totalAmount * 5 / 100).toFixed(2));
    const sellerAmount = parseFloat((totalAmount - commissionAmount).toFixed(2));

    console.log("💰 Total:", totalAmount);
    console.log("💰 Platform Fee (5%):", commissionAmount);
    console.log("💰 Seller Gets:", sellerAmount);

    // ═══════════════════════════════════════
    // SAVE PENDING TRANSACTION
    // ═══════════════════════════════════════
    
    const internalOrderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    const { data: txn, error: txnError } = await supabase
      .from('platform_transactions')
      .insert({
        business_id: businessId,
        business_slug: businessSlug || business.slug,
        order_id: internalOrderId,
        razorpay_order_id: razorpayOrder.id,
        total_amount: totalAmount,
        commission_percent: 5,
        commission_amount: commissionAmount,
        seller_amount: sellerAmount,
        status: 'pending',
        customer_name: customerName,
        customer_phone: customerPhone,
        product_name: productName || 'Product',
      })
      .select()
      .single();

    if (txnError) {
      console.log("⚠️ Transaction save:", txnError.message);
    } else {
      console.log("✅ Transaction saved:", txn?.id);
    }

    // Order metadata
    const orderMetadata = {
      internalOrderId,
      businessId,
      businessSlug: businessSlug || business.slug,
      customerName, customerPhone, customerEmail,
      address, landmark, city, state, pincode,
      productId, productName, productImage, productSlug,
      productPrice: totalAmount,
    };

    console.log("═══════════════════════════════════════");
    console.log("✅ CREATE ORDER - Success");
    console.log("═══════════════════════════════════════");

    return NextResponse.json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      razorpayKeyId: keyId,  // Send decrypted key ID to frontend
      amount: amountInPaise,
      currency: 'INR',
      transactionId: txn?.id,
      internalOrderId,
      orderMetadata,
      breakdown: {
        total: totalAmount,
        platformFee: commissionAmount,
        sellerAmount,
      }
    });

  } catch (error) {
    console.error("❌ Create order error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}