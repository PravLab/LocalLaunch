  "use client";

  import React, { useState } from "react";
  import { motion, AnimatePresence } from "framer-motion";
  import { baloo, poppins } from "@/src/font";
  import PlanCard from "./PlanCard";
  import ContactModal from "./ContactModal";

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  const plans = [
    {
      name: "Free Plan",
      iconName: "check",
      price: "₹0/month",
      features: [
        "Your Online Store with Admin Panel",
        "Product & Order Management",
        "Delivery Area and Boy Setup",
        "Poster Generator for Promotions",
        "One Click 'Buy Now' Button",
        "Help to Connect Your Custom Domain",
      ],
      highlight: false,
      button: "Start for Free",
      planId: "free",
    },
    {
      name: "Business Plan",
      iconName: "wallet",
      price: "₹299/month",
      features: [
        "All Free Plan Features",
        "Smart AI Chatbot for Customer Support",
        "Contact to Pay via WhatsApp (No PAN Needed)",
      ],
      highlight: true,
      button: "Get Early Access",
      planId: "business",
    },
    {
      name: "Pro Plan",
      iconName: "crown",
      price: "Coming Soon",
      features: [
        "Everything in Business Plan",
        "Your Own Domain Purchase Support",
        "Google Search Console Setup",
        "Custom AI Chatbot with Welcome & FAQs",
        "Analytics Dashboard",
        "Personal Setup Help & Templates",
      ],
      highlight: true,
      button: "Coming Soon",
      planId: "pro",
    },
  ];

  export default function PricingPlans() {
    const [showModal, setShowModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);

    const handleClick = (planId) => {
      if (planId === "free") {
        window.location.href = "/signup";
      } else {
        setSelectedPlan(planId === "business" ? "Business Plan" : "Pro Plan");
        setShowModal(true);
      }
    };

    const handleModalClose = () => setShowModal(false);

    return (
      <section
  id="pricing"
  className="relative bg-gradient-to-b from-[#dbeafe] via-[#c7d2fe] to-[#a5f3fc] py-24 px-6 text-center overflow-hidden"
>
  {/* === MODERN BACKGROUND LAYERS === */}
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
    {/* Deep central glow */}
    <div className="absolute top-[-150px] left-1/2 transform -translate-x-1/2 w-[700px] h-[700px] bg-[#3b82f6] opacity-20 rounded-full blur-[140px] animate-pulse" />

    {/* Color blob with scroll effect */}
    <div
      className="absolute bottom-[-200px] right-[-100px] w-[550px] h-[550px] bg-gradient-to-tr from-[#a855f7] via-[#22d3ee] to-[#facc15] opacity-30 rotate-45 blur-[200px] transition-all duration-1000 ease-in-out animate-float"
    />

    {/* Extra layered gradient top left */}
    <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-gradient-to-br from-[#0ea5e9] via-transparent to-[#9333ea] opacity-20 blur-[120px] animate-float-slow" />

    {/* Wavy SVG + grainy texture */}
    <svg
      className="absolute bottom-0 left-0 w-full h-[200px] opacity-20 z-0"
      viewBox="0 0 1440 320"
    >
      <path
        fill="#0ea5e9"
        fillOpacity="0.3"
        d="M0,128L48,160C96,192,192,256,288,261.3C384,267,480,213,576,186.7C672,160,768,160,864,170.7C960,181,1056,203,1152,186.7C1248,171,1344,117,1392,90.7L1440,64V320H0Z"
      ></path>
    </svg>

    {/* Grainy animated overlay */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/5 via-black/5 to-transparent mix-blend-overlay z-10 animate-grain" />
  </div>



        {/* === HEADING === */}
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className={`${baloo.className} text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4`}
        >
          Choose the Right Plan for Your Shop
        </motion.h2>

        {/* === SUBHEADING === */}
        <motion.p
          initial="hidden"
          whileInView="visible"
          custom={2}
          viewport={{ once: true }}
          variants={fadeIn}
          className={`${poppins.className} text-gray-600 max-w-xl mx-auto mb-12 text-base md:text-lg relative z-10`}
        >
          Shuruaat karo bilkul free mein. Jab business grow kare, tab upgrade karo bina kisi headache ke.
        </motion.p>

        {/* === PRICING CARDS === */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10">
          {plans.map((plan, index) => (
            <PlanCard
              key={plan.planId}
              plan={plan}
              index={index}
              onClick={() => handleClick(plan.planId)}
            />
          ))}
        </div>

        {/* === CONTACT MODAL === */}
        {showModal && (
          <AnimatePresence>
            <ContactModal planName={selectedPlan} onClose={handleModalClose} />
          </AnimatePresence>
        )}
      </section>
    );
  }
