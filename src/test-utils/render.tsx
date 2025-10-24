import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";
import { vi } from "vitest";
import { CartProvider } from "@/contexts/CartContext";

// Mock do Next.js router
const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
};

// Mock do useRouter
vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock do Next.js Image
vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    ...props
  }: {
    src: string;
    alt: string;
    [key: string]: unknown;
  }) => {
    // biome-ignore lint/performance/noImgElement: <explanation>
    return <img src={src} alt={alt} {...props} />;
  },
}));

// Mock repository para CartProvider
const mockCartRepository = {
  getCart: vi.fn().mockResolvedValue({ items: [], total: 0 }),
  addItem: vi.fn().mockResolvedValue(undefined),
  updateItem: vi.fn().mockResolvedValue(undefined),
  removeItem: vi.fn().mockResolvedValue(undefined),
  clearCart: vi.fn().mockResolvedValue(undefined),
};

// Wrapper customizado que inclui os providers necessários
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <CartProvider repository={mockCartRepository}>{children}</CartProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-exporta tudo
export * from "@testing-library/react";
export { customRender as render };
