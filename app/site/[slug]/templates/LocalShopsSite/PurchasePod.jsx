"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Loader2, Check, X, CreditCard, MapPin, Minus, Plus } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

export default function PurchasePod({ product, business }) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    size: product.sizes?.[0] || "M",
    quantity: 1,
  });

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const calculateTotal = () => {
    const basePrice = parseFloat(product.price);
    const total = basePrice * formData.quantity;
    return total.toFixed(2);
  };

  const validateForm = () => {
    const required = ["name", "email", "phone", "address", "city", "state", "zipCode"];

    for (let field of required) {
      if (!formData[field]?.trim()) {
        setError(`${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} is required`);
        return false;
      }
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email");
      return false;
    }

    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      setError("Please enter a valid 10-digit phone number");
      return false;
    }

    if (!/^\d{6}$/.test(formData.zipCode)) {
      setError("Please enter a valid 6-digit PIN code");
      return false;
    }

    return true;
  };

  // ✅ Save order to Supabase
  const saveOrderToSupabase = async (paymentData) => {
    try {
      const totalAmount = calculateTotal();
      const generatedOrderId = `POD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const orderDetails = {
        orderId: generatedOrderId,
        orderType: "POD",
        product: {
          id: product.id,
          name: product.name,
          slug: product.slug,
          image: product.image,
          price: product.price,
          printfulVariantId: product.printfulVariantId || null,
        },
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
        orderDetails: {
          size: formData.size,
          quantity: formData.quantity,
          totalAmount: totalAmount,
        },
        payment: {
          paymentId: paymentData.razorpay_payment_id,
          orderId: paymentData.razorpay_order_id,
          signature: paymentData.razorpay_signature,
          status: "paid",
          method: "razorpay",
        },
        status: "pending",
        printfulStatus: "not_sent",
        created_at: new Date().toISOString(),
        business_id: business.id,
        business_name: business.name,
      };

      console.log("💾 Saving POD order to Supabase:", generatedOrderId);

      const { data: businessData, error: fetchError } = await supabase
        .from("businesses")
        .select("orders")
        .eq("id", business.id)
        .single();

      if (fetchError) {
        console.error("❌ Fetch error:", fetchError);
        throw new Error("Failed to fetch business data");
      }

      const updatedOrders = [...(businessData?.orders || []), orderDetails];

      const { error: updateError } = await supabase
        .from("businesses")
        .update({ orders: updatedOrders })
        .eq("id", business.id);

      if (updateError) {
        console.error("❌ Update error:", updateError);
        throw new Error("Failed to save order");
      }

      console.log("✅ POD Order saved successfully to Supabase!");
      return generatedOrderId;

    } catch (error) {
      console.error("❌ Supabase Save Error:", error);
      throw error;
    }
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);

      const totalAmount = calculateTotal();

      console.log("💰 Creating payment for:", totalAmount);

      const orderResponse = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(totalAmount),
          currency: "INR",
          receipt: `pod_${Date.now()}`,
          notes: {
            product: product.name,
            business: business.name,
            quantity: formData.quantity,
            size: formData.size,
            orderType: "POD",
          },
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.error || "Failed to create payment order");
      }

      console.log("✅ Razorpay order created:", orderData.orderId);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: "INR",
        name: business.name,
        description: `POD: ${product.name} - ${formData.size} (${formData.quantity}x)`,
        image: business.logo || product.image,
        order_id: orderData.orderId,

        handler: async function (response) {
          try {
            console.log("💳 Payment successful! Verifying...");

            const verifyResponse = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });

            const verifyData = await verifyResponse.json();

            if (!verifyData.success) {
              throw new Error("Payment verification failed");
            }

            console.log("✅ Payment verified!");

            // ✅✅✅ SAVE TO SUPABASE (NOT PRINTFUL) ✅✅✅
            const savedOrderId = await saveOrderToSupabase(response);

            console.log("✅ Order saved with ID:", savedOrderId);

            setOrderId(savedOrderId);
            setShowSuccess(true);
            setShowForm(false);

            toast.success("Order placed successfully!");

            // WhatsApp notification
            if (business.phone || business.whatsapp_number) {
              const whatsappNumber = business.whatsapp_number || business.phone;
              const message = `🎉 NEW POD ORDER!\n\n✅ Order ID: ${savedOrderId}\n📦 Product: ${product.name}\n📏 Size: ${formData.size}\n🔢 Qty: ${formData.quantity}\n👤 Customer: ${formData.name}\n📧 Email: ${formData.email}\n📱 Phone: ${formData.phone}\n💰 Paid: ₹${totalAmount}\n\n📍 Shipping:\n${formData.address}\n${formData.city}, ${formData.state} - ${formData.zipCode}\n\n⚠️ ACTION: Process this order in Printful manually`;

              setTimeout(() => {
                window.open(
                  `https://wa.me/${whatsappNumber.replace(/\D+/g, "")}?text=${encodeURIComponent(message)}`,
                  "_blank"
                );
              }, 1500);
            }

          } catch (err) {
            console.error("❌ Post-payment error:", err);
            setError(err.message);
            toast.error(err.message || "Failed to save order");
          } finally {
            setLoading(false);
          }
        },

        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },

        theme: {
          color: "#EAB308",
        },

        modal: {
          ondismiss: function () {
            setLoading(false);
            setError("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (err) {
      console.error("❌ Payment Error:", err);
      setError(err.message);
      setLoading(false);
      toast.error(err.message || "Payment failed");
    }
  };

  const totalAmount = calculateTotal();

  if (showSuccess) {
    return (
      <div className="bg-gradient-to-br from-green-950 to-gray-900 border-2 border-green-500 rounded-2xl p-8 text-center">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <Check className="text-white" size={40} />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">🎉 Order Confirmed!</h2>
        <div className="bg-gray-900 rounded-xl p-4 mb-4">
          <p className="text-gray-400 text-sm mb-1">Order ID</p>
          <p className="text-yellow-500 font-mono font-bold text-lg">{orderId}</p>
        </div>
        <p className="text-gray-300 mb-4">
          Confirmation sent to <span className="text-green-400 font-semibold">{formData.email}</span>
        </p>
        <div className="bg-blue-950 border border-blue-800 rounded-xl p-4 mb-6 text-sm text-left text-blue-300 space-y-1">
          <p>✅ Payment successful - ₹{totalAmount}</p>
          <p>📦 Order saved in your dashboard</p>
          <p>📧 You'll receive updates via email</p>
          <p>⏱️ We'll process your order within 24 hours</p>
        </div>
        <button
          onClick={() => {
            setShowSuccess(false);
            setFormData({ ...formData, quantity: 1 });
          }}
          className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-4 rounded-xl font-bold transition-all w-full"
        >
          Order Another Product
        </button>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="space-y-6">
        {error && (
          <div className="bg-red-950 border border-red-500 rounded-xl p-4 flex items-center gap-3">
            <X className="text-red-500 flex-shrink-0" size={20} />
            <p className="text-red-400 text-sm flex-1">{error}</p>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300">
              <X size={16} />
            </button>
          </div>
        )}

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
            <MapPin size={20} className="text-yellow-500" />
            Shipping Address
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <input
                type="email"
                placeholder="Email *"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <input
              type="tel"
              placeholder="Phone Number (10 digits) *"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              maxLength="10"
            />

            <textarea
              placeholder="Complete Address *"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              rows="3"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="City *"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <input
                type="text"
                placeholder="State *"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <input
                type="text"
                placeholder="PIN Code *"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                maxLength="6"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {product.sizes && (
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Select Size *</label>
                  <select
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    {product.sizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="text-gray-400 text-sm mb-2 block">Quantity</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFormData({ ...formData, quantity: Math.max(1, formData.quantity - 1) })}
                    className="w-12 h-12 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold transition-colors"
                  >
                    <Minus size={16} className="mx-auto" />
                  </button>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                    className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 text-center font-bold focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    min="1"
                  />
                  <button
                    onClick={() => setFormData({ ...formData, quantity: formData.quantity + 1 })}
                    className="w-12 h-12 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold transition-colors"
                  >
                    <Plus size={16} className="mx-auto" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-yellow-500 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm">Total Amount</p>
              <p className="text-white text-4xl font-bold">₹{totalAmount}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm">{formData.quantity} × ₹{product.price}</p>
              <p className="text-yellow-500 text-sm font-semibold mt-1">All inclusive</p>
            </div>
          </div>
          <div className="bg-blue-950 border border-blue-700 rounded-lg p-3 text-xs text-blue-200">
            💡 Order will be saved to your dashboard. Process manually in Printful.
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowForm(false)}
            disabled={loading}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-6 py-4 rounded-xl font-bold transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-black px-6 py-4 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Processing...
              </>
            ) : (
              <>
                <CreditCard size={20} />
                Pay ₹{totalAmount}
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowForm(true)}
      className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-black px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-yellow-500/50"
    >
      <ShoppingBag size={20} />
      Buy Now - ₹{product.price}
    </button>
  );
}