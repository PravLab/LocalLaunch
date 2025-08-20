// app/site/[slug]/templates/Template2.jsx
"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useBusiness } from "@/src/context/BusinessContext";
import Navbar from "./LocalShopsSite/Navbar";

import HeroBanner from "./LocalShopsSite/HeroBanner";
// import OfferStrip from "./LocalShopsSite/OfferStrip";
import ProductCategory from "./LocalShopsSite/ProductCategory";

import CategoryCard from "./LocalShopsSite/CategoryCard";
// import TestimonialSlider from "./LocalShopsSite/TestimonialSlider";
import WhatsAppButton from "./LocalShopsSite/WhatsAppButton";
import Footer from "./LocalShopsSite/Footer";
import { poppins } from "@/src/font";

export default function Template2({ slug }) {
  const { business, setBusiness } = useBusiness();

  useEffect(() => {
    const fetchBusiness = async () => {
      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) console.error("Business fetch error:", error.message);
      setBusiness(data);
    };

    fetchBusiness();
  }, [slug, setBusiness]);

  if (!business)
    return (
      <div className="p-6 text-center text-gray-500 font-medium animate-pulse">
        Fetching your fashion site...
      </div>
    );

  return (
    <div className={`${poppins.className} bg-white min-h-screen`}>
      <Navbar business={business} />
      <HeroBanner business={business} />
      {/* <OfferStrip /> */}
      <section id="products">
      <ProductCategory products={business.products} />
  {/* product list */}
</section>

<section id="products">
  {/* product list */}
      <CategoryCard />
</section>


      {/* <TestimonialSlider /> */}
      <WhatsAppButton />
      <Footer />
    </div>
  );
}
