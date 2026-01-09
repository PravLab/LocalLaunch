// app/components/register-wizard/FinalStep_Submit.jsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Rocket,
  ShieldCheck,
  Smartphone,
  Zap,
  Clock,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Loader2,
  ExternalLink,
  CreditCard,
  AlertCircle
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Security: Sanitize data before submission
const sanitizeFormData = (data) => {
  const sanitize = (str) => {
    if (typeof str !== 'string') return str;
    return str
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .trim();
  };

  return {
    ...data,
    businessName: sanitize(data.businessName),
    ownerName: sanitize(data.ownerName),
    phone: data.phone.replace(/\D/g, '').slice(0, 10),
    whatsapp: data.whatsapp.replace(/\D/g, '').slice(0, 10),
    address: sanitize(data.address),
    description: sanitize(data.description),
    type: sanitize(data.type),
    customType: sanitize(data.customType),
    products: data.products.map(p => ({
      ...p,
      name: sanitize(p.name),
      category: sanitize(p.category),
      description: sanitize(p.description),
      price: String(p.price).replace(/[^\d.]/g, ''),
    })),
  };
};

const features = [
  { icon: ShieldCheck, label: "Secure & Encrypted", color: "text-emerald-500" },
  { icon: Smartphone, label: "Mobile Responsive", color: "text-blue-500" },
  { icon: Zap, label: "Lightning Fast", color: "text-amber-500" },
  { icon: Clock, label: "Live in Seconds", color: "text-purple-500" },
];

export default function FinalStep_Submit({ formData, prev, paymentData }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [localPaymentData, setLocalPaymentData] = useState(paymentData);

  // Log payment data for debugging
  useEffect(() => {
    console.log("FinalStep paymentData:", paymentData);
    console.log("FinalStep localPaymentData:", localPaymentData);
  }, [paymentData, localPaymentData]);

  // Fetch payment data if not available
  useEffect(() => {
    const fetchPaymentData = async () => {
      if (!paymentData || !paymentData.paymentId) {
        try {
          const res = await fetch("/api/billing/check-access", {
            method: "GET",
            credentials: "include",
          });

          if (res.ok) {
            const data = await res.json();
            console.log("Fetched payment data:", data);
            
            if (data.hasAccess && data.paymentId) {
              setLocalPaymentData({
                paymentId: data.paymentId,
                orderId: data.orderId || `order_${Date.now()}`,
                orderRef: data.orderRef || "",
                plan: data.plan || "pro_monthly"
              });
            } else {
              setError("Payment verification required. Please complete payment first.");
              toast.error("No payment found. Redirecting to checkout...");
              setTimeout(() => router.push("/checkout"), 2000);
            }
          }
        } catch (err) {
          console.error("Failed to fetch payment data:", err);
          setError("Unable to verify payment.");
        }
      } else {
        setLocalPaymentData(paymentData);
      }
    };

    fetchPaymentData();
  }, [paymentData, router]);

  const handleSubmit = async () => {
    const currentPaymentData = localPaymentData || paymentData;
    
    console.log("Submitting with payment data:", currentPaymentData);

    // Validate payment data
    if (!currentPaymentData?.paymentId) {
      setError("Payment verification required. Please complete payment first.");
      toast.error("Payment verification failed");
      setTimeout(() => router.push("/checkout"), 2000);
      return;
    }

    // Validate required fields
    if (!formData.businessName || !formData.ownerName || !formData.phone) {
      toast.error("Missing required business information");
      return;
    }

    if (!formData.description || formData.description.length < 10) {
      toast.error("Please add a business description (minimum 10 characters)");
      return;
    }

    if (!formData.address || formData.address.length < 5) {
      toast.error("Please add your business address");
      return;
    }

    if (!formData.whatsapp) {
      toast.error("Please add your WhatsApp number");
      return;
    }

    if (!formData.products || formData.products.length === 0) {
      toast.error("Please add at least 1 product");
      return;
    }

    const hasValidProduct = formData.products.some(p => p.name && p.price);
    if (!hasValidProduct) {
      toast.error("Please complete at least one product with name and price");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Sanitize all data before sending
      const sanitizedData = sanitizeFormData(formData);
      
      // Include payment data in the request
      const requestData = {
        ...sanitizedData,
        paymentId: currentPaymentData.paymentId,
        orderId: currentPaymentData.orderId || `order_${Date.now()}`,
        orderRef: currentPaymentData.orderRef || "",
        plan: currentPaymentData.plan || "pro_monthly",
      };

      console.log("Sending registration data:", requestData);

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
        credentials: 'include',
      });

      const data = await res.json();
      console.log("Registration response:", data);

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      toast.success("🎉 Your store is ready!");

      // Redirect to success page
      setTimeout(() => {
        router.push(`/register/preview/${data.slug}`);
      }, 1000);
      
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Something went wrong. Please try again.");
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const previewSlug = formData.businessName?.toLowerCase().replace(/\s+/g, '-').slice(0, 30) || 'your-store';

  // Show payment status
  const hasPayment = localPaymentData?.paymentId || paymentData?.paymentId;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <div className="text-white">
            <h2 className="text-xl sm:text-2xl font-bold">Ready to Launch!</h2>
            <p className="text-white/80 text-sm">Your store is just one click away</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 sm:p-8 space-y-8">
        
        {/* Preview Card */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-start gap-4">
            {formData.logo ? (
              <Image
                src={formData.logo}
                alt="Logo"
                width={64}
                height={64}
                className="rounded-xl border-2 border-white dark:border-gray-700 shadow-lg object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-indigo-500" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {formData.businessName || 'Your Store'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                {formData.description?.slice(0, 100) || 'Your online store description'}...
              </p>
              <div className="flex items-center gap-2 mt-3">
                <div className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium">
                  {formData.products?.filter(p => p.name && p.price).length || 0} Products
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Ready
                </div>
              </div>
            </div>
          </div>
          
          {/* URL Preview */}
          <div className="mt-4 p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Your store URL</p>
            <div className="flex items-center gap-2">
              <code className="text-sm font-mono text-indigo-600 dark:text-indigo-400">
                locallaunch.in/{previewSlug}
              </code>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid sm:grid-cols-2 gap-4">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700"
            >
              <feature.icon className={`w-5 h-5 ${feature.color}`} />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {feature.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Payment Status Banner */}
        {hasPayment ? (
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-5 border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                <CreditCard className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="font-bold text-emerald-800 dark:text-emerald-300">
                  Payment Verified ✓
                </p>
                <p className="text-sm text-emerald-700 dark:text-emerald-400">
                  Pro Plan (₹199/month) • 0% commission • Unlimited products
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-5 border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="font-bold text-amber-800 dark:text-amber-300">
                  Verifying Payment...
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  Please wait while we verify your payment status
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-800 dark:text-red-300">{error}</p>
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  If this continues, please contact support.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={prev}
            disabled={loading}
            className="px-6 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </motion.button>
          
          <motion.button
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            onClick={handleSubmit}
            disabled={loading || !hasPayment}
            className="flex-1 sm:flex-none px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Launching...
              </>
            ) : (
              <>
                <Rocket className="w-5 h-5" />
                Launch My Store
              </>
            )}
          </motion.button>
        </div>

        {/* Security Note */}
        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          🔒 Your data is encrypted and secure. We never share your information.
        </p>
      </div>
    </div>
  );
} 