'use client'
import HeroSection from "./HeroSection"
import Navbar from "./Navbar";
import HowItWorks from "./HowItWorks";
import FaqSection from "./FaqSection"
import Footer from "./Footer";
import PricingPlans from "../pricing/PricingPlans";

import { useBusiness } from "@/src/context/BusinessContext";

export default function Home() {
  const slug = useBusiness();
  return (
    <>
      <Navbar />
      <HeroSection />
      <hr />
      <HowItWorks />
      <PricingPlans />
      <FaqSection />
      <Footer />
    </>
  );
}
