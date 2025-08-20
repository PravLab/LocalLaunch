"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useBusiness } from "@/src/context/BusinessContext";
import ProductCard from "@/app/site/[slug]/templates/LocalShopsSite/ProductCard";
import WhatsAppButton from "@/app/site/[slug]/templates/LocalShopsSite/ProductCard";
import Navbar from "@/app/site/[slug]/templates/LocalShopsSite/Navbar";
import BuyNowButton from "@/app/site/[slug]/templates/LocalShopsSite/BuyNowButton";
import CategoryCard from "@/app/site/[slug]/templates/LocalShopsSite/CategoryCard";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ProductDetailPage() {
  const { productSlug } = useParams();
  const { business, setBusiness } = useBusiness();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOutOfStockPopup, setShowOutOfStockPopup] = useState(false);

  useEffect(() => {
    if (!business) {
      const stored = localStorage.getItem("business");
      if (stored) {
        setBusiness(JSON.parse(stored));
      }
    }
  }, [business, setBusiness]);

  useEffect(() => {
    if (!business || !business.products || !productSlug) return;

    const allProducts = business.products.map((p) => ({
      ...p,
      business_slug: business.slug,
    }));

    const current = allProducts.find(
      (p) =>
        p.slug === productSlug ||
        p.name?.toLowerCase().replace(/\s+/g, "-") === productSlug
    );

    if (!current) {
      setProduct(null);
      setLoading(false);
      return;
    }

    setProduct(current);

    const relatedProducts = allProducts.filter(
      (p) =>
        p.category === current.category &&
        (p.slug || p.name?.toLowerCase().replace(/\s+/g, "-")) !== productSlug
    );

    setRelated(relatedProducts);
    setLoading(false);
  }, [productSlug, business]);

  if (loading || !business) {
    return <div className="text-center text-gray-500 p-10">Loading product...</div>;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-center text-red-500 flex items-center justify-center">
        <div>
          <p className="text-xl mb-4">This product could not be found.</p>
          <Link href={`/site/${business?.slug}`} className="text-emerald-500 underline">Go back to shop</Link>
        </div>
      </div>
    );
  }

  // ✅ Fixed this line
  const isOutOfStock = product?.outOfStock === true;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      <Navbar business={business} />

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="bg-white rounded-3xl shadow-xl p-6 md:flex md:gap-10 mb-12 select-none border border-gray-100">
          <div className="md:w-1/2 w-full">
            <div className="relative">
              <Image
                src={product.image || "/placeholder.jpg"}
                alt={product.name}
                 width={800}
                 height={500}
                className="w-full h-72 md:h-[450px] object-contain bg-white rounded-xl hover:scale-105 transition-transform"
              />
              {isOutOfStock && (
                <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-3 py-1 rounded-full shadow-md">
                  Out of Stock
                </span>
              )}
            </div>
          </div>

          <div className="md:w-1/2 w-full mt-6 md:mt-0">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <p className="text-orange-600 text-2xl font-bold mb-2">
              ₹{isNaN(product.price) ? "-" : Number(product.price).toLocaleString("en-IN")}
            </p>
            {isOutOfStock && (
              <p className="text-red-600 font-medium mb-4">Currently Out of Stock</p>
            )}
            <p className="text-gray-700 mb-6 leading-relaxed whitespace-pre-line text-base">
              {product.description || "No description provided."}
            </p>

            <div className="flex flex-wrap gap-4">
              {!isOutOfStock && <BuyNowButton product={product} business={business} />}
              {isOutOfStock && (
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm"
                  onClick={() => setShowOutOfStockPopup(true)}
                >
                  Notify via WhatsApp
                </button>
              )}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mb-16">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">More from this category</h2>
              {related.length > 6 && (
                <Link
                  href={`/site/${business.slug}/category/${product.category?.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-sm text-emerald-600 font-medium hover:underline"
                >
                  View More
                </Link>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
              {related
                .filter((item) => item.category === product.category)
                .slice(0, 6)
                .map((item, i) => (
                  <Link
                    key={i}
                    href={`/site/${business.slug}/product/${item.slug || item.name?.toLowerCase().replace(/\s+/g, "-")}`}
                    className="block group"
                  >
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition group-hover:scale-[1.02] duration-200">
                      <div className="relative h-40 bg-gray-50 rounded-t-xl overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-sm text-gray-800 truncate">{item.name}</h3>
                        <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
                        <p className="mt-2 text-emerald-600 font-bold text-sm">₹{item.price}</p>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        )}

        <CategoryCard />
      </div>

      {showOutOfStockPopup && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-md">
            <h2 className="text-xl font-bold mb-2 text-center">Product is Out of Stock</h2>
            <p className="text-sm text-gray-600 text-center mb-4">
              You can contact the seller via WhatsApp and ask for availability or similar items.
            </p>
            {business.phone && (
              <WhatsAppButton product={product} ownerPhone={business.phone} />
            )}
            <button
              onClick={() => setShowOutOfStockPopup(false)}
              className="mt-4 text-sm text-gray-600 hover:underline block mx-auto"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
