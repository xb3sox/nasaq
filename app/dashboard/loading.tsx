import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh] p-8" dir="rtl">
      <div className="flex flex-col items-center gap-6 max-w-md text-center animate-in fade-in duration-500">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold">جاري التحميل</h2>
          <p className="text-sm text-muted-foreground">
            يرجى الانتظار بينما نقوم بتجهيز البيانات...
          </p>
        </div>
      </div>
    </div>
  );
}
