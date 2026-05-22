import test from "node:test";
import assert from "node:assert/strict";

import { handleCreateBooking, handleWhatsAppWebhook } from "../lib/clinic-api.ts";
import type { ClinicStore } from "../lib/clinic-persistence.ts";

function fakeStore(): ClinicStore {
  return {
    async recordWebhookEvent() {
      return { id: "event-1" };
    },
    async upsertCustomerByPhone() {
      return { id: "customer-1" };
    },
    async upsertConversation() {
      return { id: "conversation-1" };
    },
    async insertMessage() {
      return { id: "message-1" };
    },
    async saveAiLog() {
      return { id: "ai-log-1" };
    },
    async setConversationHumanNeeded() {},
    async createBooking() {
      return { id: "booking-1" };
    },
    async createReminder(input) {
      return { id: `reminder-${input.type}` };
    },
    async markCustomerBooked() {},
    async recordDeadLetter() {
      return { id: "dead-letter-1" };
    },
  };
}

test("webhook handler persists valid WhatsApp payload when store is provided", async () => {
  const result = await handleWhatsAppWebhook({
    clinicId: "00000000-0000-0000-0000-000000000001",
    payload: {
      entry: [
        {
          changes: [
            {
              value: {
                contacts: [{ wa_id: "966501234567", profile: { name: "سارة أحمد" } }],
                messages: [
                  {
                    id: "wamid.demo",
                    from: "966501234567",
                    timestamp: "1779414300",
                    type: "text",
                    text: { body: "بكم تنظيف الأسنان؟ اليوم في موعد؟" },
                  },
                ],
              },
            },
          ],
        },
      ],
    },
    store: fakeStore(),
  });

  assert.equal(result.success, true);
  assert.equal(result.persistence.mode, "supabase");
  assert.equal(result.persistence.customerId, "customer-1");
  assert.equal(result.persistence.conversationId, "conversation-1");
  assert.equal(result.ai.intent, "booking");
});

test("webhook handler stays mock-only without store", async () => {
  const result = await handleWhatsAppWebhook({
    clinicId: "00000000-0000-0000-0000-000000000001",
    payload: {
      entry: [
        {
          changes: [
            {
              value: {
                contacts: [{ wa_id: "966501234567", profile: { name: "سارة أحمد" } }],
                messages: [
                  {
                    id: "wamid.demo",
                    from: "966501234567",
                    type: "text",
                    text: { body: "بكم تنظيف الأسنان؟ اليوم في موعد؟" },
                  },
                ],
              },
            },
          ],
        },
      ],
    },
  });

  assert.equal(result.persistence.mode, "mock");
  assert.equal(result.customer.phone, "+966501234567");
});

test("create booking handler persists confirmed booking when store is provided", async () => {
  const result = await handleCreateBooking({
    clinicId: "00000000-0000-0000-0000-000000000001",
    body: {
      customerId: "customer-1",
      customerName: "سارة أحمد",
      serviceName: "تنظيف أسنان",
      serviceId: "30000000-0000-0000-0000-000000000002",
      doctorName: "د. ريم السيف",
      doctorId: "40000000-0000-0000-0000-000000000002",
      startsAt: "2026-05-22T16:00:00+03:00",
    },
    store: fakeStore(),
  });

  assert.equal(result.success, true);
  assert.equal(result.persistence.mode, "supabase");
  assert.equal(result.persistence.bookingId, "booking-1");
  assert.deepEqual(result.persistence.reminderIds, ["reminder-24h_before", "reminder-2h_before"]);
});
