"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DEMO_LEADS } from "@/lib/demo-data";
import { Users, Phone, Tag } from "lucide-react";

export default function CrmPage() {
  const statusLabels: Record<string, string> = {
    new: "جديد",
    contacted: "تم التواصل",
    booked: "تم الحجز",
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">العملاء والعلاقات</h1>
          <p className="text-sm text-muted-foreground mt-1">عملاء من جميع القنوات</p>
        </div>
        <Badge className="bg-primary/10 text-primary">{DEMO_LEADS.length} عميل</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{DEMO_LEADS.filter(l => l.status === "new").length}</div>
          <div className="text-sm text-muted-foreground mt-1">عملاء جدد</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{DEMO_LEADS.filter(l => l.status === "contacted").length}</div>
          <div className="text-sm text-muted-foreground mt-1">تم التواصل</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{DEMO_LEADS.filter(l => l.status === "booked").length}</div>
          <div className="text-sm text-muted-foreground mt-1">تم الحجز</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{DEMO_LEADS.filter(l => l.source === "whatsapp").length}</div>
          <div className="text-sm text-muted-foreground mt-1">من واتساب</div>
        </Card>
      </div>

      <div className="space-y-3">
        {DEMO_LEADS.map((lead) => (
          <Card key={lead.id} className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-bold">{lead.name}</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <Phone className="w-3 h-3" />
                    {lead.phone}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <Badge variant="outline" className="text-xs gap-1">
                  <Tag className="w-3 h-3" />
                  {lead.source}
                </Badge>
                <Badge className={
                  lead.status === "new" ? "bg-blue-100 text-blue-800" :
                  lead.status === "contacted" ? "bg-orange-100 text-orange-800" :
                  "bg-green-100 text-green-800"
                }>
                  {statusLabels[lead.status]}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}