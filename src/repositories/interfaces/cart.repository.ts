import type { Cart, CartItem, AddToCartRequest, UpdateCartItemRequest } from '@/types/cart';

export interface CartRepository {
  getCart(): Promise<Cart>;
  addItem(request: AddToCartRequest): Promise<CartItem>;
  updateItem(request: UpdateCartItemRequest): Promise<CartItem>;
  removeItem(itemId: string): Promise<void>;
  clearCart(): Promise<void>;
}
