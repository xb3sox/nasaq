"use client";
import { ChartWrapper } from "@/components/ChartWrapper";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DEMO_METRICS, DEMO_REPORT_STATS } from "@/lib/demo-data";
import {
  TrendingUp, Users, CalendarCheck,
  Bot, DollarSign, Clock, ArrowUpRight, ArrowDownRight, RefreshCw, Download, Calendar
} from "lucide-react";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
  trend,
  sparklineData,
  explanation
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  color: string;
  trend?: "up" | "down";
  sparklineData?: number[];
  explanation?: string;
}) {
  return (
    <Card className="p-5 hover:shadow-md transition-shadow duration-200 flex flex-col justify-between min-w-0">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-muted-foreground truncate" title={explanation || label}>{label}</div>
            <div className="text-3xl font-bold mt-1 truncate">{value}</div>
            {sub && <div className="text-xs text-muted-foreground mt-1 truncate">{sub}</div>}
          </div>
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}
            title={explanation || label}
            role="img"
            aria-label={explanation || label}
          >
            <Icon className="w-5 h-5" aria-hidden="true" />
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
            <ChartWrapper><ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData.map((val, i) => ({ val, i }))}>
                <Line type="monotone" dataKey="val" stroke={trend === "up" ? "#16a34a" : "#dc2626"} strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer></ChartWrapper>
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
          value={new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 }).format(DEMO_REPORT_STATS.monthRevenue)}
          sub="هذا الشهر"
          icon={DollarSign}
          color="bg-green-50 text-green-600"
          trend="up"
          sparklineData={[10, 15, 12, 18, 14, 20, 22]}
          explanation="إجمالي المبالغ المحصلة من الحجوزات المكتملة"
        />
        <StatCard
          label="محادثات الذكاء الاصطناعي"
          value={DEMO_REPORT_STATS.aiHandled}
          sub={`${DEMO_REPORT_STATS.humanNeeded} تحتاج موظف`}
          icon={Bot}
          color="bg-primary/10 text-primary"
          trend="up"
          sparklineData={[15, 20, 18, 25, 22, 30, 28]}
          explanation="المحادثات التي تم التعامل معها تلقائياً بواسطة الذكاء الاصطناعي"
        />
        <StatCard
          label="عملاء جدد"
          value={DEMO_REPORT_STATS.newLeads}
          sub="هذا الأسبوع"
          icon={Users}
          color="bg-purple-50 text-purple-600"
          trend="up"
          sparklineData={[2, 3, 5, 4, 6, 8, 7]}
          explanation="عدد العملاء الذين تواصلوا لأول مرة"
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
          <div className="h-64 w-full min-w-0" dir="ltr" role="img" aria-label="رسم بياني يوضح عدد الحجوزات خلال الفترة المحددة">
            <ChartWrapper><ResponsiveContainer width="100%" height="100%">
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
                <Legend wrapperStyle={{ fontSize: '12px', fontFamily: 'inherit' }} />
                <Bar dataKey="bookings" name="الحجوزات" fill="var(--color-primary)" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer></ChartWrapper>
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
          <div className="h-64 w-full min-w-0" dir="ltr" role="img" aria-label="رسم بياني خطي يوضح تفاعل العملاء المحتملين والجدد">
            <ChartWrapper><ResponsiveContainer width="100%" height="100%">
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
                <Legend wrapperStyle={{ fontSize: '12px', fontFamily: 'inherit' }} />
                <Line type="monotone" dataKey="leads" name="العملاء المحتملين" stroke="var(--color-primary)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, fill: 'var(--color-primary)' }} />
              </LineChart>
            </ResponsiveContainer></ChartWrapper>
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
          <div className="h-64 w-full flex items-center min-w-0" dir="ltr" role="img" aria-label="رسم بياني دائري يوضح توزيع قنوات ومصادر الحجوزات">
            <ChartWrapper><ResponsiveContainer width="100%" height="100%">
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
            </ResponsiveContainer></ChartWrapper>
          </div>
        </Card>

        {/* Conversion Funnel Bar Chart */}
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-base font-semibold">مراحل تحويل العملاء</h2>
            <p className="text-xs text-muted-foreground">تتبع العملاء من أول رسالة حتى إكمال الموعد</p>
          </div>
          <div className="h-64 w-full min-w-0" dir="ltr" role="img" aria-label="رسم بياني شريطي يوضح مراحل تحويل العملاء من أول رسالة حتى إكمال الموعد">
            <ChartWrapper><ResponsiveContainer width="100%" height="100%">
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
                <Legend wrapperStyle={{ fontSize: '12px', fontFamily: 'inherit' }} />
                <Bar dataKey="value" name="العدد" fill="var(--color-chart-2)" radius={[0, 4, 4, 0]} maxBarSize={30} label={{ position: 'insideLeft', fill: '#fff', fontSize: 12, fontFamily: 'inherit' }} />
              </BarChart>
            </ResponsiveContainer></ChartWrapper>
          </div>
        </Card>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 flex items-center gap-4 min-w-0" title="إجمالي رسائل التذكير المرسلة بنجاح">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0" role="img" aria-label="تذكير مرسل">
            <RefreshCw className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <div className="text-2xl font-bold truncate">{new Intl.NumberFormat('ar-SA').format(DEMO_REPORT_STATS.remindersSent)}</div>
            <div className="text-xs text-muted-foreground truncate">تذكير مرسل</div>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4 min-w-0" title="متوسط الوقت المستغرق للرد على العملاء">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0" role="img" aria-label="متوسط وقت الرد">
            <Clock className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <div className="text-2xl font-bold truncate">{new Intl.NumberFormat('ar-SA').format(DEMO_REPORT_STATS.responseTimeMin)} د</div>
            <div className="text-xs text-muted-foreground truncate">متوسط وقت الرد</div>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4 min-w-0" title="نسبة المحادثات التي أدارها الذكاء الاصطناعي بالكامل">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0" role="img" aria-label="نسبة تعامل الذكاء الاصطناعي">
            <Bot className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <div className="text-2xl font-bold truncate">
              {new Intl.NumberFormat('ar-SA', { style: 'percent' }).format(DEMO_REPORT_STATS.aiHandled / (DEMO_REPORT_STATS.aiHandled + DEMO_REPORT_STATS.humanNeeded))}
            </div>
            <div className="text-xs text-muted-foreground truncate">AI يتعامل تلقائياً</div>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4 min-w-0" title="إجمالي الحجوزات المؤكدة لهذا الشهر">
          <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0" role="img" aria-label="حجوزات الشهر">
            <TrendingUp className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <div className="text-2xl font-bold truncate">{new Intl.NumberFormat('ar-SA').format(DEMO_REPORT_STATS.monthBookings)}</div>
            <div className="text-xs text-muted-foreground truncate">حجز هذا الشهر</div>
          </div>
        </Card>
      </div>
    </div>
  );
}
