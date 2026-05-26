import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Lazy singleton — safe in demo/mock mode when env vars are absent.
let _supabase: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (_supabase) return _supabase;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return null;
  }
  _supabase = createClient(url, key);
  return _supabase;
}

// Legacy export — only use in files that already verified Supabase config.
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseClient();
    if (!client) {
      throw new Error('Supabase client is not configured.');
    }
    return client[prop as keyof SupabaseClient];
  },
});
