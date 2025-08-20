"use client";

import { useState, useRef, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FaRobot } from "react-icons/fa";

export default function ChatLocalLaunch() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

 const handleSend = async () => {
  setMessages([...messages, { role: "user", content: input }]);
  setInput("");

  try {
    const response = await fetch("/api/chat-local-launch", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: "Namaste, kya aap khule ho aaj?" }),
});

const data = await response.json();
console.log(data.reply);// 👈 yeh line add karo

    if (!data || !data.reply) {
      throw new Error("Invalid response from server");
    }

    setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
  } catch (err) {
    console.error("Error:", err);
    setMessages((prev) => [...prev, { role: "assistant", content: "🤖 Sorry, kuch galti ho gayi." }]);
  }
};


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      {open ? (
        <div className="w-[380px] h-[520px] bg-white dark:bg-zinc-900 shadow-2xl rounded-3xl flex flex-col overflow-hidden border border-gray-200 dark:border-zinc-700 animate-fadeInUp transition-all duration-300">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 text-white shadow-sm">
            <span className="font-semibold text-[16px] tracking-wide flex items-center gap-2">
              <FaRobot size={22} className="text-white" />
              ChatLocalLaunch
            </span>
            <button onClick={() => setOpen(false)} className="hover:opacity-80 transition">
              <IoClose size={24} />
            </button>
          </div>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50 dark:bg-zinc-800">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[75%] px-4 py-2 rounded-xl text-sm whitespace-pre-wrap shadow-md ${
                  msg.role === "user"
                    ? "ml-auto bg-blue-100 text-gray-900"
                    : "mr-auto bg-white dark:bg-zinc-700 text-gray-800 dark:text-gray-100"
                }`}
              >
                {msg.content}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 border-t dark:border-zinc-700 bg-white dark:bg-zinc-900">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Apna sawaal poochhiye..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 px-4 py-2 rounded-full border border-gray-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white"
              />
              <button
                onClick={handleSend}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-full transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-5 rounded-full shadow-2xl hover:scale-105 transition-all duration-200 flex items-center justify-center"
        >
          <FaRobot size={28} className="text-white" />
        </button>
      )}
    </div>
  );
}
