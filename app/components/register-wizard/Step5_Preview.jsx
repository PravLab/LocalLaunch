"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { toast } from "sonner";
import { Eye, LayoutTemplate, Sparkles, Palette, Settings2 } from "lucide-react";

const allTemplates = [
  {
    id: "modern-grocery-1",
    title: "Modern Grocery",
    type: "grocery",
    img: "/templates/grocery1.png",
  },
  {
    id: "fresh-grocery-2",
    title: "Fresh Grocery",
    type: "grocery",
    img: "/templates/grocery2.png",
  },
  {
    id: "clean-grocery-3",
    title: "Clean Grocery",
    type: "grocery",
    img: "/templates/grocery3.png",
  },
  {
    id: "classic-salon-1",
    title: "Classic Salon",
    type: "salon",
    img: "/templates/salon1.png",
  },
  {
    id: "modern-salon-2",
    title: "Modern Salon",
    type: "salon",
    img: "/templates/salon2.png",
  },
  {
    id: "bold-salon-3",
    title: "Bold Salon",
    type: "salon",
    img: "/templates/salon3.png",
  },
  {
    id: "default-template",
    title: "Default Template",
    type: "any",
    img: "/templates/default.png",
  },
];

export default function Step5_Preview({ formData, setFormData, next, prev }) {
  const [selectedTemplate, setSelectedTemplate] = useState(formData.template || "default-template");

  const filteredTemplates = allTemplates.filter(
    (t) => t.type === formData.type || t.type === "any"
  );

  const handleTemplateSelect = (id) => {
    setSelectedTemplate(id);
    toast.success("Template selected!");
  };

  useEffect(() => {
    setFormData((prev) => ({ ...prev, template: selectedTemplate }));
  }, [selectedTemplate]);

  return (
    <div className="py-12 px-4">
      <div className="text-center mb-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-emerald-600 flex items-center justify-center gap-2"
        >
          <LayoutTemplate size={26} /> Select Your Site Template
        </motion.h2>
        <p className="text-gray-600 mt-2">Choose a design that fits your business style.</p>
      </div>

      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {filteredTemplates.map((template) => (
          <motion.div
            key={template.id}
            whileHover={{ scale: 1.03 }}
            onClick={() => handleTemplateSelect(template.id)}
            className={`rounded-xl overflow-hidden shadow transition border-2 cursor-pointer
              ${selectedTemplate === template.id ? "border-emerald-500 ring-2 ring-emerald-300" : "border-gray-200"}`}
          >
            <Image
              src={template.img}
              alt={template.title}
              width={400}
              height={240}
              className="w-full h-52 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-1">
                <Sparkles size={16} className="text-yellow-400" /> {template.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">Click to apply this template</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-12 max-w-4xl mx-auto">
        <button
          onClick={prev}
          className="bg-gray-100 text-gray-700 px-5 py-2 rounded-md hover:bg-gray-200 transition"
        >
          ← Back
        </button>

        <button
          onClick={() => {
            toast.success("Saved. Now set your Admin Login");
            next();
          }}
          className="bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700 shadow font-medium"
        >
          Looks Good → Set Admin Access
        </button>
      </div>
    </div>
  );
}
