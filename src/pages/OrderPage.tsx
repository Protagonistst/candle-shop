import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Copy, CopyCheck } from 'lucide-react';
import OrderDetails, { type PublicOrder } from '../components/OrderDetails';
import { Spinner } from '../components/ui';
import { api, errorMessage } from '../lib/api';
import { useDocumentTitle } from '../lib/useDocumentTitle';

const OrderPage = () => {
  const { id = '' } = useParams();
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const [order, setOrder] = useState<PublicOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  useDocumentTitle(`Order ${id}`);

  useEffect(() => {
    const ctrl = new AbortController();
    api<{ order: PublicOrder }>(`/orders/${encodeURIComponent(id)}?token=${encodeURIComponent(token)}`, { signal: ctrl.signal })
      .then((d) => setOrder(d.order))
      .catch((e) => (e as Error).name !== 'AbortError' && setError(errorMessage(e)));
    return () => ctrl.abort();
  }, [id, token]);

  if (error) {
    return (
      <div className="container-custom flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <h1 className="text-4xl font-light">Order not found</h1>
        <p className="mt-3 max-w-md text-bark/80">{error} You can look it up with your order number and email instead.</p>
        <Link to="/track" className="btn-primary mt-6">
          Track an order
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-ember">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  const copy = () => {
    navigator.clipboard?.writeText(order.id).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="container-custom pb-24">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-2xl pb-12 pt-14 text-center"
      >
        <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}>
          <CheckCircle2 className="mx-auto h-14 w-14 text-moss" strokeWidth={1.4} />
        </motion.div>
        <h1 className="mt-5 text-balance text-4xl font-light md:text-5xl">Thank you, {order.customer.firstName}</h1>
        <p className="mt-3 text-bark/80">
          Your order is confirmed. A receipt would normally be on its way to <strong className="font-medium">{order.customer.email}</strong>.
        </p>
        <button
          onClick={copy}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-sand bg-white px-5 py-2.5 font-mono text-sm transition-colors hover:border-espresso"
          aria-label="Copy order number"
        >
          Order {order.id}
          {copied ? <CopyCheck className="h-4 w-4 text-moss" /> : <Copy className="h-4 w-4 text-smoke" />}
        </button>
        <p className="mt-2 text-xs text-smoke">Keep this number to track your order later.</p>
      </motion.div>

      <OrderDetails order={order} />

      <div className="mt-12 text-center">
        <Link to="/shop" className="btn-outline">
          Continue shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderPage;
