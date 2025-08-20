// ✅ Final Clean Production Version of Site Info Page (Based on Supabase Schema)
"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Wrench, RefreshCw, ArrowLeftCircle } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export default function SiteInfoPage({ params }) {
  const [siteInfo, setSiteInfo] = useState({
    business_name: "",
    owner_name: "",
    phone: "",
    email: "",
    type: "",
    description: "",
    address: "",
    whatsapp: "",
    logo: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();
  const router = useRouter();
  const {slug} =  params;

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      const { data, error } = await supabase
        .from("businesses")
        .select(
          "business_name, owner_name, phone, email, type, description, address, whatsapp, logo"
        )
        .eq("slug", slug)
        .single();

      if (error) {
        toast.error("Failed to fetch site info");
        console.error(error);
      } else {
        setSiteInfo(data);
      }
      setLoading(false);
    };

    fetchData();
  }, [slug]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSiteInfo((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!siteInfo.business_name.trim()) newErrors.business_name = "Required";
    if (!siteInfo.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) newErrors.email = "Invalid email";
    if (!siteInfo.phone.match(/^\+?[0-9]{10,15}$/)) newErrors.phone = "Invalid phone number";
    if (!siteInfo.address.trim()) newErrors.address = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const { error } = await supabase
      .from("businesses")
      .update(siteInfo)
      .eq("slug", slug);

    if (error) {
      toast.error("Failed to update site info");
    } else {
      toast.success("Site info updated successfully");
    }
  };

  const clearForm = () => {
    setSiteInfo({
      business_name: "",
      owner_name: "",
      phone: "",
      email: "",
      type: "",
      description: "",
      address: "",
      whatsapp: "",
      logo: "",
    });
    setErrors({});
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      setSiteInfo((prev) => ({ ...prev, logo: url }));
      toast.success("Logo uploaded");
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 bg-gray-100 dark:bg-black text-black dark:text-white">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Wrench size={24} /> Update Site Info
          </h1>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-sm px-3 py-1 border rounded hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <ArrowLeftCircle size={18} /> Back
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <div className="space-y-4">
            {[
              { label: "Business Name", name: "business_name", placeholder: "Your Business Name" },
              { label: "Owner Name", name: "owner_name", placeholder: "Owner Name" },
              { label: "Email", name: "email", placeholder: "contact@yourstore.com" },
              { label: "Phone", name: "phone", placeholder: "+91 XXXXXX XXXX" },
              { label: "Type", name: "type", placeholder: "Business Type" },
              { label: "WhatsApp", name: "whatsapp", placeholder: "+91 XXXXX XXXXX" },
            ].map(({ label, name, placeholder }) => (
              <div key={name}>
                <label className="block font-medium">{label}</label>
                <input
                  type="text"
                  name={name}
                  value={siteInfo[name] || ""}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="w-full mt-1 p-2 border rounded bg-white dark:bg-gray-900 text-black dark:text-white"
                />
                {errors[name] && <p className="text-sm text-red-500">{errors[name]}</p>}
              </div>
            ))}

            <div>
              <label className="block font-medium">Description</label>
              <textarea
                name="description"
                value={siteInfo.description}
                onChange={handleChange}
                placeholder="Your store description"
                className="w-full mt-1 p-2 border rounded bg-white dark:bg-gray-900 text-black dark:text-white"
              />
            </div>

            <div>
              <label className="block font-medium">Address</label>
              <textarea
                name="address"
                value={siteInfo.address}
                onChange={handleChange}
                placeholder="Your full address"
                className="w-full mt-1 p-2 border rounded bg-white dark:bg-gray-900 text-black dark:text-white"
              />
              {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
            </div>

            <div>
              <label className="block font-medium">Logo Image</label>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleLogoUpload}
                className="w-full mt-1 p-2 border rounded bg-white dark:bg-gray-900 text-black dark:text-white"
              />
              {siteInfo.logo && (
                <Image
                  src={siteInfo.logo}
                  alt="Logo Preview"
                  className="w-24 h-24 mt-3 object-contain border rounded"
                />
              )}
              {uploading && <p className="text-sm text-yellow-500 mt-1">Uploading...</p>}
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
              >
                Save Changes
              </button>
              <button
                onClick={clearForm}
                className="flex items-center gap-2 px-4 py-2 rounded border text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <RefreshCw size={16} /> Clear
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
