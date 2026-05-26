import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const hardeningMigration = readFileSync(
  new URL("../supabase/migrations/003_production_hardening.sql", import.meta.url),
  "utf8",
);

test("production hardening migration makes conversations idempotent per clinic and external id", () => {
  assert.match(
    hardeningMigration,
    /create\s+unique\s+index\s+if\s+not\s+exists\s+conversations_clinic_external_id_unique/i,
  );
  assert.match(hardeningMigration, /\(clinic_id,\s*external_id\)/i);
});

test("production hardening migration aligns dead_letters with store adapter", () => {
  assert.match(hardeningMigration, /alter\s+table\s+public\.dead_letters/i);
  assert.match(hardeningMigration, /add\s+column\s+if\s+not\s+exists\s+clinic_id\s+uuid/i);
  assert.match(hardeningMigration, /add\s+column\s+if\s+not\s+exists\s+kind\s+text/i);
  assert.match(hardeningMigration, /add\s+column\s+if\s+not\s+exists\s+error\s+text/i);
  assert.match(hardeningMigration, /add\s+column\s+if\s+not\s+exists\s+payload\s+jsonb/i);
});
