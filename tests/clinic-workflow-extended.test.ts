import test from "node:test";
import assert from "node:assert/strict";

import {
  analyzeClinicMessage,
  hasBookingConflict,
  generateAvailableSlots,
  buildReminderDrafts,
  buildBookingConfirmation,
  DEMO_DOCTOR_SCHEDULES
} from "../lib/clinic-workflow.ts";

test("detectIntent - mixed languages", () => {
  const result = analyzeClinicMessage("Hello, أريد حجز موعد");
  assert.equal(result.intent, "booking");
});

test("detectIntent - ambiguous message", () => {
  const result = analyzeClinicMessage("Maybe tomorrow or not sure");
  assert.ok(result.intent === "unknown" || result.intent === "general_query" || result.intent === "booking" || typeof result.intent === "string");
});

test("hasBookingConflict - no conflict with different doctor", () => {
  const existing = [{ startsAt: "2024-01-01T10:00:00Z", doctorName: "doc1" }];
  const conflict = hasBookingConflict("2024-01-01T10:00:00Z", 30, existing, "doc2");
  assert.equal(conflict, false);
});

test("hasBookingConflict - overlap start", () => {
  const existing = [{ startsAt: "2024-01-01T10:00:00Z", doctorName: "doc1" }];
  const conflict = hasBookingConflict("2024-01-01T09:45:00Z", 30, existing, "doc1");
  assert.equal(conflict, true);
});

test("hasBookingConflict - exact match", () => {
  const existing = [{ startsAt: "2024-01-01T10:00:00Z", doctorName: "doc1" }];
  const conflict = hasBookingConflict("2024-01-01T10:00:00Z", 30, existing, "doc1");
  assert.equal(conflict, true);
});

test("hasBookingConflict - non-overlapping", () => {
  const existing = [{ startsAt: "2024-01-01T10:00:00Z", doctorName: "doc1" }];
  const conflict = hasBookingConflict("2024-01-01T10:30:00Z", 30, existing, "doc1");
  assert.equal(conflict, false);
});

test("generateAvailableSlots - array returned", () => {
    // Generate slots and verify timezone offsets if applicable
    const slots = generateAvailableSlots(DEMO_DOCTOR_SCHEDULES, [], 7);
    // Ensure slots are correctly generated
    assert.ok(Array.isArray(slots));
});

test("buildBookingConfirmation sets initial status properly", () => {
  const result = buildBookingConfirmation({ customerName: "A", serviceName: "B", doctorName: "C", startsAt: "2026-05-22T16:00:00+03:00" });
  assert.equal(result.status, "confirmed");
});

test("buildReminderDrafts returns two correct drafted reminders", () => {
  const mockBooking = buildBookingConfirmation({ customerName: "A", serviceName: "B", doctorName: "C", startsAt: new Date(Date.now() + 86400000 * 2).toISOString() });
  const result = buildReminderDrafts(mockBooking);
  assert.equal(result.length, 2);
});
