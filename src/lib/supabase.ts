import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uigjzcwdyfulrmmeyeys.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpZ2p6Y3dkeWZ1bHJtbWV5ZXlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MzUyNDYsImV4cCI6MjA3ODExMTI0Nn0.nwpTzz450fNh6vQRCpRX0dV0XqBxcOjny6eUkYQiYEA'
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

export default supabase
