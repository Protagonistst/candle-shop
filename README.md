# Amber & Glow

A full-stack demo storefront for a fictional candle brand, built as a portfolio project.
It covers the whole buying journey: browsing, product pages, a persistent bag, a real checkout
with server-side pricing and a test-mode payment gateway, order confirmation, order tracking
and an admin dashboard for running the shop.

> **Demo only.** Amber & Glow is not a real business. No real payments are taken and nothing ships.
> The payment gateway only accepts published test card numbers.

## Highlights

**Storefront**
- Home, shop, product detail, scent guide, about, contact, order tracking and 404 pages
- Shop filters by scent family, search across fragrance notes, sorting, URL-synced filters
- Product pages with top, heart and base notes, live stock, quantity limits and related products
- Slide-out bag with free-shipping progress, saved in `localStorage`
- Responsive from 375px phones up, keyboard accessible, respects reduced motion

**Checkout and payments**
- Four-step checkout: contact, address, delivery speed, payment
- Card number formatting and brand detection, expiry and CVC checks, inline field errors
- Promo codes (`GLOW10`, `WELCOME5`, `FREESHIP`), free shipping over $60, sales tax
- The API re-prices every order from its own catalog, so a tampered client cannot change prices
- Stock is reserved before charging and released if the payment fails
- Idempotency keys stop double charges when a request is retried or the button is double-clicked
- Realistic declines: insufficient funds, generic decline, incorrect CVC, expired card
- Full card numbers are never stored; orders keep only brand, last four digits and a transaction id

**After purchase**
- Confirmation page with a private access link and a status timeline
- Track an order with order number plus email (the email never appears in the page URL)

**Admin dashboard** (`/admin`)
- Revenue, order count, average order value, orders to fulfil, low-stock alerts
- 14-day revenue chart and top sellers
- Move orders through paid, processing, shipped and delivered; cancelling restocks and refunds
- Edit inventory, read contact messages, see newsletter subscribers, reset demo data

## Try it

| What | Value |
| --- | --- |
| Successful payment | `4242 4242 4242 4242` (Visa), `5555 5555 5555 4444` (Mastercard), `3782 822463 10005` (Amex) |
| Declined card | `4000 0000 0000 0002` |
| Insufficient funds | `4000 0000 0000 9995` |
| Incorrect CVC | `4000 0000 0000 0127` |
| Expiry and CVC | Any future date, any 3 digits (4 for Amex) |
| Promo codes | `GLOW10`, `WELCOME5`, `FREESHIP` |
| Admin passcode | `glow-admin` (change with `ADMIN_PASSCODE`) |

The checkout page also has a **Fill demo details** button and one-click test cards.

## Tech stack

- **Frontend:** React 19, TypeScript, React Router 7, Tailwind CSS 3, Framer Motion, Lucide icons, Vite 6
- **Backend:** Node.js, Express 4, Zod validation, a small JSON-file database (no native dependencies)
- **Shared:** one `shared/` folder holds types, the catalog and pricing rules used by both sides

## Getting started

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

`npm run dev` starts the API on port 8787 and the Vite dev server (usually http://localhost:5173), which
proxies `/api` to the API. Demo data is created on first run in `server/.data/db.json`, including a few
sample orders so the dashboard is not empty.

Other scripts:

| Script | What it does |
| --- | --- |
| `npm run build` | Type-checks the app, API and shared code, then builds the storefront into `dist/` |
| `npm start` | Serves the API and the built storefront from one Node process (`PORT`, default 8787) |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript project references build |

Copy `.env.example` to `.env` to change settings.

## Deploying

**One service (Render, Railway, Fly.io and similar).** Build command `npm install && npm run build`,
start command `npm start`. Point `DATA_DIR` at a persistent disk if you want orders to survive restarts.

**Vercel.** `vercel.json` serves the storefront statically and routes `/api/*` to `api/index.ts`, which
wraps the same Express app. Vercel functions have no persistent disk, so the database lives in `/tmp` and
resets to the demo seed whenever a function cold-starts. That is fine for a portfolio demo.

## Project structure

```
api/            Vercel serverless entry (wraps the Express app)
server/
  app.ts        Routes, validation, checkout flow, admin endpoints
  payments.ts   Demo payment gateway (test cards, declines, Luhn check)
  db.ts         JSON-file database with atomic writes
  seed.ts       Sample orders for the dashboard
  index.ts      Local and production server entry
shared/
  catalog.ts    Products and scent families
  pricing.ts    Shipping, tax and promo code rules
  types.ts      Types used by both client and server
src/
  components/   Navbar, cart drawer, product card, order details, UI pieces
  contexts/     Products and cart state
  pages/        One file per route
  sections/     Home page sections
public/images/  Product and lifestyle photography
```

## API

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/products` | Catalog with live stock |
| GET | `/api/products/:slug` | One product |
| POST | `/api/quote` | Price a bag (shipping, tax, promo) and report stock problems |
| POST | `/api/checkout` | Validate, reserve stock, charge, create order |
| GET | `/api/orders/:id?token=` or `?email=` | Order lookup |
| GET | `/api/payments/test-cards` | Test cards accepted by the demo gateway |
| POST | `/api/contact` | Store a contact message |
| POST | `/api/newsletter` | Subscribe an email |
| GET | `/api/admin/overview` | Dashboard data (header `x-admin-key`) |
| PATCH | `/api/admin/orders/:id` | Change order status |
| PATCH | `/api/admin/products/:id` | Change stock |
| POST | `/api/admin/reset` | Restore demo data |

## Taking real payments

`server/payments.ts` is the only place that talks to a "processor". To go live you would replace
`charge()` with a provider such as Stripe (create a PaymentIntent on the server, confirm it with
Stripe Elements on the client) and move the database to Postgres or similar. Nothing else in the
checkout flow needs to change.

## License

MIT.
