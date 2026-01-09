"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { 
  ArrowUp, 
  ArrowLeft, 
  Package, 
  ShoppingBag, 
  CreditCard, 
  MapPin, 
  Mail, 
  Phone, 
  User,
  Layers,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import LabelModal from "./LabelModal";

export default function AdminOrdersPage() {
  const { slug } = useParams();
  const router = useRouter();
  const topRef = useRef(null);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScroll, setShowScroll] = useState(false);
  const [filter, setFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [business, setBusiness] = useState(null);
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const init = async () => {
      const { data: business, error } = await supabase
        .from("businesses")
        .select("orders, business_name, phone, address, whatsapp, type, logo, slug")
        .eq("slug", slug)
        .single();

      if (error || !business) {
        router.push("/");
        return;
      }

      setBusiness(business);

      const updatedOrders = (business.orders || []).map((order, index) => ({
        ...order,
        _id: index,
        status: order.status || "pending",
        orderType: order.orderType || "regular",
      }));

      updatedOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setOrders(updatedOrders);
      setLoading(false);
    };

    init();
  }, [slug, router]);

  useEffect(() => {
    const handleScroll = () => setShowScroll(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const updateOrdersInDB = async (updatedList) => {
    const { error } = await supabase
      .from("businesses")
      .update({ orders: updatedList })
      .eq("slug", slug);

    if (error) {
      alert("Update failed");
    } else {
      setOrders(updatedList);
    }
  };

  const toggleStatus = (id) => {
    const updated = orders.map((order) =>
      order._id === id
        ? { ...order, status: order.status === "done" ? "pending" : "done" }
        : order
    );
    updateOrdersInDB(updated);
  };

  const togglePrintfulStatus = (id) => {
    const updated = orders.map((order) =>
      order._id === id
        ? {
            ...order,
            printfulStatus:
              order.printfulStatus === "sent"
                ? "confirmed"
                : order.printfulStatus === "confirmed"
                ? "not_sent"
                : "sent",
          }
        : order
    );
    updateOrdersInDB(updated);
  };

  const deleteOrder = (id) => {
    if (!confirm("Delete this order?")) return;
    const updated = orders.filter((order) => order._id !== id);
    updateOrdersInDB(updated);
  };

  // ✅ FIXED: Properly extract items from order
  const getOrderItems = (order) => {
    const items = [];
    
    // Method 1: items array exists (new format)
    if (order.items && Array.isArray(order.items) && order.items.length > 0) {
      order.items.forEach(item => {
        // Skip if item looks like a placeholder
        if (item.name && !item.name.includes("Order (") && !item.name.includes(" items)")) {
          items.push({
            id: item.id,
            name: item.name,
            price: Number(item.price) || 0,
            quantity: item.quantity || 1,
            image: item.image || null,
            size: item.size || null,
          });
        }
      });
    }
    
    // Method 2: product object exists
    if (items.length === 0 && order.product && order.product.name) {
      if (!order.product.name.includes("Order (")) {
        items.push({
          id: order.product.id || order.productId,
          name: order.product.name,
          price: Number(order.product.price) || 0,
          quantity: order.orderDetails?.quantity || order.quantity || 1,
          image: order.product.image || null,
          size: order.orderDetails?.size || order.size || null,
        });
      }
    }
    
    // Method 3: flat productName field (old format)
    if (items.length === 0 && order.productName) {
      if (!order.productName.includes("Order (")) {
        items.push({
          id: order.productId,
          name: order.productName,
          price: Number(order.productPrice) || 0,
          quantity: order.quantity || 1,
          image: order.productImage || null,
          size: order.size || null,
        });
      }
    }
    
    return items;
  };

  const getTotalItemsCount = (order) => {
    // First check itemCount field
    if (order.itemCount) return order.itemCount;
    
    const items = getOrderItems(order);
    if (items.length > 0) {
      return items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    }
    
    // Fallback: try to parse from productName like "Order (2 items)"
    const match = order.productName?.match(/Order \((\d+) items?\)/);
    if (match) return parseInt(match[1]);
    
    return 1;
  };

  const getOrderTotal = (order) => {
    if (order.totalAmount) return order.totalAmount;
    if (order.orderDetails?.totalAmount) return order.orderDetails.totalAmount;
    
    const items = getOrderItems(order);
    if (items.length > 0) {
      return items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    }
    
    return Number(order.productPrice) || Number(order.product?.price) || 0;
  };

  const getCustomerInfo = (order) => ({
    name: order.customerName || order.customer?.name || order.name || "N/A",
    phone: order.customerPhone || order.customer?.phone || order.phone || "N/A",
    email: order.customerEmail || order.customer?.email || order.email || null,
    address: order.address || order.customer?.address || "N/A",
    city: order.city || order.customer?.city || "",
    state: order.state || order.customer?.state || "",
    pincode: order.pincode || order.customer?.zipCode || order.customer?.pincode || "",
    landmark: order.landmark || order.customer?.landmark || "",
  });

  const filteredOrders = orders.filter((order) => {
    const statusMatch = filter === "all" || order.status === filter;
    const typeMatch = typeFilter === "all" || order.orderType === typeFilter;
    return statusMatch && typeMatch;
  });

  const handleOpenLabel = (order) => {
    setSelectedOrder(order);
    setShowLabelModal(true);
  };

  const isPODOrder = (order) => order.orderType === "POD";

  return (
    <div ref={topRef} className="min-h-screen bg-gray-50 px-4 py-6">
      {/* Header */}
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => router.push(`/site/${slug}/admin`)}
            className="flex items-center gap-2 px-3 py-2 bg-white border rounded-lg text-sm hover:bg-gray-50 transition"
          >
            <ArrowLeft size={18} /> Back
          </button>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Package className="text-blue-600" /> Orders ({orders.length})
          </h1>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-3 bg-white p-4 rounded-xl shadow-sm">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="done">Completed</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="all">All Types</option>
            <option value="regular">Regular</option>
            <option value="POD">POD</option>
          </select>

          <div className="ml-auto text-sm text-gray-600">
            Showing <strong>{filteredOrders.length}</strong> orders
          </div>
        </div>

        {/* Orders */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl">
            <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No orders found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const items = getOrderItems(order);
              const totalItems = getTotalItemsCount(order);
              const orderTotal = getOrderTotal(order);
              const customer = getCustomerInfo(order);
              const hasNoItemDetails = items.length === 0;

              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white rounded-xl shadow-sm overflow-hidden border-l-4 ${
                    order.status === "done"
                      ? "border-green-500"
                      : isPODOrder(order)
                      ? "border-purple-500"
                      : "border-blue-500"
                  }`}
                >
                  {/* Order Header */}
                  <div className="p-4 bg-gray-50 border-b flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isPODOrder(order) ? "bg-purple-100" : "bg-blue-100"}`}>
                        {isPODOrder(order) ? <Package className="text-purple-600" size={20} /> : <ShoppingBag className="text-blue-600" size={20} />}
                      </div>
                      <div>
                        <p className="font-bold">#{order.orderId || `ORD-${order._id}`}</p>
                        <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-sm">
                        <Layers size={14} />
                        <span>{totalItems} item{totalItems > 1 ? "s" : ""}</span>
                      </div>
                      <p className="text-lg font-bold text-green-600">₹{orderTotal.toLocaleString("en-IN")}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === "done" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {order.status === "done" ? "✅ Done" : "⏳ Pending"}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 grid md:grid-cols-2 gap-4">
                    {/* Customer */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-sm text-gray-600 mb-3 flex items-center gap-2">
                        <User size={16} /> Customer
                      </h3>
                      <div className="space-y-2 text-sm">
                        <p className="font-medium">{customer.name}</p>
                        <p className="flex items-center gap-2">
                          <Phone size={14} className="text-gray-400" />
                          <a href={`tel:${customer.phone}`} className="text-blue-600">{customer.phone}</a>
                        </p>
                        {customer.email && (
                          <p className="flex items-center gap-2">
                            <Mail size={14} className="text-gray-400" />
                            {customer.email}
                          </p>
                        )}
                        <div className="pt-2 border-t mt-2">
                          <p className="text-xs text-gray-500 mb-1">Shipping Address:</p>
                          <p>{customer.address}</p>
                          {customer.landmark && <p className="text-gray-500">Near: {customer.landmark}</p>}
                          <p>{customer.city}{customer.city && customer.state ? ", " : ""}{customer.state} {customer.pincode && `- ${customer.pincode}`}</p>
                        </div>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h3 className="font-semibold text-sm text-gray-600 mb-3 flex items-center gap-2">
                        <Package size={16} /> Items to Ship
                      </h3>

                      {hasNoItemDetails ? (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                          <div className="flex items-start gap-2">
                            <AlertCircle size={18} className="text-amber-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-amber-800">Item details not available</p>
                              <p className="text-xs text-amber-600 mt-1">
                                This order was placed before item tracking was added.
                              </p>
                              <p className="text-sm mt-2">
                                <strong>Total Items:</strong> {totalItems}<br />
                                <strong>Total Amount:</strong> ₹{orderTotal.toLocaleString("en-IN")}
                              </p>
                              {order.productName && (
                                <p className="text-sm mt-1 text-gray-600">
                                  <strong>Order Label:</strong> {order.productName}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 bg-white p-2 rounded-lg border">
                              <div className="relative w-12 h-12 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                                {item.image ? (
                                  <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Package size={20} className="text-gray-300" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{item.name}</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                                    Qty: {item.quantity}
                                  </span>
                                  {item.size && (
                                    <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">
                                      {item.size}
                                    </span>
                                  )}
                                  <span className="text-xs font-semibold text-green-600">
                                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mt-3 pt-3 border-t border-blue-200 flex justify-between">
                        <span className="font-medium">Total:</span>
                        <span className="text-lg font-bold text-green-600">₹{orderTotal.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment */}
                  {(order.payment || order.paymentMethod) && (
                    <div className="px-4 pb-4">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex flex-wrap items-center gap-4 text-sm">
                        <CreditCard size={16} className="text-green-600" />
                        <span>
                          <strong>Payment:</strong>{" "}
                          {order.payment?.method || order.paymentMethod || "N/A"}
                        </span>
                        <span className={`uppercase font-semibold ${
                          order.payment?.status === "paid" || order.payment?.status === "success" ? "text-green-600" : "text-yellow-600"
                        }`}>
                          {order.payment?.status || (order.paymentMethod === "cod" ? "COD" : "Pending")}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="px-4 py-3 bg-gray-50 border-t flex flex-wrap gap-2">
                    <button
                      onClick={() => toggleStatus(order._id)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium text-white ${
                        order.status === "done" ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {order.status === "done" ? "↩️ Pending" : "✅ Done"}
                    </button>

                    {isPODOrder(order) && (
                      <button
                        onClick={() => togglePrintfulStatus(order._id)}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm"
                      >
                        Printful
                      </button>
                    )}

                    <button
                      onClick={() => handleOpenLabel(order)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm"
                    >
                      🖨️ Label
                    </button>

                    <a
                      href={`https://wa.me/${customer.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                        `Hi ${customer.name}! Your order #${order.orderId || order._id} update.`
                      )}`}
                      target="_blank"
                      className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
                    >
                      💬 WhatsApp
                    </a>

                    <button
                      onClick={() => deleteOrder(order._id)}
                      className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm ml-auto"
                    >
                      🗑️
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Label Modal */}
      {showLabelModal && (
        <LabelModal
          isOpen={showLabelModal}
          onClose={() => setShowLabelModal(false)}
          order={selectedOrder}
          slug={business?.slug}
        />
      )}

      {/* Scroll Top */}
      <AnimatePresence>
        {showScroll && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => topRef.current?.scrollIntoView({ behavior: "smooth" })}
            className="fixed bottom-6 right-6 p-3 bg-blue-600 text-white rounded-full shadow-lg"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
} 