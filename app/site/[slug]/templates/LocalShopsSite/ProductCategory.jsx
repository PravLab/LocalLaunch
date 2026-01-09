"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useBusiness } from "@/src/context/BusinessContext";
import { ChevronRight, Tag, Sparkles, ArrowRight } from "lucide-react";

export default function HeroSectionByCategory() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const { business } = useBusiness();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      if (!business?.slug) return;

      setLoading(true);
      const { data, error } = await supabase
        .from("businesses")
        .select("products")
        .eq("slug", business.slug)
        .single();

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      const allProducts = data.products || [];
      const categoryMap = new Map();

      for (const product of allProducts) {
        const cat = product.category?.trim();
        if (cat && product.image && !categoryMap.has(cat)) {
          categoryMap.set(cat, product);
        }
      }

      setFeatured([...categoryMap.entries()]);
      setLoading(false);
    };

    fetchFeaturedProducts();
  }, [business]);

  const toSlug = (str) =>
    str.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");

  if (loading) {
    return (
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="h-8 bg-gray-800 rounded w-64 mx-auto mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-800 rounded w-48 mx-auto animate-pulse"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden animate-pulse">
              <div className="aspect-square bg-gray-800"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-800 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-800 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (featured.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-20 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-yellow-500/10 text-yellow-500 px-5 py-2 rounded-full text-sm font-semibold mb-4 border border-yellow-500/20">
          <Sparkles className="w-4 h-4" />
          Featured Categories
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
          Discover by Category
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Browse our curated collections and find exactly what you're looking for
        </p>
      </div>

      {/* Desktop Grid View (4 columns) */}
      <div className="hidden lg:grid grid-cols-4 gap-6 mb-8">
        {featured.slice(0, 8).map(([category, product]) => {
          const slug = toSlug(category);
          return (
            <CategoryCard
              key={category}
              category={category}
              product={product}
              slug={slug}
              businessSlug={business.slug}
            />
          );
        })}
      </div>

      {/* Tablet Grid View (3 columns) */}
      <div className="hidden md:grid lg:hidden grid-cols-3 gap-6 mb-8">
        {featured.slice(0, 6).map(([category, product]) => {
          const slug = toSlug(category);
          return (
            <CategoryCard
              key={category}
              category={category}
              product={product}
              slug={slug}
              businessSlug={business.slug}
            />
          );
        })}
      </div>

      {/* Mobile Swiper */}
      <div className="md:hidden">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={16}
          slidesPerView="auto"
          grabCursor
          pagination={{ clickable: true }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          className="category-swiper pb-12"
        >
          {featured.map(([category, product]) => {
            const slug = toSlug(category);
            return (
              <SwiperSlide key={category} style={{ width: "280px" }}>
                <CategoryCard
                  category={category}
                  product={product}
                  slug={slug}
                  businessSlug={business.slug}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      {/* View All Button */}
      {featured.length > 8 && (
        <div className="text-center mt-12">
          <Link
            href={`/site/${business.slug}/products`}
            className="inline-flex items-center gap-2 bg-yellow-500 text-black px-8 py-4 rounded-xl font-bold hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 hover:scale-105 duration-300 group"
          >
            <span>Explore All Categories</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}

      {/* Custom Swiper Styles */}
      <style jsx global>{`
        .category-swiper .swiper-pagination {
          bottom: 0 !important;
        }

        .category-swiper .swiper-pagination-bullet {
          background: #6b7280;
          opacity: 1;
          width: 8px;
          height: 8px;
        }

        .category-swiper .swiper-pagination-bullet-active {
          background: #eab308;
          width: 24px;
          border-radius: 4px;
        }
      `}</style>
    </section>
  );
}

// Category Card Component - FIXED
function CategoryCard({ category, product, slug, businessSlug }) {
  const [imageError, setImageError] = useState(false);

  return (
    <Link
      href={`/site/${businessSlug}/category/${slug}`}
      className="group block h-full"
    >
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden border-2 border-gray-800 hover:border-yellow-500 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/20 hover:scale-[1.02] h-full flex flex-col">
        {/* Image Container - FIXED */}
        <div className="relative aspect-square bg-gray-800 overflow-hidden">
          {!imageError && product.image ? (
            <div className="relative w-full h-full p-6">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 280px, (max-width: 1024px) 33vw, 25vw"
                className="object-contain group-hover:scale-110 transition-transform duration-500"
                onError={() => setImageError(true)}
                priority={false}
              />
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Tag className="w-16 h-16 text-gray-700" />
            </div>
          )}

          {/* Gradient Overlay - Lighter for better visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity pointer-events-none"></div>

          {/* Category Badge */}
          <div className="absolute top-3 right-3 bg-yellow-500 text-black px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg z-10">
            Featured
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow bg-gradient-to-b from-gray-900 to-black">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-lg font-bold text-white capitalize line-clamp-1 group-hover:text-yellow-500 transition-colors flex-grow">
              {category}
            </h3>
            <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-yellow-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
          </div>

          <p className="text-sm text-gray-400 line-clamp-2 mb-3 flex-grow">
            {product.description || product.name}
          </p>

          {/* View Category Link */}
          <div className="flex items-center gap-2 text-yellow-500 font-semibold text-sm mt-auto">
            <span className="group-hover:underline">Browse Collection</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Decorative Corner */}
        <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-yellow-500/20 to-transparent rounded-br-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      </div>
    </Link>
  );
}