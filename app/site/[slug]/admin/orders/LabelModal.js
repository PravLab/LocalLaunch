"use client";
import { Dialog } from "@headlessui/react";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { usePathname } from "next/navigation";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function LabelModal({ isOpen, onClose, order, id }) {
  const printRef = useRef();
  const [business, setBusiness] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    const slug = pathname.split("/")[2]; // /site/[slug]/admin
    if (!slug) return;

    const fetchBusiness = async () => {
      const { data, error } = await supabase
        .from("businesses")
        .select("slug, address, phone")
        .eq("slug", slug)
        .single();

      if (!error) setBusiness(data);
      else console.error("Supabase fetch error:", error.message);
    };

    fetchBusiness();
  }, [pathname]);

const handlePrint = () => {
  const printWindow = window.open("", "", "width=400,height=600");
  if (!printWindow) return;

  const isCOD = order.payment === "COD";

  printWindow.document.write(`
    <html>
      <head>
        <title>Shipping Label</title>
        <style>
          @media print {
            @page { size: A6; margin: 0; }
            body { margin: 0; padding: 0; }
          }
          body {
            font-family: sans-serif;
            margin: 0;
            padding: 0;
            background: #fff;
          }
          .label-box {
            width: 105mm;
            height: 110mm; /* slightly reduced height */
            padding: 12px;
            box-sizing: border-box;
            border: 2px solid #000;
            display: flex;
            flex-direction: column;
            justify-content: start;
            position: relative;
          }
          h2 {
            text-align: center;
            margin: 0 0 10px;
            font-size: 16px;
            font-weight: bold;
            text-transform: uppercase;
          }
          .info {
            font-size: 13px;
            margin-bottom: 5px;
          }
          .heading {
            font-weight: bold;
            text-transform: uppercase;
            font-size: 16px;
            margin: 8px 0 4px;
          }
          .cod-badge {
            display: inline-block;
            background: #000;
            color: #fff;
            font-size: 11px;
            padding: 2px 6px;
            font-weight: bold;
            margin-top: 6px;
            border-radius: 4px;
            width: fit-content;
          }
          .footer {
            position: absolute;
            bottom: 8px;
            font-size: 11px;
            color: #222;
            width: 100%;
            text-align: center;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="label-box">
          <h2>To Be Delivered</h2>

          <div class="heading">From:</div>
          <div class="info">${business?.slug || "Your Business"}</div>
          <div class="info">${business?.address || "Business Address"}</div>
          <div class="info">Phone: ${business?.phone || "9876543210"}</div>

          <div class="heading">To:</div>
          <div class="info">${order.name}</div>
          <div class="info">${order.address}</div>
          <div class="info">Phone: ${order.phone}</div>

          <div class="heading">Order Info:</div>
          <div class="info">Order ID: #${order._id}</div>
          <div class="info">Date: ${new Date(order.created_at).toLocaleDateString()}</div>
          ${isCOD ? `<div class="cod-badge">CASH ON DELIVERY</div>` : ""}

          <div class="footer " style={{fontSize: '15px'}}>Delivered with care by ${business?.slug || "Your Business"}</div>
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => printWindow.print(), 500);
};



  if (!order || !business) return null;










  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <Dialog.Panel className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full">
        {order ? (
          <div
            ref={printRef}
            className="w-[350px] p-4 bg-white text-black border border-dashed border-gray-700 rounded shadow print:shadow-none print:border-none print:w-full"
          >
            <h2 className="text-xl font-bold text-center mb-2">{business?.slug || "Loading..."}</h2>

            <div className="text-sm text-center mb-3">
              <div><strong>From:</strong> {business?.address || "Your Business Address"}</div>
              <div><strong>Phone:</strong> {business?.phone || "987654...."}</div>
            </div>

            <hr className="border-gray-400 mb-2" />

            <div className="mb-1"><strong>Order ID:</strong> #{order._id}</div>
            <div className="mb-1"><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</div>
            <div className="mb-1"><strong>Customer:</strong> {order.name}</div>
            <div className="mb-1"><strong>Phone:</strong> {order.phone}</div>
            <div className="mb-1"><strong>Address:</strong> {order.address}</div>

            {order.note && (
              <div className="mt-2 text-sm border-t pt-2 italic"><strong>Note:</strong> {order.note}</div>
            )}
          </div>
        ) : (
          <p className="text-red-500">Invalid order data. Please try again.</p>
        )}

        <div className="mt-4 flex justify-center gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            🖨️ Print
          </button>


          <button
            onClick={onClose}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}