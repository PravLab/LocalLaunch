"use client";
import { useState } from "react";
import ChatbotModal from "./ChatbotModal";
import { Bot } from "lucide-react";

export default function ChatbotLauncher({ slug, hasPaid }) {
  const [open, setOpen] = useState(false);

  if (!hasPaid) return null;

  return (
    <>
      {/* Floating Help Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 px-5 py-3 text-white shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 ease-in-out group"
      >
        {/* Glowing Dot */}
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-lime-500"></span>
        </span>

        {/* Bot Icon */}
        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-white/20 group-hover:rotate-[15deg] transition-transform duration-300">
          <Bot className="w-5 h-5 text-white" />
        </div>

        {/* Optional Text (Hidden on small screens) */}
        <div className="text-sm font-medium tracking-wide hidden sm:block">
          Need Help?
        </div>
      </button>

      {/* Fixed Chatbot Modal Overlay */}
      {open && (
        <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center ">
          <ChatbotModal open={open} onClose={() => setOpen(false)} slug={slug} />
        </div>
      )}
    </>
  );
}
