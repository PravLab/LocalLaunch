"use client";
import { useEffect, useState } from "react";

export default function InstallPWAButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installable, setInstallable] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        console.log("PWA installed");
      } else {
        console.log("PWA installation declined");
      }
      setDeferredPrompt(null);
      setInstallable(false);
    } else {
      alert("App is already installed or not installable at this time.");
    }
  };

  return (
    <button
      onClick={handleInstallClick}
      className="bg-blue-600 text-white px-4 py-2 rounded shadow-lg"
    >
      Install App
    </button>
  );
}
