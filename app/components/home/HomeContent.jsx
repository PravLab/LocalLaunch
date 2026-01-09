// 'use client'
// import HeroSection from "./HeroSection"
// import Navbar from "./Navbar";
// import FeaturedCategories from "./FeaturedCategories"
// import FaqSection from "./FaqSection"
// import Footer from "./Footer";
// import PricingPlans from "../pricing/PricingPlans";

// import { useBusiness } from "@/src/context/BusinessContext";

// export default function Home() {
//   const slug = useBusiness();
//   return (
//     <>
//       <Navbar />
//       <HeroSection />
//       <hr />
//       <FeaturedCategories />
      
//       <FaqSection />
//       <Footer />
//     </>
//   );
// }




// app/page.jsx

import { CurrencyProvider } from "./CurrencyProvider";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import DashboardPreview from "./DashboardPreview";
import FeaturesGrid from "./FeaturesGrid";
import HowItWorks from "./HowItWorks";
import PricingSection from "./PricingSection";
import PlatformComparison from "./PlatformComparison";
// import FeaturedBusinesses from "./FeaturedBusinesses";
import FaqSection from "./FaqSection";
import CTABanner from "./CTABanner";
import Footer from "./Footer";

export default function Home() {
  return (
    <CurrencyProvider>
      <main className="min-h-screen bg-white dark:bg-[#0a0a0f]">
        <Navbar />
        <HeroSection />
        <DashboardPreview />
        <FeaturesGrid />
        <HowItWorks />
        <PricingSection />
        <PlatformComparison />
        {/* <FeaturedBusinesses />   */}
        <FaqSection  />
        <CTABanner />
        <Footer />
      </main>
    </CurrencyProvider> 
  );
}