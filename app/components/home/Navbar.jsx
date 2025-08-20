"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";
import { Menu, X } from "lucide-react";
import { useBusiness } from "@/src/context/BusinessContext";
import AdminLoginButton from "../admin/AdminLoginButton";
import InstallPWAButton from "./InstallPWAButton";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const loginRef = useRef();
  const slug = useBusiness();

  return (
    <header className="sticky top-0 z-[999] bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl top-[2.7%] border-b border-gray-200 dark:border-zinc-700 shadow-lg rounded-b-4xl mt-4 rounded-4xl transition-all">

      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3 mt-6  sm:px-6">
        {/* Logo & Title */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/logo.png"
            alt="Local Launch Logo"
            width={40}
            height={40}
            className="rounded-full border border-blue-300 dark:border-indigo-500 group-hover:scale-105 transition-transform duration-300"
            priority
          />
          <span className="text-xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text group-hover:brightness-110 tracking-tight">
            Local Launch
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/#how-it-works"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            Kaise Kaam Karta Hai
          </Link>
          <Link
            href="/#pricing"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            Plans
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            About
          </Link>
          
                    <Link href="/blog" 
           onClick={() => setMenuOpen(false)}
           className="hover:text-orange-500 transition">
            Blogs
          </Link>
           
          <InstallPWAButton />

          <AdminLoginButton slug={slug} />
        </nav>

        {/* Mobile Menu Icon */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-zinc-700 dark:text-zinc-100 transition"
          aria-label="Toggle Menu"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Dropdown Nav */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-t border-gray-200 dark:border-zinc-700 px-4 py-4 space-y-4 transition-all rounded-b-2xl">
          <Link
            href="/#how-it-works"
            onClick={() => setMenuOpen(false)}
            className="block text-sm text-center font-medium text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            Kaise Kaam Karta Hai
          </Link>
          <Link
            href="/#pricing"
            onClick={() => setMenuOpen(false)}
            className="block text-sm text-center font-medium text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            Plans
          </Link>
          <Link
            href="/about"
            onClick={() => setMenuOpen(false)}
            className="block text-sm text-center font-medium text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            About
          </Link>
          
           <Link href="/blog" 
           onClick={() => setMenuOpen(false)}
           className="hover:text-orange-500 transition">
            Blogs
          </Link>
          <InstallPWAButton />

          <div className="text-center">
            <AdminLoginButton slug={slug} />
          </div>
        </div>
      )}
    </header>
  );
}
