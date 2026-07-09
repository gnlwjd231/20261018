import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY env vars')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface GuestbookEntry {
  id: string
  created_at: string
  writer_name: string
  content: string
  theme_mode: string
}

export async function fetchGuestbook(): Promise<GuestbookEntry[]> {
  const { data, error } = await supabase
    .from('guestbook')
    .select('id, created_at, writer_name, content, theme_mode')
    .eq('is_hidden', false)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function addGuestbookEntry(
  writer_name: string,
  content: string,
  theme_mode: string,
): Promise<GuestbookEntry> {
  const { data, error } = await supabase
    .from('guestbook')
    .insert({ writer_name, content, theme_mode })
    .select('id, created_at, writer_name, content, theme_mode')
    .single()

  if (error) throw error
  return data
}

/* --- Admin only --- */

export async function fetchAllGuestbook(): Promise<GuestbookEntry[]> {
  const { data, error } = await supabase
    .from('guestbook')
    .select('id, created_at, writer_name, content, theme_mode')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function deleteGuestbookEntry(id: string): Promise<void> {
  const { error } = await supabase.from('guestbook').delete().eq('id', id)
  if (error) throw error
}

export interface VisitStats {
  date: string
  count: number
}

export async function fetchVisitStats(): Promise<VisitStats[]> {
  const { data, error } = await supabase
    .from('visit_logs')
    .select('visited_at, theme_mode')

  if (error) throw error

  const daily: Record<string, { total: number; light: number; dark: number }> = {}
  for (const row of data) {
    const day = new Date(row.visited_at).toISOString().slice(0, 10)
    if (!daily[day]) daily[day] = { total: 0, light: 0, dark: 0 }
    daily[day].total++
    if (row.theme_mode === 'light') daily[day].light++
    else daily[day].dark++
  }

  return Object.entries(daily)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, counts]) => ({ date, ...counts })) as any
}