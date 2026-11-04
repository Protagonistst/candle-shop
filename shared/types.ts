// Types shared by the API (server/) and the storefront (src/).
// All money values are integers in cents to avoid floating point errors.

export type ScentFamily = 'floral' | 'woody' | 'citrus' | 'spicy' | 'fresh' | 'gourmand';

export interface Product {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: number; // cents
  image: string;
  family: ScentFamily;
  notes: { top: string[]; heart: string[]; base: string[] };
  burnTime: string;
  size: string;
  rating: number;
  reviewCount: number;
  stock: number;
  isNew: boolean;
  isFeatured: boolean;
}

export type ShippingMethod = 'standard' | 'express';

export interface CartLine {
  productId: number;
  quantity: number;
}

export interface Totals {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface Quote extends Totals {
  promoCode: string | null;
  promoLabel: string | null;
  freeShippingRemaining: number;
}

export type OrderStatus = 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: number;
  slug: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  accessToken: string;
  createdAt: string;
  status: OrderStatus;
  customer: { email: string; firstName: string; lastName: string; phone?: string };
  shippingAddress: Address;
  shippingMethod: ShippingMethod;
  items: OrderItem[];
  totals: Totals;
  promoCode: string | null;
  payment: {
    provider: 'demo';
    transactionId: string;
    brand: string;
    last4: string;
    status: 'captured' | 'refunded';
  };
  timeline: { status: OrderStatus; at: string; note: string }[];
}

export interface ContactMessage {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface Subscriber {
  email: string;
  createdAt: string;
}

export interface ApiError {
  error: string;
  code?: string;
  fields?: Record<string, string>;
}
