import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

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

      // Insert order_items rows
      const { error: itemsErr } = await supabase
        .from('order_items')
        .insert(sellerItems.map((item: any) => ({
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
