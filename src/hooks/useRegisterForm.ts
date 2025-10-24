import { useState, useCallback, useMemo } from "react";
import { getErrorMessage } from "@/lib/errors";
import { isEmailValid } from "@/utils/email";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function useRegisterForm(
  onSuccess?: ({
    name,
    email,
    password,
  }: Omit<RegisterFormData, "confirmPassword">) => Promise<void>,
) {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<RegisterFormData>>({});

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      setError(null); // Limpa erro geral
      setFieldErrors((prev) => ({
        ...prev,
        [name]: undefined, // Limpa erro do campo específico
      }));
    },
    [],
  );

  const validateForm = useCallback((): boolean => {
    const { name, email, password, confirmPassword } = formData;

    const validations = {
      name: () => {
        if (!name.trim()) return "Nome é obrigatório";
        return null;
      },
      email: () => {
        if (!email.trim()) return "E-mail é obrigatório";
        if (!isEmailValid(email)) return "E-mail inválido";
        return null;
      },
      password: () => {
        if (!password) return "Senha é obrigatória";
        if (password.length < 6)
          return "Senha deve ter pelo menos 6 caracteres";
        return null;
      },
      confirmPassword: () => {
        if (!confirmPassword) return "Confirmação de senha é obrigatória";
        if (password !== confirmPassword) return "As senhas não coincidem";
        return null;
      },
    };

    const newFieldErrors: Partial<RegisterFormData> = {};
    let hasErrors = false;

    // Executa todas as validações e coleta erros por campo
    for (const [field, validator] of Object.entries(validations)) {
      const error = validator();
      if (error) {
        newFieldErrors[field as keyof RegisterFormData] = error;
        hasErrors = true;
      }
    }

    setFieldErrors(newFieldErrors);
    return !hasErrors;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validação local (usa fieldErrors)
      if (!validateForm()) {
        return;
      }

      setIsLoading(true);
      setError(null); // Limpa erro geral
      setFieldErrors({}); // Limpa erros de campo

      try {
        await onSuccess?.({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        // Redireciona para /home após sucesso
       

        // Limpa o formulário após sucesso
        setFormData({ name: "", email: "", password: "", confirmPassword: "" });
      } catch (error) {
        // Erro da API (usa error geral)
        setError(getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    },
    [formData, onSuccess, validateForm],
  );

  const resetForm = useCallback(() => {
    setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    setError(null);
    setFieldErrors({});
  }, []);

  return useMemo(
    () => ({
      formData,
      isLoading,
      error,
      fieldErrors,
      handleInputChange,
      handleSubmit,
      resetForm,
    }),
    [
      formData,
      isLoading,
      error,
      fieldErrors,
      handleInputChange,
      handleSubmit,
      resetForm,
    ],
  );
}
