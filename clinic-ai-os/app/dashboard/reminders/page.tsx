"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Bell, Clock, CheckCircle, XCircle } from "lucide-react";

const MOCK_REMINDERS = [
  { id: "1", customer: "محمد السالم", phone: "+966500001001", template: "تذكير قبل 24 ساعة", scheduled_for: "2026-05-20 09:00", status: "sent", type: "appointment_24h" },
  { id: "2", customer: "سارة العامري", phone: "+966500001002", template: "تذكير قبل ساعتين", scheduled_for: "2026-05-20 11:30", status: "pending", type: "appointment_2h" },
  { id: "3", customer: "فهد الحربي", phone: "+966500001003", template: "متابعة بعد الزيارة", scheduled_for: "2026-05-21 10:00", status: "pending", type: "post_visit" },
  { id: "4", customer: "ريم القحطاني", phone: "+966500001004", template: "متابعة العميل البارد", scheduled_for: "2026-05-22 11:00", status: "failed", type: "cold_lead" },
  { id: "5", customer: "نورة الفيفي", phone: "+966500001005", template: "تذكير عدم الحضور", scheduled_for: "2026-05-19 14:00", status: "sent", type: "no_show" },
];

const STATUS_LABEL: Record<string, string> = { pending: "انتظار", sent: "أُرسل", failed: "فشل" };
const STATUS_COLOR: Record<string, string> = { pending: "bg-yellow-100 text-yellow-800", sent: "bg-green-100 text-green-800", failed: "bg-red-100 text-red-800" };
const TYPE_LABEL: Record<string, string> = { appointment_24h: "قبل 24 ساعة", appointment_2h: "قبل ساعتين", post_visit: "بعد الزيارة", cold_lead: "عميل بارد", no_show: "عدم الحضور" };

export default function RemindersPage() {
  const pendingCount = MOCK_REMINDERS.filter(r => r.status === "pending").length;
  const sentCount = MOCK_REMINDERS.filter(r => r.status === "sent").length;
  const failedCount = MOCK_REMINDERS.filter(r => r.status === "failed").length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">التذكيرات</h1>
        <Button><Plus className="w-4 h-4 ml-2" />تذكير جديد</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2 flex-row items-center gap-2">
            <Clock className="w-4 h-4 text-yellow-500" />
            <CardTitle className="text-sm text-muted-foreground">قيد الانتظار</CardTitle>
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-yellow-600">{pendingCount}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex-row items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <CardTitle className="text-sm text-muted-foreground">أُرسل</CardTitle>
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-green-600">{sentCount}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex-row items-center gap-2">
            <XCircle className="w-4 h-4 text-red-500" />
            <CardTitle className="text-sm text-muted-foreground">فشل</CardTitle>
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-red-600">{failedCount}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="text-right p-4 font-medium">العميل</th>
                <th className="text-right p-4 font-medium">النوع</th>
                <th className="text-right p-4 font-medium">القالب</th>
                <th className="text-right p-4 font-medium">وقت الإرسال</th>
                <th className="text-right p-4 font-medium">الحالة</th>
                <th className="text-right p-4 font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_REMINDERS.map(r => (
                <tr key={r.id} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div className="font-medium">{r.customer}</div>
                    <div className="text-xs text-muted-foreground">{r.phone}</div>
                  </td>
                  <td className="p-4">
                    <Badge variant="outline">{TYPE_LABEL[r.type]}</Badge>
                  </td>
                  <td className="p-4 text-muted-foreground">{r.template}</td>
                  <td className="p-4 text-muted-foreground">{r.scheduled_for}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLOR[r.status]}`}>{STATUS_LABEL[r.status]}</span>
                  </td>
                  <td className="p-4">
                    {r.status === "failed" && (
                      <Button size="sm" variant="outline">إعادة الإرسال</Button>
                    )}
                    {r.status === "pending" && (
                      <Button size="sm" variant="ghost" className="text-destructive">إلغاء</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
