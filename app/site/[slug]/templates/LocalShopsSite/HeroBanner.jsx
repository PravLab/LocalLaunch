"use client";

import { ShoppingBag } from "lucide-react";

export default function HeroBanner({ business }) {
  const handleScrollToProducts = () => {
    const productSection = document.getElementById("products");
    if (productSection) {
      productSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-white py-16 px-4 sm:px-12">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-100 rounded-full blur-3xl opacity-50 -z-10" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-emerald-200 rounded-full blur-2xl opacity-40 -z-10" />

      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-emerald-700 mb-4">
          Welcome to {business.name}
        </h1>
        <p className="text-gray-700 text-lg sm:text-xl max-w-2xl mx-auto">
          {business.description || "Explore our premium collection and local favorites."}
        </p>

        <div className="mt-8">
          <button
            onClick={handleScrollToProducts}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-lg transition transform hover:scale-105 duration-300"
          >
            <ShoppingBag className="w-5 h-5 animate-bounce" />
            Shop Now
          </button>
        </div>
      </div>
    </section>
  );
}
