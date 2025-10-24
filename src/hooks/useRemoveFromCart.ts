"use client";

import { useCart } from "@/contexts/CartContext";

export function useRemoveFromCart() {
  const { removeItem, loading } = useCart();

  const removeFromCart = async (itemId: string) => {
    try {
      await removeItem(itemId);
    } catch (error) {
      console.error("Erro ao remover item do carrinho:", error);
    }
  };

  return {
    removeFromCart,
    isLoading: loading,
  };
}
