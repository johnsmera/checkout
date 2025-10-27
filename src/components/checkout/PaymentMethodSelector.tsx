import { CreditCard, QrCode, Receipt } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { PaymentMethod } from "@/types/order";

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod | null;
  onSelectMethod: (method: PaymentMethod) => void;
}

const paymentMethods = [
  {
    id: "pix" as const,
    label: "PIX",
    description: "Pagamento instantâneo",
    icon: QrCode,
  },
  {
    id: "credit_card" as const,
    label: "Cartão de Crédito",
    description: "Visa, Mastercard, Amex",
    icon: CreditCard,
  },
  {
    id: "boleto" as const,
    label: "Boleto",
    description: "Vencimento em 3 dias",
    icon: Receipt,
  },
];

export function PaymentMethodSelector({
  selectedMethod,
  onSelectMethod,
}: PaymentMethodSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {paymentMethods.map((method) => {
        const Icon = method.icon;
        const isSelected = selectedMethod === method.id;

        return (
          <Card
            key={method.id}
            className={`
              cursor-pointer transition-all hover:shadow-md
              ${isSelected ? "border-primary border-2 bg-primary/5" : "border-gray-200"}
            `}
          >
            <Button
              variant="ghost"
              className="w-full h-auto p-0"
              onClick={() => onSelectMethod(method.id)}
              aria-pressed={isSelected}
            >
              <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                <Icon
                  className={`w-10 h-10 ${isSelected ? "text-primary" : "text-gray-500"}`}
                />
                <div>
                  <h3
                    className={`font-semibold ${isSelected ? "text-primary" : "text-foreground"}`}
                  >
                    {method.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {method.description}
                  </p>
                </div>
              </CardContent>
            </Button>
          </Card>
        );
      })}
    </div>
  );
}

