"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { CheckCircle2, Wallet2, Crown, Lock } from "lucide-react";
import ContactModal from "./ContactModal";
import usePlanHandler from "@/app/hooks/usePlanHandler";

// Icon map (string → component)
const icons = {
  check: <CheckCircle2 className="text-emerald-500 mb-4 mx-auto" size={40} />,
  wallet: <Wallet2 className="text-yellow-500 mb-4 mx-auto" size={40} />,
  crown: <Crown className="text-purple-600 mb-4 mx-auto" size={40} />,
  lock: <Lock className="text-gray-400 mb-4 mx-auto" size={40} />,
};

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
    },
  }),
};

export default function PlanCard({ plan, index }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");

  const { handleClick, loadingPlan } = usePlanHandler({
    setShowModal,
    setSelectedPlan,
  });

  const handleModalClose = () => setShowModal(false);
  const isEarly = plan.planId === "early_access";

  // ✅ PRO plan (disabled style)
  if (plan.planId === "pro") {
  return (
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  whileInView={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.7, ease: "easeOut" }}
  className="relative overflow-hidden group p-6 md:p-8 rounded-2xl border border-gray-700 shadow-xl bg-gradient-to-br from-[#1c1c1e] via-[#2a2a2d] to-[#1a1a1c] text-white flex flex-col justify-between items-center text-center min-h-[480px] w-full"
>
  {/* Gradient Glow Border */}
  <div className="absolute -inset-px bg-gradient-to-tr from-purple-600 via-pink-500 to-yellow-400 rounded-2xl blur-xl opacity-30 group-hover:opacity-60 transition-all duration-700 pointer-events-none z-0" />

  {/* Top Badge */}
  <div className="absolute top-4 right-4 bg-purple-600 text-white text-xs px-3 py-1 rounded-full font-semibold z-10 shadow-md">
    Coming Soon
  </div>

  {/* Icon */}
  <div className="bg-black/40 p-4 rounded-full shadow-lg mb-4 z-10">
    <Crown className="text-purple-400" size={40} />
  </div>

  {/* Title */}
  <h3 className="text-2xl font-bold mb-2 z-10">Pro Plan <span className="ml-1">👑</span></h3>

  {/* Subtitle */}
  <p className="text-sm text-gray-100/90 mb-4 z-10 leading-relaxed">
    Unlock powerful tools to scale your store to the next level.
  </p>

  {/* Feature List */}
  <ul className="text-gray-400 space-y-3 text-[15px] text-left max-w-xs mx-auto z-10">
    {plan.features.map((feature, i) => (
      <li key={i} className="flex items-start gap-2">
        <Lock className="w-4 h-4 mt-1 text-purple-500/60 group-hover:text-purple-400 transition" />
        <span className="text-gray-300/80">{feature}</span>
      </li>
    ))}
  </ul>

  {/* Footer Note */}
  <div className="mt-6 text-sm italic text-purple-300 z-10">
    Premium features under development ✨
  </div>

  {/* Shimmer Layer */}
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer [mask-image:linear-gradient(to_right,transparent,white,transparent)] z-0" />
</motion.div>


  );
}


  // ✅ All other plans
  return (
    <>
      <motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  custom={index + 1}
  variants={fadeIn}
  whileHover={{ scale: 1.05 }}
  className={`relative bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-md border flex flex-col transition-all duration-300 ease-in-out items-center justify-between min-h-[480px] ${
    plan.highlight
      ? "border-yellow-400 shadow-yellow-100"
      : "border-gray-200 dark:border-zinc-600"
  } hover:shadow-xl hover:scale-[1.03]`}
>
  {/* Icon */}
  <div className="bg-gray-100 dark:bg-zinc-700 p-4 rounded-full mb-4">
    {icons[plan.iconName]}
  </div>

  {/* Title */}
  <h3 className="text-xl font-bold text-gray-800 dark:text-white text-center">
    {plan.name}
  </h3>

  {/* Price */}
  <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 text-center mt-1">
    {plan.price}
  </p>

  {/* Features */}
  <ul className="text-gray-600 dark:text-gray-300 mt-4 space-y-3 text-[15px] text-left w-full max-w-xs">
    {plan.features.map((feature, i) => (
      <li key={i} className="flex items-start gap-2">
        <CheckCircle2 className="text-emerald-500 w-4 h-4 mt-1" />
        <span>{feature}</span>
      </li>
    ))}
  </ul>

  {/* Button */}
  <button
    disabled={loadingPlan === plan.planId}
    onClick={() => handleClick(plan.planId)}
    className={`mt-6 px-6 py-2 text-white font-semibold rounded-full w-full max-w-xs transition-all duration-300 ${
      plan.highlight
        ? "bg-yellow-400 hover:bg-yellow-500"
        : "bg-indigo-600 hover:bg-indigo-700"
    }`}
  >
    {loadingPlan === plan.planId
      ? "Processing..."
      : isEarly
      ? "Request Early Access"
      : plan.button}
  </button>
</motion.div>


      {showModal && (
        <ContactModal planName={selectedPlan} onClose={handleModalClose} />
      )}
    </>
  );
}
