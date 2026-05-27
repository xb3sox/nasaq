"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { PageShell } from "@/components/ui/page-shell";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatCard } from "@/components/ui/stat-card";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEMO_BOOKINGS, DEMO_DOCTORS, DEMO_SERVICES } from "@/lib/demo-data";
import {
  Search, CalendarCheck, Bot, Plus,
  CheckCircle2, Clock, XCircle, Loader2, DollarSign,
  CalendarCheck2, LayoutList, AlignJustify, MessageCircle, AlertCircle
} from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

type BookingStatus = "confirmed" | "pending" | "completed" | "cancelled";
type PaymentStatus = "paid" | "unpaid" | "partial";

const STATUS_CONFIG: Record<BookingStatus, { label: string; variant: "success" | "warning" | "neutral" | "danger"; icon: React.ElementType }> = {
  confirmed:  { label: "مؤكد",    variant: "success",  icon: CheckCircle2 },
  pending:    { label: "معلق",    variant: "warning",  icon: Clock },
  completed:  { label: "مكتمل",   variant: "neutral",  icon: CalendarCheck2 },
  cancelled:  { label: "ملغي",    variant: "danger",   icon: XCircle },
};

const PAYMENT_CONFIG: Record<PaymentStatus, { label: string; variant: "success" | "warning" | "neutral" }> = {
  paid:     { label: "مدفوع",      variant: "success" },
  unpaid:   { label: "غير مدفوع",  variant: "warning" },
  partial:  { label: "جزئي",       variant: "neutral" },
};

const SOURCE_COLORS: Record<string, "info" | "whatsapp" | "neutral"> = {
  "AI WhatsApp": "info",
  "WhatsApp":    "whatsapp",
  "Reception":   "neutral",
  "Referral":    "neutral",
  "Instagram":   "neutral",
};

function NewBookingDialog({ onAdd }: { onAdd: () => void }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800)); // simulate
    setSaving(false);
    setOpen(false);
    onAdd();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button size="touch" className="gap-1.5">
          <Plus className="w-3.5 h-3.5" />
          حجز جديد
        </Button>
      } />
      <DialogContent className="max-w-md" dir="rtl">
        <DialogTitle>إضافة حجز جديد</DialogTitle>
        <div className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label>اسم العميل</Label>
            <Input placeholder="مثال: نورة المحمد" size="touch" />
          </div>
          <div className="space-y-1.5">
            <Label>رقم الجوال</Label>
            <Input placeholder="+966 5XX XXX XXXX" dir="ltr" size="touch" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>الخدمة</Label>
              <Select>
                <SelectTrigger size="touch"><SelectValue placeholder="اختر الخدمة" /></SelectTrigger>
                <SelectContent>
                  {DEMO_SERVICES.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name} — {s.price} ر.س</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>الطبيب</Label>
              <Select>
                <SelectTrigger size="touch"><SelectValue placeholder="اختر الطبيب" /></SelectTrigger>
                <SelectContent>
                  {DEMO_DOCTORS.map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>التاريخ</Label>
              <Input type="date" size="touch" />
            </div>
            <div className="space-y-1.5">
              <Label>الوقت</Label>
              <Input type="time" size="touch" />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button size="touch" className="flex-1" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin ms-1" /> : null}
              حفظ الحجز
            </Button>
            <Button variant="outline" size="touch" className="flex-1" onClick={() => setOpen(false)}>إلغاء</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function getFormattedDate(dateStr: string) {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('ar-SA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

export default function BookingsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [added, setAdded] = useState(0);
  const [compactView, setCompactView] = useState(false);

  const all = DEMO_BOOKINGS;

  const filtered = all.filter((b) => {
    const matchSearch = b.customer.includes(search) || b.phone.includes(search) || b.service.includes(search);
    const matchStatus = statusFilter === "all" || b.status === statusFilter;
    const matchSource = sourceFilter === "all" || b.source === sourceFilter;
    return matchSearch && matchStatus && matchSource;
  });

  const counts = {
    confirmed: all.filter((b) => b.status === "confirmed").length,
    completed: all.filter((b) => b.status === "completed").length,
    pending:   all.filter((b) => b.status === "pending").length,
    cancelled: all.filter((b) => b.status === "cancelled").length,
    aiSource:  all.filter((b) => b.source === "AI WhatsApp").length,
  };

  return (
    <PageShell size="wide">
      {/* Header */}
      <PageHeader
        title="الحجوزات"
        subtitle="جميع الحجوزات من واتساب والاستقبال"
        actions={<NewBookingDialog onAdd={() => setAdded((n) => n + 1)} />}
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatCard
          title="مؤكدة"
          value={counts.confirmed + added}
          icon={CheckCircle2}
          iconClassName="text-success"
          iconContainerClassName="bg-success-surface"
          trendDirection="up"
          description="نسبة التأكيد"
          valueClassName="text-success"
        />
        <StatCard
          title="مكتملة"
          value={counts.completed}
          icon={CalendarCheck2}
          iconClassName="text-muted-foreground"
          iconContainerClassName="bg-muted"
          trendDirection="up"
          description="نسبة الإكمال"
          valueClassName="text-muted-foreground"
        />
        <StatCard
          title="معلقة"
          value={counts.pending}
          icon={Clock}
          iconClassName="text-warning"
          iconContainerClassName="bg-warning-surface"
          trendDirection="down"
          description="بانتظار التأكيد"
          valueClassName="text-warning"
        />
        <StatCard
          title="عبر AI"
          value={counts.aiSource}
          icon={Bot}
          iconClassName="text-brand"
          iconContainerClassName="bg-brand-surface"
          description="حجوزات عبر الذكاء الاصطناعي"
          valueClassName="text-brand"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] w-full sm:w-auto max-w-sm">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="ابحث بالاسم أو الجوال أو الخدمة..."
            size="touch" className="ps-9 border-border/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
          <SelectTrigger size="touch" className="w-full sm:w-[140px] border-border/50">
            <SelectValue placeholder="الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            <SelectItem value="confirmed">مؤكد</SelectItem>
            <SelectItem value="pending">معلق</SelectItem>
            <SelectItem value="completed">مكتمل</SelectItem>
            <SelectItem value="cancelled">ملغي</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sourceFilter} onValueChange={(v) => setSourceFilter(v ?? "all")}>
          <SelectTrigger size="touch" className="w-full sm:w-[150px] border-border/50">
            <SelectValue placeholder="المصدر" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع المصادر</SelectItem>
            <SelectItem value="AI WhatsApp">AI واتساب</SelectItem>
            <SelectItem value="WhatsApp">واتساب</SelectItem>
            <SelectItem value="Reception">الاستقبال</SelectItem>
            <SelectItem value="Referral">إحالة</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground me-auto">
          {filtered.length} من {all.length} حجز
        </span>
        <div className="flex bg-muted rounded-lg p-0.5 border">
          <Button
            variant={!compactView ? "secondary" : "ghost"}

            size="touch-icon" className="sm:px-2"
            onClick={() => setCompactView(false)}
            aria-label="عرض افتراضي"
          >
            <LayoutList className="w-4 h-4" />
          </Button>
          <Button
            variant={compactView ? "secondary" : "ghost"}

            size="touch-icon" className="sm:px-2"
            onClick={() => setCompactView(true)}
            aria-label="عرض مضغوط"
          >
            <AlignJustify className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Booking Cards */}
      {filtered.length === 0 ? (
        <EmptyState title="لا توجد حجوزات" description="لا توجد حجوزات تطابق معايير البحث الحالية" />
      ) : (
        <div className="space-y-8">
          {Object.entries(
            filtered.reduce((acc, booking) => {
              const group = booking.date; // Group directly by YYYY-MM-DD
              if (!acc[group]) acc[group] = [];
              acc[group].push(booking);
              return acc;
            }, {} as Record<string, typeof filtered>)
          ).sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
          .map(([dateKey, groupBookings]) => (
            <div key={dateKey} className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-lg">{getFormattedDate(dateKey)}</h3>
                <div className="h-px bg-border/60 flex-1"></div>
                <Badge variant="secondary" className="text-xs bg-muted">{groupBookings.length}</Badge>
              </div>

              <div className="space-y-3 relative">
                {/* Timeline connector for default view */}
                {!compactView && groupBookings.length > 1 && (
                  <div className="absolute top-6 bottom-6 start-[19px] w-0.5 bg-border/50 hidden sm:block"></div>
                )}

                {groupBookings.map((booking) => {
                  const statusCfg = STATUS_CONFIG[booking.status as BookingStatus] ?? STATUS_CONFIG.pending;
                  const paymentCfg = PAYMENT_CONFIG[booking.paymentStatus as PaymentStatus] ?? PAYMENT_CONFIG.unpaid;
                  const StatusIcon = statusCfg.icon;

                  const statusColors = {
                    confirmed: "bg-success",
                    completed: "bg-muted-foreground",
                    pending: "bg-warning",
                    cancelled: "bg-destructive",
                  };
                  const dotColor = statusColors[booking.status as keyof typeof statusColors] || "bg-muted";

                  if (compactView) {
                    return (
                      <div key={booking.id} className="group relative flex items-center justify-between p-3 rounded-lg border bg-card hover:border-primary/30 hover:bg-muted/30 transition-colors overflow-x-auto">
                        <div className="flex items-center gap-4 flex-1 min-w-max pr-2">
                          <div className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`}></div>
                          <div className="w-[120px] shrink-0 font-medium truncate">{booking.customer}</div>
                          <div className="w-[140px] shrink-0 text-sm text-muted-foreground truncate hidden md:block">{booking.service}</div>
                          <div className="w-[100px] shrink-0 text-sm text-muted-foreground truncate hidden lg:block">{booking.date}</div>
                          <div className="w-[80px] shrink-0 text-sm text-muted-foreground font-mono truncate">{booking.time}</div>
                          <div className="flex gap-2 shrink-0">
                            <StatusBadge variant={statusCfg.variant} className="scale-90 origin-right">{statusCfg.label}</StatusBadge>
                          </div>
                        </div>
                        <div className="flex gap-1 shrink-0 ps-2 items-center">
                          <Button variant="ghost" size="touch-icon" className="sm:w-8 text-whatsapp hover:text-whatsapp-dark hover:bg-whatsapp/10" aria-label="مراسلة">
                            <MessageCircle className="w-4 h-4" aria-hidden="true" />
                          </Button>
                          {booking.status === "pending" && (
                            <Button variant="ghost" size="touch-icon" className="sm:w-8 text-success hover:text-success hover:bg-success-surface" aria-label="تأكيد الحجز">
                              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                            </Button>
                          )}
                          {booking.status !== "cancelled" && booking.status !== "completed" && (
                            <Button variant="ghost" size="touch-icon" className="sm:w-8 text-destructive hover:text-destructive hover:bg-destructive/10" aria-label="إلغاء الحجز">
                              <AlertCircle className="w-4 h-4" aria-hidden="true" />
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <Card key={booking.id} className="group p-4 hover:shadow-md transition-all relative overflow-hidden border-border/60 hover:border-border">
                      {/* Timeline Dot */}
                      <div className={`absolute start-0 top-0 bottom-0 w-1 ${dotColor}`}></div>

                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 ps-12 rtl:pe-1 rtl:ps-12">
                        <div className="flex gap-4 items-start min-w-0 relative z-10 w-full sm:w-auto">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 hidden sm:flex" aria-hidden="true">
                            <CalendarCheck className="w-5 h-5 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold truncate text-base">{booking.customer}</div>
                            <div className="text-sm text-muted-foreground truncate mt-0.5">
                              {booking.service} · {booking.doctor}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
                              <span className="flex items-center gap-1 bg-muted px-2 py-0.5 rounded-md font-mono">{booking.phone}</span>
                              <span className="text-border">·</span>
                              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {booking.time}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-start sm:items-end gap-3 shrink-0 relative z-10 mt-3 sm:mt-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <StatusBadge variant={statusCfg.variant}>
                              <StatusIcon className="w-3 h-3 me-1" />
                              {statusCfg.label}
                            </StatusBadge>
                            <StatusBadge variant={paymentCfg.variant} className="text-xs border-0 bg-muted/50">
                              <DollarSign className="w-3 h-3 me-0.5" />
                              {paymentCfg.label}
                            </StatusBadge>
                            <StatusBadge variant={SOURCE_COLORS[booking.source] ?? "neutral"} className="text-xs hidden sm:flex">
                              {booking.source === "AI WhatsApp" && <Bot className="w-3 h-3 me-1" />}
                              {booking.source}
                            </StatusBadge>
                          </div>
                          <div className="flex items-center gap-2 mt-auto">
                            <Button variant="ghost" size="touch" className="px-2 text-whatsapp hover:text-whatsapp-dark hover:bg-whatsapp/10">
                              <MessageCircle className="w-4 h-4 me-1.5" />
                              مراسلة
                            </Button>
                            {booking.status === "pending" && (
                              <Button variant="default" size="touch" className="px-3">تأكيد</Button>
                            )}
                            {booking.status !== "cancelled" && booking.status !== "completed" && (
                              <Button variant="outline" size="touch" className="px-3 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30">إلغاء</Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
}
