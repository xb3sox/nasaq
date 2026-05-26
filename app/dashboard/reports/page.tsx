"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DEMO_METRICS, DEMO_REPORT_STATS } from "@/lib/demo-data";
import {
  TrendingUp, Users, CalendarCheck,
  Bot, DollarSign, Clock, ArrowUpRight, ArrowDownRight, RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";



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

const chartData = DEMO_METRICS.labels.map((label, index) => ({
  name: label,
  bookings: DEMO_METRICS.bookings[index],
  leads: DEMO_METRICS.leads[index],
}));

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
        {/* Bookings Bar Chart */}
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
          <div className="h-64 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis reversed={true} dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                <YAxis orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip 
                  cursor={{ fill: '#f3f4f6' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0f172a' }}
                  formatter={(value) => [value as React.ReactNode, 'الحجوزات']}
                  labelStyle={{ color: '#6b7280', marginBottom: '4px' }}
                />
                <Bar dataKey="bookings" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Leads Line Chart */}
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
          <div className="h-64 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis reversed={true} dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                <YAxis orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0f172a' }}
                  formatter={(value) => [value as React.ReactNode, 'العملاء المحتملين']}
                  labelStyle={{ color: '#6b7280', marginBottom: '4px' }}
                />
                <Line type="monotone" dataKey="leads" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
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
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold">{DEMO_REPORT_STATS.responseTimeMin} د</div>
            <div className="text-xs text-muted-foreground">متوسط وقت الرد</div>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold">
              {Math.round((DEMO_REPORT_STATS.aiHandled / (DEMO_REPORT_STATS.aiHandled + DEMO_REPORT_STATS.humanNeeded)) * 100)}%
            </div>
            <div className="text-xs text-muted-foreground">AI يتعامل تلقائياً</div>
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
