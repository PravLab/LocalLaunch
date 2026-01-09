"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useBusiness } from "@/src/context/BusinessContext";
import BuyNowButton from "@/app/site/[slug]/templates/LocalShopsSite/BuyNowButton";
import PurchasePod from "@/app/site/[slug]/templates/LocalShopsSite/PurchasePod";
import Navbar from "@/app/site/[slug]/templates/LocalShopsSite/Navbar";
import CategoryCard from "@/app/site/[slug]/templates/LocalShopsSite/CategoryCard";
import Footer from "@/app/site/[slug]/templates/LocalShopsSite/Footer";
import Image from "next/image";
import { Check, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight, X, Plus, Minus, Ruler } from "lucide-react";
import { poppins } from "@/src/font";

export default function ProductDetailPage() {
  const { productSlug } = useParams();
  const { business, setBusiness } = useBusiness();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOutOfStockPopup, setShowOutOfStockPopup] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [activeTab, setActiveTab] = useState("specifications");
  const [selectedSize, setSelectedSize] = useState(""); // ✅ NEW: Size state

  useEffect(() => {
    if (!business) {
      const stored = localStorage.getItem("business");
      if (stored) setBusiness(JSON.parse(stored));
    }
  }, [business, setBusiness]);

  useEffect(() => {
    if (!business?.products || !productSlug) return;

    const allProducts = business.products.map((p) => ({ ...p, business_slug: business.slug }));
    const current = allProducts.find(
      (p) => p.slug === productSlug || p.name?.toLowerCase().replace(/\s+/g, "-") === productSlug
    );
    if (!current) {
      setProduct(null);
      setLoading(false);
      return;
    }
    setProduct(current);

    // ✅ Set default size if available
    if (current.sizes && current.sizes.length > 0) {
      setSelectedSize(current.sizes[0]);
    }

    const relatedProducts = allProducts.filter(
      (p) => p.category === current.category && (p.slug || p.name?.toLowerCase().replace(/\s+/g, "-")) !== productSlug
    );
    setRelated(relatedProducts);
    setLoading(false);
  }, [productSlug, business]);

  useEffect(() => {
    if (product) {
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      const uniqueId = product.slug || product.id || product.name?.toLowerCase().replace(/\s+/g, "-");
      setIsWishlisted(wishlist.some(item => item.id === uniqueId));
    }
  }, [product]);

  // ✅ Check if business is Print on Demand
  const isPODBusiness = () => {
    if (!business?.type) return false;
    const businessType = business.type.toLowerCase().trim();
    return (
      businessType === "pod" ||
      businessType === "print on demand" ||
      businessType === "printondemand" ||
      businessType === "print-on-demand"
    );
  };

  const isPOD = isPODBusiness();

const handleAddToCart = () => {
  try {
    setIsAddingToCart(true);
    
    // ✅ Business-specific cart key
    const cartKey = `cart_${business.slug}`;
    const cart = JSON.parse(localStorage.getItem(cartKey) || "[]");
    const uniqueId = product.slug || product.id || product.name?.toLowerCase().replace(/\s+/g, "-");
    
    const existingItemIndex = cart.findIndex((item) => {
      const itemUniqueId = item.slug || item.id || item.name?.toLowerCase().replace(/\s+/g, "-");
      return itemUniqueId === uniqueId;
    });
    
    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + quantity;
    } else {
      cart.push({
        id: product.id || uniqueId,
        slug: product.slug || uniqueId,
        name: product.name,
        price: product.price,
        image: product.image,
        business_slug: business.slug,
        quantity: quantity,
      });
    }
    
    // ✅ Save to business-specific key
    localStorage.setItem(cartKey, JSON.stringify(cart));
    
    // ✅ Dispatch event with business slug
    window.dispatchEvent(new CustomEvent("cartUpdated", { 
      detail: { slug: business.slug } 
    }));
    
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    
  } catch (error) {
    console.error("Error adding to cart:", error);
    alert("Failed to add item to cart. Please try again.");
  } finally {
    setIsAddingToCart(false);
  }
};

  const toggleWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const uniqueId = product.slug || product.id || product.name?.toLowerCase().replace(/\s+/g, "-");
    
    if (isWishlisted) {
      const filtered = wishlist.filter(item => item.id !== uniqueId);
      localStorage.setItem("wishlist", JSON.stringify(filtered));
      setIsWishlisted(false);
    } else {
      wishlist.push({
        id: uniqueId,
        name: product.name,
        price: product.price,
        image: product.image,
        business_slug: business.slug,
      });
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      setIsWishlisted(true);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} for ₹${product.price}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share failed:", err);
        setShowShareModal(true);
      }
    } else {
      setShowShareModal(true);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  const productImages = product?.gallery || [product?.image];

  if (loading || !business) {
    return (
      <div className={`${poppins.className} min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center`}>
        <div className="text-center space-y-4">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 border-4 border-gray-800 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-yellow-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-300 font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={`${poppins.className} min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col items-center justify-center text-center p-6`}>
        <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 max-w-md">
          <div className="w-16 h-16 bg-red-950 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="text-red-500" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Product Not Found</h1>
          <p className="text-gray-400 mb-6">This product could not be found or may have been removed.</p>
          <Link 
            href={`/site/${business?.slug}`} 
            className="inline-flex items-center gap-2 bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-all"
          >
            <ChevronLeft size={20} />
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = product?.outOfStock === true;

  return (
    <div className={`${poppins.className} min-h-screen bg-black`}>
      <Navbar business={business} />

      {/* Success Toast */}
      {showToast && (
        <div className="fixed top-20 right-4 z-50 animate-slideIn">
          <div className="bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-green-400">
            <div className="bg-white rounded-full p-1">
              <Check className="text-green-600" size={20} />
            </div>
            <div>
              <p className="font-bold">Added to Cart!</p>
              <p className="text-sm text-green-50">{quantity}x {product.name}</p>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumbs */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-400">
            <Link href={`/site/${business.slug}`} className="hover:text-yellow-500 transition-colors">
              Home
            </Link>
            <ChevronRight size={16} />
            <Link href={`/site/${business.slug}/product`} className="hover:text-yellow-500 transition-colors">
              Products
            </Link>
            {product.category && (
              <>
                <ChevronRight size={16} />
                <Link 
                  href={`/site/${business.slug}/product?category=${product.category}`}
                  className="hover:text-yellow-500 transition-colors capitalize"
                >
                  {product.category}
                </Link>
              </>
            )}
            <ChevronRight size={16} />
            <span className="text-white font-medium truncate max-w-xs">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div 
              className="relative aspect-square bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 cursor-zoom-in group"
              onClick={() => setShowImageModal(true)}
            >
              <Image
                src={productImages[selectedImage] || "/placeholder.jpg"}
                alt={product.name}
                fill
                className="object-contain p-8 group-hover:scale-110 transition-transform duration-500"
              />
              {isOutOfStock && (
                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                  <span className="bg-red-500 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg">
                    Out of Stock
                  </span>
                </div>
              )}
              <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                </svg>
              </div>
            </div>

            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative aspect-square bg-gray-900 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx
                        ? "border-yellow-500 ring-2 ring-yellow-500 ring-offset-2 ring-offset-black"
                        : "border-gray-800 hover:border-gray-700"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      fill
                      className="object-contain p-2"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="grid grid-cols-3 gap-3 pt-4">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
                <Truck className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                <p className="text-white text-xs font-semibold mb-1">Fast Delivery</p>
                <p className="text-gray-400 text-xs">{isPOD ? '7-10 days' : '2-3 days'}</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
                <Shield className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                <p className="text-white text-xs font-semibold mb-1">Secure Payment</p>
                <p className="text-gray-400 text-xs">100% Safe</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
                <RotateCcw className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                <p className="text-white text-xs font-semibold mb-1">Easy Returns</p>
                <p className="text-gray-400 text-xs">{isPOD ? '14 days' : '7 days'}</p>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {product.category && (
              <div>
                <Link 
                  href={`/site/${business.slug}/product?category=${product.category}`}
                  className="inline-block bg-yellow-500 bg-opacity-10 text-yellow-500 px-4 py-2 rounded-lg text-md font-semibold border border-yellow-500 border-opacity-20 hover:bg-opacity-20 transition-all"
                >
                  {product.category}
                </Link>
              </div>
            )}

            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                  {product.name}
                </h1>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={toggleWishlist}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      isWishlisted
                        ? "bg-red-500 border-red-500 text-white"
                        : "bg-gray-900 border-gray-800 text-gray-400 hover:border-red-500 hover:text-red-500"
                    }`}
                  >
                    <Heart className={isWishlisted ? "fill-current" : ""} size={20} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-3 bg-gray-900 border-2 border-gray-800 text-gray-400 hover:border-yellow-500 hover:text-yellow-500 rounded-xl transition-all"
                  >
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl sm:text-5xl font-bold text-yellow-500">
                  ₹{isNaN(product.price) ? "-" : Number(product.price).toLocaleString("en-IN")}
                </span>
                {product.originalPrice && (
                  <span className="text-2xl text-gray-500 line-through">
                    ₹{Number(product.originalPrice).toLocaleString("en-IN")}
                  </span>
                )}
              </div>

              {product.originalPrice && (
                <p className="text-green-400 text-sm font-semibold">
                  You save ₹{(product.originalPrice - product.price).toLocaleString("en-IN")} 
                  ({Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off)
                </p>
              )}

              {isOutOfStock ? (
                <div className="bg-red-950 border border-red-900 rounded-xl p-4 mt-4">
                  <p className="text-red-400 font-semibold text-sm">❌ Currently Out of Stock</p>
                </div>
              ) : (
                <div className="bg-green-950 border border-green-900 rounded-xl p-4 mt-4">
                  <p className="text-green-400 font-semibold text-sm flex items-center gap-2">
                    <Check size={18} />
                    {isPOD ? 'Made to Order - Ships in 5-7 days' : 'In Stock - Ready to Ship'}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Product Description
              </h3>
              <p className="text-gray-400 leading-relaxed whitespace-pre-line">
                {product.description || "No description provided."}
              </p>
            </div>

            {/* ✅ SIZE SELECTOR - FOR POD PRODUCTS */}
            {isPOD && product.sizes && product.sizes.length > 0 && !isOutOfStock && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <label className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Ruler className="text-yellow-500" size={20} />
                  Select Size
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                        selectedSize === size
                          ? "bg-yellow-500 text-black ring-2 ring-yellow-400"
                          : "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <p className="text-gray-400 text-xs mt-3">
                  Selected: <span className="text-yellow-500 font-semibold">{selectedSize}</span>
                </p>
              </div>
            )}

            {/* ✅ QUANTITY SELECTOR - ONLY for NON-POD */}
            {!isPOD && !isOutOfStock && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <label className="text-white font-semibold mb-3 block">Quantity</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-black border-2 border-gray-800 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-gray-900 transition-colors text-white"
                    >
                      <Minus size={20} />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 text-center bg-transparent text-white font-semibold focus:outline-none"
                      min="1"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 hover:bg-gray-900 transition-colors text-white"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  <span className="text-gray-400 text-sm">
                    Total: <span className="text-yellow-500 font-bold text-lg">₹{(product.price * quantity).toLocaleString("en-IN")}</span>
                  </span>
                </div>
              </div>
            )}

            {/* ✅ ACTION BUTTONS */}
            <div className="sticky bottom-0 bg-black pt-6 pb-4 border-t border-gray-800 space-y-3">
              {!isOutOfStock ? (
                <>
                  {isPOD ? (
                    <PurchasePod 
                      product={{
                        ...product,
                        selectedSize: selectedSize, // ✅ Pass selected size
                      }} 
                      business={business} 
                    />
                  ) : (
                    <>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={handleAddToCart}
                          disabled={isAddingToCart}
                          className="flex-1 bg-gray-900 border-2 border-yellow-500 text-yellow-500 px-8 py-4 rounded-xl font-bold hover:bg-yellow-500 hover:text-black transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-yellow-500/20 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                          {isAddingToCart ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-500 group-hover:border-black"></div>
                              Adding...
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-5 h-5" />
                              Add to Cart
                            </>
                          )}
                        </button>
                        <div className="flex-1">
                          <BuyNowButton product={product} business={business} quantity={quantity} />
                        </div>
                      </div>
                    </>
                  )}
                  
                  {business.phone && (
                    <a
                      href={`https://wa.me/${business.phone}?text=${encodeURIComponent(`Hi! I have a question about "${product.name}"`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-xl font-bold transition-all text-center flex items-center justify-center gap-3"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Ask Questions on WhatsApp
                    </a>
                  )}
                </>
              ) : (
                <button
                  onClick={() => setShowOutOfStockPopup(true)}
                  className="w-full bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-3"
                >
                  Get Notified When Available
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="border-b border-gray-800">
            <div className="flex overflow-x-auto">
              <button 
                onClick={() => setActiveTab("specifications")}
                className={`px-6 py-4 font-semibold whitespace-nowrap transition-colors ${
                  activeTab === "specifications" 
                    ? "text-white border-b-2 border-yellow-500" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Specifications
              </button>
              <button 
                onClick={() => setActiveTab("shipping")}
                className={`px-6 py-4 font-semibold whitespace-nowrap transition-colors ${
                  activeTab === "shipping" 
                    ? "text-white border-b-2 border-yellow-500" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Shipping Info
              </button>
            </div>
          </div>
          <div className="p-8">
            {activeTab === "specifications" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white font-semibold mb-3">Product Features</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li className="flex items-start gap-3">
                      <Check className="text-yellow-500 flex-shrink-0 mt-0.5" size={18} />
                      <span>High-quality {isPOD ? 'print on premium material' : 'product'}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="text-yellow-500 flex-shrink-0 mt-0.5" size={18} />
                      <span>Durable and long-lasting</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="text-yellow-500 flex-shrink-0 mt-0.5" size={18} />
                      <span>{isPOD ? 'Eco-friendly printing process' : 'Premium quality materials'}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="text-yellow-500 flex-shrink-0 mt-0.5" size={18} />
                      <span>Perfect for gifts and personal use</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-3">Care Instructions</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li className="flex items-start gap-3">
                      <Check className="text-yellow-500 flex-shrink-0 mt-0.5" size={18} />
                      <span>Handle with care</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="text-yellow-500 flex-shrink-0 mt-0.5" size={18} />
                      <span>Keep away from direct sunlight</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="text-yellow-500 flex-shrink-0 mt-0.5" size={18} />
                      <span>Clean gently when needed</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white font-semibold mb-3">Delivery Information</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li className="flex items-start gap-3">
                      <Check className="text-yellow-500 flex-shrink-0 mt-0.5" size={18} />
                      <span>Processing time: {isPOD ? '3-5 business days' : '2-3 business days'}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="text-yellow-500 flex-shrink-0 mt-0.5" size={18} />
                      <span>Standard delivery: {isPOD ? '5-10 business days' : '3-7 business days'}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="text-yellow-500 flex-shrink-0 mt-0.5" size={18} />
                      <span>Free shipping on orders above ₹999</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="text-yellow-500 flex-shrink-0 mt-0.5" size={18} />
                      <span>Track your order with provided tracking ID</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-3">Returns & Exchange</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li className="flex items-start gap-3">
                      <Check className="text-yellow-500 flex-shrink-0 mt-0.5" size={18} />
                      <span>{isPOD ? '14-day return policy' : '7-day return policy'}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="text-yellow-500 flex-shrink-0 mt-0.5" size={18} />
                      <span>Easy exchange process</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="text-yellow-500 flex-shrink-0 mt-0.5" size={18} />
                      <span>Contact support for any issues</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">You May Also Like</h2>
                <p className="text-gray-400">Similar products from {product.category}</p>
              </div>
              {related.length > 4 && (
                <Link
                  href={`/site/${business.slug}/product?category=${product.category}`}
                  className="hidden sm:flex items-center gap-2 text-yellow-500 font-semibold hover:gap-3 transition-all group"
                >
                  View All
                  <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </Link>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {related.slice(0, 4).map((item, i) => (
                <Link
                  key={i}
                  href={`/site/${business.slug}/product/${item.slug || item.name?.toLowerCase().replace(/\s+/g, "-")}`}
                  className="group bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden hover:border-yellow-500 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10"
                >
                  <div className="relative aspect-square bg-gray-800 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    {item.category && (
                      <span className="text-xs font-semibold text-yellow-500 uppercase tracking-wide">
                        {item.category}
                      </span>
                    )}
                    <h3 className="font-bold text-white mt-2 mb-2 line-clamp-2 group-hover:text-yellow-500 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-3">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-yellow-500">₹{item.price}</span>
                      <ChevronRight className="text-gray-600 group-hover:text-yellow-500 group-hover:translate-x-1 transition-all" size={20} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-16">
          <h2 className="text-3xl font-bold text-white mb-8">Explore More Categories</h2>
          <CategoryCard />
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center p-4" onClick={() => setShowImageModal(false)}>
          <div className="relative max-w-5xl w-full aspect-square">
            <Image
              src={productImages[selectedImage]}
              alt={product.name}
              fill
              className="object-contain"
            />
            <button
              onClick={(e) => { e.stopPropagation(); setShowImageModal(false); }}
              className="absolute top-4 right-4 bg-white text-black p-3 rounded-full hover:bg-gray-200 transition-colors"
            >
              <X size={24} />
            </button>
            {productImages.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedImage((selectedImage - 1 + productImages.length) % productImages.length); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white text-black p-3 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedImage((selectedImage + 1) % productImages.length); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white text-black p-3 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4" onClick={() => setShowShareModal(false)}>
          <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-800" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Share Product</h2>
              <button onClick={() => setShowShareModal(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-3">
              <button
                onClick={copyLink}
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copy Link
              </button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Check out ${product.name} for ₹${product.price}\n${window.location.href}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-green-600 hover:bg-green-500 text-white px-6 py-4 rounded-xl font-semibold transition-all text-center"
              >
                Share on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Out of Stock Popup */}
      {showOutOfStockPopup && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4" onClick={() => setShowOutOfStockPopup(false)}>
          <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-800" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-950 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-red-500">
                <X className="text-red-500" size={32} />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-white">Product Out of Stock</h2>
              <p className="text-gray-400 mb-6">
                Contact us on WhatsApp to get notified when this product is back in stock or to find similar alternatives.
              </p>
              {business.phone && (
                <a
                  href={`https://wa.me/${business.phone}?text=${encodeURIComponent(`Hi! I'm interested in "${product.name}" which is currently out of stock. Can you notify me when it's available?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-green-600 hover:bg-green-500 text-white px-6 py-4 rounded-xl font-bold transition-all mb-3 flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Contact on WhatsApp
                </a>
              )}
              <button
                onClick={() => setShowOutOfStockPopup(false)}
                className="text-gray-400 hover:text-white font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />

      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }

        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}