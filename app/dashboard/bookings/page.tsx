"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
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
  Search, CalendarCheck, Bot, Plus,
  CheckCircle2, Clock, XCircle, Loader2, DollarSign,
  CalendarX, CalendarCheck2, LayoutList, AlignJustify, MessageCircle, AlertCircle
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
    try {
      await new Promise((r) => setTimeout(r, 800)); // simulate
      toast.success("تم إضافة الحجز بنجاح");
      setOpen(false);
      onAdd();
    } catch {
      toast.error("حدث خطأ أثناء حفظ الحجز");
    } finally {
      setSaving(false);
    }
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
            <Label htmlFor="customerName">اسم العميل</Label>
            <Input id="customerName" name="customerName" autoComplete="name" placeholder="مثال: نورة المحمد" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="customerPhone">رقم الجوال</Label>
            <Input id="customerPhone" name="customerPhone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+966 5XX XXX XXXX" dir="ltr" />
            <p className="text-[10px] text-muted-foreground">أدخل رقم الجوال بصيغة دولية (مثال: +966500000000)</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="service">الخدمة</Label>
              <Select>
                <SelectTrigger id="service" aria-label="الخدمة"><SelectValue placeholder="اختر الخدمة" /></SelectTrigger>
                <SelectContent>
                  {DEMO_SERVICES.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name} — {s.price} ر.س</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="doctor">الطبيب</Label>
              <Select>
                <SelectTrigger id="doctor" aria-label="الطبيب"><SelectValue placeholder="اختر الطبيب" /></SelectTrigger>
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
              <Label htmlFor="bookingDate">التاريخ</Label>
              <Input id="bookingDate" name="bookingDate" type="date" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bookingTime">الوقت</Label>
              <Input id="bookingTime" name="bookingTime" type="time" />
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

function getDateGroup(dateStr: string) {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + (7 - today.getDay()));

  const dateMidnight = new Date(date);
  dateMidnight.setHours(0, 0, 0, 0);

  if (dateMidnight.getTime() === today.getTime()) return "اليوم";
  if (dateMidnight.getTime() === tomorrow.getTime()) return "غداً";
  if (dateMidnight > tomorrow && dateMidnight <= endOfWeek) return "هذا الأسبوع";
  if (dateMidnight < today) return "سابقاً";
  return "لاحقاً";
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
        {STAT_CARDS.map((s) => {
          const isPositive = s.label !== "معلقة" && s.label !== "ملغاة"; // Example logic
          return (
            <Card key={s.label} className="p-5 hover:shadow-sm transition-shadow relative overflow-hidden">
              <div className="flex items-start justify-between mb-2 relative z-10">
                <span className="text-sm font-medium text-muted-foreground">{s.label}</span>
                <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center`}>
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                </div>
              </div>
              <div className={`text-2xl font-bold ${s.color} relative z-10`}>{s.value + (s.label === "مؤكدة" ? added : 0)}</div>
              <div className="mt-2 text-xs text-muted-foreground relative z-10 flex items-center gap-1">
                <span className={isPositive ? "text-green-600" : "text-amber-600"}>
                  {isPositive ? "+" : "-"}{s.label === "مؤكدة" ? 12 : s.label === "مكتملة" ? 8 : 4}%
                </span>
                <span>عن الأسبوع الماضي</span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[180px] max-w-sm">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            aria-label="ابحث بالاسم أو الجوال أو الخدمة"
            placeholder="ابحث بالاسم أو الجوال أو الخدمة..."
            className="h-10 sm:h-9 ps-9 border-border/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
          <SelectTrigger className="w-[140px] h-10 sm:h-9 border-border/50" aria-label="الحالة">
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
          <SelectTrigger className="w-[150px] h-9 border-border/50" aria-label="المصدر">
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
            size="sm" 
            className="h-8 px-2"
            aria-label="عرض مفصل"
            onClick={() => setCompactView(false)}
          >
            <LayoutList className="w-4 h-4" />
          </Button>
          <Button 
            variant={compactView ? "secondary" : "ghost"} 
            size="sm" 
            className="h-8 px-2"
            aria-label="عرض مضغوط"
            onClick={() => setCompactView(true)}
          >
            <AlignJustify className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Booking Cards */}
      {filtered.length === 0 ? (
        <Card className="p-16 flex flex-col items-center gap-4 text-muted-foreground bg-muted/20 border-dashed">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <CalendarX className="w-8 h-8 text-muted-foreground/60" />
          </div>
          <div className="text-center space-y-1">
            <h3 className="font-medium text-foreground">لا توجد حجوزات مطابقة</h3>
            <p className="text-sm">جرب تغيير كلمات البحث أو الفلاتر للعثور على ما تبحث عنه.</p>
          </div>
          <Button variant="outline" onClick={() => { setSearch(""); setStatusFilter("all"); setSourceFilter("all"); }}>مسح الفلاتر</Button>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(
            filtered.reduce((acc, booking) => {
              const group = getDateGroup(booking.date);
              if (!acc[group]) acc[group] = [];
              acc[group].push(booking);
              return acc;
            }, {} as Record<string, typeof filtered>)
          ).map(([group, groupBookings]) => (
            <div key={group} className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-lg">{group}</h3>
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
                    confirmed: "bg-green-500",
                    completed: "bg-blue-500",
                    pending: "bg-yellow-500",
                    cancelled: "bg-red-500",
                  };
                  const dotColor = statusColors[booking.status as keyof typeof statusColors] || "bg-gray-400";

                  if (compactView) {
                    return (
                      <div key={booking.id} className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border bg-card hover:border-primary/30 hover:bg-muted/30 transition-colors gap-3">
                        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                          <div className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`}></div>
                          <div className="w-[120px] shrink-0 font-medium truncate">{booking.customer}</div>
                          <div className="w-[140px] shrink-0 text-sm text-muted-foreground truncate hidden md:block">{booking.service}</div>
                          <div className="w-[100px] shrink-0 text-sm text-muted-foreground truncate hidden lg:block">{booking.date}</div>
                          <div className="w-[80px] shrink-0 text-sm text-muted-foreground font-mono truncate">{booking.time}</div>
                          <div className="flex gap-2 shrink-0 ms-auto sm:ms-0">
                            <Badge className={`${statusCfg.color} scale-90 origin-right`}>{statusCfg.label}</Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 justify-end sm:ps-2">
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-[#25D366] hover:text-[#25D366] hover:bg-[#25D366]/10" aria-label="مراسلة">
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                          {booking.status === "pending" && (
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600 hover:text-green-600 hover:bg-green-50" aria-label="تأكيد">
                              <CheckCircle2 className="w-4 h-4" />
                            </Button>
                          )}
                          {booking.status !== "cancelled" && booking.status !== "completed" && (
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" aria-label="إلغاء">
                              <AlertCircle className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <Card key={booking.id} className="group p-4 flex flex-col md:flex-row gap-4 justify-between transition-all relative overflow-hidden border-border/60 hover:border-border hover:shadow-md">
                      {/* Timeline Dot */}
                      <div className={`absolute start-0 top-0 bottom-0 w-1 ${dotColor}`}></div>
                      
                      <div className="flex items-start justify-between md:justify-start gap-4 ps-3 rtl:ps-3 w-full md:w-auto">
                        <div className="flex gap-4 items-start min-w-0 relative z-10">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 hidden sm:flex">
                            <CalendarCheck className="w-5 h-5 text-primary" />
                          </div>
                          <div className="min-w-0">
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
                        <div className="flex flex-col items-end gap-1.5 shrink-0 relative z-10 md:hidden">
                          <Badge className={statusCfg.color}>
                            <StatusIcon className="w-3 h-3 me-1" />
                            {statusCfg.label}
                          </Badge>
                          <Badge variant="outline" className={`text-xs ${paymentCfg.color} border-0 bg-muted/50`}>
                            <DollarSign className="w-3 h-3 me-0.5" />
                            {paymentCfg.label}
                          </Badge>
                        </div>
                      </div>

                      <div className="hidden md:flex flex-col items-end gap-1.5 shrink-0 relative z-10">
                          <Badge className={statusCfg.color}>
                            <StatusIcon className="w-3 h-3 me-1" />
                            {statusCfg.label}
                          </Badge>
                          <Badge variant="outline" className={`text-xs ${paymentCfg.color} border-0 bg-muted/50`}>
                            <DollarSign className="w-3 h-3 me-0.5" />
                            {paymentCfg.label}
                          </Badge>
                          <Badge variant="outline" className={`text-xs hidden sm:flex ${SOURCE_COLORS[booking.source] ?? ""}`}>
                            {booking.source === "AI WhatsApp" && <Bot className="w-3 h-3 me-1" />}
                            {booking.source}
                          </Badge>
                        </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 mt-2 md:mt-0 pt-3 md:pt-0 border-t border-border/30 md:border-t-0 shrink-0 self-start w-full md:w-auto justify-end">
                        <Button size="sm" variant="outline" className="h-8 px-2 text-[#25D366] border-[#25D366]/30 hover:text-[#25D366] hover:bg-[#25D366]/10">
                          <MessageCircle className="w-4 h-4 me-1.5" />
                          مراسلة
                        </Button>
                        {booking.status === "pending" && (
                          <Button size="sm" className="h-8 px-3 bg-green-600 hover:bg-green-700">تأكيد</Button>
                        )}
                        {booking.status !== "cancelled" && booking.status !== "completed" && (
                          <Button size="sm" variant="ghost" className="h-8 px-3 text-destructive hover:text-destructive hover:bg-destructive/10">إلغاء</Button>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
