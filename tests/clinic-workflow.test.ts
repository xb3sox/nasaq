import test from "node:test";
import assert from "node:assert/strict";

import {
  analyzeClinicMessage,
  buildBookingConfirmation,
  buildReminderDrafts,
  extractWhatsAppInbound,
  normalizeSaudiPhone,
  generateAvailableSlots,
  hasBookingConflict,
  DEMO_DOCTOR_SCHEDULES,
  type DoctorSchedule,
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

test("generateAvailableSlots produces slots for working days", () => {
  const slots = generateAvailableSlots(DEMO_DOCTOR_SCHEDULES, [], 5);
  assert.ok(slots.length > 0, "should produce slots");
  // All slots should have required fields
  for (const s of slots) {
    assert.ok(s.label.length > 0);
    assert.ok(s.startsAt.length > 0);
    assert.ok(s.endsAt.length > 0);
    assert.ok(s.doctorName.length > 0);
    assert.ok(s.doctorId.length > 0);
    // startsAt should be before endsAt
    assert.ok(new Date(s.startsAt) < new Date(s.endsAt));
  }
});

test("generateAvailableSlots respects doctor working days", () => {
  // Create a doctor that only works Monday (day 1)
  const singleDayDoc: DoctorSchedule[] = [
    {
      doctorId: "dr-test",
      doctorName: "د. اختبار",
      workingDays: [1], // Monday only
      startHour: 9,
      endHour: 12,
      slotMinutes: 30,
    },
  ];
  const slots = generateAvailableSlots(singleDayDoc, [], 7);
  // All slots must be on Monday
  for (const s of slots) {
    const d = new Date(s.startsAt);
    assert.equal(d.getDay(), 1, `slot ${s.startsAt} should be Monday`);
  }
  assert.ok(slots.length > 0, "should have Monday slots");
});

test("generateAvailableSlots filters past slots", () => {
  const slots = generateAvailableSlots(DEMO_DOCTOR_SCHEDULES, [], 3);
  const now = new Date();
  for (const s of slots) {
    assert.ok(
      new Date(s.startsAt) >= now,
      `slot ${s.startsAt} should not be in the past`,
    );
  }
});

test("generateAvailableSlots excludes conflicted slots", () => {
  const slots = generateAvailableSlots(DEMO_DOCTOR_SCHEDULES, [], 1);
  if (slots.length === 0) return; // edge: no slots today
  const bookedSlot = slots[0];
  const afterBooking = generateAvailableSlots(
    DEMO_DOCTOR_SCHEDULES,
    [{ startsAt: bookedSlot.startsAt, doctorName: bookedSlot.doctorName }],
    1,
  );
  const stillFree = afterBooking.some(
    (s) =>
      s.startsAt === bookedSlot.startsAt &&
      s.doctorName === bookedSlot.doctorName,
  );
  assert.equal(stillFree, false, "conflicted slot should be excluded");
});

test("hasBookingConflict detects overlap", () => {
  const existing = [
    { startsAt: "2026-05-27T10:00:00+03:00", doctorName: "د. ريم السيف" },
  ];
  // Same time — conflict
  assert.equal(
    hasBookingConflict("2026-05-27T10:00:00+03:00", 30, existing, "د. ريم السيف"),
    true,
  );
  // Overlapping — conflict
  assert.equal(
    hasBookingConflict("2026-05-27T10:15:00+03:00", 30, existing, "د. ريم السيف"),
    true,
  );
  // Different doctor — no conflict
  assert.equal(
    hasBookingConflict("2026-05-27T10:00:00+03:00", 30, existing, "د. خالد المحسن"),
    false,
  );
  // Non-overlapping — no conflict
  assert.equal(
    hasBookingConflict("2026-05-27T11:00:00+03:00", 30, existing, "د. ريم السيف"),
    false,
  );
});
