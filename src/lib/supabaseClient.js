import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://imcosrapbcnlzjkmwcfp.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ1YiIsInJlZiI6ImltY29zcmFwYmNubHpqa213Y2ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0MjM2ODcsImV4cCI6MjEwNDk5OTY4N30.5veLxqoT7j7ecTGYnKvtgKO_XO4vdXfMxqKEv_V7rf4'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Configuração do Supabase ausente')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})
