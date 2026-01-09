"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { 
  MapPin, 
  MessageCircle, 
  FileText, 
  Upload, 
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  ImageIcon,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";

// Security: Input sanitization
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
};

// Validate file type and size
const validateFile = (file) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPG, PNG, WebP, GIF allowed' };
  }
  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be under 5MB' };
  }
  return { valid: true };
};

export default function Step2_BusinessDetails({ formData, setFormData, prev, next }) {
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  const validate = () => {
    const errs = {};
    
    const sanitizedWhatsapp = formData.whatsapp.replace(/\D/g, '').slice(0, 10);
    if (!/^[6-9]\d{9}$/.test(sanitizedWhatsapp)) {
      errs.whatsapp = "Enter valid 10-digit WhatsApp number";
    }
    
    const sanitizedAddress = sanitizeInput(formData.address);
    if (!sanitizedAddress || sanitizedAddress.length < 10) {
      errs.address = "Please enter complete address (min 10 characters)";
    }
    
    const sanitizedDescription = sanitizeInput(formData.description);
    if (!sanitizedDescription || sanitizedDescription.length < 20) {
      errs.description = "Description should be at least 20 characters";
    }
    
    if (!formData.logo) {
      errs.logo = "Please upload your business logo";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (name, value) => {
    const sanitizedValue = name === 'whatsapp' 
      ? value.replace(/\D/g, '').slice(0, 10)
      : sanitizeInput(value);
    
    setFormData({ ...formData, [name]: sanitizedValue });
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleNext = () => {
    if (validate()) {
      toast.success("Store details saved!");
      next();
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }
    
    const form = new FormData();
    form.append("file", file);
    
    try {
      setUploading(true);
      
      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });
      
      if (!res.ok) throw new Error("Upload failed");
      
      const data = await res.json();
      
      if (data?.url) {
        setFormData((prev) => ({ ...prev, logo: data.url }));
        setErrors((prev) => ({ ...prev, logo: undefined }));
        toast.success("Logo uploaded successfully!");
      } else {
        throw new Error("No URL returned");
      }
    } catch (err) {
      toast.error("Failed to upload logo. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div className="text-white">
            <h2 className="text-xl sm:text-2xl font-bold">Store Details</h2>
            <p className="text-white/80 text-sm">Contact info & branding</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="p-6 sm:p-8 space-y-6">
        
        {/* Logo Upload */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            <ImageIcon className="w-4 h-4" />
            Business Logo
          </label>
          
          <div className="flex items-start gap-6">
            {/* Upload Area */}
            <label className={`relative flex-1 border-2 border-dashed rounded-2xl p-6 transition-all cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 ${
              errors.logo ? 'border-red-400' : 'border-gray-300 dark:border-gray-700'
            }`}>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
              <div className="flex flex-col items-center justify-center text-center">
                {uploading ? (
                  <>
                    <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Uploading...</p>
                  </>
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-gray-400 mb-2" />
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Click to upload logo
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      PNG, JPG, WebP up to 5MB
                    </p>
                  </>
                )}
              </div>
            </label>
            
            {/* Preview */}
            {formData.logo && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative"
              >
                <Image
                  src={formData.logo}
                  alt="Logo Preview"
                  width={100}
                  height={100}
                  className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 object-cover"
                />
                <div className="absolute -top-2 -right-2 p-1 bg-emerald-500 rounded-full">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              </motion.div>
            )}
          </div>
          
          {errors.logo && (
            <p className="flex items-center gap-1 text-sm text-red-500 mt-2">
              <AlertCircle className="w-4 h-4" />
              {errors.logo}
            </p>
          )}
        </div>

        {/* WhatsApp */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            <MessageCircle className="w-4 h-4 text-green-500" />
            WhatsApp Number
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
              +91
            </span>
            <input
              type="tel"
              placeholder="9876543210"
              maxLength={10}
              className={`w-full pl-14 pr-4 py-3.5 rounded-xl border-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 transition-all focus:outline-none focus:ring-0 ${
                errors.whatsapp 
                  ? 'border-red-400 focus:border-red-500' 
                  : 'border-gray-200 dark:border-gray-700 focus:border-emerald-500'
              }`}
              value={formData.whatsapp}
              onChange={(e) => handleChange('whatsapp', e.target.value)}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Customers will contact you on this number
          </p>
          {errors.whatsapp && (
            <p className="flex items-center gap-1 text-sm text-red-500 mt-2">
              <AlertCircle className="w-4 h-4" />
              {errors.whatsapp}
            </p>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            <MapPin className="w-4 h-4" />
            Shop Address
          </label>
          <textarea
            placeholder="Full address with area, landmark, city and pincode"
            rows={3}
            maxLength={300}
            className={`w-full px-4 py-3.5 rounded-xl border-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 transition-all focus:outline-none focus:ring-0 resize-none ${
              errors.address 
                ? 'border-red-400 focus:border-red-500' 
                : 'border-gray-200 dark:border-gray-700 focus:border-indigo-500'
            }`}
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
          />
          {errors.address && (
            <p className="flex items-center gap-1 text-sm text-red-500 mt-2">
              <AlertCircle className="w-4 h-4" />
              {errors.address}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            <FileText className="w-4 h-4" />
            About Your Business
          </label>
          <textarea
            placeholder="Describe what you sell, your specialties, delivery options, timings, etc."
            rows={4}
            maxLength={500}
            className={`w-full px-4 py-3.5 rounded-xl border-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 transition-all focus:outline-none focus:ring-0 resize-none ${
              errors.description 
                ? 'border-red-400 focus:border-red-500' 
                : 'border-gray-200 dark:border-gray-700 focus:border-indigo-500'
            }`}
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />
          <div className="flex justify-between mt-1">
            {errors.description ? (
              <p className="flex items-center gap-1 text-sm text-red-500">
                <AlertCircle className="w-4 h-4" />
                {errors.description}
              </p>
            ) : (
              <span />
            )}
            <span className="text-xs text-gray-400">
              {formData.description?.length || 0}/500
            </span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={prev}
            className="px-6 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleNext}
            className="px-8 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-xl shadow-lg flex items-center gap-2 hover:shadow-xl transition-all"
          >
            Continue
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}