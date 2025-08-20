"use client";

import { useState, useEffect } from "react";
import AdminLoginModal from "./AdminLoginModal";

export default function AdminLoginButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setShow(false);
    };
    if (show) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [show]);

  return (
    <>
      <button
        onClick={() => setShow(true)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-full shadow transition"
      >
        Admin Access
      </button>

      {show && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => setShow(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-md mx-4 p-6 rounded-xl shadow-lg relative"
          >
            <button
              onClick={() => setShow(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
            >
              &times;
            </button>

            <AdminLoginModal onClose={() => setShow(false)} />
          </div>
        </div>
      )}
    </>
  );
}
