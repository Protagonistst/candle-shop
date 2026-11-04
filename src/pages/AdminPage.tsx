import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ChevronDown,
  DollarSign,
  Inbox,
  LogOut,
  Mail,
  Package,
  RefreshCw,
  RotateCcw,
  ShoppingBag,
  Users,
} from 'lucide-react';
import type { ContactMessage, OrderStatus, Product, Subscriber } from '../../shared/types';
import { formatMoney } from '../../shared/pricing';
import OrderDetails, { statusLabel, type PublicOrder } from '../components/OrderDetails';
import { LogoMark } from '../components/Icons';
import { Spinner } from '../components/ui';
import { useProducts } from '../contexts/ProductsContext';
import { ApiRequestError, api, errorMessage } from '../lib/api';
import { useDocumentTitle } from '../lib/useDocumentTitle';

interface Overview {
  stats: {
    revenue: number;
    orders: number;
    averageOrder: number;
    toFulfil: number;
    subscribers: number;
    messages: number;
    lowStock: number;
  };
  days: { date: string; revenue: number; orders: number }[];
  topProducts: { id: number; name: string; units: number }[];
  orders: PublicOrder[];
  messages: ContactMessage[];
  subscribers: Subscriber[];
  products: Product[];
}

const KEY_STORAGE = 'amber_glow_admin_key';
const tabs = ['Orders', 'Inventory', 'Messages', 'Subscribers'] as const;
type Tab = (typeof tabs)[number];

const statusTone: Record<OrderStatus, string> = {
  paid: 'bg-honey/15 text-[#8a5a12]',
  processing: 'bg-ember-light text-ember',
  shipped: 'bg-sky-100 text-sky-800',
  delivered: 'bg-moss/15 text-moss',
  cancelled: 'bg-red-100 text-red-800',
};

const readKey = () => {
  try {
    return sessionStorage.getItem(KEY_STORAGE) ?? '';
  } catch {
    return '';
  }
};

const AdminPage = () => {
  useDocumentTitle('Store admin');
  const [key, setKey] = useState(readKey);
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('Orders');
  const [expanded, setExpanded] = useState<string | null>(null);
  const { reload: reloadCatalog } = useProducts();

  const load = useCallback(
    async (k = key) => {
      if (!k) return;
      setLoading(true);
      setError(null);
      try {
        const d = await api<Overview>('/admin/overview', { headers: { 'x-admin-key': k } });
        setData(d);
        try {
          sessionStorage.setItem(KEY_STORAGE, k);
        } catch {
          /* ignore */
        }
      } catch (err) {
        if (err instanceof ApiRequestError && err.status === 401) {
          setKey('');
          setData(null);
        }
        setError(errorMessage(err));
      } finally {
        setLoading(false);
      }
    },
    [key],
  );

  useEffect(() => {
    if (key && !data) load(key);
  }, [key, data, load]);

  const call = async (path: string, method: string, body?: unknown) => {
    try {
      await api(path, { method, body, headers: { 'x-admin-key': key } });
      await load();
      reloadCatalog();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const logout = () => {
    try {
      sessionStorage.removeItem(KEY_STORAGE);
    } catch {
      /* ignore */
    }
    setKey('');
    setData(null);
  };

  if (!key || !data) {
    return <Login loading={loading} error={error} onSubmit={(k) => { setKey(k); load(k); }} />;
  }

  const { stats } = data;
  const maxDay = Math.max(...data.days.map((d) => d.revenue), 1);

  return (
    <div className="container-custom pb-24 pt-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Store admin</p>
          <h1 className="mt-1 text-4xl font-light">Dashboard</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => load()} className="btn-outline py-2" disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
          <button
            onClick={() => {
              if (confirm('Reset all demo data? Orders, messages and stock go back to the starting state.')) call('/admin/reset', 'POST');
            }}
            className="btn-outline py-2"
          >
            <RotateCcw className="h-4 w-4" /> Reset demo data
          </button>
          <button onClick={logout} className="btn-outline py-2">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </div>

      {error && <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat Icon={DollarSign} label="Revenue" value={formatMoney(stats.revenue)} />
        <Stat Icon={ShoppingBag} label="Orders" value={String(stats.orders)} sub={`${formatMoney(stats.averageOrder)} average`} />
        <Stat Icon={Package} label="To fulfil" value={String(stats.toFulfil)} sub="Paid or processing" />
        <Stat Icon={AlertTriangle} label="Low stock" value={String(stats.lowStock)} sub="Under 10 units" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-normal">Revenue, last 14 days</h2>
            <span className="text-xs text-smoke">{data.days.reduce((s, d) => s + d.orders, 0)} orders</span>
          </div>
          <div className="mt-6 flex h-44 items-end gap-1.5" role="img" aria-label="Bar chart of daily revenue">
            {data.days.map((d) => (
              <div key={d.date} className="group relative flex h-full flex-1 flex-col justify-end">
                <div
                  className="rounded-t-md bg-ember/80 transition-colors group-hover:bg-ember"
                  style={{ height: `${Math.max(2, (d.revenue / maxDay) * 100)}%`, opacity: d.revenue ? 1 : 0.25 }}
                />
                <span className="pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-espresso px-2 py-1 text-[11px] text-cream group-hover:block">
                  {formatMoney(d.revenue)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-smoke">
            <span>{new Date(data.days[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            <span>Today</span>
          </div>
        </div>
        <div className="card p-6">
          <h2 className="text-xl font-normal">Top sellers</h2>
          <ol className="mt-5 space-y-3">
            {data.topProducts.map((p, i) => (
              <li key={p.id} className="flex items-center gap-3 text-sm">
                <span className="w-4 text-smoke">{i + 1}</span>
                <span className="flex-1">{p.name}</span>
                <span className="tabular-nums text-smoke">{p.units} sold</span>
              </li>
            ))}
          </ol>
          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-sand pt-5 text-sm">
            <p className="flex items-center gap-2"><Users className="h-4 w-4 text-ember" /> {stats.subscribers} subscribers</p>
            <p className="flex items-center gap-2"><Inbox className="h-4 w-4 text-ember" /> {stats.messages} messages</p>
          </div>
        </div>
      </div>

      <div className="mt-10 flex gap-1 overflow-x-auto border-b border-sand no-scrollbar" role="tablist">
        {tabs.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              tab === t ? 'border-ember text-espresso' : 'border-transparent text-smoke hover:text-espresso'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === 'Orders' && (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-parchment/70 text-xs uppercase tracking-wider text-smoke">
                  <tr>
                    <th className="px-5 py-3 font-medium">Order</th>
                    <th className="px-5 py-3 font-medium">Customer</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                    <th className="px-5 py-3 font-medium">Total</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand/70">
                  {data.orders.map((o) => (
                    <OrderRow
                      key={o.id}
                      order={o}
                      open={expanded === o.id}
                      onToggle={() => setExpanded(expanded === o.id ? null : o.id)}
                      onStatus={(status) => {
                        if (status === 'cancelled' && !confirm(`Cancel ${o.id}? Stock is restored and the payment refunded.`)) return;
                        call(`/admin/orders/${o.id}`, 'PATCH', { status });
                      }}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'Inventory' && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {data.products.map((p) => (
              <InventoryCard key={p.id} product={p} onSave={(stock) => call(`/admin/products/${p.id}`, 'PATCH', { stock })} />
            ))}
          </div>
        )}

        {tab === 'Messages' &&
          (data.messages.length === 0 ? (
            <Empty text="No messages yet. Send one from the contact page to see it here." />
          ) : (
            <div className="space-y-3">
              {data.messages.map((m) => (
                <div key={m.id} className="card p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-medium">
                      {m.name} <span className="font-normal text-smoke">&lt;{m.email}&gt;</span>
                    </p>
                    <span className="text-xs text-smoke">{new Date(m.createdAt).toLocaleString()}</span>
                  </div>
                  <span className="mt-2 inline-block rounded-full bg-parchment px-2.5 py-0.5 text-xs capitalize text-bark">{m.subject}</span>
                  <p className="mt-3 whitespace-pre-line text-sm text-bark">{m.message}</p>
                </div>
              ))}
            </div>
          ))}

        {tab === 'Subscribers' &&
          (data.subscribers.length === 0 ? (
            <Empty text="No subscribers yet. Join the newsletter from the footer to see it here." />
          ) : (
            <ul className="card divide-y divide-sand/70">
              {data.subscribers.map((s) => (
                <li key={s.email} className="flex items-center justify-between px-6 py-4 text-sm">
                  <span className="flex items-center gap-3"><Mail className="h-4 w-4 text-ember" /> {s.email}</span>
                  <span className="text-xs text-smoke">{new Date(s.createdAt).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          ))}
      </div>
    </div>
  );
};

// ---------- pieces ----------

function Login({ loading, error, onSubmit }: { loading: boolean; error: string | null; onSubmit: (k: string) => void }) {
  const [value, setValue] = useState('');
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (value) onSubmit(value);
  };
  return (
    <div className="container-custom flex min-h-[70vh] items-center justify-center py-16">
      <form onSubmit={submit} className="card w-full max-w-sm p-8 text-center">
        <LogoMark className="mx-auto h-10 w-10" />
        <h1 className="mt-4 text-3xl font-light">Store admin</h1>
        <p className="mt-2 text-sm text-smoke">Orders, inventory, messages and subscribers.</p>
        <label htmlFor="admin-key" className="sr-only">Passcode</label>
        <input
          id="admin-key"
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Passcode"
          className="field mt-6 text-center"
          autoFocus
        />
        {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
        <button className="btn-primary mt-4 w-full" disabled={loading || !value}>
          {loading ? <Spinner className="h-4 w-4" /> : 'Sign in'}
        </button>
        <p className="mt-5 rounded-xl bg-parchment px-4 py-3 text-xs text-bark">
          Demo passcode: <span className="font-mono font-semibold">glow-admin</span>
        </p>
        <Link to="/" className="mt-4 inline-block text-xs text-smoke hover:text-espresso">
          Back to the store
        </Link>
      </form>
    </div>
  );
}

function Stat({ Icon, label, value, sub }: { Icon: typeof DollarSign; label: string; value: string; sub?: string }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between text-smoke">
        <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
        <Icon className="h-4 w-4" />
      </div>
      <p className="mt-3 font-display text-3xl tabular-nums">{value}</p>
      {sub && <p className="mt-1 text-xs text-smoke">{sub}</p>}
    </div>
  );
}

function OrderRow({
  order,
  open,
  onToggle,
  onStatus,
}: {
  order: PublicOrder;
  open: boolean;
  onToggle: () => void;
  onStatus: (s: OrderStatus) => void;
}) {
  return (
    <>
      <tr className="hover:bg-parchment/30">
        <td className="px-5 py-4 font-mono">{order.id}</td>
        <td className="px-5 py-4">
          <p>{order.customer.firstName} {order.customer.lastName}</p>
          <p className="text-xs text-smoke">{order.customer.email}</p>
        </td>
        <td className="px-5 py-4 text-smoke">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
        <td className="px-5 py-4 tabular-nums">{formatMoney(order.totals.total)}</td>
        <td className="px-5 py-4">
          {order.status === 'cancelled' ? (
            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusTone.cancelled}`}>Cancelled</span>
          ) : (
            <select
              value={order.status}
              onChange={(e) => onStatus(e.target.value as OrderStatus)}
              className={`cursor-pointer rounded-full border-0 py-1 pl-3 pr-7 text-xs font-medium focus:ring-2 focus:ring-ember ${statusTone[order.status]}`}
              aria-label={`Status of ${order.id}`}
            >
              {(Object.keys(statusLabel) as OrderStatus[]).map((s) => (
                <option key={s} value={s}>{statusLabel[s]}</option>
              ))}
            </select>
          )}
        </td>
        <td className="px-5 py-4 text-right">
          <button onClick={onToggle} className="rounded-full p-1.5 hover:bg-parchment" aria-expanded={open} aria-label={`Details for ${order.id}`}>
            <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
        </td>
      </tr>
      {open && (
        <tr>
          <td colSpan={6} className="bg-cream/60 p-5">
            <OrderDetails order={order} />
          </td>
        </tr>
      )}
    </>
  );
}

function InventoryCard({ product, onSave }: { product: Product; onSave: (stock: number) => void }) {
  const [value, setValue] = useState(String(product.stock));
  useEffect(() => setValue(String(product.stock)), [product.stock]);
  const dirty = Number(value) !== product.stock;
  return (
    <div className="card flex gap-4 p-4">
      <img src={product.image} alt="" className="h-20 w-16 rounded-xl object-cover" />
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="truncate font-display text-lg leading-tight">{product.name}</p>
        <p className={`text-xs ${product.stock < 10 ? 'font-semibold text-ember' : 'text-smoke'}`}>
          {product.stock === 0 ? 'Sold out' : `${product.stock} in stock`}
        </p>
        <div className="mt-auto flex gap-2 pt-2">
          <input
            type="number"
            min={0}
            max={999}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-20 rounded-lg border border-sand px-2 py-1 text-sm"
            aria-label={`Stock for ${product.name}`}
          />
          <button
            onClick={() => onSave(Math.max(0, Math.min(999, Math.floor(Number(value) || 0))))}
            disabled={!dirty}
            className="rounded-lg bg-espresso px-3 py-1 text-xs font-medium text-cream disabled:opacity-30"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="card p-10 text-center text-sm text-smoke">{text}</p>;
}

export default AdminPage;
