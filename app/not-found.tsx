import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/brand";
import { LayoutDashboard, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-8" dir="rtl">
      <div className="flex flex-col items-center gap-6 max-w-md text-center animate-in fade-in duration-500">
        <div className="relative">
          <div className="text-8xl font-extrabold text-primary/10 leading-none select-none">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center backdrop-blur-sm">
              <FileQuestion className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold">{BRAND.nameAr} — صفحة غير موجودة</h1>
          <p className="text-sm text-muted-foreground">
            الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
          </p>
        </div>
        <Link href="/dashboard">
          <Button className="gap-2" variant="default">
            <LayoutDashboard className="w-4 h-4" />
            العودة للوحة القيادة
          </Button>
        </Link>
      </div>
    </div>
  );
}
