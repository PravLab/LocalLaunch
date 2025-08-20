"use client";

import Image from "next/image";
import { Trash2, PlusCircle, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Step3_Products({
  formData,
  setFormData,
  next,
  prev,
}) {
  const [errors, setErrors] = useState([]);
  const [uploadingIndex, setUploadingIndex] = useState(null);

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...formData.products];
    updated[index][name] = value;
    setFormData({ ...formData, products: updated });
  };

  const validate = () => {
    const err = formData.products.map((p) => {
      let e = {};
      if (!p.name) e.name = true;
      if (!p.price) e.price = true;
      if (!p.category) e.category = true;
      if (!p.description) e.description = true;
      if (!p.image) e.image = true;
      return e;
    });
    setErrors(err);

    const hasErrors = err.some((e) => Object.keys(e).length > 0);
    if (hasErrors) toast.error("Please fill all fields for each product.");
    return !hasErrors;
  };

  const handleNext = () => {
    if (validate()) next();
  };

  const addProduct = () =>
    setFormData({
      ...formData,
      products: [
        ...formData.products,
        { name: "", price: "", image: "", category: "", description: "" },
      ],
    });

  const removeProduct = (i) =>
    setFormData({
      ...formData,
      products: formData.products.filter((_, index) => index !== i),
    });

const handleImageUpload = async (file, index) => {
  if (!file) return;
  setUploadingIndex(index);
  toast.loading("Uploading product image...");
  try {
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formDataUpload,
    });
    const data = await res.json();
    if (!res.ok || !data?.url) throw new Error("Upload failed");

    const updated = [...formData.products];
    updated[index].image = data.url;
    setFormData({ ...formData, products: updated });
    toast.success("Image uploaded successfully!");
  } catch (err) {
    toast.error("Failed to upload image.");
  } finally {
    setUploadingIndex(null);
    toast.dismiss();
  }
};


  return (
    <div className="space-y-6 animate-fadeInUp">
      <h2 className="text-2xl md:text-3xl font-bold text-emerald-700">
        🛒 Add Products
      </h2>

      {formData.products.map((product, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className={`input ${errors[index]?.name ? "border-red-500" : ""}`}
              name="name"
              placeholder="Product Name"
              value={product.name}
              onChange={(e) => handleProductChange(index, e)}
            />
            <input
              className={`input ${errors[index]?.price ? "border-red-500" : ""}`}
              name="price"
              placeholder="Price"
              value={product.price}
              onChange={(e) => handleProductChange(index, e)}
              type="number"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className={`input ${errors[index]?.category ? "border-red-500" : ""}`}
              name="category"
              placeholder="Category"
              value={product.category}
              onChange={(e) => handleProductChange(index, e)}
            />
            <input
              className={`input ${errors[index]?.description ? "border-red-500" : ""}`}
              name="description"
              placeholder="Description"
              value={product.description}
              onChange={(e) => handleProductChange(index, e)}
            />
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <label className="upload-btn">
              <Upload size={16} />
              {uploadingIndex === index ? "Uploading..." : "Upload Image"}
              <input
                type="file"
                className="hidden"
                onChange={(e) => handleImageUpload(e.target.files[0], index)}
              />
            </label>

            {product.image && (
              <Image
                src={product.image}
                alt="Preview"
                width={80}
                height={80}
                className="rounded border"
              />
            )}
          </div>

          <button
            type="button"
            onClick={() => removeProduct(index)}
            className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
          >
            <Trash2 size={16} />
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addProduct}
        className="text-emerald-600 hover:underline flex items-center gap-2"
      >
        <PlusCircle size={18} />
        Add More Products
      </button>

      <div className="flex justify-between pt-8">
        <button
          onClick={prev}
          className="bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200 text-gray-800 font-medium"
        >
          ← Back
        </button>
        <button
          onClick={handleNext}
          className="bg-emerald-600 text-white px-5 py-2 rounded-md hover:bg-emerald-700 font-semibold"
        >
          Next →
        </button>
      </div>

      <style jsx>{`
        .input {
          padding: 0.75rem;
          border: 1px solid #ccc;
          border-radius: 0.5rem;
          width: 100%;
          background: #fff;
          color: #000;
        }
        .input::placeholder {
          color: #000;
        }
        .input:focus {
          outline: none;
          border-color: #10b981;
        }
        .upload-btn {
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          color: #065f46;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-in-out;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
