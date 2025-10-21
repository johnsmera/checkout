"use client";

import { redirect } from "next/navigation";
import { ProtectedLayoutComponent } from "@/components/ProtectedLayout";
import { ProtectedLayoutSkeleton } from "@/components/ProtectedLayoutSkeleton";
import { useAuth } from "@/hooks/useAuth";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, storagedUser, isLoading, isLoadingStoragedUser } = useAuth();

  // Aguarda o carregamento completo antes de verificar autenticação
  if (isLoading || isLoadingStoragedUser) {
    return <ProtectedLayoutSkeleton />;
  }

  // Verifica se há usuário autenticado (user ou storagedUser)
  if (!user && !storagedUser) {
    redirect("/login");
  }

  return <ProtectedLayoutComponent>{children}</ProtectedLayoutComponent>;
}
