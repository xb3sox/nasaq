"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DEMO_REMINDERS } from "@/lib/demo-data";
import { Bell, Clock, Send, RefreshCw, CheckCircle2, XCircle, Loader2, Calendar, ChevronDown, ChevronUp, User, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

type ReminderStatus = "queued" | "pending" | "sent" | "failed";

const STATUS_CONFIG: Record<
  ReminderStatus,
  { label: string; color: string; icon: React.ElementType; dotColor: string }
> = {
  sent:    { label: "تم الإرسال",  color: "bg-green-100 text-green-800",  icon: CheckCircle2, dotColor: "bg-green-500" },
  queued:  { label: "في الانتظار", color: "bg-blue-100 text-blue-800",    icon: Clock, dotColor: "bg-blue-500" },
  pending: { label: "معلق",        color: "bg-yellow-100 text-yellow-800", icon: Clock, dotColor: "bg-yellow-500" },
  failed:  { label: "فشل الإرسال", color: "bg-red-100 text-red-800",      icon: XCircle, dotColor: "bg-red-500" },
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

  const groupedReminders = filteredReminders.reduce((acc, reminder) => {
    const date = new Date(reminder.sendAt).toLocaleDateString("ar-SA", { timeZone: "Asia/Riyadh", year: 'numeric', month: 'long', day: 'numeric' });
    if (!acc[date]) acc[date] = [];
    acc[date].push(reminder);
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">التذكيرات</h1>
          <p className="text-sm text-muted-foreground">تذكيرات WhatsApp آلية للحجوزات</p>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          {counts.failed > 0 && (
            <Button size="sm" variant="destructive" onClick={handleResendAllFailed} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              إعادة إرسال الكل ({counts.failed})
            </Button>
          )}
        </div>
      </div>

      {/* Summary Chart & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-5 lg:col-span-2">
          <h2 className="text-base font-semibold mb-4">ملخص الأسبوع</h2>
          <div className="h-48 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis reversed={true} dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280', fontFamily: 'inherit' }} dy={10} />
                <YAxis orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280', fontFamily: 'inherit' }} />
                <Tooltip 
                  cursor={{ fill: '#f3f4f6' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontFamily: 'inherit', textAlign: 'right' }}
                  itemStyle={{ color: '#0f172a' }}
                />
                <Bar dataKey="sent" name="مرسلة" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} maxBarSize={30} />
                <Bar dataKey="failed" name="فاشلة" fill="var(--color-chart-4)" radius={[4, 4, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          {(["sent", "queued", "pending", "failed"] as ReminderStatus[]).map((s) => {
            const cfg = STATUS_CONFIG[s];
            const Icon = cfg.icon;
            return (
              <Card key={s} className="p-4 hover:shadow-sm transition-shadow flex items-center justify-between cursor-pointer border-transparent hover:border-border" onClick={() => setFilter(filter === s ? "all" : s)}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${cfg.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
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
            <div key={date} className="space-y-3">
              <div 
                className="flex items-center justify-between cursor-pointer group"
                onClick={() => toggleDate(date)}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <h3 className="font-semibold">{date}</h3>
                  <Badge variant="secondary" className="me-2">{reminders.length}</Badge>
                </div>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </div>
              
              {isExpanded && (
                <div className="space-y-3">
                  {reminders.map((reminder) => {
                    const status = statuses[reminder.id] ?? reminder.status;
                    const cfg = STATUS_CONFIG[status];
                    const isRetrying = retrying[reminder.id];

                    return (
                      <Card key={reminder.id} className="p-5 hover:shadow-sm transition-all border-s-4" style={{ borderInlineStartColor: cfg.dotColor }}>
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
                                <Badge variant="outline" className="gap-1 bg-background">
                                  <div className={`w-1.5 h-1.5 rounded-full ${cfg.dotColor}`}></div>
                                  {cfg.label}
                                </Badge>
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

                          <div className="flex items-center justify-end gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0">
                            {(status === "pending" || status === "failed") && (
                              <Button
                                size="sm"
                                variant={status === "failed" ? "default" : "outline"}
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
                              <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-2.5 py-1.5 rounded-md font-medium">
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
              )}
            </div>
          );
        })}
        {Object.keys(groupedReminders).length === 0 && (
           <div className="text-center py-12 text-muted-foreground">
             <Bell className="w-8 h-8 mx-auto mb-3 opacity-50" />
             <p>لا توجد تذكيرات لعرضها.</p>
           </div>
        )}
      </div>
    </div>
  );
}
