"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useOrder } from "@/contexts/OrderContext";
import type { Order } from "@/types/order";

export function useOrderRetry() {
  const router = useRouter();
  const { clearOrder } = useOrder();

  const canRetry = useCallback((order: Order | null): boolean => {
    if (!order) return false;
    return order.status === "failed" || order.status === "expired";
  }, []);

  const handleRetry = useCallback(() => {
    clearOrder();
    router.push("/checkout");
  }, [clearOrder, router]);

  const handleBackToHome = useCallback(() => {
    clearOrder();
    router.push("/home");
  }, [clearOrder, router]);

  return {
    canRetry,
    handleRetry,
    handleBackToHome,
  };
}

