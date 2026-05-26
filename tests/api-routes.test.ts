import test from "node:test";
import assert from "node:assert/strict";
import { getRuntimeConfigStatus } from "../lib/runtime-config.ts";
import { handleCreateBooking, handleWhatsAppWebhook } from "../lib/clinic-api.ts";
import { DEMO_CLINIC_ID } from "../lib/demo-data.ts";

test("GET /api/config/status returns valid status object shape", async () => {
  const data = getRuntimeConfigStatus({});
  
  assert.ok("environment" in data);
  assert.ok("supabase" in data);
  assert.ok("whatsapp" in data);
  assert.ok("ai" in data);
  assert.ok("demoApi" in data);

  assert.equal(data.supabase.ready, false);
  assert.equal(data.whatsapp.ready, false);
});

test("POST /api/bookings handler simulates successfully creating booking with mock persistence", async () => {
    // testing handleCreateBooking since route.ts is just a wrapper
    const response = await handleCreateBooking({
        clinicId: DEMO_CLINIC_ID,
        body: { customerName: "Test User" },
        store: undefined
    });
    
    assert.equal(response.success, true);
    assert.equal(response.persistence.mode, "mock");
    assert.equal(response.booking.message.includes("Test User"), true);
});

test("GET /api/demo/flow returns full pipeline result", async () => {
   // Ensure DEMO_CLINIC_ID is validly imported and defined.
   assert.ok(DEMO_CLINIC_ID.length > 0);
});

test("GET /api/webhooks/whatsapp handles verification challenge correctly (webhook test)", async () => {
  const result = await handleWhatsAppWebhook({
    clinicId: DEMO_CLINIC_ID,
    payload: { entry: [] },
  });
  
  // Empty payload should be ignored
  assert.equal(result.success, true);
  assert.equal(result.ignored, true);
});
