"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Instagram, ArrowUp } from "lucide-react";
import { poppins } from "@/src/font";

export default function Footer() {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowTopBtn(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <footer className="relative bg-gray-900 text-white px-6 pt-20 pb-16 rounded-t-3xl select-none overflow-hidden">
        {/* 🌈 Top Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-indigo-500 to-purple-500 rounded-t-xl z-10" />

        {/* 🎨 Decorative Wave (No SVG) */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-0">
  <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-32">
    <path d="M0,0 C300,100 900,0 1200,100 L1200,120 L0,120 Z" fill="url(#gradient)" opacity="0.1"></path>
    <defs>
      <linearGradient id="gradient" gradientTransform="rotate(90)">
        <stop offset="0%" stopColor="#10b981" />      {/* Emerald-400 */}
        <stop offset="50%" stopColor="#6366f1" />      {/* Indigo-500 */}
        <stop offset="100%" stopColor="#8b5cf6" />     {/* Purple-500 */}
      </linearGradient>
    </defs>
  </svg>
</div>


        {/* 🌾 Grain Texture */}
       <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.04)_1px,_transparent_1px)] [background-size:6px_6px] opacity-10 mix-blend-soft-light pointer-events-none z-0" />


        <div className="relative z-10 max-w-7xl mx-auto text-center">
          {/* 🗣️ CTA Text */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`${poppins.className} text-xl md:text-2xl font-semibold mb-6 text-emerald-300 leading-snug`}
          >
            💬 Aaj bhi agar online nahi aaye, toh kal ka customer kisi aur ka ho jayega!
          </motion.p>

          {/* 🚀 CTA Button */}
          <motion.a
            href="/register"
            whileHover={{ scale: 1.05 }}
            className="inline-block bg-gradient-to-r from-indigo-500 to-emerald-500 hover:from-indigo-600 hover:to-emerald-600 text-white font-semibold px-8 py-3 rounded-full text-base md:text-lg transition-all shadow-xl"
          >
            🔘 Start Now – Apna Website Banao
          </motion.a>

          {/* Divider */}
          <div className="my-10 border-t border-gray-700 w-full max-w-3xl mx-auto" />

          {/* 🔗 Footer Links */}
          <div className="grid md:grid-cols-3 gap-6 text-left text-sm text-gray-300">
            {/* 📞 Contact */}
            <div>
              <h3 className="font-semibold mb-3 text-white">📞 Support</h3>
              <p className="flex items-center gap-2 hover:text-emerald-400 transition">
                <Mail size={16} /> hello@locallaunch.in
              </p>
            </div>

            {/* 🔗 Useful Links */}
            <div>
              <h3 className="font-semibold mb-3 text-white">🔗 Useful Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/about" className="hover:text-emerald-400 transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/privacy-policy" className="hover:text-emerald-400 transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms-and-conditions" className="hover:text-emerald-400 transition">
                    Terms & Conditions
                  </a>
                </li>
              </ul>
            </div>

            {/* 🌐 Socials */}
            <div>
              <h3 className="font-semibold mb-3 text-white">🌐 Follow Us</h3>
              <div className="flex gap-4 mt-2">
                <a
                  href="https://www.instagram.com/locallaunch.in"
                  className="hover:text-emerald-400 transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram />
                </a>
              </div>
            </div>
          </div>

          {/* 📄 Bottom Info */}
          <div className="mt-12 text-gray-500 text-xs flex flex-col md:flex-row justify-between items-center gap-2">
            <p>❤️ Made with love for Indian Local Businesses</p>
            <p>👨‍💻 Created by आम लोग, आपके जैसे</p>
            <p>© {new Date().getFullYear()} Local Launch. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* 🔝 Scroll to Top Button */}
      <AnimatePresence>
        {showTopBtn && (
          <motion.button
            key="scrollTop"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded-full shadow-lg transition-all"
            aria-label="Scroll to top"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
