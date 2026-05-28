"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PageShell } from "@/components/ui/page-shell";
import { PageHeader } from "@/components/ui/page-header";
import { toast } from "sonner";
import { Building2, MessageCircle, Bot, Users, Briefcase, Bell } from "lucide-react";
import { ConfigReadinessPanel } from "./config-readiness-panel";

export function SettingsPage() {
  const handleSave = () => {
    toast.success("تم حفظ التغييرات بنجاح");
  };

  return (
    <PageShell size="wide">
      <PageHeader
        title="الإعدادات"
        subtitle="جاهزية الربط الحقيقي بدون عرض أي أسرار أو مفاتيح."
      />

      <ConfigReadinessPanel />

      <Tabs defaultValue="clinic" className="space-y-6">
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
            <CardHeader><CardTitle className="tracking-tight">معلومات العيادة</CardTitle></CardHeader>
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
            <CardHeader><CardTitle className="tracking-tight">إعدادات واتساب Cloud API</CardTitle></CardHeader>
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
            <CardHeader><CardTitle className="tracking-tight">مزود الذكاء الاصطناعي</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ai-provider">المزود</Label>
                <select
                  id="ai-provider"
                  defaultValue="deterministic"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="deterministic">محاكاة (ديمو)</option>
                  <option value="openai">OpenAI (GPT-4o-mini)</option>
                  <option value="gemini">Gemini (2.0 Flash)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ai-key">OPENAI_API_KEY</Label>
                <Input id="ai-key" type="password" placeholder="مفتاح OpenAI" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gemini-key">GEMINI_API_KEY</Label>
                <Input id="gemini-key" type="password" placeholder="مفتاح Gemini" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ai-model">النموذج المستخدم</Label>
                <Input id="ai-model" defaultValue="gpt-4o-mini" />
              </div>
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
            <CardHeader><CardTitle className="tracking-tight">أعضاء الفريق</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "د. نواف الحسين", role: "طبيب", email: "nawaf@alnoor.com" },
                { name: "د. ريم السيف", role: "طبيبة أسنان", email: "reem@alnoor.com" },
                { name: "د. علي الزهراني", role: "طبيب جلدية", email: "ali@alnoor.com" },
                { name: "سارة الاستقبال", role: "موظفة استقبال", email: "sara@alnoor.com" },
              ].map(m => (
                <div key={m.email} className="flex items-center justify-between p-5 rounded-lg border">
                  <div>
                    <div className="font-medium">{m.name}</div>
                    <div className="text-xs text-muted-foreground">{m.email} · {m.role}</div>
                  </div>
                  <Button variant="ghost" size="touch">تعديل</Button>
                </div>
              ))}
              <Button variant="outline" className="w-full">دعوة عضو جديد</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent role="tabpanel" id="services" aria-labelledby="tab-services" value="services">
          <Card>
            <CardHeader><CardTitle className="tracking-tight">الخدمات والأسعار</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "استشارة عامة", price: "150 ر.س", duration: "30 دقيقة" },
                { name: "تنظيف أسنان", price: "250 ر.س", duration: "45 دقيقة" },
                { name: "قسطرة جلدية", price: "400 ر.س", duration: "60 دقيقة" },
                { name: "فحص دوري", price: "100 ر.س", duration: "20 دقيقة" },
              ].map(s => (
                <div key={s.name} className="flex items-center justify-between p-5 rounded-lg border">
                  <div>
                    <div className="font-medium">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{s.duration} · {s.price}</div>
                  </div>
                  <Button variant="ghost" size="touch">تعديل</Button>
                </div>
              ))}
              <Button variant="outline" className="w-full">إضافة خدمة</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent role="tabpanel" id="reminders" aria-labelledby="tab-reminders" value="reminders">
          <Card>
            <CardHeader><CardTitle className="tracking-tight">قوالب التذكيرات</CardTitle></CardHeader>
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
    </PageShell>
  );
}
