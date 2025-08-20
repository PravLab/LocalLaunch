"use client";

import React, { useState } from "react";
import PosterTemplates from "./PosterTemplates";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useBusiness } from "@/src/context/BusinessContext";

export default function PosterEditor() {
  const [siteName, setSiteName] = useState();
  const [logo, setLogo] = useState(null);
  const [template, setTemplate] = useState("template1");
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const { business } = useBusiness();

  if (!business) return null;
  const fullURL = `https://${business.slug}.locallaunch.in`;

  const validate = () => {
    const newErrors = {};
    if (!siteName || siteName.trim().length < 2) {
      newErrors.siteName = "Business name must be at least 2 characters.";
    }
    if (logo && !logo.type.startsWith("image/")) {
      newErrors.logo = "Only image files are allowed for logo.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setSiteName(name);
    if (name.length >= 2) setErrors((prev) => ({ ...prev, siteName: null }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file?.type.startsWith("image/")) {
      setLogo(file);
      setErrors((prev) => ({ ...prev, logo: null }));
    } else {
      setErrors((prev) => ({ ...prev, logo: "Invalid image format." }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff1eb] to-[#ace0f9] px-4 py-10">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-6 text-sm flex items-center gap-2 text-gray-700 hover:text-black transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Editor Form */}
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-xl p-6 mb-10">
        {/* <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Customize Your Poster
        </h2> */}

        <div className="space-y-4">
          {/* Site Name */}
          <div>
            {/* <label className="block mb-1 text-sm font-medium text-gray-700">
              Business Name
            </label>
            <input
              type="text"
              value={siteName}
              onChange={handleNameChange}
              placeholder="Your Business"
              className={`w-full border px-4 py-2 rounded-md shadow-sm text-gray-700 focus:ring-2 ${
                errors.siteName ? "border-red-500 ring-red-300" : "focus:ring-blue-400"
              } outline-none`}
            /> */}
            {/* {errors.siteName && (
              <p className="text-red-500 text-xs mt-1">{errors.siteName}</p>
            )} */}
          </div>

          {/* Logo */}
          {/* <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Business Logo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="w-full"
            />
            {errors.logo && (
              <p className="text-red-500 text-xs mt-1">{errors.logo}</p>
            )}
          </div> */}

          {/* Template Selector */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Choose Template
            </label>
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="w-full border px-4 py-2 rounded-md shadow-sm text-gray-700"
            >
              <option value="template1">Template One</option>
              <option value="template2">Template Two</option>
              <option value="template3">Template Three</option>
            </select>
          </div>
        </div>
      </div>

      {/* Poster Preview */}
<div className="w-fit mx-auto">
  {Object.keys(errors).length === 0 && (
    <PosterTemplates
      template={template}
      siteName={siteName}
      fullURL={fullURL}
      logo={logo}
    />
  )}
</div>

    </div>
  );
}
