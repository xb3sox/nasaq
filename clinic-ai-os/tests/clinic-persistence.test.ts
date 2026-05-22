import test from "node:test";
import assert from "node:assert/strict";

import {
  persistConfirmedBooking,
  persistInboundWorkflow,
  type ClinicStore,
} from "../lib/clinic-persistence.ts";
import { analyzeClinicMessage, buildBookingConfirmation, buildReminderDrafts } from "../lib/clinic-workflow.ts";

const clinicId = "00000000-0000-0000-0000-000000000001";

test("persists inbound WhatsApp workflow in correct order", async () => {
  const calls: string[] = [];
  const store: ClinicStore = {
    async recordWebhookEvent() {
      calls.push("recordWebhookEvent");
      return "event-1";
    },
    async upsertCustomerByPhone() {
      calls.push("upsertCustomerByPhone");
      return { id: "customer-1" };
    },
    async upsertConversation() {
      calls.push("upsertConversation");
      return { id: "conversation-1" };
    },
    async insertMessage() {
      calls.push("insertMessage");
      return { id: "message-1" };
    },
    async saveAiLog() {
      calls.push("saveAiLog");
      return { id: "ai-log-1" };
    },
    async setConversationHumanNeeded() {
      calls.push("setConversationHumanNeeded");
    },
    async createBooking() {
      throw new Error("not expected");
    },
    async createReminder() {
      throw new Error("not expected");
    },
    async markCustomerBooked() {
      throw new Error("not expected");
    },
  };

  const result = await persistInboundWorkflow({
    store,
    clinicId,
    rawPayload: { id: "payload" },
    inbound: {
      externalMessageId: "wamid.demo",
      from: "+966501234567",
      customerName: "سارة أحمد",
      body: "بكم تنظيف الأسنان؟ اليوم في موعد؟",
    },
    ai: analyzeClinicMessage("بكم تنظيف الأسنان؟ اليوم في موعد؟"),
  });

  assert.deepEqual(calls, [
    "recordWebhookEvent",
    "upsertCustomerByPhone",
    "upsertConversation",
    "insertMessage",
    "saveAiLog",
    "setConversationHumanNeeded",
  ]);
  assert.equal(result.customerId, "customer-1");
  assert.equal(result.conversationId, "conversation-1");
  assert.equal(result.messageId, "message-1");
});

test("persists confirmed booking and reminder queue", async () => {
  const calls: string[] = [];
  const store: ClinicStore = {
    async recordWebhookEvent() {
      throw new Error("not expected");
    },
    async upsertCustomerByPhone() {
      throw new Error("not expected");
    },
    async upsertConversation() {
      throw new Error("not expected");
    },
    async insertMessage() {
      throw new Error("not expected");
    },
    async saveAiLog() {
      throw new Error("not expected");
    },
    async setConversationHumanNeeded() {
      throw new Error("not expected");
    },
    async createBooking() {
      calls.push("createBooking");
      return { id: "booking-1" };
    },
    async createReminder(input) {
      calls.push(`createReminder:${input.type}`);
      return { id: `reminder-${input.type}` };
    },
    async markCustomerBooked() {
      calls.push("markCustomerBooked");
    },
  };
  const booking = buildBookingConfirmation({
    customerName: "سارة أحمد",
    serviceName: "تنظيف أسنان",
    doctorName: "د. ريم السيف",
    startsAt: "2026-05-22T16:00:00+03:00",
  });

  const result = await persistConfirmedBooking({
    store,
    clinicId,
    customerId: "customer-1",
    serviceId: "30000000-0000-0000-0000-000000000002",
    doctorId: "40000000-0000-0000-0000-000000000002",
    booking,
    reminders: buildReminderDrafts(booking),
  });

  assert.deepEqual(calls, [
    "createBooking",
    "createReminder:24h_before",
    "createReminder:2h_before",
    "markCustomerBooked",
  ]);
  assert.equal(result.bookingId, "booking-1");
  assert.deepEqual(result.reminderIds, ["reminder-24h_before", "reminder-2h_before"]);
});
