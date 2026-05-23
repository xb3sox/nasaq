"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Download,
  FileText,
  Receipt,
  CheckCircle2,
  Clock,
  TrendingUp,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEMO_INVOICES } from "@/lib/demo-data";

type Invoice = typeof DEMO_INVOICES[number];

function InvoiceDetailModal({ inv, onClose }: { inv: Invoice; onClose: () => void }) {
  const vatRate = 0.15;
  const subtotal = inv.amount;
  const vat = +(subtotal * vatRate).toFixed(2);
  const total = +(subtotal + vat).toFixed(2);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogTitle>فاتورة زكاتية — {inv.id.toUpperCase()}</DialogTitle>
        <div className="space-y-4 text-sm">
          {/* Header */}
          <div className="p-4 rounded-xl bg-muted/50 border border-border/40 space-y-1">
            <div className="font-bold text-lg">عيادات النخبة</div>
            <div className="text-xs text-muted-foreground">رقم سجل ضريبة: 310000000000003 | 31xxxxx | سي7 رقم تسجيل ZATCA</div>
            <div className="text-xs text-muted-foreground">تاريخ الفاتورة: {inv.date} · العملة: SAR</div>
          </div>

          {/* Customer */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-muted-foreground mb-1">العميل</div>
              <div className="font-medium">{inv.customerName}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">رقم الفاتورة</div>
              <div className="font-mono font-medium">{inv.id.toUpperCase()}</div>
            </div>
          </div>

          {/* Line item */}
          <div className="border rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted/50 border-b">
                  <th className="text-right p-2.5 font-medium">الوصف</th>
                  <th className="text-left p-2.5 font-medium">السعر</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2.5">{inv.serviceName}</td>
                  <td className="p-2.5 text-left font-mono">{subtotal.toLocaleString()} SAR</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="space-y-2 border-t pt-3">
            <div className="flex justify-between text-muted-foreground">
              <span>المجموع قبل الضريبة</span>
              <span className="font-mono">{subtotal.toLocaleString()} SAR</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>ضريبة القيمة المضافة (15%)</span>
              <span className="font-mono">{vat.toLocaleString()} SAR</span>
            </div>
            <div className="flex justify-between font-bold text-base border-t pt-2">
              <span>الإجمالي شامل الضريبة</span>
              <span className="font-mono text-primary">{total.toLocaleString()} SAR</span>
            </div>
          </div>

          {/* ZATCA QR placeholder */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border/40">
            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center text-xs text-muted-foreground text-center leading-tight">كود QRزكاتي</div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="font-medium text-foreground">قواعد ZATCA E-Invoice</div>
              <div>الفاتورة تلتزم بمتطلبات هيئة الزكاة والدخل السعودية</div>
              <div className="text-muted-foreground/70">كود TLV + QR يتم تفعيله بعد تسجيل ZATCA</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <Button size="sm" className="flex-1">PDF تنزيل PDF</Button>
            <Button size="sm" variant="outline" className="flex-1" onClick={onClose}>إغلاق</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const STATUS_LABELS: Record<string, string> = {
  paid: "مدفوعة",
  pending: "معلق",
  cancelled: "ملغي",
};

const STATUS_BADGE_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  paid: "default",
  pending: "secondary",
  cancelled: "destructive",
};

const paidInvoices = DEMO_INVOICES.filter((i) => i.status === "paid").length;
const pendingInvoices = DEMO_INVOICES.filter((i) => i.status === "pending").length;
const totalRevenue = DEMO_INVOICES
  .filter((i) => i.status === "paid")
  .reduce((sum, i) => sum + i.amount, 0);
const pendingRevenue = DEMO_INVOICES
  .filter((i) => i.status === "pending")
  .reduce((sum, i) => sum + i.amount, 0);

const STAT_CARDS = [
  {
    label: "إجمالي الفواتير",
    value: DEMO_INVOICES.length,
    icon: Receipt,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    label: "مدفوعة",
    value: paidInvoices,
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-500/10",
  },
  {
    label: "معلقة",
    value: pendingInvoices,
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-500/10",
  },
  {
    label: "إجمالي الإيرادات",
    value: `${totalRevenue.toLocaleString()} ر.س`,
    icon: TrendingUp,
    color: "text-primary",
    bg: "bg-primary/10",
    subtitle: `${pendingRevenue.toLocaleString()} ر.س معلق`,
  },
];

export default function InvoicesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const filtered = DEMO_INVOICES.filter((inv) => {
    const matchSearch =
      inv.customerName.includes(search) ||
      inv.id.includes(search);
    const matchStatus =
      statusFilter === "all" || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {selectedInvoice && (
        <InvoiceDetailModal inv={selectedInvoice} onClose={() => setSelectedInvoice(null)} />
      )}
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">الفواتير</h1>
          <p className="text-sm text-muted-foreground">إدارة وتتبع فواتير العيادة</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="min-h-[40px] sm:min-h-0 sm:h-9 gap-1.5">
            <Download className="w-3.5 h-3.5" />
            تصدير
          </Button>
          <Button size="sm" className="min-h-[40px] sm:min-h-0 sm:h-9 gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            فاتورة جديدة
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((stat) => (
          <Card key={stat.label} className="p-5 border-border/50 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
              <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-4.5 h-4.5 ${stat.color}`} />
              </div>
            </div>
            <div className="space-y-0.5">
              <div className={`text-2xl font-bold tracking-tight ${stat.color}`}>{stat.value}</div>
              {"subtitle" in stat && stat.subtitle && (
                <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="ابحث بالاسم أو رقم الفاتورة..."
            className="h-9 pr-9 border-border/50 focus-visible:ring-primary/30"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
          <SelectTrigger className="w-[150px] h-9 border-border/50">
            <SelectValue placeholder="جميع الحالات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            <SelectItem value="paid">مدفوعة</SelectItem>
            <SelectItem value="pending">معلق</SelectItem>
            <SelectItem value="cancelled">ملغي</SelectItem>
          </SelectContent>
        </Select>
        <div className="text-xs text-muted-foreground mr-auto">
          {filtered.length} من {DEMO_INVOICES.length} فاتورة
        </div>
      </div>

      {/* Invoice Table */}
      <Card className="overflow-hidden border-border/50">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="text-right font-medium text-xs text-muted-foreground uppercase tracking-wider px-5 py-3.5">رقم الفاتورة</th>
                <th className="text-right font-medium text-xs text-muted-foreground uppercase tracking-wider px-5 py-3.5">العميل</th>
                <th className="text-right font-medium text-xs text-muted-foreground uppercase tracking-wider px-5 py-3.5">الخدمة</th>
                <th className="text-right font-medium text-xs text-muted-foreground uppercase tracking-wider px-5 py-3.5">المبلغ (SAR)</th>
                <th className="text-right font-medium text-xs text-muted-foreground uppercase tracking-wider px-5 py-3.5">الحالة</th>
                <th className="text-right font-medium text-xs text-muted-foreground uppercase tracking-wider px-5 py-3.5">التاريخ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="w-8 h-8 text-muted-foreground/50" />
                      <span>لا توجد فواتير مطابقة</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((inv) => (
                  <tr key={inv.id} className="hover:bg-muted/20 transition-colors group cursor-pointer" onClick={() => setSelectedInvoice(inv)}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center group-hover:bg-primary/12 transition-colors">
                          <FileText className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-medium font-mono text-xs tracking-wider">{inv.id.toUpperCase()}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-medium">{inv.customerName}</td>
                    <td className="px-5 py-4 text-muted-foreground">{inv.serviceName}</td>
                    <td className="px-5 py-4 font-semibold tabular-nums">{inv.amount.toLocaleString()} SAR</td>
                    <td className="px-5 py-4">
                      <Badge variant={STATUS_BADGE_VARIANTS[inv.status] ?? "outline"}>
                        {STATUS_LABELS[inv.status] ?? inv.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground tabular-nums">{inv.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
