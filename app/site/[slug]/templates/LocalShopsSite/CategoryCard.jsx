"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useBusiness } from "@/src/context/BusinessContext";

export default function CategoryPage() {
  const { name } = useParams();
  const { business } = useBusiness();
  const [groupedProducts, setGroupedProducts] = useState({});
  const [uncategorizedProducts, setUncategorizedProducts] = useState([]);

  useEffect(() => {
    const fetchAndGroupProducts = async () => {
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

      const all = data?.products || [];
      const categoryMap = {};
      const uncat = [];

      for (const product of all) {
        if (!product?.name) continue; // skip invalid products
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
        <div className="bg-white text-black rounded-xl border border-gray-200 hover:shadow-lg transition-all overflow-hidden flex flex-col">
          {product?.image ? (
            <div className="w-full h-52 sm:h-60 md:h-64 overflow-hidden bg-gray-100">
              <img
                src={product.image}
                alt={product.name || "Product"}
                className="w-full h-full object-contain p-4 transition-transform duration-300 hover:scale-105"
              />
            </div>
          ) : (
            <div className="w-full h-52 flex items-center justify-center bg-gray-200 text-gray-500 text-sm">
              No Image
            </div>
          )}

          <div className="p-4 flex flex-col flex-grow">
            <h2 className="text-base font-semibold line-clamp-2 min-h-[3rem]">
              {product?.name || "Unnamed Product"}
            </h2>
            <p className="text-lg font-bold text-orange-600 mt-2">
              ₹
              {isNaN(Number(product?.price))
                ? "-"
                : Number(product.price).toLocaleString("en-IN")}
            </p>
            <button className="mt-auto text-sm px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition mt-4">
              View Details
            </button>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {Object.entries(groupedProducts).map(([cat, items]) => (
        <section key={cat} className="mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 capitalize text-gray-800">
            {cat}
          </h2>
          <Swiper spaceBetween={16} slidesPerView="auto" grabCursor className="px-1">
            {items.map((product, index) => (
              <SwiperSlide
                key={index}
                style={{ width: "240px" }}
                className="!flex-shrink-0"
              >
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      ))}

      {uncategorizedProducts.length > 0 && (
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
            More Products
          </h2>
          <Swiper spaceBetween={16} slidesPerView="auto" grabCursor className="px-1">
            {uncategorizedProducts.map((product, index) => (
              <SwiperSlide
                key={index}
                style={{ width: "240px" }}
                className="!flex-shrink-0"
              >
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      )}
    </div>
  );
}
