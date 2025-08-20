"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Upload, Globe, PhoneCall } from "lucide-react";
import { baloo, poppins } from "@/src/font";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

export default function HowItWorks() {
  const steps = [
    {
      icon: <CheckCircle className="w-9 h-9 text-emerald-500" />,
      title: "1️⃣ Register Karo",
      desc: "Naam, mobile aur dukaan ki basic info do — shuruaat sirf 30 second mein.",
      color: "emerald-200",
    },
    {
      icon: <Upload className="w-9 h-9 text-yellow-500" />,
      title: "2️⃣ Products Upload Karo",
      desc: "Photos daalo, price likho aur apna catalog banao — sab kuch mobile se.",
      color: "yellow-200",
    },
    {
      icon: <Globe className="w-9 h-9 text-blue-500" />,
      title: "3️⃣ Website Ready!",
      desc: "Ek click aur website live — orders lena shuru karo aur grow karo apna business.",
      color: "blue-200",
    },
  ];

  return (
    <section className="relative bg-gradient-to-b from-[#f1f5f9] to-[#e7f5ee] py-24 px-6 text-center overflow-hidden">
      {/* Glow Background */}
      <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-100 opacity-40 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Heading */}
      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className={`${baloo.className} text-3xl md:text-4xl font-bold text-emerald-700 mb-3 relative z-10`}
      >
        💡 Shuruaat kaise karein?
      </motion.h2>

      {/* Subheading */}
      <motion.p
        initial="hidden"
        whileInView="visible"
        custom={2}
        viewport={{ once: true }}
        variants={fadeIn}
        className={`${poppins.className} text-gray-600 max-w-2xl mx-auto mb-12 text-base md:text-lg relative z-10`}
      >
        Apni dukaan ko online le jaana ab hai super easy. Sirf 3 simple steps — bina developer, bina coding.
      </motion.p>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial="hidden"
            whileInView="visible"
            custom={i + 1}
            viewport={{ once: true }}
            variants={fadeIn}
            whileHover={{ scale: 1.03 }}
            className={`bg-white/70 backdrop-blur-md border-t-4 border-${step.color} p-6 rounded-2xl shadow-xl transition-all duration-300`}
          >
            <div className="mb-4 flex justify-center">{step.icon}</div>
            <h3 className="text-xl font-semibold text-gray-800">{step.title}</h3>
            <p className="text-gray-600 mt-2 text-sm">{step.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* WhatsApp CTA */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        custom={4}
        viewport={{ once: true }}
        variants={fadeIn}
        className="mt-14 relative z-10"
      >
        <a
          href="https://wa.me/917905124726?text=Hello%21%20Mujhe%20Local%20Launch%20kaise%20kaam%20karta%20hai%2C%20isme%20help%20chahiye."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full shadow-md hover:shadow-xl transition-all duration-300 text-base"
        >
          <PhoneCall className="w-5 h-5" />
          Chat on WhatsApp for Help
        </a>
      </motion.div>
    </section>
  );
}
