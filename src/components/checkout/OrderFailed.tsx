import { XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/utils/amount";
import type { Order } from "@/types/order";

interface OrderFailedProps {
  order: Order;
  onRetry: () => void;
  onBackToHome: () => void;
}

export function OrderFailed({
  order,
  onRetry,
  onBackToHome,
}: OrderFailedProps) {
  // Mensagens específicas por método de pagamento
  const errorMessages = {
    pix: [
      "QR Code não foi gerado corretamente",
      "Erro na comunicação com o banco",
      "Serviço PIX temporariamente indisponível",
      "Tente novamente em alguns instantes",
    ],
    credit_card: [
      "Dados do cartão incorretos",
      "Limite insuficiente",
      "Cartão bloqueado ou expirado",
      "Erro na validação com a operadora",
    ],
    boleto: [
      "Erro ao gerar código de barras",
      "Serviço bancário temporariamente indisponível",
      "Problema na comunicação com o sistema",
      "Tente novamente em alguns instantes",
    ],
  };

  const messages = errorMessages[order.paymentMethod] || [
    "Erro temporário no processamento",
    "Tente novamente em alguns instantes",
  ];

  return (
    <Card>
      <CardContent className="py-12">
        <div className="flex flex-col items-center space-y-6 max-w-md mx-auto">
          {/* Ícone de Erro */}
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>

          {/* Mensagem */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              Pagamento Não Processado
            </h2>
            <p className="text-muted-foreground">
              Infelizmente não conseguimos processar seu pagamento.
            </p>
            <p className="text-muted-foreground">
              Número do pedido: <span className="font-mono">{order.id}</span>
            </p>
            <p className="text-lg font-semibold text-foreground">
              Valor: {formatPrice(order.total)}
            </p>
          </div>

          {/* Motivos Possíveis */}
          <div className="w-full bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-900 mb-2">
              Possíveis motivos:
            </h3>
            <ul className="text-sm text-red-800 space-y-1 list-disc list-inside">
              {messages.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          </div>

          {/* Botões de Ação */}
          <div className="w-full space-y-3">
            <Button onClick={onRetry} size="lg" className="w-full">
              Tentar Novamente
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

