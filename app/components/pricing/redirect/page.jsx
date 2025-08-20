// // app/pricing/redirect/page.js
// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// import { supabase } from "@/lib/supabase";

// export default function RedirectPage() {
//   const router = useRouter();

//   useEffect(() => {
//     const parseHashFragment = () => {
//       const hash = window.location.hash.substring(1); // remove #
//       const params = new URLSearchParams(hash);
//       const accessToken = params.get("access_token");
//       const refreshToken = params.get("refresh_token");

//       if (accessToken && refreshToken) {
//         // Optional: Save in Supabase session manually if needed (usually automatic)
//         toast.success("Logged in successfully!");
//         router.push("/site/[slug]/admin"); // or wherever you want to send
//       } else {
//         toast.error("Login failed. Try again.");
//         router.push("/login"); // or fallback
//       }
//     };

//     parseHashFragment();
//   }, []);

//   return (
//     <div className="flex h-screen justify-center items-center text-lg">
//       Logging you in...
//     </div>
//   );
// }
