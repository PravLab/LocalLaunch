// components/PricingSection.tsx
"use client";

import { motion } from "framer-motion";
import { 
  Check, 
  Sparkles, 
  ArrowRight, 
  Zap,
  Shield,
  Users,
  Percent,
  BadgeCheck,
  Clock,
  TrendingUp,
  Infinity,
  CreditCard,
  Lock
} from "lucide-react";
import Link from "next/link";

export default function PricingSection() {
  const allFeatures = [
    "Unlimited products & categories",
    "Order management system",
    "QR code & shareable link",
    "WhatsApp notifications",
    "Payment tracking",
    "Customer analytics",
    "Custom banners",
    "Google Maps integration",
    "Social media links",
    "Email support",
  ];

  return (
    <section id="pricing" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-gray-50 to-white dark:from-[#09090b] dark:via-[#0f0f11] dark:to-[#09090b] relative overflow-hidden">
      
      {/* Subtle Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-200/30 dark:bg-indigo-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200/30 dark:bg-purple-900/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 text-sm font-semibold mb-6"
          >
            <Sparkles className="w-4 h-4" />
            Simple & Transparent
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            One Plan.{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              Everything Included.
            </span>
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            No tiers, no confusion. Get all features at one simple price.
          </p>
        </motion.div>

        {/* Main Pricing Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl shadow-gray-200/60 dark:shadow-black/40 overflow-hidden border border-gray-200 dark:border-gray-800">
            
            {/* Pricing Content */}
            <div className="p-8 sm:p-10">
              
              {/* Price Display */}
              <div className="text-center mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-baseline justify-center gap-1 mb-3">
                  <span className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white">₹199</span>
                  <span className="text-xl text-gray-500 dark:text-gray-400">/month</span>
                </div>
                
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Billed monthly • Cancel anytime
                </p>

                {/* Key Highlights */}
                <div className="flex flex-wrap justify-center gap-3 mt-6">
                  {[
                    { icon: Percent, text: "0% Commission" },
                    { icon: Infinity, text: "Unlimited Products" },
                    { icon: Zap, text: "Instant Setup" },
                  ].map((item, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Button - Goes to Checkout */}
              <div className="mb-8">
                <Link href="/checkout" className="block">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-8 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 group transition-all"
                  >
                    <CreditCard className="w-5 h-5" />
                    Subscribe Now — ₹199/month
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
                
                <div className="flex items-center justify-center gap-2 mt-3 text-xs text-gray-500 dark:text-gray-400">
                  <Lock className="w-3 h-3" />
                  <span>Secure payment via Razorpay</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center gap-4 mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
                {[
                  { icon: Clock, text: "2 min setup after payment" },
                  { icon: Shield, text: "Bank-grade security" },
                  { icon: Users, text: "Email support" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                    <item.icon className="w-4 h-4 text-gray-400" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>

              {/* All Features */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-5 text-center">
                  Everything you get
                </h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  {allFeatures.map((feature, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.03 }}
                      className="flex items-center gap-3 py-2"
                    >
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                        <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Savings Banner */}
            <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-indigo-950/30 p-5 border-t border-indigo-100 dark:border-indigo-900/50">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
                <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <p className="text-gray-700 dark:text-gray-300">
                  Save up to{" "}
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 text-lg">₹15,600/year</span>
                  {" "}compared to Shopify
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Trust Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {[
              { icon: Shield, text: "Secure Payments" },
              { icon: BadgeCheck, text: "No Hidden Fees" },
              { icon: Users, text: "Cancel Anytime" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <item.icon className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
} 