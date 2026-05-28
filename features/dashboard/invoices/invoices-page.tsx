"use client";

import { Card } from "@/components/ui/card";
import { PageShell } from "@/components/ui/page-shell";
import { PageHeader } from "@/components/ui/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, Plus, FileText, CheckCircle2, Clock, Receipt, MoreHorizontal, ArrowUpDown, CreditCard, Send, DollarSign } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { StatCard } from "@/components/ui/stat-card";
import { DEMO_INVOICES } from "@/lib/demo-data";
import { EmptyState } from "@/components/ui/empty-state";
import { STATUS_LABELS, STATUS_VARIANTS } from "./content";
import { useInvoicesTable } from "./use-invoices-table";
import { InvoiceDetailModal } from "./invoice-detail-modal";

export function InvoicesPage() {
  const {
    search, setSearch,
    statusFilter, setStatusFilter,
    selectedInvoice, setSelectedInvoice,
    sortConfig, handleSort,
    selectedIds, toggleSelectAll, toggleSelect,
    handleBulkAction,
    filtered,
  } = useInvoicesTable();

  const paidInvoices = DEMO_INVOICES.filter((i) => i.status === "paid").length;
  const pendingInvoices = DEMO_INVOICES.filter((i) => i.status === "pending").length;
  const totalRevenue = DEMO_INVOICES
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.amount, 0);
  const pendingRevenue = DEMO_INVOICES
    .filter((i) => i.status === "pending")
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <PageShell size="wide">
      {selectedInvoice && (
        <InvoiceDetailModal inv={selectedInvoice} onClose={() => setSelectedInvoice(null)} />
      )}

      <PageHeader
        title="الفواتير"
        subtitle="إدارة فواتير العملاء ومتابعة المدفوعات"
        actions={
          <>
            <Button variant="outline" size="touch" className="gap-1.5 hidden sm:flex">
              <Download className="w-3.5 h-3.5" />
              تصدير
            </Button>
            <Button size="touch" className="gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              فاتورة جديدة
            </Button>
          </>
        }
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="إجمالي الفواتير"
          value={DEMO_INVOICES.length}
          icon={Receipt}
          iconClassName="text-primary"
          iconContainerClassName="bg-primary/10"
          description="جميع الفواتير"
        />
        <StatCard
          title="مدفوعة"
          value={paidInvoices}
          icon={CheckCircle2}
          iconClassName="text-success"
          iconContainerClassName="bg-success/10"
          trendDirection="up"
        />
        <StatCard
          title="معلقة"
          value={pendingInvoices}
          icon={Clock}
          iconClassName="text-warning"
          iconContainerClassName="bg-warning/10"
          trendDirection="down"
        />
        <StatCard
          title="إجمالي الإيرادات"
          value={new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(totalRevenue)}
          icon={DollarSign}
          iconClassName="text-brand"
          iconContainerClassName="bg-brand-surface"
          trendDirection="up"
          sub={`${new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(pendingRevenue)} معلق`}
        />
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
              aria-label="ابحث بالاسم أو رقم الفاتورة"
              placeholder="ابحث بالاسم أو رقم الفاتورة..."
              size="touch" className="ps-9 border-border/50 focus-visible:ring-primary/30"
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
        <div className="overflow-x-auto -mx-6 sm:mx-0 px-6 sm:px-0">
          <table className="w-full text-sm" role="table" aria-label="الفواتير">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="px-5 py-3.5 w-[50px]">
                  <Checkbox 
                    checked={filtered.length > 0 && selectedIds.size === filtered.length} 
                    onCheckedChange={toggleSelectAll}
                    aria-label="تحديد الكل"
                  />
                </th>
                <th scope="col" aria-sort={sortConfig?.key === "id" ? (sortConfig.direction === "asc" ? "ascending" : "descending") : "none"} className="text-end font-medium text-xs text-muted-foreground uppercase tracking-wider px-5 py-3.5 cursor-pointer hover:bg-muted/60 transition-colors" onClick={() => handleSort("id")}>
                  <div className="flex items-center gap-1">رقم الفاتورة <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th scope="col" className="text-end font-medium text-xs text-muted-foreground uppercase tracking-wider px-5 py-3.5">العميل</th>
                <th scope="col" className="text-end font-medium text-xs text-muted-foreground uppercase tracking-wider px-5 py-3.5">الخدمة</th>
                <th scope="col" aria-sort={sortConfig?.key === "amount" ? (sortConfig.direction === "asc" ? "ascending" : "descending") : "none"} className="text-end font-medium text-xs text-muted-foreground uppercase tracking-wider px-5 py-3.5 cursor-pointer hover:bg-muted/60 transition-colors" onClick={() => handleSort("amount")}>
                  <div className="flex items-center gap-1">المبلغ (SAR) <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th scope="col" aria-sort={sortConfig?.key === "status" ? (sortConfig.direction === "asc" ? "ascending" : "descending") : "none"} className="text-end font-medium text-xs text-muted-foreground uppercase tracking-wider px-5 py-3.5 cursor-pointer hover:bg-muted/60 transition-colors" onClick={() => handleSort("status")}>
                  <div className="flex items-center gap-1">الحالة <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th scope="col" aria-sort={sortConfig?.key === "date" ? (sortConfig.direction === "asc" ? "ascending" : "descending") : "none"} className="text-end font-medium text-xs text-muted-foreground uppercase tracking-wider px-5 py-3.5 cursor-pointer hover:bg-muted/60 transition-colors" onClick={() => handleSort("date")}>
                  <div className="flex items-center gap-1">التاريخ <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="w-[50px]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-4">
                    <EmptyState title="لا توجد فواتير" description="لا توجد فواتير تطابق معايير البحث الحالية" />
                  </td>
                </tr>
              ) : (
                filtered.map((inv) => (
                  <tr key={inv.id} className={`hover:bg-muted/30 transition-colors group ${selectedIds.has(inv.id) ? "bg-primary/5" : ""}`}>
                    <td className="px-5 py-4">
                      <Checkbox checked={selectedIds.has(inv.id)} onCheckedChange={() => toggleSelect(inv.id)} aria-label={`تحديد فاتورة ${inv.id}`} />
                    </td>
                    <td className="px-5 py-4 cursor-pointer" onClick={() => setSelectedInvoice(inv)}>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center group-hover:bg-primary/12 transition-colors">
                          <FileText className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-medium font-mono text-xs tracking-wider">{inv.id.toUpperCase()}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-medium cursor-pointer max-w-[150px] sm:max-w-[200px] truncate" onClick={() => setSelectedInvoice(inv)} title={inv.customerName}>{inv.customerName}</td>
                    <td className="px-5 py-4 text-muted-foreground cursor-pointer max-w-[150px] sm:max-w-[200px] truncate" onClick={() => setSelectedInvoice(inv)} title={inv.serviceName}>{inv.serviceName}</td>
                    <td className="px-5 py-4 font-semibold tabular-nums cursor-pointer" onClick={() => setSelectedInvoice(inv)}>{new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(inv.amount)}</td>
                    <td className="px-5 py-4 cursor-pointer" onClick={() => setSelectedInvoice(inv)}>
                      <StatusBadge variant={STATUS_VARIANTS[inv.status] ?? "neutral"}>
                        {STATUS_LABELS[inv.status] ?? inv.status}
                      </StatusBadge>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground tabular-nums cursor-pointer" onClick={() => setSelectedInvoice(inv)}>{inv.date}</td>
                    <td className="px-5 py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button variant="ghost" size="icon" className="h-8 w-8 transition-opacity" aria-label="خيارات الفاتورة">
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
    </PageShell>
  );
}
