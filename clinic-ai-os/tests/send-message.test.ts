import test from "node:test";
import assert from "node:assert/strict";
import { handleSendMessage } from "../lib/clinic-api.ts";
import type { ClinicStore } from "../lib/clinic-persistence.ts";

function makeStore(overrides: Partial<ClinicStore> = {}): ClinicStore {
  const noop = async () => ({ id: `mock-${Date.now()}` });
  return {
    recordWebhookEvent: noop,
    upsertCustomerByPhone: noop,
    upsertConversation: noop,
    insertMessage: noop,
    saveAiLog: noop,
    setConversationHumanNeeded: async () => {},
    createBooking: noop,
    createReminder: noop,
    markCustomerBooked: async () => {},
    recordDeadLetter: noop,
    ...overrides,
  };
}

test("handleSendMessage: sends via mock sender when no real sender", async () => {
  const result = await handleSendMessage({
    clinicId: "clinic-1",
    to: "+966501234567",
    body: "موعدك مؤكد",
    conversationId: "conv-1",
    customerId: "cust-1",
    store: makeStore(),
  });
  assert.strictEqual(result.success, true);
  assert.match(result.messageId, /^mock-/);
  assert.strictEqual(result.persistence.mode, "supabase");
});

test("handleSendMessage: returns error when send fails", async () => {
  const result = await handleSendMessage({
    clinicId: "clinic-1",
    to: "",
    body: "مرحباً",
    conversationId: "conv-1",
    customerId: "cust-1",
    store: makeStore(),
  });
  assert.strictEqual(result.success, false);
  assert.ok(result.error);
});

test("handleSendMessage: persists outbound message on success", async () => {
  let inserted: unknown = null;
  const store = makeStore({
    insertMessage: async (input) => {
      inserted = input;
      return { id: "msg-out-1" };
    },
  });

  await handleSendMessage({
    clinicId: "clinic-1",
    to: "+966501234567",
    body: "تذكير موعدك",
    conversationId: "conv-1",
    customerId: "cust-1",
    store,
  });

  assert.ok(inserted);
  assert.strictEqual((inserted as { direction: string }).direction, "outbound");
  assert.strictEqual((inserted as { body: string }).body, "تذكير موعدك");
});

test("handleSendMessage: records dead letter when send fails and store available", async () => {
  let deadLetterPayload: unknown = null;
  const store = makeStore({
    recordDeadLetter: async (input) => {
      deadLetterPayload = input;
      return { id: "dl-1" };
    },
  });

  const result = await handleSendMessage({
    clinicId: "clinic-1",
    to: "", // will trigger send failure
    body: "مرحباً",
    conversationId: "conv-1",
    customerId: "cust-1",
    store,
  });

  assert.strictEqual(result.success, false);
  assert.ok(deadLetterPayload, "Dead letter should be recorded");
  assert.strictEqual((deadLetterPayload as { kind: string }).kind, "whatsapp_send_failure");
});
