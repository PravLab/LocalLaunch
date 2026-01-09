"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useBusiness } from "@/src/context/BusinessContext";
import Navbar from "./LocalShopsSite/Navbar";
import CategoryCard from "./LocalShopsSite/CategoryCard";
import WhatsAppButton from "./LocalShopsSite/WhatsAppButton";
import Footer from "./LocalShopsSite/Footer";
import ProductCategory from "./LocalShopsSite/ProductCategory";
import ChatbotLauncher from "@/app/components/chatbot/forbusinesses/ChatbotLauncher";
import { poppins } from "@/src/font";
import Link from "next/link";

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
      }
      setLoading(false);
    };

    fetchBusiness();
  }, [setBusiness]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 border-4 border-gray-800 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-yellow-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-300 font-medium">Loading your store...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (!business) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4">
        <div className="max-w-md text-center bg-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-800">
          <div className="w-16 h-16 bg-red-950 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Store Not Found</h2>
          <p className="text-gray-400">Please check your URL and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${poppins.className} bg-black min-h-screen print:bg-white`}>
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 text-black py-2.5 px-4 text-center text-sm font-medium print:hidden">
        <div className="flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>✨ Premium Quality Prints • Fast Delivery • Satisfaction Guaranteed</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-black border-b border-gray-800 sticky top-0 z-50 backdrop-blur-lg bg-opacity-90 print:relative print:border-gray-300 print:bg-white">
        <Navbar />
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-black via-gray-900 to-black py-20 sm:py-32 px-4 sm:px-8 relative overflow-hidden print:py-12 print:bg-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 print:hidden">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="max-w-6xl mx-auto relative">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
{/* Premium Badge - BEST VERSION */}
<div className="inline-flex items-center gap-3 bg-black/50 backdrop-blur-md text-yellow-500 px-7 py-3.5 rounded-full text-sm font-bold mb-8 border-2 border-yellow-500/50 shadow-2xl shadow-yellow-500/20 hover:shadow-yellow-500/40 hover:border-yellow-400 hover:scale-[1.02] transition-all duration-300 print:hidden group">
  <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
  <span className="font-extrabold tracking-wide">Premium Print on Demand</span>
  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></div>
</div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 leading-tight print:text-black">
              {business.slug}
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-100 mb-4 leading-relaxed print:text-gray-700">
              Curated collection of premium printed products.
            </p>
            <p className="text-2xl sm:text-3xl text-yellow-500 font-bold mb-10">
              Quality prints delivered to your doorstep.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center print:hidden">
              <Link
                href={`/site/${business.slug}/product`}
                className="group inline-flex items-center justify-center gap-3 bg-yellow-500 text-black px-10 py-4 rounded-xl font-bold hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 hover:scale-105 duration-300"
              >
                <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Shop Collection
              </Link>
              <a 
                href={`https://wa.me/${business.phone || ''}?text=Hi! I'm interested in your products`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-gray-800 text-white px-10 py-4 rounded-xl font-bold hover:bg-gray-700 transition-all border-2 border-gray-700 hover:border-gray-600 hover:scale-105 duration-300"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Contact on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 px-4 sm:px-8 bg-gray-900 border-y border-gray-800 print:py-8 print:bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { 
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                ),
                title: "Premium Quality",
                desc: "Superior materials & printing"
              },
              { 
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Quick Turnaround",
                desc: "Fast processing & shipping"
              },
              { 
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: "100% Secure",
                desc: "Safe & protected checkout"
              },
              { 
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                ),
                title: "Satisfaction Guaranteed",
                desc: "We stand behind our products"
              },
            ].map((item, idx) => (
              <div key={idx} className="text-center group">
                <div className="text-yellow-500 mb-3 flex justify-center group-hover:scale-110 transition-transform duration-200">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-white mb-1 text-sm sm:text-base print:text-black">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 print:text-gray-600">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 sm:py-20 px-4 sm:px-8 bg-black print:py-12 print:bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 print:text-black">
              How It Works
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto print:text-gray-600">
              Simple, fast, and reliable - from browsing to delivery
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                ),
                title: "Browse Our Collection",
                desc: "Explore our curated selection of premium printed products ready for immediate purchase"
              },
              {
                step: "2",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                title: "Place Your Order",
                desc: "Secure checkout process. For custom requests or bulk orders, reach out via WhatsApp"
              },
              {
                step: "3",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                ),
                title: "Fast Delivery",
                desc: "We process and ship your order quickly. Track your package every step of the way"
              },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                {/* Connector Line */}
                {idx < 2 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-yellow-500 via-yellow-600 to-transparent print:hidden"></div>
                )}
                
                <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-yellow-500 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10 print:bg-white print:border-gray-200">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-8 bg-gradient-to-br from-yellow-500 to-yellow-600 text-black w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                    {item.step}
                  </div>
                  
                  <div className="text-yellow-500 mb-4">
                    {item.icon}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-3 print:text-black">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed print:text-gray-600">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-16 sm:py-20 px-4 sm:px-8 bg-gray-900 print:py-12 print:bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 print:text-black">
                Our Collection
              </h2>
              <p className="text-gray-400 print:text-gray-600">Handpicked products, premium quality prints</p>
            </div>
            
            <Link
              href={`/site/${business.slug}/product`}
              className="hidden sm:flex items-center gap-2 text-yellow-500 font-semibold hover:gap-3 transition-all print:hidden group"
            >
              View All
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          
          <div className="bg-black rounded-2xl p-6 sm:p-8 border border-gray-800 print:bg-gray-50 print:border-gray-200">
            <ProductCategory />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 bg-black print:py-12 print:bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 print:text-black">
              Shop by Category
            </h2>
            <p className="text-gray-400 print:text-gray-600">Find exactly what you're looking for</p>
          </div>
          
          <CategoryCard />
        </div>
      </section>

      {/* Why Choose Us Section */}
<section className="relative py-20 sm:py-24 px-4 sm:px-8 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden print:bg-gray-100 print:py-12">
  {/* Animated Background Elements */}
  <div className="absolute inset-0 opacity-20 print:hidden">
    <div className="absolute top-10 right-10 w-96 h-96 bg-yellow-500 rounded-full blur-3xl animate-blob"></div>
    <div className="absolute bottom-10 left-10 w-96 h-96 bg-yellow-600 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
    <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-yellow-400 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
  </div>

  {/* Grid Pattern Overlay */}
  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMTAgNjAgTSAwIDEwIEwgNjAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40 print:hidden"></div>

  <div className="max-w-6xl mx-auto relative z-10">
    {/* Section Header */}
    <div className="text-center mb-16">
      <div className="inline-flex items-center gap-2 bg-yellow-500/10 text-yellow-500 px-6 py-3 rounded-full text-sm font-bold mb-6 border border-yellow-500/20">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span className="tracking-wide">Why Choose Us</span>
      </div>
      <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 print:text-black">
        Where Quality Meets <span className="text-yellow-500">Creativity</span>
      </h2>
      <p className="text-gray-400 text-xl max-w-3xl mx-auto print:text-gray-600">
        We don't just print—we bring your vision to life with precision and passion
      </p>
    </div>

    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
      {/* Left Column - Content */}
      <div>
        {/* Description */}
        <p className="text-gray-300 text-lg sm:text-xl leading-relaxed mb-10 font-medium print:text-gray-700">
          Every product is crafted with <span className="text-yellow-500 font-bold">state-of-the-art technology</span> and premium materials that stand the test of time. Quality isn't just a promise—it's our guarantee.
        </p>

        {/* Features List */}
        <div className="space-y-5 mb-10">
          {[
            {
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ),
              title: "Professional-Grade Printing",
              desc: "Vibrant colors that stay brilliant for years",
              gradient: "from-blue-500 to-blue-600"
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ),
              title: "Premium Materials",
              desc: "Comfort and durability you can feel",
              gradient: "from-purple-500 to-purple-600"
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ),
              title: "Eco-Friendly Process",
              desc: "Sustainable inks and responsible production",
              gradient: "from-green-500 to-green-600"
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ),
              title: "24/7 Support",
              desc: "We're here whenever you need us",
              gradient: "from-yellow-500 to-yellow-600"
            }
          ].map((item, idx) => (
            <div key={idx} className="group flex items-start gap-4 bg-gray-900/50 backdrop-blur-sm p-5 rounded-2xl border border-gray-800 hover:border-yellow-500 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10">
              <div className={`bg-gradient-to-br ${item.gradient} p-3 rounded-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <div className="text-white">
                  {item.icon}
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white text-base mb-1 group-hover:text-yellow-500 transition-colors">
                  {item.title}
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 p-6 bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800">
          <div className="text-center group">
            <div className="text-4xl font-black bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
              100%
            </div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Quality
            </div>
          </div>
          <div className="text-center group border-x border-gray-800">
            <div className="text-4xl font-black bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
              2-3
            </div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Days Ship
            </div>
          </div>
          <div className="text-center group">
            <div className="text-4xl font-black bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
              24/7
            </div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Support
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Feature Cards */}
      <div className="relative print:hidden">
        {/* Decorative background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-yellow-600/5 rounded-3xl transform rotate-3 blur-xl"></div>
        
        <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 sm:p-8 border-2 border-gray-800 shadow-2xl">
          <div className="space-y-5">
            {/* Feature Card 1 */}
            <div className="group bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border-2 border-gray-700 hover:border-yellow-500 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/20 hover:scale-[1.02]">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-3 rounded-xl group-hover:scale-110 transition-all duration-300 flex-shrink-0 shadow-lg">
                  <svg className="w-7 h-7 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-extrabold text-white text-lg mb-2 group-hover:text-yellow-500 transition-colors">
                    Lightning Fast
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    2-3 day processing with express shipping options available nationwide
                  </p>
                </div>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="group bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border-2 border-gray-700 hover:border-yellow-500 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/20 hover:scale-[1.02]">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl group-hover:scale-110 transition-all duration-300 flex-shrink-0 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-extrabold text-white text-lg mb-2 group-hover:text-yellow-500 transition-colors">
                    Quality Guaranteed
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Rigorous multi-stage inspection ensures perfection in every product
                  </p>
                </div>
              </div>
            </div>

            {/* Feature Card 3 */}
            <div className="group bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border-2 border-gray-700 hover:border-yellow-500 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/20 hover:scale-[1.02]">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl group-hover:scale-110 transition-all duration-300 flex-shrink-0 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-extrabold text-white text-lg mb-2 group-hover:text-yellow-500 transition-colors">
                    Always Available
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Instant WhatsApp support for orders, custom requests & any questions
                  </p>
                </div>
              </div>
            </div>

            {/* Trust Badge */}
            <div className="pt-6 border-t-2 border-gray-700">
  <div className="grid grid-cols-2 gap-3">
    <div className="flex items-center justify-center gap-2 text-white bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 p-3 rounded-xl border border-yellow-500/20">
      <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
      <span className="text-xs font-bold">Quality Certified</span>
    </div>
    <div className="flex items-center justify-center gap-2 text-white bg-gradient-to-r from-green-500/10 to-green-600/10 p-3 rounded-xl border border-green-500/20">
      <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="text-xs font-bold">Secure Payment</span>
    </div>
  </div>
</div>


          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Additional Animations Styles */}
  {/* <style jsx>{`
   </style> */}
</section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 bg-gray-900 print:py-12 print:bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 print:text-black">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-400 print:text-gray-600">Got questions? We've got answers</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "What products do you offer?",
                a: "We offer a curated collection of print-on-demand products including apparel, accessories, home decor, and more. Browse our catalog to see all available items. For custom requests, feel free to contact us on WhatsApp."
              },
              {
                q: "How long does shipping take?",
                a: "Processing takes 2-3 business days, and shipping typically takes 3-7 business days depending on your location. You'll receive tracking information once your order ships."
              },
              {
                q: "Can I request custom designs or bulk orders?",
                a: "Absolutely! While our catalog features ready-to-order items, we're happy to discuss custom designs and bulk orders. Simply reach out to us via WhatsApp and we'll help bring your ideas to life."
              },
              {
                q: "What is your return policy?",
                a: "We stand behind our products. If you're not completely satisfied, contact us within 7 days of delivery and we'll work with you to make it right."
              },
              {
                q: "How can I track my order?",
                a: "Once your order ships, you'll receive a tracking number via email. You can also contact us anytime on WhatsApp for order status updates."
              }
            ].map((faq, idx) => (
              <details key={idx} className="group bg-black rounded-xl border border-gray-800 overflow-hidden hover:border-yellow-500 transition-colors print:bg-white print:border-gray-200">
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-800 transition-colors print:hover:bg-gray-50">
                  <span className="font-semibold text-white flex items-center gap-3 print:text-black">
                    <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {faq.q}
                  </span>
                  <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-gray-400 leading-relaxed print:text-gray-700">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 px-4 sm:px-8 bg-black border-t border-gray-800 print:py-12 print:bg-white print:border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full mb-6 shadow-lg shadow-yellow-500/20">
            <svg className="w-10 h-10 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 print:text-black">
            Let's Talk!
          </h2>
          <p className="text-gray-300 text-lg mb-2 print:text-gray-600">
            Questions about products, custom orders, or bulk inquiries?
          </p>
          <p className="text-yellow-500 font-semibold text-xl mb-8">
            We're just a message away
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center print:hidden">
            <a 
              href={`https://wa.me/${business.phone || ''}?text=Hi! I have a question about your products`}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-green-500 text-white px-10 py-4 rounded-xl font-bold hover:from-green-500 hover:to-green-400 transition-all shadow-lg hover:shadow-green-500/20 hover:scale-105 duration-300"
            >
              <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp Us
            </a>
            <a 
              href={`mailto:${business.email || `contact@${business.slug}.com`}`}
              className="inline-flex items-center justify-center gap-3 bg-gray-800 text-white px-10 py-4 rounded-xl font-bold hover:bg-gray-700 transition-all border-2 border-gray-700 hover:border-yellow-500 hover:scale-105 duration-300"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Send Email
            </a>
          </div>
        </div>
      </section>

      {/* Chatbot */}
      <div className="print:hidden">
        <ChatbotLauncher slug={business.slug} hasPaid={business.has_paid} />
      </div>

      {/* Footer */}
      <Footer />

      {/* Styles */}
      <style jsx global>{`
        @media print {
          @page {
            margin: 1.5cm;
          }
          
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          
          .print\\:hidden {
            display: none !important;
          }
          
          .print\\:bg-white {
            background: white !important;
          }

          .print\\:bg-gray-50 {
            background: #f9fafb !important;
          }

          .print\\:bg-gray-100 {
            background: #f3f4f6 !important;
          }

          .print\\:py-8 {
            padding-top: 2rem !important;
            padding-bottom: 2rem !important;
          }

          .print\\:py-12 {
            padding-top: 3rem !important;
            padding-bottom: 3rem !important;
          }

          .print\\:relative {
            position: relative !important;
          }

          .print\\:border-gray-200 {
            border-color: #e5e7eb !important;
          }

          .print\\:border-gray-300 {
            border-color: #d1d5db !important;
          }

          .print\\:text-black {
            color: #000000 !important;
          }

          .print\\:text-gray-600 {
            color: #4b5563 !important;
          }

          .print\\:text-gray-700 {
            color: #374151 !important;
          }

          img {
            max-width: 100% !important;
            page-break-inside: avoid;
          }

          section {
            page-break-inside: avoid;
          }

          h1, h2, h3 {
            page-break-after: avoid;
          }
        }

        /* Smooth scroll */
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar for dark theme */
        ::-webkit-scrollbar {
          width: 12px;
        }

        ::-webkit-scrollbar-track {
          background: #000;
        }

        ::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 6px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #4b5563;
        }

        /* Focus states */
        a:focus-visible, button:focus-visible, summary:focus-visible {
          outline: 2px solid #eab308;
          outline-offset: 2px;
          border-radius: 0.5rem;
        }

        /* Details arrow animation */
        details summary::-webkit-details-marker {
          display: none;
        }

        /* Selection color */
        ::selection {
          background-color: #eab308;
          color: #000;
        }

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