"use client";
import { ChartWrapper } from "@/components/ChartWrapper";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { PageShell } from "@/components/ui/page-shell";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { DEMO_REMINDERS } from "@/lib/demo-data";
import { Clock, Send, RefreshCw, CheckCircle2, XCircle, Loader2, Calendar, ChevronDown, ChevronUp, User, Activity, BellOff, X } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

type ReminderStatus = "queued" | "pending" | "sent" | "failed";

const STATUS_CONFIG: Record<
  ReminderStatus,
  { label: string; variant: "success" | "default" | "warning" | "danger"; icon: React.ElementType; dotColor: string; borderColor: string }
> = {
  sent:    { label: "تم الإرسال",  variant: "success", icon: CheckCircle2, dotColor: "bg-success", borderColor: "border-s-success" },
  queued:  { label: "في الانتظار", variant: "default", icon: Clock, dotColor: "bg-brand", borderColor: "border-s-brand" },
  pending: { label: "معلق",        variant: "warning", icon: Clock, dotColor: "bg-warning", borderColor: "border-s-warning" },
  failed:  { label: "فشل الإرسال", variant: "danger",  icon: XCircle, dotColor: "bg-destructive", borderColor: "border-s-destructive" },
};

export default function RemindersPage() {
  const [retrying, setRetrying] = useState<Record<string, boolean>>({});
  const [statuses, setStatuses] = useState<Record<string, ReminderStatus>>(
    Object.fromEntries(DEMO_REMINDERS.map((r) => [r.id, r.status]))
  );
  const [filter, setFilter] = useState<ReminderStatus | "all">("all");
  const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>({});

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

  const handleResendAllFailed = async () => {
    const failedIds = Object.entries(statuses).filter(([, status]) => status === "failed").map(([id]) => id);
    for (const id of failedIds) {
      const reminder = DEMO_REMINDERS.find(r => r.id === id);
      if (reminder) {
        await handleRetry(id, reminder.customerName, reminder.doctorName, reminder.serviceName);
      }
    }
  };

  const counts = {
    queued:  Object.values(statuses).filter((s) => s === "queued").length,
    pending: Object.values(statuses).filter((s) => s === "pending").length,
    sent:    Object.values(statuses).filter((s) => s === "sent").length,
    failed:  Object.values(statuses).filter((s) => s === "failed").length,
  };

  const filteredReminders = DEMO_REMINDERS.filter(r => {
    const status = statuses[r.id] ?? r.status;
    return filter === "all" || status === filter;
  });

  const sortedReminders = [...filteredReminders].sort((a, b) => new Date(a.sendAt).getTime() - new Date(b.sendAt).getTime());

  const getRiyadhDate = (date: Date) => {
    return new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Riyadh' }));
  };

  const groupedReminders = sortedReminders.reduce((acc, reminder) => {
    const d = new Date(reminder.sendAt);
    const dateStr = d.toLocaleDateString("ar-SA", { timeZone: "Asia/Riyadh", year: 'numeric', month: 'long', day: 'numeric' });

    // Calculate relative day string using Riyadh timezone consistently
    const riyadhNow = getRiyadhDate(new Date());
    riyadhNow.setHours(0, 0, 0, 0);

    const riyadhTomorrow = new Date(riyadhNow);
    riyadhTomorrow.setDate(riyadhTomorrow.getDate() + 1);

    const riyadhYesterday = new Date(riyadhNow);
    riyadhYesterday.setDate(riyadhYesterday.getDate() - 1);

    const riyadhSendDate = getRiyadhDate(d);
    riyadhSendDate.setHours(0, 0, 0, 0);

    let relativeStr = "";
    if (riyadhSendDate.getTime() === riyadhNow.getTime()) {
      relativeStr = "اليوم - ";
    } else if (riyadhSendDate.getTime() === riyadhTomorrow.getTime()) {
      relativeStr = "غداً - ";
    } else if (riyadhSendDate.getTime() === riyadhYesterday.getTime()) {
      relativeStr = "أمس - ";
    }

    const groupKey = `${relativeStr}${dateStr}`;

    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(reminder);
    return acc;
  }, {} as Record<string, typeof DEMO_REMINDERS>);

  const toggleDate = (date: string) => {
    setExpandedDates(p => ({ ...p, [date]: p[date] === undefined ? false : !p[date] }));
  };

  const chartData = [
    { name: "السبت", sent: 12, failed: 0 },
    { name: "الأحد", sent: 19, failed: 2 },
    { name: "الإثنين", sent: 15, failed: 1 },
    { name: "الثلاثاء", sent: 22, failed: 0 },
    { name: "الأربعاء", sent: 18, failed: 3 },
    { name: "الخميس", sent: 25, failed: 1 },
    { name: "الجمعة", sent: 8, failed: 0 },
  ];

  return (
    <PageShell size="wide">
      {/* Header */}
      <PageHeader
        title="التذكيرات"
        subtitle="تذكيرات WhatsApp آلية للحجوزات"
        actions={
          counts.failed > 0 && (
            <Button size="sm" variant="destructive" onClick={handleResendAllFailed} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              إعادة إرسال الكل ({counts.failed})
            </Button>
          )
        }
      />

      {/* Summary Chart & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-5 lg:col-span-2">
          <h2 className="text-base font-semibold mb-4">ملخص الأسبوع</h2>
          <div className="h-48 w-full" dir="ltr">
            <ChartWrapper><ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis reversed={true} dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted-foreground)', fontFamily: 'inherit' }} dy={10} />
                <YAxis orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted-foreground)', fontFamily: 'inherit' }} />
                <Tooltip
                  cursor={{ fill: 'var(--muted)' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontFamily: 'inherit', textAlign: 'right' }}
                  itemStyle={{ color: 'var(--foreground)' }}
                />
                <Bar dataKey="sent" name="مرسلة" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} maxBarSize={30} />
                <Bar dataKey="failed" name="فاشلة" fill="var(--color-chart-4)" radius={[4, 4, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer></ChartWrapper>
          </div>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
          {(["sent", "queued", "pending", "failed"] as ReminderStatus[]).map((s) => {
            const cfg = STATUS_CONFIG[s];
            const Icon = cfg.icon;
            return (
              <Card key={s} className="p-4 hover:shadow-sm transition-shadow flex items-center justify-between cursor-pointer border-transparent hover:border-border" onClick={() => setFilter(filter === s ? "all" : s)}>
                <div className="flex items-center gap-3">
                  <StatusBadge variant={cfg.variant} className="w-8 h-8 rounded-lg flex items-center justify-center p-0">
                    <Icon className="w-4 h-4" />
                  </StatusBadge>
                  <span className={`text-sm font-medium ${filter === s ? "text-primary" : "text-muted-foreground"}`}>{cfg.label}</span>
                </div>
                <div className="text-xl font-bold">{counts[s]}</div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex gap-2 border-b pb-4">
        <Button size="sm" variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")} className="rounded-full">الكل</Button>
        <Button size="sm" variant={filter === "sent" ? "default" : "outline"} onClick={() => setFilter("sent")} className="rounded-full">المرسلة</Button>
        <Button size="sm" variant={filter === "pending" ? "default" : "outline"} onClick={() => setFilter("pending")} className="rounded-full">المعلقة</Button>
        <Button size="sm" variant={filter === "failed" ? "default" : "outline"} onClick={() => setFilter("failed")} className="rounded-full">الفاشلة</Button>
      </div>

      {/* List */}
      <div className="space-y-6">
        {Object.entries(groupedReminders).map(([date, reminders]) => {
          const isExpanded = expandedDates[date] ?? true;
          return (
            <div key={date} className="space-y-6">
              <div
                className="flex items-center justify-between cursor-pointer group"
                onClick={() => toggleDate(date)}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <h3 className="font-semibold">{date}</h3>
                  <Badge variant="count" className="me-2">{reminders.length}</Badge>
                </div>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </div>

              {isExpanded && (
                <div className="space-y-4">
                  {reminders.map((reminder) => {
                    const status = statuses[reminder.id] ?? reminder.status;
                    const cfg = STATUS_CONFIG[status];
                    const isRetrying = retrying[reminder.id];

                    return (
                      <Card key={reminder.id} className={`p-5 hover:shadow-sm transition-all border-s-4 ${cfg.borderColor}`}>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                          <div className="flex gap-4 items-start md:items-center min-w-0 flex-1">
                            {/* Visual Timeline */}
                            <div className="hidden sm:flex flex-col items-center justify-center min-w-[60px] text-xs text-muted-foreground">
                              <span>{new Date(reminder.sendAt).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}</span>
                              <div className="w-px h-6 bg-border my-1 relative">
                                <div className={`absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${cfg.dotColor}`}></div>
                              </div>
                              <span className="font-medium text-foreground">{reminder.type === "24h_before" ? "24h" : "2h"}</span>
                            </div>

                            <div className="min-w-0 space-y-1">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-muted-foreground" />
                                <span className="font-bold text-base truncate">{reminder.customerName}</span>
                                <StatusBadge variant={cfg.variant} className="gap-1 bg-background">
                                  <cfg.icon className="w-3 h-3" />
                                  {cfg.label}
                                </StatusBadge>
                              </div>
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                                <span className="flex items-center gap-1.5">
                                  <Activity className="w-3.5 h-3.5" />
                                  {reminder.serviceName}
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-border"></span>
                                  د. {reminder.doctorName}
                                </span>
                                <span className="flex items-center gap-1.5 sm:hidden">
                                  <Clock className="w-3.5 h-3.5" />
                                  {reminder.type === "24h_before" ? "قبل 24 ساعة" : "قبل ساعتين"}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 flex-wrap">
                            {(status === "pending" || status === "queued") && (
                              <div className="flex gap-2">
                                <Button size="touch" variant="outline" className="text-xs gap-1 px-2" aria-label="تأجيل" disabled>
                                  <BellOff className="w-4 h-4" />
                                </Button>
                                <Button size="touch" variant="outline" className="text-xs gap-1 px-2 text-destructive hover:text-destructive border-destructive/20 bg-destructive/5" aria-label="إلغاء" disabled>
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                            {(status === "pending" || status === "failed" || status === "queued") && (
                              <Button
                                size="touch"
                                variant={status === "failed" ? "destructive" : "default"}
                                className="text-xs gap-1.5"
                                disabled={isRetrying}
                                onClick={() => handleRetry(
                                  reminder.id,
                                  reminder.customerName,
                                  reminder.doctorName,
                                  reminder.serviceName
                                )}
                              >
                                {isRetrying
                                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  : (status === "failed" ? <RefreshCw className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />)
                                }
                                {status === "failed" ? "إعادة إرسال" : "إرسال واتساب"}
                              </Button>
                            )}
                            {status === "sent" && (
                              <div className="flex items-center gap-1.5 text-xs text-success bg-success-surface px-3 py-2 rounded-md font-medium border border-success/20">
                                <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                                تم التسليم
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
        {Object.keys(groupedReminders).length === 0 && (
           <EmptyState title="لا توجد تذكيرات" description="لا توجد تذكيرات تطابق معايير البحث الحالية" />
        )}
      </div>
    </PageShell>
  );
}
