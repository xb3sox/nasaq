"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, CalendarCheck, MessageCircle, TrendingUp, Clock, Play, CheckCircle2, Loader2, ArrowUpRight, Bell, Inbox, Settings } from "lucide-react";
import { demoClinic, demoAiDecision, demoBooking, demoConversation, demoReportStats } from "@/lib/demo-clinic";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSetupStore } from "@/lib/setup-store";

type DemoStep = { label: string; detail: string; done: boolean; active: boolean };

function LiveDemoRunner() {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [steps, setSteps] = useState<DemoStep[]>([
    { label: "رسالة واتساب", detail: "بكم تنظيف الأسنان؟", done: false, active: false },
    { label: "قرار AI", detail: "intent: booking · 91%", done: false, active: false },
    { label: "رد تلقائي", detail: "سعر تنظيف 250 ر.س · متاح اليوم", done: false, active: false },
    { label: "تأكيد حجز", detail: "تنظيف مع د. ريم · 4:00 مساءً", done: false, active: false },
    { label: "تذكيران مجدولان", detail: "24h + 2h قبل الموعد", done: false, active: false },
    { label: "لوحة التحكم محدّثة", detail: "CRM + تقارير حية", done: false, active: false },
  ]);

  const runDemo = async () => {
    setRunning(true);
    setProgress(0);
    setSteps((s) => s.map((st) => ({ ...st, done: false, active: false })));

    for (let i = 0; i < steps.length; i++) {
      setSteps((s) => s.map((st, idx) => ({ ...st, active: idx === i, done: idx < i })));
      setProgress(((i) / steps.length) * 100);
      await new Promise((r) => setTimeout(r, i === 0 ? 600 : 700));
    }
    setSteps((s) => s.map((st) => ({ ...st, done: true, active: false })));
    setProgress(100);
    setRunning(false);
  };

  const allDone = steps.every((s) => s.done);

  return (
    <Card className="overflow-hidden">
      {/* Progress bar at top */}
      <div className="w-full h-1 bg-muted">
        <div 
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
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
        <div className="space-y-2 relative">
          {/* Vertical connecting line for active/done steps */}
          <div className="absolute end-[1.15rem] top-4 bottom-4 w-px bg-border/50 -z-10" />
          
          {steps.map((step, i) => (
            <div
              key={step.label}
              className={`flex items-center gap-3 p-2.5 rounded-lg transition-all duration-500 text-sm ${
                step.active
                  ? "bg-primary/10 border border-primary/20 scale-[1.02] shadow-sm"
                  : step.done
                  ? "bg-green-50 dark:bg-green-900/10 border border-transparent"
                  : "bg-transparent border border-transparent opacity-60"
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-all duration-300 ${
                step.done 
                  ? "bg-green-500 text-white scale-110 shadow-sm" 
                  : step.active 
                  ? "bg-primary text-primary-foreground ring-4 ring-primary/20" 
                  : "bg-muted text-muted-foreground"
              }`}>
                {step.done ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.active ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-medium truncate transition-colors duration-300 ${step.active ? "text-primary" : step.done ? "text-green-700 dark:text-green-400" : "text-muted-foreground"}`}>{step.label}</div>
                <div className="text-xs text-muted-foreground truncate">{step.detail}</div>
              </div>
            </div>
          ))}
        </div>
        {allDone && (
          <div className="mt-4 text-xs text-center text-green-600 font-medium animate-fade-slide-up bg-green-50 dark:bg-green-900/20 p-2 rounded-md border border-green-200 dark:border-green-900 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> تم المسار بالكامل — العميل تلقى رداً، حجزاً، وتذكيرين
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RiyadhClock() {
  const [time, setTime] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // eslint-disable-line react-hooks/set-state-in-effect
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

  if (!mounted) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium bg-background/50 px-3 py-1.5 rounded-full border shadow-sm w-fit">
        <Clock className="w-4 h-4 text-primary" />
        <span dir="ltr">--:--:--</span>
        <span className="hidden sm:inline text-muted-foreground/60">| </span>
      </div>
    );
  }

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
    month: "short",
    day: "numeric",
  }) ?? "";

  return (
    <div className="flex items-center gap-2 text-sm text-foreground font-medium bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full border shadow-sm w-fit" suppressHydrationWarning>
      <Clock className="w-4 h-4 text-primary" />
      <span dir="ltr" suppressHydrationWarning className="font-semibold">{riyadh}</span>
      <span className="hidden sm:inline text-muted-foreground" suppressHydrationWarning>| {date}</span>
    </div>
  );
}

export default function DashboardPage() {
  const { isSetupComplete } = useSetupStore();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 relative">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background h-[300px] -z-10 rounded-b-3xl"></div>

      {!isSetupComplete && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <div>
              <h3 className="font-bold text-sm">أكمل إعداد حسابك</h3>
              <p className="text-xs opacity-80 mt-0.5">قم بإعداد بيانات العيادة والأطباء والخدمات للبدء.</p>
            </div>
          </div>
          <Link href="/setup">
            <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white border-0">
              الذهاب للإعدادات
            </Button>
          </Link>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 relative z-10">
        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold tracking-tight">مرحباً بك في {demoClinic.name}</h1>
          <RiyadhClock />
        </div>
        <Badge className="badge-demo-ready text-green-800 border-green-300 bg-green-100 shadow-sm px-3 py-1 text-sm font-medium">
          <CheckCircle2 className="w-4 h-4 me-1.5 inline" /> نظام ديمو جاهز
        </Badge>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link href="/dashboard/reminders">
          <Button variant="outline" className="bg-background/80 backdrop-blur shadow-sm gap-2 rounded-full hover:border-primary hover:text-primary transition-colors min-h-[40px] sm:min-h-0 sm:h-9">
            <Bell className="w-4 h-4" /> إرسال تذكير
          </Button>
        </Link>
        <Link href="/dashboard/bookings">
          <Button variant="outline" className="bg-background/80 backdrop-blur shadow-sm gap-2 rounded-full hover:border-primary hover:text-primary transition-colors min-h-[40px] sm:min-h-0 sm:h-9">
            <CalendarCheck className="w-4 h-4" /> عرض حجوزات اليوم
          </Button>
        </Link>
        <Link href="/dashboard/inbox">
          <Button variant="outline" className="bg-background/80 backdrop-blur shadow-sm gap-2 rounded-full hover:border-primary hover:text-primary transition-colors min-h-[40px] sm:min-h-0 sm:h-9">
            <Inbox className="w-4 h-4" /> فحص صندوق الواتساب
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-hover-lift shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">حجوزات اليوم</CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg"><CalendarCheck className="w-4 h-4 text-primary" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demoReportStats.todayBookings}</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-green-600 font-medium">
              <ArrowUpRight className="w-3 h-3" /> <span>+8% عن أمس</span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover-lift shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">محادثات تحتاج رد</CardTitle>
            <div className="p-2 bg-destructive/10 rounded-lg"><MessageCircle className="w-4 h-4 text-destructive" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{demoReportStats.humanNeeded}</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
              <span>AI تعامل مع {demoReportStats.aiHandled}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover-lift shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">عملاء جدد</CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-lg"><Users className="w-4 h-4 text-blue-500" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demoReportStats.newLeads}</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-green-600 font-medium">
              <ArrowUpRight className="w-3 h-3" /> <span>+15% هذا الأسبوع</span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover-lift shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">الإيرادات (الشهر)</CardTitle>
            <div className="p-2 bg-green-500/10 rounded-lg"><TrendingUp className="w-4 h-4 text-green-500" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demoReportStats.monthRevenue.toLocaleString()} ر.س</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-green-600 font-medium">
              <ArrowUpRight className="w-3 h-3" /> <span>+12% عن الشهر الماضي</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <Card className="xl:col-span-2 shadow-sm">
          <CardHeader className="border-b border-border/50 pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" /> آخر مسار حجز من واتساب
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="relative space-y-6">
              {/* Vertical timeline line */}
              <div className="absolute top-2 bottom-2 end-3.5 w-0.5 bg-border -z-10" />
              
              {[
                { label: "رسالة العميل", value: demoConversation.messages.at(-1)?.body ?? "", icon: MessageCircle, color: "text-blue-500", bg: "bg-blue-50" },
                { label: "تحليل AI", value: `${demoAiDecision.intent} · الثقة: ${(demoAiDecision.confidence * 100).toFixed(0)}%`, icon: Loader2, color: "text-purple-500", bg: "bg-purple-50" },
                { label: "رد النظام", value: demoAiDecision.reply, icon: Play, color: "text-teal-500", bg: "bg-teal-50" },
                { label: "تأكيد الحجز", value: `${demoBooking.serviceName} · ${demoBooking.doctorName}`, icon: CalendarCheck, color: "text-green-500", bg: "bg-green-50" },
                { label: "التذكيرات المجدولة", value: "24h + 2h قبل الموعد", icon: Bell, color: "text-orange-500", bg: "bg-orange-50" },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 group">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 border-background shadow-sm ${item.bg}`}>
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                  <div className="flex-1 bg-muted/30 border border-border/50 rounded-xl p-4 group-hover:bg-muted/50 transition-colors">
                    <div className="text-xs font-semibold text-muted-foreground mb-1.5">{item.label}</div>
                    <div className="text-sm font-medium leading-relaxed">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <div className="sticky top-6">
          <LiveDemoRunner />
        </div>
      </div>
    </div>
  );
}
