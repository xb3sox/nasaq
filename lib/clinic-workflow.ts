// Barrel — re-exports from split clinic modules.
// All original exports preserved for backward compatibility.

export type {
  ClinicIntent,
  WorkflowAction,
  ClinicAiDecision,
  WhatsAppInbound,
} from "./clinic-intent.ts";
export { analyzeClinicMessage } from "./clinic-intent.ts";

export type {
  DoctorSchedule,
  TimeSlot,
} from "./clinic-scheduling.ts";
export {
  DEMO_DOCTOR_SCHEDULES,
  generateAvailableSlots,
  hasBookingConflict,
  formatRiyadhTime,
} from "./clinic-scheduling.ts";

export type {
  BookingConfirmationInput,
  BookingConfirmation,
  ReminderDraft,
} from "./clinic-reminders.ts";
export {
  buildBookingConfirmation,
  buildReminderDrafts,
} from "./clinic-reminders.ts";

// WhatsApp-related helpers kept here (utility functions cross-cutting intent/scheduling)
export { normalizeSaudiPhone, extractWhatsAppInbound } from "./clinic-intent.ts";
