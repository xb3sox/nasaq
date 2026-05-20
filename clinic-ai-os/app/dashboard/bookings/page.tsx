"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Calendar, Clock, User, Stethoscope } from "lucide-react";

const MOCK_BOOKINGS = [
  { id: "1", customer: "محمد السالم", phone: "+966500001001", service: "استشارة عامة", doctor: "د. نواف الحسين", date: "2026-05-20", time: "10:00", status: "confirmed", payment_status: "paid" },
  { id: "2", customer: "سارة العامري", phone: "+966500001002", service: "تنظيف أسنان", doctor: "د. ريم السيف", date: "2026-05-20", time: "11:30", status: "pending", payment_status: "unpaid" },
  { id: "3", customer: "فهد الحربي", phone: "+966500001003", service: "فحص دوري", doctor: "د. نواف الحسين", date: "2026-05-20", time: "14:00", status: "completed", payment_status: "paid" },
  { id: "4", customer: "ريم القحطاني", phone: "+966500001004", service: "قسطرة جلدية", doctor: "د. علي الزهراني", date: "2026-05-21", time: "09:00", status: "no_show", payment_status: "unpaid" },
  { id: "5", customer: "نورة الفيفي", phone: "+966500001005", service: "استشارة عامة", doctor: "د. نواف الحسين", date: "2026-05-21", time: "15:30", status: "confirmed", payment_status: "partially_paid" },
];

const STATUS_LABELS: Record<string, string> = { pending: "انتظار", confirmed: "مؤكد", cancelled: "ملغي", completed: "مكتمل", no_show: "لم يحضر" };
const STATUS_COLORS: Record<string, string> = { pending: "bg-yellow-100 text-yellow-800", confirmed: "bg-green-100 text-green-800", cancelled: "bg-red-100 text-red-800", completed: "bg-purple-100 text-purple-800", no_show: "bg-gray-100 text-gray-800" };
const PAY_LABELS: Record<string, string> = { unpaid: "غير مدفوع", partially_paid: "مدفوع جزئياً", paid: "مدفوع", refunded: "مُسترد" };
const PAY_COLORS: Record<string, string> = { unpaid: "bg-red-50 text-red-700", partially_paid: "bg-orange-50 text-orange-700", paid: "bg-green-50 text-green-700", refunded: "bg-blue-50 text-blue-700" };

export default function BookingsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [view, setView] = useState<"list" | "calendar">("list");

  const filtered = MOCK_BOOKINGS.filter(b => {
    const matchSearch = b.customer.includes(search) || b.service.includes(search) || b.doctor.includes(search);
    const matchStatus = statusFilter === "all" || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">المواعيد</h1>
        <div className="flex gap-2">
          <Button variant={view === "list" ? "default" : "outline"} size="sm" onClick={() => setView("list")}>قائمة</Button>
          <Button variant={view === "calendar" ? "default" : "outline"} size="sm" onClick={() => setView("calendar")}>تقويم</Button>
          <Button><Plus className="w-4 h-4 ml-2" />حجز جديد</Button>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="بحث..." className="pr-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all","pending","confirmed","completed","no_show","cancelled"].map(s => (
            <Button key={s} variant={statusFilter === s ? "default" : "outline"} size="sm" onClick={() => setStatusFilter(s)}>
              {s === "all" ? "الكل" : STATUS_LABELS[s]}
            </Button>
          ))}
        </div>
      </div>

      {view === "list" ? (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="text-right p-4 font-medium">العميل</th>
                  <th className="text-right p-4 font-medium">الخدمة</th>
                  <th className="text-right p-4 font-medium">الطبيب</th>
                  <th className="text-right p-4 font-medium">الموعد</th>
                  <th className="text-right p-4 font-medium">الحالة</th>
                  <th className="text-right p-4 font-medium">الدفع</th>
                  <th className="text-right p-4 font-medium">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(b => (
                  <tr key={b.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="font-medium flex items-center gap-2"><User className="w-3.5 h-3.5 text-muted-foreground" />{b.customer}</div>
                      <div className="text-xs text-muted-foreground">{b.phone}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5"><Stethoscope className="w-3.5 h-3.5 text-muted-foreground" />{b.service}</div>
                    </td>
                    <td className="p-4 text-muted-foreground">{b.doctor}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-muted-foreground" />{b.date}</div>
                      <div className="flex items-center gap-1.5 text-muted-foreground"><Clock className="w-3.5 h-3.5" />{b.time}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[b.status]}`}>{STATUS_LABELS[b.status]}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${PAY_COLORS[b.payment_status]}`}>{PAY_LABELS[b.payment_status]}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">تعديل</Button>
                        <Button variant="ghost" size="sm" className="text-destructive">إلغاء</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <div className="p-12 text-center text-muted-foreground">لا توجد مواعيد</div>}
          </CardContent>
        </Card>
      ) : (
        <Card className="h-[500px] flex items-center justify-center text-muted-foreground">
          <div className="text-center space-y-2">
            <Calendar className="w-12 h-12 mx-auto opacity-30" />
            <p>عرض التقويم قيد التطوير</p>
          </div>
        </Card>
      )}
      <p className="text-sm text-muted-foreground">{filtered.length} موعد</p>
    </div>
  );
}
