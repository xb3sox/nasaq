// Optional content file for standardizing static data within the feature
// This aligns with feature slicing requirements
import { Bell, CalendarCheck, Inbox } from "lucide-react";

export const OVERVIEW_LINKS = [
  { href: "/dashboard/reminders", icon: Bell, label: "إرسال تذكير جديد" },
  { href: "/dashboard/bookings", icon: CalendarCheck, label: "سجل حجوزات اليوم" },
  { href: "/dashboard/inbox", icon: Inbox, label: "مراجعة صندوق الوارد" },
];
