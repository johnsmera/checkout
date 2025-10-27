"use client";

import { useState, useCallback, useMemo } from "react";
import type { PaymentMethod, CreditCardData } from "@/types/order";
import {
  validateCardNumber,
  validateExpiryDate,
  validateCVV,
} from "@/utils/payment";

const fieldValidators = {
  cardNumber: (value: string) => {
    if (!value) return "Número do cartão é obrigatório";
    if (!validateCardNumber(value)) return "Número do cartão inválido";
    return undefined;
  },
  cardName: (value: string) => {
    if (!value) return "Nome no cartão é obrigatório";
    if (value.trim().length < 3) return "Nome no cartão inválido";
    return undefined;
  },
  expiryDate: (value: string) => {
    if (!value) return "Data de validade é obrigatória";
    if (!validateExpiryDate(value)) return "Data de validade inválida ou expirada";
    return undefined;
  },
  cvv: (value: string) => {
    if (!value) return "CVV é obrigatório";
    if (!validateCVV(value)) return "CVV inválido";
    return undefined;
  },
};

export function usePaymentMethod() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null,
  );
  const [creditCardData, setCreditCardData] = useState<CreditCardData>({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });
  const [cardErrors, setCardErrors] = useState<Partial<CreditCardData>>({});

  const handleMethodSelect = useCallback((method: PaymentMethod) => {
    setPaymentMethod(method);
    setCardErrors({});
  }, []);

  const handleCardDataChange = useCallback(
    (field: keyof CreditCardData, value: string) => {
      setCreditCardData((prev) => ({
        ...prev,
        [field]: value,
      }));
      
      setCardErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    },
    [],
  );

  const handleCardFieldBlur = useCallback(
    (field: keyof CreditCardData) => {
      const value = creditCardData[field];
      const validator = fieldValidators[field];
      const error = validator(value);

      if (error) {
        setCardErrors((prev) => ({
          ...prev,
          [field]: error,
        }));
      }
    },
    [creditCardData],
  );

  const validateCreditCard = useCallback((): boolean => {
    if (paymentMethod !== "credit_card") {
      return true;
    }

    const errors: Partial<CreditCardData> = {};
    let hasErrors = false;

    Object.entries(fieldValidators).forEach(([field, validator]) => {
      const value = creditCardData[field as keyof CreditCardData];
      const error = validator(value);
      
      if (error) {
        errors[field as keyof CreditCardData] = error;
        hasErrors = true;
      }
    });

    setCardErrors(errors);
    return !hasErrors;
  }, [paymentMethod, creditCardData]);

  // Validação silenciosa para canProceed (não seta erros)
  const validateCreditCardSilent = useCallback((): boolean => {
    if (paymentMethod !== "credit_card") {
      return true;
    }

    return Object.entries(fieldValidators).every(([field, validator]) => {
      const value = creditCardData[field as keyof CreditCardData];
      return !validator(value); // Retorna true se não há erro
    });
  }, [paymentMethod, creditCardData]);

  const isMethodSelected = useMemo(() => paymentMethod !== null, [paymentMethod]);

  const canProceed = useMemo(() => {
    if (!paymentMethod) return false;
    if (paymentMethod === "credit_card") return validateCreditCardSilent();
    return true;
  }, [paymentMethod, validateCreditCardSilent]);

  return {
    paymentMethod,
    creditCardData,
    cardErrors,
    isMethodSelected,
    canProceed,
    handleMethodSelect,
    handleCardDataChange,
    handleCardFieldBlur,
    validateCreditCard,
    validateCreditCardSilent,
  };
}

