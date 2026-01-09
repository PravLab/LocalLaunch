"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import DeliveryAreaModal from "@/app/components/admin/DeliveryAreaModal";
import { supabase } from "@/lib/supabase";
import DomainManualNotice from "@/app/components/admin/DomainManualNotice";
import { toast } from "sonner";
import Cookies from "js-cookie";

export default function AdminPage() {
  const [showAreaPopup, setShowAreaPopup] = useState(false);
  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { slug } = useParams();

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      setLoading(true);

      // ✅ Get session and user email
     
      

      // ✅ Fetch business row
      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error || !data) {
        toast.error("Site not found.");
        router.replace("/");
        return;
      }
const userEmail = Cookies.get("admin_email");
      // ✅ Check if logged-in user is the admin
      // ✅ STEP 1: Check if admin_email matches
if (data.admin_email !== userEmail) {
  toast.error("You are not the admin of this site. please login with correct email!");
  router.replace("/");
  return;
}

// ✅ STEP 2: Check if this is a re-login (manual login with password)
// If admin_password exists (means someone had to log in), check also if localStorage has it
if (data.admin_password) {
  const storedEmail = Cookies.get("admin_email");
  

  if (storedEmail !== data.admin_email) {
    toast.error("Access denied. Please log in again via Admin Access.");
    router.replace("/");
    return;
  }
}


      setSiteData(data);
      setLoading(false);

      // // ✅ Step 3: Save slug and admin_email to localStorage from cookies
      // if (typeof window !== "undefined") {
      //   const cookieEmail = Cookies.get("admin_email");
      //   const cookieSlug = Cookies.get("slug");

      //   if (cookieEmail) localStorage.setItem("admin_email", cookieEmail);
      //   if (cookieSlug) localStorage.setItem("slug", cookieSlug);
      // }
    };

    fetchData();
  }, [slug, router]);

  // const handleLogout = async () => {
  //   // Remove cookies via secure API call
  //   await fetch("/api/logout-admin", {
  //     method: "POST",
  //   });

  //   // Also logout from Supabase
  //   await supabase.auth.signOut();

  //   // Redirect to home page
  //   router.replace("/");
  // };

  if (loading || !siteData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4 p-6">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-r-transparent"></div>
          <span className="text-gray-600">Loading admin panel...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
            <div>
             <Link href="/" className="text-black font-bold border-2 border-black ">◀⬅Go to home</Link>
            <h1 className="text-3xl font-bold text-gray-800">
              {siteData.business_name || siteData.name} Admin
            </h1>
            <p className="text-gray-600 mt-1">Manage your business online</p>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href={`/site/${slug}`}
              className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 font-medium"
            >
              View Site
            </Link>
            
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AdminCard slug={slug} emoji="🚖" title="Orders" path="orders" desc="Manage customer orders and track deliveries" />
          <AdminCard slug={slug} emoji="📦" title="Products" path="products" desc="Add, edit and organize your product catalog" />
          <AdminCard slug={slug} emoji="🧾" title="Site Info" path="site-info" desc="Update business details and settings" />
          <AdminCard slug={slug} emoji="💳" title="Payments" path="payments" desc="Configure payment methods and pricing" />
          <AdminCard slug={slug} emoji="📢" title="Marketing" path="poster" desc="Create posters and promote your business" />
          <AdminCard slug={slug} emoji="🧐" title="AI Chatbot" path="ai-chatbot" desc="Enable smart assistant on your site for ₹299/month" />

          <div onClick={() => setShowAreaPopup(true)} className="cursor-pointer group">
            <CardBox emoji="🚚" title="Delivery Zones" desc="Set your service areas and delivery zones" />
          </div>
        </div>

        <div className="mt-8 p-6 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl border border-emerald-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Welcome to your admin panel! 🎉
          </h3>
          <p className="text-gray-600">
            Start by adding products to your catalog and configuring your delivery zones.
          </p>
        </div>
      </div>

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Domain Settings</h1>
        <DomainManualNotice />
      </div>

      <DeliveryAreaModal
        visible={showAreaPopup}
        onClose={() => setShowAreaPopup(false)}
        businessSlug={slug}
      />
    </div>
  );
}

function AdminCard({ slug, emoji, title, path, desc }) {
  return (
    <Link href={`/site/${slug}/admin/${path}`} className="group">
      <CardBox emoji={emoji} title={title} desc={desc} />
    </Link>
  );
}

function CardBox({ emoji, title, desc }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-emerald-200 transition-all duration-200 group-hover:scale-[1.02] h-full">
      <div className="flex items-center space-x-3 mb-3">
        <div className="text-2xl">{emoji}</div>
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      </div>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}
