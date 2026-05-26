"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <div className="flex items-center justify-center h-screen p-8">
          <div className="flex flex-col items-center gap-4 max-w-md text-center">
            <AlertTriangle className="w-12 h-12 text-destructive" />
            <h2 className="text-xl font-bold">حدث خطأ</h2>
            <p className="text-sm text-muted-foreground">
              {error.message || "عذراً، حدث خطأ غير متوقع. حاول مرة أخرى."}
            </p>
            <Button onClick={reset} variant="default">
              إعادة المحاولة
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
