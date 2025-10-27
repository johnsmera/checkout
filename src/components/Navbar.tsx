"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { CartIcon } from "@/components/CartIcon";
import { useEffect, useState } from "react";
import Link from "next/link";

export function Navbar() {
  const { logout, isLoading } = useAuth();
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      {/* Efeito de partículas flutuantes */}
      <div className="fixed top-0 left-0 w-full h-16 pointer-events-none z-10 overflow-hidden">
        {Array.from({ length: 8 }, (_, i) => {
          const id = `particle-${Date.now()}-${i}`;
          return (
            <div
              key={id}
              className="absolute w-1 h-1 bg-yellow-400/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          );
        })}
      </div>

      <nav className="relative overflow-hidden bg-secondary shadow-xl shadow-black/20 border-b border-black/5">
        {/* Efeito de brilho animado */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, 
              rgba(255, 255, 255, 0.3) 0%, 
              transparent 50%
            )`,
            transition: "all 0.3s ease-out",
          }}
        />

        {/* Efeito de glassmorphism */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />

        {/* Borda inferior com gradiente */}
        <div
          className="absolute bottom-0 left-0 w-full h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)",
            animation: "shimmer 3s ease-in-out infinite",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            {/* Logo com efeito hover */}
            <div className="flex-shrink-0 group">
              <div className="transform transition-all duration-300 group-hover:scale-105 group-hover:rotate-1">
                <Link href="/home">
                  <Logo variant="compact" />
                </Link>
              </div>
            </div>

            {/* User info, cart and logout */}
            <div className="flex items-center space-x-4">
              <div className="transform transition-all duration-300 hover:scale-110">
                <CartIcon />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                disabled={isLoading}
                className="relative overflow-hidden border-secondary-foreground/30 text-secondary-foreground bg-secondary-foreground/10 backdrop-blur-md hover:bg-secondary-foreground/20 hover:border-secondary-foreground/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {/* Efeito de brilho no botão */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <ArrowLeft className="relative z-10" />
                <span className="relative z-10">
                  {isLoading ? "Saindo..." : "Sair"}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
