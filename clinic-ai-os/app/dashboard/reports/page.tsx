"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DEMO_METRICS, DEMO_REPORT_STATS } from "@/lib/demo-data";
import {
  TrendingUp, Users, CalendarCheck, MessageCircle,
  Bot, DollarSign, Clock, ArrowUpRight, ArrowDownRight, RefreshCw,
} from "lucide-react";
import { useState } from "react";

const MAX_BOOKINGS = Math.max(...DEMO_METRICS.bookings);
const MAX_LEADS = Math.max(...DEMO_METRICS.leads);

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
  trend,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  color: string;
  trend?: "up" | "down";
}) {
  return (
    <Card className="p-5 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="text-sm font-medium text-muted-foreground">{label}</div>
          <div className="text-3xl font-bold mt-1">{value}</div>
          {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {trend && (
        <div className={`flex items-center gap-1 mt-3 text-xs font-medium ${trend === "up" ? "text-green-600" : "text-red-500"}`}>
          {trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          <span>{trend === "up" ? "+12%" : "-3%"} عن الشهر الماضي</span>
        </div>
      )}
    </Card>
  );
}

export default function ReportsPage() {
  const [period, setPeriod] = useState<"week" | "month">("week");

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">التقارير</h1>
          <p className="text-sm text-muted-foreground mt-1">نظرة شاملة على أداء العيادة</p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={period === "week" ? "default" : "outline"}
            onClick={() => setPeriod("week")}
          >
            هذا الأسبوع
          </Button>
          <Button
            size="sm"
            variant={period === "month" ? "default" : "outline"}
            onClick={() => setPeriod("month")}
          >
            هذا الشهر
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="حجوزات اليوم"
          value={DEMO_REPORT_STATS.todayBookings}
          sub={`${DEMO_REPORT_STATS.todayConfirmed} مؤكد`}
          icon={CalendarCheck}
          color="bg-blue-50 text-blue-600"
          trend="up"
        />
        <StatCard
          label="إجمالي الإيرادات"
          value={`${(DEMO_REPORT_STATS.monthRevenue / 1000).toFixed(1)}K`}
          sub="ريال سعودي"
          icon={DollarSign}
          color="bg-green-50 text-green-600"
          trend="up"
        />
        <StatCard
          label="محادثات AI"
          value={DEMO_REPORT_STATS.aiHandled}
          sub={`${DEMO_REPORT_STATS.humanNeeded} تحتاج موظف`}
          icon={Bot}
          color="bg-primary/10 text-primary"
        />
        <StatCard
          label="عملاء جدد"
          value={DEMO_REPORT_STATS.newLeads}
          sub="هذا الأسبوع"
          icon={Users}
          color="bg-purple-50 text-purple-600"
          trend="up"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold">الحجوزات</h2>
              <p className="text-xs text-muted-foreground">خلال {period === "week" ? "الأسبوع" : "الشهر"}</p>
            </div>
            <Badge className="bg-primary/10 text-primary">
              {DEMO_METRICS.bookings.reduce((a, b) => a + b, 0)} إجمالي
            </Badge>
          </div>
          <div className="flex items-end gap-3 h-40">
            {DEMO_METRICS.labels.map((day, i) => {
              const val = DEMO_METRICS.bookings[i];
              const pct = (val / MAX_BOOKINGS) * 100;
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-muted rounded-lg relative" style={{ height: 140 }}>
                    <div
                      className="absolute bottom-0 left-0 right-0 rounded-lg bg-primary/80 transition-all duration-500 hover:bg-primary"
                      style={{ height: `${pct}%` }}
                      title={`${val} حجز`}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{day}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Leads Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold">العملاء المحتملين</h2>
              <p className="text-xs text-muted-foreground">خلال {period === "week" ? "الأسبوع" : "الشهر"}</p>
            </div>
            <Badge className="bg-green-100 text-green-800">
              {DEMO_METRICS.leads.reduce((a, b) => a + b, 0)} إجمالي
            </Badge>
          </div>
          <div className="flex items-end gap-3 h-40">
            {DEMO_METRICS.labels.map((day, i) => {
              const val = DEMO_METRICS.leads[i];
              const pct = (val / MAX_LEADS) * 100;
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-muted rounded-lg relative" style={{ height: 140 }}>
                    <div
                      className="absolute bottom-0 left-0 right-0 rounded-lg bg-green-500/80 transition-all duration-500 hover:bg-green-500"
                      style={{ height: `${pct}%` }}
                      title={`${val} عميل`}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{day}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold">{DEMO_REPORT_STATS.remindersSent}</div>
            <div className="text-xs text-muted-foreground">تذكير مرسل</div>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold">{DEMO_REPORT_STATS.remindersFailed}</div>
            <div className="text-xs text-muted-foreground">تذكير فشل</div>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold">{DEMO_REPORT_STATS.responseTimeMin} د</div>
            <div className="text-xs text-muted-foreground">متوسط وقت الرد</div>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold">{DEMO_REPORT_STATS.monthBookings}</div>
            <div className="text-xs text-muted-foreground">حجز هذا الشهر</div>
          </div>
        </Card>
      </div>
    </div>
  );
}