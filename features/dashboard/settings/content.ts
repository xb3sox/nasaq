export interface SettingsSection {
  id: string;
  titleAr: string;
  descriptionAr?: string;
}

export const SETTINGS_SECTIONS: SettingsSection[] = [
  { id: "clinic", titleAr: "العيادة" },
  { id: "whatsapp", titleAr: "واتساب" },
  { id: "ai", titleAr: "الذكاء الاصطناعي" },
  { id: "team", titleAr: "الفريق" },
  { id: "services", titleAr: "الخدمات" },
  { id: "reminders", titleAr: "التذكيرات" },
];
