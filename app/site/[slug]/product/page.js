"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { poppins } from "@/src/font";

export default function ProductsPage() {
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [businessData, setBusinessData] = useState(null);

  // Filters & Sort
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "all");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [showFilters, setShowFilters] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await fetch(`/api/get-business?slug=${slug}`, { cache: "no-store" });
        const data = await res.json();

        const allProducts = (data.products || []).map((p) => ({ ...p, slug: data.slug }));
        setProducts(allProducts);
        setBusinessData(data);

        // Extract unique categories
        const uniqueCategories = [...new Set(allProducts.map((p) => p.category).filter(Boolean))];
        setCategories(uniqueCategories);

        // Set max price range
        const maxPrice = Math.max(...allProducts.map((p) => p.price || 0));
        setPriceRange([0, maxPrice]);
      } catch (err) {
        console.error("❌ Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [slug]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price range filter
    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // featured - keep original order
        break;
    }

    return filtered;
  }, [products, selectedCategory, searchQuery, priceRange, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [selectedCategory, searchQuery, priceRange, sortBy]);

  if (loading) {
    return (
      <div className={`${poppins.className} min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center`}>
        <div className="text-center space-y-4">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 border-4 border-gray-800 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-yellow-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-300 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${poppins.className} min-h-screen bg-black`}>
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href={`/site/${slug}`} className="hover:text-yellow-500 transition-colors">
              Home
            </Link>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white font-medium">Products</span>
            {selectedCategory !== "all" && (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-yellow-500 capitalize">{selectedCategory}</span>
              </>
            )}
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                {selectedCategory === "all" ? "All Products" : selectedCategory}
              </h1>
              <p className="text-gray-400">
                {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"} available
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-xl px-5 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 sticky top-24 space-y-6">
              {/* Categories */}
              <div>
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  Categories
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`w-full text-left px-4 py-2.5 rounded-lg transition-all ${
                      selectedCategory === "all"
                        ? "bg-yellow-500 text-black font-semibold"
                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    All Products ({products.length})
                  </button>
                  {categories.map((cat) => {
                    const count = products.filter((p) => p.category === cat).length;
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full text-left px-4 py-2.5 rounded-lg transition-all capitalize ${
                          selectedCategory === cat
                            ? "bg-yellow-500 text-black font-semibold"
                            : "text-gray-400 hover:bg-gray-800 hover:text-white"
                        }`}
                      >
                        {cat} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Range */}
              <div className="pt-6 border-t border-gray-800">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Price Range
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="Min"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="Max"
                    />
                  </div>
                  <div className="text-sm text-gray-400 text-center">
                    ₹{priceRange[0]} - ₹{priceRange[1]}
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                  setPriceRange([0, Math.max(...products.map((p) => p.price || 0))]);
                  setSortBy("featured");
                }}
                className="w-full bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 px-4 py-2.5 rounded-lg transition-all font-medium"
              >
                Clear All Filters
              </button>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg border border-gray-800 hover:border-yellow-500 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filters
                </button>

                {/* View Mode Toggle */}
                <div className="hidden sm:flex items-center gap-2 bg-gray-900 rounded-lg p-1 border border-gray-800">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === "grid"
                        ? "bg-yellow-500 text-black"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === "list"
                        ? "bg-yellow-500 text-black"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-3">
                <label className="text-gray-400 text-sm hidden sm:block">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-900 text-white border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
              </div>
            </div>

            {/* Products Display */}
            {paginatedProducts.length > 0 ? (
              <>
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedProducts.map((product, index) => (
                      <ProductCard key={index} product={product} businessData={businessData} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {paginatedProducts.map((product, index) => (
                      <ProductListItem key={index} product={product} businessData={businessData} />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-800 hover:border-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {[...Array(totalPages)].map((_, i) => {
                      const page = i + 1;
                      // Show first page, last page, current page, and pages around current
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-4 py-2 rounded-lg border transition-all ${
                              currentPage === page
                                ? "bg-yellow-500 text-black border-yellow-500 font-semibold"
                                : "bg-gray-900 text-white border-gray-800 hover:border-yellow-500"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return <span key={page} className="text-gray-600">...</span>;
                      }
                      return null;
                    })}

                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-800 hover:border-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <EmptyState searchQuery={searchQuery} selectedCategory={selectedCategory} />
            )}
          </main>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-yellow-600 via-yellow-500 to-yellow-600 py-12 px-4 sm:px-8 mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-black mb-4">
            Can&apos;t Find What You&apos;re Looking For?
          </h2>
          <p className="text-black text-opacity-90 text-lg mb-6">
            We offer custom designs and bulk orders. Let&apos;s discuss your requirements!
          </p>
          <a
            href={`https://wa.me/${businessData?.phone || ''}?text=Hi! I'm interested in custom products`}
            className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-900 transition-all shadow-lg"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Contact Us on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

// Product Card Component (Grid View)
function ProductCard({ product, businessData }) {
  return (
    <div className="group bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden hover:border-yellow-500 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10">
      <Link href={`/site/${businessData.slug}/product/${product.name.replace(/\s+/g, "-").toLowerCase()}`}>
        {/* Image */}
        <div className="relative w-full h-64 bg-gray-800 overflow-hidden">
          <Image
            src={product.image || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          {product.category && (
            <span className="text-xs font-semibold text-yellow-500 uppercase tracking-wide">
              {product.category}
            </span>
          )}
          <h3 className="text-lg font-bold text-white mt-2 mb-2 line-clamp-2 group-hover:text-yellow-500 transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-2 mb-4">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-yellow-500">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through ml-2">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            <button className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition-colors flex items-center gap-2">
              View
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}

// Product List Item Component (List View)
function ProductListItem({ product, businessData }) {
  return (
    <Link href={`/site/${businessData.slug}/product/${product.name.replace(/\s+/g, "-").toLowerCase()}`}>
      <div className="group bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden hover:border-yellow-500 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10">
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="relative w-full sm:w-64 h-48 sm:h-auto bg-gray-800 flex-shrink-0">
            <Image
              src={product.image || "/placeholder.png"}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>

          {/* Content */}
          <div className="p-6 flex-1 flex flex-col justify-between">
            <div>
              {product.category && (
                <span className="text-xs font-semibold text-yellow-500 uppercase tracking-wide">
                  {product.category}
                </span>
              )}
              <h3 className="text-xl font-bold text-white mt-2 mb-3 group-hover:text-yellow-500 transition-colors">
                {product.name}
              </h3>
              <p className="text-gray-400 line-clamp-3 mb-4">
                {product.description}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-3xl font-bold text-yellow-500">₹{product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through ml-3">
                    ₹{product.originalPrice}
                  </span>
                )}
              </div>
              <button className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors flex items-center gap-2">
                View Details
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Empty State Component
function EmptyState({ searchQuery, selectedCategory }) {
  return (
    <div className="text-center py-20">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-900 rounded-full mb-6 border border-gray-800">
        <svg className="w-10 h-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">No Products Found</h3>
      <p className="text-gray-400 mb-6">
        {searchQuery
          ? `No products match "${searchQuery}"`
          : `No products available in ${selectedCategory === "all" ? "this collection" : selectedCategory}`}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
      >
        Clear Filters
      </button>
    </div>
  );
}