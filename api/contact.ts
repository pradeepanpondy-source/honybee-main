import type { VercelRequest, VercelResponse } from '@vercel/node';

// This is a simple in-memory rate limiter for demonstration.
// In a serverless environment like Vercel, memory is not shared across instances.
// For production, use Upstash Redis or Vercel KV.
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5;
const ipCache = new Map<string, { count: number, resetTime: number }>();

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
    const now = Date.now();

    // Basic Rate Limiting
    const userRate = ipCache.get(ip);
    if (userRate && now < userRate.resetTime) {
        if (userRate.count >= MAX_REQUESTS) {
            return res.status(429).json({ error: 'Too many requests. Please try again later.' });
        }
        userRate.count++;
    } else {
        ipCache.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    }

    try {
        const { name, email, message } = req.body;

        // Strict Input Validation & Sanitization
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (name.length > 50 || email.length > 100 || message.length > 1000) {
            return res.status(400).json({ error: 'Input exceeds length limits' });
        }

        // Sanitize
        const sanitizedName = name.replace(/[<>]/g, '').trim();
        const sanitizedEmail = email.replace(/[<>]/g, '').trim();
        const sanitizedMessage = message.replace(/[<>]/g, '').trim();

        // Here you would typically send an email or save to Supabase
        // Since we are just hardening, we demonstrate the secure flow.

        console.log('Processed secure contact form:', { sanitizedName, sanitizedEmail });

        return res.status(200).json({ success: true, message: 'Message received safely.' });
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
