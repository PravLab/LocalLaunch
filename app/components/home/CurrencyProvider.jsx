"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CurrencyContext = createContext();

const currencyData = {
  IN: { symbol: "₹", code: "INR", rate: 1 },
  US: { symbol: "$", code: "USD", rate: 0.012 },
  GB: { symbol: "£", code: "GBP", rate: 0.0095 },
  AE: { symbol: "د.إ", code: "AED", rate: 0.044 },
  EU: { symbol: "€", code: "EUR", rate: 0.011 },
  DEFAULT: { symbol: "₹", code: "INR", rate: 1 },
};

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(currencyData.DEFAULT);
  const [country, setCountry] = useState("IN");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function detectCountry() {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        const countryCode = data.country_code || "IN";
        setCountry(countryCode);
        setCurrency(currencyData[countryCode] || currencyData.DEFAULT);
      } catch (error) {
        console.log("Currency detection failed, using default");
        setCurrency(currencyData.DEFAULT);
      } finally {
        setLoading(false);
      }
    }
    detectCountry();
  }, []);

  const formatPrice = (priceINR) => {
    const converted = Math.round(priceINR * currency.rate);
    return `${currency.symbol}${converted.toLocaleString()}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, country, loading, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);