"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function usePlanHandler({ setShowModal, setSelectedPlan }) {
  const [loadingPlan, setLoadingPlan] = useState(null);
  const router = useRouter();

  const handleClick = async (planId) => {
    setLoadingPlan(planId);

    if (planId === "free") {
      toast.success("You're starting with the Free plan!");
      router.push("/register");
      setLoadingPlan(null);
      return;
    }

    if (planId === "business") {
  setLoadingPlan(null);
  setSelectedPlan("Business Plan");
  requestAnimationFrame(() => {
    setShowModal(true);
  });
  return;
}


    if (planId === "pro") {
      setSelectedPlan("Pro Plan");
      setShowModal(true);
      setLoadingPlan(null);
      return;
    }

    setLoadingPlan(null);
  };

  return { handleClick, loadingPlan };
}
