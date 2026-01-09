"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useBusiness } from "@/src/context/BusinessContext";
import Navbar from "./LocalShopsSite/Navbar";
import CategoryCard from "./LocalShopsSite/CategoryCard";
import Footer from "./LocalShopsSite/Footer";
import ProductCategory from "./LocalShopsSite/ProductCategory";
import ChatbotLauncher from "@/app/components/chatbot/forbusinesses/ChatbotLauncher";
import { poppins } from "@/src/font";
import Link from "next/link";
import { ShoppingBag, Sparkles, Star, TrendingUp, Package, Zap, Shield, Heart } from "lucide-react";

export default function BusinessContent({ slug }) {
  const { business, setBusiness } = useBusiness();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hostname = window.location.hostname;
    let subdomain = null;

    if (hostname.includes("localhost")) {
      subdomain = hostname.split(".")[0];
    } else {
      subdomain = hostname.split(".")[0];
    }

    const fetchBusiness = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("slug", subdomain)
        .maybeSingle();

      if (error) {
        console.error("Business fetch error:", error.message);
      }

      if (data) {
        setBusiness(data);
        console.log("Business data:", data); // ✅ Debug log
      }
      setLoading(false);
    };

    fetchBusiness();
  }, [setBusiness]);

  // ✅ Helper function to get business display name
  const getBusinessName = () => {
    return business?.business_name || business?.name || business?.slug || "Our Store";
  };

  // Loading State
  if (loading) {
    return (
      <div className={`${poppins.className} min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center`}>
        <div className="text-center space-y-6">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 border-4 border-gray-800 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-yellow-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-300 font-medium text-lg">Loading your store...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (!business) {
    return (
      <div className={`${poppins.className} min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4`}>
        <div className="max-w-md text-center bg-gray-900 p-10 rounded-3xl shadow-2xl border-2 border-gray-800">
          <div className="w-20 h-20 bg-red-950 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Store Not Found</h2>
          <p className="text-gray-400 mb-6">Please check your URL and try again.</p>
          <a href="/" className="inline-block bg-yellow-500 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-all">
            Go Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`${poppins.className} bg-black min-h-screen`}>
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 text-black py-2.5 px-4 text-center text-sm font-bold relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS1vcGFjaXR5PSIwLjAzIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
        <div className="relative flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>{`✨ Welcome to ${getBusinessName()} - Your Premium Shopping Destination`}</span>
          <Sparkles className="w-4 h-4" />
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-black border-b border-gray-800 sticky top-0 z-50 backdrop-blur-lg bg-opacity-95 shadow-lg">
        <Navbar />
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-black via-gray-900 to-black py-20 sm:py-28 px-4 sm:px-8 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-1/4 w-96 h-96 bg-yellow-500 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-yellow-600 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMTAgNjAgTSAwIDEwIEwgNjAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 backdrop-blur-xl text-yellow-400 px-8 py-4 rounded-full text-sm font-bold mb-8 border-2 border-yellow-500/30 shadow-2xl shadow-yellow-500/20">
              <Star className="w-5 h-5 fill-current" />
              <span className="font-extrabold tracking-wide">Premium Store</span>
              <Sparkles className="w-5 h-5" />
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white mb-6 leading-tight">
              Welcome to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500">
                {getBusinessName()}
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl sm:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Discover our curated collection of premium products
            </p>

            {/* CTA Button */}  
            <Link
              href={`/site/${business.slug}/product`}
              className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-12 py-5 rounded-2xl font-black text-lg hover:from-yellow-400 hover:to-yellow-500 transition-all shadow-2xl shadow-yellow-500/30 hover:shadow-yellow-500/50 hover:scale-105 duration-300"
            >
              <ShoppingBag className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              <span>Start Shopping</span>
              <Sparkles className="w-5 h-5 group-hover:scale-125 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 px-4 sm:px-8 bg-gradient-to-b from-gray-900 to-black border-y border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                icon: <Package className="w-8 h-8" />,
                title: "Quality Products",
                desc: "Carefully curated",
                color: "from-blue-500 to-blue-600"
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Fast Delivery",
                desc: "Quick shipping",
                color: "from-yellow-500 to-yellow-600"
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Secure Shopping",
                desc: "Protected checkout",
                color: "from-green-500 to-green-600"
              },
              {
                icon: <Heart className="w-8 h-8" />,
                title: "100% Satisfaction",
                desc: "Love it or return it",
                color: "from-pink-500 to-pink-600"
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="group text-center p-6 bg-gray-900 rounded-2xl border border-gray-800 hover:border-yellow-500 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10 hover:scale-105"
              >
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${item.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {item.icon}
                </div>
                <h3 className="font-bold text-white mb-1 text-sm sm:text-base">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 sm:py-24 px-4 sm:px-8 bg-black">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-yellow-500/10 text-yellow-500 px-6 py-3 rounded-full text-sm font-bold mb-6 border border-yellow-500/20">
              <TrendingUp className="w-4 h-4" />
              Featured Collection
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Our <span className="text-yellow-500">Products</span>
            </h2>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">
              Explore our handpicked selection
            </p>
          </div>

          {/* Products Grid */}
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-6 sm:p-10 border-2 border-gray-800 shadow-2xl">
            <ProductCategory />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 sm:py-24 px-4 sm:px-8 bg-gradient-to-b from-gray-900 to-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-yellow-500/10 text-yellow-500 px-6 py-3 rounded-full text-sm font-bold mb-6 border border-yellow-500/20">
              <Package className="w-4 h-4" />
              Shop by Category
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Browse <span className="text-yellow-500">Categories</span>
            </h2>
            <p className="text-gray-400 text-xl">
              Find exactly what you need
            </p>
          </div>

          <CategoryCard />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-8 bg-gradient-to-br from-yellow-600 via-yellow-500 to-yellow-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-black text-black mb-6">
            Ready to Shop?
          </h2>
          <p className="text-xl text-black/90 mb-10 font-semibold">
            Discover amazing products and great deals today!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link
              href={`/site/${business.slug}/product`}
              className="inline-flex items-center justify-center gap-3 bg-black text-white px-12 py-5 rounded-2xl font-bold text-lg hover:bg-gray-900 transition-all shadow-xl hover:scale-105 duration-300"
            >
              <ShoppingBag className="w-6 h-6" />
              <span>Browse Products</span>
            </Link>
            
            {business.phone && (
              <a
                href={`https://wa.me/${business.phone}?text=Hi! I'd like to know more about your products`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-white/20 backdrop-blur-sm text-black px-12 py-5 rounded-2xl font-bold text-lg hover:bg-white/30 transition-all border-2 border-black/20 hover:scale-105 duration-300"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span>Contact Us</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Chatbot */}
      {business.has_paid && (
        <ChatbotLauncher slug={business.slug} hasPaid={business.has_paid} />
      )}

      {/* Footer */}
      <Footer />

      {/* Animations */}
      <style jsx global>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}