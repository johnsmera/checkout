"use client";

import { useState } from "react";
import type { Product } from "@/types/product";
import { mockProducts } from "@/data/products";

export function useProducts() {
  const [products] = useState<Product[]>(mockProducts);

  const addToCart = (productId: string) => {
    console.log("Adicionando produto ao carrinho:", productId);
    // TODO: Implementar lógica do carrinho
  };

  return {
    products,
    addToCart
  };
}
