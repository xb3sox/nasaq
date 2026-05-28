"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";

type DemoStep = { label: string; detail: string; done: boolean; active: boolean };

export function LiveDemoRunner() {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [steps, setSteps] = useState<DemoStep[]>([
    { label: "رسالة واتساب", detail: "بكم تنظيف الأسنان؟", done: false, active: false },
    { label: "قرار AI", detail: "intent: booking · 91%", done: false, active: false },
    { label: "رد تلقائي", detail: "سعر تنظيف 250 ر.س · متاح اليوم", done: false, active: false },
    { label: "تأكيد حجز", detail: "تنظيف مع د. ريم · 4:00 مساءً", done: false, active: false },
    { label: "تذكيران مجدولان", detail: "24h + 2h قبل الموعد", done: false, active: false },
    { label: "لوحة التحكم محدّثة", detail: "CRM + تقارير حية", done: false, active: false },
  ]);

  const runDemo = async () => {
    setRunning(true);
    setProgress(0);
    setSteps((s) => s.map((st) => ({ ...st, done: false, active: false })));

    for (let i = 0; i < steps.length; i++) {
      setSteps((s) => s.map((st, idx) => ({ ...st, active: idx === i, done: idx < i })));
      setProgress(((i) / steps.length) * 100);
      await new Promise((r) => setTimeout(r, i === 0 ? 600 : 700));
    }
    setSteps((s) => s.map((st) => ({ ...st, done: true, active: false })));
    setProgress(100);
    setRunning(false);
  };

  const allDone = steps.every((s) => s.done);

  return (
    <Card className="overflow-hidden">
      {/* Progress bar at top */}
      <div className="w-full h-1 bg-muted">
        <div 
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="tracking-tight text-base">عرض تجريبي حي</CardTitle>
          <Button
            onClick={runDemo}
            disabled={running}
            aria-live="polite"
            size="touch" className="gap-1.5 text-xs px-3 focus-visible:ring-2 focus-visible:ring-offset-1"
          >
            <span className="sr-only">{running ? "جاري التشغيل" : allDone ? "إعادة التشغيل" : "تشغيل العرض الحي"}</span>
            {running
              ? <Loader2 className="w-3 h-3 animate-spin" aria-hidden="true" />
              : allDone
              ? <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
              : <Play className="w-3 h-3" aria-hidden="true" />
            }
            <span aria-hidden="true">{running ? "جاري…" : allDone ? "إعادة" : "تشغيل"}</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 relative">
          {/* Vertical connecting line for active/done steps */}
          <div className="absolute start-[1.15rem] top-4 bottom-4 w-px bg-border/50 -z-10" />
          
          {steps.map((step, i) => (
            <div
              key={step.label}
              className={`flex items-center gap-3 p-2.5 rounded-lg transition-all duration-500 text-sm ${
                step.active
                  ? "bg-primary/10 border border-primary/20 scale-[1.02] shadow-sm"
                  : step.done
                  ? "bg-success-surface dark:bg-success/10 border border-transparent"
                  : "bg-transparent border border-transparent opacity-60"
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-all duration-300 ${
                step.done 
                  ? "bg-success text-success-foreground scale-110 shadow-sm" 
                  : step.active 
                  ? "bg-primary text-primary-foreground ring-4 ring-primary/20" 
                  : "bg-muted text-muted-foreground"
              }`}>
                {step.done ? <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" /> : step.active ? <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" /> : i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-medium truncate transition-colors duration-300 ${step.active ? "text-primary" : step.done ? "text-success" : "text-muted-foreground"}`}>{step.label}</div>
                <div className="text-xs text-muted-foreground truncate">{step.detail}</div>
              </div>
            </div>
          ))}
        </div>
        {allDone && (
          <div className="mt-4 text-xs text-center text-success font-medium animate-fade-slide-up bg-success-surface dark:bg-success/10 p-2 rounded-md border border-success/20 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" aria-hidden="true" /> تم المسار بالكامل — العميل تلقى رداً، حجزاً، وتذكيرين
          </div>
        )}
      </CardContent>
    </Card>
  );
}
