"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Search, CalendarCheck, Phone, Bot, Plus,
  CheckCircle2, Clock, XCircle, Loader2, DollarSign,
  CalendarX, CalendarCheck2,
} from "lucide-react";

type BookingStatus = "confirmed" | "pending" | "completed" | "cancelled";
type PaymentStatus = "paid" | "unpaid" | "partial";

const STATUS_CONFIG: Record<BookingStatus, { label: string; color: string; icon: React.ElementType }> = {
  confirmed:  { label: "مؤكد",    color: "bg-green-100 text-green-800",  icon: CheckCircle2 },
  pending:    { label: "معلق",    color: "bg-yellow-100 text-yellow-800", icon: Clock },
  completed:  { label: "مكتمل",   color: "bg-blue-100 text-blue-800",    icon: CalendarCheck2 },
  cancelled:  { label: "ملغي",    color: "bg-red-100 text-red-800",      icon: XCircle },
};

const PAYMENT_CONFIG: Record<PaymentStatus, { label: string; color: string }> = {
  paid:     { label: "مدفوع",      color: "bg-emerald-100 text-emerald-800" },
  unpaid:   { label: "غير مدفوع",  color: "bg-orange-100 text-orange-700" },
  partial:  { label: "جزئي",       color: "bg-purple-100 text-purple-800" },
};

const SOURCE_COLORS: Record<string, string> = {
  "AI WhatsApp": "bg-green-50 text-green-700 border-green-200",
  "WhatsApp":    "bg-blue-50 text-blue-700 border-blue-200",
  "Reception":   "bg-gray-100 text-gray-700",
  "Referral":    "bg-purple-50 text-purple-700",
  "Instagram":   "bg-pink-50 text-pink-700",
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
        <Button size="sm" className="min-h-[40px] sm:min-h-0 sm:h-9 gap-1.5">
          <Plus className="w-3.5 h-3.5" />
          حجز جديد
        </Button>
      } />
      <DialogContent className="max-w-md" dir="rtl">
        <DialogTitle>إضافة حجز جديد</DialogTitle>
        <div className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label>اسم العميل</Label>
            <Input placeholder="مثال: نورة المحمد" />
          </div>
          <div className="space-y-1.5">
            <Label>رقم الجوال</Label>
            <Input placeholder="+966 5XX XXX XXXX" dir="ltr" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>الخدمة</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="اختر الخدمة" /></SelectTrigger>
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
                <SelectTrigger><SelectValue placeholder="اختر الطبيب" /></SelectTrigger>
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
              <Input type="date" />
            </div>
            <div className="space-y-1.5">
              <Label>الوقت</Label>
              <Input type="time" />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button className="flex-1" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin ms-1" /> : null}
              حفظ الحجز
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>إلغاء</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function BookingsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [added, setAdded] = useState(0);

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

  const STAT_CARDS = [
    { label: "مؤكدة",   value: counts.confirmed, color: "text-green-600",  bg: "bg-green-50",  icon: CheckCircle2 },
    { label: "مكتملة",  value: counts.completed, color: "text-blue-600",   bg: "bg-blue-50",   icon: CalendarCheck2 },
    { label: "معلقة",   value: counts.pending,   color: "text-yellow-600", bg: "bg-yellow-50", icon: Clock },
    { label: "عبر AI",  value: counts.aiSource,  color: "text-primary",    bg: "bg-primary/10",icon: Bot },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">الحجوزات</h1>
          <p className="text-sm text-muted-foreground">جميع الحجوزات من واتساب والاستقبال</p>
        </div>
        <NewBookingDialog onAdd={() => setAdded((n) => n + 1)} />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((s) => (
          <Card key={s.label} className="p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">{s.label}</span>
              <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
            </div>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value + (s.label === "مؤكدة" ? added : 0)}</div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[180px] max-w-sm">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="ابحث بالاسم أو الجوال أو الخدمة..."
            className="h-9 pr-9 border-border/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
          <SelectTrigger className="w-[140px] h-9 border-border/50">
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
          <SelectTrigger className="w-[150px] h-9 border-border/50">
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
        <span className="text-xs text-muted-foreground mr-auto">
          {filtered.length} من {all.length} حجز
        </span>
      </div>

      {/* Booking Cards */}
      {filtered.length === 0 ? (
        <Card className="p-12 flex flex-col items-center gap-3 text-muted-foreground">
          <CalendarX className="w-10 h-10 text-muted-foreground/40" />
          <span className="text-sm">لا توجد حجوزات مطابقة</span>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((booking) => {
            const statusCfg = STATUS_CONFIG[booking.status as BookingStatus] ?? STATUS_CONFIG.pending;
            const paymentCfg = PAYMENT_CONFIG[booking.paymentStatus as PaymentStatus] ?? PAYMENT_CONFIG.unpaid;
            const StatusIcon = statusCfg.icon;
            return (
              <Card key={booking.id} className="p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3 items-start min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <CalendarCheck className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold truncate">{booking.customer}</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {booking.service} · {booking.doctor}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Phone className="w-3 h-3 shrink-0" />
                        <span className="font-mono">{booking.phone}</span>
                        <span className="mx-1 text-border">·</span>
                        {booking.date} {booking.time}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <Badge className={statusCfg.color}>
                      <StatusIcon className="w-3 h-3 ms-1" />
                      {statusCfg.label}
                    </Badge>
                    <Badge variant="outline" className={`text-xs ${paymentCfg.color} border-0`}>
                      <DollarSign className="w-3 h-3 ms-0.5" />
                      {paymentCfg.label}
                    </Badge>
                    <Badge variant="outline" className={`text-xs hidden sm:flex ${SOURCE_COLORS[booking.source] ?? ""}`}>
                      {booking.source === "AI WhatsApp" && <Bot className="w-3 h-3 ms-1" />}
                      {booking.source}
                    </Badge>
                  </div>
                </div>
                <div className="mt-3 flex gap-2 justify-end">
                  <Button size="sm" variant="outline" className="min-h-[40px] sm:min-h-0 sm:h-8 text-xs">تعديل</Button>
                  {booking.status === "pending" && (
                    <Button size="sm" className="min-h-[40px] sm:min-h-0 sm:h-8 text-xs bg-green-600 hover:bg-green-700">تأكيد</Button>
                  )}
                  {booking.status !== "cancelled" && booking.status !== "completed" && (
                    <Button size="sm" variant="outline" className="min-h-[40px] sm:min-h-0 sm:h-8 text-xs text-destructive hover:text-destructive">إلغاء</Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
