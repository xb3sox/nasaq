import { getWhatsAppSender } from "./whatsapp-send.ts";
import type { WhatsAppSender } from "./whatsapp-send.ts";
import type { ClinicStore } from "./clinic-persistence.ts";
import { DEMO_REMINDER_ROWS } from "./demo-data.ts";

export type ReminderRow = {
  id: string;
  clinic_id: string;
  customer_id: string;
  template_message: string;
  customer_phone?: string;
};

export type ReminderResult = {
  id: string;
  success: boolean;
  error?: string;
};

export async function getDueReminders(store?: ClinicStore | null): Promise<ReminderRow[]> {
  if (!store || !store.getDueReminders) {
    // Return demo reminders that are pending
    return DEMO_REMINDER_ROWS
      .filter((r) => r.status === "pending")
      .map((r) => ({
        id: r.id,
        clinic_id: "demo-clinic",
        customer_id: "demo-cust",
        template_message: r.template,
        customer_phone: r.phone,
      }));
  }

  return store.getDueReminders();
}

export async function processSingleReminder(
  reminder: ReminderRow,
  sender?: WhatsAppSender
): Promise<ReminderResult> {
  const whatsapp = sender ?? getWhatsAppSender();

  if (!reminder.customer_phone) {
    return {
      id: reminder.id,
      success: false,
      error: "Missing customer phone number",
    };
  }

  try {
    const sendResult = await whatsapp.send({
      to: reminder.customer_phone,
      body: reminder.template_message,
    });

    return {
      id: reminder.id,
      success: sendResult.ok,
      error: !sendResult.ok ? sendResult.error : undefined,
    };
  } catch (err) {
    return {
      id: reminder.id,
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

export async function processRemindersBatch(
  reminders: ReminderRow[],
  sender?: WhatsAppSender
): Promise<ReminderResult[]> {
  const whatsapp = sender ?? getWhatsAppSender();
  const results: ReminderResult[] = [];

  for (const reminder of reminders) {
    const result = await processSingleReminder(reminder, whatsapp);
    results.push(result);
  }

  return results;
}
