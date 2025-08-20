// app/site/[slug]/layout.js
import { supabase } from "@/lib/supabaseClient";
import { BusinessProvider } from "@/src/context/BusinessContext";
// import ChatbotLauncher from "@/app/components/chatbot/forbusinesses/ChatbotLauncher";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const { data: business, error } = await supabase
    .from("businesses")
    .select("business_name, logo, description")
    .eq("slug", slug)
    .single();

  if (error || !business) {
    return {
      title: "Local Launch",
      description: "Your local business online",
    };
  }

  return {
    title: `${business.business_name} | Local Launch`,
    description: business.description || "Local storefront powered by Local Launch",
    icons: {
      icon: business.logo || "/favicon.ico",
    },
    openGraph: {
      title: `${business.business_name} | Local Launch`,
      description: business.description || "Local storefront online",
      images: [
        {
          url: business.logo || "https://locallaunch.in/og-cover.png",
          width: 800,
          height: 600,
        },
      ],
    },
  };
}

export default async function Layout({ children, params }) {
  const { slug } = await params;

  const { data: business, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !business) {
    return (
      <div className="text-center p-10">
        <h1 className="text-xl text-red-600">Business not found 🚫</h1>
      </div>
    );
  }

  // const hasPaid = business?.chatbot_enabled; // ✅ Move here AFTER fetching business

  return (
   <BusinessProvider initialBusiness={business} slug={slug}>
    {children}
  </BusinessProvider>

  );
}
