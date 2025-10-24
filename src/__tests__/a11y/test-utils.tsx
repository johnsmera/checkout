import type { RenderOptions } from "@testing-library/react";
import { render } from "@testing-library/react";
import { a11yConfig, checkA11y } from "@/test-utils/a11y";

// Mock do CartProvider
const MockCartProvider = ({ children }: { children: React.ReactNode }) => {
  return <div data-testid="cart-provider">{children}</div>;
};

/**
 * Wrapper customizado para testes de acessibilidade
 * Aplica o princípio SRP - responsabilidade única de fornecer contexto
 */
const A11yTestWrapper = ({ children }: { children: React.ReactNode }) => {
  return <MockCartProvider>{children}</MockCartProvider>;
};

/**
 * Render customizado para testes de acessibilidade
 * Aplica Clean Code - função com responsabilidade única e nome descritivo
 */
export const renderWithA11y = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: A11yTestWrapper, ...options });

/**
 * Utilitário para executar testes de acessibilidade
 * Aplica YAGNI - apenas o necessário para testes a11y
 */
export const testA11y = async (container: HTMLElement) => {
  return checkA11y(container, a11yConfig);
};

// Re-exporta utilitários necessários
export * from "@testing-library/react";
export { a11yConfig };
