"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AddSubdomainButton({ slug, isEnabled }) {
  const [enabled, setEnabled] = useState(isEnabled);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (enabled) {
      alert("Subdomain already enabled.");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("businesses")
      .update({ enable_subdomain: true })
      .eq("slug", slug);

    setLoading(false);

    if (error) {
      alert("Failed to enable subdomain.");
    } else {
      setEnabled(true);
      alert(`Subdomain added! Now use: https://${slug}.locallaunch.in`);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow border mt-4">
      <h2 className="text-lg font-semibold mb-2">Subdomain</h2>

      {enabled ? (
        <div className="text-green-600 font-mono">
          ✅ Subdomain Enabled: https://{slug}.locallaunch.in
        </div>
      ) : (
        <button
          onClick={handleClick}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Enabling..." : "Add Subdomain"}
        </button>
      )}
    </div>
  );
}
