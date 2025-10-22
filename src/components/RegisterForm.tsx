"use client";

import { Button } from "@/components/ui/button";
import { InputWithError } from "@/components/ui/input-with-error";
import { useAuth } from "@/hooks/useAuth";
import { useRegisterForm } from "@/hooks/useRegisterForm";
import { userService } from "@/lib/services";

export function RegisterForm() {
  const { signIn } = useAuth();
  
  const { 
    formData, 
    isLoading, 
    error, 
    fieldErrors,
    handleInputChange, 
    handleSubmit 
  } = useRegisterForm(async ({ name, email, password }) => {
    // Chama o serviço de registro
    await userService.register({ name, email, password });
    
    // Após registro bem-sucedido, faz login automático
    await signIn({ email, password });
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Erro geral (API/rede) */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-800">
            <strong>Erro:</strong> {error}
          </p>
        </div>
      )}

      <InputWithError
        id="name"
        name="name"
        type="text"
        label="Nome completo"
        value={formData.name}
        onChange={handleInputChange}
        placeholder="Digite seu nome completo"
        required
        disabled={isLoading}
        error={fieldErrors.name}
      />
      
      <InputWithError
        id="email"
        name="email"
        type="email"
        label="E-mail"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="Digite seu e-mail"
        required
        disabled={isLoading}
        error={fieldErrors.email}
      />
      
      <InputWithError
        id="password"
        name="password"
        type="password"
        label="Senha"
        value={formData.password}
        onChange={handleInputChange}
        placeholder="Digite sua senha"
        required
        disabled={isLoading}
        error={fieldErrors.password}
      />
      
      <InputWithError
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        label="Confirmar senha"
        value={formData.confirmPassword}
        onChange={handleInputChange}
        placeholder="Confirme sua senha"
        required
        disabled={isLoading}
        error={fieldErrors.confirmPassword}
      />
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Criando conta..." : "Criar Conta"}
      </Button>
    </form>
  );
}
