// /app/api/payment/verify/route.js
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { decrypt } from '@/lib/encryption';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  console.log("═══════════════════════════════════════");
  console.log("🔐 VERIFY PAYMENT API - Started");
  console.log("═══════════════════════════════════════");
  
  try {
    const body = await request.json();
    
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderMetadata,
    } = body;

    console.log("📋 Order ID:", razorpay_order_id);
    console.log("📋 Payment ID:", razorpay_payment_id);

    // Validation
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ 
        success: false, 
        error: "Missing payment details" 
      }, { status: 400 });
    }

    // Get businessId
    let businessId = orderMetadata?.businessId;
    
    if (!businessId) {
      const { data: txn } = await supabase
        .from('platform_transactions')
        .select('business_id')
        .eq('razorpay_order_id', razorpay_order_id)
        .single();
      
      businessId = txn?.business_id;
    }

    if (!businessId) {
      return NextResponse.json({ 
        success: false, 
        error: "Business not found" 
      }, { status: 400 });
    }

    // Get business with encrypted credentials
    const { data: business, error: bizError } = await supabase
      .from("businesses")
      .select("id, slug, business_name, razorpay_key_secret, orders, whatsapp, phone")
      .eq("id", businessId)
      .single();

    if (bizError || !business) {
      return NextResponse.json({ 
        success: false, 
        error: "Business not found" 
      }, { status: 404 });
    }

    console.log("✅ Business:", business.slug);

    // ═══════════════════════════════════════
    // DECRYPT SECRET
    // ═══════════════════════════════════════
    
    console.log("🔐 Decrypting secret...");
    
    const keySecret = decrypt(business.razorpay_key_secret);

    console.log("🔑 Secret decrypted:", keySecret ? "YES" : "FAILED");
    console.log("🔑 Secret length:", keySecret?.length);

    if (!keySecret) {
      return NextResponse.json({ 
        success: false, 
        error: "Payment credentials not configured" 
      }, { status: 400 });
    }

    // ═══════════════════════════════════════
    // VERIFY SIGNATURE
    // ═══════════════════════════════════════
    
    const signatureString = `${razorpay_order_id}|${razorpay_payment_id}`;
    
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(signatureString)
      .digest('hex');

    console.log("🔐 Expected:", expectedSignature.substring(0, 15) + "...");
    console.log("🔐 Received:", razorpay_signature.substring(0, 15) + "...");
    console.log("🔐 Match:", expectedSignature === razorpay_signature);

    if (expectedSignature !== razorpay_signature) {
      console.log("❌ Signature mismatch!");
      
      await supabase
        .from('platform_transactions')
        .update({ status: 'failed' })
        .eq('razorpay_order_id', razorpay_order_id);

      return NextResponse.json({ 
        success: false, 
        error: "Payment verification failed" 
      }, { status: 400 });
    }

    console.log("✅ Signature verified!");

    // ═══════════════════════════════════════
    // CALCULATE 5% COMMISSION
    // ═══════════════════════════════════════
    
    const totalAmount = parseFloat(orderMetadata?.productPrice) || 0;
    const commissionAmount = parseFloat((totalAmount * 5 / 100).toFixed(2));
    const sellerAmount = parseFloat((totalAmount - commissionAmount).toFixed(2));

    console.log("💰 Total:", totalAmount);
    console.log("💰 Platform Fee (5%):", commissionAmount);
    console.log("💰 Seller Gets:", sellerAmount);

    // ═══════════════════════════════════════
    // UPDATE TRANSACTION
    // ═══════════════════════════════════════
    
    const { data: updatedTxn, error: txnError } = await supabase
      .from('platform_transactions')
      .update({
        razorpay_payment_id,
        status: 'completed',
        commission_amount: commissionAmount,
        seller_amount: sellerAmount,
        customer_name: orderMetadata?.customerName,
        customer_phone: orderMetadata?.customerPhone,
        completed_at: new Date().toISOString(),
      })
      .eq('razorpay_order_id', razorpay_order_id)
      .select()
      .single();

    if (txnError) {
      console.log("⚠️ Transaction update:", txnError.message);
    } else {
      console.log("✅ Transaction updated:", updatedTxn?.id);
    }

    // ═══════════════════════════════════════
    // SAVE ORDER TO BUSINESS
    // ═══════════════════════════════════════
    
    if (orderMetadata) {
      const fullAddress = [
        orderMetadata.address,
        orderMetadata.landmark,
        orderMetadata.city,
        orderMetadata.state,
        orderMetadata.pincode
      ].filter(Boolean).join(', ');

      const orderRecord = {
        order_id: orderMetadata.internalOrderId || `ORD-${Date.now()}`,
        transaction_id: updatedTxn?.id,
        customer: {
          name: orderMetadata.customerName || '',
          phone: orderMetadata.customerPhone || '',
          email: orderMetadata.customerEmail || null,
        },
        shipping_address: {
          address: orderMetadata.address || '',
          landmark: orderMetadata.landmark || null,
          city: orderMetadata.city || '',
          state: orderMetadata.state || '',
          pincode: orderMetadata.pincode || '',
          full: fullAddress,
        },
        product: {
          id: orderMetadata.productId || null,
          name: orderMetadata.productName || 'Product',
          price: totalAmount,
          image: orderMetadata.productImage || null,
          slug: orderMetadata.productSlug || null,
        },
        payment: {
          method: 'razorpay',
          status: 'completed',
          razorpay_order_id,
          razorpay_payment_id,
          total_amount: totalAmount,
          platform_fee: commissionAmount,
          seller_amount: sellerAmount,
          paid_at: new Date().toISOString(),
        },
        delivery_status: 'pending',
        created_at: new Date().toISOString(),
      };

      const currentOrders = business.orders || [];
      const { error: orderError } = await supabase
        .from("businesses")
        .update({ orders: [...currentOrders, orderRecord] })
        .eq("id", businessId);

      if (orderError) {
        console.log("⚠️ Order save:", orderError.message);
      } else {
        console.log("✅ Order saved!");
      }
    }

    console.log("═══════════════════════════════════════");
    console.log("✅ VERIFY API - Complete");
    console.log("═══════════════════════════════════════");

    return NextResponse.json({
      success: true,
      message: "Payment verified",
      transaction: {
        id: updatedTxn?.id,
        total_amount: totalAmount,
        commission_amount: commissionAmount,
        seller_amount: sellerAmount,
      },
      business: {
        whatsapp: business.whatsapp || business.phone,
      }
    });

  } catch (error) {
    console.error("❌ Verify error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}