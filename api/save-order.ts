import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const {
      razorpay_order_id, razorpay_payment_id, razorpay_signature,
      user_id, user_email, customer_name, customer_phone, shipping_address,
      cart_items, subtotal, shipping_charge, discount_amount, coupon, grand_total, receipt_number,
    } = req.body;

    // ── Validate required fields ───────────────────────────────────────
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing Razorpay payment fields' });
    }
    if (!user_id || !user_email) {
      return res.status(400).json({ error: 'Missing user identification. Please log in and try again.' });
    }
    if (!cart_items || !Array.isArray(cart_items) || cart_items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty or invalid' });
    }
    if (typeof grand_total !== 'number' || grand_total <= 0) {
      return res.status(400).json({ error: 'Invalid order total' });
    }

    // ── 1. Verify Razorpay HMAC signature ─────────────────────────────
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_secret) {
      console.error('[save-order] RAZORPAY_KEY_SECRET missing');
      return res.status(500).json({ error: 'Payment gateway not configured on server' });
    }
    const expectedSig = crypto
      .createHmac('sha256', key_secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');
    if (expectedSig !== razorpay_signature) {
      console.error('[save-order] Signature mismatch');
      return res.status(400).json({ error: 'Invalid payment signature — order not created' });
    }

    // ── 2. Init Supabase with service_role (bypasses RLS for writes) ───
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
    const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    if (!supabaseUrl || !serviceKey) {
      console.error('[save-order] Supabase service_role not configured');
      return res.status(500).json({ error: 'Database not configured on server' });
    }
    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
    });

    // ── 3. Idempotency: return existing order if payment already saved ─
    const { data: existingOrder, error: idempotencyErr } = await supabase
      .from('orders')
      .select('id, receipt_number, customer_email, total, shipping_charge, status')
      .eq('razorpay_payment_id', razorpay_payment_id)
      .maybeSingle();

    if (idempotencyErr) {
      console.warn('[save-order] Idempotency check error (non-fatal):', idempotencyErr.message);
    }
    if (existingOrder) {
      console.log('[save-order] Duplicate callback — returning existing order:', existingOrder.id);
      return res.status(200).json({ success: true, order: existingOrder, duplicate: true });
    }

    // ── 3b. Verify user_id exists in auth.users ─────────────────────────
    console.log('[save-order] Verifying user_id:', user_id);
    const { data: authUser, error: authErr } = await supabase.auth.admin.getUserById(user_id);
    if (authErr || !authUser?.user) {
      console.error('[save-order] user_id NOT FOUND in auth.users:', user_id, authErr?.message);
      
      // Try to look up the user by email as a fallback
      if (user_email) {
        console.log('[save-order] Attempting email lookup for:', user_email);
        const { data: userList, error: listErr } = await supabase.auth.admin.listUsers();
        if (!listErr && userList?.users) {
          const matchedUser = userList.users.find(
            (u: any) => u.email?.toLowerCase() === user_email.toLowerCase()
          );
          if (matchedUser) {
            console.log('[save-order] Found user by email. Correct user_id:', matchedUser.id, 'Received user_id:', user_id);
            // Use the correct user_id from the email match
            (req.body as any)._corrected_user_id = matchedUser.id;
          }
        }
      }
      
      // If we found a corrected user_id, use it; otherwise return error
      if (!(req.body as any)._corrected_user_id) {
        return res.status(400).json({
          error: `User account not found (id: ${user_id?.substring(0, 8)}…). Please log out, log back in, and try again.`,
        });
      }
    }
    
    // Use corrected user_id if available, otherwise use the original
    const finalUserId = (req.body as any)._corrected_user_id || user_id;
    console.log('[save-order] Using final user_id:', finalUserId);

    // ── 3c. HACK FIX: Sync user into public.users and user_profiles ───────────
    // The database has a strict foreign key (orders_user_id_fkey) pointing to 
    // the legacy `public.users` table instead of `auth.users`. 
    // To satisfy this without requiring manual SQL from the user, we upsert here.
    try {
      const uName = customer_name || user_email.split('@')[0];
      // Upsert into public.users
      const { error: usersErr } = await supabase.from('users').upsert({
        id: finalUserId,
        email: user_email,
        name: uName,
        password: 'legacy_auth_bypassed' // Satisfy not-null constraint
      }, { onConflict: 'id' }).select('id').maybeSingle();
      
      if (usersErr) {
        console.warn('[save-order] Error syncing user to public.users (non-fatal):', usersErr.message);
      }
      
      // Upsert into user_profiles just in case there's a constraint there too
      const { error: profileErr } = await supabase.from('user_profiles').upsert({
        user_id: finalUserId,
        provider: 'local',
        is_verified: true
      }, { onConflict: 'user_id' }).select('id').maybeSingle();
      
      if (profileErr) {
        console.warn('[save-order] Error syncing user to user_profiles (non-fatal):', profileErr.message);
      }
      
      console.log('[save-order] Synced user to public tables successfully');
    } catch (syncErr: any) {
      console.warn('[save-order] Exception syncing user to public tables (non-fatal):', syncErr.message);
    }

    // ── 4. Group cart items by seller ─────────────────────────────────
    const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const ordersBySeller: Record<string, any[]> = {};
    for (const item of cart_items) {
      const sid = item.seller_id || '__none__';
      if (!ordersBySeller[sid]) ordersBySeller[sid] = [];
      ordersBySeller[sid].push(item);
    }

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7);

    const createdOrders: any[] = [];

    for (const [sellerId, sellerItems] of Object.entries(ordersBySeller)) {
      const sellerSubtotal = sellerItems.reduce((s, i) => s + i.price * i.quantity, 0);
      const ratio          = subtotal > 0 ? sellerSubtotal / subtotal : 1;
      const sellerDiscount = (discount_amount || 0) * ratio;
      const sellerShipping = (shipping_charge || 0) * ratio;
      const sellerGrand    = sellerSubtotal - sellerDiscount + sellerShipping;
      const validSellerId  = sellerId !== '__none__' && UUID_RE.test(sellerId) ? sellerId : null;

      // Insert order row
      const { data: orderRow, error: orderErr } = await supabase
        .from('orders')
        .insert({
          user_id: finalUserId,
          seller_id:          validSellerId,
          receipt_number:     receipt_number || `BB-${Date.now()}`,
          total:              sellerSubtotal,
          discount:           (discount_amount || 0) > 0 ? sellerDiscount / sellerSubtotal : null,
          discounted_total:   (discount_amount || 0) > 0 ? sellerSubtotal - sellerDiscount : null,
          coupon:             coupon || null,
          shipping_charge:    sellerShipping,
          grand_total:        sellerGrand,
          tax:                0,
          status:             'paid',
          payment_method:     'Razorpay Online',
          payment_status:     'paid',
          customer_email:     user_email,
          customer_name:      customer_name || user_email.split('@')[0],
          customer_phone:     customer_phone || null,
          shipping_address:   shipping_address || null,
          estimated_delivery: deliveryDate.toISOString().split('T')[0],
          razorpay_payment_id,
          razorpay_order_id,
          order_data:         sellerItems,
        })
        .select()
        .single();

      if (orderErr) {
        console.error('[save-order] Order insert error:', orderErr);
        throw new Error(`Order insert failed: ${orderErr.message} (code: ${orderErr.code})`);
      }

      // Insert order_items rows — only for items with valid UUID product IDs.
      // Static products (id = "default-1", "beehive-starter-kit", etc.) are
      // already stored in orders.order_data so skipping them here is safe.
      const uuidItems = sellerItems.filter((item: any) => UUID_RE.test(item.id));
      if (uuidItems.length > 0) {
        const { error: itemsErr } = await supabase
          .from('order_items')
          .insert(uuidItems.map((item: any) => ({
            order_id:   orderRow.id,
            product_id: item.id,
            name:       item.name,
            price:      item.price,
            quantity:   item.quantity,
          })));

        if (itemsErr) {
          console.error('[save-order] Order items insert error:', itemsErr);
          throw new Error(`Order items insert failed: ${itemsErr.message}`);
        }
      }
      
      // Also record static (non-UUID) items without a product_id reference.
      // Only attempt this if the product_id column is nullable in your DB.
      // (Run once in Supabase SQL editor: ALTER TABLE order_items ALTER COLUMN product_id DROP NOT NULL;)
      const staticItems = sellerItems.filter((item: any) => !UUID_RE.test(item.id));
      if (staticItems.length > 0) {
        const { error: staticItemsErr } = await supabase
          .from('order_items')
          .insert(staticItems.map((item: any) => ({
            order_id:   orderRow.id,
            product_id: null,
            name:       item.name,
            price:      item.price,
            quantity:   item.quantity,
          })));
        if (staticItemsErr) {
          // Non-fatal — static items are already in orders.order_data
          console.warn('[save-order] Could not insert static order_items (non-fatal):', staticItemsErr.message);
        }
      }

      // Decrement stock — awaited (not fire-and-forget)
      for (const item of sellerItems) {
        const isStaticProduct =
          !item.id ||
          item.id.startsWith('default-') ||
          item.id === 'beehive-starter-kit';
        if (isStaticProduct) continue;

        const { error: rpcErr } = await supabase.rpc('decrement_stock', {
          p_id: item.id,
          qty:  item.quantity,
        });

        if (rpcErr) {
          // Fallback: manual update with out-of-stock flag
          console.warn('[save-order] RPC decrement_stock failed, using manual update:', rpcErr.message);
          const { data: prod } = await supabase
            .from('products')
            .select('stock')
            .eq('id', item.id)
            .single();
          if (prod) {
            const newStock = Math.max(0, prod.stock - item.quantity);
            await supabase
              .from('products')
              .update({ stock: newStock, is_active: newStock > 0 })
              .eq('id', item.id);
          }
        }
      }

      createdOrders.push(orderRow);
    }

    console.log('[save-order] Orders created:', createdOrders.map(o => o.id));

    // ── 6. Auto-send receipt email (fire-and-forget) ─────────────────
    const emailUser = process.env.EMAIL_USER || '';
    const emailPass = process.env.EMAIL_PASS || '';
    if (emailUser && emailPass && user_email) {
      try {
        const firstOrder = createdOrders[0];
        const deliveryDateStr = new Date(Date.now() + 7 * 86400000)
          .toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
        const orderDateStr = new Date()
          .toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
        const receiptNum = receipt_number || firstOrder?.receipt_number || `BB-${Date.now()}`;
        const allItems = cart_items.map((i: any) => ({
          name: i.name,
          price: Number(i.price) || 0,
          quantity: Number(i.quantity) || 1,
        }));
        const inr = (amt: number) =>
          new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(amt);

        const itemRows = allItems.map((item: any) => `
          <tr>
            <td style="padding:10px 16px;border-bottom:1px solid #f3f4f6;color:#374151;font-size:14px;">${item.name}</td>
            <td style="padding:10px 16px;border-bottom:1px solid #f3f4f6;text-align:center;color:#6b7280;font-size:14px;">${item.quantity}</td>
            <td style="padding:10px 16px;border-bottom:1px solid #f3f4f6;text-align:right;color:#6b7280;font-size:14px;">${inr(item.price)}</td>
            <td style="padding:10px 16px;border-bottom:1px solid #f3f4f6;text-align:right;font-weight:700;color:#1a1a2e;font-size:14px;">${inr(item.price * item.quantity)}</td>
          </tr>`).join('');

        const discountRow = (discount_amount || 0) > 0
          ? `<tr><td colspan="3" style="padding:6px 16px;text-align:right;color:#16a34a;font-size:13px;">Discount${coupon ? ` (${coupon})` : ''}</td><td style="padding:6px 16px;text-align:right;color:#16a34a;font-weight:700;font-size:13px;">−${inr(discount_amount)}</td></tr>`
          : '';

        const shippingRow = `<tr><td colspan="3" style="padding:6px 16px;text-align:right;color:#6b7280;font-size:13px;">Shipping</td><td style="padding:6px 16px;text-align:right;font-weight:700;font-size:13px;color:#16a34a;">FREE</td></tr>`;

        const html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Order Receipt – Bee Bridge</title></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:#1a1a2e;padding:32px 32px 24px;text-align:center;">
      <div style="margin-bottom:6px;"><span style="font-size:26px;font-weight:900;color:#f5a623;">Bee</span><span style="font-size:26px;font-weight:900;color:#ffffff;">Bridge</span></div>
      <p style="color:rgba(255,255,255,0.4);font-size:11px;margin:0;letter-spacing:1px;text-transform:uppercase;">Farm-to-Home Honey Marketplace</p>
    </div>
    <div style="background:#f0fdf4;border-bottom:1px solid #bbf7d0;padding:14px 32px;display:flex;align-items:center;gap:10px;">
      <span style="font-size:18px;">✅</span>
      <div><p style="margin:0;color:#15803d;font-weight:700;font-size:14px;">Order Confirmed!</p><p style="margin:2px 0 0;color:#166534;font-size:12px;">Receipt #${receiptNum} · ${orderDateStr}</p></div>
    </div>
    <div style="padding:28px 32px;">
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 20px;">Hi <strong>${customer_name || 'there'}</strong>,<br>Thank you for your order! Here's your official receipt from Bee Bridge. We're preparing your honey with care. 🍯</p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;"><tr>
        <td style="padding:8px 12px;background:#f9fafb;border:1px solid #f3f4f6;"><p style="margin:0;font-size:10px;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Order ID</p><p style="margin:4px 0 0;font-size:13px;color:#1a1a2e;font-weight:700;">${firstOrder?.id || 'N/A'}</p></td>
        <td style="padding:8px 12px;background:#f9fafb;border:1px solid #f3f4f6;"><p style="margin:0;font-size:10px;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Payment</p><p style="margin:4px 0 0;font-size:13px;color:#1a1a2e;font-weight:700;">Razorpay Online</p></td>
        <td style="padding:8px 12px;background:#f9fafb;border:1px solid #f3f4f6;"><p style="margin:0;font-size:10px;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Status</p><p style="margin:4px 0 0;font-size:13px;color:#15803d;font-weight:700;">Paid</p></td>
      </tr></table>
      <h3 style="color:#1a1a2e;font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:1px;margin:0 0 10px;">Items Ordered</h3>
      <table style="width:100%;border-collapse:collapse;border-radius:12px;overflow:hidden;border:1px solid #f3f4f6;">
        <thead><tr style="background:#f9fafb;"><th style="padding:10px 16px;text-align:left;font-size:11px;color:#9ca3af;font-weight:700;">Product</th><th style="padding:10px 16px;text-align:center;font-size:11px;color:#9ca3af;font-weight:700;">Qty</th><th style="padding:10px 16px;text-align:right;font-size:11px;color:#9ca3af;font-weight:700;">Price</th><th style="padding:10px 16px;text-align:right;font-size:11px;color:#9ca3af;font-weight:700;">Total</th></tr></thead>
        <tbody>${itemRows}</tbody>
        <tfoot>
          <tr><td colspan="3" style="padding:10px 16px;text-align:right;color:#6b7280;font-size:13px;border-top:1px solid #f3f4f6;">Subtotal</td><td style="padding:10px 16px;text-align:right;font-weight:700;font-size:13px;color:#374151;border-top:1px solid #f3f4f6;">${inr(subtotal)}</td></tr>
          ${discountRow}
          ${shippingRow}
          <tr style="background:#fefce8;"><td colspan="3" style="padding:12px 16px;text-align:right;font-weight:800;color:#1a1a2e;font-size:15px;border-top:2px solid #f3f4f6;">Grand Total</td><td style="padding:12px 16px;text-align:right;font-weight:900;color:#f5a623;font-size:18px;border-top:2px solid #f3f4f6;">${inr(grand_total)}</td></tr>
        </tfoot>
      </table>
      <div style="margin-top:20px;padding:14px 16px;background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;display:flex;align-items:center;gap:10px;">
        <span style="font-size:20px;">🚚</span><p style="margin:0;color:#9a3412;font-size:13px;">Estimated delivery: <strong>${deliveryDateStr}</strong></p>
      </div>
      <div style="margin-top:24px;padding:16px;background:#f9fafb;border-radius:10px;border:1px solid #f3f4f6;">
        <p style="margin:0 0 6px;font-size:12px;color:#374151;font-weight:700;">Need help with your order?</p>
        <p style="margin:0;font-size:12px;color:#6b7280;line-height:1.6;">📧 <a href="mailto:support@beebridge.vercel.app" style="color:#f5a623;text-decoration:none;">support@beebridge.vercel.app</a><br>🕒 Mon–Sat, 9 AM – 6 PM IST<br>🔄 7-day returns for quality issues</p>
      </div>
    </div>
    <div style="background:#1a1a2e;padding:20px 32px;text-align:center;">
      <p style="margin:0 0 4px;color:#f5a623;font-weight:800;font-size:14px;">🐝 Thank you for choosing Bee Bridge!</p>
      <p style="margin:0;color:rgba(255,255,255,0.4);font-size:11px;">Pure honey. Verified farmers. Delivered to your door.<br>© ${new Date().getFullYear()} Bee Bridge · This is a computer-generated receipt.</p>
    </div>
  </div>
</body></html>`;

        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: emailUser, pass: emailPass },
        });

        // Fire-and-forget — don't await, don't block the response
        transporter.sendMail({
          from: `"Bee Bridge" <${emailUser}>`,
          to: user_email,
          subject: `Your Bee Bridge Order Receipt #${receiptNum}`,
          html,
        }).then(() => {
          console.log(`[save-order] ✅ Receipt auto-emailed to ${user_email}`);
        }).catch((emailErr: any) => {
          console.warn(`[save-order] ⚠ Failed to auto-email receipt to ${user_email}:`, emailErr.message);
        });
      } catch (emailBuildErr: any) {
        console.warn('[save-order] ⚠ Receipt email build error (non-fatal):', emailBuildErr.message);
      }
    }

    return res.status(200).json({
      success:  true,
      order:    createdOrders[0],
      orderIds: createdOrders.map(o => o.id),
    });

  } catch (err: any) {
    console.error('[save-order] Unhandled error:', err);
    return res.status(500).json({ error: err.message || 'Failed to save order' });
  }
}
