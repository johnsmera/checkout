import { useState, useCallback, useMemo } from "react";
import { useAuth } from "./useAuth";
import { usePaymentMethod } from "./usePaymentMethod";
import type { CreateOrderRequest } from "@/types/order";

type CheckoutStep = "buyer-data" | "payment" | "review";

const createStepTransitions = (setCurrentStep: (step: CheckoutStep) => void, canProceed: boolean) => ({
  "buyer-data": () => setCurrentStep("payment"),
  "payment": () => {
    if (canProceed) {
      setCurrentStep("review");
    }
  },
  "review": () => {}, // Não há próximo step
});

const createPrevStepTransitions = (setCurrentStep: (step: CheckoutStep) => void) => ({
  "review": () => setCurrentStep("payment"),
  "payment": () => setCurrentStep("buyer-data"),
  "buyer-data": () => {}, // Não há step anterior
});

const createStepValidators = (user: unknown, canProceed: boolean) => ({
  "buyer-data": () => !!user,
  "payment": () => canProceed,
  "review": () => false, // Não há próximo step
});

export function useCheckoutForm() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("buyer-data");
  const paymentMethod = usePaymentMethod();

  const handleNextStep = useCallback(() => {
    const stepTransitions = createStepTransitions(setCurrentStep, paymentMethod.canProceed);
    const transition = stepTransitions[currentStep];
    transition();
  }, [currentStep, paymentMethod.canProceed]);

  const handlePrevStep = useCallback(() => {
    const prevStepTransitions = createPrevStepTransitions(setCurrentStep);
    const transition = prevStepTransitions[currentStep];
    transition();
  }, [currentStep]);

  const canProceedToNextStep = useMemo(() => {
    const stepValidators = createStepValidators(user, paymentMethod.canProceed);
    const validator = stepValidators[currentStep];
    return validator();
  }, [currentStep, user, paymentMethod.canProceed]);

  const buildOrderRequest = useCallback((): CreateOrderRequest | null => {
    if (!paymentMethod.paymentMethod) return null;

    return {
      paymentMethod: paymentMethod.paymentMethod,
      paymentData:
        paymentMethod.paymentMethod === "credit_card"
          ? paymentMethod.creditCardData
          : null,
    };
  }, [paymentMethod]);

  return {
    currentStep,
    user,
    paymentMethod,
    canProceedToNextStep,
    handleNextStep,
    handlePrevStep,
    buildOrderRequest,
  };
}

