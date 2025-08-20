"use client";

import { useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
// import html2canvas from "html2canvas";
import domtoimage from "dom-to-image"; // ⬅️ new import

import {
  FaStore,
  FaTags,
  FaBolt,
  FaTruck,
  FaMobileAlt,
  FaMapMarkedAlt,
} from "react-icons/fa";
import { useBusiness } from "@/src/context/BusinessContext";
import { Share2 } from "lucide-react";

export default function PosterTemplates() {
  const qrRef = useRef();
  const posterRef = useRef();
  const { business } = useBusiness();
  const [qrCodeInstance, setQrCodeInstance] = useState(null);
useEffect(() => {
  if (!business?.slug || !qrRef.current) return;

  const businessURL = `https://${business.slug}.locallaunch.in`;

  const instance = new QRCodeStyling({
    width: 220,
    height: 220,
    data: businessURL,
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

  // ✅ Wait for QR code to finish rendering
  instance.getRawData("png").then(() => {
    setQrCodeInstance(instance);
  });
}, [business?.slug]);

const handleDownload = async (type = "png") => {
  if (!posterRef.current) return;

  const scale = 3; // for higher resolution
  const node = posterRef.current;

  const style = {
    transform: `scale(${scale})`,
    transformOrigin: "top left",
    width: `${node.offsetWidth}px`,
    height: `${node.offsetHeight}px`,
    backgroundColor: "#ffffff", // white background
  };

  const param = {
    width: node.offsetWidth * scale,
    height: node.offsetHeight * scale,
    style,
  };

  try {
    let dataUrl;
    if (type === "png") {
      dataUrl = await domtoimage.toPng(node, param);
    } else if (type === "jpeg" || type === "jpg") {
      dataUrl = await domtoimage.toJpeg(node, { ...param, quality: 0.95 });
    } else {
      alert("Unsupported file type!");
      return;
    }

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



  if (!business) return null;

  const businessURL = `https://${business.slug}.locallaunch.in`;

  return (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-center bg-[#fff1eb] px-4 py-10"
      style={{ background: "linear-gradient(to bottom right, #fff1eb, #ace0f9)" }}
    >
      <div
        ref={posterRef}
        className="w-[390px] bg-white rounded-3xl shadow-xl p-6 border border-gray-200 flex flex-col items-center"
      >
        <h1 className="text-2xl font-bold text-gray-800 mt-2 text-center">
          {business.slug}
        </h1>
        <p className="text-sm italic text-gray-500 text-center leading-snug">
          "India's Trusted Local Store – Now Online!"
        </p>
        <div
          className="w-14 h-1 my-3 rounded-full"
          style={{ background: "linear-gradient(to right, #ec4899, #facc15)" }}
        />

        <div className="bg-white/80 backdrop-blur-md p-3 rounded-xl shadow-xl border border-gray-200">
          <div ref={qrRef}></div>
          <div className="text-sm mt-2 font-bold text-gray-700 text-center">
            {business.name}
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
            <FaTags className="text-green-600 text-lg" /> Fresh Deals
          </div>
          <div className="flex flex-col items-center gap-1">
            <FaBolt className="text-yellow-500 text-lg" /> Fast Access
          </div>
          <div className="flex flex-col items-center gap-1">
            <FaTruck className="text-orange-500 text-lg" /> Home Delivery
          </div>
          <div className="flex flex-col items-center gap-1">
            <FaMobileAlt className="text-purple-600 text-lg" /> Mobile Friendly
          </div>
          <div className="flex flex-col items-center gap-1">
            <FaMapMarkedAlt className="text-pink-500 text-lg" /> Near You
          </div>
        </div>

       <a
  href={businessURL}
  target="_blank"
  className="mt-6 px-6 py-2 w-full max-w-[290px] text-white text-sm font-semibold rounded-full shadow-md hover:scale-105 transition-transform duration-300 text-center whitespace-nowrap"
  style={{ background: "linear-gradient(to right, #d946ef, #ef4444)" }}
>
  🚀 Explore Our Online Store Now
</a>


        <p className="mt-2 text-xs text-blue-700 font-mono">{businessURL}</p>
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
