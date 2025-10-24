export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
  price: number;
}

export interface UpdateCartItemRequest {
  itemId: string;
  quantity: number;
}
