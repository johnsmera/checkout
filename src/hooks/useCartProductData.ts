import { mockProducts } from "@/data/products";

export function useCartProductData() {
  const getProductData = (productId: string) => {
    const product = mockProducts.find((p) => p.id === productId);
    return product || null;
  };

  return {
    getProductData,
  };
}
