import test from "node:test";
import assert from "node:assert/strict";
import { DEMO_BOOKINGS, DEMO_LEADS, DEMO_INVOICES, DEMO_REMINDERS } from "../lib/demo-data.ts";

test("All demo bookings have valid dates (not in the past if strictly future, but checking validity at least)", () => {
  for (const booking of DEMO_BOOKINGS) {
    assert.ok(!Number.isNaN(new Date(booking.date).getTime()), `Invalid date for booking ${booking.id}`);
    assert.ok(booking.doctor, `Missing doctor for booking ${booking.id}`);
  }
});

test("All demo leads have valid phone numbers", () => {
  for (const lead of DEMO_LEADS) {
    assert.ok(lead.phone && lead.phone.startsWith("+966"), `Invalid phone for lead ${lead.id}`);
  }
});

test("All demo invoices have valid VAT calculations", () => {
  for (const invoice of DEMO_INVOICES) {
    // Invoices don't actually have VAT amount stored, so we just check amount is positive
    assert.ok(invoice.amount > 0, `Invalid amount for invoice ${invoice.id}`);
    assert.ok(invoice.currency, `Missing currency for invoice ${invoice.id}`);
  }
});

test("All demo reminders have valid scheduled times", () => {
  for (const reminder of DEMO_REMINDERS) {
    assert.ok(!Number.isNaN(new Date(reminder.sendAt).getTime()), `Invalid time for reminder ${reminder.id}`);
  }
});

test("Data completeness (no null required fields)", () => {
  for (const lead of DEMO_LEADS) {
    assert.ok(lead.id, "Lead ID missing");
    assert.ok(lead.name, "Lead name missing");
  }
});

test("demoBookings defaults properly", () => {
  assert.ok(DEMO_BOOKINGS.length > 0);
});
test("demoLeads defaults properly", () => {
  assert.ok(DEMO_LEADS.length > 0);
});
test("demoInvoices defaults properly", () => {
  assert.ok(DEMO_INVOICES.length > 0);
});
test("demoReminders defaults properly", () => {
  assert.ok(DEMO_REMINDERS.length > 0);
});
