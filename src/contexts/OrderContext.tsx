"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type { OrderRepository } from "@/repositories/interfaces/order.repository";
import type { CartRepository } from "@/repositories/interfaces/cart.repository";
import type { Order, CreateOrderRequest } from "@/types/order";
import { OrderService } from "@/services/order.service";

interface OrderContextType {
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
  createOrder: (request: CreateOrderRequest, userId: string) => Promise<Order>;
  processPayment: (orderId: string) => Promise<Order>;
  checkOrderStatus: (orderId: string) => Promise<Order>;
  clearOrder: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

interface OrderProviderProps {
  children: ReactNode;
  orderRepository: OrderRepository;
  cartRepository: CartRepository;
  onClearCart: () => Promise<void>;
}

export function OrderProvider({
  children,
  orderRepository,
  cartRepository,
  onClearCart,
}: OrderProviderProps) {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Callback para limpar carrinho quando pedido for pago
  const handleOrderPaid = useCallback(async () => {
    // Usa a função do CartContext que já faz tudo certo
    await onClearCart();
  }, [onClearCart]);

  const orderService = useMemo(
    () => new OrderService(orderRepository, cartRepository, handleOrderPaid),
    [orderRepository, cartRepository, handleOrderPaid],
  );

  const createOrder = useCallback(
    async (request: CreateOrderRequest, userId: string): Promise<Order> => {
      try {
        setLoading(true);
        setError(null);
        const order = await orderService.createOrder(request, userId);
        setCurrentOrder(order);
        return order;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao criar pedido";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [orderService],
  );

  const processPayment = useCallback(
    async (orderId: string): Promise<Order> => {
      try {
        setLoading(true);
        setError(null);
        const order = await orderService.processPayment(orderId);
        setCurrentOrder(order);
        return order;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao processar pagamento";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [orderService],
  );

  const checkOrderStatus = useCallback(
    async (orderId: string): Promise<Order> => {
      try {
        setLoading(true);
        setError(null);
        const order = await orderService.checkOrderStatus(orderId);
        setCurrentOrder(order);
        return order;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao verificar status";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [orderService],
  );

  const clearOrder = useCallback(() => {
    setCurrentOrder(null);
    setError(null);
  }, []);

  const value: OrderContextType = useMemo(
    () => ({
      currentOrder,
      loading,
      error,
      createOrder,
      processPayment,
      checkOrderStatus,
      clearOrder,
    }),
    [
      currentOrder,
      loading,
      error,
      createOrder,
      processPayment,
      checkOrderStatus,
      clearOrder,
    ],
  );

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrder deve ser usado dentro de um OrderProvider");
  }
  return context;
}

