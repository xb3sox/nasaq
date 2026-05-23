"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, CalendarCheck, MessageCircle, TrendingUp, Clock, Play, CheckCircle2, Loader2 } from "lucide-react";
import { demoClinic, demoAiDecision, demoBooking, demoConversation, demoReportStats } from "@/lib/demo-clinic";
import { useEffect, useState } from "react";

type DemoStep = { label: string; detail: string; done: boolean; active: boolean };

function LiveDemoRunner() {
  const [running, setRunning] = useState(false);
  const [steps, setSteps] = useState<DemoStep[]>([
    { label: "رسالة واتساب", detail: "بكم تنظيف الأسنان؟", done: false, active: false },
    { label: "قرار AI", detail: "intent: booking · 91%", done: false, active: false },
    { label: "رد تلقائي", detail: "سعر تنظيف 250 ر.س · متاحالليوم", done: false, active: false },
    { label: "تأكيد حجز", detail: "تنظيف مع د. ريم · 4:00 مساءً", done: false, active: false },
    { label: "تذكيران مجدولان", detail: "24h + 2h قبل الموعد", done: false, active: false },
    { label: "لوحة التحكم محدّثة", detail: "CRM + تقارير حية", done: false, active: false },
  ]);

  const runDemo = async () => {
    setRunning(true);
    setSteps((s) => s.map((st) => ({ ...st, done: false, active: false })));

    for (let i = 0; i < steps.length; i++) {
      setSteps((s) => s.map((st, idx) => ({ ...st, active: idx === i, done: idx < i })));
      await new Promise((r) => setTimeout(r, i === 0 ? 600 : 700));
    }
    setSteps((s) => s.map((st) => ({ ...st, done: true, active: false })));
    setRunning(false);
  };

  const allDone = steps.every((s) => s.done);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">عرض تجريبي حي</CardTitle>
          <Button
            size="sm"
            onClick={runDemo}
            disabled={running}
            className="gap-1.5 min-h-[40px] sm:min-h-0 sm:h-8 text-xs"
          >
            {running
              ? <Loader2 className="w-3 h-3 animate-spin" />
              : allDone
              ? <CheckCircle2 className="w-3 h-3" />
              : <Play className="w-3 h-3" />
            }
            {running ? "جاري…" : allDone ? "إعادة" : "تشغيل"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {steps.map((step, i) => (
            <div
              key={step.label}
              className={`flex items-center gap-3 p-2.5 rounded-lg transition-all duration-300 text-sm ${
                step.active
                  ? "bg-primary/10 border border-primary/20"
                  : step.done
                  ? "bg-green-50 dark:bg-green-900/20"
                  : "bg-muted/40"
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-colors ${
                step.done ? "bg-green-500 text-white" : step.active ? "bg-primary text-primary-foreground" : "bg-muted-foreground/20 text-muted-foreground"
              }`}>
                {step.done ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.active ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-medium truncate ${step.active ? "text-primary" : step.done ? "text-green-700 dark:text-green-400" : "text-muted-foreground"}`}>{step.label}</div>
                <div className="text-xs text-muted-foreground truncate">{step.detail}</div>
              </div>
            </div>
          ))}
        </div>
        {allDone && (
          <div className="mt-3 text-xs text-center text-green-600 font-medium animate-fade-slide-up">
            ✅ تم المسار بالكامل — العميل تلقى رداً، حجزاً، وتذكيرين بدون تدخل بشري
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RiyadhClock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    const syncClock = () => setTime(new Date());
    const initialTimer = setTimeout(syncClock, 0);
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => {
      clearTimeout(initialTimer);
      clearInterval(timer);
    };
  }, []);

  const riyadh = time?.toLocaleString("ar-SA", {
    timeZone: "Asia/Riyadh",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }) ?? "--:--:--";

  const date = time?.toLocaleDateString("ar-SA", {
    timeZone: "Asia/Riyadh",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }) ?? "";

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
          <h1 className="text-3xl font-bold">نظرة عامة — {demoClinic.name}</h1>
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
          <div className="overflow-x-auto pb-4">
            <CardContent className="pb-2 snap-x snap-mandatory flex lg:grid lg:grid-cols-5 text-sm w-max lg:w-auto min-w-full gap-4 lg:gap-0 px-4 sm:px-6">
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
          </div>
        </Card>
        <LiveDemoRunner />
      </div>
    </div>
  );
}
