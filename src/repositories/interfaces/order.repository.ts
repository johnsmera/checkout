import type { Cart } from "@/types/cart";
import type {
  Order,
  CreateOrderRequest,
  OrderStatus,
} from "@/types/order";

export interface OrderRepository {
  createOrder(
    request: CreateOrderRequest,
    cart: Cart,
    userId: string,
  ): Promise<Order>;
  getOrderById(orderId: string): Promise<Order | null>;
  updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order>;
}

