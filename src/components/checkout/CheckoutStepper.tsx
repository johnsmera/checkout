import { Check } from "lucide-react";

type CheckoutStep = "buyer-data" | "payment" | "review";

interface CheckoutStepperProps {
  currentStep: CheckoutStep;
}

const steps = [
  { id: "buyer-data" as const, label: "Dados", number: 1 },
  { id: "payment" as const, label: "Pagamento", number: 2 },
  { id: "review" as const, label: "Revisão", number: 3 },
];

export function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <nav aria-label="Progresso do checkout">
      <ol className="flex items-center justify-between md:justify-center md:space-x-8">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = step.id === currentStep;

          return (
            <li key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                    ${
                      isCompleted
                        ? "bg-primary border-primary text-white"
                        : isCurrent
                          ? "border-primary text-primary"
                          : "border-gray-300 text-gray-400"
                    }
                  `}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-semibold">{step.number}</span>
                  )}
                </div>
                <span
                  className={`
                    mt-2 text-xs md:text-sm font-medium
                    ${isCurrent ? "text-foreground" : "text-muted-foreground"}
                  `}
                >
                  {step.label}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`
                    hidden md:block w-16 h-0.5 mx-4 transition-colors
                    ${isCompleted ? "bg-primary" : "bg-gray-300"}
                  `}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

