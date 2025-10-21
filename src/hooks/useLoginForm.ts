import { useState } from "react";
import { useAuth } from "./useAuth";
import { getErrorMessage } from "@/lib/errors";

interface LoginFormData {
  email: string;
  password: string;
}

export function useLoginForm() {
  const { signIn } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<LoginFormData>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null); // Limpa erro geral
    setFieldErrors(prev => ({
      ...prev,
      [name]: undefined // Limpa erro do campo específico
    }));
  };

  const validateForm = (): boolean => {
    const { email, password } = formData;
    
    const validations = {
      email: () => {
        if (!email.trim()) return 'E-mail é obrigatório';
        if (!/\S+@\S+\.\S+/.test(email)) return 'E-mail inválido';
        return null;
      },
      password: () => {
        if (!password) return 'Senha é obrigatória';
        if (password.length < 6) return 'Senha deve ter pelo menos 6 caracteres';
        return null;
      }
    };

    const newFieldErrors: Partial<LoginFormData> = {};
    let hasErrors = false;

    // Executa todas as validações e coleta erros por campo
    for (const [field, validator] of Object.entries(validations)) {
      const error = validator();
      if (error) {
        newFieldErrors[field as keyof LoginFormData] = error;
        hasErrors = true;
      }
    }

    setFieldErrors(newFieldErrors);
    return !hasErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação local (usa fieldErrors)
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null); // Limpa erro geral
    setFieldErrors({}); // Limpa erros de campo

    try {
      await signIn(formData);
      setFormData({ email: "", password: "" });
    } catch (error) {
      // Erro da API (usa error geral)
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ email: "", password: "" });
    setError(null);
    setFieldErrors({});
  };

  return {
    formData,
    isLoading,
    error,
    fieldErrors,
    handleInputChange,
    handleSubmit,
    resetForm,
  };
}
