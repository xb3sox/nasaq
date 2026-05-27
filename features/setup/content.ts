import { Building, Users, CalendarCheck, Settings, MessageCircle } from "lucide-react";

export const STEPS = [
  { id: "clinic", title: "بيانات العيادة", iconKey: "Building" },
  { id: "doctors", title: "الأطباء", iconKey: "Users" },
  { id: "services", title: "الخدمات", iconKey: "CalendarCheck" },
  { id: "ai", title: "الذكاء الاصطناعي", iconKey: "Settings" },
  { id: "whatsapp", title: "واتساب", iconKey: "MessageCircle" },
] as const;

export const ICON_MAP = { Building, Users, CalendarCheck, Settings, MessageCircle } as const;
