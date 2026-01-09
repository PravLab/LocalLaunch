"use client";
import { Dialog } from "@headlessui/react";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { usePathname } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function LabelModal({ isOpen, onClose, order, slug }) {
  const printRef = useRef();
  const [business, setBusiness] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    const businessSlug = slug || pathname.split("/")[2];
    if (!businessSlug) return;

    const fetchBusiness = async () => {
      const { data, error } = await supabase
        .from("businesses")
        .select("slug, business_name, address, phone, whatsapp")
        .eq("slug", businessSlug)
        .single();

      if (!error) setBusiness(data);
      else console.error("Supabase fetch error:", error.message);
    };

    fetchBusiness();
  }, [pathname, slug]);

  // Extract items from order
  const getOrderItems = (order) => {
    const items = [];
    
    if (order.items && Array.isArray(order.items) && order.items.length > 0) {
      order.items.forEach(item => {
        if (item.name && !item.name.includes("Order (")) {
          items.push({
            name: item.name,
            quantity: item.quantity || 1,
            size: item.size || null,
            price: item.price || 0,
          });
        }
      });
    } else if (order.product && order.product.name) {
      items.push({
        name: order.product.name,
        quantity: order.orderDetails?.quantity || order.quantity || 1,
        size: order.orderDetails?.size || order.size || null,
        price: order.product.price || 0,
      });
    } else if (order.productName) {
      items.push({
        name: order.productName,
        quantity: order.quantity || 1,
        size: order.size || null,
        price: order.productPrice || 0,
      });
    }
    
    return items;
  };

  // Get customer info
  const getCustomerInfo = (order) => ({
    name: order.customerName || order.customer?.name || order.name || "N/A",
    phone: order.customerPhone || order.customer?.phone || order.phone || "N/A",
    address: order.address || order.customer?.address || "N/A",
    city: order.city || order.customer?.city || "",
    state: order.state || order.customer?.state || "",
    pincode: order.pincode || order.customer?.zipCode || order.customer?.pincode || "",
    landmark: order.landmark || order.customer?.landmark || "",
  });

  // Get order total
  const getOrderTotal = (order) => {
    if (order.totalAmount) return order.totalAmount;
    if (order.orderDetails?.totalAmount) return order.orderDetails.totalAmount;
    
    const items = getOrderItems(order);
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handlePrint = () => {
    if (!order || !business) {
      alert("Order or business data not loaded");
      return;
    }

    const items = getOrderItems(order);
    const customer = getCustomerInfo(order);
    const orderTotal = getOrderTotal(order);
    const isCOD = order.paymentMethod === "cod" || order.payment?.method === "cod";
    const isPOD = order.orderType === "POD";

    // Build full address
    let fullAddress = customer.address;
    if (customer.landmark) fullAddress += `, Near ${customer.landmark}`;
    if (customer.city) fullAddress += `, ${customer.city}`;
    if (customer.state) fullAddress += `, ${customer.state}`;
    if (customer.pincode) fullAddress += ` - ${customer.pincode}`;

    // Build items list HTML
    const itemsHTML = items.map((item, idx) => `
      <div style="font-size: 11px; padding: 3px 0; border-bottom: 1px dashed #ccc;">
        <strong>${idx + 1}. ${item.name}</strong>
        ${item.size ? `<span style="background: #eee; padding: 1px 4px; font-size: 9px; border-radius: 3px; margin-left: 4px;">Size: ${item.size}</span>` : ''}
        <span style="float: right;">Qty: ${item.quantity}</span>
      </div>
    `).join('');

    const printWindow = window.open("", "", "width=400,height=600");
    if (!printWindow) {
      alert("Please allow popups to print the label");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Shipping Label - ${order.orderId || order._id}</title>
          <style>
            @media print {
              @page { 
                size: A6; 
                margin: 0; 
              }
              body { 
                margin: 0; 
                padding: 0; 
              }
            }
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Arial', sans-serif;
              background: #fff;
              color: #000;
            }
            .label {
              width: 105mm;
              height: 148mm;
              padding: 8mm;
              border: 2px solid #000;
              position: relative;
              background: #fff;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #000;
              padding-bottom: 4mm;
              margin-bottom: 3mm;
            }
            .header h1 {
              font-size: 16px;
              font-weight: bold;
              margin-bottom: 2mm;
              text-transform: uppercase;
            }
            .header .order-id {
              font-size: 12px;
              font-weight: bold;
              background: #000;
              color: #fff;
              padding: 2px 8px;
              display: inline-block;
              border-radius: 3px;
            }
            .section {
              margin-bottom: 3mm;
            }
            .section-title {
              font-size: 11px;
              font-weight: bold;
              text-transform: uppercase;
              background: #000;
              color: #fff;
              padding: 2px 4px;
              margin-bottom: 2mm;
              display: inline-block;
            }
            .section-content {
              font-size: 10px;
              line-height: 1.4;
            }
            .info-line {
              margin-bottom: 1mm;
            }
            .badge {
              display: inline-block;
              background: #000;
              color: #fff;
              font-size: 9px;
              padding: 2px 6px;
              font-weight: bold;
              border-radius: 3px;
              margin-top: 2mm;
            }
            .badge.cod {
              background: #dc2626;
            }
            .badge.pod {
              background: #7c3aed;
            }
            .items-box {
              border: 1px solid #000;
              padding: 2mm;
              margin-top: 2mm;
              max-height: 30mm;
              overflow: hidden;
            }
            .total {
              font-size: 12px;
              font-weight: bold;
              text-align: right;
              margin-top: 2mm;
              padding-top: 2mm;
              border-top: 2px solid #000;
            }
            .footer {
              position: absolute;
              bottom: 4mm;
              left: 8mm;
              right: 8mm;
              text-align: center;
              font-size: 9px;
              padding-top: 2mm;
              border-top: 1px dashed #666;
            }
            .barcode {
              text-align: center;
              font-family: monospace;
              font-size: 14px;
              letter-spacing: 2px;
              margin: 2mm 0;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="label">
            <!-- Header -->
            <div class="header">
              <h1>${business?.business_name || business?.slug || "Store"}</h1>
              <div class="order-id">#${order.orderId || `ORD-${order._id}`}</div>
              <div style="font-size: 9px; margin-top: 2mm;">${new Date(order.created_at).toLocaleDateString()}</div>
            </div>

            <!-- From -->
            <div class="section">
              <div class="section-title">From (Sender)</div>
              <div class="section-content">
                <div class="info-line"><strong>${business?.business_name || business?.slug || "Your Business"}</strong></div>
                <div class="info-line">${business?.address || "Business Address"}</div>
                <div class="info-line">📞 ${business?.phone || business?.whatsapp || "Contact Phone"}</div>
              </div>
            </div>

            <!-- To -->
            <div class="section">
              <div class="section-title">To (Recipient)</div>
              <div class="section-content">
                <div class="info-line"><strong>${customer.name}</strong></div>
                <div class="info-line">${fullAddress}</div>
                <div class="info-line">📞 ${customer.phone}</div>
              </div>
            </div>

            <!-- Items -->
            <div class="section">
              <div class="section-title">Items (${items.length})</div>
              <div class="items-box">
                ${itemsHTML}
              </div>
              <div class="total">
                Total: ₹${orderTotal.toLocaleString("en-IN")}
              </div>
            </div>

            <!-- Badges -->
            <div style="margin-top: 3mm;">
              ${isCOD ? '<span class="badge cod">💰 CASH ON DELIVERY</span>' : '<span class="badge">✅ PREPAID</span>'}
              ${isPOD ? '<span class="badge pod">🎨 PRINT ON DEMAND</span>' : ''}
            </div>

            <!-- Barcode/ID -->
            <div class="barcode">
              *${order.orderId || `ORD${order._id}`}*
            </div>

            <!-- Footer -->
            <div class="footer">
              Handle with care • ${business?.business_name || business?.slug || "Your Business"}
            </div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    
    // Auto print after content loads
    setTimeout(() => {
      printWindow.print();
      // Optional: close after printing
      // printWindow.onafterprint = () => printWindow.close();
    }, 500);
  };

  if (!order || !business) {
    return (
      <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <Dialog.Panel className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading label data...</p>
        </Dialog.Panel>
      </Dialog>
    );
  }

  const items = getOrderItems(order);
  const customer = getCustomerInfo(order);
  const orderTotal = getOrderTotal(order);

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <Dialog.Panel className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full">
        <h3 className="text-lg font-bold mb-4">📦 Shipping Label Preview</h3>

        {/* Preview */}
        <div
          ref={printRef}
          className="w-full p-4 bg-white text-black border-2 border-dashed border-gray-400 rounded-lg text-sm"
          style={{ maxHeight: '400px', overflowY: 'auto' }}
        >
          <div className="text-center mb-3 pb-2 border-b-2 border-gray-300">
            <h2 className="text-base font-bold">{business?.business_name || business?.slug}</h2>
            <div className="text-xs bg-black text-white inline-block px-2 py-1 rounded mt-1">
              #{order.orderId || `ORD-${order._id}`}
            </div>
          </div>

          <div className="mb-3">
            <div className="font-bold text-xs mb-1 bg-gray-200 px-2 py-1">FROM:</div>
            <div className="text-xs pl-2">
              <div>{business?.business_name || business?.slug}</div>
              <div>{business?.address || "Business Address"}</div>
              <div>📞 {business?.phone || business?.whatsapp}</div>
            </div>
          </div>

          <div className="mb-3">
            <div className="font-bold text-xs mb-1 bg-gray-200 px-2 py-1">TO:</div>
            <div className="text-xs pl-2">
              <div className="font-semibold">{customer.name}</div>
              <div>{customer.address}</div>
              {customer.landmark && <div>Near: {customer.landmark}</div>}
              <div>{customer.city}{customer.city && customer.state ? ", " : ""}{customer.state} {customer.pincode && `- ${customer.pincode}`}</div>
              <div>📞 {customer.phone}</div>
            </div>
          </div>

          <div className="mb-3">
            <div className="font-bold text-xs mb-1 bg-gray-200 px-2 py-1">ITEMS ({items.length}):</div>
            <div className="text-xs pl-2">
              {items.map((item, idx) => (
                <div key={idx} className="py-1 border-b border-gray-200">
                  <div className="flex justify-between">
                    <span>{idx + 1}. {item.name}</span>
                    <span>x{item.quantity}</span>
                  </div>
                  {item.size && <div className="text-[10px] text-gray-500">Size: {item.size}</div>}
                </div>
              ))}
              <div className="font-bold text-right mt-2 pt-2 border-t-2 border-gray-400">
                Total: ₹{orderTotal.toLocaleString("en-IN")}
              </div>
            </div>
          </div>

          <div className="text-xs">
            {(order.paymentMethod === "cod" || order.payment?.method === "cod") && (
              <span className="inline-block bg-red-600 text-white px-2 py-1 rounded mr-2">
                💰 COD
              </span>
            )}
            {order.orderType === "POD" && (
              <span className="inline-block bg-purple-600 text-white px-2 py-1 rounded">
                🎨 POD
              </span>
            )}
          </div>

          <div className="mt-3 pt-2 border-t border-gray-300 text-center text-[10px] text-gray-500">
            Handle with care • {new Date(order.created_at).toLocaleDateString()}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            🖨️ Print Label
          </button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}