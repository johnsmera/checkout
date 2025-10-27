import type { OrderRepository } from "../interfaces/order.repository";
import type { Cart } from "@/types/cart";
import type {
  Order,
  CreateOrderRequest,
  OrderStatus,
  PaymentDetails,
} from "@/types/order";

export class InMemoryOrderRepository implements OrderRepository {
  private orders: Map<string, Order> = new Map();

  async createOrder(
    request: CreateOrderRequest,
    cart: Cart,
    userId: string,
  ): Promise<Order> {
    // Simula latência de rede
    await this.simulateLatency(500, 1000);

    const orderId = crypto.randomUUID();
    const now = new Date().toISOString();

    // Gera detalhes de pagamento baseado no método
    const paymentDetails = this.generatePaymentDetails(request);

    // Define expiração para PIX e Boleto
    const expiresAt = this.calculateExpiration(request.paymentMethod);

    const order: Order = {
      id: orderId,
      userId,
      items: [...cart.items],
      total: cart.total,
      paymentMethod: request.paymentMethod,
      paymentDetails,
      status: "pending",
      createdAt: now,
      updatedAt: now,
      expiresAt,
    };

    this.orders.set(orderId, order);
    return { ...order };
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    // Simula latência de rede
    await this.simulateLatency(200, 500);

    const order = this.orders.get(orderId);
    if (!order) {
      return null;
    }

    // Verifica se expirou
    if (this.isExpired(order)) {
      order.status = "expired";
      order.updatedAt = new Date().toISOString();
    }

    return { ...order };
  }

  async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
  ): Promise<Order> {
    // Simula latência de rede
    await this.simulateLatency(300, 800);

    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error("Pedido não encontrado");
    }

    // Não permite atualizar status de pedidos já finalizados (idempotência)
    if (
      order.status === "paid" ||
      order.status === "failed" ||
      order.status === "expired"
    ) {
      return { ...order };
    }

    order.status = status;
    order.updatedAt = new Date().toISOString();

    return { ...order };
  }

  private generatePaymentDetails(
    request: CreateOrderRequest,
  ): PaymentDetails {
    const details: PaymentDetails = {};

    switch (request.paymentMethod) {
      case "pix":
        details.pix = {
          qrCode: this.generateQRCode(),
          code: this.generatePixCode(),
        };
        break;

      case "credit_card":
        if (request.paymentData) {
          const lastDigits = request.paymentData.cardNumber.slice(-4);
          const brand = this.detectCardBrand(
            request.paymentData.cardNumber,
          );
          details.creditCard = {
            lastDigits,
            brand,
          };
        }
        break;

      case "boleto":
        details.boleto = {
          barCode: this.generateBoletoBarCode(),
          dueDate: this.generateBoletoDueDate(),
        };
        break;
    }

    return details;
  }

  private calculateExpiration(
    paymentMethod: string,
  ): string | undefined {
    const now = new Date();

    switch (paymentMethod) {
      case "pix":
        // PIX expira em 30 minutos
        now.setMinutes(now.getMinutes() + 30);
        return now.toISOString();

      case "boleto":
        // Boleto expira em 3 dias
        now.setDate(now.getDate() + 3);
        return now.toISOString();

      default:
        return undefined;
    }
  }

  private isExpired(order: Order): boolean {
    if (!order.expiresAt) {
      return false;
    }

    const now = new Date();
    const expiresAt = new Date(order.expiresAt);

    return now > expiresAt && order.status === "pending";
  }

  private generateQRCode(): string {
    // Gera uma string base64 simulada de QR Code
    return `data:image/svg+xml;base64,${btoa(
      '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="white"/><text x="100" y="100" text-anchor="middle" fill="black" font-size="12">QR Code PIX</text></svg>',
    )}`;
  }

  private generatePixCode(): string {
    // Gera um código PIX simulado
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 32; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  private generateBoletoBarCode(): string {
    // Gera um código de barras simulado (formato de boleto)
    let barCode = "";
    for (let i = 0; i < 47; i++) {
      barCode += Math.floor(Math.random() * 10);
    }
    return barCode;
  }

  private generateBoletoDueDate(): string {
    // Gera data de vencimento (3 dias a partir de hoje)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 3);
    return dueDate.toISOString();
  }

  private detectCardBrand(cardNumber: string): string {
    const cleanNumber = cardNumber.replace(/\s/g, "");
    const firstDigit = cleanNumber.charAt(0);

    if (firstDigit === "4") return "Visa";
    if (firstDigit === "5") return "Mastercard";
    if (firstDigit === "3") return "Amex";
    if (firstDigit === "6") return "Discover";

    return "Bandeira desconhecida";
  }

  private async simulateLatency(min: number, max: number): Promise<void> {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
}

