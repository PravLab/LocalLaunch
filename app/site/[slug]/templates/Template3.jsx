"use client";

import { poppins } from "@/src/font";
import { useBusiness } from "@/src/context/BusinessContext";
import WhatsAppButton from "./LocalShopsSite/WhatsAppButton";
import Footer from "./LocalShopsSite/Footer";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Template3({ business }) {
  const products = business.products || [];

  return (
    <div className={`${poppins.className} bg-white min-h-screen`}> 
      {/* Navbar */}
      <header className="fixed top-0 w-full bg-white/70 backdrop-blur-md shadow z-50 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-emerald-700">{business.name}</h1>
        <a
          href={`https://wa.me/${business.phone}`}
          className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition"
        >
          Chat With Us
        </a>
      </header>

      {/* Hero Section */}
      <section className="pt-28 pb-20 bg-gradient-to-r from-emerald-50 via-white to-orange-50 text-center px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-extrabold text-emerald-700 mb-4"
        >
          Welcome to {business.name}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-lg text-gray-600 max-w-2xl mx-auto"
        >
          {business.description || "Browse quality products at affordable prices — trusted by locals."}
        </motion.p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="mt-8"
        >
          <a
            href="#products"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md transition"
          >
            Shop Now
          </a>
        </motion.div>
      </section>

      {/* Product Highlights */}
      <section id="products" className="py-16 px-4 bg-white">
        <h3 className="text-3xl font-bold text-center text-emerald-700 mb-10">Featured Products</h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {products.slice(0, 6).map((product, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <Image
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h4 className="text-lg font-semibold text-emerald-700">{product.name}</h4>
                <p className="text-gray-600 text-sm">₹{product.price}</p>
                <a
                  href={`https://wa.me/${business.phone}?text=I'm interested in ${product.name}`}
                  className="mt-3 inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-sm"
                >
                  Order on WhatsApp
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-emerald-50 px-6">
        <h3 className="text-3xl font-bold text-center text-emerald-700 mb-10">FAQs</h3>
        <div className="max-w-3xl mx-auto space-y-6">
          {["How do I order?", "Is delivery available?", "Can I return items?"]?.map((q, idx) => (
            <details key={idx} className="border rounded p-4 bg-white shadow-sm">
              <summary className="cursor-pointer font-semibold text-emerald-700">{q}</summary>
              <p className="mt-2 text-gray-600 text-sm">
                Lorem ipsum dolor sit amet consectetur. (Customize from Supabase later)
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="text-center py-14 px-6 bg-orange-50">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Need help with something?</h3>
        <a
          href={`https://wa.me/${business.phone}`}
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg text-lg font-semibold"
        >
          Chat with Our Expert
        </a>
      </section>

      <WhatsAppButton />
      <Footer />
    </div>
  );
}
