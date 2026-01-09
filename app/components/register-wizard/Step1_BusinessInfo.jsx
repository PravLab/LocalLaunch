"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Listbox } from "@headlessui/react";
import { 
  ChevronDown, 
  Check, 
  Building2, 
  User, 
  Phone, 
  Store,
  AlertCircle,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@supabase/supabase-js";

// Security: Input sanitization
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
    .slice(0, 200); // Limit length
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const businessTypes = [
  { id: "grocery", name: "Grocery Store", emoji: "🛒" },
  { id: "restaurant", name: "Restaurant / Cafe", emoji: "🍕" },
  { id: "salon", name: "Salon / Spa", emoji: "💇" },
  { id: "electronics", name: "Electronics", emoji: "📱" },
  { id: "clothing", name: "Clothing / Fashion", emoji: "👗" },
  { id: "pharmacy", name: "Pharmacy / Medical", emoji: "💊" },
  { id: "bakery", name: "Bakery / Sweets", emoji: "🧁" },
  { id: "other", name: "Other", emoji: "🏪" },
];

export default function Step1_BusinessInfo({ formData, setFormData, next }) {
  const [errors, setErrors] = useState({});
  const [isChecking, setIsChecking] = useState(false);

  const validate = async () => {
    const newErrors = {};
    
    // Sanitize all inputs first
    const sanitizedBusinessName = sanitizeInput(formData.businessName);
    const sanitizedOwnerName = sanitizeInput(formData.ownerName);
    const sanitizedPhone = formData.phone.replace(/\D/g, '').slice(0, 10);

    if (!sanitizedBusinessName || sanitizedBusinessName.length < 3) {
      newErrors.businessName = "Business name must be at least 3 characters";
    } else {
      setIsChecking(true);
      try {
        const { data } = await supabase
          .from("businesses")
          .select("id")
          .ilike("business_name", sanitizedBusinessName)
          .maybeSingle();

        if (data) {
          newErrors.businessName = "This business name is already taken";
        }
      } catch (err) {
        console.error("Validation error:", err);
      }
      setIsChecking(false);
    }

    if (!sanitizedOwnerName || sanitizedOwnerName.length < 2) {
      newErrors.ownerName = "Owner name is required";
    }

    if (!/^[6-9]\d{9}$/.test(sanitizedPhone)) {
      newErrors.phone = "Enter valid 10-digit Indian mobile number";
    }

    if (!formData.type) {
      newErrors.type = "Please select a business type";
    }

    if (formData.type === "other" && !sanitizeInput(formData.customType)) {
      newErrors.customType = "Please specify your business type";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (name, value) => {
    // Apply sanitization on change
    const sanitizedValue = name === 'phone' 
      ? value.replace(/\D/g, '').slice(0, 10)
      : sanitizeInput(value);
    
    setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleNext = async () => {
    const isValid = await validate();
    if (isValid) {
      toast.success("Business info saved!");
      next();
    }
  };

  const selectedType = businessTypes.find(t => t.id === formData.type);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div className="text-white">
            <h2 className="text-xl sm:text-2xl font-bold">Business Information</h2>
            <p className="text-white/80 text-sm">Let's start with the basics</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="p-6 sm:p-8 space-y-6">
        
        {/* Business Name */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            <Store className="w-4 h-4" />
            Business Name
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. Sharma General Store"
              maxLength={50}
              className={`w-full px-4 py-3.5 rounded-xl border-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 transition-all focus:outline-none focus:ring-0 ${
                errors.businessName 
                  ? 'border-red-400 focus:border-red-500' 
                  : 'border-gray-200 dark:border-gray-700 focus:border-indigo-500'
              }`}
              value={formData.businessName}
              onChange={(e) => handleChange('businessName', e.target.value)}
            />
            {isChecking && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          {errors.businessName && (
            <p className="flex items-center gap-1 text-sm text-red-500 mt-2">
              <AlertCircle className="w-4 h-4" />
              {errors.businessName}
            </p>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            This will be your store URL: locallaunch.in/{formData.businessName?.toLowerCase().replace(/\s+/g, '-').slice(0, 20) || 'your-store'}
          </p>
        </div>

        {/* Owner Name & Phone */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <User className="w-4 h-4" />
              Owner Name
            </label>
            <input
              type="text"
              placeholder="Your full name"
              maxLength={50}
              className={`w-full px-4 py-3.5 rounded-xl border-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 transition-all focus:outline-none focus:ring-0 ${
                errors.ownerName 
                  ? 'border-red-400 focus:border-red-500' 
                  : 'border-gray-200 dark:border-gray-700 focus:border-indigo-500'
              }`}
              value={formData.ownerName}
              onChange={(e) => handleChange('ownerName', e.target.value)}
            />
            {errors.ownerName && (
              <p className="flex items-center gap-1 text-sm text-red-500 mt-2">
                <AlertCircle className="w-4 h-4" />
                {errors.ownerName}
              </p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <Phone className="w-4 h-4" />
              Phone Number
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
                  errors.phone 
                    ? 'border-red-400 focus:border-red-500' 
                    : 'border-gray-200 dark:border-gray-700 focus:border-indigo-500'
                }`}
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>
            {errors.phone && (
              <p className="flex items-center gap-1 text-sm text-red-500 mt-2">
                <AlertCircle className="w-4 h-4" />
                {errors.phone}
              </p>
            )}
          </div>
        </div>

        {/* Business Type */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            <Sparkles className="w-4 h-4" />
            Business Type
          </label>
          <Listbox 
            value={formData.type} 
            onChange={(val) => {
              setFormData({ ...formData, type: val });
              setErrors((prev) => ({ ...prev, type: undefined }));
            }}
          >
            <div className="relative">
              <Listbox.Button className={`w-full px-4 py-3.5 rounded-xl border-2 bg-gray-50 dark:bg-gray-800 text-left flex items-center justify-between transition-all ${
                errors.type 
                  ? 'border-red-400' 
                  : 'border-gray-200 dark:border-gray-700 focus:border-indigo-500'
              }`}>
                <span className={selectedType ? 'text-gray-900 dark:text-white' : 'text-gray-400'}>
                  {selectedType ? (
                    <span className="flex items-center gap-2">
                      <span>{selectedType.emoji}</span>
                      <span>{selectedType.name}</span>
                    </span>
                  ) : 'Select your business type'}
                </span>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </Listbox.Button>
              
              <Listbox.Options className="absolute z-50 mt-2 w-full rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl max-h-60 overflow-auto">
                {businessTypes.map((type) => (
                  <Listbox.Option
                    key={type.id}
                    value={type.id}
                    className={({ active, selected }) =>
                      `px-4 py-3 cursor-pointer flex items-center justify-between transition-colors ${
                        active ? 'bg-indigo-50 dark:bg-indigo-900/30' : ''
                      } ${selected ? 'bg-indigo-100 dark:bg-indigo-900/50' : ''}`
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span className="flex items-center gap-3">
                          <span className="text-xl">{type.emoji}</span>
                          <span className="text-gray-900 dark:text-white font-medium">{type.name}</span>
                        </span>
                        {selected && <Check className="w-5 h-5 text-indigo-600" />}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
          {errors.type && (
            <p className="flex items-center gap-1 text-sm text-red-500 mt-2">
              <AlertCircle className="w-4 h-4" />
              {errors.type}
            </p>
          )}
        </div>

        {/* Custom Type */}
        {formData.type === "other" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
              Specify Your Business Type
            </label>
            <input
              type="text"
              placeholder="e.g. Coaching Center, Printing Shop"
              maxLength={50}
              className={`w-full px-4 py-3.5 rounded-xl border-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 transition-all focus:outline-none focus:ring-0 ${
                errors.customType 
                  ? 'border-red-400 focus:border-red-500' 
                  : 'border-gray-200 dark:border-gray-700 focus:border-indigo-500'
              }`}
              value={formData.customType}
              onChange={(e) => handleChange('customType', e.target.value)}
            />
            {errors.customType && (
              <p className="flex items-center gap-1 text-sm text-red-500 mt-2">
                <AlertCircle className="w-4 h-4" />
                {errors.customType}
              </p>
            )}
          </motion.div>
        )}

        {/* Next Button */}
        <div className="pt-4">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleNext}
            disabled={isChecking}
            className="w-full sm:w-auto px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-xl shadow-lg flex items-center justify-center gap-2 hover:shadow-xl transition-all disabled:opacity-50"
          >
            Continue
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}