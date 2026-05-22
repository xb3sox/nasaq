import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/brand";
import { LayoutDashboard } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background" dir="rtl">
      <div className="text-center space-y-6 px-6 max-w-md">
        <div className="text-8xl font-extrabold text-primary/20 leading-none select-none">404</div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">{BRAND.nameAr} — صفحة غير موجودة</h1>
          <p className="text-muted-foreground text-sm">
            الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
          </p>
        </div>
        <Link href="/dashboard">
          <Button className="gap-2">
            <LayoutDashboard className="w-4 h-4" />
            العودة للوحة القيادة
          </Button>
        </Link>
      </div>
    </div>
  );
}
