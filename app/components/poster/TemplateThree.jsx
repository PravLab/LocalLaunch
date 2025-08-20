"use client";

import { useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import domtoimage from "dom-to-image";
import {
  FaBolt,
  FaMapMarkedAlt,
  FaMobileAlt,
  FaTags,
  FaTruck,
  FaStore,
} from "react-icons/fa";
import { Share2 } from "lucide-react";
import { useBusiness } from "@/src/context/BusinessContext";

export default function TemplateThree({ siteName, fullURL, logo }) {
  const qrRef = useRef();
  const posterRef = useRef();
  const [qrInstance, setQrInstance] = useState(null);
   const { business } = useBusiness();

useEffect(() => {
  if (!qrRef.current || !fullURL) return;

  const qr = new QRCodeStyling({
    width: 200,
    height: 200,
    data: fullURL,
    image: "/rocket.png",
    dotsOptions: {
      type: "square",
      color: "#2563eb",
    },
    cornersSquareOptions: {
      type: "extra-rounded",
      color: "#1d4ed8",
    },
    cornersDotOptions: {
      type: "dot",
      color: "#1d4ed8",
    },
    imageOptions: {
      crossOrigin: "anonymous",
      imageSize: 0.25,
      margin: 3,
      hideBackgroundDots: true,
    },
    backgroundOptions: {
      color: "#ffffff",
    },
  });

  qrRef.current.innerHTML = "";
  qr.append(qrRef.current);
  setQrInstance(qr);

  // ✅ cleanup on component unmount
  return () => {
    qrRef.current && (qrRef.current.innerHTML = "");
  };
}, [fullURL]);


  const handleDownload = async (type = "png") => {
    if (!posterRef.current) return;

    const node = posterRef.current;
    const scale = 3;

    const param = {
      width: node.offsetWidth * scale,
      height: node.offsetHeight * scale,
      style: {
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        backgroundColor: "#ffffff",
        width: `${node.offsetWidth}px`,
        height: `${node.offsetHeight}px`,
      },
    };

    try {
      const dataUrl =
        type === "png"
          ? await domtoimage.toPng(node, param)
          : await domtoimage.toJpeg(node, { ...param, quality: 0.95 });

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `poster.${type}`;
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download poster.");
    }
  };

  const handleShare = async () => {
    try {
      if (!posterRef.current) return;

      const blob = await domtoimage.toBlob(posterRef.current);
      const file = new File([blob], "poster.png", { type: "image/png" });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: `${siteName}`,
          text: "Check out our store on Local Launch!",
          files: [file],
          url: fullURL,
        });
      } else {
        const url = URL.createObjectURL(file);
        window.open(url, "_blank");
      }
    } catch (err) {
      console.error("Sharing failed:", err);
      alert("Something went wrong while sharing.");
    }
  };

  if (!siteName || !fullURL) return null;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#f0f5ff] to-[#e0e7ff] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm bg-white rounded-3xl border shadow-xl overflow-hidden">
        <div ref={posterRef} className="p-6 flex flex-col items-center text-center">
          {logo && (
            <img
              src={logo}
              alt="Logo"
              className="w-16 h-16 mb-3 rounded-full border object-contain"
            />
          )}

          <h1 className="text-xl font-bold text-gray-800">{business.slug}</h1>
          <p className="text-sm italic text-gray-500 mt-1 mb-4">
            Your Local Store – Now Online!
          </p>

          <div
            ref={qrRef}
            className="p-2 bg-white rounded-xl shadow-md border mb-2"
          />

          <p className="text-xs text-gray-700 font-mono">{fullURL}</p>

          <div className="grid grid-cols-3 gap-4 mt-5 text-[13px] text-gray-600 text-center">
            <div className="flex flex-col items-center gap-1">
              <FaStore className="text-blue-600 text-lg" />
              Store
            </div>
            <div className="flex flex-col items-center gap-1">
              <FaTags className="text-green-600 text-lg" />
              Offers
            </div>
            <div className="flex flex-col items-center gap-1">
              <FaBolt className="text-yellow-500 text-lg" />
              Fast
            </div>
            <div className="flex flex-col items-center gap-1">
              <FaTruck className="text-orange-500 text-lg" />
              Delivery
            </div>
            <div className="flex flex-col items-center gap-1">
              <FaMobileAlt className="text-purple-600 text-lg" />
              Mobile
            </div>
            <div className="flex flex-col items-center gap-1">
              <FaMapMarkedAlt className="text-pink-500 text-lg" />
              Nearby
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 p-4 border-t">
          <button
            onClick={() => handleDownload("png")}
            className="bg-blue-600 text-white px-4 py-2 rounded-full shadow hover:bg-blue-700 text-sm"
          >
            📥 Download PNG
          </button>
          <button
            onClick={() => handleDownload("jpeg")}
            className="bg-pink-600 text-white px-4 py-2 rounded-full shadow hover:bg-pink-700 text-sm"
          >
            🖼 Download JPG
          </button>
          <button
            onClick={handleShare}
            className="bg-green-600 text-white px-4 py-2 rounded-full shadow hover:bg-green-700 flex items-center gap-1 text-sm"
          >
            <Share2 size={16} /> Share
          </button>
        </div>
      </div>
    </div>
  );
}
