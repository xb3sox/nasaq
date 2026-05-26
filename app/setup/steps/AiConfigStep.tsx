"use client";

import { useSetupStore } from "@/lib/setup-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function AiConfigStep() {
  const { aiConfig, updateAiConfig } = useSetupStore();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4">
        <Label className="text-base font-semibold">مزود الذكاء الاصطناعي</Label>
        
        <RadioGroup 
          value={aiConfig.provider} 
          onValueChange={(value: 'demo' | 'openai' | 'gemini') => updateAiConfig({ provider: value })}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div>
            <RadioGroupItem value="demo" id="demo" className="peer sr-only" />
            <Label
              htmlFor="demo"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer text-center gap-2"
            >
              <div className="font-bold">وضع العرض التجريبي</div>
              <div className="text-xs text-muted-foreground font-normal">استجابات محددة مسبقاً (لا يحتاج مفتاح)</div>
            </Label>
          </div>
          
          <div>
            <RadioGroupItem value="openai" id="openai" className="peer sr-only" />
            <Label
              htmlFor="openai"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer text-center gap-2"
            >
              <div className="font-bold">OpenAI</div>
              <div className="text-xs text-muted-foreground font-normal">GPT-4o (يتطلب مفتاح API)</div>
            </Label>
          </div>

          <div>
            <RadioGroupItem value="gemini" id="gemini" className="peer sr-only" />
            <Label
              htmlFor="gemini"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer text-center gap-2"
            >
              <div className="font-bold">Google Gemini</div>
              <div className="text-xs text-muted-foreground font-normal">Gemini 1.5 Pro (يتطلب مفتاح API)</div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {aiConfig.provider !== 'demo' && (
        <div className="space-y-4 pt-4 border-t animate-in fade-in duration-300">
          <div className="space-y-2">
            <Label htmlFor="apiKey">مفتاح API الخاص بـ {aiConfig.provider === 'openai' ? 'OpenAI' : 'Gemini'}</Label>
            <Input 
              id="apiKey" 
              type="password"
              placeholder="sk-..." 
              dir="ltr"
              value={aiConfig.apiKey}
              onChange={(e) => updateAiConfig({ apiKey: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              لن يتم حفظ هذا المفتاح في قاعدة البيانات في وضع العرض التجريبي.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
