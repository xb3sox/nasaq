"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DEMO_BOOKINGS } from "@/lib/demo-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, CalendarCheck, Phone, Bot } from "lucide-react";

export default function BookingsPage() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">الحجوزات</h1>
          <p className="text-sm text-muted-foreground mt-1">جميع الحجوزات من واتساب والمسؤول</p>
        </div>
        <Badge className="bg-green-100 text-green-800">{DEMO_BOOKINGS.length} حجز</Badge>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="ابحث بالاسم أو رقم الجوال..." className="pr-10" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="جميع الحالات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            <SelectItem value="confirmed">مؤكد</SelectItem>
            <SelectItem value="pending">معلق</SelectItem>
            <SelectItem value="cancelled">ملغي</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {DEMO_BOOKINGS.map((booking) => (
          <Card key={booking.id} className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3 items-start">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CalendarCheck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-bold">{booking.customer}</div>
                  <div className="text-sm text-muted-foreground">{booking.service} · {booking.doctor}</div>
                  <div className="text-xs text-muted-foreground mt-1">{booking.date} · {booking.time}</div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge className={booking.status === "confirmed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                  {booking.status === "confirmed" ? "مؤكد" : "معلق"}
                </Badge>
                {booking.source === "AI WhatsApp" && (
                  <Badge variant="outline" className="text-xs gap-1"><Bot className="w-3 h-3" /> AI</Badge>
                )}
              </div>
            </div>
            <div className="mt-3 flex gap-2 justify-between items-center">
              <div className="flex gap-1 items-center text-xs text-muted-foreground">
                <Phone className="w-3 h-3" />
                {booking.phone}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">تعديل</Button>
                <Button size="sm" variant="outline" className="text-destructive">إلغاء</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}