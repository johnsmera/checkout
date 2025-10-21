"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { ProtectedLayoutSkeleton } from "@/components/ProtectedLayoutSkeleton";
import { useAuth } from "@/hooks/useAuth";

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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        {children}
      </main>
    </div>
  );
}
