// ✅ Final Full Admin Product Page (Polished & Improved UX/UI)
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import {
  ArrowLeft,
  ClipboardCopy,
  Eye,
  Moon,
  Sun,
  Filter,
  RefreshCw,
  XCircle
} from "lucide-react";

// Add this at the top of your component
import { ArrowUp } from "lucide-react";


export default function AdminProducts({ params }) {
  const topRef = useRef(null);
  const formRef = useRef(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", category: "", description: "", image: "", outOfStock: false, status: "active" });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [previewProduct, setPreviewProduct] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
  const handleScroll = () => {
    if (window.scrollY > 300) setShowScroll(true);
    else setShowScroll(false);
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);


  const router = useRouter();
  const { slug } = params;
  const itemsPerPage = 6;

  const generateSlug = (str) =>
    str?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  useEffect(() => {
    if (!slug) return;
    async function checkAdmin() {
      try {
        const { data: business,error } = await supabase
        .from("businesses")
        .select("admin_id, products")
        .eq("slug", slug)
        .single();

      
        setIsAdmin(true);
        fetchProducts();
      } catch {
       if (error || !business) {
        toast.error("Unauthorized. Redirecting...");
        router.push("/");
        return;
      }
      }
    }
    checkAdmin();
  }, [slug]);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from("businesses").select("products").eq("slug", slug).single();
    if (!error && data?.products) {
      const fixed = data.products.map((p) => ({
        ...p,
        slug: p.slug || generateSlug(p.name),
        outOfStock: p.outOfStock || false
      }));
      setProducts(fixed);
      setFiltered(fixed);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    filterProducts(value, statusFilter, stockFilter);
  };

  const filterProducts = (term, status, stock) => {
    let filteredList = products.filter((p) =>
      p.name.toLowerCase().includes(term.toLowerCase()) ||
      p.category?.toLowerCase().includes(term.toLowerCase())
    );
    if (status !== "all") filteredList = filteredList.filter(p => p.status === status);
    if (stock !== "all") filteredList = filteredList.filter(p => (stock === "in" ? !p.outOfStock : p.outOfStock));
    setFiltered(filteredList);
    setCurrentPage(1);
    if (filteredList.length === 0) toast.warning("No products found.");
  };

  const handleSave = async () => {
    const { name, price, image } = form;
    if (!name || !price || !image) return toast.error("Please fill all required fields.");
    const updated = [...products];
    const newProduct = {
      ...form,
      slug: generateSlug(form.name),
      outOfStock: !!form.outOfStock,
      updatedAt: new Date().toISOString()
    };
    if (editing !== null) updated[editing] = newProduct;
    else updated.push(newProduct);
    setLoading(true);
    const { error } = await supabase.from("businesses").update({ products: updated }).eq("slug", slug);
    setLoading(false);
    if (error) return toast.error("Save failed");
    toast.success(editing !== null ? "Product updated" : "Product added");
    setProducts(updated);
    setFiltered(updated);
    resetForm();
  };

  const handleDelete = (index) => {
    if (!confirm("Delete this product?")) return;
    const updated = [...products];
    updated.splice(index, 1);
    saveProducts(updated);
  };

  const saveProducts = async (updated) => {
    setLoading(true);
    const { error } = await supabase.from("businesses").update({ products: updated }).eq("slug", slug);
    setLoading(false);
    if (!error) {
      setProducts(updated);
      setFiltered(updated);
    } else toast.error("Error updating products");
  };

  const handleEdit = (index) => {
    setEditing(index);
    setForm(products[index]);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data?.url) setForm((prev) => ({ ...prev, image: data.url }));
      else toast.error("Image upload failed");
    } catch (err) {
      toast.error("Upload error");
    }
  };

  const resetForm = () => {
    setForm({ name: "", price: "", category: "", description: "", image: "", outOfStock: false, status: "active" });
    setEditing(null);
  };

  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  if (!isAdmin) return <div className="text-center py-20">Checking admin access...</div>;

  return (
    <div ref={topRef}>


    <div className={`min-h-screen p-4 md:p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black"}`}>
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => router.push(`/site/${slug}/admin`)} className="flex items-center gap-2 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
          <ArrowLeft size={18} /> Back
        </button>
        <div className="flex gap-2">
          <button onClick={() => setShowSidebar(p => !p)} className="p-2 rounded bg-white text-gray-600 hover:bg-gray-200"><Filter size={18} /></button>
          <button onClick={() => setDarkMode(p => !p)} className="p-2 rounded bg-white text-gray-600 hover:bg-gray-200">{darkMode ? <Sun size={18} /> : <Moon size={18} />}</button>
        </div>
      </div>

      {showSidebar && (
        <div className="mb-4 flex gap-4">
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); filterProducts(searchTerm, e.target.value, stockFilter); }} className="p-2 border rounded">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
          </select>
          <select value={stockFilter} onChange={(e) => { setStockFilter(e.target.value); filterProducts(searchTerm, statusFilter, e.target.value); }} className="p-2 border rounded">
            <option value="all">All Stock</option>
            <option value="in">In Stock</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>
      )}

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search by name or category"
        className="w-full md:w-1/3 p-2 mb-4 border rounded"
      />

      <p className="mb-4 text-sm text-gray-500">Total Products: {filtered.length}</p>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {paginated.map((product, index) => (
          <div key={index} className={`bg-white p-4 rounded shadow relative flex flex-col ${product.outOfStock ? "opacity-60" : ""}`}>
            <div className="absolute top-2 left-2 text-blue-500 cursor-pointer" onClick={() => setPreviewProduct(product)}>
              <Eye size={16} />
            </div>
            <div className="absolute top-2 right-2 text-gray-400 hover:text-black cursor-pointer" onClick={() => navigator.clipboard.writeText(window.location.origin + `/product/${slug}?name=${encodeURIComponent(product.name)}`)}>
              <ClipboardCopy size={16} />
            </div>
            <img src={product.image} alt={product.name} className="w-full h-40 object-contain rounded border mb-2" onError={(e) => e.target.style.display = 'none'} />
            <h3 className="text-lg font-semibold leading-tight line-clamp-2 mb-1">{product.name}</h3>
            <p className="text-sm font-medium text-gray-800">₹{product.price}</p>
            <p className="text-xs text-gray-600 line-clamp-2">{product.description}</p>
            <p className="text-xs text-gray-500">Category: {product.category}</p>
            <p className="text-xs text-gray-500">Status: {product.status}</p>
            <p className={`text-xs font-semibold ${product.outOfStock ? "text-red-500" : "text-green-600"}`}>{product.outOfStock ? "Out of Stock" : "In Stock"}</p>
            <p className="text-xs text-gray-400">Updated: {product.updatedAt?.slice(0, 10)}</p>
            <div className="flex gap-3 mt-2">
              <button onClick={() => handleEdit(index)} className="text-blue-600 text-sm font-medium">Edit</button>
              <button onClick={() => handleDelete(index)} className="text-red-600 text-sm font-medium">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalPages }, (_, idx) => (
            <button key={idx} onClick={() => setCurrentPage(idx + 1)} className={`px-3 py-1 rounded ${currentPage === idx + 1 ? "bg-black text-white" : "bg-gray-200"}`}>{idx + 1}</button>
          ))}
        </div>
      )}

      {/* Form Section */}
       <div ref={formRef} className="mt-10 bg-white p-4 md:p-6 rounded shadow w-full max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-4">{editing !== null ? "✏️ Edit Product" : "➕ Add Product"}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border p-2 rounded w-full" />
          <input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="border p-2 rounded w-full" />
          <input type="text" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="border p-2 rounded w-full" />
          <input type="text" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border p-2 rounded w-full" />
          <lable>
            Product Image
          <input type="file" accept="image/*" onChange={handleImageUpload} className="border p-2 rounded w-full" />
          </lable>
          <label className="flex gap-2 items-center">
            <input type="checkbox" checked={form.outOfStock} onChange={(e) => setForm({ ...form, outOfStock: e.target.checked })} /> Out of Stock
          </label>
        </div>
        {form.image && <img src={form.image} alt="Preview" className="w-full h-64 object-contain rounded mt-4 border" onError={(e) => e.target.style.display = 'none'} />}
        <div className="flex gap-4 mt-4 flex-wrap">
          <button onClick={handleSave} disabled={loading} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
            {loading ? "Saving..." : editing !== null ? "Update Product" : "Add Product"}
          </button>
          <button onClick={resetForm} className="flex items-center gap-1 text-sm px-4 py-2 rounded bg-gray-200 text-black hover:bg-gray-300">
            <RefreshCw size={14} /> Clear Form
          </button>
        </div>
      </div>

{previewProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 max-w-md w-full relative shadow-xl">
            <button onClick={() => setPreviewProduct(null)} className="absolute top-2 right-2 text-red-500">
              <XCircle size={20} />
            </button>
            <img
              src={previewProduct.image}
              alt={previewProduct.name}
              className="w-full h-64 object-contain rounded mb-4 border"
              onError={(e) => e.target.style.display = 'none'}
            />
            <h2 className="text-xl font-bold mb-1">{previewProduct.name}</h2>
            <p className="text-gray-600 font-semibold mb-1">₹{previewProduct.price}</p>
            <p className="text-sm text-gray-500 mb-1">{previewProduct.description}</p>
            <p className="text-xs text-gray-400">Category: {previewProduct.category}</p>
            <p className="text-xs text-gray-400">Status: {previewProduct.status}</p>
          </div>
        </div>
      )}

    </div>
{showScroll && (
  <button
    onClick={() => topRef.current?.scrollIntoView({ behavior: "smooth" })}
    className="fixed bottom-4 right-4 z-50 p-3 bg-black text-white rounded-full shadow-lg transition-opacity duration-300 hover:bg-gray-800"
  >
    <ArrowUp size={20} />
  </button>
)}


    </div>

  );
}
