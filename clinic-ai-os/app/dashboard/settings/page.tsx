"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Building2, MessageCircle, Bot, Users, Stethoscope, Bell } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold">الإعدادات</h1>

      <Tabs defaultValue="clinic" className="space-y-4">
        <TabsList className="flex-wrap gap-1 h-auto p-1.5">
          <TabsTrigger value="clinic" className="gap-1.5 py-2.5"><Building2 className="w-3.5 h-3.5" />العيادة</TabsTrigger>
          <TabsTrigger value="whatsapp" className="gap-1.5 py-2.5"><MessageCircle className="w-3.5 h-3.5" />واتساب</TabsTrigger>
          <TabsTrigger value="ai" className="gap-1.5 py-2.5"><Bot className="w-3.5 h-3.5" />الذكاء الاصطناعي</TabsTrigger>
          <TabsTrigger value="team" className="gap-1.5 py-2.5"><Users className="w-3.5 h-3.5" />الفريق</TabsTrigger>
          <TabsTrigger value="services" className="gap-1.5 py-2.5"><Stethoscope className="w-3.5 h-3.5" />الخدمات</TabsTrigger>
          <TabsTrigger value="reminders" className="gap-1.5 py-2.5"><Bell className="w-3.5 h-3.5" />التذكيرات</TabsTrigger>
        </TabsList>

        <TabsContent value="clinic">
          <Card>
            <CardHeader><CardTitle>معلومات العيادة</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>اسم العيادة</Label><Input defaultValue="عيادة النور الطبية" /></div>
                <div className="space-y-2"><Label>رقم الجوال</Label><Input defaultValue="+966500000001" /></div>
                <div className="space-y-2"><Label>العنوان</Label><Input defaultValue="الرياض، المالقا" /></div>
                <div className="space-y-2"><Label>العملة</Label><Input defaultValue="SAR" /></div>
              </div>
              <Button>حفظ التغييرات</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="whatsapp">
          <Card>
            <CardHeader><CardTitle>إعدادات واتساب Cloud API</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>WHATSAPP_ACCESS_TOKEN</Label><Input type="password" placeholder="توكن الوصول" /></div>
              <div className="space-y-2"><Label>WHATSAPP_PHONE_NUMBER_ID</Label><Input placeholder="معرف رقم الهاتف" /></div>
              <div className="space-y-2"><Label>WHATSAPP_VERIFY_TOKEN</Label><Input placeholder="توكن التحقق" /></div>
              <div className="flex items-center gap-3">
                <Switch id="mock-mode" defaultChecked />
                <Label htmlFor="mock-mode">وضع المحاكاة (MOCK_MODE) — يمنع الإرسال الحقيقي</Label>
              </div>
              <Button>حفظ</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai">
          <Card>
            <CardHeader><CardTitle>إعدادات الذكاء الاصطناعي</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>OPENAI_API_KEY</Label><Input type="password" placeholder="مفتاح OpenAI" /></div>
              <div className="space-y-2"><Label>النموذج المستخدم</Label><Input defaultValue="gpt-4o-mini" /></div>
              <div className="space-y-4">
                <div className="flex items-center gap-3"><Switch id="ai-enabled" defaultChecked /><Label htmlFor="ai-enabled">تفعيل الردود التلقائية</Label></div>
                <div className="flex items-center gap-3"><Switch id="ai-booking" defaultChecked /><Label htmlFor="ai-booking">تفعيل اكتشاف نية الحجز</Label></div>
                <div className="flex items-center gap-3"><Switch id="ai-escalate" defaultChecked /><Label htmlFor="ai-escalate">تصعيد الحالات الطارئة للموظف</Label></div>
              </div>
              <Button>حفظ</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team">
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

        <TabsContent value="services">
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

        <TabsContent value="reminders">
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
                  <Label className="font-medium">{t.label}</Label>
                  <Input defaultValue={t.message} className="text-sm" />
                </div>
              ))}
              <Button>حفظ القوالب</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
