import { forwardRef } from "react";
import { Input } from "./input";
import { Label } from "./label";

interface InputWithErrorProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  id: string;
}

export const InputWithError = forwardRef<HTMLInputElement, InputWithErrorProps>(
  ({ label, error, id, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <Label htmlFor={id}>{label}</Label>
        <Input
          ref={ref}
          id={id}
          className={`${error ? "border-red-500" : ""} ${className || ""}`}
          {...props}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  },
);

InputWithError.displayName = "InputWithError";
