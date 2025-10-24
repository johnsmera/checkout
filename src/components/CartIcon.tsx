"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "@/components/CartDrawer";
import { useCartSummary } from "@/hooks/useCartSummary";

export function CartIcon() {
  const { totalItems } = useCartSummary();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={toggleDrawer}
        aria-label={`Carrinho de compras${totalItems > 0 ? ` com ${totalItems} item${totalItems > 1 ? "s" : ""}` : " vazio"}`}
        className="relative border-secondary-foreground text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary bg-transparent"
      >
        <ShoppingCart className="h-4 w-4" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </Button>

      <CartDrawer isOpen={isDrawerOpen} onClose={closeDrawer} />
    </div>
  );
}
