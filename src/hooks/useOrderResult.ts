"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useOrder } from "@/contexts/OrderContext";
import { useOrderRetry } from "@/hooks/useOrderRetry";
import type { Order } from "@/types/order";

export function useOrderResult() {
  const params = useParams();
  const orderId = params.orderId as string;
  const { checkOrderStatus } = useOrder();
  const { handleRetry, handleBackToHome } = useOrderRetry();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setError(null);
        const fetchedOrder = await checkOrderStatus(orderId);
        setOrder(fetchedOrder);
        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao buscar pedido",
        );
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId, checkOrderStatus]);

  return {
    order,
    loading,
    error,
    handleRetry,
    handleBackToHome,
  };
}
