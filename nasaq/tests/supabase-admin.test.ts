import test from "node:test";
import assert from "node:assert/strict";

import { isSupabaseAdminConfigured } from "../lib/supabase-admin.ts";

test("Supabase admin config requires URL and service role key", () => {
  assert.equal(
    isSupabaseAdminConfigured({
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      SUPABASE_SERVICE_ROLE_KEY: "service-role",
    }),
    true,
  );

  assert.equal(
    isSupabaseAdminConfigured({
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      SUPABASE_SERVICE_ROLE_KEY: "",
    }),
    false,
  );
});
