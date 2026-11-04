import express, { type NextFunction, type Request, type Response } from 'express';
import { timingSafeEqual } from 'node:crypto';
import { z } from 'zod';
import { computeQuote, resolvePromo } from '../shared/pricing.js';
import type { Order, OrderItem, OrderStatus } from '../shared/types.js';
import { getDb, persist, resetDb } from './db.js';
import { randomId } from './ids.js';
import { charge, TEST_CARDS } from './payments.js';
import { statusNotes } from './seed.js';

const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE ?? 'glow-admin';
const PENDING = '__pending__';

// ---------- helpers ----------

class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public extra: Record<string, unknown> = {},
  ) {
    super(message);
  }
}

const asyncRoute =
  (fn: (req: Request, res: Response) => Promise<unknown>) => (req: Request, res: Response, next: NextFunction) =>
    fn(req, res).catch(next);

function parse<T extends z.ZodTypeAny>(schema: T, data: unknown): z.infer<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    const fields: Record<string, string> = {};
    for (const issue of result.error.issues) fields[issue.path.join('.')] ??= issue.message;
    throw new HttpError(400, 'Please check the highlighted fields.', { code: 'validation_error', fields });
  }
  return result.data;
}

// Tiny fixed-window rate limiter, per IP and route group.
function rateLimit(limit: number, windowMs: number) {
  const hits = new Map<string, { count: number; reset: number }>();
  return (req: Request, _res: Response, next: NextFunction) => {
    const key = req.ip ?? 'unknown';
    const now = Date.now();
    const entry = hits.get(key);
    if (!entry || entry.reset < now) {
      hits.set(key, { count: 1, reset: now + windowMs });
      return next();
    }
    entry.count += 1;
    if (entry.count > limit) return next(new HttpError(429, 'Too many requests. Please wait a moment and try again.'));
    next();
  };
}

function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  const given = Buffer.from(String(req.header('x-admin-key') ?? ''));
  const expected = Buffer.from(ADMIN_PASSCODE);
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) {
    return next(new HttpError(401, 'Incorrect admin passcode.'));
  }
  next();
}

// Public view of an order: everything except the access token.
const publicOrder = (order: Order): Omit<Order, 'accessToken'> => {
  const { accessToken, ...rest } = order;
  void accessToken;
  return rest;
};

// ---------- schemas ----------

const lineSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(20, 'Maximum 20 per item'),
});

const quoteSchema = z.object({
  items: z.array(lineSchema).min(1, 'Your bag is empty').max(30),
  shippingMethod: z.enum(['standard', 'express']).default('standard'),
  promoCode: z.string().max(32).optional().nullable(),
});

const text = (label: string, max = 120) => z.string().trim().min(1, `${label} is required`).max(max);

const checkoutSchema = quoteSchema.extend({
  idempotencyKey: z.string().min(8).max(64),
  customer: z.object({
    email: z.string().trim().email('Enter a valid email address').max(160),
    firstName: text('First name', 60),
    lastName: text('Last name', 60),
    phone: z.string().trim().max(30).optional(),
  }),
  shippingAddress: z.object({
    line1: text('Address'),
    line2: z.string().trim().max(120).optional(),
    city: text('City', 80),
    state: text('State', 40),
    postalCode: z.string().trim().regex(/^[A-Za-z0-9 -]{3,10}$/, 'Enter a valid postal code'),
    country: z.literal('US', { errorMap: () => ({ message: 'We currently ship within the US only' }) }),
  }),
  card: z.object({
    number: z.string().min(12, 'Enter your card number').max(23),
    expMonth: z.number().int(),
    expYear: z.number().int(),
    cvc: z.string().regex(/^\d{3,4}$/, 'Enter the security code'),
    name: text('Name on card', 80),
  }),
});

const contactSchema = z.object({
  name: text('Name', 80),
  email: z.string().trim().email('Enter a valid email address').max(160),
  subject: z.enum(['order', 'product', 'wholesale', 'custom', 'other'], {
    errorMap: () => ({ message: 'Choose a subject' }),
  }),
  message: z.string().trim().min(10, 'Tell us a little more (10 characters minimum)').max(2000),
});

const newsletterSchema = z.object({ email: z.string().trim().toLowerCase().email('Enter a valid email address') });

const statusSchema = z.object({ status: z.enum(['paid', 'processing', 'shipped', 'delivered', 'cancelled']) });

const stockSchema = z.object({ stock: z.number().int().min(0).max(999) });

// ---------- app ----------

export function createApp() {
  const app = express();
  app.set('trust proxy', 1);
  app.disable('x-powered-by');
  app.use(express.json({ limit: '50kb' }));

  const api = express.Router();

  api.get('/health', (_req, res) => {
    res.json({ ok: true, mode: 'demo' });
  });

  // ----- catalog -----

  api.get(
    '/products',
    asyncRoute(async (_req, res) => {
      const db = await getDb();
      res.json({ products: db.products });
    }),
  );

  api.get(
    '/products/:slug',
    asyncRoute(async (req, res) => {
      const db = await getDb();
      const product = db.products.find((p) => p.slug === req.params.slug);
      if (!product) throw new HttpError(404, 'Product not found.');
      res.json({ product });
    }),
  );

  api.get('/payments/test-cards', (_req, res) => {
    res.json({ cards: TEST_CARDS.map(({ number, brand, label }) => ({ number, brand, label })) });
  });

  // ----- pricing -----

  api.post(
    '/quote',
    asyncRoute(async (req, res) => {
      const body = parse(quoteSchema, req.body);
      const db = await getDb();
      const problems: { productId: number; message: string; available: number }[] = [];
      const lines = body.items.flatMap((line) => {
        const p = db.products.find((x) => x.id === line.productId);
        if (!p) {
          problems.push({ productId: line.productId, message: 'No longer available', available: 0 });
          return [];
        }
        if (line.quantity > p.stock) {
          problems.push({ productId: p.id, message: `Only ${p.stock} left in stock`, available: p.stock });
        }
        return [{ unitPrice: p.price, quantity: line.quantity }];
      });
      const quote = computeQuote(lines, body.shippingMethod, body.promoCode);
      const promo = resolvePromo(body.promoCode, quote.subtotal);
      res.json({ quote, promoError: promo && !promo.ok ? promo.reason : null, problems });
    }),
  );

  // ----- checkout -----

  api.post(
    '/checkout',
    rateLimit(20, 60_000),
    asyncRoute(async (req, res) => {
      const body = parse(checkoutSchema, req.body);
      const db = await getDb();

      // Same idempotency key means the client retried: return the original order.
      const existingId = db.idempotency[body.idempotencyKey];
      if (existingId === PENDING) throw new HttpError(409, 'This payment is already being processed.', { code: 'in_progress' });
      const existing = existingId && db.orders.find((o) => o.id === existingId);
      if (existing) return res.json({ order: publicOrder(existing), accessToken: existing.accessToken });

      // Merge duplicate lines and price everything from the database, never the client.
      const merged = new Map<number, number>();
      for (const l of body.items) merged.set(l.productId, (merged.get(l.productId) ?? 0) + l.quantity);

      const items: OrderItem[] = [];
      for (const [productId, quantity] of merged) {
        const p = db.products.find((x) => x.id === productId);
        if (!p) throw new HttpError(409, 'An item in your bag is no longer available.', { code: 'unavailable' });
        if (quantity > p.stock) {
          throw new HttpError(409, `Sorry, only ${p.stock} of ${p.name} left in stock.`, {
            code: 'insufficient_stock',
            productId,
            available: p.stock,
          });
        }
        items.push({ productId, slug: p.slug, name: p.name, image: p.image, unitPrice: p.price, quantity });
      }

      if (body.promoCode) {
        const promo = resolvePromo(body.promoCode, items.reduce((s, i) => s + i.unitPrice * i.quantity, 0));
        if (promo && !promo.ok) throw new HttpError(400, promo.reason, { code: 'invalid_promo' });
      }
      const quote = computeQuote(items, body.shippingMethod, body.promoCode);

      // Reserve stock before charging so two buyers cannot take the last candle.
      const adjustStock = (sign: 1 | -1) => {
        for (const item of items) db.products.find((p) => p.id === item.productId)!.stock += sign * item.quantity;
      };
      adjustStock(-1);
      db.idempotency[body.idempotencyKey] = PENDING;

      let result: Awaited<ReturnType<typeof charge>>;
      try {
        result = await charge(body.card, quote.total);
      } catch (err) {
        adjustStock(1);
        delete db.idempotency[body.idempotencyKey];
        throw err;
      }
      if (!result.ok) {
        adjustStock(1);
        delete db.idempotency[body.idempotencyKey];
        throw new HttpError(402, result.message, { code: result.code, field: result.field });
      }

      const now = new Date().toISOString();
      const order: Order = {
        id: `AG-${randomId(6)}`,
        accessToken: randomId(24),
        createdAt: now,
        status: 'paid',
        customer: { ...body.customer, email: body.customer.email.toLowerCase() },
        shippingAddress: body.shippingAddress,
        shippingMethod: body.shippingMethod,
        items,
        totals: {
          subtotal: quote.subtotal,
          discount: quote.discount,
          shipping: quote.shipping,
          tax: quote.tax,
          total: quote.total,
        },
        promoCode: quote.promoCode,
        payment: {
          provider: 'demo',
          transactionId: result.transactionId,
          brand: result.brand,
          last4: result.last4,
          status: 'captured',
        },
        timeline: [{ status: 'paid', at: now, note: statusNotes.paid }],
      };

      db.orders.unshift(order);
      db.idempotency[body.idempotencyKey] = order.id;
      await persist();
      res.status(201).json({ order: publicOrder(order), accessToken: order.accessToken });
    }),
  );

  // ----- order lookup -----

  api.get(
    '/orders/:id',
    rateLimit(60, 60_000),
    asyncRoute(async (req, res) => {
      const db = await getDb();
      const id = req.params.id.trim().toUpperCase();
      const order = db.orders.find((o) => o.id === id);
      const token = String(req.query.token ?? '');
      const email = String(req.query.email ?? '').trim().toLowerCase();
      const authorised = order && ((token && token === order.accessToken) || (email && email === order.customer.email));
      // Same response for "not found" and "wrong email" so order numbers cannot be probed.
      if (!order || !authorised) throw new HttpError(404, 'We could not find an order with those details.');
      res.json({ order: publicOrder(order) });
    }),
  );

  // ----- contact + newsletter -----

  api.post(
    '/contact',
    rateLimit(5, 60_000),
    asyncRoute(async (req, res) => {
      const body = parse(contactSchema, req.body);
      const db = await getDb();
      db.messages.unshift({ id: `msg_${randomId(10)}`, createdAt: new Date().toISOString(), ...body });
      await persist();
      res.status(201).json({ ok: true });
    }),
  );

  api.post(
    '/newsletter',
    rateLimit(5, 60_000),
    asyncRoute(async (req, res) => {
      const { email } = parse(newsletterSchema, req.body);
      const db = await getDb();
      const already = db.subscribers.some((s) => s.email === email);
      if (!already) {
        db.subscribers.unshift({ email, createdAt: new Date().toISOString() });
        await persist();
      }
      res.status(already ? 200 : 201).json({ ok: true, alreadySubscribed: already });
    }),
  );

  // ----- admin -----

  const admin = express.Router();
  admin.use(rateLimit(120, 60_000), requireAdmin);

  admin.get(
    '/overview',
    asyncRoute(async (_req, res) => {
      const db = await getDb();
      const live = db.orders.filter((o) => o.status !== 'cancelled');
      const revenue = live.reduce((s, o) => s + o.totals.total, 0);
      const unitsByProduct = new Map<number, number>();
      for (const o of live) for (const i of o.items) unitsByProduct.set(i.productId, (unitsByProduct.get(i.productId) ?? 0) + i.quantity);
      const topProducts = [...unitsByProduct.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([id, units]) => ({ id, name: db.products.find((p) => p.id === id)?.name ?? `#${id}`, units }));

      // Revenue per day for the last 14 days.
      const days: { date: string; revenue: number; orders: number }[] = [];
      for (let d = 13; d >= 0; d--) {
        const day = new Date();
        day.setHours(0, 0, 0, 0);
        day.setDate(day.getDate() - d);
        const key = day.toISOString().slice(0, 10);
        const dayOrders = live.filter((o) => {
          const c = new Date(o.createdAt);
          c.setHours(0, 0, 0, 0);
          return c.getTime() === day.getTime();
        });
        days.push({ date: key, revenue: dayOrders.reduce((s, o) => s + o.totals.total, 0), orders: dayOrders.length });
      }

      res.json({
        stats: {
          revenue,
          orders: live.length,
          averageOrder: live.length ? Math.round(revenue / live.length) : 0,
          toFulfil: db.orders.filter((o) => o.status === 'paid' || o.status === 'processing').length,
          subscribers: db.subscribers.length,
          messages: db.messages.length,
          lowStock: db.products.filter((p) => p.stock < 10).length,
        },
        days,
        topProducts,
        orders: db.orders.map(publicOrder),
        messages: db.messages,
        subscribers: db.subscribers,
        products: db.products,
      });
    }),
  );

  admin.patch(
    '/orders/:id',
    asyncRoute(async (req, res) => {
      const { status } = parse(statusSchema, req.body);
      const db = await getDb();
      const order = db.orders.find((o) => o.id === req.params.id);
      if (!order) throw new HttpError(404, 'Order not found.');
      if (order.status === 'cancelled') throw new HttpError(409, 'Cancelled orders cannot be changed.');
      if (order.status === status) return res.json({ order: publicOrder(order) });

      if (status === 'cancelled') {
        // Restock and refund.
        for (const item of order.items) {
          const p = db.products.find((x) => x.id === item.productId);
          if (p) p.stock += item.quantity;
        }
        order.payment.status = 'refunded';
      }
      order.status = status as OrderStatus;
      order.timeline.push({ status, at: new Date().toISOString(), note: statusNotes[status] });
      await persist();
      res.json({ order: publicOrder(order) });
    }),
  );

  admin.patch(
    '/products/:id',
    asyncRoute(async (req, res) => {
      const { stock } = parse(stockSchema, req.body);
      const db = await getDb();
      const product = db.products.find((p) => p.id === Number(req.params.id));
      if (!product) throw new HttpError(404, 'Product not found.');
      product.stock = stock;
      await persist();
      res.json({ product });
    }),
  );

  admin.post(
    '/reset',
    asyncRoute(async (_req, res) => {
      await resetDb();
      res.json({ ok: true });
    }),
  );

  api.use('/admin', admin);

  api.use((_req, _res, next) => next(new HttpError(404, 'Not found.')));

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  api.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof HttpError) return res.status(err.status).json({ error: err.message, ...err.extra });
    if (err instanceof SyntaxError) return res.status(400).json({ error: 'Malformed JSON body.' });
    console.error(err);
    res.status(500).json({ error: 'Something went wrong on our side. Please try again.' });
  });

  app.use('/api', api);
  return app;
}
