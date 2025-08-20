"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="bg-white min-h-screen px-6 py-10 text-gray-800">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-6 text-sm flex items-center gap-2 text-gray-600 hover:text-black transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </button>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-6">
          About Local Launch
        </h1>

        <p className="text-lg md:text-xl text-center text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
  Kirana store ho, kapdon ki dukaan, mobile ya electronics shop ya cosmetics outlet — agar aap physical shop mein products bechte ho, to Local Launch aapke liye hai. Aap apna online store sirf kuch minute mein bana sakte ho aur customers se digital orders lena shuru kar sakte ho.
</p>


        <section className="space-y-10 text-[17px] leading-8">
          <div>
            <h2 className="text-2xl font-semibold mb-2">🌍 Our Mission</h2>
            <p>
              At Local Launch, we believe that going digital shouldn't be limited to big brands. Every small shop deserves to be found online, take orders digitally, and grow in today’s fast-moving market.
              <br /><br />
              We're building tools that are affordable, simple, and made for real people — not tech experts.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">🚀 How It Works</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Shop owner signs up (no coding needed)</li>
              <li>We generate a website and custom QR code</li>
              <li>Share it — customers start ordering online</li>
              <li>Manage products, orders & site info anytime</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">👋 Who’s Behind This?</h2>
            <p>
              Local Launch is created by <strong>Praveen</strong>, a self-taught developer from India who started with zero background in coding.
              <br /><br />
              This project is not funded by any big company. It’s built with passion, long nights, and the belief that small creators can build tools that change lives.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">🔐 Trust & Safety</h2>
            <p>
              All websites are secured with HTTPS. Your data is stored safely using industry-standard practices. No personal data is ever sold or shared. You're in control — always.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">📦 Who is it for?</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Grocery & Kirana Stores</li>
              <li>Medical & Pharmacy shops</li>
              <li>Local Fashion, Electronics or Hardware sellers</li>
              <li>Street Food vendors or Home-run businesses</li>
            </ul>
            <p className="mt-2 text-gray-600">
              Basically — if you sell something offline, we’ll help you sell it online.
            </p>
          </div>

          <div className="border-t pt-8 mt-12 text-sm text-center text-gray-500">
            © {new Date().getFullYear()} Local Launch. Made in 🇮🇳dia with ❤️ to support local businesses.
          </div>
        </section>
      </div>
    </div>
  );
}
