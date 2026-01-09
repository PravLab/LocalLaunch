"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { CheckCircle, X, LayoutTemplate } from "lucide-react";
import { baloo, poppins } from "@/src/font";


const allTemplates = [
  { id: "grocery-modern", title: "Modern Grocery", type: "grocery", img: "/templates/grocery1.png" },
  { id: "grocery-fresh", title: "Fresh Mart", type: "grocery", img: "/templates/grocery2.png" },
  { id: "grocery-basic", title: "Basic Grocery", type: "grocery", img: "/templates/grocery3.png" },
  { id: "salon-classic", title: "Classic Salon", type: "salon", img: "/templates/salon1.png" },
  { id: "salon-elegant", title: "Elegant Look", type: "salon", img: "/templates/salon2.png" },
  { id: "salon-trendy", title: "Trendy Cuts", type: "salon", img: "/templates/salon3.png" },
  { id: "restaurant-family", title: "Family Dine", type: "restaurant", img: "/templates/restaurant1.png" },
  { id: "restaurant-fast", title: "Fast Food", type: "restaurant", img: "/templates/restaurant2.png" },
  { id: "restaurant-modern", title: "Modern Dining", type: "restaurant", img: "/templates/restaurant3.png" },
  { id: "default-blue", title: "Clean Blue", type: "any", img: "/templates/default1.png" },
  { id: "default-neutral", title: "Minimal Grey", type: "any", img: "/templates/default2.png" },
  { id: "default-colorful", title: "Colorful Vibe", type: "any", img: "/templates/default3.png" },
];

const tabs = ["All", "Grocery", "Salon", "Restaurant"];

export default function Step4_Templates({ formData, setFormData, next, prev }) {
  const [selected, setSelected] = useState(formData.template || "");
  const [filter, setFilter] = useState("All");
  const [preview, setPreview] = useState(null);

  const filtered =
    filter === "All" ? allTemplates : allTemplates.filter(t => t.type === filter.toLowerCase());

  const selectTemplate = (id) => {
    setSelected(id);
    setFormData(prev => ({ ...prev, template: id }));
  };

  return (
    <section className="text-center">
      <h2 className={`${baloo.className} text-3xl font-bold text-emerald-700 mb-2`}>Choose Your Template</h2>
      <p className="text-gray-600 mb-6">Business type ke hisaab se aapke liye best templates niche diye gaye hain.</p>

      <div className="flex justify-center gap-3 flex-wrap mb-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1 rounded-full text-sm border font-medium transition-all
              ${filter === tab ? "bg-emerald-600 text-white" : "text-gray-500 border-gray-300 hover:border-emerald-500"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
        {filtered.map((template) => (
          <motion.div
            key={template.id}
            whileHover={{ scale: 1.03 }}
            className={`rounded-xl p-3 border transition cursor-pointer relative
              ${selected === template.id ? "border-emerald-500 shadow-lg" : "border-gray-200"}`}
            onClick={() => setPreview(template)}
          >
            {selected === template.id && (
              <CheckCircle className="absolute top-2 right-2 text-emerald-600 w-5 h-5" />
            )}
            <Image
              src={template.img}
              alt={template.title}
              width={500}
              height={300}
              className="rounded-lg mb-3 object-cover w-full h-[200px]"
            />
            <h3 className="font-semibold text-gray-800 mb-1">{template.title}</h3>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {template.type === "any" ? "Universal" : template.type.charAt(0).toUpperCase() + template.type.slice(1)}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-between items-center max-w-3xl mx-auto mt-10 px-4">
        <button onClick={prev} className="text-sm text-gray-500 hover:text-emerald-600">← Back</button>
        <button
          disabled={!selected}
          onClick={next}
          className={`px-6 py-2 rounded-full text-white font-medium transition-all shadow
            ${selected ? "bg-emerald-600 hover:bg-emerald-700" : "bg-gray-300 cursor-not-allowed"}`}
        >
          Continue
        </button>
      </div>

      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setPreview(null)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-xl w-full max-w-3xl p-6 relative"
            >
              <button onClick={() => setPreview(null)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-bold mb-4">{preview.title} Template</h3>
              <Image
                src={preview.img}
                alt={preview.title}
                width={1000}
                height={600}
                className="rounded-lg object-cover w-full h-[400px]"
              />
              <div className="text-right mt-4">
                <button
                  onClick={() => {
                    selectTemplate(preview.id);
                    setPreview(null);
                  }}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-medium"
                >
                  Use this Template
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
