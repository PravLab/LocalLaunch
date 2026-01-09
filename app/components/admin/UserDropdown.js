"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/src/context/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaStore, FaSignOutAlt, FaHeadset, FaChevronDown } from "react-icons/fa";
import { toast } from "sonner";

export default function UserDropdown() {
  const { user, business, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
      setIsOpen(false);
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  if (!user || !business) return null;

  // Get initials or logo
  const getAvatar = () => {
    if (business?.logo) {
      return (
        <Image
          src={business.logo}
          alt={business.business_name}
          width={32}
          height={32}
          className="rounded-full object-cover"
        />
      );
    }

    const initials = business?.business_name
      ? business.business_name.slice(0, 2).toUpperCase()
      : "ME";

    return (
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
        {initials}
      </div>
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
      >
        {getAvatar()}
        <span className="hidden md:block font-medium text-gray-800 dark:text-white text-sm">
          {business?.business_name}
        </span>
        <FaChevronDown
          className={`text-gray-500 text-xs transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-gray-200 dark:border-zinc-800 overflow-hidden z-50"
          >
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
              <p className="font-semibold text-gray-900 dark:text-white truncate">
                {business?.business_name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email}
              </p>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {business?.slug && (
                <Link
                  href={`/site/${business.slug}/admin`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-zinc-800 transition text-gray-700 dark:text-gray-300"
                >
                  <FaStore className="text-blue-600" />
                  <span className="font-medium">Dashboard</span>
                </Link>
              )}

              <Link
                href="/contact-us"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-zinc-800 transition text-gray-700 dark:text-gray-300"
              >
                <FaHeadset className="text-green-600" />
                <span className="font-medium">Support</span>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 transition text-red-600"
              >
                <FaSignOutAlt />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}