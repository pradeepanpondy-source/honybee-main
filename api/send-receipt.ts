import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

const emailUser = process.env.EMAIL_USER || '';
const emailPass = process.env.EMAIL_PASS || '';

interface ReceiptItem {
  name: string;
  price: number;
  quantity: number;
}

interface ReceiptPayload {
  orderId: string;
  receiptNumber: string;
  orderDate: string;
  customerName: string;
  customerEmail: string;
  items: ReceiptItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  tax: number;
  shippingCharge: number;
  grandTotal: number;
  paymentMethod: string;
  orderStatus: string;
  estimatedDelivery?: string;
}

/** Format INR */
const inr = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);

/** Generate premium HTML email receipt */
function generateReceiptEmail(data: ReceiptPayload): string {
  const itemRows = data.items
    .map(
      (item) => `
        <tr>
          <td style="padding:10px 16px;border-bottom:1px solid #f3f4f6;color:#374151;font-size:14px;">${item.name}</td>
          <td style="padding:10px 16px;border-bottom:1px solid #f3f4f6;text-align:center;color:#6b7280;font-size:14px;">${item.quantity}</td>
          <td style="padding:10px 16px;border-bottom:1px solid #f3f4f6;text-align:right;color:#6b7280;font-size:14px;">${inr(item.price)}</td>
          <td style="padding:10px 16px;border-bottom:1px solid #f3f4f6;text-align:right;font-weight:700;color:#1a1a2e;font-size:14px;">${inr(item.price * item.quantity)}</td>
        </tr>`
    )
    .join('');

  const discountRow =
    data.discount > 0
      ? `<tr>
           <td colspan="3" style="padding:6px 16px;text-align:right;color:#16a34a;font-size:13px;">
             Discount${data.couponCode ? ` (${data.couponCode})` : ''}
           </td>
           <td style="padding:6px 16px;text-align:right;color:#16a34a;font-weight:700;font-size:13px;">−${inr(data.discount)}</td>
         </tr>`
      : '';

  const taxRow =
    data.tax > 0
      ? `<tr>
           <td colspan="3" style="padding:6px 16px;text-align:right;color:#6b7280;font-size:13px;">GST / Tax</td>
           <td style="padding:6px 16px;text-align:right;color:#374151;font-weight:700;font-size:13px;">${inr(data.tax)}</td>
         </tr>`
      : '';

  const shippingRow = `
    <tr>
      <td colspan="3" style="padding:6px 16px;text-align:right;color:#6b7280;font-size:13px;">Shipping</td>
      <td style="padding:6px 16px;text-align:right;font-weight:700;font-size:13px;color:${data.shippingCharge === 0 ? '#16a34a' : '#374151'};">
        ${data.shippingCharge === 0 ? 'FREE' : inr(data.shippingCharge)}
      </td>
    </tr>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Order Receipt – Bee Bridge</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background:#1a1a2e;padding:32px 32px 24px;text-align:center;">
      <div style="margin-bottom:6px;">
        <span style="font-size:26px;font-weight:900;color:#f5a623;letter-spacing:-0.5px;">Bee</span>
        <span style="font-size:26px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">Bridge</span>
      </div>
      <p style="color:rgba(255,255,255,0.4);font-size:11px;margin:0;letter-spacing:1px;text-transform:uppercase;">
        Farm-to-Home Honey Marketplace
      </p>
    </div>

    <!-- Success banner -->
    <div style="background:#f0fdf4;border-bottom:1px solid #bbf7d0;padding:14px 32px;display:flex;align-items:center;gap:10px;">
      <span style="font-size:18px;">✅</span>
      <div>
        <p style="margin:0;color:#15803d;font-weight:700;font-size:14px;">Order Confirmed!</p>
        <p style="margin:2px 0 0;color:#166534;font-size:12px;">Receipt #${data.receiptNumber} · ${data.orderDate}</p>
      </div>
    </div>

    <!-- Body -->
    <div style="padding:28px 32px;">

      <!-- Greeting -->
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 20px;">
        Hi <strong>${data.customerName || 'there'}</strong>,<br>
        Thank you for your order! Here's your official receipt from Bee Bridge. We're preparing your honey with care. 🍯
      </p>

      <!-- Order meta -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <tr>
          <td style="padding:8px 12px;background:#f9fafb;border-radius:8px 0 0 8px;border:1px solid #f3f4f6;">
            <p style="margin:0;font-size:10px;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Order ID</p>
            <p style="margin:4px 0 0;font-size:13px;color:#1a1a2e;font-weight:700;">${data.orderId}</p>
          </td>
          <td style="padding:8px 12px;background:#f9fafb;border-left:2px solid #fff;border:1px solid #f3f4f6;">
            <p style="margin:0;font-size:10px;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Payment</p>
            <p style="margin:4px 0 0;font-size:13px;color:#1a1a2e;font-weight:700;text-transform:capitalize;">${data.paymentMethod}</p>
          </td>
          <td style="padding:8px 12px;background:#f9fafb;border-radius:0 8px 8px 0;border-left:2px solid #fff;border:1px solid #f3f4f6;">
            <p style="margin:0;font-size:10px;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Status</p>
            <p style="margin:4px 0 0;font-size:13px;color:#d97706;font-weight:700;text-transform:capitalize;">${data.orderStatus}</p>
          </td>
        </tr>
      </table>

      <!-- Items table -->
      <h3 style="color:#1a1a2e;font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:1px;margin:0 0 10px;">Items Ordered</h3>
      <table style="width:100%;border-collapse:collapse;margin-bottom:0;border-radius:12px;overflow:hidden;border:1px solid #f3f4f6;">
        <thead>
          <tr style="background:#f9fafb;">
            <th style="padding:10px 16px;text-align:left;font-size:11px;color:#9ca3af;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Product</th>
            <th style="padding:10px 16px;text-align:center;font-size:11px;color:#9ca3af;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Qty</th>
            <th style="padding:10px 16px;text-align:right;font-size:11px;color:#9ca3af;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Price</th>
            <th style="padding:10px 16px;text-align:right;font-size:11px;color:#9ca3af;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" style="padding:10px 16px;text-align:right;color:#6b7280;font-size:13px;border-top:1px solid #f3f4f6;">Subtotal</td>
            <td style="padding:10px 16px;text-align:right;font-weight:700;font-size:13px;color:#374151;border-top:1px solid #f3f4f6;">${inr(data.subtotal)}</td>
          </tr>
          ${discountRow}
          ${taxRow}
          ${shippingRow}
          <tr style="background:#fefce8;">
            <td colspan="3" style="padding:12px 16px;text-align:right;font-weight:800;color:#1a1a2e;font-size:15px;border-top:2px solid #f3f4f6;">Grand Total</td>
            <td style="padding:12px 16px;text-align:right;font-weight:900;color:#f5a623;font-size:18px;border-top:2px solid #f3f4f6;">${inr(data.grandTotal)}</td>
          </tr>
        </tfoot>
      </table>

      ${data.estimatedDelivery ? `
      <!-- Estimated delivery -->
      <div style="margin-top:20px;padding:14px 16px;background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;display:flex;align-items:center;gap:10px;">
        <span style="font-size:20px;">🚚</span>
        <p style="margin:0;color:#9a3412;font-size:13px;">
          Estimated delivery: <strong>${data.estimatedDelivery}</strong>
        </p>
      </div>` : ''}

      <!-- Support -->
      <div style="margin-top:24px;padding:16px;background:#f9fafb;border-radius:10px;border:1px solid #f3f4f6;">
        <p style="margin:0 0 6px;font-size:12px;color:#374151;font-weight:700;">Need help with your order?</p>
        <p style="margin:0;font-size:12px;color:#6b7280;line-height:1.6;">
          📧 <a href="mailto:support@beebridge.vercel.app" style="color:#f5a623;text-decoration:none;">support@beebridge.vercel.app</a><br>
          🕒 Mon–Sat, 9 AM – 6 PM IST<br>
          🔄 7-day returns for quality issues
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#1a1a2e;padding:20px 32px;text-align:center;">
      <p style="margin:0 0 4px;color:#f5a623;font-weight:800;font-size:14px;">🐝 Thank you for choosing Bee Bridge!</p>
      <p style="margin:0;color:rgba(255,255,255,0.4);font-size:11px;">
        Pure honey. Verified farmers. Delivered to your door.<br>
        © ${new Date().getFullYear()} Bee Bridge · This is a computer-generated receipt.
      </p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * POST /api/send-receipt
 * Sends an HTML order receipt email to the customer.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const payload: ReceiptPayload = req.body;

    if (!payload?.customerEmail || !payload?.orderId) {
      return res.status(400).json({ error: 'customerEmail and orderId are required' });
    }

    if (!emailUser || !emailPass) {
      console.error('[send-receipt] SMTP credentials missing');
      return res.status(500).json({ error: 'Email service not configured on server' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: emailUser, pass: emailPass },
    });

    await transporter.sendMail({
      from: `"Bee Bridge" <${emailUser}>`,
      to: payload.customerEmail,
      subject: `Your Bee Bridge Order Receipt #${payload.receiptNumber}`,
      html: generateReceiptEmail(payload),
    });

    console.log(`[send-receipt] Receipt sent to ${payload.customerEmail} — order ${payload.orderId}`);
    return res.status(200).json({ success: true, message: 'Receipt email sent successfully' });

  } catch (error: any) {
    console.error('[send-receipt] Error:', error);
    return res.status(500).json({ error: error.message || 'Failed to send receipt email' });
  }
}
