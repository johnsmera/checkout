"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckoutStepper } from "@/components/checkout/CheckoutStepper";
import { BuyerDataStep } from "@/components/checkout/BuyerDataStep";
import { PaymentMethodStep } from "@/components/checkout/PaymentMethodStep";
import { OrderReview } from "@/components/checkout/OrderReview";
import { OrderProcessing } from "@/components/checkout/OrderProcessing";
import { useCheckoutForm } from "@/hooks/useCheckoutForm";
import { useOrder } from "@/contexts/OrderContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getErrorMessage } from "@/lib/errors";

export function CheckoutPageClient() {
  const router = useRouter();
  const { createOrder, processPayment } = useOrder();
  const {
    currentStep,
    user,
    paymentMethod,
    canProceedToNextStep,
    handleNextStep,
    handlePrevStep,
    buildOrderRequest,
  } = useCheckoutForm();

  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirmOrder = async () => {
    if (!user) return;

    // Valida cartão de crédito se necessário
    if (
      paymentMethod.paymentMethod === "credit_card" &&
      !paymentMethod.validateCreditCard()
    ) {
      return;
    }

    const orderRequest = buildOrderRequest();
    if (!orderRequest) return;

    try {
      setIsCreatingOrder(true);
      setError(null);

      // Cria o pedido
      const order = await createOrder(orderRequest, user.id);

      // Processa o pagamento IMEDIATAMENTE
      const processedOrder = await processPayment(order.id);

      // Redireciona para a página de resultado com o pedido já processado
      router.push(`/order-result/${processedOrder.id}`);
    } catch (err) {
      setError(getErrorMessage(err));
      setIsCreatingOrder(false);
    }
  };

  // Se está criando pedido, mostra tela de loading
  if (isCreatingOrder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-yellow-50/20 to-blue-50/30 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <OrderProcessing message="Processando pagamento..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-yellow-50/20 to-blue-50/30 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Finalizar Compra
          </h1>
          <p className="text-muted-foreground">
            Complete as informações para finalizar seu pedido
          </p>
        </div>

        {/* Stepper */}
        <CheckoutStepper currentStep={currentStep} />

        {/* Erro Global */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Conteúdo do Step */}
        <div className="space-y-6">
          {currentStep === "buyer-data" && <BuyerDataStep user={user} />}

          {currentStep === "payment" && (
            <PaymentMethodStep
              selectedMethod={paymentMethod.paymentMethod}
              onSelectMethod={paymentMethod.handleMethodSelect}
              creditCardData={paymentMethod.creditCardData}
              cardErrors={paymentMethod.cardErrors}
              onCardDataChange={paymentMethod.handleCardDataChange}
              onCardFieldBlur={paymentMethod.handleCardFieldBlur}
            />
          )}

          {currentStep === "review" && paymentMethod.paymentMethod && (
            <OrderReview paymentMethod={paymentMethod.paymentMethod} />
          )}

          {/* Botões de Navegação */}
          <div className="flex gap-4">
            {currentStep !== "buyer-data" && (
              <Button
                variant="outline"
                onClick={handlePrevStep}
                className="flex-1"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            )}

            {currentStep !== "review" ? (
              <Button
                onClick={handleNextStep}
                disabled={!canProceedToNextStep}
                className="flex-1"
              >
                Avançar
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleConfirmOrder}
                disabled={isCreatingOrder}
                className="flex-1"
              >
                {isCreatingOrder ? "Processando Pagamento..." : "Confirmar Pedido"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
