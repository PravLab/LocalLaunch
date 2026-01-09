"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Instagram, ArrowUp, MapPin } from "lucide-react";
import { poppins } from "@/src/font";
import Link from "next/link"; // added



export default function Footer() {
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleScroll = () => setShowTopBtn(window.scrollY > 300);
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

 
  return (
    <>
      <footer className="relative bg-[#050505] text-gray-300 px-6 pt-20 pb-14 rounded-t-3xl overflow-hidden select-none">
        {/* Background Glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[400px] h-[400px] bg-gradient-to-tr from-emerald-600/30 via-purple-500/20 to-indigo-500/30 rounded-full blur-[160px] animate-pulse" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-700/20 to-emerald-600/30 rounded-full blur-[200px]" />
        </div>

        {/* Top Gradient Border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-indigo-500 to-purple-500 rounded-t-xl z-10" />

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          {/* CTA */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`${poppins.className} text-lg md:text-2xl font-semibold mb-6 text-emerald-300`}
          >
            🏪 Join the Future of Local – Discover, Connect & Support Businesses Around You.
          </motion.p>

          {/* Keeping motion.a for hover animation */}
          <motion.a
            href="/register"
            whileHover={{ scale: 1.05 }}
            className="inline-block bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 text-white font-semibold px-8 py-3 rounded-full text-base md:text-lg transition-all shadow-lg mb-10"
          >
            ⚡ List Your Business Now
          </motion.a>

          {/* Footer Grid */}
          <div className="grid md:grid-cols-4 gap-8 text-left text-sm md:text-base">
            {/* Explore */}
            <div>
              <h3 className="font-semibold mb-4 text-white">🧭 Explore</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="hover:text-emerald-400 transition">Marketplace</Link></li>
                <li><Link href="/categories" className="hover:text-emerald-400 transition">Browse Categories</Link></li>
                <li><Link href="/near-me" className="hover:text-emerald-400 transition">Near Me</Link></li>
                <li><Link href="/how-it-works" className="hover:text-emerald-400 transition">How It Works</Link></li>
              </ul>
            </div>

            {/* For Businesses */}
            <div>
              <h3 className="font-semibold mb-4 text-white">💼 For Businesses</h3>
              <ul className="space-y-2">
                <li><Link href="/register" className="hover:text-emerald-400 transition">Launch Your Store</Link></li>
                <li>
                  <button
                    onClick={() => setShowAdminModal(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-full shadow transition"
                  >
                    Admin Access
                  </button>
                </li>
                <li><Link href="/pricing" className="hover:text-emerald-400 transition">Plans & Pricing</Link></li>
              </ul>
            </div>

            {/* Quick Links (Policies) */}
            <div>
              <h3 className="font-semibold mb-4 text-white">🔗 Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="hover:text-emerald-400 transition">About</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-emerald-400 transition">Privacy Policy</Link></li>
                <li><Link href="/terms-and-conditions" className="hover:text-emerald-400 transition">Terms & Conditions</Link></li>
                <li><Link href="/cancellation-refund" className="hover:text-emerald-400 transition">Cancellation & Refund Policy</Link></li>
                <li><Link href="/shipping-policy" className="hover:text-emerald-400 transition">Shipping/Delivery Policy</Link></li>
                <li><Link href="/contact-us" className="hover:text-emerald-400 transition">Contact Us</Link></li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h3 className="font-semibold mb-4 text-white">📞 Connect</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 hover:text-emerald-400 transition">
                  <Mail size={16} />
                  <a href="mailto:hello@locallaunch.in" className="underline-offset-2 hover:underline">
                    hello@locallaunch.in
                  </a>
                </li>
                <li className="flex items-center gap-2 hover:text-emerald-400 transition">
                  <Instagram size={16} />
                  <a
                    href="https://instagram.com/locallaunch.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-offset-2 hover:underline"
                  >
                    @locallaunch.in
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin size={16} /> India – Growing Every City 🌆
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Info */}
          <div className="mt-12 text-gray-500 text-xs md:text-sm flex flex-col md:flex-row justify-between items-center gap-3">
            <p>❤️ Built for Local Businesses, Empowered by Community</p>
            <p>🌐 A project by <span className="text-emerald-400 font-medium">Local Launch</span></p>
            <p>© {new Date().getFullYear()} Local Launch Marketplace. All Rights Reserved.</p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showTopBtn && (
          <motion.button
            key="scrollTop"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 text-white p-3 rounded-full shadow-lg transition-all"
            aria-label="Scroll to top"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>

   
    </>
  );
}