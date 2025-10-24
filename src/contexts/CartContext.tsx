"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { CartRepository } from "@/repositories/interfaces/cart.repository";
import type {
  Cart,
  AddToCartRequest,
  UpdateCartItemRequest,
} from "@/types/cart";

interface CartContextType {
  cart: Cart;
  loading: boolean;
  error: string | null;
  addItem: (request: AddToCartRequest) => Promise<void>;
  updateItem: (request: UpdateCartItemRequest) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
  repository: CartRepository;
}

export function CartProvider({ children, repository }: CartProviderProps) {
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const updatedCart = await repository.getCart();
      setCart(updatedCart);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar carrinho",
      );
    } finally {
      setLoading(false);
    }
  }, [repository]);

  const addItem = async (request: AddToCartRequest) => {
    try {
      setLoading(true);
      setError(null);
      await repository.addItem(request);
      await refreshCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao adicionar item");
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (request: UpdateCartItemRequest) => {
    try {
      setLoading(true);
      setError(null);
      await repository.updateItem(request);
      await refreshCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar item");
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      setLoading(true);
      setError(null);
      await repository.removeItem(itemId);
      await refreshCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao remover item");
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      setError(null);
      await repository.clearCart();
      await refreshCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao limpar carrinho");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const value: CartContextType = {
    cart,
    loading,
    error,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart deve ser usado dentro de um CartProvider");
  }
  return context;
}
