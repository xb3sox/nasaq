"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, CalendarCheck, AlertTriangle, Check, Hand } from "lucide-react";
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
    <div className="flex min-h-[calc(100dvh-4rem)] flex-col gap-4 p-4 lg:h-[calc(100vh-2rem)] lg:flex-row">
      {/* Sidebar */}
      <Card className="flex max-h-[34dvh] w-full shrink-0 flex-col lg:max-h-none lg:w-80">
        <div className="p-4 border-b font-bold text-sm">المحادثات</div>
        <div className="flex-1 overflow-y-auto">
          {DEMO_CONVERSATIONS.map((conv) => (
            <div
              key={conv.id}
              onClick={() => { setSelectedId(conv.id); setBookingConfirmed(false); setHandoffDone(false); }}
              className={`p-4 border-b cursor-pointer transition-colors ${selectedId === conv.id ? "bg-primary/10" : "hover:bg-muted/50"}`}
            >
              <div className="font-medium text-sm flex justify-between">
                <span>{conv.customerName}</span>
                <span className="text-xs text-muted-foreground">{conv.lastMessageAt}</span>
              </div>
              <div className="text-xs text-muted-foreground truncate mt-1">{conv.lastMessage}</div>
              <div className="mt-2">
                {conv.humanNeeded ? (
                  <Badge className="bg-orange-100 text-orange-800 text-xs">يحتاج موظف</Badge>
                ) : (
                  <Badge className="bg-green-100 text-green-800 text-xs">AI {conv.tags[0]}</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Main Chat */}
      <Card className="flex min-h-[620px] min-w-0 flex-1 flex-col lg:min-h-0">
        {/* Header */}
        <div className="flex shrink-0 flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="font-bold">{selected.customerName}</div>
            <div className="text-xs text-muted-foreground">{selected.phone} · WhatsApp</div>
          </div>
          <div className="flex flex-wrap gap-2">
            {bookingConfirmed ? (
              <Badge className="bg-green-600 text-white gap-1"><Check className="w-3 h-3" /> الحجز مؤكد</Badge>
            ) : (
              <Button
                size="sm"
                variant="default"
                onClick={handleConfirmBooking}
                className="min-h-[40px] bg-green-600 hover:bg-green-700"
              >
                <CalendarCheck className="w-3 h-3 ml-1" />
                تأكيد الحجز
              </Button>
            )}
            {handoffDone ? (
              <Badge className="bg-orange-500 text-white gap-1"><Check className="w-3 h-3" /> تم التحويل</Badge>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={handleHumanHandoff}
                className="min-h-[40px]"
              >
                <Hand className="w-3 h-3 ml-1" />
                تحويل لموظف
              </Button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {selected.messages.map((msg) => (
            <div
              key={msg.id}
              className={msg.sender === "bot" ? "flex justify-end" : "flex justify-start items-end gap-2"}
            >
              {msg.sender === "customer" && (
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
              <div className={`p-3 rounded-lg max-w-[75%] text-sm leading-relaxed ${
                msg.sender === "bot"
                  ? "bg-primary text-primary-foreground rounded-tr-none"
                  : "bg-muted rounded-tl-none"
              }`}>
                {msg.body}
              </div>
              {msg.sender === "bot" && (
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Panel */}
        <div className="shrink-0 border-t bg-muted/30 p-4">
          <div className="mb-4 grid gap-3 lg:grid-cols-[1fr_280px]">
            {/* AI Suggestion */}
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
              <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 font-medium mb-1 text-sm">
                <Bot className="w-4 h-4" />
                اقتراح الذكاء الاصطناعي
                <Badge variant="outline" className="text-xs">{Math.round(ai.confidence * 100)}%</Badge>
              </div>
              <p className="text-sm">{ai.reply}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white min-h-[40px]"
                  onClick={() => setReplyText(ai.reply)}
                >
                  استخدام الرد
                </Button>
                <Button size="sm" variant="outline" onClick={() => setReplyText("")} className="min-h-[40px]">
                  مسح
                </Button>
              </div>
            </div>

            {/* Booking Draft */}
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800 text-sm space-y-2">
              <div className="flex items-center gap-2 font-medium text-green-800 dark:text-green-300">
                <CalendarCheck className="w-4 h-4" />
                حجز جاهز
              </div>
              <div>{booking.serviceName} مع {booking.doctorName}</div>
              <div className="text-muted-foreground">اليوم 4:00 مساء · تذكيران تلقائيان</div>
              {ai.humanNeeded && (
                <div className="flex items-center gap-1 text-orange-600 mt-1">
                  <AlertTriangle className="w-3 h-3" />
                  يحتاج موظف
                </div>
              )}
            </div>
          </div>

          {/* Reply Input */}
          <div className="flex gap-2">
            <Input
              placeholder="اكتب رسالة أو استخدم اقتراح الذكاء الاصطناعي..."
              className="min-h-[40px] flex-1"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendReply()}
            />
            <Button onClick={handleSendReply} disabled={sending || !replyText.trim()} className="min-h-[40px] min-w-[40px]">
              {sent ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4 rtl:rotate-180" />}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
