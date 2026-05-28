export const STATUS_LABELS: Record<string, string> = {
  paid: "مدفوعة",
  pending: "معلق",
  cancelled: "ملغي",
};

export const STATUS_VARIANTS: Record<string, "success" | "warning" | "danger" | "neutral"> = {
  paid: "success",
  pending: "warning",
  cancelled: "neutral",
  overdue: "danger",
};
