import { createClient } from '@supabase/supabase-js'

// Use environment variables for Supabase configuration
// In production, these should come from .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables. Please check your .env file or Vercel settings.')
}

// Initialize client with whatever values we have. 
// If values are empty, Supabase will fail gracefully on actual calls rather than crashing the whole React app on load.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
)

export default supabase
