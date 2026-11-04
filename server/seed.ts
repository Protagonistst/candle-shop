import { computeQuote } from '../shared/pricing.js';
import type { Order, OrderStatus, Product } from '../shared/types.js';
import { randomId } from './ids.js';

// A handful of fictional orders so the admin dashboard has something to show
// on a fresh install. Every name here is made up.
const sample: {
  daysAgo: number;
  first: string;
  last: string;
  city: string;
  state: string;
  items: [number, number][];
  status: OrderStatus;
  express?: boolean;
}[] = [
  { daysAgo: 13, first: 'Maya', last: 'Holloway', city: 'Portland', state: 'OR', items: [[2, 2], [6, 1]], status: 'delivered' },
  { daysAgo: 11, first: 'Jonah', last: 'Pereira', city: 'Austin', state: 'TX', items: [[1, 1]], status: 'delivered' },
  { daysAgo: 9, first: 'Ines', last: 'Calder', city: 'Denver', state: 'CO', items: [[4, 1], [7, 1], [5, 1]], status: 'delivered', express: true },
  { daysAgo: 6, first: 'Theo', last: 'Lindqvist', city: 'Seattle', state: 'WA', items: [[3, 2]], status: 'shipped' },
  { daysAgo: 4, first: 'Priya', last: 'Ramesh', city: 'Chicago', state: 'IL', items: [[8, 1], [1, 1]], status: 'shipped' },
  { daysAgo: 2, first: 'Lena', last: 'Okafor', city: 'Brooklyn', state: 'NY', items: [[6, 3]], status: 'processing' },
  { daysAgo: 1, first: 'Sam', last: 'Whitaker', city: 'Boulder', state: 'CO', items: [[2, 1], [4, 1]], status: 'paid' },
];

const flow: OrderStatus[] = ['paid', 'processing', 'shipped', 'delivered'];
const notes: Record<OrderStatus, string> = {
  paid: 'Payment received',
  processing: 'Hand-poured and packed in our workshop',
  shipped: 'Handed to the carrier',
  delivered: 'Delivered',
  cancelled: 'Order cancelled and refunded',
};

export function buildSeedOrders(products: Product[]): Order[] {
  const now = Date.now();
  return sample.map((s, i) => {
    const created = new Date(now - s.daysAgo * 86_400_000 - i * 3_600_000);
    const items = s.items.map(([id, quantity]) => {
      const p = products.find((x) => x.id === id)!;
      return { productId: p.id, slug: p.slug, name: p.name, image: p.image, unitPrice: p.price, quantity };
    });
    const method = s.express ? 'express' : 'standard';
    const { subtotal, discount, shipping, tax, total } = computeQuote(items, method);
    const steps = flow.slice(0, flow.indexOf(s.status) + 1);
    return {
      id: `AG-${randomId(6)}`,
      accessToken: randomId(24),
      createdAt: created.toISOString(),
      status: s.status,
      customer: {
        email: `${s.first.toLowerCase()}.${s.last.toLowerCase()}@example.com`,
        firstName: s.first,
        lastName: s.last,
      },
      shippingAddress: { line1: `${100 + i * 17} Demo Street`, city: s.city, state: s.state, postalCode: '00000', country: 'US' },
      shippingMethod: method,
      items,
      totals: { subtotal, discount, shipping, tax, total },
      promoCode: null,
      payment: { provider: 'demo', transactionId: `txn_${randomId(14)}`, brand: 'Visa', last4: '4242', status: 'captured' },
      timeline: steps.map((st, k) => ({
        status: st,
        at: new Date(created.getTime() + k * 26 * 3_600_000).toISOString(),
        note: notes[st],
      })),
    } satisfies Order;
  }).reverse();
}

export { notes as statusNotes };
