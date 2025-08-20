"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { FaWhatsapp } from "react-icons/fa";

export default function ContactModal({ planName, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <motion.div
      id="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-xl w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-red-500 text-2xl"
        >
          <IoClose />
        </button>

        <h2 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-3">
          {planName} – Early Access
        </h2>

        <p className="text-center text-gray-700 dark:text-gray-300 mb-2">
          यह प्लान अभी केवल invite के ज़रिए उपलब्ध है। अगर आप इस प्लान को इस्तेमाल करना चाहते हैं, तो हमसे WhatsApp पर संपर्क करें।
        </p>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-5">
          हमारी टीम आपकी रिक्वेस्ट को verify करने के बाद manual access सेट करेगी।
        </p>

        <div className="flex justify-center gap-4 mb-6">
          <a
            href="https://wa.me/917905124726"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl flex items-center gap-2 shadow"
          >
            <FaWhatsapp className="text-lg" /> WhatsApp करें
          </a>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl border dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
        </div>

        <div className="text-center border-t pt-4 mt-2 dark:border-zinc-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Want to see how it works? Try our demo chatbot experience.
          </p>
          <a
            href="https://megmart.locallaunch.in"
            target="_blank"
            className="text-sm px-4 py-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
          >
            Try Demo Chatbot
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}
