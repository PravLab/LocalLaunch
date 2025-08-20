"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { FaShoppingCart, FaWhatsapp } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop().split(";").shift());
}

function setCookie(name, value, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

export default function BuyNowButton({ product, business }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [deliveryZones, setDeliveryZones] = useState([]);

  useEffect(() => {
    const saved = getCookie("buyerInfo");
    if (saved) {
      try {
        setForm(JSON.parse(saved));
      } catch {
        setForm({ name: "", phone: "", address: "" });
      }
    }
    setDeliveryZones(business.delivery_area || []);
  }, [business]);

  const handleBuy = async () => {
    const saved = getCookie("buyerInfo");
    const cooldown = getCookie("orderCooldown");

    if (saved && !cooldown) {
      try {
        const parsed = JSON.parse(saved);
        setForm(parsed);
        const valid = validateForm(parsed);
        if (!valid) {
          toast.error("Saved info is invalid. Please re-enter.");
          return setShowForm(true);
        }
        await handleOrder(parsed);
      } catch {
        return setShowForm(true);
      }
    } else {
      setShowForm(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };
    setForm(updated);
    setCookie("buyerInfo", JSON.stringify(updated));
  };

  const validateForm = (data) => {
    if (!data.name.trim() || !data.phone.trim() || !data.address.trim()) return false;
    if (!/^\d{10,}$/.test(data.phone.trim())) return false;
    return true;
  };

  const handleOrder = async (customForm = form) => {
    if (!validateForm(customForm)) {
      toast.error("Please fill all fields correctly.");
      return;
    }

    const isDeliverable = deliveryZones.some((zone) =>
      customForm.address.toLowerCase().includes(zone.toLowerCase())
    );

    if (!isDeliverable) {
      setShowForm(false);
      setShowContactModal(true);
      return;
    }

    setLoading(true);

    const order = {
      ...customForm,
      product,
      created_at: new Date().toISOString(),
    };

    const { data, error: fetchError } = await supabase
      .from("businesses")
      .select("orders")
      .eq("business_name", business.business_name)
      .single();

    if (fetchError) {
      toast.error("Failed to fetch orders");
      setLoading(false);
      return;
    }

    const updatedOrders = [...(data.orders || []), order];

    const { error: updateError } = await supabase
      .from("businesses")
      .update({ orders: updatedOrders })
      .eq("business_name", business.business_name);

    if (updateError) {
      toast.error("Order failed");
    } else {
      toast.success("Order placed successfully!");
      setCookie("orderCooldown", "true", 0.01);
      setShowForm(false);
    }

    setLoading(false);
  };

  return (
    <>
      <button
        onClick={handleBuy}
        className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition shadow-lg"
      >
        <FaShoppingCart className="animate-pulse" /> Buy Now
      </button>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 w-full max-w-md relative"
            >
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-3 right-3 text-red-500 text-2xl"
              >
                <IoClose />
              </button>
              <h2 className="text-2xl font-semibold mb-4 text-center text-black dark:text-white">
                🧾 Complete Your Order
              </h2>

              <div className="space-y-4">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your Full Name"
                  className="w-full p-3 border rounded-xl dark:bg-zinc-800 dark:text-white"
                />
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="10-digit Phone Number"
                  className="w-full p-3 border rounded-xl dark:bg-zinc-800 dark:text-white"
                />
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter your full address including city, landmark, pincode"
                  rows={4}
                  className="w-full p-3 border rounded-xl dark:bg-zinc-800 dark:text-white"
                />
              </div>

              <p className="text-xs text-gray-600 mt-2 dark:text-gray-400">
                Delivering to: <strong>{deliveryZones.join(", ") || "Not Set"}</strong>
              </p>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleOrder()}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl"
                >
                  {loading ? "Placing..." : "Place Order"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showContactModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 w-full max-w-md relative"
            >
              <button
                onClick={() => setShowContactModal(false)}
                className="absolute top-3 right-3 text-red-500 text-2xl"
              >
                <IoClose />
              </button>
              <h2 className="text-xl font-semibold text-center text-black dark:text-white">
                🚫 Not Deliverable
              </h2>
              <p className="text-center text-gray-700 dark:text-gray-300 mt-3">
                Sorry, we don’t deliver to your area currently.
              </p>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2 mb-5">
                You can contact the shop on WhatsApp to request delivery support.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setShowContactModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-black dark:text-white px-4 py-2 rounded-xl"
                >
                  Okay
                </button>
                <a
                  href={`https://wa.me/${business.whatsapp_number || ""}`}
                  target="_blank"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl flex items-center gap-2"
                >
                  <FaWhatsapp /> WhatsApp Store
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}