"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function CategoryPage() {
  const { categoryName, slug } = useParams();
  const [products, setProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [otherProducts, setOtherProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategoryProducts() {
      try {
        const res = await fetch(`/api/get-business?slug=${slug}`, { cache: "no-store" });
        const data = await res.json();

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
      } catch (err) {
        console.error("❌ Failed to fetch category products:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCategoryProducts();
  }, [categoryName, slug]);

  const CategoryCard = ({ name }) => (
    <Link href={`/site/${slug}/category/${name}`}>
      <div className="min-w-[160px] max-w-[200px] bg-white border border-gray-200 shadow rounded-xl overflow-hidden hover:shadow-md transition">
        <div className="p-4 flex items-center justify-center bg-gray-50 h-28">
          <span className="text-center text-sm font-semibold text-emerald-700 capitalize">
            {name.replace(/-/g, " ")}
          </span>
        </div>
      </div>
    </Link>
  );

  const ProductGrid = ({ list }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {list.slice(0, visibleCount).map((p, index) => (
        <Link
          key={index}
          href={`/site/${p.slug}/product/${p.name.replace(/\s+/g, "-").toLowerCase()}`}
          className="group"
        >
          <div className="bg-white rounded-xl shadow hover:shadow-md transition border border-gray-200 overflow-hidden">
            <div className="relative w-full h-44 bg-gray-50">
              <Image
                src={p.image}
                alt={p.name}
                fill
                className="object-contain group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="p-4">
              <h2 className="text-base font-semibold text-gray-800 truncate">{p.name}</h2>
              <p className="text-sm text-gray-500 line-clamp-2 min-h-[36px]">{p.description}</p>
              <p className="text-emerald-600 font-bold mt-2">₹{p.price}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );

  const loadMore = () => setVisibleCount((prev) => prev + 8);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Fetching products...
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 md:px-20 py-10 bg-gradient-to-b from-white to-gray-50 space-y-16">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-emerald-700 mb-6 capitalize">
          {categoryName.replace(/-/g, " ")} Products
        </h1>
        <div className="flex justify-center">
          <CategoryCard name={categoryName} />
        </div>
      </div>

      {/* Category Products */}
      {products.length > 0 ? (
        <>
          <ProductGrid list={products} />
          {visibleCount < products.length && (
            <div className="text-center mt-6">
              <button
                onClick={loadMore}
                className="px-6 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition"
              >
                Load More
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-gray-500 text-lg">No products available in this category yet.</p>
      )}

      {/* Other Categories */}
      {allCategories.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">
            Explore More Categories
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {allCategories.map((cat, idx) => (
              <CategoryCard key={idx} name={cat} />
            ))}
          </div>
        </div>
      )}

      {/* Uncategorized Products */}
      {otherProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-700 text-center">
            Other Available Products
          </h2>
          <ProductGrid list={otherProducts} />
        </div>
      )}

      {/* Back Button */}
      <div className="text-center mt-10">
        <Link href={`/site/${slug}`}>
          <button className="px-6 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition">
            ← Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}