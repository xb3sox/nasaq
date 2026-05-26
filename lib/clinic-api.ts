import {
  buildBookingConfirmation,
  buildReminderDrafts,
  extractWhatsAppInbound,
} from "./clinic-workflow.ts";
import {
  persistConfirmedBooking,
  persistInboundWorkflow,
  type ClinicStore,
} from "./clinic-persistence.ts";
import { getWhatsAppSender, type WhatsAppSender } from "./whatsapp-send.ts";
import { getAiProvider, type AiProvider } from "./ai-provider.ts";

export type { ClinicStore };

export type PersistenceResult =
  | { mode: "mock" }
  | ({
      mode: "supabase";
    } & Record<string, string | string[]>);

// ─── Inbound webhook ──────────────────────────────────────────────────────────

export async function handleWhatsAppWebhook(input: {
  clinicId: string;
  payload: unknown;
  store?: ClinicStore | null;
  aiProvider?: AiProvider | null;
}) {
  const inbound = extractWhatsAppInbound(input.payload);

  if (!inbound) {
    return {
      success: true,
      ignored: true,
      reason: "No inbound text message found",
    };
  }

  const [ai] = await Promise.all([
    (input.aiProvider ?? getAiProvider()).analyze(inbound.body),
  ]);

  const bookingDraft = ai.availableSlots?.[0]
    ? buildBookingConfirmation({
        customerName: inbound.customerName,
        serviceName: ai.serviceName ?? "خدمة طبية",
        doctorName: ai.availableSlots[0].doctorName,
        startsAt: ai.availableSlots[0].startsAt,
      })
    : null;
  const reminderDrafts = bookingDraft ? buildReminderDrafts(bookingDraft) : [];
  const persistence: PersistenceResult = input.store
    ? {
        mode: "supabase",
        ...(await persistInboundWorkflow({
          store: input.store,
          clinicId: input.clinicId,
          rawPayload: input.payload,
          inbound,
          ai,
        })),
      }
    : { mode: "mock" };

  return {
    success: true,
    customer: {
      name: inbound.customerName,
      phone: inbound.from,
    },
    conversation: {
      externalMessageId: inbound.externalMessageId,
      inbound: inbound.body,
    },
    ai,
    bookingDraft,
    reminderDrafts,
    persistence,
  };
}

// ─── Booking ──────────────────────────────────────────────────────────────────

export async function handleCreateBooking(input: {
  clinicId: string;
  body: Record<string, string | undefined>;
  store?: ClinicStore | null;
}) {
  const booking = buildBookingConfirmation({
    customerName: input.body.customerName ?? "عميل واتساب",
    serviceName: input.body.serviceName ?? "تنظيف أسنان",
    doctorName: input.body.doctorName ?? "د. ريم السيف",
    startsAt: input.body.startsAt ?? "2026-05-22T16:00:00+03:00",
  });
  const reminders = buildReminderDrafts(booking);
  const customerId = input.body.customerId;

  const persistence =
    input.store && customerId
      ? {
          mode: "supabase" as const,
          ...(await persistConfirmedBooking({
            store: input.store,
            clinicId: input.clinicId,
            customerId,
            serviceId: input.body.serviceId,
            doctorId: input.body.doctorId,
            booking,
            reminders,
          })),
        }
      : { mode: "mock" as const };

  return {
    success: true,
    booking,
    reminders,
    persistence,
  };
}

// ─── Outbound send ────────────────────────────────────────────────────────────

export async function handleSendMessage(input: {
  clinicId: string;
  to: string;
  body: string;
  conversationId: string;
  customerId: string;
  store?: ClinicStore | null;
  sender?: WhatsAppSender;
}) {
  const sender = input.sender ?? getWhatsAppSender();
  const sendResult = await sender.send({ to: input.to, body: input.body });

  if (!sendResult.ok) {
    if (input.store) {
      try {
        await input.store.recordDeadLetter({
          clinicId: input.clinicId,
          kind: "whatsapp_send_failure",
          payload: { to: input.to, body: input.body, conversationId: input.conversationId },
          error: sendResult.error,
        });
      } catch {
        // best-effort: dead letter logging must not throw
      }
    }
    return {
      success: false as const,
      error: sendResult.error,
    };
  }

  const persistence: PersistenceResult = input.store
    ? {
        mode: "supabase" as const,
        ...(await (async () => {
          const msg = await input.store!.insertMessage({
            conversationId: input.conversationId,
            customerId: input.customerId,
            direction: "outbound",
            body: input.body,
            externalId: sendResult.messageId,
          });
          return { messageId: msg.id };
        })()),
      }
    : { mode: "mock" as const };

  return {
    success: true as const,
    messageId: sendResult.messageId,
    persistence,
  };
}