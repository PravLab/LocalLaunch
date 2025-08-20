// components/WhatsAppButton.js
"use client";

import { PhoneCall } from "lucide-react";

export default function WhatsAppButton({ message, className = "" }) {
  const phone = "917905124726"; // ✅ your WhatsApp number
  const encodedMessage = encodeURIComponent(message || "Hello! Mujhe Local Launch me help chahiye.");
  const url = `https://wa.me/${phone}?text=${encodedMessage}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full shadow-md text-base transition-all ${className}`}
    >
      <PhoneCall className="w-5 h-5" />
      Chat on WhatsApp for Help
    </a>
  );
}
