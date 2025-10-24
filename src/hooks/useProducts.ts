"use client";

import { useState } from "react";
import type { Product } from "@/types/product";
import { mockProducts } from "@/data/products";
import { useAddToCart } from "./useAddToCart";

export function useProducts() {
  const [products] = useState<Product[]>(mockProducts);
  const { addToCart: addToCartHook } = useAddToCart();

  const addToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      addToCartHook(product);
    }
  };

  return {
    products,
    addToCart,
  };
}
