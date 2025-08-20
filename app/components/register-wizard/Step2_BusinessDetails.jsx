"use client";

import Image from "next/image";
import { Building2, Upload, AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";
import { toast } from "sonner";

export default function Step2_BusinessDetails({ formData, setFormData, prev, next }) {
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.whatsapp || !/^[6-9]\d{9}$/.test(formData.whatsapp)) {
      errs.whatsapp = "Valid WhatsApp number required";
    }
    if (!formData.address) {
      errs.address = "Address is required";
    }
    if (!formData.description || formData.description.length < 10) {
      errs.description = "Please provide a description (min 10 characters)";
    }
    if (!formData.logo) {
      errs.logo = "Logo is required";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleNext = () => {
    if (validate()) next();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    try {
      setUploading(true);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (data?.url) {
        setFormData((prev) => ({ ...prev, logo: data.url }));
        toast.success("Logo uploaded successfully");
      } else {
        toast.error("Image upload failed");
      }
    } catch (err) {
      toast.error("Upload error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-emerald-50 border border-emerald-200 shadow-xl rounded-2xl p-4 sm:p-6 md:p-10">
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-emerald-700 flex items-center gap-2">
          <Building2 className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600" />
          Business Details
        </h2>
        <p className="text-sm text-gray-500 mt-1 sm:mt-2">
          Customers can reach you easily. Provide contact and branding info.
        </p>
      </div>

      <div className="space-y-6">
        {/* WhatsApp */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            WhatsApp Number
          </label>
          <input
            type="tel"
            name="whatsapp"
            maxLength={10}
            pattern="\d{10}"
            placeholder="Enter 10-digit WhatsApp number"
            className={clsx(
              "w-full px-4 py-3 rounded-lg border text-black placeholder:text-gray-600 focus:ring-2 transition",
              errors.whatsapp
                ? "border-red-400 focus:ring-red-300"
                : "border-gray-300 focus:ring-emerald-400"
            )}
            value={formData.whatsapp}
            onChange={handleChange}
          />
          {errors.whatsapp && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={16} /> {errors.whatsapp}
            </p>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Shop Address
          </label>
          <input
            type="text"
            name="address"
            placeholder="Complete address with area and pincode"
            className={clsx(
              "w-full px-4 py-3 rounded-lg border text-black placeholder:text-gray-600 focus:ring-2 transition",
              errors.address
                ? "border-red-400 focus:ring-red-300"
                : "border-gray-300 focus:ring-emerald-400"
            )}
            value={formData.address}
            onChange={handleChange}
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={16} /> {errors.address}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            About Your Business
          </label>
          <textarea
            name="description"
            placeholder="E.g. We deliver daily fresh vegetables and fruits to your door..."
            rows={3}
            className={clsx(
              "w-full px-4 py-3 rounded-lg border text-black placeholder:text-gray-600 focus:ring-2 transition",
              errors.description
                ? "border-red-400 focus:ring-red-300"
                : "border-gray-300 focus:ring-emerald-400"
            )}
            value={formData.description}
            onChange={handleChange}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={16} /> {errors.description}
            </p>
          )}
        </div>

        {/* Logo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Logo
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-md file:border-0
                       file:text-sm file:font-semibold
                       file:bg-emerald-50 file:text-emerald-700
                       hover:file:bg-emerald-100"
          />
          {uploading && (
            <div className="text-sm text-emerald-600 mt-2 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Uploading logo...
            </div>
          )}
          {errors.logo && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={16} /> {errors.logo}
            </p>
          )}
          {formData.logo && !uploading && (
            <div className="mt-4">
              <Image
                src={formData.logo}
                alt="Logo Preview"
                width={100}
                height={100}
                className="rounded-md border shadow-sm"
              />
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-between mt-10">
          <button
            type="button"
            onClick={prev}
            className="px-6 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
