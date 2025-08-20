"use client";

import Link from "next/link";
import { baloo, poppins, rubik } from "@/src/font";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";

export default function HeroSection() {
  return (
   <section className="relative bg-[#0F172A] text-white px-4 pt-32 pb-40 sm:px-6 lg:px-8 overflow-hidden select-none">
  {/* Background Effect */}
  <div className="absolute inset-0 bg-gradient-radial from-blue-900/30 via-indigo-900/20 to-transparent opacity-80 -z-10" />
  <div className="absolute -top-40 left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[160px] -z-10" />

  {/* Content */}
  <div className="max-w-5xl mx-auto text-center relative z-10">
    <motion.p
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${poppins.className} text-sm text-blue-100 tracking-wide mb-6 uppercase bg-white/10 px-4 py-1.5 inline-block rounded-full backdrop-blur-sm`}
    >
      🇮🇳 Empowering India's Local Businesses
    </motion.p>

    <motion.h1
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className={`${baloo.className} text-4xl sm:text-6xl font-bold leading-tight text-white mb-6`}
    >
      <span className="text-yellow-400">Har Local Business</span> ka apna Website hoga.
      <br />
      <span className="text-white">Free mein. 2 Minute mein.</span>
    </motion.h1>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className={`${poppins.className} text-base sm:text-lg text-blue-100 max-w-2xl mx-auto mb-8`}
    >
      Dukaan ho ya salon — Local Launch se banayein{" "}
      <span className="text-white font-semibold">free digital shop</span>, bina developer ke.
      <TypeAnimation
        sequence={[
          "Mobile se banayein apna shop.",
          2000,
          "Koi coding nahi chahiye.",
          2000,
          "Sab kuch free mein!",
          2000,
        ]}
        wrapper="span"
        speed={30}
        className="block text-yellow-300 font-semibold mt-3"
        repeat={Infinity}
      />
    </motion.div>

    {/* CTA Buttons */}
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6, duration: 0.4 }}
      className="flex flex-col sm:flex-row gap-4 justify-center"
    >
      <Link href="/register">
        <button className="px-6 py-3 text-lg font-semibold bg-yellow-400 text-black rounded-full shadow-lg hover:bg-yellow-300 transition-all duration-300 hover:scale-105">
          ⚡ Start Free — No Card Needed
        </button>
      </Link>
      <Link href="/#pricing">
        <button className="px-6 py-3 text-lg font-semibold border border-white/30 text-white rounded-full hover:bg-white/10 hover:text-yellow-300 transition-all duration-300 backdrop-blur-sm">
          📦 See Plans
        </button>
      </Link>
    </motion.div>

    {/* Trust Text */}
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className="text-sm text-blue-200 mt-6"
    >
      Trusted by 100+ Indian shops and growing 🚀
    </motion.p>
  </div>

  {/* Section Divider (optional SVG) */}
  <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] rotate-180">
    <svg className="relative block w-[calc(150%+1.3px)] h-[80px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 80" preserveAspectRatio="none">
      <path d="M0,0V80c150,0,300-40,450-40S900,80,1200,0V0Z" fill="#f1f5f9" />
    </svg>
  </div>
</section>

  );
}
