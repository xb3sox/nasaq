"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, CalendarCheck, Check, Hand, Search, X, Loader2 } from "lucide-react";
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
    <div className="flex flex-col gap-4 p-4 lg:h-[calc(100vh-2rem)] lg:flex-row">
      {/* Sidebar */}
      <Card className="flex max-h-[34dvh] w-full shrink-0 flex-col lg:max-h-none lg:w-80">
        <div className="p-4 border-b font-bold text-sm flex justify-between items-center bg-muted/30">
          المحادثات
          <Badge variant="secondary" className="bg-primary/10 text-primary">{DEMO_CONVERSATIONS.length}</Badge>
        </div>
        <div className="flex-1 overflow-y-auto">
          {DEMO_CONVERSATIONS.map((conv) => (
            <div
              key={conv.id}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if(e.key==="Enter"||e.key===" ") { setSelectedId(conv.id); setBookingConfirmed(false); setHandoffDone(false); setDismissSuggestion(false); } }}
              onClick={() => { setSelectedId(conv.id); setBookingConfirmed(false); setHandoffDone(false); setDismissSuggestion(false); }}
              className={`p-4 border-b cursor-pointer transition-colors ${selectedId === conv.id ? "bg-primary/5 border-s-4 border-s-primary" : "hover:bg-muted/50"}`}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="font-semibold text-sm truncate">{conv.customerName}</div>
                <div className="text-xs text-muted-foreground whitespace-nowrap">{conv.lastMessageAt}</div>
              </div>
              <div className="text-xs text-muted-foreground truncate mb-2">{conv.lastMessage}</div>
              <div className="flex items-center justify-between">
                <div>
                  {conv.humanNeeded ? (
                    <Badge className="bg-orange-100 text-orange-800 text-xs border-0 gap-1"><div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div> يحتاج موظف</Badge>
                  ) : (
                    <Badge className="bg-green-100 text-green-800 text-xs border-0 gap-1"><Bot className="w-3 h-3" aria-hidden="true" /> AI {conv.tags[0]}</Badge>
                  )}
                </div>
                {/* Unread badge mock */}
                {conv.id === "conv-2" && <Badge className="bg-primary h-5 min-w-5 flex items-center justify-center p-0 rounded-full text-[10px]">1</Badge>}
              </div>
            </div>
          ))}
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
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>
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
                <Button aria-label="إغلاق البحث" variant="ghost" size="icon" className="h-6 w-6 min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 md:h-6 md:w-6 absolute start-1 top-1/2 -translate-y-1/2" onClick={() => setShowSearch(false)}>
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}
            {!showSearch && (
              <Button aria-label="بحث" size="icon" variant="ghost" className="h-8 w-8 min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 md:h-8 md:w-8 text-muted-foreground" onClick={() => setShowSearch(true)}>
                <Search className="w-4 h-4" />
              </Button>
            )}
            
            {bookingConfirmed ? null : (
              <Button
                size="sm"
                variant="default"
                onClick={handleConfirmBooking}
                className="min-h-[32px] h-8 text-xs bg-[#25D366] hover:bg-[#1EBE5D] text-white"
              >
                <CalendarCheck className="w-3 h-3 me-1" aria-hidden="true" />
                تأكيد الحجز
              </Button>
            )}
            {handoffDone ? null : (
              <Button
                size="sm"
                variant="outline"
                onClick={handleHumanHandoff}
                className="min-h-[44px] sm:min-h-[32px] h-8 text-xs px-3"
              >
                <Hand className="w-3 h-3 me-1" aria-hidden="true" />
                تحويل لموظف
              </Button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#E5DDD5]/10 dark:bg-muted/10 relative" style={{ backgroundImage: 'url("https://web.whatsapp.com/img/bg-chat-tile-dark_a4be512e7195b6b733d9110b408f075d.png")', backgroundSize: '400px', opacity: 0.9, backgroundBlendMode: 'overlay' }}>
          <div className="absolute inset-0 bg-background/95 -z-10"></div>
          {bookingConfirmed && (
             <div className="flex justify-center mb-4">
               <div className="bg-yellow-100/80 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200 text-xs px-3 py-1.5 rounded-lg shadow-sm border border-yellow-200/50 flex items-center gap-1.5">
                 <CalendarCheck className="w-3.5 h-3.5" aria-hidden="true" />
                 تم تأكيد الحجز: {booking.serviceName} مع {booking.doctorName}
               </div>
             </div>
          )}
          
          {handoffDone && (
             <div className="flex justify-center mb-4">
               <div className="bg-blue-100/80 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 text-xs px-3 py-1.5 rounded-lg shadow-sm border border-blue-200/50 flex items-center gap-1.5">
                 <User className="w-3.5 h-3.5" aria-hidden="true" />
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
                <div className={`relative p-2.5 max-w-[85%] sm:max-w-[70%] text-[15px] leading-relaxed shadow-sm min-w-0 break-words ${
                  msg.sender === "bot"
                    ? "bg-[#D9FDD3] dark:bg-[#005C4B] text-foreground rounded-2xl rounded-tr-sm rtl:rounded-tl-sm rtl:rounded-tr-2xl"
                    : "bg-white dark:bg-[#202C33] text-foreground rounded-2xl rounded-tl-sm rtl:rounded-tr-sm rtl:rounded-tl-2xl border dark:border-white/5"
                }`}>
                  <div className={isHighlighted ? "bg-yellow-200 dark:bg-yellow-800" : ""}>{msg.body}</div>
                  <div className={`text-[10px] flex items-center gap-1 mt-1 justify-end ${msg.sender === "bot" ? "text-green-800/60 dark:text-green-200/50" : "text-muted-foreground"}`}>
                    10:42 ص
                    {msg.sender === "bot" && <Check className="w-3 h-3 text-[#53bdeb] dark:text-[#53bdeb]" aria-hidden="true" />}
                  </div>
                </div>
              </div>
            );
          })}
          
          {typing && (
             <div className="flex justify-start">
                <div className="bg-white dark:bg-[#202C33] text-foreground rounded-2xl rounded-tl-sm rtl:rounded-tr-sm rtl:rounded-tl-2xl p-3 shadow-sm border dark:border-white/5 flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce delay-75"></div>
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce delay-150"></div>
                </div>
             </div>
          )}
        </div>

        {/* Action Panel */}
        <div className="shrink-0 border-t bg-[#f0f2f5] dark:bg-[#202c33] p-3 flex flex-col gap-2">
          {!dismissSuggestion && (
            <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-xl p-2 px-3 shadow-sm text-sm">
              <Bot className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
              <div className="flex-1 truncate text-primary/80">اقتراح: {ai.reply}</div>
              <Button size="sm" variant="ghost" className="h-7 text-xs text-primary hover:bg-primary/20 hover:text-primary px-2" onClick={() => setReplyText(ai.reply)}>استخدام</Button>
              <Button aria-label="رفض الاقتراح" size="icon" variant="ghost" className="h-7 w-7 min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 md:h-7 md:w-7 text-muted-foreground" onClick={() => setDismissSuggestion(true)}><X className="w-3.5 h-3.5" /></Button>
            </div>
          )}

          {/* Reply Input */}
          <div className="flex gap-2 items-center">
            <Input
              placeholder="اكتب رسالة..."
              className="min-h-[44px] flex-1 rounded-full border-0 shadow-sm px-4 bg-white dark:bg-[#2a3942]"
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
            <Button 
               aria-live="polite"
               onClick={handleSendReply} 
               disabled={sending || !replyText.trim()} 
               className="min-h-[44px] min-w-[44px] rounded-full bg-[#00a884] hover:bg-[#058b6f] text-white p-0 flex items-center justify-center shadow-sm"
            >
              <span className="sr-only">{sending ? "جاري الإرسال" : sent ? "تم الإرسال" : "إرسال"}</span>
              {sending ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> : sent ? <Check className="w-5 h-5" aria-hidden="true" /> : <Send className="w-5 h-5 rtl:rotate-180 rtl:me-1" aria-hidden="true" />}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
