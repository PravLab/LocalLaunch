"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronDown, HelpCircle, MapPin, Store, Search, LifeBuoy } from "lucide-react";
import { baloo, poppins } from "@/src/font";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const faqs = [
  {
    question: "Local Launch Marketplace kya hai?",
    answer:
      "Ye ek smart digital bazaar hai jahan aap apne area ke verified local businesses ko explore kar sakte ho — restaurant, store, gym, repair shop, aur aur bhi. Har business ka apna mini-website hota hai.",
    icon: Store,
  },
  {
    question: "Mujhe location on karni padegi kya?",
    answer:
      "Haan, agar aap chahte hain nearby businesses dikhein to location allow karna best hai. Varna aap manually bhi search kar sakte ho.",
    icon: MapPin,
  },
  {
    question: "Main apna business kaise list kar sakta hu?",
    answer:
      "Simple hai! Bas 'Become a Seller' par click karke register karein. Aapka store turant online ho jaayega aur marketplace pe visible hoga.",
    icon: Search,
  },
  {
    question: "Kya Local Launch pe listed businesses verified hote hain?",
    answer:
      "Haan, har business verify kiya jata hai before listing. Ham ensure karte hain ki aapko genuine aur active dukaan hi mile.",
    icon: HelpCircle,
  },
  {
    question: "Agar mujhe help chahiye to?",
    answer:
      "Aap hamare WhatsApp support se direct baat kar sakte hain — 24/7 available for sellers and customers dono ke liye.",
    icon: LifeBuoy,
  },
];

export default function MarketplaceFaq() {
  return (
    <section className="relative py-24 px-6 overflow-hidden bg-[#0B0F19] text-gray-100">
      {/* Glowing Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-[900px] h-[900px] -top-80 left-1/2 -translate-x-1/2 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.25)_0%,transparent_70%)] blur-[160px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.15)_0%,transparent_70%)] blur-[160px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/40 to-transparent mix-blend-overlay" />
      </div>

      {/* Title Section */}
      <div className="text-center max-w-3xl mx-auto relative z-10">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className={`${baloo.className} text-4xl md:text-5xl font-bold text-white mb-4`}
        >
          ⚡ Marketplace FAQs
        </motion.h2>

        <motion.p
          initial="hidden"
          whileInView="visible"
          custom={2}
          variants={fadeIn}
          viewport={{ once: true }}
          className="text-gray-400 text-base md:text-lg max-w-xl mx-auto mb-12"
        >
          Confused? Yahaan hain sab sawalon ke jawaab — simple aur clear.  
          Har buyer aur seller ke liye ek jagah.
        </motion.p>
      </div>

      {/* FAQ Cards */}
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
              className="group bg-[#111827]/80 backdrop-blur-md border border-gray-800 rounded-2xl p-6 shadow-[0_0_15px_rgba(99,102,241,0.15)] hover:shadow-[0_0_25px_rgba(99,102,241,0.3)] transition-all duration-300"
            >
              <summary className="flex items-center justify-between cursor-pointer select-none">
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-500/20 p-2 rounded-lg">
                    <Icon className="text-indigo-400 w-5 h-5" />
                  </div>
                  <span
                    className={`${poppins.className} text-lg font-medium text-gray-100 group-hover:text-indigo-400 transition`}
                  >
                    {faq.question}
                  </span>
                </div>
                <ChevronDown className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform duration-300" />
              </summary>

              <p className="mt-3 text-gray-400 leading-relaxed pl-12 pr-4 text-[15px]">
                {faq.answer}
              </p>
            </motion.details>
          );
        })}
      </div>

      {/* Bottom Glow Line */}
      {/* <div className="mt-16 w-full h-[2px] bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-pink-500 rounded-full opacity-60" /> */}
    </section>
  );
}
