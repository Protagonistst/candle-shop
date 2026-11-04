import type { Quote, ShippingMethod } from './types.js';

// Pricing rules live here so the storefront can preview totals and the API
// can recompute them authoritatively from its own product prices.

export const FREE_SHIPPING_THRESHOLD = 6000; // $60.00
export const TAX_RATE = 0.0825;

export const SHIPPING_RATES: Record<ShippingMethod, { label: string; eta: string; price: number }> = {
  standard: { label: 'Standard', eta: '4 to 6 business days', price: 595 },
  express: { label: 'Express', eta: '1 to 2 business days', price: 1495 },
};

interface PromoRule {
  label: string;
  minSubtotal?: number;
  percentOff?: number;
  amountOff?: number;
  freeShipping?: boolean;
}

export const PROMO_CODES: Record<string, PromoRule> = {
  GLOW10: { label: '10% off your order', percentOff: 10 },
  WELCOME5: { label: '$5 off orders over $40', amountOff: 500, minSubtotal: 4000 },
  FREESHIP: { label: 'Free standard shipping', freeShipping: true },
};

export type PromoResult = { ok: true; code: string; rule: PromoRule } | { ok: false; reason: string };

export function resolvePromo(rawCode: string | null | undefined, subtotal: number): PromoResult | null {
  if (!rawCode) return null;
  const code = rawCode.trim().toUpperCase();
  if (!code) return null;
  const rule = PROMO_CODES[code];
  if (!rule) return { ok: false, reason: 'That code is not valid.' };
  if (rule.minSubtotal && subtotal < rule.minSubtotal) {
    return { ok: false, reason: `This code needs a subtotal of at least ${formatMoney(rule.minSubtotal)}.` };
  }
  return { ok: true, code, rule };
}

export function computeQuote(
  lines: { unitPrice: number; quantity: number }[],
  shippingMethod: ShippingMethod,
  promoCode?: string | null,
): Quote {
  const subtotal = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
  const promo = resolvePromo(promoCode, subtotal);
  const applied = promo && promo.ok ? promo : null;

  let discount = 0;
  if (applied?.rule.percentOff) discount = Math.round((subtotal * applied.rule.percentOff) / 100);
  if (applied?.rule.amountOff) discount = Math.min(applied.rule.amountOff, subtotal);

  const discounted = subtotal - discount;
  const qualifiesFree =
    shippingMethod === 'standard' && (discounted >= FREE_SHIPPING_THRESHOLD || Boolean(applied?.rule.freeShipping));
  const shipping = subtotal === 0 ? 0 : qualifiesFree ? 0 : SHIPPING_RATES[shippingMethod].price;
  const tax = Math.round(discounted * TAX_RATE);

  return {
    subtotal,
    discount,
    shipping,
    tax,
    total: discounted + shipping + tax,
    promoCode: applied?.code ?? null,
    promoLabel: applied?.rule.label ?? null,
    freeShippingRemaining: Math.max(0, FREE_SHIPPING_THRESHOLD - discounted),
  };
}

export function formatMoney(cents: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
}
