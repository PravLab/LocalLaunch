"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Rocket,
  ShieldCheck,
  Smartphone,
  Wand2,
  Timer,
  Eye,
} from "lucide-react";
import { useRouter } from "next/navigation";

const features = [
  { icon: ShieldCheck, label: "Secure, Fast & Optimized Site" },
  { icon: Smartphone, label: "100% Mobile Responsive" },
  { icon: Wand2, label: "Auto-Generated in Seconds" },
  { icon: Timer, label: "Live in Under 1 Minute" },
  { icon: Eye, label: "Instant Site Preview" },
];

export default function FinalStep_Submit({ formData, prev }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (
      !formData.businessName ||
      !formData.ownerName ||
      !formData.phone ||
      !formData.products ||
      formData.products.length === 0
    ) {
      toast.error("Please fill all required fields and add at least 1 product.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong");

      // ✅ Set preview_token cookie (expires in 10 mins)
      document.cookie = `preview_token=${data.token}; path=/; max-age=600`;

      toast.success("🎉 Business registered successfully!");

      // ✅ Redirect to preview
      router.push(`/register/preview/${data.slug}`);
    } catch (err) {
      toast.error(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-10"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-emerald-700 flex items-center justify-center gap-2">
          <Rocket size={28} /> Ready to Launch!
        </h2>
        <p className="text-gray-600 mt-2 max-w-xl mx-auto">
          Your business site is ready. Click the button below to go live and preview your online presence.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
        {features.map((f, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-4 bg-white border rounded-lg shadow-sm"
          >
            <f.icon className="text-emerald-600 mt-1" size={20} />
            <p className="text-sm text-gray-800">{f.label}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={prev}
          className="bg-gray-100 text-gray-800 px-5 py-2 rounded-md hover:bg-gray-200 transition"
        >
          ← Back
        </button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          disabled={loading}
          onClick={handleSubmit}
          className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-2 rounded-md hover:opacity-90 shadow-lg font-semibold"
        >
          {loading ? "Launching..." : "Launch & Preview"}
        </motion.button>
      </div>
    </motion.div>
  );
}
