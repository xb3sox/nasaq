import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarCheck, Check, Hand, Search, User, X } from "lucide-react";
import { Conversation } from "./use-inbox-state";

interface ChatThreadProps {
  selected: Conversation;
  booking: { serviceName?: string; doctorName?: string };
  bookingConfirmed: boolean;
  handoffDone: boolean;
  showSearch: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setShowSearch: (show: boolean) => void;
  handleConfirmBooking: () => void;
  handleHumanHandoff: () => void;
  typing: boolean;
}

export function ChatThread({
  selected,
  booking,
  bookingConfirmed,
  handoffDone,
  showSearch,
  searchQuery,
  setSearchQuery,
  setShowSearch,
  handleConfirmBooking,
  handleHumanHandoff,
  typing,
}: ChatThreadProps) {
  return (
    <>
      {/* Header */}
      <div className="flex shrink-0 flex-col gap-3 border-b p-5 sm:flex-row sm:items-center sm:justify-between bg-muted/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-white font-bold shrink-0">
            {selected.customerName.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="font-bold text-sm">{selected.customerName}</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-success inline-block"></span>
              متصل · آخر ظهور اليوم
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {showSearch && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute start-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="بحث في المحادثة..."
                className="h-8 w-40 ps-7 text-xs"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 absolute start-1 top-1/2 -translate-y-1/2"
                onClick={() => setShowSearch(false)}
                aria-label="إغلاق البحث"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          )}
          {!showSearch && (
            <Button
              size="touch-icon"
              variant="ghost"
              className="text-muted-foreground"
              onClick={() => setShowSearch(true)}
              aria-label="بحث في المحادثة"
            >
              <Search className="w-4 h-4" />
            </Button>
          )}

          {bookingConfirmed ? null : (
            <Button
              size="touch"
              variant="default"
              onClick={handleConfirmBooking}
              className="text-xs bg-success hover:bg-success/80 text-success-foreground"
            >
              <CalendarCheck className="w-3 h-3 me-1" />
              تأكيد الحجز
            </Button>
          )}
          {handoffDone ? null : (
            <Button
              size="touch"
              variant="outline"
              onClick={handleHumanHandoff}
              className="text-xs"
            >
              <Hand className="w-3 h-3 me-1" />
              تحويل لموظف
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30 relative">
        {bookingConfirmed && (
          <div className="flex justify-center mb-4">
            <div className="bg-warning-surface dark:bg-warning/20 text-warning dark:text-warning text-xs px-3 py-1.5 rounded-lg shadow-sm border border-warning/20 flex items-center gap-1.5">
              <CalendarCheck className="w-3.5 h-3.5" />
              تم تأكيد الحجز: {booking.serviceName} مع {booking.doctorName}
            </div>
          </div>
        )}

        {handoffDone && (
          <div className="flex justify-center mb-4">
            <div className="bg-muted dark:bg-muted text-foreground dark:text-foreground text-xs px-3 py-1.5 rounded-lg shadow-sm border border-muted-foreground/20 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              تم تحويل المحادثة للموظف
            </div>
          </div>
        )}

        {selected.messages.map((msg) => {
          const isHighlighted = searchQuery && msg.body.includes(searchQuery);
          return (
            <div
              key={msg.id}
              className={msg.sender === "bot" ? "flex justify-end" : "flex justify-start"}
            >
              <div
                className={`relative px-3 py-2 max-w-[85%] sm:max-w-[70%] text-[15px] leading-relaxed shadow-sm flex flex-wrap items-end gap-2 ${
                  msg.sender === "bot"
                    ? "bg-brand-muted dark:bg-brand/20 text-foreground rounded-2xl rounded-se-sm"
                    : "bg-card dark:bg-muted text-foreground rounded-2xl rounded-ss-sm border dark:border-white/5"
                }`}
              >
                <div className={isHighlighted ? "bg-warning/20 rounded" : ""}>{msg.body}</div>
                <div
                  className={`text-[10px] flex items-center gap-1 shrink-0 ms-auto ${
                    msg.sender === "bot" ? "text-success/60 dark:text-success/30" : "text-muted-foreground"
                  }`}
                >
                  10:42 ص
                  {msg.sender === "bot" && <Check className="w-3.5 h-3.5 text-brand/60 dark:text-brand/60" />}
                </div>
              </div>
            </div>
          );
        })}

        {typing && (
          <div className="flex justify-start">
            <div className="bg-card dark:bg-muted text-foreground rounded-2xl rounded-ss-sm px-4 py-3 shadow-sm border dark:border-white/5 flex items-center gap-1.5 h-10 w-16">
              <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce delay-75"></div>
              <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce delay-150"></div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
