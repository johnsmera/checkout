import { useState } from "react";

export function useCartQuantityEditing() {
  const [editingQuantities, setEditingQuantities] = useState<
    Record<string, string>
  >({});

  const handleQuantityChange = (itemId: string, value: string) => {
    setEditingQuantities((prev) => ({
      ...prev,
      [itemId]: value,
    }));
  };

  const handleQuantityBlur = async (
    itemId: string,
    currentQuantity: number,
    onUpdateQuantity: (itemId: string, quantity: number) => Promise<void>,
  ) => {
    const newQuantity = parseInt(editingQuantities[itemId] || "1");

    if (newQuantity && newQuantity > 0 && newQuantity !== currentQuantity) {
      await onUpdateQuantity(itemId, newQuantity);
    }

    // Limpa o estado de edição
    setEditingQuantities((prev) => {
      const newState = { ...prev };
      delete newState[itemId];
      return newState;
    });
  };

  const getDisplayQuantity = (itemId: string, currentQuantity: number) => {
    return editingQuantities[itemId] ?? currentQuantity;
  };

  return {
    editingQuantities,
    handleQuantityChange,
    handleQuantityBlur,
    getDisplayQuantity,
  };
}
