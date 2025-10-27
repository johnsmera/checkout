import type { CartItem } from "./cart";

export type OrderStatus =
  | "pending"
  | "processing"
  | "paid"
  | "failed"
  | "expired";

export type PaymentMethod = "pix" | "credit_card" | "boleto";

export interface PaymentDetails {
  pix?: {
    qrCode: string;
    code: string;
  };
  creditCard?: {
    lastDigits: string;
    brand: string;
  };
  boleto?: {
    barCode: string;
    dueDate: string;
  };
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  paymentMethod: PaymentMethod;
  paymentDetails: PaymentDetails;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
}

export interface CreditCardData {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

export interface CreateOrderRequest {
  paymentMethod: PaymentMethod;
  paymentData: CreditCardData | null;
}

