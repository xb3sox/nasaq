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

export function formatRiyadhTime(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Riyadh",
  })
    .format(new Date(value))
    .replace(/\s?(AM|PM)$/i, "");
}
