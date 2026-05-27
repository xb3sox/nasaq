import { useState } from "react";
import { DEMO_BOOKINGS } from "@/lib/demo-data";

export function useBookingsTable() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [added, setAdded] = useState(0);
  const [compactView, setCompactView] = useState(false);

  const all = DEMO_BOOKINGS;

  const filtered = all.filter((b) => {
    const matchSearch = b.customer.includes(search) || b.phone.includes(search) || b.service.includes(search);
    const matchStatus = statusFilter === "all" || b.status === statusFilter;
    const matchSource = sourceFilter === "all" || b.source === sourceFilter;
    return matchSearch && matchStatus && matchSource;
  });

  const counts = {
    confirmed: all.filter((b) => b.status === "confirmed").length,
    completed: all.filter((b) => b.status === "completed").length,
    pending:   all.filter((b) => b.status === "pending").length,
    cancelled: all.filter((b) => b.status === "cancelled").length,
    aiSource:  all.filter((b) => b.source === "AI WhatsApp").length,
  };

  return {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    sourceFilter,
    setSourceFilter,
    added,
    setAdded,
    compactView,
    setCompactView,
    all,
    filtered,
    counts,
  };
}

export function getFormattedDate(dateStr: string) {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('ar-SA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}
