"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Eye } from "lucide-react";
import PreviewWithTemplateStep from "./PreviewStep";
import AdminSetupStep from "./AdminSetupStep";
// import { useParams } from "next/navigation";

export default function PreviewPage() {
  const params = useParams();
const slug = params.slug;

// console.log("Params:", useParams());

  const [currentStep, setCurrentStep] = useState(0);

  const next = () => setCurrentStep((prev) => prev + 1);
  const prev = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const steps = [
    <PreviewWithTemplateStep key="preview" slug={slug} onNext={next} />,
    <AdminSetupStep key="admin" slug={slug} onBack={prev} />,
  ];

  return (
    <div className="min-h-screen px-6 py-12 bg-gradient-to-b from-emerald-50 to-white text-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-emerald-700 mb-2 flex items-center justify-center gap-2">
            <Eye size={28} className="text-emerald-600" /> Your Site is Live!
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Preview and customize your business site before securing admin access.
          </p>
        </div>

        {steps[currentStep]}
      </div>
    </div>
  );
}
