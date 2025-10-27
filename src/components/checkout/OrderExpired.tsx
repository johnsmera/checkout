import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/utils/amount";
import type { Order } from "@/types/order";

interface OrderExpiredProps {
  order: Order;
  onRetry: () => void;
  onBackToHome: () => void;
}

const paymentMethodLabels: Record<string, string> = {
  pix: "PIX",
  credit_card: "Cartão de Crédito",
  boleto: "Boleto",
};

export function OrderExpired({
  order,
  onRetry,
  onBackToHome,
}: OrderExpiredProps) {
  const expirationTime =
    order.paymentMethod === "pix" ? "30 minutos" : "3 dias";

  return (
    <Card>
      <CardContent className="py-12">
        <div className="flex flex-col items-center space-y-6 max-w-md mx-auto">
          {/* Ícone de Expirado */}
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
            <Clock className="w-12 h-12 text-orange-600" />
          </div>

          {/* Mensagem */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              Pedido Expirado
            </h2>
            <p className="text-muted-foreground">
              O prazo para pagamento deste pedido expirou.
            </p>
            <p className="text-muted-foreground">
              Número do pedido: <span className="font-mono">{order.id}</span>
            </p>
            <p className="text-lg font-semibold text-foreground">
              Valor: {formatPrice(order.total)}
            </p>
          </div>

          {/* Informações */}
          <div className="w-full bg-orange-50 border border-orange-200 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-orange-900">
              Detalhes da Expiração
            </h3>
            <p className="text-sm text-orange-800">
              Método: {paymentMethodLabels[order.paymentMethod]}
            </p>
            <p className="text-sm text-orange-800">
              Prazo de pagamento: {expirationTime}
            </p>
            <p className="text-sm text-orange-800">
              Para realizar a compra, você precisa gerar um novo pedido.
            </p>
          </div>

          {/* Botões de Ação */}
          <div className="w-full space-y-3">
            <Button onClick={onRetry} size="lg" className="w-full">
              Gerar Novo Pedido
            </Button>
            <Button
              onClick={onBackToHome}
              variant="outline"
              size="lg"
              className="w-full"
            >
              Voltar para Home
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

