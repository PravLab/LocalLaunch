"use client";

import { useBusiness } from "@/src/context/BusinessContext";
import Link from "next/link";
import SearchBar from "./SearchBar";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const { business } = useBusiness();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-green-700 text-white shadow-md">
      <nav className="max-w-6xl mx-auto flex items-center justify-between gap-2 px-4 py-3 sm:px-6">
        {/* Logo or Name */}
        <div className="flex items-center gap-2">
          {business?.logo ? (
            <Image
              src={business.logo}
              alt="logo"
              width={32}
              height={32}
              className="rounded-full border border-white"
            />
          ) : (
            <Link
              href="/"
              className="text-xl font-semibold tracking-wide whitespace-nowrap truncate"
            >
              {business?.business_name || "Local Launch"}
            </Link>
          )}
        </div>

        {/* Desktop Search */}
        <div className="hidden md:block w-[300px]">
          <SearchBar />
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 text-base font-medium">
          {/* <Link href="/contact" className="hover:underline transition">
            Contact
          </Link> */}

          <Link href={`/site/${business.slug}/about`} className="hover:underline transition">
            About
          </Link>
       
        </div>

        {/* Mobile Search */}
        <div className="md:hidden flex-1 px-4">
          <SearchBar />
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-green-800 text-white px-4 pb-4">
          <Link href={`/site/${business.slug}/about`} className="block py-2 text-sm">
            About
          </Link>
          {/* <Link href="/categories" className="block py-2 text-sm">
            Categories
          </Link>
          <Link href="/contact" className="block py-2 text-sm">
            Contact
          </Link> */}
        </div>
      )}
    </header>
  );
}
