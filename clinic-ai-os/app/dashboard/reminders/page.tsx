"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DEMO_REMINDERS } from "@/lib/demo-data";
import { Bell, Clock, Send, RefreshCw, CheckCircle2, XCircle, Loader2 } from "lucide-react";

type ReminderStatus = "queued" | "pending" | "sent" | "failed";

const STATUS_CONFIG: Record<
  ReminderStatus,
  { label: string; color: string; icon: React.ElementType }
> = {
  sent:    { label: "تم الإرسال",  color: "bg-green-100 text-green-800",  icon: CheckCircle2 },
  queued:  { label: "في الانتظار", color: "bg-blue-100 text-blue-800",    icon: Clock },
  pending: { label: "معلق",        color: "bg-yellow-100 text-yellow-800", icon: Clock },
  failed:  { label: "فشل الإرسال", color: "bg-red-100 text-red-800",      icon: XCircle },
};

export default function RemindersPage() {
  const [retrying, setRetrying] = useState<Record<string, boolean>>({});
  const [statuses, setStatuses] = useState<Record<string, ReminderStatus>>(
    Object.fromEntries(DEMO_REMINDERS.map((r) => [r.id, r.status]))
  );

  const handleRetry = async (id: string, customerName: string, doctorName: string, serviceName: string) => {
    setRetrying((p) => ({ ...p, [id]: true }));
    try {
      const res = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "+966500000000",
          body: `تذكير: موعدك القادم مع ${doctorName} لـ ${serviceName}. يُرجى الحضور في الوقت المحدد. عيادات النخبة.`,
        }),
      });
      const data = await res.json();
      setStatuses((p) => ({ ...p, [id]: data.success ? "sent" : "failed" }));
    } catch {
      setStatuses((p) => ({ ...p, [id]: "failed" }));
    } finally {
      setRetrying((p) => ({ ...p, [id]: false }));
    }
  };

  const counts = {
    queued:  Object.values(statuses).filter((s) => s === "queued").length,
    pending: Object.values(statuses).filter((s) => s === "pending").length,
    sent:    Object.values(statuses).filter((s) => s === "sent").length,
    failed:  Object.values(statuses).filter((s) => s === "failed").length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">التذكيرات</h1>
          <p className="text-sm text-muted-foreground">تذكيرات WhatsApp آلية للحجوزات</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Badge className="bg-blue-100 text-blue-800">{counts.queued + counts.pending} معلقة</Badge>
          <Badge className="bg-green-100 text-green-800">{counts.sent} مرسلة</Badge>
          {counts.failed > 0 && (
            <Badge className="bg-red-100 text-red-800">{counts.failed} فشلت</Badge>
          )}
        </div>
      </div>

      {/* Stat Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {(["queued", "pending", "sent", "failed"] as ReminderStatus[]).map((s) => {
          const cfg = STATUS_CONFIG[s];
          const Icon = cfg.icon;
          return (
            <Card key={s} className="p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">{cfg.label}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${cfg.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold">{counts[s]}</div>
            </Card>
          );
        })}
      </div>

      {/* List */}
      <div className="space-y-3">
        {DEMO_REMINDERS.map((reminder) => {
          const status = statuses[reminder.id] ?? reminder.status;
          const cfg = STATUS_CONFIG[status];
          const StatusIcon = cfg.icon;
          const isRetrying = retrying[reminder.id];

          return (
            <Card key={reminder.id} className="p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3 items-start min-w-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    reminder.type === "24h_before" ? "bg-blue-100" : "bg-purple-100"
                  }`}>
                    <Bell className={`w-5 h-5 ${
                      reminder.type === "24h_before" ? "text-blue-600" : "text-purple-600"
                    }`} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold truncate">{reminder.customerName}</div>
                    <div className="text-sm text-muted-foreground truncate">
                      {reminder.serviceName} · {reminder.doctorName}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <Clock className="w-3 h-3 shrink-0" />
                      {reminder.type === "24h_before" ? "قبل 24 ساعة" : "قبل ساعتين"}
                      {" · "}
                      {new Date(reminder.sendAt).toLocaleString("ar-SA", {
                        timeZone: "Asia/Riyadh",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <Badge className={cfg.color}>
                    <StatusIcon className="w-3 h-3 ml-1" />
                    {cfg.label}
                  </Badge>
                  {(status === "pending" || status === "failed") && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs gap-1 min-h-[36px]"
                      disabled={isRetrying}
                      onClick={() => handleRetry(
                        reminder.id,
                        reminder.customerName,
                        reminder.doctorName,
                        reminder.serviceName
                      )}
                    >
                      {isRetrying
                        ? <Loader2 className="w-3 h-3 animate-spin" />
                        : <RefreshCw className="w-3 h-3" />
                      }
                      {status === "failed" ? "إعادة إرسال" : "إرسال الآن"}
                    </Button>
                  )}
                  {status === "sent" && (
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <Send className="w-3 h-3" />
                      تم التسليم
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
