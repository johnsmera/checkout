"use client";

import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";

export function ProductsList() {
  const { products, addToCart } = useProducts();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={addToCart}
        />
      ))}
    </div>
  );
}