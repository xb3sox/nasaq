"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Building, Users, CalendarCheck, Settings, MessageCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { useSetupStore } from "@/lib/setup-store";
import { cn } from "@/lib/utils";

// Step components
import ClinicInfoStep from "./steps/ClinicInfoStep";
import DoctorsStep from "./steps/DoctorsStep";
import ServicesStep from "./steps/ServicesStep";
import AiConfigStep from "./steps/AiConfigStep";
import WhatsappStep from "./steps/WhatsappStep";

const STEPS = [
  { id: "clinic", title: "بيانات العيادة", icon: Building },
  { id: "doctors", title: "الأطباء", icon: Users },
  { id: "services", title: "الخدمات", icon: CalendarCheck },
  { id: "ai", title: "الذكاء الاصطناعي", icon: Settings },
  { id: "whatsapp", title: "واتساب", icon: MessageCircle },
];

export default function SetupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const { completeSetup } = useSetupStore();

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      completeSetup();
      router.push("/dashboard");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      completeSetup();
      router.push("/dashboard");
    }
  };

  const CurrentStepComponent = [
    ClinicInfoStep,
    DoctorsStep,
    ServicesStep,
    AiConfigStep,
    WhatsappStep,
  ][currentStep];

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative" dir="rtl">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent -z-10" />

      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight">إعداد العيادة الذكية</h1>
          <p className="text-muted-foreground">خطوات بسيطة لتجهيز منصتك</p>
        </div>

        {/* Stepper Progress */}
        <div className="relative">
          <div className="absolute inset-x-4 top-1/2 h-0.5 -translate-y-1/2 bg-border -z-10 hidden sm:block" />
          <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0">
            {STEPS.map((step, idx) => {
              const isPast = idx < currentStep;
              const isActive = idx === currentStep;
              
              return (
                <div key={step.id} className="flex sm:flex-col items-center gap-3 sm:gap-2">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors",
                    isActive ? "bg-primary text-primary-foreground border-primary" :
                    isPast ? "bg-primary text-primary-foreground border-primary" :
                    "bg-card text-muted-foreground border-muted"
                  )}>
                    {isPast ? <CheckCircle2 className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                  </div>
                  <div className="flex flex-col sm:items-center">
                    <span className={cn(
                      "text-sm font-medium",
                      isActive ? "text-primary font-bold" :
                      isPast ? "text-primary" :
                      "text-muted-foreground"
                    )}>
                      {step.title}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Card */}
        <Card className="shadow-lg border-primary/10">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              {(() => {
                const Icon = STEPS[currentStep].icon;
                return <Icon className="w-6 h-6 text-primary" />;
              })()}
              {STEPS[currentStep].title}
            </CardTitle>
            <CardDescription>
              أدخل تفاصيل {STEPS[currentStep].title}. يمكنك تخطي هذه الخطوة والاستمرار بالبيانات التجريبية الافتراضية.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <CurrentStepComponent />

            <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 pt-4 border-t">
              <Button variant="ghost" onClick={handleSkip} className="w-full sm:w-auto text-muted-foreground hover:text-foreground">
                تخطي للمرحلة التالية
              </Button>
              <div className="flex gap-3 w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  onClick={handleBack} 
                  disabled={currentStep === 0}
                  size="touch" className="w-full sm:w-auto sm:h-10"
                >
                  <ArrowRight className="w-4 h-4 me-2" />
                  السابق
                </Button>
                <Button 
                  onClick={handleNext} 
                  size="touch" className="w-full sm:w-auto sm:h-10"
                >
                  {currentStep === STEPS.length - 1 ? "حفظ وإنهاء الإعداد" : "متابعة والتالي"}
                  {currentStep !== STEPS.length - 1 && <ArrowLeft className="w-4 h-4 ms-2" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
