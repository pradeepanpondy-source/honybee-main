import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_KEY_SECRET;

  return res.status(200).json({
    has_key_id: !!keyId,
    has_secret: !!secret,
    key_id_prefix: keyId ? keyId.substring(0, 12) : 'MISSING',
    key_id_length: keyId ? keyId.length : 0,
    secret_length: secret ? secret.length : 0,
    key_id_charCodes_end: keyId ? [...keyId.slice(-3)].map(c => c.charCodeAt(0)) : [],
  });
}
