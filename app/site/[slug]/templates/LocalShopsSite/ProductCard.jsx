"use client";
import Link from "next/link";

export default function ProductCard({ product, businessSlug }) {
  const slug = product.slug || product.name.toLowerCase().replace(/\s+/g, "-");

  return (
     <Link href={`/product/${slug}`}> // if already passing correct slug

      <div className="bg-white text-black rounded-xl shadow-md hover:shadow-lg transition cursor-pointer">
        <img
          src={product.image || "/placeholder.jpg"}
          alt={product.name}
          className="w-full h-44 object-cover rounded-t-xl"
        />
        <div className="p-4">
          <h2 className="text-lg font-semibold">{product.name}</h2>
          <p className="text-orange-500 font-bold">₹{product.price}</p>
        </div>
      </div>
    </Link>
  );
}
