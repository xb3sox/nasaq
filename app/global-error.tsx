"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { CenteredPage } from "@/components/ui/centered-page";
import { Card, CardContent } from "@/components/ui/card";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-background text-foreground font-sans">
        <CenteredPage maxWidth="sm" surface="muted">
          <Card className="border-border/50 shadow-lg animate-in fade-in duration-500">
            <CardContent className="flex flex-col items-center gap-6 p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold tracking-tight">حدث خطأ</h2>
                <p className="text-sm text-muted-foreground">
                  {error.message || "عذراً، حدث خطأ غير متوقع. حاول مرة أخرى."}
                </p>
              </div>
              <Button onClick={reset} variant="default" className="w-full sm:w-auto">
                إعادة المحاولة
              </Button>
            </CardContent>
          </Card>
        </CenteredPage>
      </body>
    </html>
  );
}
