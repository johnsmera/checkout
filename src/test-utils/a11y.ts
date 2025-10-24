import { axe } from "jest-axe";
import { expect } from "vitest";

/**
 * Utilitário para testar acessibilidade de componentes
 * @param container - Elemento DOM ou container do componente
 * @param options - Opções adicionais para o axe
 */
export async function checkA11y(
  container: HTMLElement,
  options?: Record<string, unknown>,
) {
  const results = await axe(container, options);
  expect(results.violations).toHaveLength(0);
  return results;
}

/**
 * Configurações padrão para testes de acessibilidade
 */
export const a11yConfig = {
  rules: {
    // Regras específicas que podem ser desabilitadas se necessário
    "color-contrast": { enabled: true },
  },
  tags: ["wcag2a", "wcag2aa", "wcag21aa"],
};
