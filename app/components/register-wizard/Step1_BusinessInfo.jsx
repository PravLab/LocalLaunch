"use client";

import { useState } from "react";
import { Listbox } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { Briefcase } from "lucide-react"; // You can change this icon
import clsx from "clsx";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const businessTypes = ["Grocery", "Salon", "Restaurant", "Electronics", "Other"];

export default function Step1_BusinessInfo({ formData, setFormData, next }) {
  const [errors, setErrors] = useState({});

  const validate = async () => {
    const newErrors = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business name is required";
    } else {
      const { data } = await supabase
        .from("businesses")
        .select("id")
        .eq("business_name", formData.businessName.trim())
        .maybeSingle();

      if (data) {
        newErrors.businessName = "This business name is already taken";
      }
    }

    if (!formData.ownerName.trim()) newErrors.ownerName = "Owner name is required";
    if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Enter valid 10-digit number";
    if (!formData.type) newErrors.type = "Please select a business type";
    if (formData.type === "other" && !formData.customType.trim()) newErrors.customType = "Enter your business type";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = async () => {
    const isValid = await validate();
    if (isValid) next();
  };

  return (
    <div className="bg-gradient-to-tr from-white to-emerald-50 border border-emerald-100 shadow-sm rounded-2xl p-6 md:p-10">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-emerald-700 flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-8 h-8 bg-emerald-600 rounded-full text-white">
            <Briefcase className="w-4 h-4" />
          </span>
          Business Information
        </h2>
        <p className="text-sm text-gray-500 mt-2">Let’s get started by entering your core business details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[{ label: "Business Name", name: "businessName", placeholder: "e.g. Praveen Mart" }, { label: "Owner Name", name: "ownerName", placeholder: "e.g. Praveen" }].map((field) => (
          <div key={field.name}>
            <label className="block mb-1 text-sm font-medium text-gray-700">{field.label}</label>
            <input
              type={field.type || "text"}
              name={field.name}
              maxLength={field.maxLength || undefined}
              placeholder={field.placeholder}
              className="w-full px-4 py-3 rounded-lg border text-black font-light border-gray-300 focus:ring-2 focus:ring-emerald-400 focus:outline-none transition"
              value={formData[field.name]}
              onChange={(e) => handleChange(e)}
            />
            {errors[field.name] && <p className="text-sm text-red-500 mt-1">{errors[field.name]}</p>}
          </div>
        ))}
      </div>

      <div className="mt-6 relative z-50">
        <label className="block mb-1 text-sm font-medium text-gray-700">Business Type</label>
        <Listbox value={formData.type} onChange={(val) => setFormData({ ...formData, type: val })}>
          {({ open }) => (
            <div className="relative w-full text-black">
              <Listbox.Button className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 transition flex justify-between items-center">
                <span>{formData.type || "Choose business type"}</span>
                <ChevronDownIcon className="w-5 h-5" />
              </Listbox.Button>
              {open && (
                <Listbox.Options className="absolute z-50 mt-2 w-full rounded-lg bg-white border shadow-md max-h-60 overflow-y-auto">
                  {businessTypes.map((type) => (
                    <Listbox.Option
                      key={type}
                      value={type.toLowerCase()}
                      className={({ active }) =>
                        clsx("px-4 py-2 cursor-pointer transition text-black", active ? "bg-emerald-100" : "bg-white")
                      }
                    >
                      {({ selected }) => (
                        <div className="flex justify-between items-center">
                          <span>{type}</span>
                          {selected && <CheckIcon className="w-4 h-4 text-green-500" />}
                        </div>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              )}
            </div>
          )}
        </Listbox>
        {errors.type && <p className="text-sm text-red-500 mt-1">{errors.type}</p>}
      </div>

      {formData.type === "other" && (
        <div className="mt-4">
          <label className="block mb-1 text-sm font-medium text-black">Custom Business Type</label>
          <input
            className="w-full px-4 py-3 text-black rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-400 focus:outline-none transition"
            name="customType"
            placeholder="e.g. Coaching Center"
            value={formData.customType}
            onChange={handleChange}
          />
          {errors.customType && <p className="text-sm text-red-500 mt-1">{errors.customType}</p>}
        </div>
      )}

      <div className="md:col-span-2 mt-6">
        <label className="block mb-1 text-sm font-medium text-gray-700">Phone Number</label>
        <input
          type="tel"
          name="phone"
          maxLength={10}
          placeholder="10 digit number"
          className="w-full px-4 py-3 rounded-lg border text-black font-light border-gray-300 focus:ring-2 focus:ring-emerald-400 focus:outline-none transition"
          value={formData.phone}
          onChange={(e) => handleChange({ target: { name: "phone", value: e.target.value } })}
        />
        {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
      </div>

      <div className="flex justify-end mt-8">
        <button
          type="button"
          onClick={handleNext}
          className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700 transition-all"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
