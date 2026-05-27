"use client";

import { useSetupStore } from "@/lib/setup-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function WhatsappStep() {
  const { whatsapp, updateWhatsapp } = useSetupStore();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Alert className="bg-brand-surface border-brand/20 text-brand">
        <Info className="w-4 h-4 text-brand" />
        <AlertTitle className="text-sm font-bold mb-1">WhatsApp Cloud API</AlertTitle>
        <AlertDescription className="text-xs leading-relaxed">
          يتطلب الربط الفعلي حساب مطور موثق في Meta. للتجربة السريعة، يمكنك تخطي هذه الخطوة وسنستخدم نظام محاكاة (Mock) داخلي للرسائل.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phoneNumberId">رقم الهاتف المميز (Phone Number ID)</Label>
          <Input
            id="phoneNumberId"
            placeholder="مثال: 123456789012345"
            dir="ltr"
            value={whatsapp.phoneNumberId}
            onChange={(e) => updateWhatsapp({ phoneNumberId: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="accessToken">رمز الوصول الدائم (Access Token)</Label>
          <Input
            id="accessToken"
            type="password"
            placeholder="EAAB..."
            dir="ltr"
            value={whatsapp.accessToken}
            onChange={(e) => updateWhatsapp({ accessToken: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="verifyToken">رمز التحقق (Webhook Verify Token)</Label>
          <Input
            id="verifyToken"
            placeholder="مثال: my_custom_verify_token"
            dir="ltr"
            value={whatsapp.verifyToken}
            onChange={(e) => updateWhatsapp({ verifyToken: e.target.value })}
          />
          <p className="text-xs text-muted-foreground mt-1">
            الرمز المخصص الذي ستدخله عند إعداد الـ Webhook في لوحة تحكم Meta.
          </p>
        </div>
      </div>
    </div>
  );
}
