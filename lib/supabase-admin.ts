import { createClient } from "@supabase/supabase-js";
import { createSupabaseClinicStore } from "./supabase-store.ts";
import type { ClinicStore } from "./clinic-persistence.ts";

type SupabaseEnv = {
  NEXT_PUBLIC_SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
};

export function isSupabaseAdminConfigured(env: SupabaseEnv = process.env as SupabaseEnv) {
  return Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);
}

export function createSupabaseAdminClient(env: SupabaseEnv = process.env as SupabaseEnv) {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing Supabase admin environment variables");
  }

  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function getSupabaseClinicStore(env: SupabaseEnv = process.env as SupabaseEnv): ClinicStore | null {
  if (!isSupabaseAdminConfigured(env)) {
    return null;
  }

  return createSupabaseClinicStore(createSupabaseAdminClient(env));
}
