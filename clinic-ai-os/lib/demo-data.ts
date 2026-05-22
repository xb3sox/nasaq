/**
 * Fake Riyadh clinic seed data for demo.
 * Used by dashboard pages and API routes.
 */

export const DEMO_CLINIC_ID = "clinic_elite_riyadh";

export const DEMO_CLINICS = [
  {
    id: DEMO_CLINIC_ID,
    name: "عيادات النخبة",
    branchName: "الفرع الرئيسي - حي الملقا",
    phone: "+966112345678",
    whatsappNumber: "+966501234567",
    address: "حي الملقا، الرياض، المملكة العربية السعودية",
  },
];

export const DEMO_DOCTORS = [
  { id: "dr-reem", name: "د. ريم السيف", specialty: "طب أسنان عام", available: true },
  { id: "dr-khalid", name: "د. خالد المحسن", specialty: "تقويم الأسنان", available: true },
  { id: "dr-sara", name: "د. سارة العتيبي", specialty: "طب أسنان الأطفال", available: false },
];

export const DEMO_SERVICES = [
  { id: "svc-clean", code: "DENT_CLEAN", name: "تنظيف أسنان", price: 250, currency: "SAR", durationMin: 45 },
  { id: "svc-checkup", code: "DENT_CHECKUP", name: "فحص أسنان", price: 150, currency: "SAR", durationMin: 30 },
  { id: "svc-whitening", code: "DENT_WHITENING", name: "تبييض أسنان", price: 800, currency: "SAR", durationMin: 60 },
  { id: "svc-filling", code: "DENT_FILLING", name: "حشوة أسنان", price: 300, currency: "SAR", durationMin: 30 },
  { id: "svc-braces", code: "DENT_BRACES", name: "تقويم أسنان", price: 3500, currency: "SAR", durationMin: 45 },
];

export const DEMO_CUSTOMERS = [
  { id: "cust-1", name: "نورة المحمد", phone: "+966501234567", leadStatus: "active", tags: ["booking"] },
  { id: "cust-2", name: "خالد العتيبي", phone: "+966552345678", leadStatus: "human_needed", tags: ["cancel"] },
  { id: "cust-3", name: "سارة الناصر", phone: "+966533456789", leadStatus: "booked", tags: ["booking"] },
  { id: "cust-4", name: "عبدالله القحطاني", phone: "+966544567890", leadStatus: "booked", tags: ["pricing"] },
  { id: "cust-5", name: "أحمد الدوسري", phone: "+966555678901", leadStatus: "new", tags: ["inquiry"] },
];

export const DEMO_CONVERSATIONS = [
  {
    id: "conv-1",
    customerId: "cust-1",
    customerName: "نورة المحمد",
    phone: "+966501234567",
    channel: "whatsapp",
    lastMessage: "بكم تنظيف الأسنان؟ متاح موعد اليوم؟",
    lastMessageAt: "الآن",
    humanNeeded: false,
    tags: ["booking"],
    messages: [
      { id: "m1", sender: "customer", body: "السلام عليكم", timestamp: "10:00" },
      { id: "m2", sender: "bot", body: "وعليكم السلام! كيف أقدر أساعدك اليوم؟", timestamp: "10:00" },
      { id: "m3", sender: "customer", body: "بكم تنظيف الأسنان؟ متاح موعد اليوم؟", timestamp: "10:01" },
      { id: "m4", sender: "bot", body: "أهلاً بك. سعر تنظيف الأسنان 250 ريال. متاح اليوم 4:00 مساء أو 7:00 مساء مع د. ريم السيف. أي وقت يناسبك؟", timestamp: "10:01" },
    ],
  },
  {
    id: "conv-2",
    customerId: "cust-2",
    customerName: "خالد العتيبي",
    phone: "+966552345678",
    channel: "whatsapp",
    lastMessage: "أريد إلغاء موعدي غداً",
    lastMessageAt: "بالأمس",
    humanNeeded: true,
    tags: ["cancel"],
    messages: [
      { id: "m5", sender: "customer", body: "أريد إلغاء موعدي غداً", timestamp: "09:00" },
      { id: "m6", sender: "bot", body: "تم استلام طلب الإلغاء. أرسل رقم جوالك أو وقت الموعد حتى نؤكد.", timestamp: "09:00" },
    ],
  },
];

export const DEMO_AI_DECISION = {
  intent: "booking",
  serviceCode: "DENT_CLEAN",
  serviceName: "تنظيف أسنان",
  confidence: 0.91,
  humanNeeded: false,
  nextAction: "offer_slots",
  reply: "أهلاً بك. سعر تنظيف الأسنان 250 ريال. متاح اليوم 4:00 مساء أو 7:00 مساء مع د. ريم السيف. أي وقت يناسبك؟",
  availableSlots: [
    { label: "اليوم 4:00 مساء", startsAt: "2026-05-22T16:00:00+03:00", doctorName: "د. ريم السيف" },
    { label: "اليوم 7:00 مساء", startsAt: "2026-05-22T19:00:00+03:00", doctorName: "د. ريم السيف" },
  ],
};

export const DEMO_BOOKING = {
  customerName: "نورة المحمد",
  serviceName: "تنظيف أسنان",
  doctorName: "د. ريم السيف",
  startsAt: "2026-05-22T16:00:00+03:00",
  status: "confirmed" as const,
  message: "تم تأكيد موعدك يا نورة: تنظيف أسنان مع د. ريم السيف الساعة 4:00 مساء.",
};

export const DEMO_REPORT_STATS = {
  todayBookings: 3,
  todayConfirmed: 2,
  humanNeeded: 1,
  aiHandled: 12,
  newLeads: 5,
  monthRevenue: 48750,
  monthBookings: 89,
  remindersSent: 28,
  remindersFailed: 1,
  responseTimeMin: 1.4,
};

// Typed union arrays — avoid `as const` on array elements causing narrow types

type ReminderStatus = "queued" | "pending" | "sent" | "failed";
type ReminderType = "24h_before" | "2h_before";

export const DEMO_REMINDERS: Array<{
  id: string;
  customerName: string;
  serviceName: string;
  doctorName: string;
  startAt: string;
  type: ReminderType;
  sendAt: string;
  status: ReminderStatus;
}> = [
  {
    id: "rem-1",
    customerName: "نورة المحمد",
    serviceName: "تنظيف أسنان",
    doctorName: "د. ريم السيف",
    startAt: "2026-05-22T16:00:00+03:00",
    type: "24h_before",
    sendAt: "2026-05-21T16:00:00+03:00",
    status: "queued",
  },
  {
    id: "rem-2",
    customerName: "سارة الناصر",
    serviceName: "فحص أسنان",
    doctorName: "د. خالد المحسن",
    startAt: "2026-05-23T10:00:00+03:00",
    type: "2h_before",
    sendAt: "2026-05-23T08:00:00+03:00",
    status: "pending",
  },
  {
    id: "rem-3",
    customerName: "نورة المحمد",
    serviceName: "تنظيف أسنان",
    doctorName: "د. ريم السيف",
    startAt: "2026-05-24T11:00:00+03:00",
    type: "24h_before",
    sendAt: "2026-05-23T11:00:00+03:00",
    status: "sent",
  },
  {
    id: "rem-4",
    customerName: "عبدالله القحطاني",
    serviceName: "تبييض أسنان",
    doctorName: "د. ريم السيف",
    startAt: "2026-05-25T14:00:00+03:00",
    type: "2h_before",
    sendAt: "2026-05-25T12:00:00+03:00",
    status: "failed",
  },
];

export const DEMO_INVOICES: Array<{
  id: string;
  customerName: string;
  serviceName: string;
  amount: number;
  currency: string;
  status: "paid" | "pending" | "cancelled";
  date: string;
}> = [
  { id: "inv-1", customerName: "نورة المحمد", serviceName: "تنظيف أسنان", amount: 250, currency: "SAR", status: "paid", date: "2026-05-22" },
  { id: "inv-2", customerName: "سارة الناصر", serviceName: "فحص أسنان", amount: 150, currency: "SAR", status: "pending", date: "2026-05-23" },
  { id: "inv-3", customerName: "عبدالله القحطاني", serviceName: "تبييض أسنان", amount: 800, currency: "SAR", status: "paid", date: "2026-05-21" },
];

type BookingStatus = "confirmed" | "pending" | "completed" | "cancelled";
type PaymentStatus = "paid" | "unpaid" | "partial";

export const DEMO_BOOKINGS: Array<{
  id: string;
  customer: string;
  phone: string;
  service: string;
  doctor: string;
  date: string;
  time: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  source: string;
}> = [
  { id: "book-1", customer: "سارة أحمد", phone: "+966501234567", service: "تنظيف أسنان", doctor: "د. ريم السيف", date: "2026-05-22", time: "4:00 مساء", status: "confirmed", paymentStatus: "unpaid", source: "AI WhatsApp" },
  { id: "book-2", customer: "محمد السالم", phone: "+966500001001", service: "استشارة عامة", doctor: "د. نواف", date: "2026-05-22", time: "10:00 صباحاً", status: "confirmed", paymentStatus: "paid", source: "Reception" },
  { id: "book-3", customer: "نورة الفيفي", phone: "+966500001005", service: "فحص دوري", doctor: "د. نواف", date: "2026-05-22", time: "11:30 صباحاً", status: "pending", paymentStatus: "unpaid", source: "WhatsApp" },
  { id: "book-4", customer: "فهد الحربي", phone: "+966500001003", service: "إجراء جلدي", doctor: "د. علي", date: "2026-05-21", time: "2:00 مساء", status: "completed", paymentStatus: "paid", source: "Referral" },
];

type LeadStatus = "new" | "contacted" | "booked";

export const DEMO_LEADS: Array<{
  id: string;
  name: string;
  phone: string;
  source: string;
  status: LeadStatus;
  createdAt: string;
}> = [
  { id: "l1", name: "أحمد الدوسري", phone: "+966555678901", source: "whatsapp", status: "new", createdAt: "اليوم" },
  { id: "l2", name: "فاطمة الزهرائي", phone: "+966566789012", source: "instagram", status: "contacted", createdAt: "بالأمس" },
  { id: "l3", name: "محمد العتيبي", phone: "+966577890123", source: "google", status: "booked", createdAt: "هذا الأسبوع" },
  { id: "l4", name: "هند السبيعي", phone: "+966588901234", source: "whatsapp", status: "new", createdAt: "اليوم" },
];

export const DEMO_METRICS = {
  labels: ["سبت", "أحد", "اثن", "ثلاث", "أربع", "خميس", "جمع"],
  bookings: [4, 6, 3, 7, 5, 8, 2],
  leads: [5, 8, 4, 9, 6, 10, 3],
};