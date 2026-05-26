"use client";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Building2, MessageCircle, Bot, Users, Briefcase, Bell, AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";
import type { RuntimeConfigStatus } from "@/lib/runtime-config";

export default function SettingsPage() {

  const handleSave = () => {
    toast.success("تم حفظ التغييرات بنجاح");
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">الإعدادات</h1>
        <p className="text-sm text-muted-foreground">جاهزية الربط الحقيقي بدون عرض أي أسرار أو مفاتيح.</p>
      </div>

      <ConfigReadinessPanel />

      <Tabs defaultValue="clinic" className="space-y-4">
        <TabsList className="flex-nowrap overflow-x-auto gap-1 h-auto p-1.5 w-full justify-start sm:flex-wrap" role="tablist">
          <TabsTrigger role="tab" aria-selected={true} aria-controls="clinic" id="tab-clinic" value="clinic" className="gap-1.5 py-2.5 whitespace-nowrap"><Building2 className="w-3.5 h-3.5" />العيادة</TabsTrigger>
          <TabsTrigger role="tab" aria-selected={false} aria-controls="whatsapp" id="tab-whatsapp" value="whatsapp" className="gap-1.5 py-2.5 whitespace-nowrap"><MessageCircle className="w-3.5 h-3.5" />واتساب</TabsTrigger>
          <TabsTrigger role="tab" aria-selected={false} aria-controls="ai" id="tab-ai" value="ai" className="gap-1.5 py-2.5 whitespace-nowrap"><Bot className="w-3.5 h-3.5" />الذكاء الاصطناعي</TabsTrigger>
          <TabsTrigger role="tab" aria-selected={false} aria-controls="team" id="tab-team" value="team" className="gap-1.5 py-2.5 whitespace-nowrap"><Users className="w-3.5 h-3.5" />الفريق</TabsTrigger>
          <TabsTrigger role="tab" aria-selected={false} aria-controls="services" id="tab-services" value="services" className="gap-1.5 py-2.5 whitespace-nowrap"><Briefcase className="w-3.5 h-3.5" />الخدمات</TabsTrigger>
          <TabsTrigger role="tab" aria-selected={false} aria-controls="reminders" id="tab-reminders" value="reminders" className="gap-1.5 py-2.5 whitespace-nowrap"><Bell className="w-3.5 h-3.5" />التذكيرات</TabsTrigger>
        </TabsList>

        <TabsContent role="tabpanel" id="clinic" aria-labelledby="tab-clinic" value="clinic">
          <Card>
            <CardHeader><CardTitle>معلومات العيادة</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label htmlFor="clinic-name">اسم العيادة</Label><Input id="clinic-name" defaultValue="عيادة النور الطبية" /></div>
                <div className="space-y-2"><Label htmlFor="clinic-phone">رقم الجوال</Label><Input id="clinic-phone" defaultValue="+966500000001" /></div>
                <div className="space-y-2"><Label htmlFor="clinic-address">العنوان</Label><Input id="clinic-address" defaultValue="الرياض، المالقا" /></div>
                <div className="space-y-2"><Label htmlFor="clinic-currency">العملة</Label><Input id="clinic-currency" defaultValue="SAR" /></div>
              </div>
              <Button onClick={handleSave}>حفظ التغييرات</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent role="tabpanel" id="whatsapp" aria-labelledby="tab-whatsapp" value="whatsapp">
          <Card>
            <CardHeader><CardTitle>إعدادات واتساب Cloud API</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label htmlFor="wa-token">WHATSAPP_ACCESS_TOKEN</Label><Input id="wa-token" type="password" placeholder="توكن الوصول" /></div>
              <div className="space-y-2"><Label htmlFor="wa-phone-id">WHATSAPP_PHONE_NUMBER_ID</Label><Input id="wa-phone-id" placeholder="معرف رقم الهاتف" /></div>
              <div className="space-y-2"><Label htmlFor="wa-verify">WHATSAPP_VERIFY_TOKEN</Label><Input id="wa-verify" placeholder="توكن التحقق" /></div>
              <div className="flex items-center gap-3">
                <Switch id="mock-mode" defaultChecked />
                <Label htmlFor="mock-mode">وضع المحاكاة — يستخدم تلقائياً عند نقص إعدادات واتساب</Label>
              </div>
              <Button onClick={handleSave}>حفظ</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent role="tabpanel" id="ai" aria-labelledby="tab-ai" value="ai">
          <Card>
            <CardHeader><CardTitle>إعدادات الذكاء الاصطناعي</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label htmlFor="ai-key">OPENAI_API_KEY</Label><Input id="ai-key" type="password" placeholder="مفتاح OpenAI" /></div>
              <div className="space-y-2"><Label htmlFor="ai-model">النموذج المستخدم</Label><Input id="ai-model" defaultValue="gpt-4o-mini" /></div>
              <div className="space-y-4">
                <div className="flex items-center gap-3"><Switch id="ai-enabled" defaultChecked /><Label htmlFor="ai-enabled">تفعيل الردود التلقائية</Label></div>
                <div className="flex items-center gap-3"><Switch id="ai-booking" defaultChecked /><Label htmlFor="ai-booking">تفعيل اكتشاف نية الحجز</Label></div>
                <div className="flex items-center gap-3"><Switch id="ai-escalate" defaultChecked /><Label htmlFor="ai-escalate">تصعيد الحالات الطارئة للموظف</Label></div>
              </div>
              <Button onClick={handleSave}>حفظ</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent role="tabpanel" id="team" aria-labelledby="tab-team" value="team">
          <Card>
            <CardHeader><CardTitle>أعضاء الفريق</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "د. نواف الحسين", role: "طبيب", email: "nawaf@alnoor.com" },
                { name: "د. ريم السيف", role: "طبيبة أسنان", email: "reem@alnoor.com" },
                { name: "د. علي الزهراني", role: "طبيب جلدية", email: "ali@alnoor.com" },
                { name: "سارة الاستقبال", role: "موظفة استقبال", email: "sara@alnoor.com" },
              ].map(m => (
                <div key={m.email} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <div className="font-medium">{m.name}</div>
                    <div className="text-xs text-muted-foreground">{m.email} · {m.role}</div>
                  </div>
                  <Button variant="ghost" size="sm">تعديل</Button>
                </div>
              ))}
              <Button variant="outline" className="w-full">دعوة عضو جديد</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent role="tabpanel" id="services" aria-labelledby="tab-services" value="services">
          <Card>
            <CardHeader><CardTitle>الخدمات والأسعار</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "استشارة عامة", price: "150 ر.س", duration: "30 دقيقة" },
                { name: "تنظيف أسنان", price: "250 ر.س", duration: "45 دقيقة" },
                { name: "قسطرة جلدية", price: "400 ر.س", duration: "60 دقيقة" },
                { name: "فحص دوري", price: "100 ر.س", duration: "20 دقيقة" },
              ].map(s => (
                <div key={s.name} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <div className="font-medium">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{s.duration} · {s.price}</div>
                  </div>
                  <Button variant="ghost" size="sm">تعديل</Button>
                </div>
              ))}
              <Button variant="outline" className="w-full">إضافة خدمة</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent role="tabpanel" id="reminders" aria-labelledby="tab-reminders" value="reminders">
          <Card>
            <CardHeader><CardTitle>قوالب التذكيرات</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "appointment_24h", label: "تذكير قبل 24 ساعة", message: "مرحباً {{customer_name}}، نذكرك بموعدك غداً الساعة {{time}} في {{clinic_name}}." },
                { key: "appointment_2h", label: "تذكير قبل ساعتين", message: "مرحباً {{customer_name}}، موعدك بعد ساعتين الساعة {{time}}. نراك قريباً!" },
                { key: "no_show", label: "متابعة عدم الحضور", message: "مرحباً {{customer_name}}، لاحظنا أنك لم تتمكن من الحضور. هل تود إعادة جدولة موعدك؟" },
                { key: "post_visit", label: "متابعة بعد الزيارة", message: "مرحباً {{customer_name}}، كيف تشعر بعد زيارتك؟ يسعدنا خدمتك مجدداً." },
              ].map(t => (
                <div key={t.key} className="space-y-2 p-4 rounded-lg border">
                  <Label htmlFor={`template-${t.key}`} className="font-medium">{t.label}</Label>
                  <Input id={`template-${t.key}`} defaultValue={t.message} className="text-sm" />
                </div>
              ))}
              <Button onClick={handleSave}>حفظ القوالب</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ConfigReadinessPanel() {
  const [status, setStatus] = useState<RuntimeConfigStatus | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/config/status", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load config status");
        }
        return response.json() as Promise<RuntimeConfigStatus>;
      })
      .then(setStatus)
      .catch((err: unknown) => {
        if (!(err instanceof DOMException && err.name === "AbortError")) {
          setError(true);
        }
      });

    return () => controller.abort();
  }, []);

  if (error) {
    return (
      <Card className="border-destructive/30">
        <CardContent className="flex items-center gap-3 p-4 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4" />
          تعذر تحميل حالة الإعدادات.
        </CardContent>
      </Card>
    );
  }

  const rows = status
    ? [
        {
          label: "قاعدة البيانات (Supabase)",
          ready: status.supabase.ready,
          detail: status.supabase.ready ? "متصلة وجاهزة" : `ينقص: ${formatMissing(status.supabase.missing)}`,
        },
        {
          label: "واتساب (Cloud API)",
          ready: status.whatsapp.ready,
          detail: status.whatsapp.ready ? "الربط جاهز" : `وضع المحاكاة مفعل. ينقص: ${formatMissing(status.whatsapp.missing)}`,
        },
        {
          label: "الذكاء الاصطناعي (AI)",
          ready: status.ai.ready,
          detail: status.ai.ready ? `المزود الحالي: ${status.ai.provider}` : "يعمل بوضع المحاكاة التجريبي",
        },
        {
          label: "واجهات الديمو (Demo API)",
          ready: !status.demoApi.exposed,
          detail: status.demoApi.exposed ? "واجهات الديمو مفتوحة في بيئة التطوير" : "واجهات الديمو محمية (وضع الإنتاج)",
          caution: status.demoApi.exposed,
        },
      ]
    : [];

  return (
    <Card className="border-teal-100 dark:border-teal-900 shadow-sm">
      <CardHeader className="pb-3 bg-teal-50/50 dark:bg-teal-950/20">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base text-teal-900 dark:text-teal-100">حالة الربط والجاهزية</CardTitle>
          <Badge variant={status?.environment === "production" ? "default" : "secondary"} className="w-fit">
            {status ? (status.environment === "production" ? "إنتاج" : "تطوير") : "جاري التحميل..."}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 pt-4">
        {status
          ? rows.map((row) => (
              <div key={row.label} className="flex min-h-20 items-start gap-3 rounded-lg border p-3 bg-card transition-colors hover:bg-muted/50">
                {row.ready ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-500" />
                ) : row.caution ? (
                  <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-500" />
                ) : (
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-500" />
                )}
                <div className="min-w-0 space-y-1">
                  <div className="font-medium text-sm">{row.label}</div>
                  <p className="text-xs leading-relaxed text-muted-foreground">{row.detail}</p>
                </div>
              </div>
            ))
          : Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-20 animate-pulse rounded-lg border bg-muted/40" />
            ))}
      </CardContent>
    </Card>
  );
}

function formatMissing(keys: string[]) {
  return keys.length > 0 ? keys.join(", ") : "لا شيء";
}
