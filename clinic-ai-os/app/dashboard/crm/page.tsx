"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Phone, MessageCircle, Filter } from "lucide-react";

const MOCK_CUSTOMERS = [
  { id: "1", name: "محمد السالم", phone: "+966500001001", lead_status: "booked", source: "whatsapp", last_interaction: "اليوم", tags: ["vip"] },
  { id: "2", name: "سارة العامري", phone: "+966500001002", lead_status: "new", source: "instagram", last_interaction: "أمس", tags: [] },
  { id: "3", name: "فهد الحربي", phone: "+966500001003", lead_status: "completed", source: "referral", last_interaction: "منذ 3 أيام", tags: [] },
  { id: "4", name: "ريم القحطاني", phone: "+966500001004", lead_status: "no_show", source: "website", last_interaction: "منذ أسبوع", tags: [] },
  { id: "5", name: "نورة الفيفي", phone: "+966500001005", lead_status: "contacted", source: "whatsapp", last_interaction: "اليوم", tags: [] },
  { id: "6", name: "خالد الغامدي", phone: "+966500001006", lead_status: "new", source: "whatsapp", last_interaction: "أمس", tags: [] },
];

const STATUS_LABELS: Record<string, string> = {
  new: "جديد", contacted: "تم التواصل", booked: "محجوز",
  no_show: "لم يحضر", completed: "مكتمل", lost: "خسرناه",
};
const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-800", contacted: "bg-yellow-100 text-yellow-800",
  booked: "bg-green-100 text-green-800", no_show: "bg-red-100 text-red-800",
  completed: "bg-purple-100 text-purple-800", lost: "bg-gray-100 text-gray-800",
};

export default function CRMPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = MOCK_CUSTOMERS.filter(c => {
    const matchSearch = c.name.includes(search) || c.phone.includes(search);
    const matchFilter = filter === "all" || c.lead_status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">إدارة العملاء</h1>
        <Button><Plus className="w-4 h-4 ml-2" />إضافة عميل</Button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="ابحث باسم أو رقم..." className="pr-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", "new", "contacted", "booked", "no_show", "completed"].map(s => (
            <Button key={s} variant={filter === s ? "default" : "outline"} size="sm" onClick={() => setFilter(s)}>
              {s === "all" ? "الكل" : STATUS_LABELS[s]}
            </Button>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="text-right p-4 font-medium">العميل</th>
                <th className="text-right p-4 font-medium">رقم الجوال</th>
                <th className="text-right p-4 font-medium">الحالة</th>
                <th className="text-right p-4 font-medium">المصدر</th>
                <th className="text-right p-4 font-medium">آخر تفاعل</th>
                <th className="text-right p-4 font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div className="font-medium">{c.name}</div>
                    {c.tags.length > 0 && <Badge variant="secondary" className="text-xs mt-1">{c.tags[0]}</Badge>}
                  </td>
                  <td className="p-4 text-muted-foreground">{c.phone}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[c.lead_status]}`}>
                      {STATUS_LABELS[c.lead_status]}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground">{c.source}</td>
                  <td className="p-4 text-muted-foreground">{c.last_interaction}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm"><Phone className="w-3.5 h-3.5" /></Button>
                      <Button variant="ghost" size="sm"><MessageCircle className="w-3.5 h-3.5" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-12 text-center text-muted-foreground">لا توجد نتائج</div>
          )}
        </CardContent>
      </Card>
      <p className="text-sm text-muted-foreground">{filtered.length} عميل</p>
    </div>
  );
}
