"use client";

import RemindersPage from "@/features/dashboard/reminders/reminders-page";
import { PageShell } from "@/components/ui/page-shell";

export default function Page() {
  return (
    <PageShell size="wide">
      <RemindersPage />
    </PageShell>
  );
}
