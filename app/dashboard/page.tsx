"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/ui/page-shell";
import { PageHeader } from "@/components/ui/page-header";
import { Users, CalendarCheck, MessageCircle, TrendingUp, Clock, Play, CheckCircle2, Loader2, Bell, Inbox, Settings } from "lucide-react";
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
            onClick={runDemo}
            disabled={running}
            aria-live="polite"
            size="touch" className="gap-1.5 text-xs px-3 focus-visible:ring-2 focus-visible:ring-offset-1"
          >
            <span className="sr-only">{running ? "جاري التشغيل" : allDone ? "إعادة التشغيل" : "تشغيل العرض الحي"}</span>
            {running
              ? <Loader2 className="w-3 h-3 animate-spin" aria-hidden="true" />
              : allDone
              ? <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
              : <Play className="w-3 h-3" aria-hidden="true" />
            }
            <span aria-hidden="true">{running ? "جاري…" : allDone ? "إعادة" : "تشغيل"}</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 relative">
          {/* Vertical connecting line for active/done steps */}
          <div className="absolute start-[1.15rem] top-4 bottom-4 w-px bg-border/50 -z-10" />
          
          {steps.map((step, i) => (
            <div
              key={step.label}
              className={`flex items-center gap-3 p-2.5 rounded-lg transition-all duration-500 text-sm ${
                step.active
                  ? "bg-primary/10 border border-primary/20 scale-[1.02] shadow-sm"
                  : step.done
                  ? "bg-success-surface dark:bg-success/10 border border-transparent"
                  : "bg-transparent border border-transparent opacity-60"
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-all duration-300 ${
                step.done 
                  ? "bg-success text-success-foreground scale-110 shadow-sm" 
                  : step.active 
                  ? "bg-primary text-primary-foreground ring-4 ring-primary/20" 
                  : "bg-muted text-muted-foreground"
              }`}>
                {step.done ? <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" /> : step.active ? <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" /> : i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-medium truncate transition-colors duration-300 ${step.active ? "text-primary" : step.done ? "text-success" : "text-muted-foreground"}`}>{step.label}</div>
                <div className="text-xs text-muted-foreground truncate">{step.detail}</div>
              </div>
            </div>
          ))}
        </div>
        {allDone && (
          <div className="mt-4 text-xs text-center text-success font-medium animate-fade-slide-up bg-success-surface dark:bg-success/10 p-2 rounded-md border border-success/20 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" aria-hidden="true" /> تم المسار بالكامل — العميل تلقى رداً، حجزاً، وتذكيرين
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
        <Clock className="w-4 h-4 text-primary" aria-hidden="true" />
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
      <Clock className="w-4 h-4 text-primary" aria-hidden="true" />
      <span dir="ltr" suppressHydrationWarning className="font-semibold">{riyadh}</span>
      <span className="hidden sm:inline text-muted-foreground" suppressHydrationWarning>| {date}</span>
    </div>
  );
}

export default function DashboardPage() {
  const { isSetupComplete } = useSetupStore();

  return (
    <PageShell surface="gradient" size="wide">
      {!isSetupComplete && (
        <div className="bg-warning-surface border border-warning/20 text-warning dark:text-warning rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-warning" />
            <div>
              <h3 className="font-bold text-sm">أكمل إعداد حسابك</h3>
              <p className="text-xs opacity-80 mt-0.5">قم بإعداد بيانات العيادة والأطباء والخدمات للبدء.</p>
            </div>
          </div>
          <Link href="/setup">
            <Button size="sm" className="bg-warning hover:bg-warning/80 text-warning-foreground border-0">
              الذهاب للإعدادات
            </Button>
          </Link>
        </div>
      )}

      <PageHeader
        title={`مرحباً بك في ${demoClinic.name}`}
        eyebrow={<RiyadhClock />}
        size="hero"
        actions={
          <StatusBadge variant="success" className="shadow-sm px-3 py-1 text-sm font-medium">
            <CheckCircle2 className="w-4 h-4 me-1.5 inline" aria-hidden="true" /> نظام ديمو جاهز
          </StatusBadge>
        }
      />

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link href="/dashboard/reminders">
          <Button variant="outline" size="touch" className="bg-background/80 backdrop-blur shadow-sm gap-2 rounded-lg hover:border-primary hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-offset-1">
            <Bell className="w-4 h-4" aria-hidden="true" /> إرسال تذكير جديد
          </Button>
        </Link>
        <Link href="/dashboard/bookings">
          <Button variant="outline" size="touch" className="bg-background/80 backdrop-blur shadow-sm gap-2 rounded-lg hover:border-primary hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-offset-1">
            <CalendarCheck className="w-4 h-4" aria-hidden="true" /> سجل حجوزات اليوم
          </Button>
        </Link>
        <Link href="/dashboard/inbox">
          <Button variant="outline" size="touch" className="bg-background/80 backdrop-blur shadow-sm gap-2 rounded-lg hover:border-primary hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-offset-1">
            <Inbox className="w-4 h-4" aria-hidden="true" /> مراجعة صندوق الوارد
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-2">
        <StatCard
          title="حجوزات اليوم"
          value={demoReportStats.todayBookings}
          icon={CalendarCheck}
          trend={8}
          trendLabel="مقارنة بأمس"
        />

        <StatCard
          title="محادثات بانتظار الرد"
          value={demoReportStats.humanNeeded}
          icon={MessageCircle}
          description={`تولى الذكاء الاصطناعي الرد على ${demoReportStats.aiHandled}`}
          valueClassName="text-destructive"
          iconColor="danger"
        />

        <StatCard
          title="عملاء جدد"
          value={demoReportStats.newLeads}
          icon={Users}
          trend={15}
          trendLabel="هذا الأسبوع"
          iconColor="brand"
        />

        <StatCard
          title="إيرادات الشهر"
          value={`${demoReportStats.monthRevenue.toLocaleString()} ر.س`}
          icon={TrendingUp}
          trend={12}
          trendLabel="مقارنة بالشهر الماضي"
          iconColor="success"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start pt-2">
        <Card className="xl:col-span-2 shadow-sm">
          <CardHeader className="border-b border-border/50 pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" aria-hidden="true" /> آخر مسار حجز من واتساب
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="relative space-y-6">
              {/* Vertical timeline line */}
              <div className="absolute top-2 bottom-2 start-3.5 w-0.5 bg-border -z-10" />
              
              {[
                { label: "رسالة العميل", value: demoConversation.messages.at(-1)?.body ?? "", icon: MessageCircle, color: "text-whatsapp-dark", bg: "bg-whatsapp-muted" },
                { label: "تحليل AI", value: `${demoAiDecision.intent} · الثقة: ${(demoAiDecision.confidence * 100).toFixed(0)}%`, icon: Loader2, color: "text-primary", bg: "bg-primary/10" },
                { label: "رد النظام", value: demoAiDecision.reply, icon: Play, color: "text-brand", bg: "bg-brand-surface" },
                { label: "تأكيد الحجز", value: `${demoBooking.serviceName} · ${demoBooking.doctorName}`, icon: CalendarCheck, color: "text-success", bg: "bg-success-surface" },
                { label: "التذكيرات المجدولة", value: "24h + 2h قبل الموعد", icon: Bell, color: "text-warning", bg: "bg-warning-surface" },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 group">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 border-background shadow-sm ${item.bg}`}>
                    <item.icon className={`w-4 h-4 ${item.color}`} aria-hidden="true" />
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
    </PageShell>
  );
}
