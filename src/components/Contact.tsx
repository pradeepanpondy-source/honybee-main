import React from 'react';
import Button from './Button';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { contactSchema } from '../utils/validation';
import { rateLimiter } from '../utils/rateLimiter';
import { Loader2, Mail, Phone, FileText, Lock } from 'lucide-react';

const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setStatus(null);

    const rateCheck = rateLimiter.check('contact', { limit: 2, windowMs: 60 * 1000 });
    if (!rateCheck.allowed) {
      const waitTime = rateLimiter.getWaitTimeSeconds(rateCheck.resetTime!);
      setStatus({ type: 'error', message: `Too many submissions. Please wait ${waitTime} seconds.` });
      setLoading(false);
      return;
    }

    const validation = contactSchema.safeParse({ name, email, message });
    if (!validation.success) {
      setStatus({ type: 'error', message: validation.error.issues[0].message });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validation.data),
      });
      const result = await response.json();
      if (response.ok) {
        setStatus({ type: 'success', message: '✅ Message sent successfully! We\'ll get back to you soon.' });
        setName(''); setEmail(''); setMessage('');
      } else {
        setStatus({ type: 'error', message: result.error || 'Failed to send message.' });
      }
    } catch {
      setStatus({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-honeybee-background text-honeybee-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-honeybee-primary">Contact Us</h1>
          <p className="mt-4 text-base md:text-lg max-w-2xl mx-auto text-gray-600">
            We'd love to hear from you! Whether you have a question about our products, our practices, or anything else — our team is ready to help.
          </p>
        </div>

        <div className="mt-12 md:mt-20 grid md:grid-cols-2 gap-8 md:gap-16">
          {/* Form */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-md border border-gray-100">
            <h2 className="text-xl md:text-2xl font-serif font-bold mb-6 text-honeybee-secondary">Send us a message</h2>
            {status && (
              <div className={`mb-4 p-3 rounded-xl text-sm font-medium ${status.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-600'}`}>
                {status.message}
              </div>
            )}
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text" id="name" value={name}
                  onChange={e => setName(e.target.value)}
                  required disabled={loading}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-honeybee-primary bg-white text-base disabled:opacity-60"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email" id="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  required disabled={loading}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-honeybee-primary bg-white text-base disabled:opacity-60"
                />
              </div>
              <div className="mb-5">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  id="message" rows={4} value={message}
                  onChange={e => setMessage(e.target.value)}
                  required disabled={loading}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-honeybee-primary bg-white text-base disabled:opacity-60"
                />
              </div>
              <Button type="submit" variant="primary" className="w-full py-3 text-base flex items-center justify-center gap-2" disabled={loading}>
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Sending…</> : 'Send Message'}
              </Button>
            </form>
          </div>

          {/* Info */}
          <div className="space-y-6 md:space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-honeybee-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                <Mail className="h-5 w-5 text-honeybee-primary" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold mb-1 text-honeybee-secondary">Email Us</h3>
                <a href="mailto:beebridgeshop@gmail.com" className="text-sm md:text-base text-honeybee-accent hover:underline">
                  beebridgeshop@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-honeybee-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                <Phone className="h-5 w-5 text-honeybee-primary" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold mb-1 text-honeybee-secondary">Call Us</h3>
                <p className="text-sm md:text-base text-gray-600">+91 (123) 456-7890</p>
              </div>
            </div>

            {/* ── Legal Links ─────────────────────────────────── */}
            <div className="mt-4 p-5 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-sm font-semibold text-gray-600 mb-3">Legal &amp; Privacy</p>

              <Link to="/terms-and-conditions" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white hover:shadow-sm transition-all group mb-2">
                <div className="w-8 h-8 bg-honeybee-secondary/5 rounded-lg flex items-center justify-center group-hover:bg-honeybee-primary/10 transition-colors">
                  <FileText className="h-4 w-4 text-honeybee-secondary group-hover:text-honeybee-primary transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-honeybee-secondary group-hover:text-honeybee-primary transition-colors">
                    Terms &amp; Conditions
                  </p>
                  <p className="text-xs text-gray-400">Read our usage policies</p>
                </div>
              </Link>

              <Link to="/privacy-policy" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white hover:shadow-sm transition-all group">
                <div className="w-8 h-8 bg-honeybee-secondary/5 rounded-lg flex items-center justify-center group-hover:bg-honeybee-primary/10 transition-colors">
                  <Lock className="h-4 w-4 text-honeybee-secondary group-hover:text-honeybee-primary transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-honeybee-secondary group-hover:text-honeybee-primary transition-colors">
                    Privacy Policy
                  </p>
                  <p className="text-xs text-gray-400">How we handle your data</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
