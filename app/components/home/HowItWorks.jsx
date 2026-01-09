"use client";

import { motion } from "framer-motion";
import { 
  UserPlus, 
  Package, 
  Share2, 
  IndianRupee,
  ArrowRight,
  Sparkles,
  Clock,
  CheckCircle2,
  Zap,
  Store,
  Smartphone,
  QrCode,
  TrendingUp,
  Gift
} from "lucide-react";
import Link from "next/link";

// ===== STEP DATA =====
const steps = [
  {
    icon: UserPlus,
    title: "Register Karo",
    description: "Simple form fill karo — sirf 2 minute mein ho jayega",
    details: ["Name & Phone", "Shop Details", "Category Select"],
    color: "blue",
    gradient: "from-blue-500 to-cyan-500",
    number: "01",
    time: "2 min",
  },
  {
    icon: Package,
    title: "Products Add Karo",
    description: "Apne products add karo with photos, price & details",
    details: ["Unlimited Products", "Photos Upload", "Set Prices"],
    color: "purple",
    gradient: "from-purple-500 to-pink-500",
    number: "02",
    time: "5 min",
  },
  {
    icon: Share2,
    title: "Share Karo",
    description: "Apna QR code & link WhatsApp, Instagram pe share karo",
    details: ["QR Code Ready", "Shareable Link", "Social Share"],
    color: "emerald",
    gradient: "from-emerald-500 to-green-500",
    number: "03",
    time: "1 min",
  },
  {
    icon: IndianRupee,
    title: "Earn Karo",
    description: "Orders aayein, deliver karo, paisa kamao!",
    details: ["Get Orders", "Track Payments", "Grow Business"],
    color: "amber",
    gradient: "from-amber-500 to-orange-500",
    number: "04",
    time: "∞",
  },
];

// ===== STEP CARD COMPONENT =====
function StepCard({ step, index, totalSteps }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="relative group"
    >
      {/* Connection Arrow (Desktop) */}
      {index < totalSteps - 1 && (
        <div className="hidden lg:flex absolute top-16 -right-8 z-20
          items-center justify-center w-16">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 + index * 0.15 }}
          >
            <ArrowRight className="w-6 h-6 text-gray-300 dark:text-gray-600" />
          </motion.div>
        </div>
      )}

      {/* Card */}
      <div className="relative h-full p-6 sm:p-8 rounded-3xl
        bg-white dark:bg-gray-800/60
        border border-gray-100 dark:border-gray-700/50
        shadow-lg hover:shadow-2xl
        dark:shadow-none dark:hover:shadow-2xl dark:hover:shadow-indigo-500/5
        transition-all duration-500 overflow-hidden
        group-hover:-translate-y-2">
        
        {/* Background Gradient on Hover */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-[0.03] 
          transition-opacity duration-500 bg-gradient-to-br ${step.gradient}`} 
        />

        {/* Step Number Badge */}
        <div className="absolute top-4 right-4">
          <div className={`px-3 py-1 rounded-full text-xs font-bold
            bg-gradient-to-r ${step.gradient} text-white shadow-lg`}>
            STEP {step.number}
          </div>
        </div>

        {/* Time Badge */}
        <div className="absolute top-4 left-4">
          <div className="flex items-center gap-1 px-2 py-1 rounded-full
            bg-gray-100 dark:bg-gray-700/50 text-xs font-medium
            text-gray-600 dark:text-gray-400">
            <Clock className="w-3 h-3" />
            {step.time}
          </div>
        </div>

        {/* Icon */}
        <div className="relative mt-8 mb-6">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`inline-flex p-4 sm:p-5 rounded-2xl
              bg-gradient-to-br ${step.gradient} 
              shadow-xl group-hover:shadow-2xl
              transition-all duration-300`}
          >
            <step.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </motion.div>
          
          {/* Glow Effect */}
          <div className={`absolute inset-0 rounded-2xl blur-2xl opacity-0 
            group-hover:opacity-40 transition-opacity duration-500 
            bg-gradient-to-br ${step.gradient}`} 
          />
        </div>

        {/* Content */}
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">
          {step.title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 mb-5 leading-relaxed">
          {step.description}
        </p>

        {/* Details List */}
        <div className="space-y-2">
          {step.details.map((detail, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + index * 0.1 + idx * 0.05 }}
              className="flex items-center gap-2"
            >
              <CheckCircle2 className={`w-4 h-4 flex-shrink-0
                ${step.color === 'blue' ? 'text-blue-500' : ''}
                ${step.color === 'purple' ? 'text-purple-500' : ''}
                ${step.color === 'emerald' ? 'text-emerald-500' : ''}
                ${step.color === 'amber' ? 'text-amber-500' : ''}`} 
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {detail}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ===== TIMELINE VIEW (Alternative) =====
function TimelineView({ steps }) {
  return (
    <div className="relative max-w-3xl mx-auto">
      {/* Vertical Line */}
      <div className="absolute left-8 sm:left-1/2 top-0 bottom-0 w-0.5
        bg-gradient-to-b from-blue-500 via-purple-500 to-amber-500" />

      {steps.map((step, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.15 }}
          className={`relative flex items-center gap-6 mb-12 last:mb-0
            ${idx % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}
        >
          {/* Timeline Dot */}
          <div className="absolute left-8 sm:left-1/2 -translate-x-1/2 z-10">
            <div className={`w-4 h-4 rounded-full 
              bg-gradient-to-r ${step.gradient} shadow-lg
              ring-4 ring-white dark:ring-gray-900`} />
          </div>

          {/* Content Card */}
          <div className={`flex-1 ml-20 sm:ml-0 
            ${idx % 2 === 0 ? 'sm:pr-12 sm:text-right' : 'sm:pl-12 sm:text-left'}`}>
            <div className="p-5 rounded-2xl bg-white dark:bg-gray-800
              border border-gray-100 dark:border-gray-700 shadow-lg">
              <div className={`inline-flex p-3 rounded-xl mb-3
                bg-gradient-to-r ${step.gradient}`}>
                <step.icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                {step.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {step.description}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ===== MAIN COMPONENT =====
export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 
      bg-gradient-to-b from-white via-gray-50/50 to-white
      dark:from-[#0d1117] dark:via-[#0a0f1a] dark:to-[#0d1117]
      relative overflow-hidden">
      
      {/* ===== BACKGROUND EFFECTS ===== */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 
          bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 
          bg-purple-200/30 dark:bg-purple-900/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]
          bg-amber-200/20 dark:bg-amber-900/10 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* ===== SECTION HEADER ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
              bg-gradient-to-r from-blue-100 to-indigo-100 
              dark:from-blue-900/30 dark:to-indigo-900/30 
              border border-blue-200/50 dark:border-blue-800/50
              text-blue-700 dark:text-blue-400 
              text-sm font-bold mb-6 shadow-sm"
          >
            <Zap className="w-4 h-4" />
            Super Simple Process
          </motion.div>
          
          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold 
            text-gray-900 dark:text-white mb-4 sm:mb-6">
            <span className="block sm:inline">Sirf</span>{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-amber-500 
              dark:from-blue-400 dark:via-purple-400 dark:to-amber-400 
              bg-clip-text text-transparent">
              4 Steps
            </span>{" "}
            <span className="block sm:inline">Mein Shuru Karo</span>
          </h2>
          
          {/* Subheading */}
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 
            max-w-2xl mx-auto mb-6">
            Koi technical knowledge nahi chahiye. Koi approval wait nahi. 
            <span className="font-semibold text-gray-900 dark:text-white">
              {" "}Instantly live ho jao!
            </span>
          </p>

          {/* Time Estimate */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full
            bg-emerald-100 dark:bg-emerald-900/30 
            border border-emerald-200 dark:border-emerald-800">
            <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
              Total Time: ~10 minutes to go live
            </span>
          </div>
        </motion.div>

        {/* ===== STEPS GRID ===== */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16">
          {steps.map((step, idx) => (
            <StepCard 
              key={idx} 
              step={step} 
              index={idx} 
              totalSteps={steps.length}
            />
          ))}
        </div>

        {/* ===== MOBILE PROGRESS LINE ===== */}
        <div className="lg:hidden flex justify-center mb-12">
          <div className="flex items-center gap-2">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center
                  bg-gradient-to-r ${step.gradient} text-white text-xs font-bold`}>
                  {step.number}
                </div>
                {idx < steps.length - 1 && (
                  <div className="w-8 h-0.5 bg-gradient-to-r from-gray-300 to-gray-300 
                    dark:from-gray-700 dark:to-gray-700" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ===== HIGHLIGHT FEATURES ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12"
        >
          {[
            { 
              icon: Zap, 
              title: "Instant Approval", 
              desc: "No waiting period",
              gradient: "from-yellow-500 to-amber-500"
            },
            { 
              icon: Smartphone, 
              title: "Mobile Friendly", 
              desc: "Works on any device",
              gradient: "from-blue-500 to-indigo-500"
            },
            { 
              icon: QrCode, 
              title: "QR Ready", 
              desc: "Instant print & share",
              gradient: "from-purple-500 to-pink-500"
            },
            { 
              icon: Gift, 
              title: "100% FREE", 
              desc: "No hidden charges",
              gradient: "from-emerald-500 to-green-500"
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="flex items-center gap-3 p-4 rounded-2xl
                bg-white dark:bg-gray-800/60
                border border-gray-100 dark:border-gray-700/50
                shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${feature.gradient}`}>
                <feature.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900 dark:text-white">
                  {feature.title}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {feature.desc}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ===== CTA SECTION ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative p-8 sm:p-10 rounded-3xl overflow-hidden
            bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600
            shadow-2xl shadow-indigo-500/30"
        >
          {/* Pattern Background */}
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} 
          />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Ready to Start? 🚀
              </h3>
              <p className="text-white/80 text-sm sm:text-base">
                Join thousands of local sellers already growing their business online
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-8 py-4 rounded-2xl font-bold text-lg
                    bg-white text-indigo-700 
                    hover:bg-gray-100
                    shadow-xl hover:shadow-2xl
                    transition-all duration-300"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Start FREE Now
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </motion.button>
              </Link>
              
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>No credit card required</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ===== BOTTOM TRUST BADGES ===== */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-8"
        >
          {[
            { icon: Store, text: "100+ Cities" },
            { icon: TrendingUp, text: "Growing Daily" },
            { icon: CheckCircle2, text: "Verified Platform" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <item.icon className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
              <span className="text-sm font-medium">{item.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}