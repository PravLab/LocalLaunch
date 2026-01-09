"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useBusiness } from "@/src/context/BusinessContext";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft } from "lucide-react";
import {
  FaWhatsapp,
  FaCreditCard,
  FaMoneyBillWave,
  FaArrowLeft,
} from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
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

export default function CartPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { business, setBusiness } = useBusiness();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingItem, setRemovingItem] = useState(null);

  // Checkout Modal States (same as BuyNowButton)
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState([]);
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
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [resolvedBusiness, setResolvedBusiness] = useState(null);
  const [deliveryZones, setDeliveryZones] = useState([]);
  const [isDeliverable, setIsDeliverable] = useState(false);
  const [matchedZones, setMatchedZones] = useState([]);
  const [addressError, setAddressError] = useState("");

  // Business-specific cart key
  const getCartKey = useCallback(() => {
    return business?.slug ? `cart_${business.slug}` : null;
  }, [business?.slug]);

  const updateCart = useCallback(() => {
    const cartKey = getCartKey();
    if (!cartKey) return;
    const cart = JSON.parse(localStorage.getItem(cartKey) || "[]");
    setCartItems(cart);
  }, [getCartKey]);

  // Load business from localStorage if not in context
  useEffect(() => {
    if (!business) {
      const stored = localStorage.getItem("business");
      if (stored) {
        const parsed = JSON.parse(stored);
        setBusiness(parsed);
        setResolvedBusiness(parsed);
      }
    } else {
      setResolvedBusiness(business);
    }
  }, [business, setBusiness]);

  // Fetch complete business data if needed
  useEffect(() => {
    const fetchBusiness = async () => {
      if (resolvedBusiness?.id) return;
      
      if (slug) {
        try {
          const res = await fetch(`/api/get-business?slug=${slug}`);
          if (res.ok) {
            const data = await res.json();
            if (data?.id) {
              setResolvedBusiness(data);
              setBusiness(data);
            }
          }
        } catch (err) {
          console.error("Failed to fetch business:", err);
        }
      }
    };
    fetchBusiness();
  }, [slug, resolvedBusiness, setBusiness]);

  // Load cart and buyer info
  useEffect(() => {
    if (resolvedBusiness?.slug) {
      updateCart();
      setLoading(false);

      // Load saved buyer info
      const saved = getCookie("buyerInfo");
      if (saved) {
        try {
          setForm(JSON.parse(saved));
        } catch {}
      }

      // Set delivery zones
      setDeliveryZones(Array.isArray(resolvedBusiness?.delivery_area) ? resolvedBusiness.delivery_area : []);
    }
  }, [resolvedBusiness, updateCart]);

  // Check Razorpay loaded
  useEffect(() => {
    if (typeof window !== "undefined" && window.Razorpay) {
      setRazorpayLoaded(true);
    }
  }, []);

  // Check deliverability (same as BuyNowButton)
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

  const updateQuantity = (productId, newQuantity) => {
    const cartKey = getCartKey();
    if (!cartKey) return;

    const cart = JSON.parse(localStorage.getItem(cartKey) || "[]");
    const itemIndex = cart.findIndex((item) => item.id === productId);

    if (itemIndex !== -1) {
      if (newQuantity <= 0) {
        cart.splice(itemIndex, 1);
      } else {
        cart[itemIndex].quantity = newQuantity;
      }
      localStorage.setItem(cartKey, JSON.stringify(cart));
      window.dispatchEvent(new CustomEvent("cartUpdated", { detail: { slug: resolvedBusiness?.slug } }));
      updateCart();
    }
  };

  const removeItem = (productId) => {
    setRemovingItem(productId);
    setTimeout(() => {
      const cartKey = getCartKey();
      if (!cartKey) return;

      const cart = JSON.parse(localStorage.getItem(cartKey) || "[]");
      const filteredCart = cart.filter((item) => item.id !== productId);
      localStorage.setItem(cartKey, JSON.stringify(filteredCart));
      window.dispatchEvent(new CustomEvent("cartUpdated", { detail: { slug: resolvedBusiness?.slug } }));
      updateCart();
      setRemovingItem(null);
    }, 300);
  };

  const getCheckoutTotal = () => {
    return checkoutItems.reduce((total, item) => {
      return total + (Number(item.price) || 0) * (item.quantity || 1);
    }, 0);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (Number(item.price) || 0) * (item.quantity || 1);
    }, 0);
  };

  // Open checkout modal
  const openCheckout = (items) => {
    setCheckoutItems(Array.isArray(items) ? items : [items]);
    setCurrentStep(1);
    setPaymentMethod("");
    setAddressError("");
    setCheckoutOpen(true);
  };

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

  const proceedToPayment = () => {
    if (!validateForm()) return;
    
    // Check delivery zones (same as BuyNowButton)
    if (deliveryZones.length > 0 && !isDeliverable) {
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

  const handleBackButton = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
      return;
    }
    setCheckoutOpen(false);
    setCheckoutLoading(false);
  };

  const handleCloseModal = () => {
    setCheckoutOpen(false);
    setCheckoutLoading(false);
  };

  const handleWhatsApp = () => {
    const biz = resolvedBusiness;
    const wa = biz?.whatsapp || biz?.phone || "";
    if (!wa) {
      toast.error("WhatsApp not available");
      return;
    }
    const itemsList = checkoutItems
      .map((item) => `• ${item.name} x${item.quantity} - ₹${(item.price * item.quantity).toLocaleString("en-IN")}`)
      .join("\n");
    const msg = encodeURIComponent(
      `Hi, I want to place an order:\n\n${itemsList}\n\nTotal: ₹${getCheckoutTotal().toLocaleString("en-IN")}\n\nDelivery Address: ${form.address}, ${form.city}, ${form.state} - ${form.pincode}\nPhone: ${form.phone}`
    );
    window.open(`https://wa.me/${wa.replace(/\D+/g, "")}?text=${msg}`, "_blank");
  };

  const clearCheckedOutItems = () => {
    const cartKey = getCartKey();
    if (!cartKey) return;

    const cart = JSON.parse(localStorage.getItem(cartKey) || "[]");
    const checkoutIds = checkoutItems.map((item) => item.id);
    const remainingCart = cart.filter((item) => !checkoutIds.includes(item.id));
    localStorage.setItem(cartKey, JSON.stringify(remainingCart));
    window.dispatchEvent(new CustomEvent("cartUpdated", { detail: { slug: resolvedBusiness?.slug } }));
    updateCart();
  };

  // Razorpay Handler (same logic as BuyNowButton but for multiple items)
  const handleRazorpay = async () => {
    if (!razorpayLoaded) {
      toast.error("Payment system loading. Please wait...");
      return;
    }

    const biz = resolvedBusiness;
    if (!biz?.id) {
      toast.error("Store information missing. Please refresh.");
      return;
    }

    setCheckoutLoading(true);

    try {
      const totalPrice = getCheckoutTotal();
      if (totalPrice <= 0) {
        toast.error("Invalid cart total");
        setCheckoutLoading(false);
        return;
      }

      // Build order data - same structure as BuyNowButton
      const orderData = {
        businessId: biz.id,
        businessSlug: biz.slug,
        amount: totalPrice,
        customerName: form.name.trim(),
        customerPhone: form.phone.trim(),
        customerEmail: form.email?.trim() || null,
        // For single item, use product fields; for multiple, use items array
        productId: checkoutItems.length === 1 ? checkoutItems[0].id : null,
        productName: checkoutItems.length === 1 
          ? checkoutItems[0].name 
          : `Order (${checkoutItems.length} items)`,
        productImage: checkoutItems.length === 1 ? checkoutItems[0].image : null,
        productSlug: checkoutItems.length === 1 ? checkoutItems[0].slug : null,
        items: checkoutItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
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
        setCheckoutLoading(false);
        return;
      }

      console.log("✅ Order created:", createData.razorpayOrderId);

      const options = {
        key: createData.razorpayKeyId,
        amount: createData.amount,
        currency: createData.currency,
        name: biz?.business_name || "Store",
        description: checkoutItems.length === 1 
          ? `${checkoutItems[0].name}` 
          : `Order - ${checkoutItems.length} items`,
        order_id: createData.razorpayOrderId,
        prefill: {
          name: form.name.trim(),
          email: form.email?.trim() || "",
          contact: form.phone.trim(),
        },
        notes: {
          internal_order_id: createData.internalOrderId,
          platform_fee: createData.breakdown?.platformFee,
        },
        theme: { color: "#16a34a" },
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
              clearCheckedOutItems();

              // WhatsApp notification to seller
              if (completeData.business?.whatsapp) {
                setTimeout(() => {
                  const itemsList = checkoutItems
                    .map((item) => `• ${item.name} x${item.quantity} - ₹${item.price * item.quantity}`)
                    .join("\n");
                  const msg = encodeURIComponent(
                    `🎉 New Order!\n\nOrder: ${completeData.order?.orderId}\n\n${itemsList}\n\nTotal: ₹${totalPrice}\n\nCustomer: ${form.name}\nPhone: ${form.phone}\nAddress: ${form.address}, ${form.city}`
                  );
                  window.open(
                    `https://wa.me/${completeData.business.whatsapp.replace(/\D+/g, "")}?text=${msg}`,
                    "_blank"
                  );
                }, 1000);
              }
            }

            setCheckoutOpen(false);
          } catch (err) {
            console.error("❌ Handler error:", err);
            toast.warning(`Payment done! ID: ${response.razorpay_payment_id}. Save this.`);
            setCheckoutOpen(false);
          }
        },
        modal: {
          ondismiss: () => {
            console.log("❌ Payment cancelled by user");
            setCheckoutLoading(false);
            toast.info("Payment cancelled");
          },
        },
      };

      console.log("🔓 Opening Razorpay checkout...");
      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", (response) => {
        console.error("❌ Payment failed:", response.error);
        toast.error(`Payment failed: ${response.error.description || "Please try again"}`);
        setCheckoutLoading(false);
      });

      razorpay.open();
      setCheckoutLoading(false);
    } catch (err) {
      console.error("❌ Razorpay error:", err);
      toast.error("Payment failed: " + err.message);
      setCheckoutLoading(false);
    }
  };

  // COD Handler (same logic as BuyNowButton but for multiple items)
  const handleCOD = async () => {
    const biz = resolvedBusiness;
    if (!biz?.id) {
      toast.error("Store info missing");
      return;
    }

    setCheckoutLoading(true);
    try {
      const totalPrice = getCheckoutTotal();

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
          // For single item
          productId: checkoutItems.length === 1 ? checkoutItems[0].id : null,
          productName: checkoutItems.length === 1 ? checkoutItems[0].name : `Order (${checkoutItems.length} items)`,
          productPrice: checkoutItems.length === 1 ? checkoutItems[0].price : totalPrice,
          productImage: checkoutItems.length === 1 ? checkoutItems[0].image : null,
          productSlug: checkoutItems.length === 1 ? checkoutItems[0].slug : null,
          // For multiple items
          items: checkoutItems.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          totalAmount: totalPrice,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.error || "Order failed");
        return;
      }

      toast.success("✅ Order placed! Pay on delivery.");
      clearCheckedOutItems();
      setCheckoutOpen(false);

      // WhatsApp notification
      const wa = biz?.whatsapp || biz?.phone;
      if (wa) {
        setTimeout(() => {
          const itemsList = checkoutItems
            .map((item) => `• ${item.name} x${item.quantity}`)
            .join("\n");
          const msg = encodeURIComponent(
            `🛒 New COD Order!\n\nOrder: ${data.order?.order_id}\n\n${itemsList}\n\nTotal: ₹${totalPrice}\n\nCustomer: ${form.name}\nPhone: ${form.phone}`
          );
          window.open(`https://wa.me/${wa.replace(/\D+/g, "")}?text=${msg}`, "_blank");
        }, 500);
      }
    } catch (err) {
      console.error("COD error:", err);
      toast.error("Order failed. Try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

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

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-green-700 text-white shadow-lg">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <button onClick={() => router.back()} className="hover:bg-green-600 p-2 rounded-full transition">
                <ArrowLeft size={22} />
              </button>
              <div className="flex items-center gap-2">
                <ShoppingCart size={24} />
                <h1 className="text-xl font-bold">Cart ({cartItems.length})</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6">
          {cartItems.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-8 text-center">
              <ShoppingCart size={48} className="text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-500 mb-6">Add items to get started</p>
              <Link
                href={`/site/${slug}`}
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2.5 rounded-lg transition"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Cart Items */}
              {cartItems.map((item) => {
                const isRemoving = removingItem === item.id;
                return (
                  <div
                    key={item.id}
                    className={`bg-white rounded-xl shadow p-4 transition-all duration-300 ${
                      isRemoving ? "opacity-0 scale-95" : "opacity-100"
                    }`}
                  >
                    <div className="flex gap-3">
                      <Link
                        href={`/site/${slug}/product/${item.slug || item.id}`}
                        className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden"
                      >
                        <Image
                          src={item.image || "/placeholder.jpg"}
                          alt={item.name}
                          fill
                          className="object-contain p-1"
                        />
                      </Link>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-2">
                          <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition flex-shrink-0"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <p className="text-green-600 font-bold text-lg">
                          ₹{Number(item.price).toLocaleString("en-IN")}
                        </p>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1 bg-gray-100 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1.5 hover:bg-gray-200 rounded-l-lg transition"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="font-semibold px-3 min-w-[2.5rem] text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1.5 hover:bg-gray-200 rounded-r-lg transition"
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          <button
                            onClick={() => openCheckout(item)}
                            className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
                          >
                            Buy Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Order Summary */}
              <div className="bg-white rounded-xl shadow p-4 mt-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Total ({cartItems.length} items)</span>
                  <span className="text-2xl font-bold text-green-700">
                    ₹{getCartTotal().toLocaleString("en-IN")}
                  </span>
                </div>

                <button
                  onClick={() => openCheckout(cartItems)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={20} />
                  Checkout All
                </button>

                <Link
                  href={`/site/${slug}`}
                  className="block w-full text-center text-green-600 font-semibold py-2 mt-2"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════ */}
      {/* CHECKOUT MODAL (Same as BuyNowButton) */}
      {/* ═══════════════════════════════════════ */}
      <AnimatePresence>
        {checkoutOpen && (
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
              {/* STICKY HEADER */}
              <div
                className="flex-shrink-0 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 rounded-t-2xl"
                style={{ paddingTop: "max(0.5rem, env(safe-area-inset-top))" }}
              >
                <div className="flex items-center justify-between px-4 py-3">
                  <button
                    type="button"
                    onClick={handleBackButton}
                    className="flex items-center justify-center h-9 w-9 rounded-full bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-green-600 dark:text-green-400 hover:bg-gray-200 dark:hover:bg-zinc-700 transition"
                  >
                    <FaArrowLeft className="text-sm" />
                  </button>
                  <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {currentStep === 1 ? "📦 Delivery Details" : "💳 Payment"}
                  </div>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex items-center justify-center h-9 w-9 rounded-full bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                  >
                    <IoClose className="text-lg" />
                  </button>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center justify-center pb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${currentStep >= 1 ? "bg-green-600 text-white" : "bg-gray-300 text-gray-600"}`}>1</div>
                    <div className={`w-12 h-1 rounded ${currentStep >= 2 ? "bg-green-600" : "bg-gray-300"}`} />
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${currentStep >= 2 ? "bg-green-600 text-white" : "bg-gray-300 text-gray-600"}`}>2</div>
                  </div>
                </div>
              </div>

              {/* SCROLLABLE CONTENT */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5">
                {/* STEP 1: Delivery Details */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    {/* Order Summary */}
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <p className="font-semibold text-sm text-green-800 dark:text-green-300">
                        🛒 {checkoutItems.length} item{checkoutItems.length > 1 ? "s" : ""} • ₹{getCheckoutTotal().toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Full Name *</label>
                        <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" className="w-full p-2.5 text-sm border rounded-lg dark:bg-zinc-800 dark:text-white dark:border-zinc-700 focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Phone *</label>
                        <input name="phone" value={form.phone} onChange={handleChange} placeholder="9876543210" maxLength={10} className="w-full p-2.5 text-sm border rounded-lg dark:bg-zinc-800 dark:text-white dark:border-zinc-700 focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Email</label>
                        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@example.com" className="w-full p-2.5 text-sm border rounded-lg dark:bg-zinc-800 dark:text-white dark:border-zinc-700 focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Address *</label>
                        <textarea name="address" value={form.address} onChange={handleChange} placeholder="House/Flat No., Street" rows={2} className="w-full p-2.5 text-sm border rounded-lg dark:bg-zinc-800 dark:text-white dark:border-zinc-700 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Landmark</label>
                        <input name="landmark" value={form.landmark} onChange={handleChange} placeholder="Near XYZ Mall" className="w-full p-2.5 text-sm border rounded-lg dark:bg-zinc-800 dark:text-white dark:border-zinc-700 focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">City *</label>
                        <input name="city" value={form.city} onChange={handleChange} placeholder="Mumbai" className="w-full p-2.5 text-sm border rounded-lg dark:bg-zinc-800 dark:text-white dark:border-zinc-700 focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">State *</label>
                        <input name="state" value={form.state} onChange={handleChange} placeholder="Maharashtra" className="w-full p-2.5 text-sm border rounded-lg dark:bg-zinc-800 dark:text-white dark:border-zinc-700 focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Pincode *</label>
                        <input name="pincode" value={form.pincode} onChange={handleChange} placeholder="400001" maxLength={6} className="w-full p-2.5 text-sm border rounded-lg dark:bg-zinc-800 dark:text-white dark:border-zinc-700 focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                      </div>
                    </div>

                    {addressError && (
                      <p className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">{addressError}</p>
                    )}

                    {matchedZones.length > 0 && (
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <p className="text-sm text-green-700 dark:text-green-300">✅ Delivery available to your area</p>
                      </div>
                    )}

                    {deliveryZones.length > 0 && matchedZones.length === 0 && (
                      <div className="p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">📍 We deliver to:</p>
                        <div className="flex flex-wrap gap-1.5 max-h-20 overflow-auto">
                          {deliveryZones.slice(0, 20).map((z) => (
                            <button
                              type="button"
                              key={z}
                              onClick={() => handleFillZone(z)}
                              className="px-2 py-1 text-xs bg-gray-200 dark:bg-zinc-700 rounded-full hover:bg-green-200 dark:hover:bg-green-900/50 transition"
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
                      <div className="mt-2 space-y-1">
                        {checkoutItems.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                            <span className="truncate">{item.name} ×{item.quantity}</span>
                            <span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                          </div>
                        ))}
                        <div className="border-t border-gray-200 dark:border-zinc-700 pt-2 mt-2">
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-800 dark:text-white">Total</span>
                            <span className="text-lg font-bold text-green-600">₹{getCheckoutTotal().toLocaleString("en-IN")}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("razorpay")}
                        className={`w-full p-3 border-2 rounded-xl text-left transition ${paymentMethod === "razorpay" ? "border-green-600 bg-green-50 dark:bg-green-900/20" : "border-gray-200 dark:border-zinc-700 hover:border-gray-300"}`}
                      >
                        <div className="flex items-center gap-3">
                          <FaCreditCard className="text-xl text-green-600" />
                          <div>
                            <p className="font-semibold text-sm dark:text-white">Pay Online</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Card, UPI, Net Banking</p>
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("cod")}
                        className={`w-full p-3 border-2 rounded-xl text-left transition ${paymentMethod === "cod" ? "border-amber-600 bg-amber-50 dark:bg-amber-900/20" : "border-gray-200 dark:border-zinc-700 hover:border-gray-300"}`}
                      >
                        <div className="flex items-center gap-3">
                          <FaMoneyBillWave className="text-xl text-amber-600" />
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

              {/* STICKY FOOTER */}
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
                      className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition"
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
                      disabled={!paymentMethod || checkoutLoading}
                      className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-white text-sm font-medium transition ${
                        paymentMethod && !checkoutLoading
                          ? paymentMethod === "razorpay"
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-amber-600 hover:bg-amber-700"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {checkoutLoading ? "Processing..." : paymentMethod === "razorpay" ? "Pay Now" : paymentMethod === "cod" ? "Place Order" : "Select Payment"}
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