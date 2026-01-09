"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const checkAuth = () => {
      try {
        const storedBusiness = localStorage.getItem("business");
        const authToken = localStorage.getItem("authToken");

        if (storedBusiness && authToken) {
          const bizData = JSON.parse(storedBusiness);
          setBusiness(bizData);
          setUser({ email: bizData.email });
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signUp = async (businessData) => {
    const res = await fetch("/api/admin-signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(businessData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Signup failed");
    }

    // Store auth data
    localStorage.setItem("business", JSON.stringify(data.business));
    localStorage.setItem("authToken", data.token || "authenticated");
    
    setBusiness(data.business);
    setUser({ email: data.business.email });

    return data;
  };

  const signIn = async (email, password) => {
    const res = await fetch("/api/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    // Fetch full business data
    const bizRes = await fetch(`/api/get-business?slug=${data.slug}`);
    const bizData = await bizRes.json();

    localStorage.setItem("business", JSON.stringify(bizData));
    localStorage.setItem("authToken", data.token || "authenticated");
    
    setBusiness(bizData);
    setUser({ email: bizData.email });

    return data;
  };

  const signOut = async () => {
    try {
      await fetch("/api/logout-admin", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    }

    localStorage.removeItem("business");
    localStorage.removeItem("authToken");
    
    setUser(null);
    setBusiness(null);

    // Redirect to home if on admin page
    if (pathname?.includes("/admin")) {
      router.push("/");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        business,
        loading,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};