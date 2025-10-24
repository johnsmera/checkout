import { useCart } from "@/contexts/CartContext";

export function useCartSummary() {
  const { cart } = useCart();

  const totalItems = cart.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );


  return {
    totalItems,
    total: cart.total,
    isEmpty: cart.items.length === 0,
    items: cart.items,
  };
}
