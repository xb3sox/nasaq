import { generateAvailableSlots, DEMO_DOCTOR_SCHEDULES } from "./clinic-scheduling.ts";

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
    const slots = wantsBooking
      ? generateAvailableSlots(DEMO_DOCTOR_SCHEDULES, [], 5).slice(0, 3)
      : [];
    const slotText =
      slots.length > 0
        ? slots.map((s) => `${s.label} مع ${s.doctorName}`).join(" أو ")
        : "أتصل بالعيادة لتأكيد المواعيد المتاحة";

    return {
      intent: wantsBooking ? "booking" : "pricing",
      serviceCode: "DENT_CLEAN",
      serviceName: "تنظيف أسنان",
      confidence: 0.91,
      humanNeeded: false,
      nextAction: wantsBooking ? "offer_slots" : "answer_price",
      availableSlots: slots.map((s) => ({
        label: s.label,
        startsAt: s.startsAt,
        doctorName: s.doctorName,
      })),
      reply:
        wantsBooking
          ? `أهلاً بك. سعر تنظيف الأسنان 250 ريال. متاح ${slotText}. أي وقت يناسبك؟`
          : `سعر تنظيف الأسنان 250 ريال. للحجز، أرسل "أريد موعد" وسأعرض لك الأوقات المتاحة.`,
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

function containsAny(text: string, needles: string[]) {
  return needles.some((needle) => text.includes(needle.toLowerCase()));
}

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
