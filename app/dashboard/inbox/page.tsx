"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { PageShell } from "@/components/ui/page-shell";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, CalendarCheck, Check, Hand, Search, X, Loader2, Paperclip, Smile } from "lucide-react";
import { demoAiDecision, demoBooking } from "@/lib/demo-clinic";

type Conversation = {
  id: string;
  customerName: string;
  phone: string;
  lastMessage: string;
  lastMessageAt: string;
  humanNeeded: boolean;
  tags: string[];
  messages: Array<{ id: string; sender: "customer" | "bot"; body: string }>;
};

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

export default function InboxPage() {
  const [selectedId, setSelectedId] = useState(DEMO_CONVERSATIONS[0].id);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [handoffDone, setHandoffDone] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typing, setTyping] = useState(false);
  const [dismissSuggestion, setDismissSuggestion] = useState(false);

  const selected = DEMO_CONVERSATIONS.find((c) => c.id === selectedId) ?? DEMO_CONVERSATIONS[0];
  const ai = demoAiDecision;
  const booking = demoBooking;

  async function handleSendReply() {
    if (!replyText.trim()) return;
    setSending(true);
    try {
      await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: selected.phone,
          message: replyText,
          conversationId: selected.id,
          customerId: "demo-cust",
          useRealAi: false,
        }),
      });
      setSent(true);
      setReplyText("");
      setTimeout(() => setSent(false), 2000);
    } catch {
      // silent
    } finally {
      setSending(false);
    }
  }

  async function handleConfirmBooking() {
    setBookingConfirmed(true);
    try {
      await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
    } catch {
      // silent
    }
  }

  function handleHumanHandoff() {
    setHandoffDone(true);
    setTimeout(() => setHandoffDone(false), 2000);
  }

  return (
    <PageShell>
      <PageHeader
        title="صندوق الوارد"
        subtitle="إدارة المحادثات واستفسارات العملاء"
      />
      <div className="flex flex-col gap-4 h-[calc(100vh-12rem)] lg:flex-row">
      {/* Sidebar */}
      <Card className="flex max-h-[34dvh] w-full shrink-0 flex-col lg:max-h-none lg:w-80">
        <div className="p-4 border-b font-bold text-sm flex justify-between items-center bg-muted/30">
          المحادثات
          <Badge variant="secondary" className="bg-primary/10 text-primary">{DEMO_CONVERSATIONS.length}</Badge>
        </div>
        <div className="flex-1 overflow-y-auto">
          {DEMO_CONVERSATIONS.map((conv) => {
            const isUnread = conv.id === "conv-2";
            return (
            <div
              key={conv.id}
              onClick={() => { setSelectedId(conv.id); setBookingConfirmed(false); setHandoffDone(false); setDismissSuggestion(false); }}
              className={`p-4 border-b cursor-pointer transition-colors ${selectedId === conv.id ? "bg-muted dark:bg-muted" : "hover:bg-muted/50"}`}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="font-semibold text-sm truncate">{conv.customerName}</div>
                <div className={`text-xs whitespace-nowrap ${isUnread ? "text-whatsapp font-semibold" : "text-muted-foreground"}`}>{conv.lastMessageAt}</div>
              </div>
              <div className={`text-xs truncate mb-2 ${isUnread ? "text-foreground font-semibold" : "text-muted-foreground"}`}>{conv.lastMessage}</div>
              <div className="flex items-center justify-between">
                <div>
                  {conv.humanNeeded ? (
                    <StatusBadge variant="warning" className="text-xs gap-1"><div className="w-1.5 h-1.5 rounded-full bg-warning"></div> يحتاج موظف</StatusBadge>
                  ) : (
                    <StatusBadge variant="success" className="text-xs gap-1"><Bot className="w-3 h-3" /> AI {conv.tags[0]}</StatusBadge>
                  )}
                </div>
                {/* Unread badge mock */}
                {isUnread && <StatusBadge variant="whatsapp" className="text-white hover:bg-whatsapp h-5 min-w-5 flex items-center justify-center p-0 rounded-full text-[10px]">1</StatusBadge>}
              </div>
            </div>
            );
          })}
        </div>
      </Card>

      {/* Main Chat */}
      <Card className="flex min-h-[620px] min-w-0 flex-1 flex-col lg:min-h-0">
        {/* Header */}
        <div className="flex shrink-0 flex-col gap-3 border-b p-3 sm:flex-row sm:items-center sm:justify-between bg-muted/20">
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
                <Button variant="ghost" size="icon" className="h-6 w-6 absolute start-1 top-1/2 -translate-y-1/2" onClick={() => setShowSearch(false)}>
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}
            {!showSearch && (
              <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground" onClick={() => setShowSearch(true)}>
                <Search className="w-4 h-4" />
              </Button>
            )}
            
            {bookingConfirmed ? null : (
              <Button
                size="sm"
                variant="default"
                onClick={handleConfirmBooking}
                className="min-h-[32px] h-8 text-xs bg-success hover:bg-success/80 text-success-foreground"
              >
                <CalendarCheck className="w-3 h-3 me-1" />
                تأكيد الحجز
              </Button>
            )}
            {handoffDone ? null : (
              <Button
                size="sm"
                variant="outline"
                onClick={handleHumanHandoff}
                className="min-h-[32px] h-8 text-xs"
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
                <div className={`relative px-3 py-2 max-w-[85%] sm:max-w-[70%] text-[15px] leading-relaxed shadow-sm flex flex-wrap items-end gap-2 ${
                  msg.sender === "bot"
                    ? "bg-brand-muted dark:bg-brand/20 text-foreground rounded-2xl rounded-se-sm"
                    : "bg-card dark:bg-muted text-foreground rounded-2xl rounded-ss-sm border dark:border-white/5"
                }`}>
                  <div className={isHighlighted ? "bg-warning/20 rounded" : ""}>{msg.body}</div>
                  <div className={`text-[10px] flex items-center gap-1 shrink-0 ms-auto ${msg.sender === "bot" ? "text-success/60 dark:text-success/30" : "text-muted-foreground"}`}>
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

        {/* Action Panel */}
        <div className="shrink-0 border-t bg-muted dark:bg-muted p-3 flex flex-col gap-2">
          {!dismissSuggestion && (
            <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-xl p-2 px-3 shadow-sm text-sm">
              <Bot className="w-4 h-4 text-primary shrink-0" />
              <div className="flex-1 truncate text-primary/80">اقتراح: {ai.reply}</div>
              <Button size="sm" variant="ghost" className="h-7 text-xs text-primary hover:bg-primary/20 hover:text-primary px-2" onClick={() => setReplyText(ai.reply)}>استخدام</Button>
              <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground" onClick={() => setDismissSuggestion(true)}><X className="w-3.5 h-3.5" /></Button>
            </div>
          )}

          {/* Reply Input */}
          <div className="flex gap-2 items-end">
            <div className="flex-1 flex items-center bg-card dark:bg-muted rounded-3xl min-h-[44px] px-2 shadow-sm">
              <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground shrink-0 rounded-full hover:bg-muted/50" aria-label="إضافة رمز تعبيري">
                <Smile className="w-6 h-6" />
              </Button>
              <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground shrink-0 rounded-full hover:bg-muted/50" aria-label="إرفاق ملف">
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
              {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : sent ? <Check className="w-5 h-5" /> : <Send className="w-5 h-5 rtl:rotate-180 rtl:ms-1" />}
            </Button>
          </div>
        </div>
      </Card>
      </div>
    </PageShell>
  );
}
