import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Show helpful warning in console if env vars missing
if (!supabaseUrl || !supabaseKey ||
    supabaseUrl.includes('placeholder') ||
    supabaseKey.includes('placeholder')) {
  console.warn(
    '%c⚠ Supabase not connected',
    'color: orange; font-weight: bold',
    '\nCopy .env.example to .env and fill in your Supabase URL and anon key.',
    '\nThe site will still load — database features will not work until keys are added.'
  )
}

export const supabase = createClient(
  supabaseUrl  || 'https://placeholder.supabase.co',
  supabaseKey  || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder'
)
