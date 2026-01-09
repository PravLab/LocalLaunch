"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getFeaturedBusinesses } from "@/lib/supabaseClient";
import Image from "next/image";

export default function FeaturedBusinesses() {
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getFeaturedBusinesses();
      setBusinesses(data);
    }
    fetchData();
  }, []);

  if (!businesses.length) return null;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Featured Businesses</h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Discover top local businesses near you
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {businesses.map((biz) => (
          <Link key={biz.slug} href={`/site/${biz.slug}`}>
            <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow hover:shadow-lg transition flex flex-col cursor-pointer">
              <Image
                src={biz.thumbnail || '/default-business.png'}
                alt={biz.name}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                {biz.name}
              </h3>
              <span className="text-gray-500 dark:text-gray-400 mb-2">{biz.category}</span>
              <span className="text-gray-400 dark:text-gray-300 text-sm">
                {biz.city}, {biz.state}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
