import { analyzeClinicMessage, buildBookingConfirmation, buildReminderDrafts } from "./clinic-workflow.ts";

export const DEMO_CLINIC_ID = "00000000-0000-0000-0000-000000000001";

export const demoClinic = {
  id: DEMO_CLINIC_ID,
  name: "عيادات النخبة الطبية",
  branch: "المالقا، الرياض",
  phone: "+966500000001",
};

export const demoServices = [
  { code: "CONS_GEN", name: "استشارة عامة", price: 150, durationMinutes: 30 },
  { code: "DENT_CLEAN", name: "تنظيف أسنان", price: 250, durationMinutes: 45 },
  { code: "DERM_PROC", name: "إجراء جلدي بسيط", price: 400, durationMinutes: 60 },
  { code: "CHECKUP", name: "فحص دوري", price: 100, durationMinutes: 20 },
];

export const demoStaff = [
  { id: "doctor-nawaf", name: "د. نواف الحسين", title: "استشاري طب عام" },
  { id: "doctor-reem", name: "د. ريم السيف", title: "طبيبة أسنان" },
  { id: "doctor-ali", name: "د. علي الزهراني", title: "طبيب جلدية" },
];

export const demoCustomers = [
  { id: "cust-sarah", name: "سارة أحمد", phone: "+966501234567", lead_status: "booked", source: "whatsapp", last_interaction: "الآن", tags: ["حجز AI"] },
  { id: "cust-mohammed", name: "محمد السالم", phone: "+966500001001", lead_status: "contacted", source: "whatsapp", last_interaction: "اليوم", tags: [] },
  { id: "cust-noura", name: "نورة الفيفي", phone: "+966500001005", lead_status: "new", source: "instagram", last_interaction: "أمس", tags: [] },
  { id: "cust-fahad", name: "فهد الحربي", phone: "+966500001003", lead_status: "completed", source: "referral", last_interaction: "منذ 3 أيام", tags: [] },
  { id: "cust-reem", name: "ريم القحطاني", phone: "+966500001004", lead_status: "no_show", source: "website", last_interaction: "منذ أسبوع", tags: [] },
];

export const demoConversation = {
  id: "conv-sarah",
  customerId: "cust-sarah",
  customerName: "سارة أحمد",
  phone: "+966501234567",
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

export const demoBookings = [
  {
    id: "book-sarah",
    customer: "سارة أحمد",
    phone: "+966501234567",
    service: "تنظيف أسنان",
    doctor: "د. ريم السيف",
    date: "2026-05-22",
    time: "4:00 مساء",
    status: "confirmed",
    payment_status: "unpaid",
    source: "AI WhatsApp",
  },
  { id: "book-1", customer: "محمد السالم", phone: "+966500001001", service: "استشارة عامة", doctor: "د. نواف الحسين", date: "2026-05-22", time: "10:00 صباحاً", status: "confirmed", payment_status: "paid", source: "Reception" },
  { id: "book-2", customer: "نورة الفيفي", phone: "+966500001005", service: "فحص دوري", doctor: "د. نواف الحسين", date: "2026-05-22", time: "11:30 صباحاً", status: "pending", payment_status: "unpaid", source: "WhatsApp" },
  { id: "book-3", customer: "فهد الحربي", phone: "+966500001003", service: "إجراء جلدي بسيط", doctor: "د. علي الزهراني", date: "2026-05-21", time: "2:00 مساء", status: "completed", payment_status: "paid", source: "Referral" },
];

export const demoReminderRows = [
  {
    id: "rem-sarah-24h",
    customer: "سارة أحمد",
    phone: "+966501234567",
    template: "تذكير قبل 24 ساعة",
    scheduled_for: "2026-05-21 16:00",
    status: "pending",
    type: "appointment_24h",
  },
  {
    id: "rem-sarah-2h",
    customer: "سارة أحمد",
    phone: "+966501234567",
    template: "تذكير قبل ساعتين",
    scheduled_for: "2026-05-22 14:00",
    status: "pending",
    type: "appointment_2h",
  },
  {
    id: "rem-followup",
    customer: "فهد الحربي",
    phone: "+966500001003",
    template: "متابعة بعد الزيارة",
    scheduled_for: "2026-05-23 10:00",
    status: "sent",
    type: "post_visit",
  },
];

export const demoReportStats = {
  todayBookings: demoBookings.filter((booking) => booking.date === "2026-05-22").length,
  aiHandled: 32,
  humanNeeded: 4,
  newLeads: 8,
  monthRevenue: 24500,
  conversionRate: 68,
};
