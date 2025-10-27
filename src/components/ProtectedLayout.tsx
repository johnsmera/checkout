"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProtectedLayoutSkeleton } from "@/components/ProtectedLayoutSkeleton";
import { useAuth } from "@/hooks/useAuth";
import { CartProvider, useCart } from "@/contexts/CartContext";
import { OrderProvider } from "@/contexts/OrderContext";
import { cartRepository, orderRepository } from "@/lib/services";
import type { OrderRepository } from "@/repositories/interfaces/order.repository";
import type { CartRepository } from "@/repositories/interfaces/cart.repository";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export function ProtectedLayoutComponent({ children }: ProtectedLayoutProps) {
  const { user, storagedUser, isLoading, isLoadingStoragedUser } = useAuth();
  const router = useRouter();

  // Aguarda o carregamento completo antes de verificar autenticação
  useEffect(() => {
    if (!isLoading && !isLoadingStoragedUser) {
      if (!user && !storagedUser) {
        router.push("/login");
      }
    }
  }, [user, storagedUser, isLoading, isLoadingStoragedUser, router]);

  // Mostra skeleton enquanto verifica autenticação
  if (isLoading || isLoadingStoragedUser) {
    return <ProtectedLayoutSkeleton />;
  }

  // Se não está autenticado, não renderiza nada (o redirect já foi feito)
  if (!user && !storagedUser) {
    return null;
  }

  return (
    <CartProvider repository={cartRepository}>
      <OrderProviderWrapper
        orderRepository={orderRepository}
        cartRepository={cartRepository}
      >
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-1 pb-8">{children}</main>
          <Footer />
        </div>
      </OrderProviderWrapper>
    </CartProvider>
  );
}

// Wrapper para acessar o CartContext
function OrderProviderWrapper({
  children,
  orderRepository,
  cartRepository,
}: {
  children: React.ReactNode;
  orderRepository: OrderRepository;
  cartRepository: CartRepository;
}) {
  const { clearCart } = useCart();

  return (
    <OrderProvider
      orderRepository={orderRepository}
      cartRepository={cartRepository}
      onClearCart={clearCart}
    >
      {children}
    </OrderProvider>
  );
}
