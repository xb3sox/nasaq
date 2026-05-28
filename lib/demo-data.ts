/**
 * Fake clinic seed data for demo.
 * Used by dashboard pages and API routes.
 */

export const DEMO_CLINIC_ID = "clinic_elite_riyadh";

// ------------------------------------------------------------------
// MULTI-CLINIC PROFILES
// To add a new clinic profile:
// 1. Add a new object to the DEMO_CLINICS array
// 2. Give it a unique id, name, branchName, phone, etc.
// 3. Define its specific doctors and services arrays
// ------------------------------------------------------------------

export const DEMO_CLINICS = [
  {
    id: DEMO_CLINIC_ID, // Default dental clinic
    name: "عيادات النخبة",
    branchName: "الفرع الرئيسي - حي الملقا",
    phone: "+966112345678",
    whatsappNumber: "+966501234567",
    address: "حي الملقا، الرياض، المملكة العربية السعودية",
    doctors: [
      { id: "dr-reem", name: "د. ريم السيف", specialty: "طب أسنان عام", available: true },
      { id: "dr-khalid", name: "د. خالد المحسن", specialty: "تقويم الأسنان", available: true },
      { id: "dr-sara", name: "د. سارة العتيبي", specialty: "طب أسنان الأطفال", available: false },
    ],
    services: [
      { id: "svc-clean", code: "DENT_CLEAN", name: "تنظيف أسنان", price: 250, currency: "SAR", durationMin: 45 },
      { id: "svc-checkup", code: "DENT_CHECKUP", name: "فحص أسنان", price: 150, currency: "SAR", durationMin: 30 },
      { id: "svc-whitening", code: "DENT_WHITENING", name: "تبييض أسنان", price: 800, currency: "SAR", durationMin: 60 },
      { id: "svc-filling", code: "DENT_FILLING", name: "حشوة أسنان", price: 300, currency: "SAR", durationMin: 30 },
      { id: "svc-braces", code: "DENT_BRACES", name: "تقويم أسنان", price: 3500, currency: "SAR", durationMin: 45 },
    ]
  },
  {
    id: "clinic_derma_riyadh",
    name: "عيادات الجلدية",
    branchName: "فرع التخصصي",
    phone: "+966113456789",
    whatsappNumber: "+966503456789",
    address: "شارع التخصصي، الرياض، المملكة العربية السعودية",
    doctors: [
      { id: "dr-nora", name: "د. نورة اليوسف", specialty: "طب الجلدية والتجميل", available: true },
      { id: "dr-ahmed", name: "د. أحمد طارق", specialty: "علاج الليزر", available: true },
    ],
    services: [
      { id: "svc-laser", code: "DERM_LASER", name: "إزالة الشعر بالليزر", price: 400, currency: "SAR", durationMin: 60 },
      { id: "svc-botox", code: "DERM_BOTOX", name: "حقن بوتوكس", price: 1200, currency: "SAR", durationMin: 30 },
      { id: "svc-facial", code: "DERM_FACIAL", name: "تنظيف بشرة عميق", price: 350, currency: "SAR", durationMin: 45 },
    ]
  },
  {
    id: "clinic_general_riyadh",
    name: "مركز الرعاية الطبية",
    branchName: "فرع العليا",
    phone: "+966114567890",
    whatsappNumber: "+966504567890",
    address: "حي العليا، الرياض، المملكة العربية السعودية",
    doctors: [
      { id: "dr-faisal", name: "د. فيصل العبدالله", specialty: "طب الأسرة", available: true },
      { id: "dr-maha", name: "د. مها العتيبي", specialty: "باطنية", available: true },
    ],
    services: [
      { id: "svc-consult", code: "GEN_CONSULT", name: "استشارة طبية", price: 200, currency: "SAR", durationMin: 30 },
      { id: "svc-blood", code: "GEN_BLOOD", name: "تحليل دم شامل", price: 450, currency: "SAR", durationMin: 15 },
      { id: "svc-vaccine", code: "GEN_VACCINE", name: "تطعيمات", price: 150, currency: "SAR", durationMin: 15 },
    ]
  }
];

export function getDemoClinic(clinicId: string) {
  const clinic = DEMO_CLINICS.find(c => c.id === clinicId);
  return clinic || DEMO_CLINICS[0];
}

// Backward compatibility exports for existing codebase
export const DEMO_DOCTORS = DEMO_CLINICS[0].doctors;
export const DEMO_SERVICES = DEMO_CLINICS[0].services;

export const DEMO_CUSTOMERS = [
  { id: "cust-1", name: "نورة المحمد", phone: "+966501234567", leadStatus: "new", tags: ["booking"] },
  { id: "cust-2", name: "خالد العتيبي", phone: "+966552345678", leadStatus: "contacted", tags: ["cancel"] },
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
  todayBookings: 5,
  todayConfirmed: 4,
  humanNeeded: 1,
  aiHandled: 18,
  newLeads: 8,
  monthRevenue: 67500,
  monthBookings: 124,
  remindersSent: 42,
  remindersFailed: 1,
  responseTimeMin: 1.2,
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
  {
    id: "rem-5",
    customerName: "ريم القحطاني",
    serviceName: "تنظيف أسنان",
    doctorName: "د. ريم السيف",
    startAt: "2026-05-23T09:00:00+03:00",
    type: "24h_before",
    sendAt: "2026-05-22T09:00:00+03:00",
    status: "sent",
  },
  {
    id: "rem-6",
    customerName: "خالد الغامدي",
    serviceName: "حشوة أسنان",
    doctorName: "د. ريم السيف",
    startAt: "2026-05-23T13:00:00+03:00",
    type: "2h_before",
    sendAt: "2026-05-23T11:00:00+03:00",
    status: "queued",
  },
  {
    id: "rem-7",
    customerName: "هند السالم",
    serviceName: "فحص دوري",
    doctorName: "د. نواف الحسين",
    startAt: "2026-05-24T10:30:00+03:00",
    type: "24h_before",
    sendAt: "2026-05-23T10:30:00+03:00",
    status: "pending",
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
  { id: "inv-1",  customerName: "نورة المحمد",       serviceName: "تنظيف أسنان",    amount: 250,  currency: "SAR", status: "paid",      date: "2026-05-22" },
  { id: "inv-2",  customerName: "سارة الناصر",        serviceName: "فحص أسنان",       amount: 150,  currency: "SAR", status: "pending",   date: "2026-05-23" },
  { id: "inv-3",  customerName: "عبدالله القحطاني",   serviceName: "تبييض أسنان",    amount: 800,  currency: "SAR", status: "paid",      date: "2026-05-21" },
  { id: "inv-4",  customerName: "خالد الغامدي",       serviceName: "حشوة أسنان",     amount: 300,  currency: "SAR", status: "paid",      date: "2026-05-20" },
  { id: "inv-5",  customerName: "لينا منصور",          serviceName: "تبييض أسنان",    amount: 800,  currency: "SAR", status: "paid",      date: "2026-05-18" },
  { id: "inv-6",  customerName: "ريم القحطاني",      serviceName: "تنظيف أسنان",    amount: 250,  currency: "SAR", status: "pending",   date: "2026-05-23" },
  { id: "inv-7",  customerName: "فهد الحربي",          serviceName: "تقويم أسنان",    amount: 3500, currency: "SAR", status: "paid",      date: "2026-05-15" },
  { id: "inv-8",  customerName: "ماجدة حسين",          serviceName: "تنظيف أسنان",    amount: 250,  currency: "SAR", status: "cancelled", date: "2026-05-19" },
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
  { id: "book-1",  customer: "سارة أحمد",        phone: "+966501234567", service: "تنظيف أسنان",    doctor: "د. ريم السيف",    date: "2026-05-22", time: "4:00 مساء",    status: "confirmed",  paymentStatus: "unpaid",  source: "AI WhatsApp" },
  { id: "book-2",  customer: "محمد السالم",       phone: "+966500001001", service: "استشارة عامة",   doctor: "د. نواف الحسين", date: "2026-05-22", time: "10:00 صباحاً", status: "confirmed",  paymentStatus: "paid",    source: "Reception" },
  { id: "book-3",  customer: "نورة الفيفي",       phone: "+966500001005", service: "فحص دوري",      doctor: "د. نواف الحسين", date: "2026-05-22", time: "11:30 صباحاً",status: "pending",    paymentStatus: "unpaid",  source: "WhatsApp" },
  { id: "book-4",  customer: "فهد الحربي",        phone: "+966500001003", service: "تقويم أسنان",    doctor: "د. خالد المحسن",  date: "2026-05-21", time: "2:00 مساء",   status: "completed",  paymentStatus: "paid",    source: "Referral" },
  { id: "book-5",  customer: "ريم القحطاني",      phone: "+966500001004", service: "تبييض أسنان",    doctor: "د. ريم السيف",    date: "2026-05-23", time: "9:00 صباحاً",  status: "confirmed",  paymentStatus: "unpaid",  source: "AI WhatsApp" },
  { id: "book-6",  customer: "خالد الغامدي",      phone: "+966500001006", service: "حشوة أسنان",     doctor: "د. ريم السيف",    date: "2026-05-23", time: "1:00 مساء",   status: "confirmed",  paymentStatus: "paid",    source: "AI WhatsApp" },
  { id: "book-7",  customer: "علي الشمري",        phone: "+966500001007", service: "استشارة عامة",   doctor: "د. نواف الحسين", date: "2026-05-20", time: "3:00 مساء",   status: "completed",  paymentStatus: "paid",    source: "Reception" },
  { id: "book-8",  customer: "ماجدة حسين",        phone: "+966500001008", service: "تنظيف أسنان",    doctor: "د. ريم السيف",    date: "2026-05-19", time: "5:00 مساء",   status: "cancelled",  paymentStatus: "unpaid",  source: "WhatsApp" },
  { id: "book-9",  customer: "هند السالم",         phone: "+966500001010", service: "فحص دوري",      doctor: "د. نواف الحسين", date: "2026-05-24", time: "10:30 صباحاً",status: "pending",    paymentStatus: "unpaid",  source: "AI WhatsApp" },
  { id: "book-10", customer: "عبدالله فواز",       phone: "+966500001011", service: "تقويم أسنان",    doctor: "د. خالد المحسن",  date: "2026-05-24", time: "12:00 مساء",  status: "confirmed",  paymentStatus: "partial", source: "Referral" },
  { id: "book-11", customer: "لينا منصور",         phone: "+966500001012", service: "تبييض أسنان",    doctor: "د. ريم السيف",    date: "2026-05-18", time: "2:30 مساء",   status: "completed",  paymentStatus: "paid",    source: "Instagram" },
  { id: "book-12", customer: "راشد الدولي",        phone: "+966500001013", service: "حشوة أسنان",     doctor: "د. ريم السيف",    date: "2026-05-17", time: "4:00 مساء",   status: "completed",  paymentStatus: "paid",    source: "AI WhatsApp" },
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
  { id: "l1",  name: "أحمد الدوسري",      phone: "+966555678901", source: "whatsapp",  status: "new",       createdAt: "اليوم" },
  { id: "l2",  name: "فاطمة الزهرائي",    phone: "+966566789012", source: "instagram", status: "contacted",  createdAt: "بالأمس" },
  { id: "l3",  name: "محمد العتيبي",      phone: "+966577890123", source: "google",    status: "booked",    createdAt: "هذا الأسبوع" },
  { id: "l4",  name: "هند السبيعي",        phone: "+966588901234", source: "whatsapp",  status: "new",       createdAt: "اليوم" },
  { id: "l5",  name: "نواف الحربي",        phone: "+966500002001", source: "whatsapp",  status: "contacted",  createdAt: "اليوم" },
  { id: "l6",  name: "رانيا العمري",       phone: "+966500002002", source: "instagram", status: "booked",    createdAt: "بالأمس" },
  { id: "l7",  name: "عمر الزهراني",      phone: "+966500002003", source: "referral",  status: "new",       createdAt: "هذا الأسبوع" },
  { id: "l8",  name: "داليا الشهري",      phone: "+966500002004", source: "google",    status: "contacted",  createdAt: "هذا الأسبوع" },
  { id: "l9",  name: "بدر العسيري",        phone: "+966500002005", source: "whatsapp",  status: "booked",    createdAt: "الأسبوع الماضي" },
  { id: "l10", name: "سلمى المطيري",      phone: "+966500002006", source: "instagram", status: "new",       createdAt: "اليوم" },
];

export const DEMO_METRICS = {
  labels: ["سبت", "أحد", "اثن", "ثلاث", "أربع", "خميس", "جمع"],
  bookings: [6, 9, 5, 11, 8, 13, 4],
  leads:    [7, 11, 6, 13, 9, 15, 5],
};

// Reminder sender demo rows — used by reminder-sender.ts when no store is configured
export const DEMO_REMINDER_ROWS = [
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
] as const;
