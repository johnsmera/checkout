import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { CreditCardForm } from "./CreditCardForm";
import { PixPayment } from "./PixPayment";
import { BoletoPayment } from "./BoletoPayment";
import type { PaymentMethod, CreditCardData } from "@/types/order";

interface PaymentMethodStepProps {
  selectedMethod: PaymentMethod | null;
  onSelectMethod: (method: PaymentMethod) => void;
  creditCardData: CreditCardData;
  cardErrors: Partial<CreditCardData>;
  onCardDataChange: (field: keyof CreditCardData, value: string) => void;
  onCardFieldBlur?: (field: keyof CreditCardData) => void;
}

export function PaymentMethodStep({
  selectedMethod,
  onSelectMethod,
  creditCardData,
  cardErrors,
  onCardDataChange,
  onCardFieldBlur,
}: PaymentMethodStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Método de Pagamento</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <PaymentMethodSelector
          selectedMethod={selectedMethod}
          onSelectMethod={onSelectMethod}
        />

        {selectedMethod === "credit_card" && (
          <div className="pt-4 border-t">
            <CreditCardForm
              cardData={creditCardData}
              errors={cardErrors}
              onChange={onCardDataChange}
              onBlur={onCardFieldBlur}
            />
          </div>
        )}

        {selectedMethod === "pix" && <PixPayment />}

        {selectedMethod === "boleto" && <BoletoPayment />}
      </CardContent>
    </Card>
  );
}

