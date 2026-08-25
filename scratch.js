import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const { data, error } = await supabase.from('users').insert({ id: '818ed278-50b9-4eb7-81d8-06504bb18bf8', email: 'test@test.com' });
  console.log(error ? error : "Inserted to users successfully");
}
check();
