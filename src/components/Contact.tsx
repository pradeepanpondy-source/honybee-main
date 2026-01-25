import Button from './Button';
import { useState } from 'react';
import { contactSchema } from '../utils/validation';
import { rateLimiter } from '../utils/rateLimiter';

const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    // 1. Rate Limiting (Frontend)
    const rateCheck = rateLimiter.check('contact', { limit: 2, windowMs: 60 * 1000 });
    if (!rateCheck.allowed) {
      const waitTime = rateLimiter.getWaitTimeSeconds(rateCheck.resetTime!);
      setStatus({ type: 'error', message: `Too many submissions. Please wait ${waitTime} seconds.` });
      setLoading(false);
      return;
    }

    // 2. Validation
    const validation = contactSchema.safeParse({ name, email, message });
    if (!validation.success) {
      setStatus({ type: 'error', message: validation.error.issues[0].message });
      setLoading(false);
      return;
    }

    try {
      // 3. Secure API Call
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validation.data),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: 'Message sent successfully!' });
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setStatus({ type: 'error', message: result.error || 'Failed to send message.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'An unexpected error occurred.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-honeybee-background text-honeybee-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-honeybee-primary">Contact Us</h1>
          <p className="mt-4 text-base md:text-lg max-w-2xl mx-auto">
            We'd love to hear from you! Whether you have a question about our products, our practices, or anything else, our team is ready to answer all your questions.
          </p>
        </div>

        <div className="mt-12 md:mt-20 grid md:grid-cols-2 gap-8 md:gap-16">
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
            <h2 className="text-xl md:text-2xl font-serif font-bold mb-6">Send us a message</h2>
            {status && (
              <div className={`mb-4 p-3 rounded ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {status.message}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-honeybee-primary focus:border-honeybee-primary bg-white text-base"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-honeybee-primary focus:border-honeybee-primary bg-white text-base"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  id="message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-md focus:ring-2 focus:ring-honeybee-primary focus:border-honeybee-primary bg-white text-base"
                ></textarea>
              </div>
              <Button type="submit" variant="primary" className="w-full py-3 text-base" disabled={loading}>
                {loading ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>

          <div className="space-y-6 md:space-y-8">
            <div>
              <h3 className="text-lg md:text-xl font-serif font-bold mb-2">Email Us</h3>
              <p className="text-sm md:text-base">beebridgeshop@gmail.com</p>
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-serif font-bold mb-2">Call Us</h3>
              <p className="text-sm md:text-base">(123) 456-7890</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
