import type {
  BookingConfirmation,
  ClinicAiDecision,
  ReminderDraft,
  WhatsAppInbound,
} from "./clinic-workflow.ts";

export type CreatedRow = {
  id: string;
};

export type DueReminderRow = {
  id: string;
  clinic_id: string;
  customer_id: string;
  template_message: string;
  customer_phone?: string;
};

export type ClinicStore = {
  recordWebhookEvent(input: {
    clinicId: string;
    source: string;
    event: unknown;
  }): Promise<CreatedRow>;
  upsertCustomerByPhone(input: {
    clinicId: string;
    phone: string;
    name: string;
  }): Promise<CreatedRow>;
  upsertConversation(input: {
    clinicId: string;
    customerId: string;
    externalId: string;
    lastMessage: string;
    humanNeeded: boolean;
    tags: string[];
  }): Promise<CreatedRow>;
  insertMessage(input: {
    conversationId: string;
    customerId: string;
    direction: "inbound" | "outbound";
    body: string;
    externalId?: string;
  }): Promise<CreatedRow>;
  saveAiLog(input: {
    clinicId: string;
    conversationId: string;
    userInput: string;
    aiResponse: ClinicAiDecision;
    action: string;
    confidence: number;
    status: string;
  }): Promise<CreatedRow>;
  setConversationHumanNeeded(input: {
    conversationId: string;
    humanNeeded: boolean;
  }): Promise<void>;
  createBooking(input: {
    clinicId: string;
    customerId: string;
    serviceId?: string;
    doctorId?: string;
    startAt: string;
    status: "confirmed";
    notes?: string;
  }): Promise<CreatedRow>;
  createReminder(input: {
    clinicId: string;
    bookingId: string;
    customerId: string;
    type: ReminderDraft["type"];
    sendAt: string;
    message: string;
  }): Promise<CreatedRow>;
  markCustomerBooked(input: {
    customerId: string;
  }): Promise<void>;
  recordDeadLetter(input: {
    clinicId: string;
    kind: string;
    payload: unknown;
    error: string;
  }): Promise<CreatedRow>;
  getDueReminders?: () => Promise<DueReminderRow[]>;
};

export async function persistInboundWorkflow(input: {
  store: ClinicStore;
  clinicId: string;
  rawPayload: unknown;
  inbound: WhatsAppInbound;
  ai: ClinicAiDecision;
}) {
  await input.store.recordWebhookEvent({
    clinicId: input.clinicId,
    source: "whatsapp",
    event: input.rawPayload,
  });

  const customer = await input.store.upsertCustomerByPhone({
    clinicId: input.clinicId,
    phone: input.inbound.from,
    name: input.inbound.customerName,
  });

  const conversation = await input.store.upsertConversation({
    clinicId: input.clinicId,
    customerId: customer.id,
    externalId: input.inbound.from,
    lastMessage: input.inbound.body,
    humanNeeded: input.ai.humanNeeded,
    tags: [input.ai.intent],
  });

  const message = await input.store.insertMessage({
    conversationId: conversation.id,
    customerId: customer.id,
    direction: "inbound",
    body: input.inbound.body,
    externalId: input.inbound.externalMessageId,
  });

  const aiLog = await input.store.saveAiLog({
    clinicId: input.clinicId,
    conversationId: conversation.id,
    userInput: input.inbound.body,
    aiResponse: input.ai,
    action: input.ai.nextAction,
    confidence: input.ai.confidence,
    status: input.ai.humanNeeded ? "human_needed" : "suggested",
  });

  await input.store.setConversationHumanNeeded({
    conversationId: conversation.id,
    humanNeeded: input.ai.humanNeeded,
  });

  return {
    customerId: customer.id,
    conversationId: conversation.id,
    messageId: message.id,
    aiLogId: aiLog.id,
  };
}

export async function persistConfirmedBooking(input: {
  store: ClinicStore;
  clinicId: string;
  customerId: string;
  serviceId?: string;
  doctorId?: string;
  booking: BookingConfirmation;
  reminders: ReminderDraft[];
}) {
  const booking = await input.store.createBooking({
    clinicId: input.clinicId,
    customerId: input.customerId,
    serviceId: input.serviceId,
    doctorId: input.doctorId,
    startAt: input.booking.startsAt,
    status: "confirmed",
    notes: input.booking.message,
  });

  const reminders = [];
  for (const reminder of input.reminders) {
    const row = await input.store.createReminder({
      clinicId: input.clinicId,
      bookingId: booking.id,
      customerId: input.customerId,
      type: reminder.type,
      sendAt: reminder.sendAt,
      message: reminder.message,
    });
    reminders.push(row);
  }

  await input.store.markCustomerBooked({
    customerId: input.customerId,
  });

  return {
    bookingId: booking.id,
    reminderIds: reminders.map((reminder) => reminder.id),
  };
}
