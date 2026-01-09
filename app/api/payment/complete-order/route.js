import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase with Service Role
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Platform fee percentage
const PLATFORM_FEE_PERCENT = 5;

export async function POST(request) {
  console.log("═══════════════════════════════════════");
  console.log("🔐 COMPLETE ORDER API - Started");
  console.log("═══════════════════════════════════════");
  
  try {
    const body = await request.json();
    
    const {
      // Razorpay payment response
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      
      // Order metadata (from frontend)
      orderMetadata,
    } = body;

    console.log("📋 Payment Details:", {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      hasSignature: !!razorpay_signature,
    });

    // ═══════════════════════════════════════
    // VALIDATION
    // ═══════════════════════════════════════
    
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.log("❌ Missing payment details");
      return NextResponse.json({ 
        success: false, 
        error: "Missing payment verification details" 
      }, { status: 400 });
    }

    if (!orderMetadata || !orderMetadata.businessId) {
      console.log("❌ Missing order metadata");
      return NextResponse.json({ 
        success: false, 
        error: "Missing order information" 
      }, { status: 400 });
    }

    // ═══════════════════════════════════════
    // GET BUSINESS CREDENTIALS
    // ═══════════════════════════════════════
    
    console.log("🔍 Fetching business credentials...");
    
    const { data: business, error: bizError } = await supabase
      .from("businesses")
      .select("id, slug, business_name, razorpay_key_secret, orders, whatsapp, phone")
      .eq("id", orderMetadata.businessId)
      .single();

    if (bizError || !business) {
      console.log("❌ Business not found:", bizError);
      return NextResponse.json({ 
        success: false, 
        error: "Business not found" 
      }, { status: 404 });
    }

    console.log("✅ Business found:", business.business_name || business.slug);

    // ═══════════════════════════════════════
    // DECRYPT RAZORPAY SECRET
    // ═══════════════════════════════════════
    
    let keySecret = business.razorpay_key_secret;
    
    if (keySecret && keySecret.includes('.')) {
      try {
        keySecret = Buffer.from(keySecret.split('.')[0], 'base64').toString('utf-8');
      } catch (e) {
        console.log("⚠️ Secret decryption failed");
      }
    }

    if (!keySecret) {
      console.log("❌ Razorpay secret missing");
      return NextResponse.json({ 
        success: false, 
        error: "Payment verification failed - credentials missing" 
      }, { status: 400 });
    }

    // ═══════════════════════════════════════
    // VERIFY RAZORPAY SIGNATURE
    // ═══════════════════════════════════════
    
    console.log("🔐 Verifying payment signature...");
    
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (!isSignatureValid) {
      console.log("❌ Invalid signature!");
      console.log("Expected:", expectedSignature.substring(0, 20) + "...");
      console.log("Received:", razorpay_signature.substring(0, 20) + "...");
      
      // Update transaction as failed
      await supabase
        .from('platform_transactions')
        .update({ 
          status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('razorpay_order_id', razorpay_order_id);

      return NextResponse.json({ 
        success: false, 
        error: "Payment verification failed - invalid signature" 
      }, { status: 400 });
    }

    console.log("✅ Signature verified successfully!");

    // ═══════════════════════════════════════
    // CALCULATE PLATFORM FEE
    // ═══════════════════════════════════════
    
    const totalAmount = parseFloat(orderMetadata.productPrice) || 0;
    const platformFee = parseFloat((totalAmount * PLATFORM_FEE_PERCENT / 100).toFixed(2));
    const sellerAmount = parseFloat((totalAmount - platformFee).toFixed(2));

    console.log("💰 Final Payment Breakdown:");
    console.log(`   Total: ₹${totalAmount}`);
    console.log(`   Platform Fee (${PLATFORM_FEE_PERCENT}%): ₹${platformFee}`);
    console.log(`   Seller Gets: ₹${sellerAmount}`);

    // ═══════════════════════════════════════
    // UPDATE PLATFORM_TRANSACTIONS
    // ═══════════════════════════════════════
    
    console.log("💾 Updating transaction status...");
    
    const { data: updatedTxn, error: txnUpdateError } = await supabase
      .from('platform_transactions')
      .update({
        razorpay_payment_id: razorpay_payment_id,
        status: 'completed',
        commission_amount: platformFee,
        seller_amount: sellerAmount,
        customer_name: orderMetadata.customerName,
        customer_phone: orderMetadata.customerPhone,
        completed_at: new Date().toISOString(),
      })
      .eq('razorpay_order_id', razorpay_order_id)
      .select()
      .single();

    if (txnUpdateError) {
      console.log("⚠️ Transaction update warning:", txnUpdateError.message);
    } else {
      console.log("✅ Transaction updated:", updatedTxn?.id);
    }

    // ═══════════════════════════════════════
    // CREATE ORDER RECORD
    // ═══════════════════════════════════════
    
    console.log("📝 Creating order record...");
    
    const fullAddress = [
      orderMetadata.address,
      orderMetadata.landmark,
      orderMetadata.city,
      orderMetadata.state,
      orderMetadata.pincode
    ].filter(Boolean).join(', ');

    const orderRecord = {
      order_id: orderMetadata.internalOrderId || `ORD-${Date.now()}`,
      transaction_id: updatedTxn?.id || null,
      
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
        razorpay_order_id: razorpay_order_id,
        razorpay_payment_id: razorpay_payment_id,
        total_amount: totalAmount,
        platform_fee: platformFee,
        platform_fee_percent: PLATFORM_FEE_PERCENT,
        seller_amount: sellerAmount,
        paid_at: new Date().toISOString(),
      },
      
      delivery_status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // ═══════════════════════════════════════
    // SAVE ORDER TO BUSINESS
    // ═══════════════════════════════════════
    
    console.log("💾 Saving order to business...");
    
    const currentOrders = Array.isArray(business.orders) ? business.orders : [];
    const updatedOrders = [...currentOrders, orderRecord];

    const { error: orderSaveError } = await supabase
      .from("businesses")
      .update({ 
        orders: updatedOrders,
        updated_at: new Date().toISOString()
      })
      .eq("id", orderMetadata.businessId);

    if (orderSaveError) {
      console.log("❌ Order save error:", orderSaveError.message);
      
      // Payment was successful, but order save failed
      // Return partial success so customer knows payment went through
      return NextResponse.json({ 
        success: true,
        partialSuccess: true,
        message: "Payment successful but order save failed. Please contact support.",
        paymentId: razorpay_payment_id,
        order: orderRecord,
      }, { status: 200 });
    }

    console.log("✅ Order saved successfully!");

    // ═══════════════════════════════════════
    // RETURN SUCCESS RESPONSE
    // ═══════════════════════════════════════
    
    console.log("═══════════════════════════════════════");
    console.log("✅ COMPLETE ORDER API - Success");
    console.log("═══════════════════════════════════════");

    return NextResponse.json({
      success: true,
      message: "Payment verified and order placed successfully!",
      order: {
        orderId: orderRecord.order_id,
        transactionId: updatedTxn?.id,
        paymentId: razorpay_payment_id,
        totalAmount,
        platformFee,
        sellerAmount,
      },
      business: {
        name: business.business_name,
        whatsapp: business.whatsapp || business.phone,
      }
    });

  } catch (error) {
    console.log("═══════════════════════════════════════");
    console.log("❌ COMPLETE ORDER API - Error");
    console.log("Error:", error.message);
    console.log("Stack:", error.stack);
    console.log("═══════════════════════════════════════");
    
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Failed to complete order"
    }, { status: 500 });
  }
}