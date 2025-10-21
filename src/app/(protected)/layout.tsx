"use client";

import { redirect } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, storagedUser, logout, isLoading, isLoadingStoragedUser } = useAuth();

  // Aguarda o carregamento completo antes de verificar autenticação
  if (isLoading || isLoadingStoragedUser) {
    return <div>Carregando...</div>;
  }

  // Verifica se há usuário autenticado (user ou storagedUser)
  if (!user && !storagedUser) {
    redirect("/login");
  }

  return (
    <>
      {children}

      <div>
        <button
          type="button"
          onClick={() => {
            logout();
          }}
        >
          Sair
        </button>
      </div>
    </>
  );
}
