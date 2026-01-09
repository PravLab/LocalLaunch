"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useBusiness } from "@/src/context/BusinessContext";
import { Search } from "lucide-react";
import Image from "next/image";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();
  const { business } = useBusiness();

  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.length > 1) fetchResults(query);
    }, 300);
    return () => clearTimeout(delay);
  }, [query]);

  const fetchResults = async (text) => {
    if (!business?.slug) return;

    const { data, error } = await supabase
      .from("businesses")
      .select("products")
      .eq("slug", business.slug)
      .single();

    if (error) return console.error(error);

    const allProducts = data?.products || [];
    const filtered = allProducts.filter((p) =>
      p.name.toLowerCase().includes(text.toLowerCase())
    );

    setResults(filtered.slice(0, 5));
    setShowDropdown(true);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products"
          className="w-full text-sm px-4 py-2.5 pl-10 rounded-full bg-white text-black placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <Search
          size={18}
          className="absolute top-2.5 left-3 text-gray-400 pointer-events-none"
        />
      </div>

      {showDropdown && results.length > 0 && (
        <div className="absolute z-50 mt-2 w-full bg-white rounded-lg shadow-lg overflow-hidden">
          {results.map((product, i) => (
            <Link
              key={i}
              href={`/product/${
                product.slug || product.name.toLowerCase().replace(/\s+/g, "-")
              }`}
              onClick={() => {
                setQuery("");
                setShowDropdown(false);
              }}
              className="flex items-center px-4 py-3 hover:bg-gray-100 gap-4"
            >
              {product.image ? (
                <Image
                height={40}
                width={30}
                  src={product.image}
                  alt={product.name}
                  className="w-10 h-10 object-cover rounded"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 flex items-center justify-center text-xs text-gray-500 rounded">
                  No Img
                </div>
              )}
              <div className="truncate">
                <p className="font-medium text-sm text-gray-800 truncate">
                  {product.name}
                </p>
                <p className="text-sm text-orange-500 font-semibold">
                  ₹{product.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {showDropdown && query.length > 1 && results.length === 0 && (
        <div className="absolute z-50 mt-2 w-full bg-white shadow-lg rounded-lg p-4 text-sm text-gray-500">
          No results found.
        </div>
      )}
    </div>
  );
}
