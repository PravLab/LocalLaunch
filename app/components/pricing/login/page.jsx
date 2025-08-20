// "use client";

// import { useEffect } from "react";
// import { usePathname } from "next/navigation";
// import { supabase } from "@/lib/supabase";
// import { toast } from "sonner";

// export default function LoginPage() {
//   const pathname = usePathname();
//   const slug = pathname.split("/")[2]; // because: /site/[slug]/admin/login
  
//   console.log(slug);
//   useEffect(() => {
//     const loginWithGoogle = async () => {
//       const { error } = await supabase.auth.signInWithOAuth({
//         provider: "google",
//         options: {
//           redirectTo: `${location.origin}/auth/callback?slug=${slug}`,
//         },
//       });
      
//       if (error) toast.error("Login failed.");
//     };
    
//     loginWithGoogle();
//   }, [slug]); // dependency added
  
//   return (
//     <div className="flex h-screen justify-center items-center text-lg">
//       Redirecting to Google login...
//     </div>
//   );
// }
