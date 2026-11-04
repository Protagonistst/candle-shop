import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, CreditCard, Lock, ShieldCheck, Sparkles, Tag, X } from 'lucide-react';
import type { Order, ShippingMethod } from '../../shared/types';
import { SHIPPING_RATES, computeQuote, formatMoney, resolvePromo } from '../../shared/pricing';
import { LogoMark } from '../components/Icons';
import { Spinner } from '../components/ui';
import { useCart } from '../contexts/CartContext';
import { useProducts } from '../contexts/ProductsContext';
import { ApiRequestError, api, errorMessage } from '../lib/api';
import { useDocumentTitle } from '../lib/useDocumentTitle';

// ---------- card helpers ----------

const digits = (s: string) => s.replace(/\D/g, '');
const isAmex = (n: string) => /^3[47]/.test(n);

function cardBrand(n: string) {
  if (/^4/.test(n)) return 'Visa';
  if (/^(5[1-5]|2[2-7])/.test(n)) return 'Mastercard';
  if (isAmex(n)) return 'Amex';
  return null;
}

function formatCardNumber(raw: string) {
  const n = digits(raw).slice(0, isAmex(digits(raw)) ? 15 : 16);
  if (isAmex(n)) return [n.slice(0, 4), n.slice(4, 10), n.slice(10)].filter(Boolean).join(' ');
  return n.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(raw: string, prev: string) {
  const n = digits(raw).slice(0, 4);
  if (raw.length < prev.length) return raw; // allow deleting through the slash
  if (n.length >= 3) return `${n.slice(0, 2)} / ${n.slice(2)}`;
  if (n.length === 2) return `${n} / `;
  return n;
}

// ---------- form state ----------

const initial = {
  email: '',
  firstName: '',
  lastName: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
  cardNumber: '',
  expiry: '',
  cvc: '',
  cardName: '',
};
type FormState = typeof initial;
type Field = keyof FormState;

const demoDetails: FormState = {
  email: 'alex.rivera@example.com',
  firstName: 'Alex',
  lastName: 'Rivera',
  phone: '(555) 010-2299',
  line1: '742 Evergreen Terrace',
  line2: 'Apt 3',
  city: 'Portland',
  state: 'OR',
  postalCode: '97205',
  cardNumber: '4242 4242 4242 4242',
  expiry: '12 / 30',
  cvc: '123',
  cardName: 'Alex Rivera',
};

// Maps API field paths (e.g. "shippingAddress.city") onto form fields.
const serverFieldMap: Record<string, Field> = {
  'customer.email': 'email',
  'customer.firstName': 'firstName',
  'customer.lastName': 'lastName',
  'customer.phone': 'phone',
  'shippingAddress.line1': 'line1',
  'shippingAddress.city': 'city',
  'shippingAddress.state': 'state',
  'shippingAddress.postalCode': 'postalCode',
  'card.number': 'cardNumber',
  'card.cvc': 'cvc',
  'card.name': 'cardName',
  number: 'cardNumber',
  expiry: 'expiry',
  cvc: 'cvc',
};

function validate(f: FormState): Partial<Record<Field, string>> {
  const e: Partial<Record<Field, string>> = {};
  if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) e.email = 'Enter a valid email address';
  if (!f.firstName.trim()) e.firstName = 'Required';
  if (!f.lastName.trim()) e.lastName = 'Required';
  if (!f.line1.trim()) e.line1 = 'Enter your street address';
  if (!f.city.trim()) e.city = 'Required';
  if (!f.state.trim()) e.state = 'Required';
  if (!/^[A-Za-z0-9 -]{3,10}$/.test(f.postalCode.trim())) e.postalCode = 'Enter a valid ZIP code';
  const num = digits(f.cardNumber);
  if (num.length < 13) e.cardNumber = 'Enter your card number';
  const [mm, yy] = f.expiry.split('/').map((s) => Number(digits(s)));
  if (!mm || mm > 12 || !yy) e.expiry = 'Use MM / YY';
  if (!/^\d{3,4}$/.test(f.cvc)) e.cvc = 'Enter the security code';
  if (!f.cardName.trim()) e.cardName = 'Required';
  return e;
}

// ---------- page ----------

const CheckoutPage = () => {
  useDocumentTitle('Checkout');
  const navigate = useNavigate();
  const { lines, clearCart } = useCart();
  const { loading: productsLoading, reload } = useProducts();
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('standard');
  const [promoInput, setPromoInput] = useState('');
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [testCards, setTestCards] = useState<{ number: string; brand: string; label: string }[]>([]);
  const idempotencyKey = useRef(crypto.randomUUID());
  const completed = useRef(false);

  useEffect(() => {
    api<{ cards: typeof testCards }>('/payments/test-cards')
      .then((d) => setTestCards(d.cards))
      .catch(() => undefined);
  }, []);

  const quote = useMemo(
    () => computeQuote(lines.map((l) => ({ unitPrice: l.product.price, quantity: l.quantity })), shippingMethod, promoCode),
    [lines, shippingMethod, promoCode],
  );

  // A promo can become invalid if the bag shrinks below its minimum.
  useEffect(() => {
    if (promoCode && quote.promoCode === null) {
      const r = resolvePromo(promoCode, quote.subtotal);
      setPromoError(r && !r.ok ? r.reason : 'Code removed');
      setPromoCode(null);
    }
  }, [promoCode, quote.promoCode, quote.subtotal]);

  const set = (field: Field, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
    if (field === 'cardNumber' || field === 'expiry' || field === 'cvc') setPaymentError(null);
  };

  const applyPromo = () => {
    const r = resolvePromo(promoInput, quote.subtotal);
    if (!r) return;
    if (!r.ok) {
      setPromoError(r.reason);
      return;
    }
    setPromoCode(r.code);
    setPromoError(null);
    setPromoInput('');
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setPaymentError(null);
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0];
      document.getElementById(`co-${first}`)?.focus();
      return;
    }

    const [mm, yy] = form.expiry.split('/').map((s) => Number(digits(s)));
    setSubmitting(true);
    try {
      const res = await api<{ order: Order; accessToken: string }>('/checkout', {
        body: {
          idempotencyKey: idempotencyKey.current,
          items: lines.map((l) => ({ productId: l.productId, quantity: l.quantity })),
          shippingMethod,
          promoCode,
          customer: {
            email: form.email.trim(),
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            phone: form.phone.trim() || undefined,
          },
          shippingAddress: {
            line1: form.line1.trim(),
            line2: form.line2.trim() || undefined,
            city: form.city.trim(),
            state: form.state.trim(),
            postalCode: form.postalCode.trim(),
            country: 'US',
          },
          card: { number: digits(form.cardNumber), expMonth: mm, expYear: yy, cvc: form.cvc, name: form.cardName.trim() },
        },
      });
      completed.current = true;
      clearCart();
      reload(); // stock changed
      navigate(`/order/${res.order.id}?token=${res.accessToken}`, { replace: true });
    } catch (err) {
      setSubmitting(false);
      if (err instanceof ApiRequestError) {
        const { fields, field } = err.data as { fields?: Record<string, string>; field?: string };
        const mapped: Partial<Record<Field, string>> = {};
        for (const [k, v] of Object.entries(fields ?? {})) if (serverFieldMap[k]) mapped[serverFieldMap[k]] = v;
        if (field && serverFieldMap[field]) mapped[serverFieldMap[field]] = err.message;
        setErrors(mapped);
        if (err.data.code === 'insufficient_stock' || err.data.code === 'unavailable') reload();
      }
      setPaymentError(errorMessage(err));
    }
  };

  if (lines.length === 0 && !completed.current) {
    return (
      <div className="container-custom flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        {productsLoading ? (
          <Spinner className="h-8 w-8 text-ember" />
        ) : (
          <>
            <h1 className="text-4xl font-light">Your bag is empty</h1>
            <p className="mt-3 text-bark/80">Add a candle or two before checking out.</p>
            <Link to="/shop" className="btn-primary mt-6">
              Browse the collection
            </Link>
          </>
        )}
      </div>
    );
  }

  const brand = cardBrand(digits(form.cardNumber));

  return (
    <div className="pb-24">
      <div className="container-custom flex items-center justify-between pt-6">
        <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-smoke hover:text-espresso">
          <ChevronLeft className="h-4 w-4" /> Keep shopping
        </Link>
        <p className="flex items-center gap-1.5 text-xs text-smoke">
          <Lock className="h-3.5 w-3.5" /> Secure checkout
        </p>
      </div>

      <form onSubmit={submit} noValidate className="container-custom mt-6 grid gap-10 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-4xl font-light">Checkout</h1>
            <button
              type="button"
              onClick={() => {
                setForm(demoDetails);
                setErrors({});
                setPaymentError(null);
              }}
              className="inline-flex items-center gap-1.5 rounded-full bg-ember-light px-4 py-2 text-xs font-semibold text-ember transition-colors hover:bg-ember hover:text-cream"
            >
              <Sparkles className="h-3.5 w-3.5" /> Fill demo details
            </button>
          </div>

          <Section title="Contact" step={1}>
            <Input id="email" label="Email" type="email" autoComplete="email" form={form} errors={errors} set={set} />
            <p className="-mt-2 text-xs text-smoke">We will send your receipt and tracking updates here.</p>
          </Section>

          <Section title="Shipping address" step={2}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input id="firstName" label="First name" autoComplete="given-name" form={form} errors={errors} set={set} />
              <Input id="lastName" label="Last name" autoComplete="family-name" form={form} errors={errors} set={set} />
            </div>
            <Input id="line1" label="Street address" autoComplete="address-line1" form={form} errors={errors} set={set} />
            <Input id="line2" label="Apartment, suite (optional)" autoComplete="address-line2" form={form} errors={errors} set={set} />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="col-span-2 sm:col-span-1">
                <Input id="city" label="City" autoComplete="address-level2" form={form} errors={errors} set={set} />
              </div>
              <Input id="state" label="State" autoComplete="address-level1" form={form} errors={errors} set={set} />
              <Input id="postalCode" label="ZIP code" autoComplete="postal-code" inputMode="numeric" form={form} errors={errors} set={set} />
            </div>
            <Input id="phone" label="Phone (optional)" type="tel" autoComplete="tel" form={form} errors={errors} set={set} />
            <p className="text-xs text-smoke">Shipping within the United States only.</p>
          </Section>

          <Section title="Delivery" step={3}>
            <div className="grid gap-3 sm:grid-cols-2">
              {(Object.keys(SHIPPING_RATES) as ShippingMethod[]).map((m) => {
                const rate = SHIPPING_RATES[m];
                const price = computeQuote(
                  lines.map((l) => ({ unitPrice: l.product.price, quantity: l.quantity })),
                  m,
                  promoCode,
                ).shipping;
                return (
                  <label
                    key={m}
                    className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors ${
                      shippingMethod === m ? 'border-espresso bg-white' : 'border-sand bg-white/50 hover:border-espresso/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="shipping"
                      value={m}
                      checked={shippingMethod === m}
                      onChange={() => setShippingMethod(m)}
                      className="mt-1 accent-ember"
                    />
                    <span className="flex-1">
                      <span className="flex justify-between font-medium">
                        {rate.label}
                        <span className="tabular-nums">{price === 0 ? 'Free' : formatMoney(price)}</span>
                      </span>
                      <span className="text-sm text-smoke">{rate.eta}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </Section>

          <Section title="Payment" step={4}>
            <div className="rounded-2xl border border-honey/50 bg-honey/10 p-4 text-sm">
              <p className="flex items-center gap-2 font-medium text-bark">
                <ShieldCheck className="h-4 w-4 text-ember" /> Demo payments: no real card is charged
              </p>
              <p className="mt-1 text-bark/80">Use one of these test cards with any future expiry date and any CVC.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {testCards.map((c) => (
                  <button
                    key={c.number}
                    type="button"
                    onClick={() => {
                      set('cardNumber', formatCardNumber(c.number));
                      if (!form.expiry) set('expiry', '12 / 30');
                      set('cvc', c.brand === 'American Express' ? '1234' : '123');
                    }}
                    className="rounded-lg border border-sand bg-white px-2.5 py-1.5 text-left text-xs transition-colors hover:border-ember"
                    title={`Fill ${c.brand} test card`}
                  >
                    <span className="block font-mono">{formatCardNumber(c.number)}</span>
                    <span className={c.label.includes('succeeds') ? 'text-moss' : 'text-red-700'}>{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="co-cardNumber" className="field-label">Card number</label>
              <div className="relative">
                <input
                  id="co-cardNumber"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="1234 1234 1234 1234"
                  value={form.cardNumber}
                  onChange={(e) => set('cardNumber', formatCardNumber(e.target.value))}
                  className={`field pr-28 font-mono tracking-wide ${errors.cardNumber ? 'field-error' : ''}`}
                  aria-invalid={Boolean(errors.cardNumber)}
                />
                <span className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1.5 text-xs font-semibold text-smoke">
                  {brand ?? <CreditCard className="h-5 w-5" />}
                </span>
              </div>
              {errors.cardNumber && <p className="mt-1 text-xs text-red-700">{errors.cardNumber}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="co-expiry" className="field-label">Expiry</label>
                <input
                  id="co-expiry"
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  placeholder="MM / YY"
                  value={form.expiry}
                  onChange={(e) => set('expiry', formatExpiry(e.target.value, form.expiry))}
                  className={`field font-mono ${errors.expiry ? 'field-error' : ''}`}
                  aria-invalid={Boolean(errors.expiry)}
                />
                {errors.expiry && <p className="mt-1 text-xs text-red-700">{errors.expiry}</p>}
              </div>
              <div>
                <label htmlFor="co-cvc" className="field-label">Security code</label>
                <input
                  id="co-cvc"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  placeholder={isAmex(digits(form.cardNumber)) ? '4 digits' : '3 digits'}
                  value={form.cvc}
                  onChange={(e) => set('cvc', digits(e.target.value).slice(0, 4))}
                  className={`field font-mono ${errors.cvc ? 'field-error' : ''}`}
                  aria-invalid={Boolean(errors.cvc)}
                />
                {errors.cvc && <p className="mt-1 text-xs text-red-700">{errors.cvc}</p>}
              </div>
            </div>
            <Input id="cardName" label="Name on card" autoComplete="cc-name" form={form} errors={errors} set={set} />
          </Section>
        </div>

        {/* ---------- summary ---------- */}
        <aside className="lg:col-span-5">
          <div className="card sticky top-32 p-6 sm:p-8">
            <h2 className="text-2xl font-light">Order summary</h2>
            <ul className="mt-5 space-y-4">
              {lines.map(({ product, quantity }) => (
                <li key={product.id} className="flex items-center gap-4">
                  <div className="relative">
                    <img src={product.image} alt="" className="h-16 w-14 rounded-xl object-cover" />
                    <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-espresso px-1 text-[11px] font-semibold text-cream">
                      {quantity}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-lg leading-tight">{product.name}</p>
                    <p className="text-xs text-smoke">{formatMoney(product.price)} each</p>
                  </div>
                  <p className="text-sm tabular-nums">{formatMoney(product.price * quantity)}</p>
                </li>
              ))}
            </ul>

            <div className="mt-6 border-t border-sand pt-5">
              {promoCode ? (
                <div className="flex items-center justify-between rounded-xl bg-moss/10 px-4 py-3 text-sm">
                  <span className="flex items-center gap-2 text-moss">
                    <Tag className="h-4 w-4" /> <strong>{promoCode}</strong> {quote.promoLabel}
                  </span>
                  <button type="button" onClick={() => setPromoCode(null)} className="text-smoke hover:text-espresso" aria-label="Remove promo code">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <label htmlFor="promo" className="sr-only">Promo code</label>
                  <input
                    id="promo"
                    value={promoInput}
                    onChange={(e) => {
                      setPromoInput(e.target.value.toUpperCase());
                      setPromoError(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        applyPromo();
                      }
                    }}
                    placeholder="Promo code"
                    className="field py-2.5 uppercase"
                  />
                  <button type="button" onClick={applyPromo} className="btn-outline shrink-0 px-5 py-2.5" disabled={!promoInput.trim()}>
                    Apply
                  </button>
                </div>
              )}
              {promoError && <p className="mt-2 text-xs text-red-700">{promoError}</p>}
              {!promoCode && !promoError && <p className="mt-2 text-xs text-smoke">Try GLOW10, WELCOME5 or FREESHIP.</p>}
            </div>

            <dl className="mt-5 space-y-2.5 border-t border-sand pt-5 text-sm">
              <Row label="Subtotal" value={formatMoney(quote.subtotal)} />
              {quote.discount > 0 && <Row label="Discount" value={`-${formatMoney(quote.discount)}`} className="text-moss" />}
              <Row label={`Shipping (${SHIPPING_RATES[shippingMethod].label.toLowerCase()})`} value={quote.shipping === 0 ? 'Free' : formatMoney(quote.shipping)} />
              <Row label="Estimated tax" value={formatMoney(quote.tax)} />
              <div className="flex items-baseline justify-between border-t border-sand pt-4">
                <dt className="font-medium">Total</dt>
                <dd className="font-display text-3xl tabular-nums">{formatMoney(quote.total)}</dd>
              </div>
            </dl>

            {paymentError && (
              <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
                {paymentError}
              </p>
            )}

            <button type="submit" disabled={submitting} className="btn-accent mt-6 w-full py-4 text-base">
              {submitting ? (
                <>
                  <Spinner className="h-4 w-4" /> Processing payment
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" /> Pay {formatMoney(quote.total)}
                </>
              )}
            </button>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-smoke">
              <LogoMark className="h-4 w-4" /> Prices and stock are confirmed by the server at payment.
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
};

// ---------- small building blocks ----------

function Section({ title, step, children }: { title: string; step: number; children: ReactNode }) {
  return (
    <fieldset className="card space-y-4 p-6 sm:p-8">
      <legend className="sr-only">{title}</legend>
      <h2 className="flex items-center gap-3 text-2xl font-light" aria-hidden="true">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-espresso font-sans text-xs font-semibold text-cream">
          {step}
        </span>
        {title}
      </h2>
      {children}
    </fieldset>
  );
}

function Input({
  id,
  label,
  form,
  errors,
  set,
  ...rest
}: {
  id: Field;
  label: string;
  form: FormState;
  errors: Partial<Record<Field, string>>;
  set: (f: Field, v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'form' | 'id'>) {
  return (
    <div>
      <label htmlFor={`co-${id}`} className="field-label">
        {label}
      </label>
      <input
        id={`co-${id}`}
        value={form[id]}
        onChange={(e) => set(id, e.target.value)}
        className={`field ${errors[id] ? 'field-error' : ''}`}
        aria-invalid={Boolean(errors[id])}
        aria-describedby={errors[id] ? `co-${id}-error` : undefined}
        {...rest}
      />
      {errors[id] && (
        <p id={`co-${id}-error`} className="mt-1 text-xs text-red-700">
          {errors[id]}
        </p>
      )}
    </div>
  );
}

function Row({ label, value, className = '' }: { label: string; value: string; className?: string }) {
  return (
    <div className={`flex justify-between ${className}`}>
      <dt className="text-bark/80">{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  );
}

export default CheckoutPage;
