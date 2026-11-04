import { useState, type FormEvent } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { api, errorMessage } from '../lib/api';
import { Spinner } from './ui';

type Status = { kind: 'idle' } | { kind: 'loading' } | { kind: 'done'; message: string } | { kind: 'error'; message: string };

const NewsletterForm = ({ tone = 'dark' }: { tone?: 'dark' | 'light' }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const dark = tone === 'dark';

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus({ kind: 'loading' });
    try {
      const res = await api<{ alreadySubscribed: boolean }>('/newsletter', { body: { email } });
      setStatus({
        kind: 'done',
        message: res.alreadySubscribed ? 'You are already on the list. Thank you!' : 'You are on the list. Watch your inbox for 10% off.',
      });
      setEmail('');
    } catch (err) {
      setStatus({ kind: 'error', message: errorMessage(err) });
    }
  };

  if (status.kind === 'done') {
    return (
      <p className={`flex items-center gap-2 text-sm ${dark ? 'text-cream' : 'text-moss'}`} role="status">
        <Check className="h-4 w-4" /> {status.message}
      </p>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <div
        className={`flex items-center rounded-full border p-1 pl-5 ${
          dark ? 'border-cream/25 bg-cream/5 focus-within:border-honey' : 'border-sand bg-white focus-within:border-ember'
        }`}
      >
        <label htmlFor={`newsletter-${tone}`} className="sr-only">
          Email address
        </label>
        <input
          id={`newsletter-${tone}`}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className={`min-w-0 flex-1 bg-transparent py-2 text-sm focus:outline-none ${
            dark ? 'text-cream placeholder:text-cream/45' : 'text-espresso placeholder:text-smoke/60'
          }`}
        />
        <button
          type="submit"
          disabled={status.kind === 'loading'}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${
            dark ? 'bg-honey text-espresso hover:bg-cream' : 'bg-espresso text-cream hover:bg-bark'
          }`}
          aria-label="Subscribe"
        >
          {status.kind === 'loading' ? <Spinner className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
        </button>
      </div>
      {status.kind === 'error' && (
        <p className={`mt-2 text-xs ${dark ? 'text-red-300' : 'text-red-700'}`} role="alert">
          {status.message}
        </p>
      )}
    </form>
  );
};

export default NewsletterForm;
