"use client";

import type { OrderRepository } from "@/repositories/interfaces/order.repository";
import type { CartRepository } from "@/repositories/interfaces/cart.repository";
import type { Order, CreateOrderRequest } from "@/types/order";
import { ApiError } from "@/lib/errors";

export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private cartRepository: CartRepository,
    private onOrderPaid?: () => Promise<void>,
  ) {}

  async createOrder(
    request: CreateOrderRequest,
    userId: string,
  ): Promise<Order> {
    // Validações
    if (!request.paymentMethod) {
      throw new ApiError("Método de pagamento é obrigatório");
    }

    // Valida dados do cartão se método for cartão de crédito
    if (request.paymentMethod === "credit_card") {
      if (!request.paymentData) {
        throw new ApiError("Dados do cartão são obrigatórios");
      }

      this.validateCreditCardData(request.paymentData);
    }

    // Busca carrinho atual
    const cart = await this.cartRepository.getCart();

    // Valida se o carrinho não está vazio
    if (cart.items.length === 0) {
      throw new ApiError("Carrinho está vazio");
    }

    // Simula latência
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Cria o pedido (NÃO limpa o carrinho ainda)
    const order = await this.orderRepository.createOrder(
      request,
      cart,
      userId,
    );

    return order;
  }

  async processPayment(orderId: string): Promise<Order> {
    // Processamento direto sem estados intermediários
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simula falha aleatória (20% de chance)
    const shouldFail = Math.random() < 0.2;

    if (shouldFail) {
      return await this.orderRepository.updateOrderStatus(orderId, "failed");
    }

    // Sucesso direto
    const paidOrder = await this.orderRepository.updateOrderStatus(orderId, "paid");
    
    // Callback para limpar carrinho (inversão de dependência)
    if (this.onOrderPaid) {
      await this.onOrderPaid();
    }
    
    return paidOrder;
  }

  async checkOrderStatus(orderId: string): Promise<Order> {
    const order = await this.orderRepository.getOrderById(orderId);

    if (!order) {
      throw new ApiError("Pedido não encontrado");
    }

    return order;
  }

  private validateCreditCardData(cardData: {
    cardNumber: string;
    cardName: string;
    expiryDate: string;
    cvv: string;
  }): void {
    if (!cardData.cardNumber || cardData.cardNumber.replace(/\s/g, "").length < 13) {
      throw new ApiError("Número do cartão inválido");
    }

    if (!cardData.cardName || cardData.cardName.trim().length < 3) {
      throw new ApiError("Nome no cartão inválido");
    }

    if (!cardData.expiryDate || !/^\d{2}\/\d{2}$/.test(cardData.expiryDate)) {
      throw new ApiError("Data de validade inválida");
    }

    // Valida se não está expirado
    const [month, year] = cardData.expiryDate.split("/").map(Number);
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      throw new ApiError("Cartão expirado");
    }

    if (!cardData.cvv || cardData.cvv.length < 3) {
      throw new ApiError("CVV inválido");
    }
  }
}

export function createOrderService(
  orderRepository: OrderRepository,
  cartRepository: CartRepository,
  onOrderPaid?: () => Promise<void>,
): OrderService {
  return new OrderService(orderRepository, cartRepository, onOrderPaid);
}

