"use client";

import { OrderSuccess } from "@/components/checkout/OrderSuccess";
import { OrderFailed } from "@/components/checkout/OrderFailed";
import { OrderExpired } from "@/components/checkout/OrderExpired";
import { OrderProcessing } from "@/components/checkout/OrderProcessing";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useOrderResult } from "@/hooks/useOrderResult";

export function OrderResultPageClient() {
  const { order, loading, error, handleRetry, handleBackToHome } = useOrderResult();

  const renderLoadingState = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-yellow-50/20 to-blue-50/30 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <OrderProcessing message="Carregando informações do pedido..." />
      </div>
    </div>
  );

  const renderErrorState = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-yellow-50/20 to-blue-50/30 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center space-y-6 max-w-md mx-auto">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-12 h-12 text-red-600" />
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-foreground">
                  Pedido Não Encontrado
                </h2>
                <p className="text-muted-foreground">
                  {error || "Não foi possível encontrar este pedido."}
                </p>
              </div>
              <Button onClick={handleBackToHome} size="lg">
                Voltar para Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );


  const renderOrderResult = () => {
    if (!order) return null;

    const orderRenderers = {
      paid: () => <OrderSuccess order={order} onBackToHome={handleBackToHome} />,
      failed: () => (
        <OrderFailed
          order={order}
          onRetry={handleRetry}
          onBackToHome={handleBackToHome}
        />
      ),
      expired: () => (
        <OrderExpired
          order={order}
          onRetry={handleRetry}
          onBackToHome={handleBackToHome}
        />
      ),
    };

    const renderer = orderRenderers[order.status as keyof typeof orderRenderers];
    return renderer ? renderer() : null;
  };

  if (loading) {
    return renderLoadingState();
  }

  if (error || !order) {
    return renderErrorState();
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-yellow-50/20 to-blue-50/30 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {renderOrderResult()}
      </div>
    </div>
  );
}
