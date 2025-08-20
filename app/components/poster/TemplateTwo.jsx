"use client";

import { useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import domtoimage from "dom-to-image";
import {
  FaStore,
  FaTags,
  FaBolt,
  FaTruck,
  FaMobileAlt,
  FaMapMarkedAlt,
} from "react-icons/fa";
import { Share2 } from "lucide-react";
import { useBusiness } from "@/src/context/BusinessContext";

export default function TemplateTwo() {
  const qrRef = useRef();
  const posterRef = useRef();
  const [qrCodeInstance, setQrCodeInstance] = useState(null);
   const { business } = useBusiness();

  
   
   
   useEffect(() => {
    if (! `https://${business.slug}.locallaunch.in` || !qrRef.current) return;

    const instance = new QRCodeStyling({
      width: 220,
      height: 220,
      data: `https://${business.slug}.locallaunch.in`,
      image: "/rocket.png",
      dotsOptions: {
        type: "extra-rounded",
        color: "#8b5cf6",
      },
      cornersSquareOptions: {
        type: "extra-rounded",
        color: "#4f46e5",
      },
      cornersDotOptions: {
        type: "dot",
        color: "#4f46e5",
      },
      imageOptions: {
        crossOrigin: "anonymous",
        imageSize: 0.3,
        margin: 5,
        hideBackgroundDots: true,
      },
      backgroundOptions: {
        color: "#ffffff",
      },
    });

    qrRef.current.innerHTML = "";
    instance.append(qrRef.current);

    instance.getRawData("png").then(() => {
      setQrCodeInstance(instance);
    });
  }, [business?.slug]);

  const handleDownload = async (type = "png") => {
    if (!posterRef.current) return;

    const scale = 3;
    const node = posterRef.current;

    const param = {
      width: node.offsetWidth * scale,
      height: node.offsetHeight * scale,
      style: {
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        width: `${node.offsetWidth}px`,
        height: `${node.offsetHeight}px`,
        backgroundColor: "#ffffff",
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
        title: `${business.slug}`,
        text: "Check out our store on Local Launch!",
        files: [file],
        url: `https://${business.slug}.locallaunch.in`,
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

  return (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-center bg-[#f0fdfa] px-4 py-10"
      style={{ background: "linear-gradient(to bottom right, #f0fdfa, #c7d2fe)" }}
    >
      <div
        ref={posterRef}
        className="w-[390px] bg-white rounded-3xl shadow-xl p-6 border border-gray-200 flex flex-col items-center"
      >
        <h1 className="text-2xl font-bold text-gray-800 mt-2 text-center">
          {` ${business.slug}` || "Your Business"}
        </h1>
        <p className="text-sm italic text-gray-500 text-center leading-snug">
          Your Local Store — Now Online!
        </p>
        <div
          className="w-14 h-1 my-3 rounded-full"
          style={{ background: "linear-gradient(to right, #38bdf8, #6366f1)" }}
        />

        <div className="bg-white/80 backdrop-blur-md p-3 rounded-xl shadow-xl border border-gray-200">
          <div ref={qrRef}>
            <p className="text-xs text-gray-400">Generating QR...</p>
          </div>
          <div className="text-sm mt-2 font-bold text-gray-700 text-center">
            {business.slug}
          </div>
        </div>

        <p className="text-sm font-semibold text-gray-700 mt-2 text-center">
          📲 Scan this QR & start shopping instantly!
        </p>

        <div className="grid grid-cols-3 gap-4 mt-5 text-[13px] text-gray-600 text-center">
          <div className="flex flex-col items-center gap-1">
            <FaStore className="text-blue-600 text-lg" /> Trusted Store
          </div>
          <div className="flex flex-col items-center gap-1">
            <FaTags className="text-green-600 text-lg" /> Fresh Offers
          </div>
          <div className="flex flex-col items-center gap-1">
            <FaBolt className="text-yellow-500 text-lg" /> Instant Access
          </div>
          <div className="flex flex-col items-center gap-1">
            <FaTruck className="text-orange-500 text-lg" /> Fast Delivery
          </div>
          <div className="flex flex-col items-center gap-1">
            <FaMobileAlt className="text-purple-600 text-lg" /> Mobile Ready
          </div>
          <div className="flex flex-col items-center gap-1">
            <FaMapMarkedAlt className="text-pink-500 text-lg" /> Nearby Store
          </div>
        </div>

        <a
          href={`https://${business.slug}.locallaunch.in`}
          target="_blank"
          className="mt-6 px-6 py-2 w-full max-w-[290px] text-white text-sm font-semibold rounded-full shadow-md hover:scale-105 transition-transform duration-300 text-center whitespace-nowrap"
          style={{ background: "linear-gradient(to right, #3b82f6, #6366f1)" }}
        >
          🌐 Visit Store Now
        </a>

        <p className="mt-2 text-xs text-blue-700 font-mono">{`https://${business.slug}.locallaunch.in`}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mt-6">
        <button
          onClick={() => handleDownload("png")}
          className="bg-blue-600 text-white px-5 py-2 rounded-full shadow hover:bg-blue-700 transition"
        >
          📥 Download PNG
        </button>
        <button
          onClick={() => handleDownload("jpeg")}
          className="bg-pink-600 text-white px-5 py-2 rounded-full shadow hover:bg-pink-700 transition"
        >
          🖼 Download JPG
        </button>
        <button
          onClick={handleShare}
          className="bg-green-600 text-white px-5 py-2 rounded-full shadow hover:bg-green-700 transition flex items-center gap-1"
        >
          <Share2 size={16} /> Share
        </button>
      </div>
    </div>
  );
}
