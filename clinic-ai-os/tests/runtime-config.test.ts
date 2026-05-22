import test from "node:test";
import assert from "node:assert/strict";

import { getRuntimeConfigStatus } from "../lib/runtime-config.ts";

test("runtime config status exposes readiness without leaking secrets", () => {
  const status = getRuntimeConfigStatus({
    NODE_ENV: "production",
    NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
    SUPABASE_SERVICE_ROLE_KEY: "service-role-secret",
    WHATSAPP_ACCESS_TOKEN: "whatsapp-secret",
    WHATSAPP_PHONE_NUMBER_ID: "123456789",
    WHATSAPP_VERIFY_TOKEN: "verify-secret",
    WHATSAPP_APP_SECRET: "app-secret",
    AI_PROVIDER: "openai",
    OPENAI_API_KEY: "openai-secret",
    ENABLE_UNAUTHENTICATED_DEMO_API: "false",
  });

  assert.equal(status.environment, "production");
  assert.equal(status.supabase.ready, true);
  assert.equal(status.whatsapp.ready, true);
  assert.equal(status.whatsapp.mode, "cloud");
  assert.equal(status.ai.ready, true);
  assert.equal(status.ai.provider, "openai");
  assert.equal(status.demoApi.exposed, false);
  assert.equal(JSON.stringify(status).includes("secret"), false);
});

test("runtime config status reports deterministic demo fallbacks", () => {
  const status = getRuntimeConfigStatus({
    NODE_ENV: "development",
    AI_PROVIDER: "gemini",
  });

  assert.equal(status.environment, "development");
  assert.equal(status.supabase.ready, false);
  assert.deepEqual(status.supabase.missing, ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]);
  assert.equal(status.whatsapp.ready, false);
  assert.equal(status.whatsapp.mode, "mock");
  assert.equal(status.ai.ready, false);
  assert.equal(status.ai.provider, "deterministic");
  assert.equal(status.demoApi.exposed, true);
});
