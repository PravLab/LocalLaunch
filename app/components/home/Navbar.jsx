"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";
import { Menu, X } from "lucide-react";
import InstallPWAButton from "./InstallPWAButton";
import SearchDropdown from "./SearchDropdown";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import UserDropdown from "../admin/UserDropdown";
import AuthModal from "../admin/AuthModal";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const inputRef = useRef(null);
  const router = useRouter();
  const { user, loading } = useAuth();

  const handleNearMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        router.push(`/search?near=${latitude},${longitude}`);
      },
      (err) => {
        console.error("Location error:", err);
        alert("Please allow location access to use this feature.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const openLoginModal = () => {
    setAuthModalOpen(true);
    setMenuOpen(false);
  };

  const goToRegister = () => {
    setMenuOpen(false);
    router.push("/register");
  };

  return (
    <>
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="Logo"
                width={38}
                height={38}
                className="rounded-full border border-blue-400 dark:border-indigo-500 transition-transform duration-300 hover:scale-105"
                priority
              />
            </Link>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <InstallPWAButton />

              {loading ? (
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-zinc-800 animate-pulse"></div>
              ) : user ? (
                <UserDropdown />
              ) : (
                <>
                  <button
                    onClick={openLoginModal}
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={goToRegister}
                    className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full shadow-md hover:opacity-90 transition"
                  >
                    Start Selling
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-zinc-700 dark:text-zinc-100 transition p-2"
                aria-label="Toggle Menu"
              >
                {menuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden mt-2 space-y-2 pb-4">
              <div className="flex flex-col gap-2 px-2">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search nearby businesses..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-full px-4 py-2 text-sm text-zinc-700 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
                <SearchDropdown query={query} inputRef={inputRef} />

                <button
                  onClick={handleNearMe}
                  className="px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-700 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-600 transition"
                >
                  📍 Near Me
                </button>

                {loading ? (
                  <div className="h-10 bg-gray-200 dark:bg-zinc-800 rounded-full animate-pulse"></div>
                ) : user ? (
                  <Link
                    href={`/site/${user?.business?.slug || ""}/admin`}
                    className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full shadow-md hover:opacity-90 transition text-center"
                  >
                    My Dashboard
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={openLoginModal}
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full border border-gray-300 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 transition text-center"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={goToRegister}
                      className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full shadow-md hover:opacity-90 transition text-center"
                    >
                      Start Selling
                    </button>
                  </>
                )}

                <InstallPWAButton />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Search Section Outside Navbar */}
      <div className="bg-white dark:bg-zinc-900 w-full py-4 border-b border-gray-200 dark:border-zinc-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full max-w-xl">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search nearby businesses..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-full px-4 py-2 text-sm text-zinc-700 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            <SearchDropdown query={query} inputRef={inputRef} />
          </div>

          <button
            onClick={handleNearMe}
            className="px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-700 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-600 transition"
          >
            📍 Near Me
          </button>
        </div>
      </div>

      {/* Auth Modal - Login & Forgot Password Only */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
}