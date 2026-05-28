"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { PageShell } from "@/components/ui/page-shell";
import { Users, CalendarCheck, MessageCircle, TrendingUp, Play, CheckCircle2, Loader2, Bell, Settings } from "lucide-react";
import { DEMO_CLINICS, DEMO_AI_DECISION, DEMO_BOOKING, DEMO_CONVERSATIONS, DEMO_REPORT_STATS } from "@/lib/demo-data";
import Link from "next/link";
import { useSetupStore } from "@/lib/setup-store";
import { RiyadhClock } from "./riyadh-clock";
import { LiveDemoRunner } from "./live-demo-runner";
import { OVERVIEW_LINKS } from "./content";

// Convenience aliases for demo data — all data now from canonical demo-data.ts
const demoClinic = DEMO_CLINICS[0];
const demoConversation = DEMO_CONVERSATIONS[0];
const demoAiDecision = DEMO_AI_DECISION;
const demoBooking = DEMO_BOOKING;
const demoReportStats = DEMO_REPORT_STATS;

export function OverviewPage() {
  const { isSetupComplete } = useSetupStore();

  return (
    <PageShell surface="gradient" size="wide">
      {!isSetupComplete && (
        <div className="bg-warning-surface border border-warning/20 text-warning dark:text-warning rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-warning" />
            <div>
              <h3 className="font-bold text-sm tracking-tight">أكمل إعداد حسابك</h3>
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
      <div className="flex flex-wrap gap-4">
        {OVERVIEW_LINKS.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}>
            <Button variant="outline" size="touch" className="bg-background/80 backdrop-blur shadow-sm gap-2 rounded-lg hover:border-primary hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-offset-1">
              <Icon className="w-4 h-4" aria-hidden="true" /> {label}
            </Button>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
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
            <CardTitle className="tracking-tight text-base flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" aria-hidden="true" /> آخر مسار حجز من واتساب
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
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
