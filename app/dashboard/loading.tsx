import { Loader2 } from "lucide-react";
import { CenteredPage } from "@/components/ui/centered-page";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <CenteredPage maxWidth="sm" surface="muted">
      <Card className="border-border/50 shadow-lg animate-in fade-in duration-500">
        <CardContent className="flex flex-col items-center gap-6 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold tracking-tight">جاري التحميل</h2>
            <p className="text-sm text-muted-foreground">
              يرجى الانتظار بينما نقوم بتجهيز البيانات...
            </p>
          </div>
        </CardContent>
      </Card>
    </CenteredPage>
  );
}
