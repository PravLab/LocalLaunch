"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useBusiness } from "@/src/context/BusinessContext";
import { ChevronRight, ShoppingCart, Tag, Package } from "lucide-react";

export default function ProductCategory() {
  const { name } = useParams();
  const { business } = useBusiness();
  const [groupedProducts, setGroupedProducts] = useState({});
  const [uncategorizedProducts, setUncategorizedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndGroupProducts = async () => {
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

      const all = data?.products || [];
      const categoryMap = {};
      const uncat = [];

      for (const product of all) {
        if (!product?.name) continue;
        const cat = product.category?.trim();
        if (cat) {
          if (!categoryMap[cat]) categoryMap[cat] = [];
          categoryMap[cat].push(product);
        } else {
          uncat.push(product);
        }
      }

      const filtered = {};
      const uncategorized = [];

      Object.entries(categoryMap).forEach(([cat, items]) => {
        if (items.length >= 4) {
          filtered[cat] = items;
        } else {
          uncategorized.push(...items);
        }
      });

      setGroupedProducts(filtered);
      setUncategorizedProducts([...uncategorized, ...uncat]);
      setLoading(false);
    };

    fetchAndGroupProducts();
  }, [business]);

  const ProductCard = ({ product }) => {
    const slug =
      product?.slug ||
      product?.name?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") ||
      "product";

    return (
      <Link href={`/site/${business?.slug || "unknown"}/product/${slug}`}>
        <div className="group bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden hover:border-yellow-500 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10 h-full flex flex-col">
          {/* Image Container */}
          <div className="relative w-full aspect-square bg-gray-800 overflow-hidden">
            {product?.image ? (
              <Image
                src={product.image}
                alt={product.name || "Product"}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Package className="w-16 h-16 text-gray-700" />
              </div>
            )}
            
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                <ShoppingCart size={18} />
                View Product
              </div>
            </div>

            {/* Category Badge */}
            {product?.category && (
              <div className="absolute top-3 left-3 bg-yellow-500 text-black px-3 py-1 rounded-lg text-xs font-bold uppercase">
                {product.category}
              </div>
            )}

            {/* Out of Stock Badge */}
            {product?.outOfStock && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-white font-bold text-base line-clamp-2 min-h-[3rem] group-hover:text-yellow-500 transition-colors">
              {product?.name || "Unnamed Product"}
            </h3>
            
            <div className="mt-auto pt-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-yellow-500">
                  ₹{isNaN(Number(product?.price))
                    ? "-"
                    : Number(product.price).toLocaleString("en-IN")}
                </span>
                <ChevronRight className="text-gray-600 group-hover:text-yellow-500 group-hover:translate-x-1 transition-all" size={20} />
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="space-y-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-8 bg-gray-800 rounded w-48 mb-6"></div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
                    <div className="aspect-square bg-gray-800"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-800 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const hasProducts = Object.keys(groupedProducts).length > 0 || uncategorizedProducts.length > 0;

  if (!hasProducts) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-900 rounded-full mb-6 border border-gray-800">
          <Package className="w-10 h-10 text-gray-600" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">No Products Available</h3>
        <p className="text-gray-400">Check back soon for new products!</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Categorized Products */}
      {Object.entries(groupedProducts).map(([cat, items]) => (
        <section key={cat}>
          {/* Category Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-500/10 p-3 rounded-xl border border-yellow-500/20">
                <Tag className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold capitalize text-white">
                  {cat}
                </h2>
                <p className="text-gray-400 text-sm">{items.length} products</p>
              </div>
            </div>
            
            <Link
              href={`/site/${business?.slug}/category/${cat.toLowerCase().replace(/\s+/g, "-")}`}
              className="hidden sm:flex items-center gap-2 text-yellow-500 font-semibold hover:gap-3 transition-all group"
            >
              View All
              <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
          </div>

          {/* Desktop Grid */}
          <div className="hidden lg:grid grid-cols-4 gap-6">
            {items.slice(0, 4).map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>

          {/* Tablet Grid */}
          <div className="hidden md:grid lg:hidden grid-cols-3 gap-6">
            {items.slice(0, 3).map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>

          {/* Mobile Swiper */}
          <div className="md:hidden">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={16}
              slidesPerView="auto"
              grabCursor
              pagination={{ clickable: true }}
              className="product-swiper"
            >
              {items.map((product, index) => (
                <SwiperSlide key={index} style={{ width: "240px" }}>
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Mobile View All Link */}
          <div className="sm:hidden mt-6 text-center">
            <Link
              href={`/site/${business?.slug}/category/${cat.toLowerCase().replace(/\s+/g, "-")}`}
              className="inline-flex items-center gap-2 text-yellow-500 font-semibold hover:gap-3 transition-all"
            >
              View All {cat}
              <ChevronRight size={20} />
            </Link>
          </div>
        </section>
      ))}

      {/* Uncategorized Products */}
      {uncategorizedProducts.length > 0 && (
        <section>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gray-800 p-3 rounded-xl border border-gray-700">
                <Package className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  More Products
                </h2>
                <p className="text-gray-400 text-sm">{uncategorizedProducts.length} products</p>
              </div>
            </div>
            
            <Link
              href={`/site/${business?.slug}/product`}
              className="hidden sm:flex items-center gap-2 text-yellow-500 font-semibold hover:gap-3 transition-all group"
            >
              View All
              <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
          </div>

          {/* Desktop Grid */}
          <div className="hidden lg:grid grid-cols-4 gap-6">
            {uncategorizedProducts.slice(0, 4).map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>

          {/* Tablet Grid */}
          <div className="hidden md:grid lg:hidden grid-cols-3 gap-6">
            {uncategorizedProducts.slice(0, 3).map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>

          {/* Mobile Swiper */}
          <div className="md:hidden">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={16}
              slidesPerView="auto"
              grabCursor
              pagination={{ clickable: true }}
              className="product-swiper"
            >
              {uncategorizedProducts.map((product, index) => (
                <SwiperSlide key={index} style={{ width: "240px" }}>
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Mobile View All Link */}
          <div className="sm:hidden mt-6 text-center">
            <Link
              href={`/site/${business?.slug}/products`}
              className="inline-flex items-center gap-2 text-yellow-500 font-semibold hover:gap-3 transition-all"
            >
              View All Products
              <ChevronRight size={20} />
            </Link>
          </div>
        </section>
      )}

      {/* Custom Styles for Swiper */}
      <style jsx global>{`
        .product-swiper {
          padding-bottom: 2.5rem !important;
        }

        .product-swiper .swiper-pagination {
          bottom: 0 !important;
        }

        .product-swiper .swiper-pagination-bullet {
          background: #6b7280;
          opacity: 1;
          width: 8px;
          height: 8px;
        }

        .product-swiper .swiper-pagination-bullet-active {
          background: #eab308;
          width: 24px;
          border-radius: 4px;
        }

        .product-swiper .swiper-button-next,
        .product-swiper .swiper-button-prev {
          color: #eab308;
          background: rgba(0, 0, 0, 0.8);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 2px solid rgba(234, 179, 8, 0.3);
        }

        .product-swiper .swiper-button-next:after,
        .product-swiper .swiper-button-prev:after {
          font-size: 16px;
        }

        .product-swiper .swiper-button-next:hover,
        .product-swiper .swiper-button-prev:hover {
          background: rgba(234, 179, 8, 0.2);
          border-color: #eab308;
        }
      `}</style>
    </div>
  );
}