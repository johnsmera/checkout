"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProtectedLayoutSkeleton } from "@/components/ProtectedLayoutSkeleton";
import { useAuth } from "@/hooks/useAuth";
import { InMemoryCartRepository } from "@/repositories/implementations/in-memory-cart.repository";
import { CartProvider } from "@/contexts/CartContext";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export function ProtectedLayoutComponent({ children }: ProtectedLayoutProps) {
  const { user, storagedUser, isLoading, isLoadingStoragedUser } = useAuth();
  const router = useRouter();
  const repository = new InMemoryCartRepository();

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
    <CartProvider repository={repository}>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1 pb-8">{children}</main>
        <Footer />
      </div>
    </CartProvider>
  );
}
