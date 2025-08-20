"use client";
import { useBusiness } from "@/src/context/BusinessContext";

export default function WhatsAppButton() {
  const { business } = useBusiness();
  const whatsappNumber = business?.whatsapp;

  if (!whatsappNumber) return null;

  return (
    <div className="fixed bottom-20 right-10 z-50 group">
      <a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-20 h-20 bg-green-500 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp"
          className="w-10 h-10"
        />
      </a>
      <div className="absolute right-24 bottom-1/2 translate-y-1/2 bg-black text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
        Chat with us
      </div>
    </div>
  );
}
