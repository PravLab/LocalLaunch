// // src/context/BusinessContext.js
// "use client";

// import { createContext, useContext } from "react";

// const BusinessContext = createContext();

// export const BusinessProvider = ({ value, children }) => {
//   return (
//     <BusinessContext.Provider value={value}>
//       {children}
//     </BusinessContext.Provider>
//   );
// };

// export const useBusiness = () => useContext(BusinessContext);



"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

const BusinessContext = createContext();

export const BusinessProvider = ({ children }) => {
  const pathname = usePathname();
  const slugMatch = pathname?.match(/\/site\/([^/]+)/);
  const slug = slugMatch?.[1] || null;

  const [business, setBusiness] = useState(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      if (!slug) return;
      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("slug", slug)
        .single();
      if (!error) setBusiness(data);
    };
    fetchBusiness();
  }, [slug]);

  return (
    <BusinessContext.Provider value={{ slug, business, setBusiness }}>

      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = () => useContext(BusinessContext);
