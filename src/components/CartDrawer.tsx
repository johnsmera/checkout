"use client";

import { Plus, Minus, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/utils/amount";
import { useCartOperations } from "@/hooks/useCartOperations";
import { useCartQuantityEditing } from "@/hooks/useCartQuantityEditing";
import { useCartProductData } from "@/hooks/useCartProductData";
import { useCartSummary } from "@/hooks/useCartSummary";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const {
    handleRemoveItem,
    handleIncreaseQuantity,
    handleDecreaseQuantity,
    handleUpdateQuantity,
    loading,
  } = useCartOperations();

  const { handleQuantityChange, handleQuantityBlur, getDisplayQuantity } =
    useCartQuantityEditing();

  const { getProductData } = useCartProductData();
  const { totalItems, total, isEmpty, items } = useCartSummary();

  const itemCountText = totalItems === 1 ? "item" : "itens";
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="flex flex-col h-full">
        <DrawerHeader className="flex-shrink-0 relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-4 top-4 h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
          <DrawerTitle>Carrinho</DrawerTitle>
          <DrawerDescription>
            {totalItems} {itemCountText}
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 flex-1 overflow-y-auto min-h-0">
          {isEmpty ? (
            <p className="text-gray-500 text-center py-8">Carrinho vazio</p>
          ) : (
            <div className="space-y-3">
              {items.map((item) => {
                const product = getProductData(item.productId);
                return (
                  <div
                    key={item.id}
                    className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                  >
                    <div className="flex items-start gap-3">
                      {/* Imagem do produto */}
                      <div className="flex-shrink-0 w-16 h-12">
                        <Image
                          src={product?.imageUrl || "/placeholder-product.jpg"}
                          alt={product?.name || "Produto"}
                          width={64}
                          height={48}
                          className="w-full h-full object-cover rounded-md border border-gray-200"
                        />
                      </div>

                      {/* Info do produto */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm truncate">
                          {product?.name || `Produto ${item.productId}`}
                        </h4>
                        <p className="text-xs text-gray-500 mb-2">
                          {formatPrice(item.price)} cada
                        </p>

                        {/* Controles */}
                        <div className="flex items-center justify-between">
                          {/* Controles de quantidade */}
                          <div className="flex items-center border border-gray-300 rounded">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDecreaseQuantity(item.id, item.quantity)
                              }
                              disabled={loading || item.quantity <= 1}
                              className="h-6 w-6 p-0 hover:bg-gray-100"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>

                            <Input
                              type="number"
                              min="1"
                              value={getDisplayQuantity(item.id, item.quantity)}
                              onChange={(e) =>
                                handleQuantityChange(item.id, e.target.value)
                              }
                              onBlur={() =>
                                handleQuantityBlur(
                                  item.id,
                                  item.quantity,
                                  handleUpdateQuantity
                                )
                              }
                              className="w-10 h-6 text-center border-0 focus:ring-0 text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              style={{ textAlign: "center" }}
                            />

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleIncreaseQuantity(item.id, item.quantity)
                              }
                              disabled={loading}
                              className="h-6 w-6 p-0 hover:bg-gray-100"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Botão remover */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={loading}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {!isEmpty && (
          <DrawerFooter className="flex-shrink-0 border-t bg-background">
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium text-lg">Total:</span>
              <span className="font-bold text-lg">{formatPrice(total)}</span>
            </div>
            <Button className="w-full">Finalizar Compra</Button>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}
