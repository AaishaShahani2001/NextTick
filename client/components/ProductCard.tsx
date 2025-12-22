"use client";

import { ProductType } from "@/src/types/product";
import Link from "next/link";

type Props = {
  product: ProductType;
};

const ProductCard = ({ product }: Props) => {
  return (
    <div className="border border-white/10 rounded-xl p-6 bg-black text-white">
      <h3 className="text-lg font-semibold">{product.name}</h3>

      <p className="text-sm text-gray-400 mt-2">
        {product.shortDescription}
      </p>

      <p className="mt-4 text-[#d4af37] font-bold">
        ${product.price}
      </p>

      <Link href={`/watches/${product.id}`}>
  <button className="mt-4 w-full py-2 rounded-full border border-[#d4af37]
    text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition">
    View Details
  </button>
</Link>
    </div>
  );
};

export default ProductCard;
