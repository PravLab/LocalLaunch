// app/site/[slug]/admin/products/page.js
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Search,
  Filter,
  Sun,
  Moon,
  Eye,
  X,
  ClipboardCopy,
  RefreshCw
} from "lucide-react";

// ---------- SECURITY HELPERS ----------

const sanitizeText = (value, maxLen = 300) => {
  if (typeof value !== "string") return "";
  return value
    .slice(0, maxLen)
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .replace(/<\/?script.*?>/gi, "");
};

const sanitizePrice = (value) => {
  const num = parseFloat(value);
  if (Number.isNaN(num) || num < 0) return "";
  return num.toFixed(2);
};

const generateSlug = (str) =>
  sanitizeText(str || "", 100)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");

// --------------------------------------

const emptyForm = {
  name: "",
  price: "",
  category: "",
  description: "",
  image: "",
  status: "active", // "active" | "draft"
  outOfStock: false,
};

export default function AdminProductsPage() {
  const router = useRouter();
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const [businessName, setBusinessName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [darkMode, setDarkMode] = useState(false);

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingIndex, setEditingIndex] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | active | draft
  const [stockFilter, setStockFilter] = useState("all");   // all | in | out

  const [previewProduct, setPreviewProduct] = useState(null);

  // ---------- LOAD DATA ----------
  useEffect(() => {
    if (!slug) return;

    const fetchBusiness = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("businesses")
          .select("business_name, products")
          .eq("slug", slug)
          .single();

        if (error || !data) {
          console.error("Fetch business error:", error);
          toast.error("Store not found");
          router.push("/");
          return;
        }

        setBusinessName(data.business_name || "");

        const rawProducts = Array.isArray(data.products) ? data.products : [];

        const normalized = rawProducts.map((p) => ({
          name: sanitizeText(p.name || "", 200),
          price: (p.price ?? "").toString(),
          category: sanitizeText(p.category || "", 100),
          description: sanitizeText(p.description || "", 1000),
          image: sanitizeText(p.image || "", 500),
          status: p.status === "draft" ? "draft" : "active",
          outOfStock: !!p.outOfStock,
          slug: p.slug || generateSlug(p.name || ""),
          updatedAt: p.updatedAt || p.updated_at || null,
        }));

        setProducts(normalized);
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
  }, [slug, router]);

  // ---------- FILTERED PRODUCTS ----------
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      list = list.filter((p) => p.status === statusFilter);
    }

    if (stockFilter !== "all") {
      list = list.filter((p) =>
        stockFilter === "in" ? !p.outOfStock : p.outOfStock
      );
    }

    return list;
  }, [products, search, statusFilter, stockFilter]);

  const categories = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  // ---------- FORM HANDLERS ----------
  const handleFormChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: field === "name" ? value.slice(0, 120) : value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        toast.error("Image upload failed");
        return;
      }

      const data = await res.json();
      if (!data?.url) {
        toast.error("Invalid upload response");
        return;
      }

      setForm((prev) => ({ ...prev, image: sanitizeText(data.url, 500) }));
      toast.success("Image uploaded");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Image upload error");
    }
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      toast.error("Product name is required");
      return false;
    }
    if (!form.price) {
      toast.error("Price is required");
      return false;
    }
    const priceSanitized = sanitizePrice(form.price);
    if (!priceSanitized) {
      toast.error("Please enter a valid price");
      return false;
    }
    if (!form.image) {
      toast.error("Product image is required");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!slug) {
      toast.error("Missing store slug");
      return;
    }
    if (!validateForm()) return;

    const sanitizedProduct = {
      name: sanitizeText(form.name, 200),
      price: sanitizePrice(form.price),
      category: sanitizeText(form.category, 100),
      description: sanitizeText(form.description, 1000),
      image: sanitizeText(form.image, 500),
      status: form.status === "draft" ? "draft" : "active",
      outOfStock: !!form.outOfStock,
      slug: generateSlug(form.name),
      updatedAt: new Date().toISOString(),
    };

    const updated = [...products];
    if (editingIndex !== null) {
      updated[editingIndex] = sanitizedProduct;
    } else {
      updated.push(sanitizedProduct);
    }

    try {
      setSaving(true);
      const { error } = await supabase
        .from("businesses")
        .update({ products: updated })
        .eq("slug", slug);

      if (error) {
        console.error("Save error:", error);
        toast.error("Failed to save products");
        return;
      }

      setProducts(updated);
      toast.success(editingIndex !== null ? "Product updated" : "Product added");
      resetForm();
    } catch (err) {
      console.error("Save exception:", err);
      toast.error("Error saving products");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (index) => {
    const p = products[index];
    setForm({
      name: p.name || "",
      price: p.price || "",
      category: p.category || "",
      description: p.description || "",
      image: p.image || "",
      status: p.status || "active",
      outOfStock: !!p.outOfStock,
    });
    setEditingIndex(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (index) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const updated = products.filter((_, i) => i !== index);

    try {
      setSaving(true);
      const { error } = await supabase
        .from("businesses")
        .update({ products: updated })
        .eq("slug", slug);

      if (error) {
        console.error("Delete error:", error);
        toast.error("Failed to delete product");
        return;
      }

      setProducts(updated);
      toast.success("Product deleted");
      if (editingIndex === index) resetForm();
    } catch (err) {
      console.error("Delete exception:", err);
      toast.error("Error deleting product");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingIndex(null);
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setStockFilter("all");
  };

  // ---------- RENDER ----------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading products...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <div
        className={`sticky top-0 z-20 border-b ${
          darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push(`/site/${slug}/admin`)}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full border text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft size={16} />
              Dashboard
            </button>
            <div>
              <h1 className="text-lg font-semibold">
                Products — {businessName || "Store"}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Manage your catalog, prices, and stock.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className={`pl-8 pr-3 py-1.5 rounded-full text-sm border ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-gray-50 border-gray-300 text-gray-900"
                }`}
              />
            </div>

            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className={`p-2 rounded-full border ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Top row: Form + Quick stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
          {/* Form Card */}
          <div
            className={`lg:col-span-2 rounded-2xl shadow-sm border ${
              darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
            } p-4 sm:p-6`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-semibold">
                {editingIndex !== null ? "Edit Product" : "Add New Product"}
              </h2>
              {editingIndex !== null && (
                <button
                  onClick={resetForm}
                  className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <RefreshCw size={12} />
                  New Product
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                  placeholder="e.g. Fresh Apples 1kg"
                  className={`w-full px-3 py-2 rounded-md border text-sm ${
                    darkMode
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => handleFormChange("price", e.target.value)}
                  placeholder="e.g. 99"
                  className={`w-full px-3 py-2 rounded-md border text-sm ${
                    darkMode
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => handleFormChange("category", e.target.value)}
                  placeholder="e.g. Fruits, Snacks"
                  list="category-suggestions"
                  className={`w-full px-3 py-2 rounded-md border text-sm ${
                    darkMode
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
                {/* Data list for quick categories */}
                <datalist id="category-suggestions">
                  {categories.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => handleFormChange("status", e.target.value)}
                  className={`w-full px-3 py-2 rounded-md border text-sm ${
                    darkMode
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                >
                  <option value="active">Active (Visible)</option>
                  <option value="draft">Draft (Hidden)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    handleFormChange("description", e.target.value)
                  }
                  placeholder="Short product description, ingredients, etc."
                  className={`w-full px-3 py-2 rounded-md border text-sm ${
                    darkMode
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">
                  Product Image *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className={`w-full px-3 py-2 rounded-md border text-sm cursor-pointer ${
                    darkMode
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
                {form.image && (
                  <p className="mt-1 text-[11px] text-gray-500 break-all">
                    Current: {form.image}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 mt-4 md:mt-8">
                <label className="inline-flex items-center gap-2 text-xs font-medium">
                  <input
                    type="checkbox"
                    checked={form.outOfStock}
                    onChange={(e) =>
                      handleFormChange("outOfStock", e.target.checked)
                    }
                  />
                  Mark as Out of Stock
                </label>
              </div>
            </div>

            {form.image && (
              <div className="mt-4">
                <p className="text-xs font-medium mb-1">Preview</p>
                <div className="relative w-full max-w-xs aspect-square rounded-md border overflow-hidden">
                  <Image
                    src={form.image}
                    alt="Preview"
                    fill
                    className="object-contain bg-gray-50 dark:bg-gray-800"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? (
                  "Saving..."
                ) : editingIndex !== null ? (
                  <>
                    <Pencil size={14} />
                    Update Product
                  </>
                ) : (
                  <>
                    <Plus size={14} />
                    Add Product
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md border text-xs font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <RefreshCw size={13} />
                Clear Form
              </button>
            </div>
          </div>

          {/* Quick Stats / Filters Summary */}
          <div
            className={`rounded-2xl shadow-sm border ${
              darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
            } p-4 space-y-4`}
          >
            <div>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Filter size={14} />
                Filters
              </h3>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="block text-[11px] text-gray-500 mb-1">
                    Status
                  </span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className={`w-full px-2 py-1.5 rounded-md border text-xs ${
                      darkMode
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <div>
                  <span className="block text-[11px] text-gray-500 mb-1">
                    Stock
                  </span>
                  <select
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value)}
                    className={`w-full px-2 py-1.5 rounded-md border text-xs ${
                      darkMode
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  >
                    <option value="all">All</option>
                    <option value="in">In Stock</option>
                    <option value="out">Out of Stock</option>
                  </select>
                </div>
                <button
                  onClick={clearFilters}
                  className="mt-1 text-[11px] text-red-500 hover:underline"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            <div className="border-t pt-3 text-xs space-y-1">
              <p>
                Total products:{" "}
                <span className="font-semibold">{products.length}</span>
              </p>
              <p>
                Showing:{" "}
                <span className="font-semibold">{filteredProducts.length}</span>
              </p>
              <p className="text-[11px] text-gray-500 mt-1">
                Tip: Use categories to group similar items (e.g. Fruits, Dairy,
                Snacks).
              </p>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <section className="mt-4">
          {filteredProducts.length === 0 ? (
            <div
              className={`rounded-2xl border shadow-sm py-12 text-center ${
                darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
              }`}
            >
              <div className="text-5xl mb-3">📦</div>
              <h3 className="text-lg font-semibold mb-1">
                {products.length === 0
                  ? "No products yet"
                  : "No products match your filters"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {products.length === 0
                  ? "Start by adding your first product using the form above."
                  : "Try clearing filters or searching with a different term."}
              </p>
              {products.length > 0 && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product, index) => {
                const originalIndex = products.findIndex(
                  (p) => p.slug === product.slug && p.name === product.name
                );
                const isOut = product.outOfStock;

                const productUrl =
                  typeof window !== "undefined"
                    ? `${window.location.origin}/site/${slug}/product/${product.slug}`
                    : "";

                return (
                  <div
                    key={product.slug || index}
                    className={`relative rounded-xl border shadow-sm overflow-hidden flex flex-col ${
                      darkMode
                        ? "bg-gray-900 border-gray-800"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    {/* Top badges */}
                    <div className="absolute top-2 left-2 flex gap-1 z-10">
                      {product.status === "draft" && (
                        <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 text-[10px] font-medium">
                          Draft
                        </span>
                      )}
                      {isOut && (
                        <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-medium">
                          Out of Stock
                        </span>
                      )}
                    </div>

                    {/* Copy Link & Preview */}
                    <div className="absolute top-2 right-2 flex gap-1 z-10">
                      {productUrl && (
                        <button
                          onClick={() => {
                            navigator.clipboard
                              .writeText(productUrl)
                              .then(() => toast.success("Product link copied"))
                              .catch(() => toast.error("Failed to copy link"));
                          }}
                          className="p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70"
                          title="Copy product link"
                        >
                          <ClipboardCopy size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => setPreviewProduct(product)}
                        className="p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70"
                        title="Preview"
                      >
                        <Eye size={14} />
                      </button>
                    </div>

                    {/* Image */}
                    <div className="relative aspect-square bg-gray-50 dark:bg-gray-800">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-contain"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-3 flex flex-col flex-1">
                      <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                        {product.name}
                      </h3>
                      {product.category && (
                        <p className="text-[11px] text-gray-500 mb-1">
                          {product.category}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">
                          ₹{product.price}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(originalIndex)}
                            className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300"
                          >
                            <Pencil size={12} />
                          </button>
                          <button
                            onClick={() => handleDelete(originalIndex)}
                            className="text-xs px-2 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      {product.updatedAt && (
                        <p className="mt-1 text-[10px] text-gray-400">
                          Updated: {product.updatedAt.slice(0, 10)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Preview Modal */}
      {/* Preview Modal */}
{previewProduct && (
  <div
    className="fixed inset-0 bg-black/60 flex items-center justify-center z-40"
    onClick={() => setPreviewProduct(null)} // click outside to close
  >
    <div
      className="relative bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full mx-4 shadow-xl overflow-hidden"
      onClick={(e) => e.stopPropagation()} // don't close when clicking inside
    >
      {/* Close (X) button */}
      <button
        onClick={() => setPreviewProduct(null)}
        className="absolute top-3 right-3 p-1.5 rounded-full bg-black/70 text-white hover:bg-black/90 transition"
        aria-label="Close preview"
      >
        <X size={16} />
      </button>

      <div className="relative aspect-square bg-gray-50 dark:bg-gray-800">
        {previewProduct.image ? (
          <Image
            src={previewProduct.image}
            alt={previewProduct.name}
            fill
            className="object-contain"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
            No Image
          </div>
        )}
      </div>

      <div className="p-4">
        <h2 className="text-lg font-bold mb-1">{previewProduct.name}</h2>
        {previewProduct.category && (
          <p className="text-xs text-gray-500 mb-1">
            {previewProduct.category}
          </p>
        )}
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
          {previewProduct.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
            ₹{previewProduct.price}
          </span>
          {previewProduct.outOfStock && (
            <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">
              Out of Stock
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
}