import { useState, type FormEvent } from 'react';
import { Search } from 'lucide-react';
import OrderDetails, { statusLabel, type PublicOrder } from '../components/OrderDetails';
import { PageHeader, Spinner } from '../components/ui';
import { api, errorMessage } from '../lib/api';
import { useDocumentTitle } from '../lib/useDocumentTitle';

const TrackOrderPage = () => {
  useDocumentTitle('Track your order');
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<PublicOrder | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrder(null);
    try {
      // The email goes in the query string of an API call made from the page,
      // never into the page URL, so it does not end up in history or analytics.
      const d = await api<{ order: PublicOrder }>(
        `/orders/${encodeURIComponent(orderId.trim())}?email=${encodeURIComponent(email.trim())}`,
      );
      setOrder(d.order);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom pb-24">
      <PageHeader eyebrow="Order status" title="Track your order">
        Enter the order number from your confirmation and the email you used at checkout.
      </PageHeader>

      <form onSubmit={submit} className="card mx-auto grid max-w-2xl gap-4 p-6 sm:grid-cols-[1fr_1.4fr_auto] sm:items-end sm:p-8">
        <div>
          <label htmlFor="track-id" className="field-label">Order number</label>
          <input
            id="track-id"
            required
            value={orderId}
            onChange={(e) => setOrderId(e.target.value.toUpperCase())}
            placeholder="AG-XXXXXX"
            className="field font-mono uppercase"
          />
        </div>
        <div>
          <label htmlFor="track-email" className="field-label">Email</label>
          <input
            id="track-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="field"
            autoComplete="email"
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary h-[46px]">
          {loading ? <Spinner className="h-4 w-4" /> : <Search className="h-4 w-4" />} Find order
        </button>
      </form>

      {error && (
        <p className="mx-auto mt-6 max-w-2xl rounded-xl bg-red-50 px-4 py-3 text-center text-sm text-red-800" role="alert">
          {error}
        </p>
      )}

      {order && (
        <div className="mt-12">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-3xl font-light">
              Order <span className="font-mono text-2xl">{order.id}</span>
            </h2>
            <span className="rounded-full bg-ember-light px-3 py-1 text-sm font-medium text-ember">{statusLabel[order.status]}</span>
          </div>
          <OrderDetails order={order} />
        </div>
      )}
    </div>
  );
};

export default TrackOrderPage;
