"use client";

import { useState } from "react";

export default function TestGroq() {
  const [res, setRes] = useState("");

  const callGroq = async () => {
    const r = await fetch("/api/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Hello, LLaMA 3 via Groq!" }),
    });
    const data = await r.json();
    setRes(data?.choices?.[0]?.message?.content || JSON.stringify(data));
  };

  return (
    <div className="p-4">
      <button onClick={callGroq} className="bg-black text-white px-4 py-2 rounded">
        Test Groq (LLaMA 3)
      </button>
      <pre className="mt-4 bg-gray-100 p-2 whitespace-pre-wrap">{res}</pre>
    </div>
  );
}
