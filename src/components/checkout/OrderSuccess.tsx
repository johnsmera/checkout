import { CheckCircle, Copy, QrCode } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/utils/amount";
import { formatBoletoBarCode, formatPixCode } from "@/utils/payment";
import type { Order } from "@/types/order";
import { useState } from "react";

interface OrderSuccessProps {
  order: Order;
  onBackToHome: () => void;
}

export function OrderSuccess({ order, onBackToHome }: OrderSuccessProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderSuccessHeader = () => (
    <>
      {/* Ícone de Sucesso */}
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
        <CheckCircle className="w-12 h-12 text-green-600" />
      </div>

      {/* Mensagem */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">
          Pedido Confirmado!
        </h2>
        <p className="text-muted-foreground">
          Número do pedido: <span className="font-mono">{order.id}</span>
        </p>
        <p className="text-xl font-semibold text-primary">
          {formatPrice(order.total)}
        </p>
      </div>
    </>
  );

  const renderPixPayment = () => {
    if (!order.paymentDetails.pix) return null;

    return (
      <div className="w-full space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
          <h3 className="font-semibold text-center text-blue-900">
            Escaneie o QR Code para pagar
          </h3>
          <div className="flex justify-center">
            <div className="bg-white p-6 rounded-lg border-2 border-dashed border-blue-300">
              <QrCode className="w-48 h-48 text-black-600" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-blue-800 text-center">
              Ou copie o código PIX:
            </p>
            <div className="flex gap-2">
              <code className="flex-1 bg-white p-3 rounded text-xs break-all border border-blue-200">
                {formatPixCode(order.paymentDetails.pix.code)}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={() => order.paymentDetails.pix && handleCopy(order.paymentDetails.pix.code)}
                className="flex-shrink-0"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            {copied && (
              <p className="text-sm text-green-600 text-center">
                Código copiado!
              </p>
            )}
          </div>
          <p className="text-xs text-blue-700 text-center">
            Este código expira em 30 minutos
          </p>
        </div>
      </div>
    );
  };

  const renderBoletoPayment = () => {
    if (!order.paymentDetails.boleto) return null;

    return (
      <div className="w-full space-y-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 space-y-4">
          <h3 className="font-semibold text-center text-amber-900">
            Código de Barras do Boleto
          </h3>
          <div className="space-y-2">
            <code className="block bg-white p-3 rounded text-xs break-all border border-amber-200 text-center font-mono">
              {formatBoletoBarCode(order.paymentDetails.boleto.barCode)}
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={() => order.paymentDetails.boleto && handleCopy(order.paymentDetails.boleto.barCode)}
              className="w-full"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copiar Código
            </Button>
            {copied && (
              <p className="text-sm text-green-600 text-center">
                Código copiado!
              </p>
            )}
          </div>
          <p className="text-sm text-amber-800 text-center">
            Vencimento:{" "}
            {new Date(order.paymentDetails.boleto.dueDate).toLocaleDateString("pt-BR")}
          </p>
          <p className="text-xs text-amber-700 text-center">
            Pague em qualquer banco, lotérica ou app bancário
          </p>
        </div>
      </div>
    );
  };

  const renderCreditCardPayment = () => {
    if (!order.paymentDetails.creditCard) return null;

    return (
      <div className="w-full">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-2 text-center">
          <p className="text-green-900 font-medium">
            Pagamento aprovado no cartão
          </p>
          <p className="text-sm text-green-700">
            {order.paymentDetails.creditCard.brand} •••• ••••{" "}
            {order.paymentDetails.creditCard.lastDigits}
          </p>
        </div>
      </div>
    );
  };

  const renderPaymentMethod = () => {
    const paymentRenderers = {
      pix: renderPixPayment,
      boleto: renderBoletoPayment,
      credit_card: renderCreditCardPayment,
    };

    const renderer = paymentRenderers[order.paymentMethod];
    return renderer ? renderer() : null;
  };

  return (
    <Card>
      <CardContent className="py-12">
        <div className="flex flex-col items-center space-y-6 max-w-2xl mx-auto">
          {renderSuccessHeader()}
          {renderPaymentMethod()}
          
          {/* Botão de Voltar */}
          <Button onClick={onBackToHome} size="lg" className="w-full md:w-auto">
            Voltar para Home
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

