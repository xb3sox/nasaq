"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DEMO_METRICS, DEMO_REPORT_STATS } from "@/lib/demo-data";
import {
  TrendingUp, Users, CalendarCheck,
  Bot, DollarSign, Clock, ArrowUpRight, ArrowDownRight, RefreshCw, Download, Calendar
} from "lucide-react";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
  trend,
  sparklineData
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  color: string;
  trend?: "up" | "down";
  sparklineData?: number[];
}) {
  return (
    <Card className="p-5 hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
      <div>
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
      </div>
      <div className="mt-4 flex items-end justify-between h-10 gap-4">
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium mb-1 ${trend === "up" ? "text-green-600" : "text-red-500"}`}>
            {trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            <span>{trend === "up" ? "+12%" : "-3%"}</span>
          </div>
        )}
        {sparklineData && (
          <div className="h-full flex-1 max-w-[80px] ms-auto opacity-70" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData.map((val, i) => ({ val, i }))}>
                <Line type="monotone" dataKey="val" stroke={trend === "up" ? "#16a34a" : "#dc2626"} strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </Card>
  );
}

const chartData = DEMO_METRICS.labels.map((label, index) => ({
  name: label,
  bookings: DEMO_METRICS.bookings[index],
  leads: DEMO_METRICS.leads[index],
}));

const sourceData = [
  { name: "واتساب AI", value: 45 },
  { name: "واتساب", value: 25 },
  { name: "الاستقبال", value: 15 },
  { name: "إحالة", value: 10 },
  { name: "إنستغرام", value: 5 }
];
const COLORS = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)"];

const funnelData = [
  { name: "الرسائل", value: 1200 },
  { name: "AI تعامل", value: 850 },
  { name: "تم الحجز", value: 320 },
  { name: "تم الإكمال", value: 290 },
];

export default function ReportsPage() {
  const [period, setPeriod] = useState<"أسبوع" | "شهر" | "ربع سنة" | "سنة">("أسبوع");

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + "اليوم,الحجوزات,العملاء المحتملين\n" 
      + chartData.map(e => `${e.name},${e.bookings},${e.leads}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `تقرير_العيادة_${period}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">التقارير</h1>
          <p className="text-sm text-muted-foreground mt-1">نظرة شاملة على أداء العيادة</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-muted/50 p-1 rounded-lg border border-border/50">
            {(["أسبوع", "شهر", "ربع سنة", "سنة"] as const).map(p => (
              <Button
                key={p}
                size="sm"
                variant={period === p ? "secondary" : "ghost"}
                onClick={() => setPeriod(p)}
                className={`text-xs px-3 h-7 ${period === p ? "shadow-sm bg-background" : ""}`}
              >
                {p}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2 border rounded-md px-3 h-9 bg-background">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">01/05 - 07/05</span>
          </div>
          <Button size="sm" variant="outline" className="gap-2 h-9" onClick={handleExportCSV}>
            <Download className="w-4 h-4" />
            تصدير CSV
          </Button>
          <Button size="sm" className="gap-2 h-9">
            توليد تقرير
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
          sparklineData={[3, 4, 2, 5, 4, 6, 5]}
        />
        <StatCard
          label="إجمالي الإيرادات"
          value={`${(DEMO_REPORT_STATS.monthRevenue / 1000).toFixed(1)}K`}
          sub="ريال سعودي"
          icon={DollarSign}
          color="bg-green-50 text-green-600"
          trend="up"
          sparklineData={[10, 15, 12, 18, 14, 20, 22]}
        />
        <StatCard
          label="محادثات AI"
          value={DEMO_REPORT_STATS.aiHandled}
          sub={`${DEMO_REPORT_STATS.humanNeeded} تحتاج موظف`}
          icon={Bot}
          color="bg-primary/10 text-primary"
          trend="up"
          sparklineData={[15, 20, 18, 25, 22, 30, 28]}
        />
        <StatCard
          label="عملاء جدد"
          value={DEMO_REPORT_STATS.newLeads}
          sub="هذا الأسبوع"
          icon={Users}
          color="bg-purple-50 text-purple-600"
          trend="up"
          sparklineData={[2, 3, 5, 4, 6, 8, 7]}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings Bar Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold">الحجوزات</h2>
              <p className="text-xs text-muted-foreground">خلال {period}</p>
            </div>
            <Badge className="bg-primary/10 text-primary">
              {DEMO_METRICS.bookings.reduce((a, b) => a + b, 0)} إجمالي
            </Badge>
          </div>
          <div className="h-64 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis reversed={true} dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280', fontFamily: 'inherit' }} dy={10} />
                <YAxis orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280', fontFamily: 'inherit' }} />
                <Tooltip 
                  cursor={{ fill: '#f3f4f6' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-primary)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontFamily: 'inherit', textAlign: 'right' }}
                  itemStyle={{ color: 'var(--color-primary)' }}
                  formatter={(value) => [value as React.ReactNode, 'الحجوزات']}
                  labelStyle={{ color: '#0f172a', marginBottom: '4px', fontWeight: 600 }}
                />
                <Bar dataKey="bookings" fill="var(--color-primary)" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Leads Line Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold">العملاء المحتملين</h2>
              <p className="text-xs text-muted-foreground">تفاعل العملاء الجدد</p>
            </div>
            <Badge className="bg-primary/10 text-primary">
              {DEMO_METRICS.leads.reduce((a, b) => a + b, 0)} إجمالي
            </Badge>
          </div>
          <div className="h-64 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis reversed={true} dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280', fontFamily: 'inherit' }} dy={10} />
                <YAxis orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280', fontFamily: 'inherit' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-primary)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontFamily: 'inherit', textAlign: 'right' }}
                  itemStyle={{ color: 'var(--color-primary)' }}
                  formatter={(value) => [value as React.ReactNode, 'العملاء المحتملين']}
                  labelStyle={{ color: '#0f172a', marginBottom: '4px', fontWeight: 600 }}
                />
                <Line type="monotone" dataKey="leads" stroke="var(--color-primary)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, fill: 'var(--color-primary)' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Sources Donut Chart */}
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-base font-semibold">مصادر الحجوزات</h2>
            <p className="text-xs text-muted-foreground">توزيع القنوات التي يأتي منها العملاء</p>
          </div>
          <div className="h-64 w-full flex items-center" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontFamily: 'inherit', textAlign: 'right' }}
                  itemStyle={{ color: '#0f172a' }}
                  formatter={(value) => [`${value}%`, 'النسبة']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Conversion Funnel Bar Chart */}
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-base font-semibold">قمع التحويل (Funnel)</h2>
            <p className="text-xs text-muted-foreground">من أول رسالة حتى إكمال الموعد</p>
          </div>
          <div className="h-64 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#0f172a', fontFamily: 'inherit' }} width={80} orientation="right" />
                <Tooltip 
                  cursor={{ fill: '#f3f4f6' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-chart-2)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontFamily: 'inherit', textAlign: 'right' }}
                  itemStyle={{ color: 'var(--color-chart-2)' }}
                  formatter={(value) => [value as React.ReactNode, 'العدد']}
                />
                <Bar dataKey="value" fill="var(--color-chart-2)" radius={[0, 4, 4, 0]} maxBarSize={30} label={{ position: 'insideLeft', fill: '#fff', fontSize: 12, fontFamily: 'inherit' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold">{DEMO_REPORT_STATS.remindersSent}</div>
            <div className="text-xs text-muted-foreground">تذكير مرسل</div>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold">{DEMO_REPORT_STATS.responseTimeMin} د</div>
            <div className="text-xs text-muted-foreground">متوسط وقت الرد</div>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
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
          <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
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
