import { BRAND } from "@/lib/brand";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Lock } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-sm space-y-6">
        {/* Brand */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
            <Activity className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{BRAND.name}</h1>
            <p className="text-sm text-muted-foreground">{BRAND.nameAr} — لوحة التحكم</p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Lock className="w-4 h-4 text-muted-foreground" />
              تسجيل الدخول
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                placeholder="owner@clinic.com"
                dir="ltr"
                autoComplete="email"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            {/* Demo mode notice */}
            <div className="rounded-lg bg-muted/60 border border-border/40 p-3 text-xs text-muted-foreground space-y-1">
              <div className="font-medium text-foreground">وضع الديمو</div>
              <div>تسجيل الدخول غير مفعّل بعد — النظام يعمل بوضع العرض التجريبي.</div>
            </div>

            {/* Demo bypass */}
            <Link href="/dashboard">
              <Button className="w-full" size="lg">
                دخول (ديمو)
              </Button>
            </Link>

            <p className="text-center text-xs text-muted-foreground">
              للحصول على حساب حقيقي،{" "}
              <Link href="/" className="text-primary hover:underline">
                احجز ديمو
              </Link>
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          © 2026 {BRAND.footer}
        </p>
      </div>
    </div>
  );
}
