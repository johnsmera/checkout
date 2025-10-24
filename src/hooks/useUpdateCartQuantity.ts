"use client";

import { useCart } from "@/contexts/CartContext";

export function useUpdateCartQuantity() {
  const { updateItem, loading } = useCart();

  const increaseQuantity = async (itemId: string, currentQuantity: number) => {
    try {
      await updateItem({
        itemId,
        quantity: currentQuantity + 1,
      });
    } catch (error) {
      console.error("Erro ao aumentar quantidade:", error);
    }
  };

  const decreaseQuantity = async (itemId: string, currentQuantity: number) => {
    try {
      if (currentQuantity > 1) {
        await updateItem({
          itemId,
          quantity: currentQuantity - 1,
        });
      }
    } catch (error) {
      console.error("Erro ao diminuir quantidade:", error);
    }
  };

  return {
    increaseQuantity,
    decreaseQuantity,
    updateItem,
    isLoading: loading,
  };
}
