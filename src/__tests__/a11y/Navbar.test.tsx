import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithA11y, testA11y } from "./test-utils";
import { Navbar } from "@/components/Navbar";

// Mock do useAuth
const mockUseAuth = {
  user: { email: "test@example.com" },
  storagedUser: null,
  logout: vi.fn(),
  isLoading: false,
};

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => mockUseAuth,
}));

// Mock do Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
}));

// Mock do CartContext
const mockCart = {
  items: [],
  addItem: vi.fn(),
  removeItem: vi.fn(),
  updateQuantity: vi.fn(),
  clearCart: vi.fn(),
  getTotalItems: () => 0,
  getTotalPrice: () => 0,
};

vi.mock("@/contexts/CartContext", () => ({
  useCart: () => ({ cart: mockCart }),
  CartProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe("Navbar - Acessibilidade", () => {
  it("deve passar nos testes de acessibilidade", async () => {
    const { container } = renderWithA11y(<Navbar />);

    // Verifica se os elementos essenciais estão presentes
    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sair/i })).toBeInTheDocument();

    // Testa acessibilidade
    await testA11y(container);
  });

  it("deve ter navegação com role correto", () => {
    renderWithA11y(<Navbar />);

    const nav = screen.getByRole("navigation");
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveAttribute(
      "class",
      expect.stringContaining("bg-secondary"),
    );
  });

  it("deve ter botão de logout acessível", () => {
    renderWithA11y(<Navbar />);

    const logoutButton = screen.getByRole("button", { name: /sair/i });
    expect(logoutButton).toBeInTheDocument();
    expect(logoutButton).not.toBeDisabled();
  });

  it("deve mostrar estado de loading no botão quando isLoading for true", () => {
    mockUseAuth.isLoading = true;

    renderWithA11y(<Navbar />);

    const logoutButton = screen.getByRole("button", { name: /saindo/i });
    expect(logoutButton).toBeDisabled();

    // Reset para outros testes
    mockUseAuth.isLoading = false;
  });
});
