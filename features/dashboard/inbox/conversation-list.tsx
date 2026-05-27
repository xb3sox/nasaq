import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { Bot } from "lucide-react";
import { Conversation } from "./use-inbox-state";

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function ConversationList({ conversations, selectedId, onSelect }: ConversationListProps) {
  return (
    <Card className="flex max-h-[34dvh] w-full shrink-0 flex-col overflow-hidden lg:max-h-none lg:w-80">
      <div className="p-4 border-b font-bold text-sm flex justify-between items-center bg-muted/30">
        المحادثات
        <Badge variant="secondary">{conversations.length}</Badge>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-4">
            <EmptyState title="لا توجد محادثات" description="لا توجد محادثات تطابق معايير البحث الحالية" />
          </div>
        ) : (
          conversations.map((conv) => {
            const isUnread = conv.id === "conv-2";
            return (
              <div
                key={conv.id}
                onClick={() => onSelect(conv.id)}
                className={`p-4 border-b cursor-pointer transition-colors ${
                  selectedId === conv.id ? "bg-muted dark:bg-muted" : "hover:bg-muted/50"
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="font-semibold text-sm truncate">{conv.customerName}</div>
                  <div
                    className={`text-xs whitespace-nowrap ${
                      isUnread ? "text-whatsapp font-semibold" : "text-muted-foreground"
                    }`}
                  >
                    {conv.lastMessageAt}
                  </div>
                </div>
                <div
                  className={`text-xs truncate mb-2 ${
                    isUnread ? "text-foreground font-semibold" : "text-muted-foreground"
                  }`}
                >
                  {conv.lastMessage}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    {conv.humanNeeded ? (
                      <StatusBadge variant="warning" className="text-xs gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-warning"></div> يحتاج موظف
                      </StatusBadge>
                    ) : (
                      <StatusBadge variant="success" className="text-xs gap-1">
                        <Bot className="w-3 h-3" /> AI {conv.tags[0]}
                      </StatusBadge>
                    )}
                  </div>
                  {/* Unread badge mock */}
                  {isUnread && <Badge variant="whatsapp">1</Badge>}
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
