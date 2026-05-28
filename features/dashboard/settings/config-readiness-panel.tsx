"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";
import type { RuntimeConfigStatus } from "@/lib/runtime-config";

export function ConfigReadinessPanel() {
  const [status, setStatus] = useState<RuntimeConfigStatus | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/config/status", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load config status");
        }
        return response.json() as Promise<RuntimeConfigStatus>;
      })
      .then(setStatus)
      .catch((err: unknown) => {
        if (!(err instanceof DOMException && err.name === "AbortError")) {
          setError(true);
        }
      });

    return () => controller.abort();
  }, []);

  if (error) {
    return (
      <Card className="border-destructive/30">
        <CardContent className="flex items-center gap-3 p-4 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4" />
          تعذر تحميل حالة الإعدادات.
        </CardContent>
      </Card>
    );
  }

  const rows = status
    ? [
        {
          label: "قاعدة البيانات (Supabase)",
          ready: status.supabase.ready,
          detail: status.supabase.ready ? "متصلة وجاهزة" : `ينقص: ${formatMissing(status.supabase.missing)}`,
        },
        {
          label: "واتساب (Cloud API)",
          ready: status.whatsapp.ready,
          detail: status.whatsapp.ready ? "الربط جاهز" : `وضع المحاكاة مفعل. ينقص: ${formatMissing(status.whatsapp.missing)}`,
        },
        {
          label: "الذكاء الاصطناعي (AI)",
          ready: status.ai.ready,
          detail: status.ai.ready ? `المزود الحالي: ${status.ai.provider}` : "يعمل بوضع المحاكاة التجريبي",
        },
        {
          label: "واجهات الديمو (Demo API)",
          ready: !status.demoApi.exposed,
          detail: status.demoApi.exposed ? "واجهات الديمو مفتوحة في بيئة التطوير" : "واجهات الديمو محمية (وضع الإنتاج)",
          caution: status.demoApi.exposed,
        },
      ]
    : [];

  return (
    <Card className="border-brand/20 dark:border-brand/30 shadow-sm">
      <CardHeader className="pb-3 bg-brand-surface dark:bg-brand/10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base text-brand dark:text-brand">حالة الربط والجاهزية</CardTitle>
          <StatusBadge variant={status?.environment === "production" ? "success" : "warning"} className="w-fit">
            {status ? (status.environment === "production" ? "إنتاج" : "تطوير") : "جاري التحميل..."}
          </StatusBadge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 pt-4">
        {status
          ? rows.map((row) => (
              <div key={row.label} className="flex min-h-20 items-start gap-3 rounded-lg border p-3 bg-card transition-colors hover:bg-muted/50">
                {row.ready ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success dark:text-success" />
                ) : row.caution ? (
                  <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning dark:text-warning" />
                ) : (
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning dark:text-warning" />
                )}
                <div className="min-w-0 space-y-1">
                  <div className="font-medium text-sm">{row.label}</div>
                  <p className="text-xs leading-relaxed text-muted-foreground">{row.detail}</p>
                </div>
              </div>
            ))
          : Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-20 animate-pulse rounded-lg border bg-muted/40" />
            ))}
      </CardContent>
    </Card>
  );
}

function formatMissing(keys: string[]) {
  return keys.length > 0 ? keys.join(", ") : "لا شيء";
}
