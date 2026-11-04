import { useState, type ChangeEvent, type FormEvent } from 'react';
import { CheckCircle2, Clock, Mail, MapPin, Phone } from 'lucide-react';
import { PageHeader, Spinner } from '../components/ui';
import { ApiRequestError, api, errorMessage } from '../lib/api';
import { useDocumentTitle } from '../lib/useDocumentTitle';

const empty = { name: '', email: '', subject: '', message: '' };

const details = [
  { Icon: MapPin, title: 'Workshop', lines: ['123 Candle Lane', 'Portland, OR 97205'] },
  { Icon: Mail, title: 'Email', lines: ['hello@amberandglow.example'] },
  { Icon: Phone, title: 'Phone', lines: ['(555) 123-4567'] },
  { Icon: Clock, title: 'Opening hours', lines: ['Monday to Friday, 10am to 6pm', 'Saturday, 10am to 4pm'] },
];

const ContactPage = () => {
  useDocumentTitle('Contact');
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [formError, setFormError] = useState<string | null>(null);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: '' }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setFormError(null);
    try {
      await api('/contact', { body: form });
      setStatus('sent');
      setForm(empty);
    } catch (err) {
      setStatus('idle');
      if (err instanceof ApiRequestError && err.data.fields) setErrors(err.data.fields);
      setFormError(errorMessage(err));
    }
  };

  const fieldClass = (name: string) => `field ${errors[name] ? 'field-error' : ''}`;
  const FieldError = ({ name }: { name: string }) =>
    errors[name] ? <p className="mt-1 text-xs text-red-700">{errors[name]}</p> : null;

  return (
    <div className="container-custom pb-24">
      <PageHeader eyebrow="Contact" title="We would love to hear from you">
        Questions about an order, a scent, wholesale or a custom batch for your event. We reply within one working day.
      </PageHeader>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="card p-6 sm:p-10 lg:col-span-3">
          {status === 'sent' ? (
            <div className="flex flex-col items-center py-12 text-center" role="status">
              <CheckCircle2 className="h-12 w-12 text-moss" strokeWidth={1.5} />
              <h2 className="mt-4 text-3xl font-light">Message received</h2>
              <p className="mt-2 max-w-sm text-bark/80">Thank you for writing. Someone from the workshop will reply within one working day.</p>
              <button onClick={() => setStatus('idle')} className="btn-outline mt-6">
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="space-y-5">
              <h2 className="text-3xl font-light">Send a message</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="field-label">Name</label>
                  <input id="name" name="name" value={form.name} onChange={onChange} className={fieldClass('name')} autoComplete="name" />
                  <FieldError name="name" />
                </div>
                <div>
                  <label htmlFor="email" className="field-label">Email</label>
                  <input id="email" name="email" type="email" value={form.email} onChange={onChange} className={fieldClass('email')} autoComplete="email" />
                  <FieldError name="email" />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="field-label">Subject</label>
                <select id="subject" name="subject" value={form.subject} onChange={onChange} className={fieldClass('subject')}>
                  <option value="">Choose a topic</option>
                  <option value="order">Order question</option>
                  <option value="product">Product question</option>
                  <option value="wholesale">Wholesale</option>
                  <option value="custom">Custom order</option>
                  <option value="other">Something else</option>
                </select>
                <FieldError name="subject" />
              </div>
              <div>
                <label htmlFor="message" className="field-label">Message</label>
                <textarea id="message" name="message" rows={6} value={form.message} onChange={onChange} className={fieldClass('message')} />
                <FieldError name="message" />
              </div>
              {formError && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{formError}</p>}
              <button type="submit" disabled={status === 'sending'} className="btn-primary px-8 py-3.5">
                {status === 'sending' ? (
                  <>
                    <Spinner className="h-4 w-4" /> Sending
                  </>
                ) : (
                  'Send message'
                )}
              </button>
            </form>
          )}
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="card divide-y divide-sand/70 px-6 sm:px-8">
            {details.map(({ Icon, title, lines }) => (
              <div key={title} className="flex gap-4 py-5">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-ember" strokeWidth={1.6} />
                <div>
                  <p className="font-medium">{title}</p>
                  {lines.map((l) => (
                    <p key={l} className="text-sm text-bark/80">{l}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="overflow-hidden rounded-2xl border border-sand/70 shadow-soft">
            <iframe
              title="Map showing the workshop area in Portland, Oregon"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-122.70%2C45.505%2C-122.66%2C45.53&layer=mapnik"
              className="h-64 w-full grayscale-[40%] sepia-[20%]"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
