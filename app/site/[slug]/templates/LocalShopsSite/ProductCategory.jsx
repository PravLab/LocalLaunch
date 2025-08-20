"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useBusiness } from "@/src/context/BusinessContext";

export default function HeroSectionByCategory() {
  const [featured, setFeatured] = useState([]);
  const { business } = useBusiness();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      if (!business?.slug) return;

      const { data, error } = await supabase
        .from("businesses")
        .select("products")
        .eq("slug", business.slug)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      const allProducts = data.products || [];
      const categoryMap = new Map();

      for (const product of allProducts) {
        const cat = product.category?.trim();
        if (cat && product.image && product.image.startsWith("http") && !categoryMap.has(cat)) {
          categoryMap.set(cat, product);
        }
      }

      setFeatured([...categoryMap.entries()]);
    };

    fetchFeaturedProducts();
  }, [business]);

  const toSlug = (str) =>
    str.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-12 px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl sm:text-4xl font-bold text-center text-emerald-700 mb-10 flex items-center justify-center gap-3">
        <span className="text-xl">🧭</span>
        Discover by Category
      </h2>

      <Swiper
        spaceBetween={20}
        slidesPerView="auto"
        grabCursor={true}
        className="pb-4"
      >
        {featured.map(([category, product]) => {
          const slug = toSlug(category);
          return (
            <SwiperSlide
              key={category}
              style={{ width: "220px" }}
              className="!flex-shrink-0"
            >
              <Link href={`/site/${business.slug}/category/${slug}`} className="block group">
                <div className="rounded-2xl overflow-hidden bg-white shadow hover:shadow-lg transition-all duration-300 border border-gray-100">
                  <div className="bg-white h-36 flex items-center justify-center p-2">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={160}
                      height={120}
                      className="object-contain max-h-full transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="px-3 py-2 text-center">
                    <h3 className="text-base font-semibold text-gray-900 capitalize truncate">
                      {category}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {product.name}
                    </p>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}
