// app/checkout/page.jsx
"use client";

import { useEffect, useState, useCallback } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Shield, 
  Check, 
  ArrowLeft, 
  CreditCard, 
  Lock,
  Zap,
  Percent,
  Clock,
  AlertCircle,
  Loader2,
  CheckCircle2
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const [scriptReady, setScriptReady] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [hasExistingBusiness, setHasExistingBusiness] = useState(false);

  // Check if user already has access or existing business
  useEffect(() => {
    const checkExistingAccess = async () => {
      try {
        // First check if they have unused payment access
        const res = await fetch("/api/billing/check-access", {
          method: "GET",
          credentials: "include",
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data.hasAccess) {
            // They have unused payment - redirect to register
            router.push("/register");
            return;
          }
        }

        // Check if they already have a business (already registered)
        const authCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('local_launch_auth='));
        
        if (authCookie) {
          setHasExistingBusiness(true);
        }
        
      } catch (e) {
        console.error("Access check error:", e);
      }
      setCheckingAccess(false);
    };

    checkExistingAccess();
  }, [router]);

  const startPayment = useCallback(async () => {
    if (!scriptReady || paying) return;
    
    setError("");
    setPaying(true);

    try {
      const res = await fetch("/api/billing/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Unable to start checkout.");
      }

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "LocalLaunch",
        description: "Pro Plan — ₹199/month",
        order_id: data.orderId,
        theme: { 
          color: "#4f46e5",
        },
        handler: async (response) => {
          try {
            const verifyRes = await fetch("/api/billing/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.error || "Payment verification failed.");
            }

            router.push("/register");
          } catch (verifyError) {
            setError(verifyError.message || "Payment verification failed.");
            setPaying(false);
          }
        },
        modal: {
          ondismiss: () => {
            setPaying(false);
          },
        },
      };

      const rz = new window.Razorpay(options);
      
      rz.on("payment.failed", (response) => {
        setError(response.error?.description || "Payment failed. Please try again.");
        setPaying(false);
      });

      rz.open();

    } catch (e) {
      setPaying(false);
      setError(e.message || "Something went wrong. Please try again.");
    }
  }, [scriptReady, paying, router]);

  if (checkingAccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // If user already has a business
  if (hasExistingBusiness) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 px-4 py-10">
        <div className="max-w-lg mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-2xl p-8"
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                You Already Have a Store!
              </h1>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                You've already created your online store with us.
              </p>

              <div className="space-y-3">
                <Link
                  href="/admin"
                  className="w-full px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  Go to Dashboard
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </Link>
                
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Want to create another store?{" "}
                  <Link href="/contact" className="text-indigo-600 hover:underline">
                    Contact us
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 px-4 py-10">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
      />

      <div className="max-w-lg mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Complete Your Purchase</h1>
                <p className="text-indigo-100 text-sm">Pro Plan — Full access to all features</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Order Summary */}
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                Order Summary
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between py-3 px-4 bg-gray-50 dark:bg-zinc-800 rounded-xl">
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Pro Plan</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Monthly subscription</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">₹199</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">/month</div>
                  </div>
                </div>
              </div>
            </div>

            {/* What You Get */}
            <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-900">
              <h3 className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 mb-3">
                What you'll get:
              </h3>
              <div className="space-y-2">
                {[
                  { icon: Zap, text: "Unlimited products & orders" },
                  { icon: Percent, text: "0% commission on sales" },
                  { icon: Clock, text: "2 minute store setup" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400">
                    <item.icon className="w-4 h-4" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
                </div>
              </motion.div>
            )}

            {/* Pay Button */}
            <motion.button
              whileHover={{ scale: scriptReady && !paying ? 1.01 : 1 }}
              whileTap={{ scale: scriptReady && !paying ? 0.99 : 1 }}
              onClick={startPayment}
              disabled={!scriptReady || paying}
              className="w-full px-6 py-4 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              {paying ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : !scriptReady ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Pay ₹199 Securely
                </>
              )}
            </motion.button>

            {/* Security */}
            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span>256-bit SSL</span>
              </div>
              <div className="h-3 w-px bg-gray-300 dark:bg-gray-600" />
              <div className="flex items-center gap-1">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Razorpay Secured</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}