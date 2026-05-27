import { CheckCircle2, Clock, CalendarCheck2, XCircle } from "lucide-react";

export type BookingStatus = "confirmed" | "pending" | "completed" | "cancelled";
export type PaymentStatus = "paid" | "unpaid" | "partial";

export const STATUS_CONFIG: Record<BookingStatus, { label: string; variant: "success" | "warning" | "neutral" | "danger"; icon: React.ElementType }> = {
  confirmed:  { label: "مؤكد",    variant: "success",  icon: CheckCircle2 },
  pending:    { label: "معلق",    variant: "warning",  icon: Clock },
  completed:  { label: "مكتمل",   variant: "neutral",  icon: CalendarCheck2 },
  cancelled:  { label: "ملغي",    variant: "danger",   icon: XCircle },
};

export const PAYMENT_CONFIG: Record<PaymentStatus, { label: string; variant: "success" | "warning" | "neutral" }> = {
  paid:     { label: "مدفوع",      variant: "success" },
  unpaid:   { label: "غير مدفوع",  variant: "warning" },
  partial:  { label: "جزئي",       variant: "neutral" },
};

export const SOURCE_COLORS: Record<string, "info" | "whatsapp" | "neutral"> = {
  "AI WhatsApp": "info",
  "WhatsApp":    "whatsapp",
  "Reception":   "neutral",
  "Referral":    "neutral",
  "Instagram":   "neutral",
};
