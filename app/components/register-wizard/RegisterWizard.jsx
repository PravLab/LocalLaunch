// app/components/register-wizard/RegisterWizard.jsx
"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUp,
  Home,
  MapPin,
  Rocket,
  ShoppingCart,
  UserRound,
  Shield,
  CheckCircle2,
  Sparkles,
  CreditCard,
  Loader2
} from "lucide-react";
import { Toaster, toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Steps
import Step1_BusinessInfo from "./Step1_BusinessInfo";
import Step2_BusinessDetails from "./Step2_BusinessDetails";
import Step3_Products from "./Step3_Products";
import FinalStep_Submit from "./FinalStep_Submit";

const steps = [
  { name: "Business Info", icon: UserRound, description: "Basic details" },
  { name: "Store Details", icon: MapPin, description: "Location & branding" },
  { name: "Products", icon: ShoppingCart, description: "Add your catalog" },
  { name: "Launch", icon: Rocket, description: "Go live!" },
];

// Create Payment Context
const PaymentContext = createContext();

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within PaymentProvider');
  }
  return context;
};

export default function RegisterWizard({ paymentData: initialPaymentData }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [showScroll, setShowScroll] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isPaymentValid, setIsPaymentValid] = useState(false);
  const [verifiedPaymentData, setVerifiedPaymentData] = useState(null);

  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    phone: "",
    email: "",
    type: "",
    customType: "",
    description: "",
    logo: "",
    address: "",
    whatsapp: "",
    products: [
      { name: "", price: "", image: "", category: "", description: "" },
    ],
  });

  // Verify payment on mount
  useEffect(() => {
    const verifyPayment = async () => {
      // If paymentData is passed from server, use it
      if (initialPaymentData?.paymentId && initialPaymentData?.orderId) {
        setVerifiedPaymentData(initialPaymentData);
        setIsPaymentValid(true);
        setIsVerifying(false);
        console.log("Using initial payment data:", initialPaymentData);
        return;
      }

      // Otherwise, verify via API
      try {
        const res = await fetch("/api/billing/check-access", {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          console.log("Check access response:", data);
          
          if (data.hasAccess && data.paymentId && data.orderId) {
            setVerifiedPaymentData({
              paymentId: data.paymentId,
              orderId: data.orderId,
              orderRef: data.orderRef || "",
              plan: data.plan || "pro_monthly"
            });
            setIsPaymentValid(true);
            setIsVerifying(false);
            return;
          }
        }

        // No valid payment - redirect to checkout
        toast.error("Please complete payment first");
        setTimeout(() => {
          router.push("/checkout");
        }, 1500);
      } catch (error) {
        console.error("Payment verification error:", error);
        toast.error("Verification failed. Redirecting...");
        setTimeout(() => {
          router.push("/checkout");
        }, 1500);
      }
    };

    verifyPayment();
  }, [initialPaymentData, router]);

  const StepComponent = [
    Step1_BusinessInfo,
    Step2_BusinessDetails,
    Step3_Products,
    FinalStep_Submit,
  ][currentStep];

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const back = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  useEffect(() => {
    const handleScroll = () => setShowScroll(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const progressPercent = ((currentStep + 1) / steps.length) * 100;

  // Show loading while verifying payment
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-[#09090b] dark:via-[#0f0f11] dark:to-[#09090b] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Verifying payment...</p>
        </div>
      </div>
    );
  }

  // If payment verification failed, this won't render (redirected already)
  if (!isPaymentValid) {
    return null;
  }

  return (
    <PaymentContext.Provider value={verifiedPaymentData}>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-[#09090b] dark:via-[#0f0f11] dark:to-[#09090b] relative">
        <Toaster position="top-center" richColors />
        
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-indigo-100/40 to-transparent dark:from-indigo-950/20 dark:to-transparent rounded-full blur-3xl" />
        </div>

        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <Home className="w-5 h-5" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>
            
            {/* Payment Verified Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-sm font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span className="hidden sm:inline">Payment Verified</span>
              <span className="sm:hidden">Verified</span>
            </div>
          </div>
        </header>

        <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 sm:py-12">
          
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            {/* Pro Plan Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 text-sm font-semibold mb-4">
              <CreditCard className="w-4 h-4" />
              Pro Plan — ₹199/month
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
              Launch Your Online Store
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-xl mx-auto">
              Set up your business in minutes. No coding required.
            </p>
          </motion.div>

          {/* Step Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            {/* Desktop Steps */}
            <div className="hidden sm:flex items-center justify-between mb-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                
                return (
                  <div key={index} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        isCompleted 
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                          : isActive 
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle2 className="w-6 h-6" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>
                      <div className="mt-2 text-center">
                        <div className={`text-sm font-semibold ${
                          isActive ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {step.name}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          {step.description}
                        </div>
                      </div>
                    </div>
                    
                    {index < steps.length - 1 && (
                      <div className={`h-0.5 flex-1 mx-4 rounded-full transition-colors ${
                        index < currentStep ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mobile Step Indicator */}
            <div className="sm:hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Step {currentStep + 1} of {steps.length}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {steps[currentStep].name}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 rounded-full"
              />
            </div>
          </motion.div>

          {/* Step Content - Pass payment data directly */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <StepComponent
                formData={formData}
                setFormData={setFormData}
                next={next}
                prev={back}
                paymentData={verifiedPaymentData} // Pass verified payment data
              />
            </motion.div>
          </AnimatePresence>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400"
          >
            {[
              { icon: Shield, text: "256-bit SSL Encryption" },
              { icon: CheckCircle2, text: "Payment Secured" },
              { icon: Sparkles, text: "0% Commission" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <item.icon className="w-4 h-4 text-emerald-500" />
                <span>{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll to Top */}
        <AnimatePresence>
          {showScroll && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="fixed bottom-6 right-6 p-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full shadow-xl hover:scale-105 transition-transform z-50"
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </PaymentContext.Provider>
  );
}