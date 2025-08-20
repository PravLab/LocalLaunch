"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useBusiness } from "@/src/context/BusinessContext";
import Navbar from "./LocalShopsSite/Navbar";
import CategoryCard from "./LocalShopsSite/CategoryCard";
import WhatsAppButton from "./LocalShopsSite/WhatsAppButton";
import Footer from "./LocalShopsSite/Footer";
import ProductCategory from "./LocalShopsSite/ProductCategory";
import ChatbotLauncher from "@/app/components/chatbot/forbusinesses/ChatbotLauncher";
import { poppins } from "@/src/font";

export default function BusinessContent({ slug }) {

  const { business, setBusiness } = useBusiness();

  useEffect(() => {
    const hostname = window.location.hostname;
    let subdomain = null;

    if (hostname.includes("localhost")) {
      // local test => e.g., slug.localhost:3000
      subdomain = hostname.split(".")[0];
    } else {
      // production => e.g., slug.locallaunch.in
      subdomain = hostname.split(".")[0];
    }

    const fetchBusiness = async () => {
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
    };

    fetchBusiness();
  }, [setBusiness]);

 if (!business) return <p>Invalid slug. Please check your URL.</p>;
// if (!business) return <p>Fetching your business site...</p>;


  return (
    <div className={`${poppins.className} bg-white min-h-screen`}>
      {/* Header */}
      <Navbar />

      {/* Products by Category */}
      <div className="px-4 sm:px-8">
        <ProductCategory />
      </div>

      {/* Additional Category Cards */}
      <div className="px-4 sm:px-8 mt-8">
        <CategoryCard />
      </div>

<ChatbotLauncher slug={business.slug} hasPaid={business.has_paid} />
      {/* Conditional: Chatbot Launcher or WhatsApp */}
      {/* {business.has_paid ? <ChatbotLauncher /> : <WhatsAppButton />} */}

      {/* Footer */}
      <Footer />
    </div>
  );
}
