import test from "node:test";
import assert from "node:assert/strict";

import {
  analyzeClinicMessage,
  buildBookingConfirmation,
  buildReminderDrafts,
  extractWhatsAppInbound,
  normalizeSaudiPhone,
} from "../lib/clinic-workflow.ts";

test("normalizes local Saudi mobile numbers to E.164", () => {
  assert.equal(normalizeSaudiPhone("050 123 4567"), "+966501234567");
  assert.equal(normalizeSaudiPhone("966501234567"), "+966501234567");
});

test("extracts inbound WhatsApp Cloud API text messages", () => {
  const inbound = extractWhatsAppInbound({
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
                  text: { body: "بكم تنظيف الأسنان؟ اليوم في موعد؟" },
                  type: "text",
                },
              ],
            },
          },
        ],
      },
    ],
  });

  assert.deepEqual(inbound, {
    externalMessageId: "wamid.demo",
    from: "+966501234567",
    customerName: "سارة أحمد",
    body: "بكم تنظيف الأسنان؟ اليوم في موعد؟",
    timestamp: "1779414300",
  });
});

test("detects booking intent and proposes safe clinic reply", () => {
  const result = analyzeClinicMessage("بكم تنظيف الأسنان؟ اليوم في موعد؟");

  assert.equal(result.intent, "booking");
  assert.equal(result.serviceCode, "DENT_CLEAN");
  assert.equal(result.humanNeeded, false);
  assert.equal(result.nextAction, "offer_slots");
  assert.match(result.reply, /250/);
  assert.match(result.reply, /\d+:\d+/);  // dynamic slot time
  assert.ok(
    (result.availableSlots ?? []).length > 0,
    "should offer at least one slot",
  );
});

test("escalates medical advice requests to human", () => {
  const result = analyzeClinicMessage("عندي ألم شديد ونزيف، ايش العلاج؟");

  assert.equal(result.intent, "medical_triage");
  assert.equal(result.humanNeeded, true);
  assert.equal(result.nextAction, "human_handoff");
});

test("builds confirmation and reminder drafts from booked slot", () => {
  const booking = buildBookingConfirmation({
    customerName: "سارة أحمد",
    serviceName: "تنظيف أسنان",
    doctorName: "د. ريم السيف",
    startsAt: "2026-05-22T16:00:00+03:00",
  });
  const reminders = buildReminderDrafts(booking);

  assert.equal(booking.status, "confirmed");
  assert.match(booking.message, /سارة أحمد/);
  assert.match(booking.message, /4:00/);
  assert.equal(reminders.length, 2);
  assert.equal(reminders[0].type, "24h_before");
  assert.equal(reminders[1].type, "2h_before");
});
