"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SearchDropdown({ query, inputRef }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [show, setShow] = useState(false);
  const debounceRef = useRef(null);
  const router = useRouter();

  // Fetch suggestions
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setShow(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
       const { data, error } = await supabase
  .from("businesses")
  .select("id, business_name, slug, type, address, logo")
  .or(
    `slug.ilike.%${query}%,business_name.ilike.%${query}%,address.ilike.%${query}%`
  )
  .limit(7)
  .order("created_at", { ascending: false });

        if (error) {
          console.error("Search fetch error:", error);
          setSuggestions([]);
          setShow(false);
          return;
        }

        setSuggestions(data || []);
        setShow(true);
        setActiveIndex(-1);
      } catch (err) {
        console.error("Unexpected search error:", err);
        setSuggestions([]);
        setShow(false);
      } finally {
        setLoading(false);
      }
    }, 250);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const onDocClick = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setShow(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [inputRef]);

  // Navigate
  const navigate = (slug) => {
    setShow(false);
    setSuggestions([]);
    router.push(`/site/${slug}`);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 mt-1 w-full max-w-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-lg z-[999] overflow-hidden"
        >
          {loading && (
            <div className="p-4 text-center text-sm text-zinc-500">Searching...</div>
          )}

          {!loading && suggestions.length === 0 && (
            <div className="p-4 text-center text-sm text-zinc-500">No results found</div>
          )}

          {!loading &&
            suggestions.map((biz, idx) => (
              <div
                key={biz.id}
                className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 transition ${
                  activeIndex === idx ? "bg-gray-100 dark:bg-zinc-800" : ""
                }`}
                onMouseDown={() => navigate(biz.slug)}
                onMouseEnter={() => setActiveIndex(idx)}
              >
                <div className="w-12 h-12 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 dark:bg-zinc-900 flex items-center justify-center">
                  {biz.logo ? (
                    <Image src={biz.logo} height={140} width={150} alt={biz.business_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-sm text-zinc-500">{biz.business_name?.slice(0,2).toUpperCase()}</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-zinc-900 dark:text-zinc-100 truncate">{biz.business_name}</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{biz.type} • {biz.address}</div>
                </div>
              </div>
            ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
