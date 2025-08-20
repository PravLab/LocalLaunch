"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { ArrowUp, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import LabelModal from "./LabelModal";
import Link from "next/link";

export default function AdminOrdersPage() {
  const { slug } = useParams();
  const router = useRouter();
  const topRef = useRef(null);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScroll, setShowScroll] = useState(false);
  const [filter, setFilter] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
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
      }));

      setOrders(updatedOrders);
      setLoading(false);
    };

    init();
  }, [slug, router]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };
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

  const deleteOrder = (id) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    const updated = orders.filter((order) => order._id !== id);
    updateOrdersInDB(updated);
  };

  const filteredOrders =
    filter === "all" ? orders : orders.filter((order) => order.status === filter);

  const handleOpenLabel = (order) => {
    setSelectedOrder(order);
    setShowLabelModal(true);
  };

  return (
    <div
      ref={topRef}
      className="min-h-screen bg-gradient-to-b from-gray-100 to-white text-black px-4 py-6"
    >
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => router.push(`/site/${slug}/admin`)}
          className="flex items-center gap-2 px-3 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <h1 className="text-2xl font-bold">📦 Manage Orders</h1>
      </div>

      <div className="mb-6">
        <label className="mr-2 text-sm font-medium">Filter:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded text-sm"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="done">Done</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center py-10 text-gray-600">Loading orders...</p>
      ) : filteredOrders.length === 0 ? (
        <p className="text-center py-10 text-gray-500">No orders found.</p>
      ) : (
        <div className="grid gap-4">
          {filteredOrders.map((order) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div>
                <h2 className="text-lg font-semibold">{order.product?.name || "Unnamed Product"}</h2>
                <p className="text-sm">Price: ₹{order.product?.price?.toLocaleString("en-IN")}</p>
                <p className="text-sm">Customer: {order.name}</p>
                <p className="text-sm">Phone: {order.phone}</p>
                <p className="text-sm">Address: {order.address}</p>
                <p className="text-xs text-gray-500">
                  Placed: {new Date(order.created_at).toLocaleString()}
                </p>
                <p
                  className={`mt-1 font-medium ${
                    order.status === "done" ? "text-green-600" : "text-yellow-600"
                  }`}
                >
                  Status: {order.status}
                </p>
              </div>

              <div className="flex flex-col gap-2 min-w-[150px]">
                <button
                  onClick={() => toggleStatus(order._id)}
                  className={`text-white px-3 py-1 rounded text-sm transition-colors duration-200 ${
                    order.status === "done"
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {order.status === "done" ? "Mark as Pending" : "Mark as Done"}
                </button>

                <button
                  onClick={() => deleteOrder(order._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>

                <button
                  onClick={() => handleOpenLabel(order)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  🖨️ Print Label
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {showLabelModal && (
        <LabelModal
          isOpen={showLabelModal}
          onClose={() => setShowLabelModal(false)}
          order={selectedOrder}
          slug={business?.slug}
        />
      )}

      {showScroll && (
        <button
          onClick={() => topRef.current?.scrollIntoView({ behavior: "smooth" })}
          className="fixed bottom-4 right-4 z-50 p-3 bg-black text-white rounded-full shadow-lg hover:bg-gray-800"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
}
