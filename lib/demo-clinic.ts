/**
 * Compatibility shim — re-exports from canonical demo-data.ts with camelCase naming.
 *
 * All new code should import directly from "@/lib/demo-data".
 * This file exists only for backward compatibility with existing consumers.
 *
 * TODO: Remove this file once all consumers have migrated to demo-data.
 * Deadline: Phase 3.2b migration complete.
 */

import {
  DEMO_CLINIC_ID,
  DEMO_CLINICS,
  DEMO_SERVICES,
  DEMO_DOCTORS,
  DEMO_CUSTOMERS,
  DEMO_CONVERSATIONS,
  DEMO_BOOKINGS,
} from "./demo-data.ts";

import { analyzeClinicMessage, buildBookingConfirmation, buildReminderDrafts } from "./clinic-workflow.ts";

export { DEMO_CLINIC_ID };

export const demoClinic = {
  id: DEMO_CLINIC_ID,
  name: DEMO_CLINICS[0].name,
  branch: DEMO_CLINICS[0].branchName,
  phone: DEMO_CLINICS[0].phone,
};

export const demoServices = DEMO_SERVICES.map(({ code, name, price, durationMin }) => ({
  code,
  name,
  price,
  durationMinutes: durationMin,
}));

export const demoStaff = DEMO_DOCTORS.map(({ id, name, specialty }) => ({
  id,
  name,
  title: specialty,
}));

export const demoCustomers = DEMO_CUSTOMERS.map(({ id, name, phone, leadStatus, tags }) => ({
  id,
  name,
  phone,
  lead_status: leadStatus,
  source: tags.includes("booking") ? "whatsapp" : "instagram",
  last_interaction: leadStatus === "booked" ? "الآن" : leadStatus === "contacted" ? "اليوم" : "بالأمس",
  tags,
}));

export const demoConversation = {
  id: DEMO_CONVERSATIONS[0].id,
  customerId: DEMO_CONVERSATIONS[0].customerId,
  customerName: DEMO_CONVERSATIONS[0].customerName,
  phone: DEMO_CONVERSATIONS[0].phone,
  status: "bot_handling",
  lastMessageAt: "04:24",
  messages: [
    {
      id: "m1",
      sender: "bot",
      body: "أهلاً بك في عيادات النخبة. كيف نقدر نخدمك؟",
      time: "04:23",
    },
    {
      id: "m2",
      sender: "customer",
      body: "بكم تنظيف الأسنان؟ اليوم في موعد؟",
      time: "04:24",
    },
  ],
};

export const demoAiDecision = analyzeClinicMessage("بكم تنظيف الأسنان؟ اليوم في موعد؟");

export const demoBooking = buildBookingConfirmation({
  customerName: "سارة أحمد",
  serviceName: "تنظيف أسنان",
  doctorName: "د. ريم السيف",
  startsAt: "2026-05-22T16:00:00+03:00",
});

export const demoReminders = buildReminderDrafts(demoBooking);

export const demoBookings = DEMO_BOOKINGS.map(({ id, customer, phone, service, doctor, date, time, status, paymentStatus, source }) => ({
  id,
  customer,
  phone,
  service,
  doctor,
  date,
  time,
  status,
  payment_status: paymentStatus,
  source,
}));

export const demoReminderRows = [
  {
    id: "rem-sarah-24h",
    customer: "سارة أحمد",
    phone: "+966****4567",
    template: "تذكير قبل 24 ساعة",
    scheduled_for: "2026-05-21 16:00",
    status: "pending",
    type: "appointment_24h",
  },
  {
    id: "rem-sarah-2h",
    customer: "سارة أحمد",
    phone: "+966****4567",
    template: "تذكير قبل ساعتين",
    scheduled_for: "2026-05-22 14:00",
    status: "pending",
    type: "appointment_2h",
  },
  {
    id: "rem-followup",
    customer: "فهد الحربي",
    phone: "+966****1003",
    template: "متابعة بعد الزيارة",
    scheduled_for: "2026-05-23 10:00",
    status: "sent",
    type: "post_visit",
  },
];

export const demoReportStats = {
  todayBookings: 3,
  aiHandled: 32,
  humanNeeded: 4,
  newLeads: 8,
  monthRevenue: 24500,
  conversionRate: 68,
};
