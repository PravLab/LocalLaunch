// components/HeroSection.tsx
"use client";

import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Sparkles, 
  Clock, 
  CheckCircle2,
  Shield,
  Play,
  Zap,
  Store,
  CreditCard,
  BarChart3
} from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-[#09090b]">
      
      {/* ===== GRADIENT BACKGROUND ===== */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(0,0,0,0))]" />
      
      {/* ===== GRID BACKGROUND ===== */}
      <div 
        className="absolute inset-0 opacity-40 dark:opacity-20"
        style={{
          backgroundImage: `linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 110%)'
        }}
      />

      {/* ===== MAIN CONTENT ===== */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 sm:py-24 lg:py-28">
        
        {/* ===== BADGE ===== */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 text-sm font-medium mb-8"
        >
          <Store className="w-4 h-4" />
          <span>Built for Local Businesses in India</span>
        </motion.div>

        {/* ===== MAIN HEADING ===== */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-[1.08] tracking-tight mb-6"
        >
          <span className="block">Apni Local Dukaan Ko</span>
          <span className="relative inline-block mt-2">
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Online Lao
            </span>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="absolute -bottom-2 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 rounded-full origin-left"
            />
          </span>
        </motion.h1>

        {/* ===== SUBHEADING ===== */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed font-medium"
        >
          2 minute mein professional online store banao.{" "}
          <span className="text-gray-900 dark:text-white">
            Orders manage karo, payments track karo
          </span>{" "}
          — sab kuch ek powerful dashboard se.
        </motion.p>

        {/* ===== SIMPLE PRICING DISPLAY ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-10 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-black/30"
        >
          {/* Price */}
          <div className="text-center sm:text-left">
            <div className="flex items-baseline justify-center sm:justify-start gap-1">
              <span className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">₹199</span>
              <span className="text-lg text-gray-500 dark:text-gray-400">/month</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Cancel anytime • No hidden fees
            </p>
          </div>
          
          <div className="hidden sm:block h-12 w-px bg-gray-200 dark:bg-gray-700" />
          
          {/* Key Points */}
          <div className="flex flex-col gap-1.5 text-sm text-left">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>0% commission on sales</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>Unlimited products</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>Full order management</span>
            </div>
          </div>
        </motion.div>

        {/* ===== CTA BUTTONS ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Link href="/register">
            <motion.button 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group relative px-8 py-4 rounded-xl font-semibold text-base bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-xl shadow-gray-900/25 dark:shadow-white/25 overflow-hidden transition-all duration-300"
            >
              {/* Shine effect */}
              <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              
              <span className="relative flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Start Your Store
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>
          </Link>
          
          <Link href="#demo">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group px-6 py-4 rounded-xl font-semibold text-base text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-all duration-200 flex items-center gap-2"
            >
              <div className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 transition-colors">
                <Play className="w-3 h-3 text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 fill-current" />
              </div>
              Watch Demo
            </motion.button>
          </Link>
        </motion.div>

        {/* ===== TRUST BADGES ===== */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mb-12 text-sm text-gray-500 dark:text-gray-400"
        >
          {[
            { icon: Clock, text: "Setup in 2 minutes" },
            { icon: Shield, text: "Secure payments" },
            { icon: CreditCard, text: "No credit card to start" },
            { icon: Zap, text: "Go live instantly" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <item.icon className="w-4 h-4 text-gray-400" />
              <span>{item.text}</span>
            </div>
          ))}
        </motion.div>

        {/* ===== WHAT YOU GET ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto"
        >
          {[
            {
              icon: Store,
              title: "Professional Store",
              description: "Beautiful online store with your branding"
            },
            {
              icon: BarChart3,
              title: "Order Dashboard",
              description: "Track orders, payments & analytics"
            },
            {
              icon: Zap,
              title: "WhatsApp Integration",
              description: "Get orders directly on WhatsApp"
            },
          ].map((feature, idx) => (
            <div 
              key={idx}
              className="p-5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 text-left"
            >
              <div className="p-2.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 w-fit mb-3">
                <feature.icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ===== BOTTOM GRADIENT ===== */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-[#09090b] to-transparent pointer-events-none" />

      {/* ===== SCROLL INDICATOR ===== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500"
        >
          <span className="text-xs font-medium">Scroll to explore</span>
          <ArrowRight className="w-4 h-4 rotate-90" />
        </motion.div>
      </motion.div>
    </section>
  );
}