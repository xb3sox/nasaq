"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DEMO_REMINDERS } from "@/lib/demo-data";
import { Bell, Clock, Send } from "lucide-react";

export default function RemindersPage() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">التذكيرات</h1>
          <p className="text-sm text-muted-foreground mt-1">تذكيرات WhatsApp آلية للحجوزات</p>
        </div>
        <div className="flex gap-3">
          <Badge className="bg-orange-100 text-orange-800">{DEMO_REMINDERS.filter(r => r.status === "queued" || r.status === "pending").length} معلقة</Badge>
          <Badge className="bg-green-100 text-green-800">{DEMO_REMINDERS.filter(r => r.status === "sent").length} مرسلة</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{DEMO_REMINDERS.filter(r => r.status === "queued").length}</div>
          <div className="text-sm text-muted-foreground mt-1">في الانتظار</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{DEMO_REMINDERS.filter(r => r.status === "sent").length}</div>
          <div className="text-sm text-muted-foreground mt-1">تم الإرسال</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-red-500">{DEMO_REMINDERS.filter(r => r.status === "failed").length}</div>
          <div className="text-sm text-muted-foreground mt-1">فشلت</div>
        </Card>
      </div>

      <div className="space-y-3">
        {DEMO_REMINDERS.map((reminder) => (
          <Card key={reminder.id} className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3 items-start">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${reminder.type === "24h_before" ? "bg-blue-100" : "bg-purple-100"}`}>
                  <Bell className={`w-5 h-5 ${reminder.type === "24h_before" ? "text-blue-600" : "text-purple-600"}`} />
                </div>
                <div>
                  <div className="font-bold">{reminder.customerName}</div>
                  <div className="text-sm text-muted-foreground">{reminder.serviceName} · {reminder.doctorName}</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <Clock className="w-3 h-3" />
                    {reminder.type === "24h_before" ? "قبل 24 ساعة" : "قبل ساعتين"} · {new Date(reminder.sendAt).toLocaleString("ar-SA")}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge className={
                  reminder.status === "sent" ? "bg-green-100 text-green-800" :
                  reminder.status === "queued" ? "bg-blue-100 text-blue-800" :
                  "bg-yellow-100 text-yellow-800"
                }>
                  {reminder.status === "sent" ? "تم الإرسال" : reminder.status === "queued" ? "في الانتظار" : "معلق"}
                </Badge>
                {reminder.status === "pending" && (
                  <Button size="sm" variant="outline" className="text-xs gap-1">
                    <Send className="w-3 h-3" /> إعادة إرسال
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}