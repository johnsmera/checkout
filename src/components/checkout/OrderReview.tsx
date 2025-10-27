import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { formatPrice } from "@/utils/amount";
import { CreditCard, QrCode, Receipt } from "lucide-react";
import { useCartProductData } from "@/hooks/useCartProductData";
import { useCartSummary } from "@/hooks/useCartSummary";
import type { PaymentMethod } from "@/types/order";

interface OrderReviewProps {
  paymentMethod: PaymentMethod;
}

const paymentMethodLabels: Record<PaymentMethod, string> = {
  pix: "PIX",
  credit_card: "Cartão de Crédito",
  boleto: "Boleto",
};

const paymentMethodIcons: Record<PaymentMethod, typeof QrCode> = {
  pix: QrCode,
  credit_card: CreditCard,
  boleto: Receipt,
};

export function OrderReview({ paymentMethod }: OrderReviewProps) {
  const { getProductData } = useCartProductData();
  const { items, total, totalItems } = useCartSummary();
  const PaymentIcon = paymentMethodIcons[paymentMethod];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revisão do Pedido</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Itens do Carrinho */}
        <div>
          <h3 className="font-medium mb-3">
            Itens ({totalItems} {totalItems === 1 ? "produto" : "produtos"})
          </h3>
          <div className="space-y-3">
            {items.map((item) => {
              const product = getProductData(item.productId);
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-shrink-0 w-16 h-16">
                    <Image
                      src={product?.imageUrl || "/placeholder-product.jpg"}
                      alt={product?.name || "Produto"}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">
                      {product?.name || `Produto ${item.productId}`}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Quantidade: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Método de Pagamento */}
        <div className="pt-4 border-t">
          <h3 className="font-medium mb-3">Método de Pagamento</h3>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <PaymentIcon className="w-6 h-6 text-primary" />
            <span className="font-medium">
              {paymentMethodLabels[paymentMethod]}
            </span>
          </div>
        </div>

        {/* Total */}
        <div className="pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-2xl font-bold text-primary">
              {formatPrice(total)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

