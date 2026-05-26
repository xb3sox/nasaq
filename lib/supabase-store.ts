import type { SupabaseClient } from "@supabase/supabase-js";
import type { ClinicStore, CreatedRow } from "./clinic-persistence.ts";

type QueryResult<T> = {
  data: T | null;
  error: { message?: string } | null;
};

type SupabaseLike = Pick<SupabaseClient, "from" | "rpc">;

export function createSupabaseClinicStore(client: SupabaseLike): ClinicStore {
  return {
    async recordWebhookEvent(input) {
      return single<CreatedRow>(
        client
          .from("webhook_events")
          .insert({
            clinic_id: input.clinicId,
            source: input.source,
            event: input.event,
            processed: false,
          })
          .select()
          .single(),
      );
    },

    async upsertCustomerByPhone(input) {
      return single<CreatedRow>(
        client
          .rpc("upsert_customer_by_phone", {
            p_clinic_id: input.clinicId,
            p_phone: input.phone,
            p_name: input.name,
          })
          .single(),
      );
    },

    async upsertConversation(input) {
      return single<CreatedRow>(
        client
          .from("conversations")
          .upsert({
            clinic_id: input.clinicId,
            customer_id: input.customerId,
            channel: "whatsapp",
            external_id: input.externalId,
            last_message: input.lastMessage,
            human_needed: input.humanNeeded,
            tags: input.tags,
          }, { onConflict: "clinic_id,external_id" })
          .select()
          .single(),
      );
    },

    async insertMessage(input) {
      return single<CreatedRow>(
        client
          .from("messages")
          .insert({
            conversation_id: input.conversationId,
            customer_id: input.customerId,
            direction: input.direction,
            body: input.body,
            external_id: input.externalId,
          })
          .select()
          .single(),
      );
    },

    async saveAiLog(input) {
      return single<CreatedRow>(
        client
          .from("ai_logs")
          .insert({
            clinic_id: input.clinicId,
            conversation_id: input.conversationId,
            user_input: input.userInput,
            ai_response: input.aiResponse,
            action: input.action,
            confidence: input.confidence,
            status: input.status,
          })
          .select()
          .single(),
      );
    },

    async setConversationHumanNeeded(input) {
      await result(
        client
          .from("conversations")
          .update({ human_needed: input.humanNeeded })
          .eq("id", input.conversationId),
      );
    },

    async createBooking(input) {
      return single<CreatedRow>(
        client
          .from("bookings")
          .insert({
            clinic_id: input.clinicId,
            customer_id: input.customerId,
            service_id: input.serviceId,
            doctor_id: input.doctorId,
            start_at: input.startAt,
            status: input.status,
            notes: input.notes,
          })
          .select()
          .single(),
      );
    },

    async createReminder(input) {
      return single<CreatedRow>(
        client
          .from("reminders")
          .insert({
            clinic_id: input.clinicId,
            booking_id: input.bookingId,
            customer_id: input.customerId,
            template_key: input.type,
            template_message: input.message,
            send_at: input.sendAt,
            status: "pending",
          })
          .select()
          .single(),
      );
    },

    async markCustomerBooked(input) {
      await result(
        client
          .from("customers")
          .update({ lead_status: "booked" })
          .eq("id", input.customerId),
      );
    },

    async recordDeadLetter(input) {
      return single<CreatedRow>(
        client
          .from("dead_letters")
          .insert({
            clinic_id: input.clinicId,
            kind: input.kind,
            payload: input.payload,
            error: input.error,
            created_at: new Date().toISOString(),
          })
          .select()
          .single(),
      );
    },




    async getDueReminders() {
      const { data, error } = await client
        .from("reminders")
        .select("id, clinic_id, customer_id, template_message, customers(phone)")
        .eq("status", "pending")
        .lte("send_at", new Date().toISOString());

      if (error) {
        throw new Error(error.message ?? "Supabase request failed");
      }

      type RowType = { id: string; clinic_id: string; customer_id: string; template_message: string; customers: { phone: string } | { phone: string }[] | null };

      return ((data as unknown as RowType[]) || []).map((row) => {
        let phone: string | undefined;
        if (Array.isArray(row.customers)) {
           phone = row.customers[0]?.phone;
        } else if (row.customers) {
           phone = row.customers.phone;
        }
        return {
          id: row.id,
          clinic_id: row.clinic_id,
          customer_id: row.customer_id,
          template_message: row.template_message,
          customer_phone: phone,
        };
      });
    },
  };
}





async function single<T>(promise: PromiseLike<QueryResult<T>>) {
  const { data, error } = await promise;

  if (error) {
    throw new Error(error.message ?? "Supabase request failed");
  }

  if (!data) {
    throw new Error("Supabase request returned no data");
  }

  return data;
}

async function result(promise: PromiseLike<QueryResult<unknown>>) {
  const { error } = await promise;

  if (error) {
    throw new Error(error.message ?? "Supabase request failed");
  }
}
