import { Button } from "@/components/ui/button";
import { Bot, X } from "lucide-react";

interface AiSuggestionProps {
  ai: { reply: string };
  dismissSuggestion: boolean;
  setDismissSuggestion: (dismiss: boolean) => void;
  onUseSuggestion: (text: string) => void;
}

export function AiSuggestion({
  ai,
  dismissSuggestion,
  setDismissSuggestion,
  onUseSuggestion,
}: AiSuggestionProps) {
  if (dismissSuggestion) return null;

  return (
    <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-xl p-2 px-3 shadow-sm text-sm">
      <Bot className="w-4 h-4 text-primary shrink-0" />
      <div className="flex-1 truncate text-primary/80">اقتراح: {ai.reply}</div>
      <Button
        size="touch"
        variant="ghost"
        className="text-xs text-primary hover:bg-primary/20 hover:text-primary px-2"
        onClick={() => onUseSuggestion(ai.reply)}
      >
        استخدام
      </Button>
      <Button
        size="touch-icon"
        variant="ghost"
        className="text-muted-foreground"
        onClick={() => setDismissSuggestion(true)}
        aria-label="إغلاق الاقتراح"
      >
        <X className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
}
