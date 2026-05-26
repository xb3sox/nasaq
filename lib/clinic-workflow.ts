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

export type DoctorSchedule = {
  doctorId: string;
  doctorName: string;
  workingDays: number[]; // 0=Sun … 6=Sat (Saudi week: Sun–Thu)
  startHour: number;    // 9 = 9AM
  endHour: number;      // 17 = 5PM
  slotMinutes: number;  // default 30
};

export type TimeSlot = {
  label: string;
  startsAt: string;
  endsAt: string;
  doctorName: string;
  doctorId: string;
};

// ─── Demo doctor schedules (Sun–Thu, 9AM–5PM) ────────────────────────────────

export const DEMO_DOCTOR_SCHEDULES: DoctorSchedule[] = [
  {
    doctorId: "dr-reem",
    doctorName: "د. ريم السيف",
    workingDays: [0, 1, 2, 3, 4], // Sun–Thu
    startHour: 9,
    endHour: 17,
    slotMinutes: 30,
  },
  {
    doctorId: "dr-khalid",
    doctorName: "د. خالد المحسن",
    workingDays: [0, 1, 2, 3, 4],
    startHour: 10,
    endHour: 18,
    slotMinutes: 30,
  },
  {
    doctorId: "dr-sara",
    doctorName: "د. سارة العتيبي",
    workingDays: [0, 1, 2, 3], // Sun–Wed
    startHour: 9,
    endHour: 14,
    slotMinutes: 30,
  },
];

// ─── Slot generation ──────────────────────────────────────────────────────────

export function generateAvailableSlots(
  doctors: DoctorSchedule[],
  existingBookings: Array<{ startsAt: string; doctorName: string; durationMin?: number }>,
  daysAhead = 3,
): TimeSlot[] {
  const now = new Date();
  const slots: TimeSlot[] = [];

  for (let d = 0; d < daysAhead; d++) {
    const date = new Date(now);
    date.setDate(date.getDate() + d);
    const dayOfWeek = date.getDay(); // 0=Sun in JS

    for (const doc of doctors) {
      if (!doc.workingDays.includes(dayOfWeek)) continue;

      for (let h = doc.startHour; h < doc.endHour; h++) {
        for (let m = 0; m < 60; m += doc.slotMinutes) {
          const start = new Date(date);
          start.setHours(h, m, 0, 0);
          if (start <= now) continue; // skip past slots

          const end = new Date(start.getTime() + doc.slotMinutes * 60_000);
          const startsAt = start.toISOString();
          const endsAt = end.toISOString();

          // conflict check
          const conflicted = existingBookings.some(
            (b) => {
              if (b.doctorName !== doc.doctorName) return false;
              const bStart = new Date(b.startsAt).getTime();
              const bDuration = b.durationMin ?? 30;
              const bEnd = bStart + bDuration * 60_000;
              return bStart < end.getTime() && bEnd > start.getTime();
            },
          );
          if (conflicted) continue;

          const label = `${formatRiyadhDate(start)} ${formatRiyadhTime(startsAt)}`;

          slots.push({
            label,
            startsAt,
            endsAt,
            doctorName: doc.doctorName,
            doctorId: doc.doctorId,
          });
        }
      }
    }
  }

  return slots;
}

export function hasBookingConflict(
  requestedStart: string,
  durationMin: number,
  existingBookings: Array<{ startsAt: string; doctorName: string; durationMin?: number }>,
  doctorName: string,
): boolean {
  const reqStart = new Date(requestedStart).getTime();
  const reqEnd = reqStart + durationMin * 60_000;

  return existingBookings.some((b) => {
    if (b.doctorName !== doctorName) return false;
    const bStart = new Date(b.startsAt).getTime();
    const bDuration = b.durationMin ?? 30;
    const bEnd = bStart + bDuration * 60_000;
    return bStart < reqEnd && bEnd > reqStart;
  });
}

function formatRiyadhDate(d: Date): string {
  return new Intl.DateTimeFormat("ar-SA-u-ca-gregory", {
    weekday: "short",
    month: "numeric",
    day: "numeric",
    timeZone: "Asia/Riyadh",
  }).format(d);
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
      ? generateAvailableSlots(DEMO_DOCTOR_SCHEDULES, []).slice(0, 3)
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
