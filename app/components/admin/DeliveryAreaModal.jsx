"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

export default function DeliveryAreaModal({ visible, businessSlug, onClose }) {
  const [areas, setAreas] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!visible || !businessSlug) return;

    const fetchAreas = async () => {
      const { data, error } = await supabase
        .from("businesses")
        .select("delivery_area")
        .eq("slug", businessSlug)
        .single();

      if (error) {
        toast.error("Failed to fetch delivery areas");
        return;
      }

      if (data?.delivery_area?.length) {
        setAreas(data.delivery_area.map((a) => a.trim()));
      } else {
        setAreas([]);
      }
    };

    fetchAreas();
  }, [visible, businessSlug]);

  const handleAddArea = () => {
    const trimmed = input.trim();
    if (trimmed && !areas.includes(trimmed)) {
      setAreas([...areas, trimmed]);
    }
    setInput("");
  };

  const handleDeleteArea = (areaToRemove) => {
    setAreas(areas.filter((a) => a !== areaToRemove));
  };

  const handleSave = async () => {
    const cleanedAreas = areas
      .map((a) => a.trim())
      .filter((a, i, self) => a.length > 0 && self.indexOf(a) === i);

    const { error } = await supabase
      .from("businesses")
      .update({ delivery_area: cleanedAreas })
      .eq("slug", businessSlug);

    if (error) {
      toast.error("Failed to update delivery areas");
    } else {
      toast.success("Delivery areas updated");
      onClose();
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center px-4">
      <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 w-full max-w-md shadow-xl relative animate-fade-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-xl text-red-500 hover:text-red-700"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-4 text-center text-zinc-900 dark:text-white">
          🚚 Set Delivery Areas
        </h2>

        {/* Area tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {areas.map((area, idx) => (
            <span
              key={idx}
              className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
            >
              {area}
              <button
                onClick={() => handleDeleteArea(area)}
                className="text-red-500 hover:text-red-700"
              >
                &times;
              </button>
            </span>
          ))}
        </div>

        {/* Input for new area */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddArea();
              }
            }}
            placeholder="Add a new area"
            className="w-full border border-gray-300 rounded px-3 py-2 dark:bg-zinc-800 dark:text-white dark:border-zinc-700"
          />
          <button
            onClick={handleAddArea}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded"
          >
            Add
          </button>
        </div>

        {/* Buttons */}
        <div className="flex justify-end mt-4 gap-3 flex-wrap">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
