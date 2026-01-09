"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { 
  ShoppingCart, 
  Plus, 
  Trash2, 
  Upload, 
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Package,
  IndianRupee,
  Tag,
  FileText,
  ImageIcon,
  GripVertical
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

export default function Step3_Products({ formData, setFormData, next, prev }) {
  const [errors, setErrors] = useState([]);
  const [uploadingIndex, setUploadingIndex] = useState(null);

  const handleProductChange = (index, name, value) => {
    const sanitizedValue = name === 'price' 
      ? value.replace(/[^\d.]/g, '').slice(0, 10)
      : sanitizeInput(value);
    
    const updated = [...formData.products];
    updated[index][name] = sanitizedValue;
    setFormData({ ...formData, products: updated });
    
    // Clear error for this field
    const newErrors = [...errors];
    if (newErrors[index]) {
      delete newErrors[index][name];
    }
    setErrors(newErrors);
  };

  const validate = () => {
    const err = formData.products.map((p) => {
      const e = {};
      if (!sanitizeInput(p.name)) e.name = "Product name required";
      if (!p.price || parseFloat(p.price) <= 0) e.price = "Valid price required";
      if (!sanitizeInput(p.category)) e.category = "Category required";
      if (!p.image) e.image = "Image required";
      return e;
    });
    setErrors(err);

    const hasErrors = err.some((e) => Object.keys(e).length > 0);
    if (hasErrors) {
      toast.error("Please complete all product details");
    }
    return !hasErrors;
  };

  const handleNext = () => {
    if (validate()) {
      toast.success("Products saved!");
      next();
    }
  };

  const addProduct = () => {
    if (formData.products.length >= 50) {
      toast.error("Maximum 50 products allowed in registration");
      return;
    }
    setFormData({
      ...formData,
      products: [
        ...formData.products,
        { name: "", price: "", image: "", category: "", description: "" },
      ],
    });
  };

  const removeProduct = (index) => {
    if (formData.products.length === 1) {
      toast.error("At least one product is required");
      return;
    }
    setFormData({
      ...formData,
      products: formData.products.filter((_, i) => i !== index),
    });
    setErrors(errors.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (file, index) => {
    if (!file) return;
    
    const validation = validateFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }
    
    setUploadingIndex(index);
    
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });
      
      if (!res.ok) throw new Error("Upload failed");
      
      const data = await res.json();
      
      if (data?.url) {
        const updated = [...formData.products];
        updated[index].image = data.url;
        setFormData({ ...formData, products: updated });
        
        // Clear image error
        const newErrors = [...errors];
        if (newErrors[index]) {
          delete newErrors[index].image;
        }
        setErrors(newErrors);
        
        toast.success("Image uploaded!");
      } else {
        throw new Error("No URL returned");
      }
    } catch (err) {
      toast.error("Failed to upload image");
    } finally {
      setUploadingIndex(null);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div className="text-white">
              <h2 className="text-xl sm:text-2xl font-bold">Add Products</h2>
              <p className="text-white/80 text-sm">Showcase what you sell</p>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
            <span className="text-white font-bold text-lg">{formData.products.length}</span>
            <span className="text-white/80 text-sm ml-1">items</span>
          </div>
        </div>
      </div>

      {/* Products List */}
      <div className="p-6 sm:p-8 space-y-6">
        
        <AnimatePresence>
          {formData.products.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="relative bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5 border border-gray-200 dark:border-gray-700"
            >
              {/* Product Number & Delete */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                    Product #{index + 1}
                  </span>
                </div>
                <button
                  onClick={() => removeProduct(index)}
                  className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Product Name */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                    <Package className="w-3.5 h-3.5" />
                    Product Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Fresh Tomatoes"
                    maxLength={100}
                    className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 transition-all focus:outline-none ${
                      errors[index]?.name 
                        ? 'border-red-400' 
                        : 'border-gray-200 dark:border-gray-700 focus:border-amber-500'
                    }`}
                    value={product.name}
                    onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                  />
                  {errors[index]?.name && (
                    <p className="text-xs text-red-500 mt-1">{errors[index].name}</p>
                  )}
                </div>

                {/* Price */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                    <IndianRupee className="w-3.5 h-3.5" />
                    Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                    <input
                      type="text"
                      placeholder="99"
                      maxLength={10}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 transition-all focus:outline-none ${
                        errors[index]?.price 
                          ? 'border-red-400' 
                          : 'border-gray-200 dark:border-gray-700 focus:border-amber-500'
                      }`}
                      value={product.price}
                      onChange={(e) => handleProductChange(index, 'price', e.target.value)}
                    />
                  </div>
                  {errors[index]?.price && (
                    <p className="text-xs text-red-500 mt-1">{errors[index].price}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Vegetables"
                    maxLength={50}
                    className={`w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 transition-all focus:outline-none ${
                      errors[index]?.category 
                        ? 'border-red-400' 
                        : 'border-gray-200 dark:border-gray-700 focus:border-amber-500'
                    }`}
                    value={product.category}
                    onChange={(e) => handleProductChange(index, 'category', e.target.value)}
                  />
                  {errors[index]?.category && (
                    <p className="text-xs text-red-500 mt-1">{errors[index].category}</p>
                  )}
                </div>

                {/* Description (Optional) */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    Description <span className="text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1kg pack, organic"
                    maxLength={200}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 transition-all focus:outline-none focus:border-amber-500"
                    value={product.description}
                    onChange={(e) => handleProductChange(index, 'description', e.target.value)}
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="mt-4">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                  <ImageIcon className="w-3.5 h-3.5" />
                  Product Image
                </label>
                <div className="flex items-center gap-4">
                  <label className={`flex-1 border-2 border-dashed rounded-xl p-4 transition-all cursor-pointer hover:border-amber-400 hover:bg-amber-50/50 dark:hover:bg-amber-900/10 ${
                    errors[index]?.image ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={(e) => handleImageUpload(e.target.files?.[0], index)}
                      className="hidden"
                      disabled={uploadingIndex === index}
                    />
                    <div className="flex items-center justify-center gap-2 text-gray-500">
                      {uploadingIndex === index ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
                          <span className="text-sm">Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-5 h-5" />
                          <span className="text-sm">Upload image</span>
                        </>
                      )}
                    </div>
                  </label>
                  
                  {product.image && (
                    <Image
                      src={product.image}
                      alt="Product"
                      width={64}
                      height={64}
                      className="rounded-xl border-2 border-gray-200 dark:border-gray-700 object-cover"
                    />
                  )}
                </div>
                {errors[index]?.image && (
                  <p className="text-xs text-red-500 mt-1">{errors[index].image}</p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add More Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={addProduct}
          className="w-full py-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 font-semibold flex items-center justify-center gap-2 hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Another Product
        </motion.button>

        {/* Tip */}
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
          <p className="text-sm text-amber-800 dark:text-amber-300">
            💡 <strong>Tip:</strong> You can add more products later from your dashboard. Add at least 1-3 products now to get started.
          </p>
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