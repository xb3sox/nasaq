import { BRAND } from "@/lib/brand";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Lock } from "lucide-react";
import { LoginForm } from "./login-form";
import { CenteredPage } from "@/components/ui/centered-page";

export default function LoginPage() {
  return (
    <CenteredPage maxWidth="sm">
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
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            تسجيل الدخول
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <LoginForm />

          <p className="text-center text-sm text-muted-foreground border-t pt-4">
            للحصول على حساب عيادة جديد،{" "}
            <Link href="/" className="text-primary font-medium hover:underline">
              تواصل معنا
            </Link>
          </p>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground">
        © 2026 {BRAND.footer}
      </p>
    </CenteredPage>
  );
}
