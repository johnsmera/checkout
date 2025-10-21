"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const { user, storagedUser, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const currentUser = user || storagedUser;

  return (
    <nav className="bg-secondary border-b border-secondary/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo variant="compact" />
          </div>

          {/* User info and logout */}
          <div className="flex items-center space-x-4">
            {currentUser && (
              <span className="text-sm text-secondary-foreground">
                Olá, {currentUser?.email || "Usuário"}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              disabled={isLoading}
              className="border-secondary-foreground text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft /> {isLoading ? "Saindo..." : "Sair"}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
