"use client";

import { useBusiness } from "@/src/context/BusinessContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  MapPin,
  Store,
  Info,
  MessageCircle,
} from "lucide-react";

export default function AboutPage() {
  const { business } = useBusiness();
  const router = useRouter();

  if (!business) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white px-4 py-8 text-gray-800">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center text-sm text-gray-600 hover:text-black transition"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back
      </button>

      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl px-6 py-10 space-y-6 border border-green-100">
        {/* Logo */}
        {business.logo && (
          <div className="flex justify-center">
            <Image
              src={business.logo}
              alt="Business Logo"
              width={90}
              height={90}
              className="rounded-full border shadow-sm"
            />
          </div>
        )}

        {/* Business name */}
        <h1 className="text-3xl font-bold text-center text-green-800">
          {business.business_name}
        </h1>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
          {/* Owner */}
          {business.owner_name && (
            <div className="flex items-start gap-3 bg-green-50 p-4 rounded-lg border border-green-100">
              <User className="text-green-700 mt-1" />
              <div>
                <p className="text-sm font-semibold">Owner</p>
                <p className="text-gray-700 text-sm">{business.owner_name}</p>
              </div>
            </div>
          )}

          {/* Business Type */}
          {business.type && (
            <div className="flex items-start gap-3 bg-green-50 p-4 rounded-lg border border-green-100">
              <Store className="text-green-700 mt-1" />
              <div>
                <p className="text-sm font-semibold">Business Type</p>
                <p className="text-gray-700 text-sm capitalize">
                  {business.type}
                </p>
              </div>
            </div>
          )}

          {/* Address */}
          {business.address && (
            <div className="flex items-start gap-3 bg-green-50 p-4 rounded-lg border border-green-100">
              <MapPin className="text-green-700 mt-1" />
              <div>
                <p className="text-sm font-semibold">Address</p>
                <p className="text-gray-700 text-sm">{business.address}</p>
              </div>
            </div>
          )}

          {/* Description */}
          {business.description && (
            <div className="flex items-start gap-3 bg-green-50 p-4 rounded-lg border border-green-100">
              <Info className="text-green-700 mt-1" />
              <div>
                <p className="text-sm font-semibold">About Us</p>
                <p className="text-gray-700 text-sm whitespace-pre-line">
                  {business.description}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* WhatsApp support */}
        {business.whatsapp && (
          <div className="text-center pt-6">
            <a
              href={`https://wa.me/${business.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full text-sm shadow transition"
            >
              <MessageCircle size={16} /> WhatsApp Support
            </a>
          </div>
        )}

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 pt-6 border-t">
          © {new Date().getFullYear()} {business.business_name}
        </p>
      </div>
    </div>
  );
}
