export type ClinicIntent =
  | "booking"
  | "pricing"
  | "cancel"
  | "reschedule"
  | "medical_triage"
  | "unknown";

export type WorkflowAction =
  | "offer_slots"
  | "answer_price"
  | "cancel_booking"
  | "reschedule_booking"
  | "human_handoff"
  | "ask_clarifying_question";

export type ClinicAiDecision = {
  intent: ClinicIntent;
  serviceCode?: string;
  serviceName?: string;
  confidence: number;
  humanNeeded: boolean;
  nextAction: WorkflowAction;
  reply: string;
  availableSlots?: Array<{
    label: string;
    startsAt: string;
    doctorName: string;
  }>;
};

export type WhatsAppInbound = {
  externalMessageId: string;
  from: string;
  customerName: string;
  body: string;
  timestamp?: string;
};

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

const DENTAL_CLEANING_SLOTS = [
  {
    label: "اليوم 4:00 مساء",
    startsAt: "2026-05-22T16:00:00+03:00",
    doctorName: "د. ريم السيف",
  },
  {
    label: "اليوم 7:00 مساء",
    startsAt: "2026-05-22T19:00:00+03:00",
    doctorName: "د. ريم السيف",
  },
];

export function normalizeSaudiPhone(input: string) {
  const digits = input.replace(/\D/g, "");

  if (digits.startsWith("966")) {
    return `+${digits}`;
  }

  if (digits.startsWith("05") && digits.length === 10) {
    return `+966${digits.slice(1)}`;
  }

  if (digits.startsWith("5") && digits.length === 9) {
    return `+966${digits}`;
  }

  return input.startsWith("+") ? input : `+${digits}`;
}

export function extractWhatsAppInbound(payload: unknown): WhatsAppInbound | null {
  const root = payload as {
    entry?: Array<{
      changes?: Array<{
        value?: {
          contacts?: Array<{ wa_id?: string; profile?: { name?: string } }>;
          messages?: Array<{
            id?: string;
            from?: string;
            timestamp?: string;
            text?: { body?: string };
            type?: string;
          }>;
        };
      }>;
    }>;
  };

  const value = root.entry?.[0]?.changes?.[0]?.value;
  const message = value?.messages?.[0];

  if (!message?.from || message.type !== "text" || !message.text?.body) {
    return null;
  }

  return {
    externalMessageId: message.id ?? `local-${Date.now()}`,
    from: normalizeSaudiPhone(message.from),
    customerName: value?.contacts?.[0]?.profile?.name ?? "عميل واتساب",
    body: message.text.body,
    timestamp: message.timestamp,
  };
}

export function analyzeClinicMessage(message: string): ClinicAiDecision {
  const text = message.trim().toLowerCase();

  if (containsAny(text, ["نزيف", "ألم شديد", "الم شديد", "طوارئ", "العلاج", "دواء", "تشخيص"])) {
    return {
      intent: "medical_triage",
      confidence: 0.94,
      humanNeeded: true,
      nextAction: "human_handoff",
      reply:
        "سلامتك تهمنا. هذه الحالة تحتاج مراجعة موظف أو طبيب، وسأحوّل المحادثة الآن للفريق المختص. إذا الحالة طارئة يرجى التوجه للطوارئ فوراً.",
    };
  }

  if (containsAny(text, ["الغاء", "إلغاء", "ألغي", "الغي"])) {
    return {
      intent: "cancel",
      confidence: 0.88,
      humanNeeded: false,
      nextAction: "cancel_booking",
      reply: "تم استلام طلب الإلغاء. أرسل رقم جوالك أو وقت الموعد حتى نؤكد الإلغاء أو نعيد جدولته لك.",
    };
  }

  if (containsAny(text, ["غير", "تغيير", "أغير", "اغير", "إعادة جدولة", "اعادة جدولة"])) {
    return {
      intent: "reschedule",
      confidence: 0.86,
      humanNeeded: false,
      nextAction: "reschedule_booking",
      reply: "أكيد. أرسل الوقت المناسب لك وسنقترح أقرب المواعيد المتاحة.",
    };
  }

  if (containsAny(text, ["تنظيف", "اسنان", "أسنان", "سعر", "بكم", "موعد", "حجز", "اليوم"])) {
    const wantsBooking = containsAny(text, ["موعد", "حجز", "اليوم", "متاح", "فاضي"]);
    return {
      intent: wantsBooking ? "booking" : "pricing",
      serviceCode: "DENT_CLEAN",
      serviceName: "تنظيف أسنان",
      confidence: 0.91,
      humanNeeded: false,
      nextAction: wantsBooking ? "offer_slots" : "answer_price",
      availableSlots: DENTAL_CLEANING_SLOTS,
      reply:
        "أهلاً بك. سعر تنظيف الأسنان 250 ريال. متاح اليوم 4:00 مساء أو 7:00 مساء مع د. ريم السيف. أي وقت يناسبك؟",
    };
  }

  return {
    intent: "unknown",
    confidence: 0.52,
    humanNeeded: true,
    nextAction: "ask_clarifying_question",
    reply: "أهلاً بك. هل ترغب بحجز موعد، معرفة الأسعار، أو التواصل مع موظف الاستقبال؟",
  };
}

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
      message: `تذكير: موعدك غداً الساعة ${formatRiyadhTime(booking.startsAt)} في عيادات النخبة.`,
    },
    {
      type: "2h_before",
      sendAt: twoHoursBefore.toISOString(),
      message: `تذكير سريع: موعدك بعد ساعتين مع ${booking.doctorName}.`,
    },
  ];
}

function containsAny(text: string, needles: string[]) {
  return needles.some((needle) => text.includes(needle.toLowerCase()));
}

function formatRiyadhTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Riyadh",
  })
    .format(new Date(value))
    .replace(/\s?(AM|PM)$/i, "");
}
