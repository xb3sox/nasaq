import test from "node:test";
import assert from "node:assert/strict";
import { processRemindersBatch, getDueReminders } from "../lib/reminder-sender.ts";
import type { WhatsAppSender, WhatsAppSendResult } from "../lib/whatsapp-send.ts";

test("getDueReminders: returns demo reminders when store is missing", async () => {
  const result = await getDueReminders(null);
  assert.equal(result.length > 0, true);
  assert.equal(result[0].clinic_id, "demo-clinic");
});

test("processRemindersBatch: successfully sends and returns results", async () => {
  const calls: string[] = [];
  const mockSender: WhatsAppSender = {
    async send(input) {
      calls.push(input.to);
      return { ok: true, messageId: "mock-id" } as WhatsAppSendResult;
    },
  };

  const reminders = [
    {
      id: "rem-1",
      clinic_id: "clinic-1",
      customer_id: "cust-1",
      template_message: "تذكير: موعدك غداً",
      customer_phone: "+966500000001",
    },
    {
      id: "rem-2",
      clinic_id: "clinic-1",
      customer_id: "cust-2",
      template_message: "تذكير: موعدك بعد ساعتين",
      customer_phone: "+966500000002",
    },
  ];

  const results = await processRemindersBatch(reminders, mockSender);

  assert.equal(calls.length, 2);
  assert.equal(calls[0], "+966500000001");
  assert.equal(calls[1], "+966500000002");
  
  assert.equal(results.length, 2);
  assert.equal(results[0].id, "rem-1");
  assert.equal(results[0].success, true);
  assert.equal(results[1].id, "rem-2");
  assert.equal(results[1].success, true);
});

test("processRemindersBatch: handles missing phone number", async () => {
  const mockSender: WhatsAppSender = {
    async send() {
      return { ok: true, messageId: "mock-id" } as WhatsAppSendResult;
    },
  };

  const reminders = [
    {
      id: "rem-1",
      clinic_id: "clinic-1",
      customer_id: "cust-1",
      template_message: "تذكير",
      // missing customer_phone
    },
  ];

  const results = await processRemindersBatch(reminders, mockSender);

  assert.equal(results.length, 1);
  assert.equal(results[0].id, "rem-1");
  assert.equal(results[0].success, false);
  assert.equal(results[0].error, "Missing customer phone number");
});

test("processRemindersBatch: handles send failure", async () => {
  const mockSender: WhatsAppSender = {
    async send() {
      return { ok: false, error: "Network error" } as WhatsAppSendResult;
    },
  };

  const reminders = [
    {
      id: "rem-1",
      clinic_id: "clinic-1",
      customer_id: "cust-1",
      template_message: "تذكير",
      customer_phone: "+966500000001",
    },
  ];

  const results = await processRemindersBatch(reminders, mockSender);

  assert.equal(results.length, 1);
  assert.equal(results[0].id, "rem-1");
  assert.equal(results[0].success, false);
  assert.equal(results[0].error, "Network error");
});
