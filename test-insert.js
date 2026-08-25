import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false },
});

async function run() {
  const email = 'beebridgeshop@gmail.com';
  console.log('1. Looking up user by email:', email);
  
  const { data: userList, error: listErr } = await supabase.auth.admin.listUsers();
  if (listErr) {
    console.error('List users error:', listErr);
    return;
  }
  
  const user = userList.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    console.error('User not found!');
    return;
  }
  
  console.log('User found! ID:', user.id, 'Email:', user.email);
  
  console.log('2. Verifying user_id with getUserById...');
  const { data: authUser, error: authErr } = await supabase.auth.admin.getUserById(user.id);
  console.log('getUserById result:', authErr ? authErr.message : (authUser?.user ? 'Success' : 'Not found'));

  console.log('3. Checking public.users for user ID:', user.id);
  const { data: publicUser, error: pubErr } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();
    
  console.log('public.users check error:', pubErr?.message);
  console.log('public.users check data:', publicUser);

  console.log('4. Trying to upsert into public.users...');
  const { data: upsertData, error: upsertErr } = await supabase
    .from('users')
    .upsert({ id: user.id, email: user.email, name: 'Test', password: 'legacy_auth_bypassed' })
    .select();
  
  console.log('upsert error:', upsertErr?.message);
  
  if (!upsertErr) {
    console.log('3. Trying to insert an order...');
    const { data: orderData, error: orderErr } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        seller_id: null,
        total: 100,
        status: 'pending',
        customer_email: user.email,
        customer_name: 'Test',
        receipt_number: 'TEST-123',
        order_data: []
      })
      .select()
      .maybeSingle();

    if (orderErr) {
      console.error('Insert Error:', orderErr.message, 'Code:', orderErr.code);
    } else {
      console.log('Insert Success! Order ID:', orderData?.id);
      await supabase.from('orders').delete().eq('id', orderData.id);
      console.log('Test order cleaned up.');
    }
  }
  
}

run().catch(console.error);

