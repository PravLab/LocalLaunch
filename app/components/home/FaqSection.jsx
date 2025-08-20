"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  HelpCircle,
  Smartphone,
  LayoutDashboard,
  LifeBuoy,
} from "lucide-react";
import { baloo, poppins } from "@/src/font";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const faqs = [
  {
    question: "Kya ye service bilkul free hai?",
    answer:
      "Bilkul! Local Launch par apni dukaan ki website banana 100% free hai — bina kisi chhupi fees ke. Shuruaat ke liye aapko sirf kuch basic info deni hoti hai.",
    icon: HelpCircle,
  },
  {
    question: "Kya mujhe coding ya developer ki zarurat padegi?",
    answer:
      "Zarurat nahi! Sab kuch pre-built hai. Aap sirf form fill karke aur images upload karke apni dukaan turant online laa sakte hain.",
    icon: Smartphone,
  },
  {
    question: "Products aur orders kaise handle karenge?",
    answer:
      "Aapko milega ek smart aur simple admin panel jisme aap products manage kar sakte hain aur orders ko real-time track kar sakte hain.",
    icon: LayoutDashboard,
  },
  {
    question: "Agar koi dikkat aaye toh help kaise milegi?",
    answer:
      "WhatsApp par humari support team 24/7 ready rehti hai aapki madad ke liye. Direct help sirf ek message door hai!",
    icon: LifeBuoy,
  },
  {
    question: "📱 Mobile se admin panel kaise kholein?",
    answer:
      "Mobile site ke top right menu (≡) mein 'Admin' option milega. Uspe tap karte hi aapka dashboard khul jaayega.",
    icon: Smartphone,
  },
];

const FaqSection = () => {
  return (
    <section className="relative py-24 px-6 overflow-hidden bg-white text-gray-800">
      {/* Background Visuals */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-40 left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 opacity-20 blur-[160px] animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-200 opacity-10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-white/10 to-transparent mix-blend-overlay z-10" />
      </div>

      {/* FAQ Content */}
      <div className="relative z-10 text-center">
        <motion.h3
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className={`${baloo.className} text-3xl md:text-4xl font-bold text-gray-900 mb-4`}
        >
          🤔 FAQs – Aapke Sawalon ke Jawaab
        </motion.h3>
        <motion.p
          initial="hidden"
          whileInView="visible"
          custom={2}
          viewport={{ once: true }}
          variants={fadeIn}
          className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto mb-12"
        >
          Pehli baar online aane wale local businesses ke liye sabse common sawal – aur unke seedhe, simple jawaab.
        </motion.p>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto space-y-6">
        {faqs.map((faq, idx) => {
          const Icon = faq.icon;
          return (
            <motion.details
              key={idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={idx + 1}
              variants={fadeIn}
              className="group bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300"
            >
              <summary className="flex items-center justify-between font-medium text-gray-800 cursor-pointer select-none">
                <div className="flex items-center gap-3">
                  <Icon className="text-indigo-500 w-5 h-5 shrink-0 animate-pulse" />
                  <span className={`${poppins.className} text-base md:text-lg`}>
                    {faq.question}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform duration-300" />
              </summary>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed pl-8 pr-2">
                {faq.answer}
              </p>
            </motion.details>
          );
        })}
      </div>
    </section>
  );
};

export default FaqSection;
