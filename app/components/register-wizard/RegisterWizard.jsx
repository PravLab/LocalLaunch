"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowUp,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Home,
  MapPin,
  Rocket,
  ShoppingCart,
  UserRound,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

// Steps
import Step1_BusinessInfo from "./Step1_BusinessInfo";
import Step2_BusinessDetails from "./Step2_BusinessDetails";
import Step3_Products from "./Step3_Products";
// import Step4_Templates from "./Step4_Templates"; ❌ Ignored
import FinalStep_Submit from "./FinalStep_Submit";
// import Step5_Preview from "./Step5_Preview"; // ✅ New Step 4

const steps = [
  { name: "Business Info", icon: UserRound },
  { name: "Business Details", icon: MapPin },
  { name: "Products", icon: ShoppingCart },
  { name: "Launch", icon: Rocket },
  // { name: "Preview", icon: BarChart3 }, // ✅ Step 4
];

export default function RegisterWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showScroll, setShowScroll] = useState(false);

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
    // templateId: "", // ✅ Optional: Which template was selected
    products: [
      { name: "", price: "", image: "", category: "", description: "" },
    ],
  });

  const StepComponent = [
    Step1_BusinessInfo,
    Step2_BusinessDetails,
    Step3_Products,
    FinalStep_Submit,
    // Step5_Preview, // ✅ Showing the preview and selecting template
  ][currentStep];

  const next = () => {
    if (currentStep < steps.length - 1) {
      toast.success(`${steps[currentStep].name} completed`);
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const back = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleSubmit = async () => {
    setLoading(true);
    toast.loading("Creating your site...");

    const finalType =
      formData.type === "other" ? formData.customType : formData.type;

    const formWithSlug = {
      ...formData,
      type: finalType,
      enable_subdomain: true,
      slug: formData.businessName.toLowerCase().replace(/\s+/g, "-").slice(0, 30),
    };

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formWithSlug),
      });

      if (res.ok) {
        const { slug } = await res.json();
        toast.success("Site launched successfully!");
        setTimeout(() => {
          window.location.href = `/site/${slug}/admin`;
        }, 1000);
      } else {
        toast.error("Something went wrong. Try again.");
      }
    } catch (err) {
      toast.error("Server error. Check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen px-4 py-10 bg-gradient-to-b from-emerald-50 to-white dark:from-white dark:to-gray-50 relative">
      <Toaster position="top-center" />
      <div className="absolute left-4 top-4">
        <a
          href="/"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 transition"
        >
          <Home className="w-4 h-4" /> Go back
        </a>
      </div>

      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-emerald-700 mb-4">
            Launch Your Local Business
          </h1>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              return (
                <div
                  key={index}
                  className={`flex items-center gap-2 text-sm px-3 py-2 rounded-full font-medium transition-all
                    ${isCompleted ? "bg-emerald-100 text-emerald-700" : isActive ? "bg-white shadow text-emerald-600" : "text-gray-400"}`}
                >
                  <Icon className="w-4 h-4" />
                  {step.name}
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-3 w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-full relative">
            <motion.div
              className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-green-400 via-emerald-500 to-emerald-600 shadow-md"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </motion.div>

        <StepComponent
          formData={formData}
          setFormData={setFormData}
          next={next}
          prev={back}
          loading={loading}
          handleSubmit={handleSubmit}
        />
      </div>

      {showScroll && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 bg-emerald-600 text-white p-3 rounded-full shadow-lg hover:bg-emerald-700"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

