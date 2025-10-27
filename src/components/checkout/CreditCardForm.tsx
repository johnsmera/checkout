import { InputWithError } from "@/components/ui/input-with-error";
import type { CreditCardData } from "@/types/order";
import { maskCardNumber, maskExpiryDate, maskCVV } from "@/utils/payment";

interface CreditCardFormProps {
  cardData: CreditCardData;
  errors: Partial<CreditCardData>;
  onChange: (field: keyof CreditCardData, value: string) => void;
  onBlur?: (field: keyof CreditCardData) => void;
}

export function CreditCardForm({
  cardData,
  errors,
  onChange,
  onBlur,
}: CreditCardFormProps) {
  const handleBlur = (field: keyof CreditCardData) => {
    onBlur?.(field);
  };

  return (
    <div className="space-y-4">
      <InputWithError
        id="cardNumber"
        label="Número do Cartão"
        type="text"
        value={cardData.cardNumber}
        onChange={(e) => onChange("cardNumber", maskCardNumber(e.target.value))}
        onBlur={() => handleBlur("cardNumber")}
        placeholder="1234 5678 9012 3456"
        error={errors.cardNumber}
        maxLength={19}
        autoComplete="cc-number"
      />

      <InputWithError
        id="cardName"
        label="Nome no Cartão"
        type="text"
        value={cardData.cardName}
        onChange={(e) => onChange("cardName", e.target.value.toUpperCase())}
        onBlur={() => handleBlur("cardName")}
        placeholder="NOME COMPLETO"
        error={errors.cardName}
        autoComplete="cc-name"
      />

      <div className="grid grid-cols-2 gap-4">
        <InputWithError
          id="expiryDate"
          label="Validade"
          type="text"
          value={cardData.expiryDate}
          onChange={(e) =>
            onChange("expiryDate", maskExpiryDate(e.target.value))
          }
          onBlur={() => handleBlur("expiryDate")}
          placeholder="MM/AA"
          error={errors.expiryDate}
          maxLength={5}
          autoComplete="cc-exp"
        />

        <InputWithError
          id="cvv"
          label="CVV"
          type="text"
          value={cardData.cvv}
          onChange={(e) => onChange("cvv", maskCVV(e.target.value))}
          onBlur={() => handleBlur("cvv")}
          placeholder="123"
          error={errors.cvv}
          maxLength={4}
          autoComplete="cc-csc"
        />
      </div>
    </div>
  );
}

