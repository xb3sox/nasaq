"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle, Printer } from "lucide-react";

const MOCK_INVOICES = [
  { id: "INV-1001", customer: "محمد السالم", service: "استشارة عامة", subtotal: 150, discount: 0, tax: 22.5, total: 172.5, status: "paid", date: "2026-05-20" },
  { id: "INV-1002", customer: "سارة العامري", service: "تنظيف أسنان", subtotal: 250, discount: 25, tax: 33.75, total: 258.75, status: "unpaid", date: "2026-05-20" },
  { id: "INV-1003", customer: "فهد الحربي", service: "فحص دوري", subtotal: 100, discount: 0, tax: 15, total: 115, status: "paid", date: "2026-05-19" },
  { id: "INV-1004", customer: "ريم القحطاني", service: "قسطرة جلدية", subtotal: 400, discount: 0, tax: 60, total: 460, status: "partially_paid", date: "2026-05-18" },
];

const STATUS_LABEL: Record<string, string> = { paid: "مدفوع", unpaid: "غير مدفوع", partially_paid: "مدفوع جزئياً", refunded: "مُسترد" };
const STATUS_COLOR: Record<string, string> = { paid: "bg-green-100 text-green-800", unpaid: "bg-red-100 text-red-800", partially_paid: "bg-orange-100 text-orange-800", refunded: "bg-blue-100 text-blue-800" };

export default function InvoicesPage() {
  const totalRevenue = MOCK_INVOICES.filter(i => i.status === "paid").reduce((s, i) => s + i.total, 0);
  const totalPending = MOCK_INVOICES.filter(i => i.status === "unpaid").reduce((s, i) => s + i.total, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">الفواتير</h1>
        <Button><Plus className="w-4 h-4 ml-2" />فاتورة جديدة</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">الإيرادات المحصلة</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-green-600">{totalRevenue.toLocaleString()} ر.س</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">فواتير معلقة</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-red-600">{totalPending.toLocaleString()} ر.س</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">إجمالي الفواتير</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{MOCK_INVOICES.length}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="text-right p-4 font-medium">رقم الفاتورة</th>
                <th className="text-right p-4 font-medium">العميل</th>
                <th className="text-right p-4 font-medium">الخدمة</th>
                <th className="text-right p-4 font-medium">الإجمالي</th>
                <th className="text-right p-4 font-medium">الحالة</th>
                <th className="text-right p-4 font-medium">التاريخ</th>
                <th className="text-right p-4 font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_INVOICES.map(inv => (
                <tr key={inv.id} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-mono font-medium">{inv.id}</td>
                  <td className="p-4">{inv.customer}</td>
                  <td className="p-4 text-muted-foreground">{inv.service}</td>
                  <td className="p-4 font-medium">{inv.total.toLocaleString()} ر.س</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLOR[inv.status]}`}>{STATUS_LABEL[inv.status]}</span>
                  </td>
                  <td className="p-4 text-muted-foreground">{inv.date}</td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      {inv.status === "unpaid" && (
                        <Button size="sm" variant="outline" className="text-green-700">
                          <CheckCircle className="w-3.5 h-3.5 ml-1" />تم الدفع
                        </Button>
                      )}
                      <Button size="sm" variant="ghost"><Printer className="w-3.5 h-3.5" /></Button>
                    </div>
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
