"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  FaShoppingCart,
  FaWhatsapp,
  FaCreditCard,
  FaMoneyBillWave,
  FaArrowLeft,
} from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import Script from "next/script";

// Cookie helpers
const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop().split(";").shift());
  return null;
};

const setCookie = (name, value, days = 7) => {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
};

export default function BuyNowButton({ product, business }) {
  const [showForm, setShowForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [resolvedBusiness, setResolvedBusiness] = useState(null);
  const [deliveryZones, setDeliveryZones] = useState([]);
  const [isDeliverable, setIsDeliverable] = useState(false);
  const [matchedZones, setMatchedZones] = useState([]);
  const [addressError, setAddressError] = useState("");

  // Fetch complete business data
  useEffect(() => {
    const fetchBusiness = async () => {
      if (business?.id) {
        setResolvedBusiness(business);
        return;
      }
      if (business?.slug) {
        try {
          const res = await fetch(`/api/get-business?slug=${business.slug}`);
          if (res.ok) {
            const data = await res.json();
            if (data?.id) setResolvedBusiness(data);
          }
        } catch (err) {
          console.error("Failed to fetch business:", err);
        }
      }
    };
    fetchBusiness();
  }, [business]);

  // Load saved buyer info & delivery zones
  useEffect(() => {
    const saved = getCookie("buyerInfo");
    if (saved) {
      try {
        setForm(JSON.parse(saved));
      } catch {}
    }
    const biz = resolvedBusiness || business;
    setDeliveryZones(Array.isArray(biz?.delivery_area) ? biz.delivery_area : []);
    if (typeof window !== "undefined" && window.Razorpay) {
      setRazorpayLoaded(true);
    }
  }, [business, resolvedBusiness]);

  // Check deliverability
  useEffect(() => {
    const norm = (s) => (s || "").toString().trim().toLowerCase();
    const fullAddress = norm(`${form.address} ${form.city} ${form.state} ${form.pincode}`);

    if (!fullAddress) {
      setIsDeliverable(false);
      setMatchedZones([]);
      return;
    }

    const matches = [];
    for (let zone of deliveryZones) {
      const z = norm(zone);
      if (!z) continue;
      if (/^\d+$/.test(z)) {
        if (fullAddress.includes(z)) matches.push(zone);
      } else if (fullAddress.includes(z)) {
        matches.push(zone);
      }
    }

    setMatchedZones(matches);
    setIsDeliverable(matches.length > 0);
    if (matches.length > 0) setAddressError("");
  }, [form, deliveryZones]);

  const saveBuyerCookie = (updated) => {
    try {
      setCookie("buyerInfo", JSON.stringify(updated), 365);
    } catch {}
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };
    setForm(updated);
    saveBuyerCookie(updated);
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      toast.error("Enter your name");
      return false;
    }
    if (!/^\d{10}$/.test(form.phone.trim())) {
      toast.error("Enter valid 10-digit phone");
      return false;
    }
    if (!form.address.trim()) {
      toast.error("Enter your address");
      return false;
    }
    if (!form.city.trim()) {
      toast.error("Enter your city");
      return false;
    }
    if (!form.state.trim()) {
      toast.error("Enter your state");
      return false;
    }
    if (!/^\d{6}$/.test(form.pincode.trim())) {
      toast.error("Enter valid 6-digit pincode");
      return false;
    }
    return true;
  };

  const handleBuy = () => {
    setAddressError("");
    setCurrentStep(1);
    setPaymentMethod("");
    setShowForm(true);
  };

  const proceedToPayment = () => {
    if (!validateForm()) return;
    if (!isDeliverable) {
      setAddressError("🚫 Sorry, we don't deliver to this address.");
      return;
    }
    setCurrentStep(2);
  };

  const handleFillZone = (zone) => {
    const z = zone.toString().trim();
    if (/^\d{6}$/.test(z)) {
      setForm((prev) => ({ ...prev, pincode: z }));
    } else {
      setForm((prev) => ({ ...prev, city: z }));
    }
  };

  const handleWhatsApp = () => {
    const biz = resolvedBusiness || business;
    const wa = biz?.whatsapp || biz?.phone || "";
    if (!wa) {
      toast.error("WhatsApp not available");
      return;
    }
    const msg = encodeURIComponent(
      `Hi, I want to order "${product?.name}". Address: ${form.address}, ${form.city}, ${form.state} - ${form.pincode}`
    );
    window.open(`https://wa.me/${wa.replace(/\D+/g, "")}?text=${msg}`, "_blank");
  };

  const handleBackButton = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
      return;
    }
    setShowForm(false);
    setLoading(false);
  };

  const handleCloseModal = () => {
    setShowForm(false);
    setLoading(false);
  };

  // ═══════════════════════════════════════
  // RAZORPAY PAYMENT HANDLER
  // ═══════════════════════════════════════
  const handleRazorpay = async () => {
    console.log("🚀 Starting Razorpay payment...");

    if (!razorpayLoaded) {
      toast.error("Payment system loading. Please wait...");
      return;
    }

    const biz = resolvedBusiness || business;
    if (!biz?.id) {
      toast.error("Store information missing. Please refresh.");
      return;
    }

    setLoading(true);

    try {
      const productPrice = parseFloat(product?.price) || 0;
      if (productPrice <= 0) {
        toast.error("Invalid product price");
        setLoading(false);
        return;
      }

      const orderData = {
        businessId: biz.id,
        businessSlug: biz.slug,
        amount: productPrice,
        customerName: form.name.trim(),
        customerPhone: form.phone.trim(),
        customerEmail: form.email?.trim() || null,
        productId: product?.id || null,
        productName: product?.name || product?.title || "Product",
        productImage: product?.image || null,
        productSlug: product?.slug || null,
        address: form.address.trim(),
        landmark: form.landmark?.trim() || null,
        city: form.city.trim(),
        state: form.state.trim(),
        pincode: form.pincode.trim(),
      };

      console.log("📤 Creating order...", orderData);

      const createRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const createData = await createRes.json();
      console.log("📦 Create order response:", createData);

      if (!createRes.ok || !createData.success) {
        toast.error(createData.error || "Failed to create order");
        setLoading(false);
        return;
      }

      console.log("✅ Order created:", createData.razorpayOrderId);
      console.log("💰 Breakdown:", createData.breakdown);

      const options = {
        key: createData.razorpayKeyId,
        amount: createData.amount,
        currency: createData.currency,
        name: biz?.business_name || "Store",
        description: `${orderData.productName} (Platform fee: ₹${createData.breakdown.platformFee})`,
        order_id: createData.razorpayOrderId,

        prefill: {
          name: orderData.customerName,
          email: orderData.customerEmail || "",
          contact: orderData.customerPhone,
        },

        notes: {
          internal_order_id: createData.internalOrderId,
          platform_fee: createData.breakdown.platformFee,
        },

        theme: { color: "#6366f1" },

        handler: async function (response) {
          console.log("✅ Payment successful:", response.razorpay_payment_id);

          try {
            const completeRes = await fetch("/api/payment/complete-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderMetadata: createData.orderMetadata,
              }),
            });

            const completeData = await completeRes.json();
            console.log("📝 Complete order response:", completeData);

            if (!completeRes.ok || !completeData.success) {
              console.error("❌ Complete order failed:", completeData);
              toast.warning(
                `Payment successful (ID: ${response.razorpay_payment_id}). Order processing...`,
                { duration: 10000 }
              );
            } else {
              toast.success("✅ Payment successful! Order placed.", { duration: 5000 });

              if (completeData.business?.whatsapp) {
                setTimeout(() => {
                  const msg = encodeURIComponent(
                    `🎉 New Order!\n\n` +
                      `Order: ${completeData.order?.orderId}\n` +
                      `Product: ${orderData.productName}\n` +
                      `Amount: ₹${productPrice}\n` +
                      `Platform Fee: ₹${createData.breakdown.platformFee}\n` +
                      `You Receive: ₹${createData.breakdown.sellerAmount}\n\n` +
                      `Customer: ${orderData.customerName}\n` +
                      `Phone: ${orderData.customerPhone}\n` +
                      `Address: ${orderData.address}, ${orderData.city}`
                  );
                  window.open(
                    `https://wa.me/${completeData.business.whatsapp.replace(/\D+/g, "")}?text=${msg}`,
                    "_blank"
                  );
                }, 1000);
              }
            }

            setShowForm(false);
          } catch (err) {
            console.error("❌ Handler error:", err);
            toast.warning(`Payment done! ID: ${response.razorpay_payment_id}. Save this.`);
            setShowForm(false);
          }
        },

        modal: {
          ondismiss: () => {
            console.log("❌ Payment cancelled by user");
            setLoading(false);
            toast.info("Payment cancelled");
          },
        },
      };

      console.log("🔓 Opening Razorpay checkout...");
      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", (response) => {
        console.error("❌ Payment failed:", response.error);
        toast.error(`Payment failed: ${response.error.description || "Please try again"}`);
        setLoading(false);
      });

      razorpay.open();
      setLoading(false);
    } catch (err) {
      console.error("❌ Razorpay error:", err);
      toast.error("Payment failed: " + err.message);
      setLoading(false);
    }
  };

  // ═══════════════════════════════════════
  // COD HANDLER
  // ═══════════════════════════════════════
  const handleCOD = async () => {
    const biz = resolvedBusiness || business;
    if (!biz?.id) {
      toast.error("Store info missing");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/payment/cod-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: biz.id,
          businessSlug: biz.slug,
          customerName: form.name.trim(),
          customerPhone: form.phone.trim(),
          customerEmail: form.email?.trim(),
          address: form.address.trim(),
          landmark: form.landmark?.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          pincode: form.pincode.trim(),
          productId: product?.id,
          productName: product?.name || product?.title,
          productPrice: product?.price,
          productImage: product?.image,
          productSlug: product?.slug,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.error || "Order failed");
        return;
      }

      toast.success("✅ Order placed! Pay on delivery.");
      setShowForm(false);

      const wa = biz?.whatsapp || biz?.phone;
      if (wa) {
        setTimeout(() => {
          const msg = encodeURIComponent(
            `🛒 New COD Order!\n\nOrder: ${data.order?.order_id}\nProduct: ${product?.name}\nAmount: ₹${product?.price}\n\nCustomer: ${form.name}\nPhone: ${form.phone}`
          );
          window.open(`https://wa.me/${wa.replace(/\D+/g, "")}?text=${msg}`, "_blank");
        }, 500);
      }
    } catch (err) {
      console.error("COD error:", err);
      toast.error("Order failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ═══════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════
  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => {
          console.log("✅ Razorpay script loaded");
          setRazorpayLoaded(true);
        }}
        onError={() => {
          console.error("❌ Razorpay script failed to load");
          toast.error("Payment system failed to load");
        }}
      />

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
            className="fixed inset-0 z-[2147483647] bg-black/60 flex items-center justify-center p-2 sm:p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) handleCloseModal();
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-zinc-800 flex flex-col"
              style={{ maxHeight: "min(90vh, 700px)" }}
            >
              {/* ═══════════════════════════════════════ */}
              {/* STICKY HEADER */}
              {/* ═══════════════════════════════════════ */}
              <div
                className="flex-shrink-0 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 rounded-t-2xl"
                style={{ paddingTop: "max(0.5rem, env(safe-area-inset-top))" }}
              >
                {/* Header Row */}
                <div className="flex items-center justify-between px-4 py-3">
                  <button
                    type="button"
                    onClick={handleBackButton}
                    className="flex items-center justify-center h-9 w-9 rounded-full
                               bg-gray-100 dark:bg-zinc-800
                               border border-gray-200 dark:border-zinc-700
                               text-indigo-600 dark:text-indigo-400
                               hover:bg-gray-200 dark:hover:bg-zinc-700 transition"
                    aria-label={currentStep === 2 ? "Back to delivery details" : "Close checkout"}
                  >
                    <FaArrowLeft className="text-sm" />
                  </button>

                  <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {currentStep === 1 ? "📦 Delivery Details" : "💳 Payment"}
                  </div>

                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex items-center justify-center h-9 w-9 rounded-full
                               bg-gray-100 dark:bg-zinc-800
                               border border-gray-200 dark:border-zinc-700
                               text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                    aria-label="Close"
                  >
                    <IoClose className="text-lg" />
                  </button>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center justify-center pb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        currentStep >= 1 ? "bg-indigo-600 text-white" : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      1
                    </div>
                    <div className={`w-12 h-1 rounded ${currentStep >= 2 ? "bg-indigo-600" : "bg-gray-300"}`} />
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        currentStep >= 2 ? "bg-indigo-600 text-white" : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      2
                    </div>
                  </div>
                </div>
              </div>

              {/* ═══════════════════════════════════════ */}
              {/* SCROLLABLE CONTENT */}
              {/* ═══════════════════════════════════════ */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5">
                {/* STEP 1: Delivery Details */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                          Full Name *
                        </label>
                        <input
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className="w-full p-2.5 text-sm border rounded-lg dark:bg-zinc-800 dark:text-white dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                          Phone *
                        </label>
                        <input
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="9876543210"
                          maxLength={10}
                          className="w-full p-2.5 text-sm border rounded-lg dark:bg-zinc-800 dark:text-white dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                          Email
                        </label>
                        <input
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          className="w-full p-2.5 text-sm border rounded-lg dark:bg-zinc-800 dark:text-white dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                          Address *
                        </label>
                        <textarea
                          name="address"
                          value={form.address}
                          onChange={handleChange}
                          placeholder="House/Flat No., Street"
                          rows={2}
                          className="w-full p-2.5 text-sm border rounded-lg dark:bg-zinc-800 dark:text-white dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                          Landmark
                        </label>
                        <input
                          name="landmark"
                          value={form.landmark}
                          onChange={handleChange}
                          placeholder="Near XYZ Mall"
                          className="w-full p-2.5 text-sm border rounded-lg dark:bg-zinc-800 dark:text-white dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                          City *
                        </label>
                        <input
                          name="city"
                          value={form.city}
                          onChange={handleChange}
                          placeholder="Mumbai"
                          className="w-full p-2.5 text-sm border rounded-lg dark:bg-zinc-800 dark:text-white dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                          State *
                        </label>
                        <input
                          name="state"
                          value={form.state}
                          onChange={handleChange}
                          placeholder="Maharashtra"
                          className="w-full p-2.5 text-sm border rounded-lg dark:bg-zinc-800 dark:text-white dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                          Pincode *
                        </label>
                        <input
                          name="pincode"
                          value={form.pincode}
                          onChange={handleChange}
                          placeholder="400001"
                          maxLength={6}
                          className="w-full p-2.5 text-sm border rounded-lg dark:bg-zinc-800 dark:text-white dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {addressError && (
                      <p className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
                        {addressError}
                      </p>
                    )}

                    {matchedZones.length > 0 && (
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <p className="text-sm text-green-700 dark:text-green-300">
                          ✅ Delivery available to your area
                        </p>
                      </div>
                    )}

                    {deliveryZones.length > 0 && matchedZones.length === 0 && (
                      <div className="p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          📍 We deliver to:
                        </p>
                        <div className="flex flex-wrap gap-1.5 max-h-20 overflow-auto">
                          {deliveryZones.slice(0, 20).map((z) => (
                            <button
                              type="button"
                              key={z}
                              onClick={() => handleFillZone(z)}
                              className="px-2 py-1 text-xs bg-gray-200 dark:bg-zinc-700 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition"
                            >
                              {z}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 2: Payment */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-lg">
                      <p className="font-medium text-sm dark:text-white">Order Summary</p>
                      <div className="mt-2 text-sm dark:text-gray-300">
                        <p className="truncate">Product: {product?.name}</p>
                        <p className="text-lg font-bold text-indigo-600 mt-1">Total: ₹{product?.price}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Platform fee (5%): ₹{(product?.price * 0.05).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("razorpay")}
                        className={`w-full p-3 border-2 rounded-xl text-left transition ${
                          paymentMethod === "razorpay"
                            ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
                            : "border-gray-200 dark:border-zinc-700 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <FaCreditCard className="text-xl text-indigo-600" />
                          <div>
                            <p className="font-semibold text-sm dark:text-white">Pay Online</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Card, UPI, Net Banking</p>
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("cod")}
                        className={`w-full p-3 border-2 rounded-xl text-left transition ${
                          paymentMethod === "cod"
                            ? "border-green-600 bg-green-50 dark:bg-green-900/20"
                            : "border-gray-200 dark:border-zinc-700 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <FaMoneyBillWave className="text-xl text-green-600" />
                          <div>
                            <p className="font-semibold text-sm dark:text-white">Cash on Delivery</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Pay when you receive</p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* ═══════════════════════════════════════ */}
              {/* STICKY FOOTER */}
              {/* ═══════════════════════════════════════ */}
              <div
                className="flex-shrink-0 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 rounded-b-2xl p-4"
                style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
              >
                {currentStep === 1 && (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                      type="button"
                      onClick={handleWhatsApp}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition"
                    >
                      <FaWhatsapp /> WhatsApp
                    </button>
                    <button
                      type="button"
                      onClick={proceedToPayment}
                      disabled={!isDeliverable}
                      className={`flex-1 px-4 py-2.5 rounded-lg text-white text-sm font-medium transition ${
                        isDeliverable
                          ? "bg-indigo-600 hover:bg-indigo-700"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Continue →
                    </button>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 transition"
                    >
                      ← Back
                    </button>

                    <button
                      type="button"
                      onClick={paymentMethod === "razorpay" ? handleRazorpay : handleCOD}
                      disabled={!paymentMethod || loading}
                      className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-white text-sm font-medium transition ${
                        paymentMethod && !loading
                          ? paymentMethod === "razorpay"
                            ? "bg-indigo-600 hover:bg-indigo-700"
                            : "bg-green-600 hover:bg-green-700"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {loading
                        ? "Processing..."
                        : paymentMethod === "razorpay"
                        ? "Pay Now"
                        : paymentMethod === "cod"
                        ? "Place Order"
                        : "Select Payment"}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}