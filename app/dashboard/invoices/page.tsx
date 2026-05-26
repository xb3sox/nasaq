"use client";

import { useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Plus, FileText, CheckCircle2, Clock, TrendingUp, Receipt, MoreHorizontal, ArrowUpDown, CreditCard, Send } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DEMO_INVOICES } from "@/lib/demo-data";


type Invoice = typeof DEMO_INVOICES[number];



async function generateZatcaPDF(inv: Invoice) {
  const element = document.getElementById("invoice-modal-content");
  if (!element) return;

  // Wait for fonts to load and hide buttons
  const buttons = element.querySelectorAll('button');
  buttons.forEach(b => b.style.display = 'none');

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      windowWidth: 800,
    });
    
    buttons.forEach(b => b.style.display = '');

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`invoice-${inv.id}.pdf`);
  } catch (error) {
    console.error('PDF generation error:', error);
    buttons.forEach(b => b.style.display = '');
  }
}

function InvoiceDetailModal({ inv, onClose }: { inv: Invoice; onClose: () => void }) {
  const vatRate = 0.15;
  const subtotal = inv.amount;
  const vat = +(subtotal * vatRate).toFixed(2);
  const total = +(subtotal + vat).toFixed(2);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogTitle>فاتورة زكاتية — {inv.id.toUpperCase()}</DialogTitle>
        <div id="invoice-modal-content" className="space-y-4 text-sm bg-background p-4 rounded-xl">
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

          {/* ZATCA Formatting */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-xl bg-muted/30 border border-border/40 mt-4">
            <div className="w-24 h-24 bg-white border border-border/50 rounded-lg flex flex-col items-center justify-center p-2 shrink-0">
              <div className="w-full h-full bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ZATCA_QR_PLACEHOLDER')] bg-contain bg-no-repeat bg-center opacity-80" />
              <span className="text-[10px] text-muted-foreground mt-1 font-mono">QR ZATCA</span>
            </div>
            <div className="text-sm text-muted-foreground space-y-2 flex-1 text-center sm:text-start">
              <div className="font-semibold text-foreground">فاتورة ضريبية مبسطة (ZATCA Compliant)</div>
              <div className="text-xs space-y-1">
                <div className="flex justify-between sm:justify-start sm:gap-4 border-b pb-1"><span className="text-muted-foreground/80 w-24">رقم التسجيل الضريبي:</span> <span className="font-mono text-foreground">300000000000003</span></div>
                <div className="flex justify-between sm:justify-start sm:gap-4"><span className="text-muted-foreground/80 w-24">تاريخ الإصدار:</span> <span className="font-mono text-foreground">{inv.date}</span></div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <Button size="sm" className="flex-1" onClick={() => generateZatcaPDF(inv)}>تنزيل PDF</Button>
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
  const [sortConfig, setSortConfig] = useState<{ key: keyof Invoice; direction: "asc" | "desc" } | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleSort = (key: keyof Invoice) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map(i => i.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleBulkAction = (action: "pay" | "remind") => {
    if (selectedIds.size === 0) return;
    if (action === "pay") {
      toast.success(`تم تحديث حالة ${selectedIds.size} فاتورة إلى مدفوعة`);
    } else {
      toast.success(`تم إرسال تذكير لـ ${selectedIds.size} عملاء`);
    }
    setSelectedIds(new Set());
  };

  const filtered = (() => {
    const result = DEMO_INVOICES.filter((inv) => {
      const matchSearch =
        inv.customerName.includes(search) ||
        inv.id.includes(search);
      const matchStatus =
        statusFilter === "all" || inv.status === statusFilter;
      return matchSearch && matchStatus;
    });
    
    if (sortConfig) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return result;
  })();

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
      <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
        <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full sm:w-auto">
          <TabsList className="grid w-full grid-cols-4 sm:w-[400px]">
            <TabsTrigger value="all">الكل</TabsTrigger>
            <TabsTrigger value="paid">مدفوعة</TabsTrigger>
            <TabsTrigger value="pending">معلقة</TabsTrigger>
            <TabsTrigger value="cancelled">ملغية</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="ابحث بالاسم أو رقم الفاتورة..."
              className="h-9 ps-9 border-border/50 focus-visible:ring-primary/30"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {selectedIds.size > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <span className="text-sm font-medium text-primary">{selectedIds.size} فاتورة محددة</span>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-8 gap-1.5" onClick={() => handleBulkAction("remind")}>
              <Send className="w-3.5 h-3.5" /> تذكير
            </Button>
            <Button size="sm" className="h-8 gap-1.5" onClick={() => handleBulkAction("pay")}>
              <CheckCircle2 className="w-3.5 h-3.5" /> تعليم كمدفوعة
            </Button>
          </div>
        </div>
      )}

      {/* Invoice Table */}
      <Card className="overflow-hidden border-border/50">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="px-5 py-3.5 w-[50px]">
                  <Checkbox 
                    checked={filtered.length > 0 && selectedIds.size === filtered.length} 
                    onCheckedChange={toggleSelectAll} 
                  />
                </th>
                <th className="text-right font-medium text-xs text-muted-foreground uppercase tracking-wider px-5 py-3.5 cursor-pointer hover:bg-muted/60 transition-colors" onClick={() => handleSort("id")}>
                  <div className="flex items-center gap-1">رقم الفاتورة <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="text-right font-medium text-xs text-muted-foreground uppercase tracking-wider px-5 py-3.5">العميل</th>
                <th className="text-right font-medium text-xs text-muted-foreground uppercase tracking-wider px-5 py-3.5">الخدمة</th>
                <th className="text-right font-medium text-xs text-muted-foreground uppercase tracking-wider px-5 py-3.5 cursor-pointer hover:bg-muted/60 transition-colors" onClick={() => handleSort("amount")}>
                  <div className="flex items-center gap-1">المبلغ (SAR) <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="text-right font-medium text-xs text-muted-foreground uppercase tracking-wider px-5 py-3.5 cursor-pointer hover:bg-muted/60 transition-colors" onClick={() => handleSort("status")}>
                  <div className="flex items-center gap-1">الحالة <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="text-right font-medium text-xs text-muted-foreground uppercase tracking-wider px-5 py-3.5 cursor-pointer hover:bg-muted/60 transition-colors" onClick={() => handleSort("date")}>
                  <div className="flex items-center gap-1">التاريخ <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="w-[50px]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="w-8 h-8 text-muted-foreground/50" />
                      <span>لا توجد فواتير مطابقة</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((inv) => (
                  <tr key={inv.id} className={`hover:bg-muted/30 transition-colors group ${selectedIds.has(inv.id) ? "bg-primary/5" : ""}`}>
                    <td className="px-5 py-4">
                      <Checkbox checked={selectedIds.has(inv.id)} onCheckedChange={() => toggleSelect(inv.id)} />
                    </td>
                    <td className="px-5 py-4 cursor-pointer" onClick={() => setSelectedInvoice(inv)}>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center group-hover:bg-primary/12 transition-colors">
                          <FileText className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-medium font-mono text-xs tracking-wider">{inv.id.toUpperCase()}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-medium cursor-pointer" onClick={() => setSelectedInvoice(inv)}>{inv.customerName}</td>
                    <td className="px-5 py-4 text-muted-foreground cursor-pointer" onClick={() => setSelectedInvoice(inv)}>{inv.serviceName}</td>
                    <td className="px-5 py-4 font-semibold tabular-nums cursor-pointer" onClick={() => setSelectedInvoice(inv)}>{inv.amount.toLocaleString()} SAR</td>
                    <td className="px-5 py-4 cursor-pointer" onClick={() => setSelectedInvoice(inv)}>
                      <Badge variant={STATUS_BADGE_VARIANTS[inv.status] ?? "outline"}>
                        {STATUS_LABELS[inv.status] ?? inv.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground tabular-nums cursor-pointer" onClick={() => setSelectedInvoice(inv)}>{inv.date}</td>
                    <td className="px-5 py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => setSelectedInvoice(inv)}><FileText className="w-4 h-4 me-2" /> عرض التفاصيل</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleBulkAction("pay")}><CreditCard className="w-4 h-4 me-2" /> دفع الفاتورة</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleBulkAction("remind")}><Send className="w-4 h-4 me-2" /> إرسال تذكير</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
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
