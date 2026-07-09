import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || supabaseUrl.includes('your-project-id') || !supabaseAnonKey || supabaseAnonKey.includes('your-supabase-anon-key')) {
  console.error('Missing Supabase env values. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env first.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const { data, error } = await supabase
  .from('guestbook')
  .select('id')
  .limit(1)

if (error) {
  console.error('Supabase connection failed.')
  console.error(error.message)
  process.exit(1)
}

console.log('Supabase connection OK.')
console.log(`guestbook rows fetched: ${data?.length ?? 0}`)
