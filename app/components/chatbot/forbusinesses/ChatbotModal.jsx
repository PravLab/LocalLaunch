// app/components/chatbot/forbusinesses/ChatbotModal.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import { X, Bot, SendHorizonal, User, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useParams } from "next/navigation";

export default function ChatbotModal({ open, onClose,slug }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hi 👋, I'm your shopping assistant. Ask me anything about products, prices, business info, offers, or placing orders!",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const chatRef = useRef(null);
  const inputRef = useRef(null);
  // const { slug } = useParams();

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const handleUserMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      console.log("Sending request:", { slug, message: userMessage.text });
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, message: userMessage.text }),
      });
      console.log("Response status:", res.status);
      const text = await res.text();
      console.log("Raw response:", text);
      const data = JSON.parse(text);
      console.log("Parsed API response:", data);

      if (!res.ok) throw new Error(data.error || "Failed to get response");

      const botMessage = {
        id: Date.now(),
        sender: "bot",
        text: data.reply,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Client-side error:", err.message);
      const errorMessage = {
        id: Date.now(),
        sender: "bot",
        text: "Sorry, something went wrong. Please try again later.",
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleUserMessage();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed bottom-24 right-6 w-full max-w-sm z-50">
      <div className="rounded-2xl bg-zinc-900 text-white shadow-2xl border border-zinc-700 overflow-hidden animate-fade-in-up">
        <div className="flex items-center justify-between px-4 py-3 bg-zinc-800 border-b border-zinc-700">
          <span className="font-semibold flex items-center gap-2 text-white">
            <Bot className="w-5 h-5 text-blue-400" /> Smart Assistant
            {slug && <span className="text-xs text-gray-400">({slug})</span>}
          </span>
          <button
            onClick={onClose}
            className="hover:bg-zinc-700 p-1 rounded transition-colors"
            aria-label="Close chatbot"
          >
            <X className="w-5 h-5 text-gray-300 hover:text-white" />
          </button>
        </div>

        <div
          ref={chatRef}
          className="h-80 overflow-y-auto p-4 space-y-4 bg-zinc-900 text-sm scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-zinc-800"
          aria-live="polite"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2 ${msg.sender === "bot" ? "justify-start" : "justify-end"}`}
            >
              {msg.sender === "bot" && (
                <div className="flex-shrink-0">
                  <Bot className="w-4 h-4 mt-1 text-blue-400" aria-hidden="true" />
                </div>
              )}
              <div
                className={`px-4 py-2 rounded-xl max-w-[80%] whitespace-pre-line text-sm ${
                  msg.sender === "bot"
                    ? msg.isError
                      ? "bg-red-900/50 text-red-200 border border-red-700/50"
                      : "bg-zinc-800 text-gray-100"
                    : "bg-blue-600 text-white"
                }`}
              >
                {msg.text}
              </div>
              {msg.sender === "user" && (
                <div className="flex-shrink-0">
                  <User className="w-4 h-4 mt-1 text-gray-400" aria-hidden="true" />
                </div>
              )}
            </div>
          ))}

          {isSending && (
            <div className="flex items-start gap-2 justify-start">
              <Bot className="w-4 h-4 mt-1 text-blue-400" aria-hidden="true" />
              <div className="px-4 py-2 rounded-xl bg-zinc-800 text-gray-100 text-sm">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> Typing...
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 border-t border-zinc-700 p-3 bg-zinc-800">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask anything about the shop..."
            className="flex-1 text-sm px-4 py-2 rounded-full bg-zinc-700 text-white border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            disabled={isSending}
            aria-label="Type your message"
          />
          <button
            onClick={handleUserMessage}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full text-white text-sm flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={isSending || !input.trim()}
            aria-label="Send message"
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            ) : (
              <SendHorizonal className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}