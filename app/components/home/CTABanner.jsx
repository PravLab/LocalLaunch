"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Clock } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function CTABanner() {
  const [spotsLeft, setSpotsLeft] = useState(73);

  useEffect(() => {
    const saved = localStorage.getItem("spotsLeft");
    if (saved) setSpotsLeft(parseInt(saved));
  }, []);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto"
      >
        <div className="relative overflow-hidden rounded-3xl 
          bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 
          p-8 sm:p-12 text-center text-white">
          
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          <div className="relative z-10">
            {/* Urgency Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
              bg-white/20 backdrop-blur-sm mb-6">
              <Clock className="w-4 h-4" />
              <span className="font-medium">Only {spotsLeft} FREE spots left!</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Ready to Launch Your Business Online?
            </h2>
            
            <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-8">
              2 minute mein register karo, aaj se hi orders lena shuru karo. 
              Koi risk nahi — sirf jab order aaye tabhi pay karo.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <button className="group px-8 py-4 rounded-full font-semibold text-lg
                  bg-white text-indigo-700 
                  hover:bg-gray-100 
                  shadow-lg shadow-black/20
                  transform hover:scale-105 transition-all duration-300">
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Abhi FREE Register Karo
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </Link>
              
              <Link href="https://wa.me/91XXXXXXXXXX" target="_blank">
                <button className="px-8 py-4 rounded-full font-semibold text-lg
                  bg-white/10 backdrop-blur-sm text-white
                  border border-white/30
                  hover:bg-white/20
                  transition-all duration-300">
                  💬 WhatsApp pe baat karo
                </button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}