"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { demoReportStats } from "@/lib/demo-clinic";

const STATS = [
  { label: "إجمالي الحجوزات", value: "148", trend: "+12%", up: true },
  { label: "مؤكدة", value: "102", trend: "+8%", up: true },
  { label: "ملغاة", value: "18", trend: "-2%", up: false },
  { label: "لم يحضر", value: "28", trend: "+3%", up: false },
  { label: "الإيرادات", value: "87,400 ر.س", trend: "+18%", up: true },
  { label: "معالجة بالذكاء", value: `${demoReportStats.aiHandled} محادثة`, trend: "+24%", up: true },
];

const TOP_SERVICES = [
  { name: "استشارة عامة", count: 56, revenue: "8,400 ر.س" },
  { name: "تنظيف أسنان", count: 38, revenue: "9,500 ر.س" },
  { name: "قسطرة جلدية", count: 22, revenue: "8,800 ر.س" },
  { name: "فحص دوري", count: 32, revenue: "3,200 ر.س" },
];

const TOP_SOURCES = [
  { name: "واتساب", percent: 52 },
  { name: "انستقرام", percent: 22 },
  { name: "إحالة", percent: 15 },
  { name: "الموقع الإلكتروني", percent: 11 },
];

export default function ReportsPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">التقارير</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {STATS.map(s => (
          <Card key={s.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">{s.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className={`flex items-center gap-1 text-xs mt-1 ${s.up ? "text-green-600" : "text-red-600"}`}>
                {s.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {s.trend} عن الشهر الماضي
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">أكثر الخدمات طلباً</CardTitle></CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead><tr className="border-b"><th className="text-right pb-2 text-muted-foreground">الخدمة</th><th className="text-right pb-2 text-muted-foreground">العدد</th><th className="text-right pb-2 text-muted-foreground">الإيراد</th></tr></thead>
              <tbody>
                {TOP_SERVICES.map(s => (
                  <tr key={s.name} className="border-b last:border-0">
                    <td className="py-3 font-medium">{s.name}</td>
                    <td className="py-3 text-muted-foreground">{s.count}</td>
                    <td className="py-3 text-green-600 font-medium">{s.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">مصادر العملاء</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {TOP_SOURCES.map(s => (
              <div key={s.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{s.name}</span>
                  <span className="text-muted-foreground">{s.percent}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${s.percent}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">أداء الذكاء الاصطناعي</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-1"><div className="text-2xl font-bold text-blue-600">{demoReportStats.aiHandled}</div><div className="text-xs text-muted-foreground">محادثة معالجة</div></div>
            <div className="space-y-1"><div className="text-2xl font-bold text-green-600">{demoReportStats.conversionRate}%</div><div className="text-xs text-muted-foreground">نسبة التحويل</div></div>
            <div className="space-y-1"><div className="text-2xl font-bold text-orange-600">{demoReportStats.humanNeeded}</div><div className="text-xs text-muted-foreground">تحويل لموظف</div></div>
            <div className="space-y-1"><div className="text-2xl font-bold text-purple-600">{demoReportStats.todayBookings}</div><div className="text-xs text-muted-foreground">حجز اليوم</div></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
