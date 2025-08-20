"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, MessageSquare, Rocket } from "lucide-react"; // ✅ Icons from lucide-react

const slides = [
  {
    title: "AI Chatbot for Your Store",
    desc: "Turn your website visitors into customers with an auto-reply chatbot working 24/7 — even while you sleep.",
    icon: <Bot className="w-10 h-10 mx-auto text-rose-400 mb-2" />, // ✅ replaced image with icon
  },
  {
    title: "Smart Conversations = More Sales",
    desc: (
      <ul className="list-disc list-inside space-y-1 text-left text-sm text-zinc-300">
        <li>🤖 Handles product queries instantly</li>
        <li>📦 Boosts conversions with quick replies</li>
        <li>📈 Collects leads from every conversation</li>
        <li>💬 Works 24/7 — no human needed</li>
      </ul>
    ),
    icon: <MessageSquare className="w-10 h-10 mx-auto text-rose-400 mb-2" />, // ✅ replaced image with icon
  },
  {
    title: "Ready in Just 2 Minutes",
    desc: "No apps. No coding. We’ll set up your AI chatbot and connect it to WhatsApp — you just sit back.",
    icon: <Rocket className="w-10 h-10 mx-auto text-rose-400 mb-2" />, // ✅ replaced image with icon
  },
];

export default function ChatbotUpgradeCarousel() {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < slides.length - 1) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-950 px-4 py-10 text-white">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl max-w-xl w-full p-8 relative overflow-hidden">
        {/* Slide Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-4"
          >
            {slides[step].icon}
            <h2 className="text-2xl font-bold text-rose-500">
              {slides[step].title}
            </h2>
            <div className="text-zinc-300 text-base">{slides[step].desc}</div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handlePrev}
            disabled={step === 0}
            className="text-sm text-zinc-400 hover:text-white transition-all disabled:opacity-30"
          >
            ← Back
          </button>
          <button
            onClick={handleNext}
            disabled={step === slides.length - 1}
            className="text-sm text-blue-400 hover:text-blue-500 transition-all disabled:opacity-30"
          >
            Next →
          </button>
        </div>

        {/* CTA on last slide */}
        {step === slides.length - 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-6"
          >
            <a
              href="https://wa.me/917905124726?text=Hi, I want to activate the AI Chatbot for my store"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full text-base font-semibold transition-all hover:scale-105"
            >
              💬 Chat on WhatsApp to Activate
            </a>
            <p className="text-xs text-zinc-500 mt-2">
              No tech setup. No waiting. Done-for-you setup in minutes.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
