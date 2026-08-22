import type { VercelRequest, VercelResponse } from '@vercel/node';
import Razorpay from 'razorpay';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { amount, currency = 'INR', receipt } = req.body;

    if (!amount || amount < 100) {
      return res.status(400).json({ error: 'Invalid amount. Minimum is 100 paise.' });
    }

    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      console.error('[create-order] Razorpay keys missing');
      return res.status(500).json({ error: 'Razorpay keys are not configured' });
    }

    const instance = new Razorpay({
      key_id,
      key_secret,
    });

    const options = {
      amount,
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);
    
    return res.status(200).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error: any) {
    console.error('[create-order] Error:', error);
    // Return 401 if it's an auth error based on message, otherwise 500
    if (error.statusCode === 401) {
      return res.status(401).json({ error: 'Authentication failed with payment gateway' });
    }
    return res.status(500).json({ error: error.message || 'Failed to create order' });
  }
}
