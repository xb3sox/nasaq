import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">الإعدادات</h1>

      <Tabs defaultValue="clinic" className="w-full" dir="rtl">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl">
          <TabsTrigger value="clinic">العيادة</TabsTrigger>
          <TabsTrigger value="whatsapp">الواتساب</TabsTrigger>
          <TabsTrigger value="ai">الذكاء الاصطناعي</TabsTrigger>
          <TabsTrigger value="staff">فريق العمل</TabsTrigger>
        </TabsList>
        
        <TabsContent value="clinic" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>معلومات العيادة</CardTitle>
              <CardDescription>البيانات الأساسية للعيادة والتي ستظهر للعملاء</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-w-2xl">
              <div className="space-y-2">
                <Label htmlFor="name">اسم العيادة</Label>
                <Input id="name" defaultValue="عيادة الابتسامة المشرقة" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">العنوان</Label>
                <Input id="address" defaultValue="الرياض، حي الملقا، طريق أنس بن مالك" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">رقم التواصل الأساسي</Label>
                <Input id="phone" defaultValue="+966 50 000 0000" dir="ltr" className="text-right" />
              </div>
              <Button>حفظ التغييرات</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="whatsapp" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>ربط الواتساب (Meta Cloud API)</CardTitle>
              <CardDescription>قم بإعداد بيانات الربط لاستقبال وإرسال الرسائل</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-w-2xl">
              <div className="space-y-2">
                <Label htmlFor="phoneId">رقم الهاتف (Phone Number ID)</Label>
                <Input id="phoneId" placeholder="123456789012345" dir="ltr" className="text-right" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="token">رمز الوصول (Access Token)</Label>
                <Input id="token" type="password" placeholder="EAAB..." dir="ltr" className="text-right" />
              </div>
              <div className="p-4 bg-muted rounded-md space-y-2">
                <Label>رابط الـ Webhook (ضعه في إعدادات ميتا):</Label>
                <code className="block p-2 bg-background border rounded text-sm text-left" dir="ltr">
                  https://clinic-ai-os.vercel.app/api/webhooks/whatsapp
                </code>
              </div>
              <Button>حفظ التغييرات</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات المساعد الذكي</CardTitle>
              <CardDescription>التعليمات التي يتبعها الذكاء الاصطناعي عند الرد</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-w-2xl">
              <div className="space-y-2">
                <Label htmlFor="prompt">الشخصية (System Prompt)</Label>
                <textarea 
                  id="prompt" 
                  className="w-full min-h-[150px] p-3 rounded-md border bg-transparent text-sm"
                  defaultValue="أنت مساعد ذكي لعيادة الابتسامة المشرقة في الرياض. هدفك مساعدة المرضى، الإجابة عن أسئلتهم، والمساعدة في حجز المواعيد. لا تقدم أي استشارات طبية."
                />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="auto-reply" className="rounded" />
                <Label htmlFor="auto-reply">الرد التلقائي (تفعيل/تعطيل)</Label>
              </div>
              <Button>حفظ التغييرات</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>فريق العمل</CardTitle>
                  <CardDescription>إدارة الموظفين وصلاحياتهم</CardDescription>
                </div>
                <Button size="sm">إضافة موظف</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="p-4 border rounded-md mb-2 flex justify-between items-center">
                <div>
                  <p className="font-bold">أحمد الإداري</p>
                  <p className="text-sm text-muted-foreground">مدير نظام</p>
                </div>
                <Button variant="outline" size="sm">تعديل</Button>
              </div>
              <div className="p-4 border rounded-md mb-2 flex justify-between items-center">
                <div>
                  <p className="font-bold">نورة الاستقبال</p>
                  <p className="text-sm text-muted-foreground">موظف استقبال</p>
                </div>
                <Button variant="outline" size="sm">تعديل</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
