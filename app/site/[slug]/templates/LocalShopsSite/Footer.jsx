"use client";

import { useBusiness } from "@/src/context/BusinessContext";

export default function Footer() {
  const { business } = useBusiness();

  return (
    <footer className="bg-indigo-900 text-white py-6 px-4 mt-16">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between text-sm text-center sm:text-left">
        <p>
          © {new Date().getFullYear()}{" "}
          {business?.business_name || "Local Launch"}. All rights reserved.
        </p>

        {business?.whatsapp && (
          <a
            href={`https://wa.me/${business.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 sm:mt-0 text-green-400 hover:underline"
          >
            📞 WhatsApp Support
          </a>
        )}
      </div>
    </footer>
  );
}
