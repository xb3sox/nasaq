"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-[50vh] p-8" dir="rtl">
      <div className="flex flex-col items-center gap-6 max-w-md text-center animate-in fade-in duration-500">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold">حدث خطأ</h2>
          <p className="text-sm text-muted-foreground">
            {error.message || "عذراً، حدث خطأ غير متوقع. حاول مرة أخرى."}
          </p>
        </div>
        <Button onClick={reset} variant="default">
          إعادة المحاولة
        </Button>
      </div>
    </div>
  );
}
