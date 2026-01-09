import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Your Razorpay Webhook Secret (set in Razorpay Dashboard)
const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;

export async function POST(request) {
  console.log("═══════════════════════════════════════");
  console.log("🔔 WEBHOOK - Received");
  console.log("═══════════════════════════════════════");
  
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    // Verify webhook signature (if secret is configured)
    if (WEBHOOK_SECRET && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', WEBHOOK_SECRET)
        .update(body)
        .digest('hex');

      if (signature !== expectedSignature) {
        console.log("❌ Invalid webhook signature");
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
      }
      console.log("✅ Webhook signature verified");
    }

    const event = JSON.parse(body);
    console.log("📋 Event type:", event.event);

    // Handle payment.captured event
    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;
      const paymentId = payment.id;
      const amount = payment.amount / 100; // Convert from paise

      console.log("💰 Payment captured:", { orderId, paymentId, amount });

      // Update transaction status
      const { error } = await supabase
        .from('platform_transactions')
        .update({
          razorpay_payment_id: paymentId,
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('razorpay_order_id', orderId);

      if (error) {
        console.log("⚠️ Transaction update failed:", error.message);
      } else {
        console.log("✅ Transaction updated via webhook");
      }
    }

    // Handle payment.failed event
    if (event.event === 'payment.failed') {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;

      console.log("❌ Payment failed:", orderId);

      await supabase
        .from('platform_transactions')
        .update({
          status: 'failed',
          updated_at: new Date().toISOString(),
        })
        .eq('razorpay_order_id', orderId);
    }

    // Handle refund events
    if (event.event === 'refund.created' || event.event === 'refund.processed') {
      const refund = event.payload.refund.entity;
      const paymentId = refund.payment_id;

      console.log("💸 Refund processed:", paymentId);

      await supabase
        .from('platform_transactions')
        .update({
          status: 'refunded',
          updated_at: new Date().toISOString(),
        })
        .eq('razorpay_payment_id', paymentId);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.log("❌ Webhook error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}