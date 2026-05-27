import { useState } from "react";

export type Conversation = {
  id: string;
  customerName: string;
  phone: string;
  lastMessage: string;
  lastMessageAt: string;
  humanNeeded: boolean;
  tags: string[];
  messages: Array<{ id: string; sender: "customer" | "bot"; body: string }>;
};

export function useInboxState(initialConversations: Conversation[]) {
  const [selectedId, setSelectedId] = useState(initialConversations[0]?.id || "");
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [handoffDone, setHandoffDone] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typing, setTyping] = useState(false);
  const [dismissSuggestion, setDismissSuggestion] = useState(false);

  const selected = initialConversations.find((c) => c.id === selectedId) ?? initialConversations[0];

  async function handleSendReply() {
    if (!replyText.trim() || !selected) return;
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

  return {
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
    handleHumanHandoff
  };
}
