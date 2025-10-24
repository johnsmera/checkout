"use client";

import { useCart } from "@/contexts/CartContext";
import type { Product } from "@/types/product";

export function useAddToCart() {
  const { addItem, loading } = useCart();

  const addToCart = async (product: Product) => {
    try {
      await addItem({
        productId: product.id,
        quantity: 1,
        price: product.price,
      });
    } catch (error) {
      console.error("Erro ao adicionar produto ao carrinho:", error);
    }
  };

  return {
    addToCart,
    isLoading: loading,
  };
}
