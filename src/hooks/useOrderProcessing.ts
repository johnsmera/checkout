"use client";

import { useState, useCallback } from "react";
import { useOrder } from "@/contexts/OrderContext";
import type { OrderStatus } from "@/types/order";

const statusMessages: Record<OrderStatus, string> = {
  pending: "Validando dados do pedido...",
  processing: "Processando pagamento...",
  paid: "Pagamento confirmado!",
  failed: "Falha ao processar pagamento",
  expired: "Pedido expirado",
};

export function useOrderProcessing(orderId: string | null) {
  const { processPayment, checkOrderStatus } = useOrder();
  const [processingMessage, setProcessingMessage] = useState<string>(
    statusMessages.pending,
  );
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startProcessing = useCallback(async () => {
    if (!orderId) return;

    try {
      setError(null);
      setProcessingMessage(statusMessages.pending);

      // Inicia o processamento do pagamento
      const order = await processPayment(orderId);
      setOrderStatus(order.status);
      setProcessingMessage(statusMessages[order.status]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao processar pedido";
      setError(errorMessage);
    }
  }, [orderId, processPayment]);

  const checkStatus = useCallback(async () => {
    if (!orderId) return;

    try {
      const order = await checkOrderStatus(orderId);
      setOrderStatus(order.status);
      setProcessingMessage(statusMessages[order.status]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao verificar status";
      setError(errorMessage);
    }
  }, [orderId, checkOrderStatus]);

  const isProcessing = orderStatus === "pending" || orderStatus === "processing";
  const isFinished =
    orderStatus === "paid" ||
    orderStatus === "failed" ||
    orderStatus === "expired";

  return {
    processingMessage,
    orderStatus,
    error,
    isProcessing,
    isFinished,
    startProcessing,
    checkStatus,
  };
}

