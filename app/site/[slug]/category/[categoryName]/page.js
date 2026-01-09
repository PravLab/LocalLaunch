"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ChevronLeft, Grid, List, SlidersHorizontal } from "lucide-react";
import { poppins } from "@/src/font";
import Navbar from "@/app/site/[slug]/templates/LocalShopsSite/Navbar";
import Footer from "@/app/site/[slug]/templates/LocalShopsSite/Footer";

export default function CategoryPage() {
  const { categoryName, slug } = useParams();
  const [products, setProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [otherProducts, setOtherProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [businessData, setBusinessData] = useState(null);
  
  // UI States
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  useEffect(() => {
    async function fetchCategoryProducts() {
      try {
        setLoading(true);
        const res = await fetch(`/api/get-business?slug=${slug}`, { cache: "no-store" });
        const data = await res.json();
        
        setBusinessData(data);

        const allProducts = (data.products || []).map((p) => ({ ...p, slug: data.slug }));

        const categoryMap = new Map();
        const others = [];

        for (const product of allProducts) {
          const cat = product.category?.trim().toLowerCase().replace(/\s+/g, "-");
          if (cat) {
            if (!categoryMap.has(cat)) categoryMap.set(cat, []);
            categoryMap.get(cat).push(product);
          } else {
            others.push(product);
          }
        }

        const currentCategoryProducts = categoryMap.get(categoryName?.toLowerCase()) || [];
        const otherCategoryNames = Array.from(categoryMap.keys()).filter(
          (c) => c !== categoryName?.toLowerCase()
        );

        setProducts(currentCategoryProducts);
        setAllCategories(otherCategoryNames);
        setOtherProducts(others);

        // Set max price range
        if (currentCategoryProducts.length > 0) {
          const maxPrice = Math.max(...currentCategoryProducts.map((p) => p.price || 0));
          setPriceRange([0, maxPrice]);
        }
      } catch (err) {
        console.error("❌ Failed to fetch category products:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCategoryProducts();
  }, [categoryName, slug]);

  // Filtered and sorted products
  const sortedProducts = useMemo(() => {
    let filtered = [...products];

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
        break;
    }

    return filtered;
  }, [products, priceRange, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, priceRange]);

  if (loading) {
    return (
      <div className={`${poppins.className} min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center`}>
        <div className="text-center space-y-4">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 border-4 border-gray-800 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-yellow-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-300 font-medium">Loading category...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${poppins.className} min-h-screen bg-black`}>
      <Navbar business={businessData} />

      {/* Breadcrumbs */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-400">
            <Link href={`/site/${slug}`} className="hover:text-yellow-500 transition-colors">
              Home
            </Link>
            <ChevronRight size={16} />
            <Link href={`/site/${slug}/products`} className="hover:text-yellow-500 transition-colors">
              Products
            </Link>
            <ChevronRight size={16} />
            <span className="text-white font-medium capitalize">{categoryName.replace(/-/g, " ")}</span>
          </nav>
        </div>
      </div>

      {/* Header Section */}
      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-yellow-500/10 text-yellow-500 px-5 py-2 rounded-full text-sm font-semibold mb-4 border border-yellow-500/20">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Category
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 capitalize">
              {categoryName.replace(/-/g, " ")}
            </h1>
            <p className="text-gray-400 text-lg">
              {sortedProducts.length} {sortedProducts.length === 1 ? "product" : "products"} available
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {products.length > 0 ? (
          <>
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                {/* View Mode Toggle */}
                <div className="flex items-center gap-2 bg-gray-900 rounded-lg p-1 border border-gray-800">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === "grid"
                        ? "bg-yellow-500 text-black"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <Grid size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === "list"
                        ? "bg-yellow-500 text-black"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <List size={20} />
                  </button>
                </div>

                {/* Filter Button (Mobile) */}
                <button className="sm:hidden flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg border border-gray-800 hover:border-yellow-500 transition-colors">
                  <SlidersHorizontal size={20} />
                  Filters
                </button>
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

            {/* Products Grid */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {paginatedProducts.map((product, index) => (
                  <ProductCard key={index} product={product} businessSlug={slug} />
                ))}
              </div>
            ) : (
              <div className="space-y-4 mb-12">
                {paginatedProducts.map((product, index) => (
                  <ProductListItem key={index} product={product} businessSlug={slug} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mb-12">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-800 hover:border-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} />
                </button>
                
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
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
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        ) : (
          <EmptyState categoryName={categoryName} slug={slug} />
        )}

        {/* Other Categories */}
        {allCategories.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Explore More Categories
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {allCategories.map((cat, idx) => (
                <CategoryCard key={idx} name={cat} businessSlug={slug} />
              ))}
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="text-center mt-16">
          <Link 
            href={`/site/${slug}`}
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition-all border-2 border-gray-800 hover:border-yellow-500"
          >
            <ChevronLeft size={20} />
            Back to Home
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}

// Product Card Component (Grid View)
function ProductCard({ product, businessSlug }) {
  return (
    <Link
      href={`/site/${businessSlug}/product/${product.name.replace(/\s+/g, "-").toLowerCase()}`}
      className="group bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden hover:border-yellow-500 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10"
    >
      <div className="relative aspect-square bg-gray-800 overflow-hidden">
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
          <span className="text-2xl font-bold text-yellow-500">₹{product.price}</span>
          <ChevronRight className="text-gray-600 group-hover:text-yellow-500 group-hover:translate-x-1 transition-all" size={20} />
        </div>
      </div>
    </Link>
  );
}

// Product List Item Component (List View)
function ProductListItem({ product, businessSlug }) {
  return (
    <Link
      href={`/site/${businessSlug}/product/${product.name.replace(/\s+/g, "-").toLowerCase()}`}
      className="group bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden hover:border-yellow-500 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10"
    >
      <div className="flex flex-col sm:flex-row">
        <div className="relative w-full sm:w-64 h-48 sm:h-auto bg-gray-800 flex-shrink-0">
          <Image
            src={product.image || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
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
            <span className="text-3xl font-bold text-yellow-500">₹{product.price}</span>
            <button className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors flex items-center gap-2">
              View Details
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Category Card Component
function CategoryCard({ name, businessSlug }) {
  return (
    <Link
      href={`/site/${businessSlug}/category/${name}`}
      className="group bg-gray-900 rounded-xl border border-gray-800 overflow-hidden hover:border-yellow-500 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10"
    >
      <div className="p-6 text-center">
        <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-yellow-500/20 transition-colors">
          <svg className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        </div>
        <h3 className="text-white font-semibold capitalize group-hover:text-yellow-500 transition-colors">
          {name.replace(/-/g, " ")}
        </h3>
      </div>
    </Link>
  );
}

// Empty State Component
function EmptyState({ categoryName, slug }) {
  return (
    <div className="text-center py-20">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-900 rounded-full mb-6 border border-gray-800">
        <svg className="w-10 h-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">No Products Found</h3>
      <p className="text-gray-400 mb-6 capitalize">
        No products available in {categoryName.replace(/-/g, " ")} category yet.
      </p>
      <Link
        href={`/site/${slug}/products`}
        className="inline-flex items-center gap-2 bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
      >
        Browse All Products
        <ChevronRight size={20} />
      </Link>
    </div>
  );
}