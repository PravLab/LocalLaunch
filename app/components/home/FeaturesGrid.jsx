"use client";

import { motion } from "framer-motion";
import { 
  Package, 
  ShoppingBag, 
  BarChart3, 
  QrCode, 
  Share2, 
  MessageCircle, 
  MapPin, 
  Bell, 
  Palette, 
  Link2, 
  Shield,
  CheckCircle2,
  Sparkles,
  Zap,
  ArrowRight
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

// ===== FEATURE DATA =====
const features = [
  {
    icon: Package,
    title: "Unlimited Products",
    description: "Add unlimited products with images & pricing",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: ShoppingBag,
    title: "Order Management",
    description: "Track, accept & manage all orders easily",
    gradient: "from-emerald-500 to-green-500",
  },
  {
    icon: BarChart3,
    title: "Sales Analytics",
    description: "Real-time insights on sales & revenue",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: QrCode,
    title: "QR Code",
    description: "Print-ready QR code for your shop",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: Share2,
    title: "Shareable Link",
    description: "Your own link: locallaunch.in/shop-name",
    gradient: "from-indigo-500 to-violet-500",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Orders",
    description: "Receive orders directly on WhatsApp",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: MapPin,
    title: "Google Map",
    description: "Show your physical store location",
    gradient: "from-red-500 to-rose-500",
  },
  {
    icon: Palette,
    title: "Custom Banner",
    description: "Design beautiful banners & offers",
    gradient: "from-cyan-500 to-teal-500",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Instant alerts for new orders",
    gradient: "from-orange-500 to-amber-500",
  },
  {
    icon: Link2,
    title: "Social Links",
    description: "Connect Instagram, Facebook & more",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: Shield,
    title: "Verified Badge",
    description: "Build trust with verification",
    gradient: "from-teal-500 to-cyan-500",
  },
];

// ===== FEATURE CARD COMPONENT =====
function FeatureCard({ feature, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group relative"
    >
      <div className="relative h-full p-5 sm:p-6 rounded-2xl
        bg-white dark:bg-gray-800/60
        border border-gray-100 dark:border-gray-700/50
        shadow-sm hover:shadow-xl
        dark:shadow-none dark:hover:shadow-2xl dark:hover:shadow-indigo-500/5
        hover:border-gray-200 dark:hover:border-gray-600
        transition-all duration-300 cursor-pointer overflow-hidden"
      >
        {/* Gradient Background on Hover */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-[0.03] 
          transition-opacity duration-500 bg-gradient-to-br ${feature.gradient}`} 
        />
        
        {/* Icon Container */}
        <div className="relative mb-4">
          <div className={`inline-flex p-3 sm:p-3.5 rounded-xl
            bg-gradient-to-br ${feature.gradient} 
            shadow-lg group-hover:shadow-xl
            group-hover:scale-110 transition-all duration-300`}
          >
            <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
        </div>
        
        {/* Content */}
        <h3 className="font-bold text-gray-900 dark:text-white mb-1.5
          transition-all duration-300 text-sm sm:text-base">
          {feature.title}
        </h3>
        
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
}

// ===== MAIN COMPONENT =====
export default function FeaturesGrid() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 
      bg-gradient-to-b from-gray-50 via-white to-gray-50
      dark:from-[#0a0f1a] dark:via-[#0d1117] dark:to-[#0a0f1a]
      relative overflow-hidden">
      
      {/* ===== BACKGROUND EFFECTS ===== */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 
          bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 
          bg-purple-200/30 dark:bg-purple-900/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* ===== SECTION HEADER ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
              bg-gradient-to-r from-indigo-100 to-purple-100 
              dark:from-indigo-900/30 dark:to-purple-900/30 
              border border-indigo-200/50 dark:border-indigo-800/50
              text-indigo-700 dark:text-indigo-400 
              text-sm font-bold mb-6 shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            All Features Included
          </motion.div>
          
          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold 
            text-gray-900 dark:text-white mb-4 sm:mb-6">
            <span className="block sm:inline">Everything You Need</span>
          </h2>
          
          {/* Subheading */}
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 
            max-w-3xl mx-auto">
            A complete business toolkit with
            <span className="font-semibold text-gray-900 dark:text-white"> 11 powerful features</span> 
            {" "}to grow your online store.
          </p>
        </motion.div>

        {/* ===== FEATURES GRID ===== */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {features.map((feature, idx) => (
            <FeatureCard key={idx} feature={feature} index={idx} />
          ))}
        </div>

        {/* ===== CTA SECTION ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 sm:mt-20 text-center"
        >
          <Link href="/register">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="group px-8 py-4 rounded-2xl font-bold text-base sm:text-lg
                bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 
                hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700
                text-white shadow-xl shadow-indigo-500/30 
                hover:shadow-2xl hover:shadow-indigo-600/40
                transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Start Using All Features
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>
          </Link>
          
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            No credit card required • First 10 users get FREE access
          </p>
        </motion.div>
      </div>
    </section>
  );
}