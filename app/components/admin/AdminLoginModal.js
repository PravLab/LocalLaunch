// components/admin/AdminLoginModal.jsx
"use client";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import ModalContent from "./ModalContent"; // The actual UI of modal

export default function AdminLoginModal({ onClose }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <ModalContent onClose={onClose} />,
    document.body // render outside Navbar
  );
}
