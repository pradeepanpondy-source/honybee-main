import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { user_id, user_email } = req.body || {};

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  if (!supabaseUrl || !serviceKey) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  // Check if user_id exists in auth.users
  let userById = null;
  let userByIdError = null;
  if (user_id) {
    const { data, error } = await supabase.auth.admin.getUserById(user_id);
    userById = data?.user ? { id: data.user.id, email: data.user.email, created_at: data.user.created_at } : null;
    userByIdError = error?.message || null;
  }

  // Check if email exists in auth.users
  let userByEmail = null;
  if (user_email) {
    const { data: userList } = await supabase.auth.admin.listUsers();
    if (userList?.users) {
      const match = userList.users.find(
        (u: any) => u.email?.toLowerCase() === user_email.toLowerCase()
      );
      if (match) {
        userByEmail = { id: match.id, email: match.email, created_at: match.created_at };
      }
    }
  }

  return res.status(200).json({
    server_supabase_url: supabaseUrl,
    has_service_key: !!serviceKey,
    lookup_user_id: user_id || null,
    lookup_email: user_email || null,
    user_by_id: userById,
    user_by_id_error: userByIdError,
    user_by_email: userByEmail,
    id_matches_email: userById && userByEmail ? userById.id === userByEmail.id : null,
  });
}
