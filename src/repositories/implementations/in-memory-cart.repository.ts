import type { CartRepository } from '../interfaces/cart.repository';
import type { Cart, CartItem, AddToCartRequest, UpdateCartItemRequest } from '@/types/cart';

export class InMemoryCartRepository implements CartRepository {
  private cart: Cart = {
    items: [],
    total: 0
  };

  async getCart(): Promise<Cart> {
    return { ...this.cart };
  }

  async addItem(request: AddToCartRequest): Promise<CartItem> {
    const existingItem = this.cart.items.find(
      item => item.productId === request.productId
    );

    if (existingItem) {
      existingItem.quantity += request.quantity;
    } else {
      const newItem: CartItem = {
        id: crypto.randomUUID(),
        productId: request.productId,
        quantity: request.quantity,
        price: request.price
      };
      this.cart.items.push(newItem);
    }

    this.calculateTotal();
    return existingItem || this.cart.items[this.cart.items.length - 1];
  }

  async updateItem(request: UpdateCartItemRequest): Promise<CartItem> {
    const item = this.cart.items.find(item => item.id === request.itemId);
    
    if (!item) {
      throw new Error('Item não encontrado no carrinho');
    }

    item.quantity = request.quantity;
    this.calculateTotal();
    return item;
  }

  async removeItem(itemId: string): Promise<void> {
    this.cart.items = this.cart.items.filter(item => item.id !== itemId);
    this.calculateTotal();
  }

  async clearCart(): Promise<void> {
    this.cart = {
      items: [],
      total: 0
    };
  }

  private calculateTotal(): void {
    this.cart.total = this.cart.items.reduce(
      (total, item) => total + (item.price * item.quantity),
      0
    );
  }
}
