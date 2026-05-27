"use client";

import { Card } from "@/components/ui/card";
import { PageShell } from "@/components/ui/page-shell";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, Paperclip, Smile, Check } from "lucide-react";
import { demoAiDecision, demoBooking } from "@/lib/demo-clinic";
import { ConversationList } from "./conversation-list";
import { ChatThread } from "./chat-thread";
import { AiSuggestion } from "./ai-suggestion";
import { useInboxState, Conversation } from "./use-inbox-state";
import { inboxContent } from "./content";

const DEMO_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    customerName: "نورة المحمد",
    phone: "+966501234567",
    lastMessage: "بكم تنظيف الأسنان؟ متاح موعد اليوم؟",
    lastMessageAt: "الآن",
    humanNeeded: false,
    tags: ["booking"],
    messages: [
      { id: "m1", sender: "customer", body: "السلام عليكم" },
      { id: "m2", sender: "bot", body: "وعليكم السلام! كيف أقدر أساعدك اليوم؟" },
      { id: "m3", sender: "customer", body: "بكم تنظيف الأسنان؟ متاح موعد اليوم؟" },
      { id: "m4", sender: "bot", body: demoAiDecision.reply },
    ],
  },
  {
    id: "conv-2",
    customerName: "خالد العتيبي",
    phone: "+966552345678",
    lastMessage: "أريد إلغاء موعدي غداً",
    lastMessageAt: "بالأمس",
    humanNeeded: true,
    tags: ["cancel"],
    messages: [
      { id: "m5", sender: "customer", body: "أريد إلغاء موعدي غداً" },
      { id: "m6", sender: "bot", body: "تم استلام طلب الإلغاء. أرسل رقم جوالك أو وقت الموعد حتى نؤكد." },
    ],
  },
  {
    id: "conv-3",
    customerName: "سارة الناصر",
    phone: "+966533456789",
    lastMessage: "ممتاز شكراً جزيلاً",
    lastMessageAt: "اليوم",
    humanNeeded: false,
    tags: ["booking"],
    messages: [
      { id: "m7", sender: "customer", body: "أريد حجز موعد تنظيف أسنان" },
      { id: "m8", sender: "bot", body: "أهلاً بك. سعر تنظيف الأسنان 250 ريال. متاح اليوم 4:00 مساء أو 7:00 مساء مع د. ريم السيف." },
      { id: "m9", sender: "customer", body: "الموعد 4:00 يناسب؟" },
      { id: "m10", sender: "bot", body: "تم تأكيد موعدك يا سارة: تنظيف أسنان مع د. ريم السيف الساعة 4:00 مساء." },
      { id: "m11", sender: "customer", body: "ممتاز شكراً جزيلاً" },
    ],
  },
];

export function InboxPage() {
  const {
    selectedId,
    setSelectedId,
    replyText,
    setReplyText,
    sending,
    sent,
    bookingConfirmed,
    setBookingConfirmed,
    handoffDone,
    setHandoffDone,
    showSearch,
    setShowSearch,
    searchQuery,
    setSearchQuery,
    typing,
    setTyping,
    dismissSuggestion,
    setDismissSuggestion,
    selected,
    handleSendReply,
    handleConfirmBooking,
    handleHumanHandoff,
  } = useInboxState(DEMO_CONVERSATIONS);

  const ai = demoAiDecision;
  const booking = demoBooking;

  return (
    <PageShell size="wide" height="viewport" className="flex flex-col">
      <PageHeader
        title={inboxContent.pageTitle}
        subtitle={inboxContent.pageSubtitle}
      />
      <div className="flex flex-col gap-4 min-h-0 flex-1 lg:flex-row">
        {/* Sidebar */}
        <ConversationList
          conversations={DEMO_CONVERSATIONS}
          selectedId={selectedId}
          onSelect={(id) => {
            setSelectedId(id);
            setBookingConfirmed(false);
            setHandoffDone(false);
            setDismissSuggestion(false);
          }}
        />

        {/* Main Chat */}
        <Card className="flex min-h-[620px] min-w-0 flex-1 flex-col lg:min-h-0">
          <ChatThread
            selected={selected}
            booking={booking}
            bookingConfirmed={bookingConfirmed}
            handoffDone={handoffDone}
            showSearch={showSearch}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setShowSearch={setShowSearch}
            handleConfirmBooking={handleConfirmBooking}
            handleHumanHandoff={handleHumanHandoff}
            typing={typing}
          />

          {/* Action Panel */}
          <div className="shrink-0 border-t bg-muted dark:bg-muted p-3 flex flex-col gap-2">
            <AiSuggestion
              ai={ai}
              dismissSuggestion={dismissSuggestion}
              setDismissSuggestion={setDismissSuggestion}
              onUseSuggestion={setReplyText}
            />

            {/* Reply Input */}
            <div className="flex gap-2 items-end">
              <div className="flex-1 flex items-center bg-card dark:bg-muted rounded-3xl min-h-[44px] px-2 shadow-sm">
                <Button
                  variant="ghost"
                  size="touch-icon"
                  className="text-muted-foreground shrink-0 rounded-full hover:bg-muted/50"
                  aria-label="إضافة رمز تعبيري"
                >
                  <Smile className="w-6 h-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="touch-icon"
                  className="text-muted-foreground shrink-0 rounded-full hover:bg-muted/50"
                  aria-label="إرفاق ملف"
                >
                  <Paperclip className="w-5 h-5" />
                </Button>
                <Input
                  placeholder="اكتب رسالة..."
                  className="flex-1 border-0 shadow-none focus-visible:ring-0 px-2 h-10 bg-transparent text-[15px]"
                  value={replyText}
                  onChange={(e) => {
                    setReplyText(e.target.value);
                    if (!typing && e.target.value) {
                      setTyping(true);
                      setTimeout(() => setTyping(false), 2000);
                    }
                  }}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendReply()}
                />
              </div>
              <Button
                onClick={handleSendReply}
                disabled={sending || !replyText.trim()}
                className="h-11 w-11 rounded-full bg-brand hover:bg-brand/80 text-white p-0 flex items-center justify-center shadow-sm shrink-0"
                aria-label="إرسال"
              >
                {sending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : sent ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Send className="w-5 h-5 rtl:rotate-180 rtl:ms-1" />
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
