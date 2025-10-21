import { Button } from "@/components/ui/button";
import { InputWithError } from "@/components/ui/input-with-error";
import { useLoginForm } from "@/hooks/useLoginForm";

export function LoginForm() {
  const { 
    formData, 
    isLoading, 
    error, 
    fieldErrors,
    handleInputChange, 
    handleSubmit 
  } = useLoginForm();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

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
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
