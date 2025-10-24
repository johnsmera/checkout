import { useCart } from "@/contexts/CartContext";
import { useUpdateCartQuantity } from "@/hooks/useUpdateCartQuantity";

export function useCartOperations() {
  const { removeItem, loading } = useCart();
  const { increaseQuantity, decreaseQuantity, updateItem } = useUpdateCartQuantity();

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeItem(itemId);
    } catch (error) {
      console.error("Erro ao remover item:", error);
    }
  };

  const handleIncreaseQuantity = async (
    itemId: string,
    currentQuantity: number,
  ) => {
    await increaseQuantity(itemId, currentQuantity);
  };

  const handleDecreaseQuantity = async (
    itemId: string,
    currentQuantity: number,
  ) => {
    await decreaseQuantity(itemId, currentQuantity);
  };

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    try {
      await updateItem({
        itemId,
        quantity,
      });
    } catch (error) {
      console.error("Erro ao atualizar quantidade:", error);
    }
  };

  return {
    handleRemoveItem,
    handleIncreaseQuantity,
    handleDecreaseQuantity,
    handleUpdateQuantity,
    loading,
  };
}
