import { Link } from 'react-router-dom';
import { Check, CreditCard, MapPin, Package, Truck, XCircle } from 'lucide-react';
import type { Order, OrderStatus } from '../../shared/types';
import { SHIPPING_RATES, formatMoney } from '../../shared/pricing';

type PublicOrder = Omit<Order, 'accessToken'>;

const steps: { status: OrderStatus; label: string; Icon: typeof Check }[] = [
  { status: 'paid', label: 'Order placed', Icon: CreditCard },
  { status: 'processing', label: 'Being poured', Icon: Package },
  { status: 'shipped', label: 'On its way', Icon: Truck },
  { status: 'delivered', label: 'Delivered', Icon: Check },
];

// eslint-disable-next-line react-refresh/only-export-components
export const statusLabel: Record<OrderStatus, string> = {
  paid: 'Paid',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

export function StatusTracker({ order }: { order: PublicOrder }) {
  if (order.status === 'cancelled') {
    return (
      <div className="flex items-center gap-3 rounded-2xl bg-red-50 p-5 text-red-800">
        <XCircle className="h-5 w-5 shrink-0" />
        <p className="text-sm">This order was cancelled and the payment of {formatMoney(order.totals.total)} has been refunded.</p>
      </div>
    );
  }
  const current = steps.findIndex((s) => s.status === order.status);
  return (
    <ol className="grid grid-cols-4 gap-2">
      {steps.map((s, i) => {
        const done = i <= current;
        const event = order.timeline.find((t) => t.status === s.status);
        return (
          <li key={s.status} className="relative flex flex-col items-center text-center">
            {i > 0 && (
              <span className={`absolute right-1/2 top-5 h-0.5 w-full -translate-y-1/2 ${i <= current ? 'bg-ember' : 'bg-sand'}`} aria-hidden="true" />
            )}
            <span
              className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                done ? 'border-ember bg-ember text-cream' : 'border-sand bg-cream text-smoke'
              }`}
            >
              <s.Icon className="h-4 w-4" />
            </span>
            <span className={`mt-2 text-xs font-medium sm:text-sm ${done ? 'text-espresso' : 'text-smoke'}`}>{s.label}</span>
            {event && <span className="mt-0.5 hidden text-[11px] text-smoke sm:block">{fmtDate(event.at)}</span>}
          </li>
        );
      })}
    </ol>
  );
}

export default function OrderDetails({ order }: { order: PublicOrder }) {
  const a = order.shippingAddress;
  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="space-y-6 lg:col-span-3">
        <div className="card p-6 sm:p-8">
          <div className="mb-8 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-2xl font-light">Order status</h2>
            <span className="text-sm text-smoke">Placed {fmtDate(order.createdAt)}</span>
          </div>
          <StatusTracker order={order} />
          <ul className="mt-8 space-y-2 border-t border-sand pt-5 text-sm">
            {[...order.timeline].reverse().map((t) => (
              <li key={t.status + t.at} className="flex justify-between gap-4">
                <span className="text-bark">{t.note}</span>
                <span className="shrink-0 text-smoke">{fmtDate(t.at)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-6 sm:p-8">
          <h2 className="text-2xl font-light">Items</h2>
          <ul className="mt-5 divide-y divide-sand/70">
            {order.items.map((i) => (
              <li key={i.productId} className="flex items-center gap-4 py-4">
                <Link to={`/shop/${i.slug}`} className="shrink-0">
                  <img src={i.image} alt="" className="h-20 w-16 rounded-xl object-cover" />
                </Link>
                <div className="flex-1">
                  <Link to={`/shop/${i.slug}`} className="font-display text-lg hover:text-ember">
                    {i.name}
                  </Link>
                  <p className="text-sm text-smoke">
                    {i.quantity} x {formatMoney(i.unitPrice)}
                  </p>
                </div>
                <p className="tabular-nums">{formatMoney(i.unitPrice * i.quantity)}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-6 lg:col-span-2">
        <div className="card p-6 sm:p-8">
          <h2 className="text-2xl font-light">Payment</h2>
          <dl className="mt-5 space-y-2.5 text-sm">
            <Line label="Subtotal" value={formatMoney(order.totals.subtotal)} />
            {order.totals.discount > 0 && (
              <Line label={`Discount${order.promoCode ? ` (${order.promoCode})` : ''}`} value={`-${formatMoney(order.totals.discount)}`} />
            )}
            <Line label="Shipping" value={order.totals.shipping === 0 ? 'Free' : formatMoney(order.totals.shipping)} />
            <Line label="Tax" value={formatMoney(order.totals.tax)} />
            <div className="flex items-baseline justify-between border-t border-sand pt-3">
              <dt className="font-medium">Total</dt>
              <dd className="font-display text-2xl tabular-nums">{formatMoney(order.totals.total)}</dd>
            </div>
          </dl>
          <p className="mt-5 flex items-center gap-2 rounded-xl bg-parchment px-4 py-3 text-sm text-bark">
            <CreditCard className="h-4 w-4 text-ember" />
            {order.payment.brand} ending in {order.payment.last4}
            {order.payment.status === 'refunded' && <span className="ml-auto text-xs font-semibold text-red-700">Refunded</span>}
          </p>
          <p className="mt-2 font-mono text-[11px] text-smoke">Ref {order.payment.transactionId}</p>
        </div>

        <div className="card p-6 sm:p-8">
          <h2 className="text-2xl font-light">Delivery</h2>
          <div className="mt-5 flex gap-3 text-sm">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ember" />
            <address className="not-italic leading-relaxed text-bark">
              {order.customer.firstName} {order.customer.lastName}
              <br />
              {a.line1}
              {a.line2 && <>, {a.line2}</>}
              <br />
              {a.city}, {a.state} {a.postalCode}
            </address>
          </div>
          <div className="mt-4 flex gap-3 text-sm">
            <Truck className="mt-0.5 h-4 w-4 shrink-0 text-ember" />
            <p className="text-bark">
              {SHIPPING_RATES[order.shippingMethod].label} shipping, {SHIPPING_RATES[order.shippingMethod].eta}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-bark/80">{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  );
}

export type { PublicOrder };
