import test from "node:test";
import assert from "node:assert/strict";

import { createSupabaseClinicStore } from "../lib/supabase-store.ts";

function fakeSupabaseClient() {
  const calls: Array<{ op: string; table?: string; name?: string; payload?: unknown }> = [];
  const client = {
    calls,
    rpc(name: string, payload: unknown) {
      calls.push({ op: "rpc", name, payload });
      return {
        single: async () => ({ data: { id: "customer-1" }, error: null }),
      };
    },
    from(table: string) {
      return {
        insert(payload: unknown) {
          calls.push({ op: "insert", table, payload });
          return {
            select() {
              return {
                single: async () => ({ data: { id: `${table}-1` }, error: null }),
              };
            },
          };
        },
        upsert(payload: unknown) {
          calls.push({ op: "upsert", table, payload });
          return {
            select() {
              return {
                single: async () => ({ data: { id: `${table}-1` }, error: null }),
              };
            },
          };
        },
        update(payload: unknown) {
          calls.push({ op: "update", table, payload });
          return {
            eq: async () => ({ data: null, error: null }),
          };
        },
      };
    },
  };

  return client;
}

test("Supabase store upserts customer through phone RPC", async () => {
  const client = fakeSupabaseClient();
  const store = createSupabaseClinicStore(client);

  const row = await store.upsertCustomerByPhone({
    clinicId: "clinic-1",
    phone: "+966501234567",
    name: "سارة أحمد",
  });

  assert.equal(row.id, "customer-1");
  assert.deepEqual(client.calls[0], {
    op: "rpc",
    name: "upsert_customer_by_phone",
    payload: {
      p_clinic_id: "clinic-1",
      p_phone: "+966501234567",
      p_name: "سارة أحمد",
    },
  });
});

test("Supabase store maps confirmed booking to bookings table columns", async () => {
  const client = fakeSupabaseClient();
  const store = createSupabaseClinicStore(client);

  const row = await store.createBooking({
    clinicId: "clinic-1",
    customerId: "customer-1",
    serviceId: "service-1",
    doctorId: "doctor-1",
    startAt: "2026-05-22T16:00:00+03:00",
    status: "confirmed",
    notes: "confirmed by AI",
  });

  assert.equal(row.id, "bookings-1");
  assert.deepEqual(client.calls[0], {
    op: "insert",
    table: "bookings",
    payload: {
      clinic_id: "clinic-1",
      customer_id: "customer-1",
      service_id: "service-1",
      doctor_id: "doctor-1",
      start_at: "2026-05-22T16:00:00+03:00",
      status: "confirmed",
      notes: "confirmed by AI",
    },
  });
});

test("Supabase store maps reminder queue to reminders table columns", async () => {
  const client = fakeSupabaseClient();
  const store = createSupabaseClinicStore(client);

  const row = await store.createReminder({
    clinicId: "clinic-1",
    bookingId: "booking-1",
    customerId: "customer-1",
    type: "24h_before",
    sendAt: "2026-05-21T13:00:00.000Z",
    message: "تذكير",
  });

  assert.equal(row.id, "reminders-1");
  assert.deepEqual(client.calls[0], {
    op: "insert",
    table: "reminders",
    payload: {
      clinic_id: "clinic-1",
      booking_id: "booking-1",
      customer_id: "customer-1",
      template_key: "24h_before",
      template_message: "تذكير",
      send_at: "2026-05-21T13:00:00.000Z",
      status: "pending",
    },
  });
});
