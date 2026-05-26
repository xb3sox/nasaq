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
      <Alert className="bg-primary/5 border-primary/20 text-primary">
        <Info className="w-4 h-4 text-primary" />
        <AlertTitle className="text-sm font-bold mb-1">WhatsApp Cloud API</AlertTitle>
        <AlertDescription className="text-xs">
          للربط مع واتساب، تحتاج إلى حساب مطور في منصة Meta وإعداد تطبيق WhatsApp. يمكنك تخطي هذه الخطوة في وضع العرض التجريبي.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phoneNumberId">Phone Number ID</Label>
          <Input
            id="phoneNumberId"
            placeholder="مثال: 123456789012345"
            dir="ltr"
            value={whatsapp.phoneNumberId}
            onChange={(e) => updateWhatsapp({ phoneNumberId: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="accessToken">Access Token (الرمز الدائم)</Label>
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
          <Label htmlFor="verifyToken">Webhook Verify Token</Label>
          <Input
            id="verifyToken"
            placeholder="مثال: my_custom_verify_token"
            dir="ltr"
            value={whatsapp.verifyToken}
            onChange={(e) => updateWhatsapp({ verifyToken: e.target.value })}
          />
          <p className="text-xs text-muted-foreground mt-1">
            هذا الرمز ستستخدمه عند إعداد الـ Webhook في منصة Meta.
          </p>
        </div>
      </div>
    </div>
  );
}
