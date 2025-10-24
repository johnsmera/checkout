"use client";

import { X, Plus, Minus } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/utils/amount";
import { useCartOperations } from "@/hooks/useCartOperations";
import { useCartQuantityEditing } from "@/hooks/useCartQuantityEditing";
import { useCartProductData } from "@/hooks/useCartProductData";
import { useCartSummary } from "@/hooks/useCartSummary";

interface CartDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDropdown({ isOpen, onClose }: CartDropdownProps) {
  const {
    handleRemoveItem,
    handleIncreaseQuantity,
    handleDecreaseQuantity,
    handleUpdateQuantity,
    loading,
  } = useCartOperations();
  
  const {
    handleQuantityChange,
    handleQuantityBlur,
    getDisplayQuantity,
  } = useCartQuantityEditing();
  
  const { getProductData } = useCartProductData();
  const { totalItems, total, isEmpty, items } = useCartSummary();

  const itemCountText = totalItems === 1 ? "item" : "itens";
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
      <div className="p-3">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="text-base font-semibold">Carrinho</h3>
            <p className="text-xs text-gray-500">
              {totalItems} {itemCountText}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {isEmpty ? (
          <p className="text-gray-500 text-center py-4">Carrinho vazio</p>
        ) : (
          <div className="space-y-2">
            {items.map((item) => {
              const product = getProductData(item.productId);
              return (
                <div
                  key={item.id}
                  className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    {/* Imagem e info do produto */}
                    <div className="flex items-center space-x-4 flex-1">
                      {/* Imagem do produto */}
                      <div className="flex-shrink-0 w-20 h-16">
                        <Image
                          src={product?.imageUrl || "/placeholder-product.jpg"}
                          alt={product?.name || "Produto"}
                          width={80}
                          height={64}
                          className="w-full h-full object-cover rounded-md border border-gray-200"
                        />
                      </div>

                      {/* Info do produto */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm truncate">
                          {product?.name || `Produto ${item.productId}`}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {formatPrice(item.price)} cada
                        </p>
                      </div>
                    </div>

                    {/* Controles */}
                    <div className="flex items-center space-x-2">
                      {/* Controles de quantidade */}
                      <div className="flex items-center border border-gray-300 rounded">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleDecreaseQuantity(item.id, item.quantity)
                          }
                          disabled={loading || item.quantity <= 1}
                          className="h-7 w-7 p-0 hover:bg-gray-100"
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
                            handleQuantityBlur(item.id, item.quantity, handleUpdateQuantity)
                          }
                          className="w-12 h-7 text-center border-0 focus:ring-0 text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          style={{ textAlign: "center" }}
                        />

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleIncreaseQuantity(item.id, item.quantity)
                          }
                          disabled={loading}
                          className="h-7 w-7 p-0 hover:bg-gray-100"
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
                        className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Total */}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm">Total:</span>
                <span className="font-bold">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
