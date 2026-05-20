import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User } from "lucide-react";

export default function InboxPage() {
  return (
    <div className="h-[calc(100vh-2rem)] p-4 flex gap-4">
      {/* Sidebar - Conversations */}
      <Card className="w-80 flex flex-col">
        <div className="p-4 border-b font-bold">المحادثات</div>
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 border-b bg-muted/50 cursor-pointer">
            <div className="font-medium flex justify-between">
              <span>سارة أحمد</span>
              <span className="text-xs text-muted-foreground">10:42 ص</span>
            </div>
            <div className="text-sm text-muted-foreground truncate mt-1">
              بكم سعر تنظيف الأسنان؟
            </div>
          </div>
          <div className="p-4 border-b hover:bg-muted/50 cursor-pointer">
            <div className="font-medium flex justify-between">
              <span>محمد علي</span>
              <span className="text-xs text-muted-foreground">الأمس</span>
            </div>
            <div className="text-sm text-muted-foreground truncate mt-1">
              أريد إلغاء موعدي غداً
            </div>
          </div>
        </div>
      </Card>

      {/* Main Chat Area */}
      <Card className="flex-1 flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="font-bold">سارة أحمد</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">تأكيد حجز</Button>
            <Button variant="outline" size="sm">تحويل لموظف</Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex justify-end">
            <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-[80%] rounded-tr-none">
              أهلاً بك في عيادة الابتسامة. كيف يمكننا مساعدتك اليوم؟
            </div>
          </div>
          
          <div className="flex justify-start items-end gap-2">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div className="bg-muted p-3 rounded-lg max-w-[80%] rounded-tl-none">
              بكم سعر تنظيف الأسنان؟ وهل في مواعيد اليوم؟
            </div>
          </div>
        </div>

        <div className="p-4 border-t bg-muted/30">
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
            <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 font-medium mb-1 text-sm">
              <Bot className="w-4 h-4" />
              اقتراح الذكاء الاصطناعي
            </div>
            <p className="text-sm">أهلاً بك سارة. سعر تنظيف الأسنان هو 250 ريال. نعم، يتوفر لدينا موعد اليوم الساعة 4:00 عصراً مع د. خالد، وموعد الساعة 7:00 مساءً مع د. نورة. هل يناسبك أحدها؟</p>
            <div className="mt-2 flex gap-2">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">إرسال الاقتراح</Button>
              <Button size="sm" variant="outline">تعديل</Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Input placeholder="اكتب رسالة..." className="flex-1" />
            <Button>
              <Send className="w-4 h-4 rtl:rotate-180" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
