import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithA11y, testA11y } from "./test-utils";
import { LoginForm } from "@/components/LoginForm";

// Mock do useAuth
const mockSignIn = vi.fn();
vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    signIn: mockSignIn,
  }),
}));

// Mock do useLoginForm
const mockUseLoginForm = {
  formData: { email: "", password: "" },
  isLoading: false,
  error: null as string | null,
  fieldErrors: {},
  handleInputChange: vi.fn(),
  handleSubmit: vi.fn(),
};

vi.mock("@/hooks/useLoginForm", () => ({
  useLoginForm: () => mockUseLoginForm,
}));

describe("LoginForm - Acessibilidade", () => {
  it("deve passar nos testes de acessibilidade", async () => {
    const { container } = renderWithA11y(<LoginForm />);

    // Verifica elementos essenciais
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();

    // Testa acessibilidade
    await testA11y(container);
  });

  it("deve ter campos de input com labels apropriados", () => {
    renderWithA11y(<LoginForm />);

    const emailInput = screen.getByLabelText(/e-mail/i);
    const passwordInput = screen.getByLabelText(/senha/i);

    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute("type", "email");
    expect(emailInput).toHaveAttribute("required");

    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(passwordInput).toHaveAttribute("required");
  });

  it("deve ter botão de submit acessível", () => {
    renderWithA11y(<LoginForm />);

    const submitButton = screen.getByRole("button", { name: /entrar/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute("type", "submit");
    expect(submitButton).not.toBeDisabled();
  });

  it("deve mostrar estado de loading no botão quando isLoading for true", () => {
    mockUseLoginForm.isLoading = true;

    renderWithA11y(<LoginForm />);

    const submitButton = screen.getByRole("button", { name: /entrando/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    // Reset para outros testes
    mockUseLoginForm.isLoading = false;
  });

  it("deve mostrar mensagem de erro quando houver erro", () => {
    mockUseLoginForm.error = "Credenciais inválidas";

    renderWithA11y(<LoginForm />);

    const errorMessage = screen.getByText("Credenciais inválidas");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass("text-red-800");

    // Reset para outros testes
    mockUseLoginForm.error = null;
  });

  it("deve ter estrutura semântica correta com form", () => {
    renderWithA11y(<LoginForm />);

    // Verifica se o form está presente através do elemento form
    const formElement = document.querySelector("form");
    expect(formElement).toBeInTheDocument();
    expect(formElement).toHaveAttribute(
      "class",
      expect.stringContaining("space-y-4"),
    );
  });
});
