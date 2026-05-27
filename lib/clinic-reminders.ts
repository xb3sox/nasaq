import { formatRiyadhTime } from "./clinic-scheduling.ts";

export type BookingConfirmationInput = {
  customerName: string;
  serviceName: string;
  doctorName: string;
  startsAt: string;
};

export type BookingConfirmation = BookingConfirmationInput & {
  status: "confirmed";
  message: string;
};

export type ReminderDraft = {
  type: "24h_before" | "2h_before";
  sendAt: string;
  message: string;
};

export function buildBookingConfirmation(input: BookingConfirmationInput): BookingConfirmation {
  const time = formatRiyadhTime(input.startsAt);

  return {
    ...input,
    status: "confirmed",
    message: `تم تأكيد موعدك يا ${input.customerName}: ${input.serviceName} مع ${input.doctorName} الساعة ${time}. نسعد بخدمتك في عيادات النخبة.`,
  };
}

export function buildReminderDrafts(booking: BookingConfirmation): ReminderDraft[] {
  const startsAt = new Date(booking.startsAt);
  const dayBefore = new Date(startsAt.getTime() - 24 * 60 * 60 * 1000);
  const twoHoursBefore = new Date(startsAt.getTime() - 2 * 60 * 60 * 1000);

  return [
    {
      type: "24h_before",
      sendAt: dayBefore.toISOString(),
      message: `تذكير: موعدك غداً مع ${booking.doctorName} الساعة ${formatRiyadhTime(booking.startsAt)} — ${booking.serviceName}`,
    },
    {
      type: "2h_before",
      sendAt: twoHoursBefore.toISOString(),
      message: `تذكير: موعدك خلال ساعتين مع ${booking.doctorName} الساعة ${formatRiyadhTime(booking.startsAt)}`,
    },
  ];
}
