"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, CalendarCheck, MessageCircle, TrendingUp, Bot, Bell, Clock } from "lucide-react";
import { demoAiDecision, demoBooking, demoConversation, demoReportStats } from "@/lib/demo-clinic";
import { useEffect, useState } from "react";

function RiyadhClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const riyadh = time.toLocaleString("ar-SA", {
    timeZone: "Asia/Riyadh",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const date = time.toLocaleDateString("ar-SA", {
    timeZone: "Asia/Riyadh",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Clock className="w-4 h-4" />
      <span dir="ltr">{riyadh}</span>
      <span className="hidden sm:inline">— {date}</span>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">نظرة عامة</h1>
          <p className="text-sm text-muted-foreground">مسار اليوم: واتساب → AI → حجز → تذكير → CRM → تقرير</p>
          <RiyadhClock />
        </div>
        <Badge className="badge-demo-ready text-green-800 border-green-300">
          Demo Ready
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-hover-lift">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">حجوزات اليوم</CardTitle>
            <CalendarCheck className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demoReportStats.todayBookings}</div>
            <p className="text-xs text-muted-foreground">منها حجز AI مؤكد</p>
          </CardContent>
        </Card>

        <Card className="card-hover-lift">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">محادثات تحتاج رد</CardTitle>
            <MessageCircle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{demoReportStats.humanNeeded}</div>
            <p className="text-xs text-muted-foreground">AI تعامل مع {demoReportStats.aiHandled}</p>
          </CardContent>
        </Card>

        <Card className="card-hover-lift">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">عملاء جدد</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demoReportStats.newLeads}</div>
            <p className="text-xs text-muted-foreground">هذا الأسبوع</p>
          </CardContent>
        </Card>

        <Card className="card-hover-lift">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">الإيرادات (الشهر)</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demoReportStats.monthRevenue.toLocaleString()} ر.س</div>
            <p className="text-xs text-muted-foreground">+12% عن الشهر الماضي</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">آخر مسار حجز من واتساب</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto pb-2 snap-x snap-mandatory flex lg:grid lg:grid-cols-5 text-sm">
            {[
              ["رسالة", demoConversation.messages.at(-1)?.body ?? ""],
              ["قرار AI", `${demoAiDecision.intent} · ${(demoAiDecision.confidence * 100).toFixed(0)}%`],
              ["رد", demoAiDecision.reply],
              ["حجز", `${demoBooking.serviceName} · ${demoBooking.doctorName}`],
              ["تذكير", "24h + 2h queued"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border p-3 min-h-28 min-w-40 lg:min-w-0 shrink-0 lg:shrink card-hover-lift snap-start">
                <div className="text-xs text-muted-foreground mb-2">{label}</div>
                <div className="font-medium leading-relaxed">{value}</div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">جاهزية البيع</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-2"><Bot className="w-4 h-4 text-green-600" /> AI intent + reply ready</div>
            <div className="flex items-center gap-2"><CalendarCheck className="w-4 h-4 text-green-600" /> Booking draft ready</div>
            <div className="flex items-center gap-2"><Bell className="w-4 h-4 text-green-600" /> Reminder queue ready</div>
            <div className="flex items-center gap-2"><Users className="w-4 h-4 text-orange-600" /> Needs real auth + DB writes</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
