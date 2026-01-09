"use client";

import { useBusiness } from "@/src/context/BusinessContext";
import Link from "next/link";
import SearchBar from "./SearchBar";
import { Menu, X, ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

export default function Navbar() {
  const { business } = useBusiness();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  // ✅ Business-specific cart key
  const getCartKey = useCallback(() => {
    return business?.slug ? `cart_${business.slug}` : null;
  }, [business?.slug]);

  const updateCart = useCallback(() => {
    const cartKey = getCartKey();
    if (!cartKey) return;
    
    const cart = JSON.parse(localStorage.getItem(cartKey) || "[]");
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    setCartCount(totalItems);
    setCartItems(cart);
  }, [getCartKey]);

  useEffect(() => {
    if (!business?.slug) return;
    
    updateCart();
    
    const handleCartUpdate = (e) => {
      // Only update if this business's cart was updated
      if (e.detail?.slug === business.slug || !e.detail) {
        updateCart();
      }
    };
    
    window.addEventListener("storage", updateCart);
    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("storage", updateCart);
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [business?.slug, updateCart]);

  const updateQuantity = (productId, newQuantity) => {
    const cartKey = getCartKey();
    if (!cartKey) return;
    
    const cart = JSON.parse(localStorage.getItem(cartKey) || "[]");
    const itemIndex = cart.findIndex((item) => item.id === productId);
    
    if (itemIndex !== -1) {
      if (newQuantity <= 0) {
        cart.splice(itemIndex, 1);
      } else {
        cart[itemIndex].quantity = newQuantity;
      }
      localStorage.setItem(cartKey, JSON.stringify(cart));
      window.dispatchEvent(new CustomEvent("cartUpdated", { detail: { slug: business.slug } }));
    }
  };

  const removeItem = (productId) => {
    const cartKey = getCartKey();
    if (!cartKey) return;
    
    const cart = JSON.parse(localStorage.getItem(cartKey) || "[]");
    const filteredCart = cart.filter((item) => item.id !== productId);
    localStorage.setItem(cartKey, JSON.stringify(filteredCart));
    window.dispatchEvent(new CustomEvent("cartUpdated", { detail: { slug: business.slug } }));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + (Number(item.price) || 0) * (item.quantity || 1);
    }, 0);
  };

  const handleCartClick = (e) => {
    e.preventDefault();
    setCartDrawerOpen(true);
  };

  if (!business) return null;

  return (
    <>
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
                href={`/site/${business?.slug}`}
                className="text-xl font-semibold tracking-wide whitespace-nowrap truncate"
              >
                {business?.business_name || "Store"}
              </Link>
            )}
          </div>

          {/* Desktop Search */}
          <div className="hidden md:block w-[300px]">
            <SearchBar />
          </div>

          {/* Desktop Links & Cart */}
          <div className="hidden md:flex items-center gap-6 text-base font-medium">
            <Link href={`/site/${business?.slug}/about`} className="hover:underline transition">
              About
            </Link>

            <button
              onClick={handleCartClick}
              className="relative flex items-center gap-2 bg-white text-green-700 px-4 py-2 rounded-lg hover:bg-green-50 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <ShoppingCart size={20} />
              <span className="font-semibold">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Search & Cart */}
          <div className="md:hidden flex-1 px-4 flex items-center gap-2">
            <SearchBar />
            
            <button
              onClick={handleCartClick}
              className="relative flex-shrink-0 bg-white text-green-700 p-2 rounded-lg hover:bg-green-50 transition-all duration-200 shadow-sm"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
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
            <Link 
              href={`/site/${business?.slug}/about`} 
              className="block py-2 text-sm hover:bg-green-700 px-2 rounded transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <button 
              onClick={() => {
                setMobileMenuOpen(false);
                setCartDrawerOpen(true);
              }}
              className="flex items-center justify-between py-2 text-sm hover:bg-green-700 px-2 rounded transition w-full"
            >
              <span>My Cart</span>
              {cartCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        )}
      </header>

      {/* Cart Drawer */}
      {cartDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
          onClick={() => setCartDrawerOpen(false)}
        >
          <div 
            className="fixed right-0 top-0 h-full w-full sm:w-[400px] bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-green-700 text-white p-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingCart size={24} />
                <h2 className="text-xl font-bold">Your Cart</h2>
                {cartCount > 0 && (
                  <span className="bg-white text-green-700 text-sm font-bold px-2 py-1 rounded-full">
                    {cartCount}
                  </span>
                )}
              </div>
              <button 
                onClick={() => setCartDrawerOpen(false)}
                className="hover:bg-green-600 p-2 rounded-full transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <ShoppingCart size={64} className="mb-4 opacity-30" />
                  <p className="text-lg font-medium">Your cart is empty</p>
                  <p className="text-sm">Add items to get started</p>
                  <button
                    onClick={() => setCartDrawerOpen(false)}
                    className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <div className="relative w-20 h-20 flex-shrink-0 bg-white rounded-lg overflow-hidden">
                        <Image
                          src={item.image || "/placeholder.jpg"}
                          alt={item.name}
                          fill
                          className="object-contain p-2"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-gray-900 truncate">
                          {item.name}
                        </h3>
                        <p className="text-emerald-600 font-bold text-lg">
                          ₹{Number(item.price).toLocaleString("en-IN")}
                        </p>

                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="bg-gray-200 hover:bg-gray-300 p-1 rounded transition"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="font-semibold text-sm px-3 py-1 bg-white border border-gray-300 rounded">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="bg-gray-200 hover:bg-gray-300 p-1 rounded transition"
                          >
                            <Plus size={16} />
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="ml-auto text-red-500 hover:bg-red-50 p-1 rounded transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="bg-white border-t border-gray-200 p-4 space-y-3 flex-shrink-0">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span className="text-gray-700">Total:</span>
                  <span className="text-green-700 text-2xl">
                    ₹{getTotalPrice().toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="space-y-2">
                  <Link
                    href={`/site/${business?.slug}/cart`}
                    className="block w-full bg-green-700 hover:bg-green-800 text-white text-center font-semibold py-3 rounded-lg transition-colors shadow-lg"
                    onClick={() => setCartDrawerOpen(false)}
                  >
                    View Cart & Checkout
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}