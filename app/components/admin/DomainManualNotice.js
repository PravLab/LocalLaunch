"use client";

import { Dialog } from "@headlessui/react";
import { useState } from "react";
import WhatsAppButton from "@/app/components/WhatsAppButton";

export default function DomainManualPopup() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition"
      >
        Connect Custom Domain
      </button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <Dialog.Title className="text-xl font-bold mb-2">Custom Domain Setup</Dialog.Title>
            <p className="text-sm text-gray-700 mb-4">
              Apna domain hume WhatsApp pe bheje ya baat kare, hum aapke domain ko aapki site se connect kar denge.
            </p>

            {/* ✅ Your actual styled WhatsApp button */}
            <WhatsAppButton message="Hi, I want to connect my domain to my website" />

            <button
              onClick={() => setIsOpen(false)}
              className="mt-4 text-sm text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
