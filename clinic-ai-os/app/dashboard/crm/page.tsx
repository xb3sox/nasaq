"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEMO_LEADS } from "@/lib/demo-data";
import {
  Users, Phone, Tag, Search, Plus,
  MessageCircle, TrendingUp, UserCheck, UserX,
} from "lucide-react";

const STATUS_LABELS: Record<string, string> = {
  new: "جديد",
  contacted: "تم التواصل",
  booked: "تم الحجز",
};

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-orange-100 text-orange-800",
  booked: "bg-green-100 text-green-800",
};

const SOURCE_ICON: Record<string, React.ElementType> = {
  whatsapp: MessageCircle,
  instagram: TrendingUp,
  google: UserCheck,
  referral: Users,
};

const STAT_CARDS = [
  { label: "عملاء جدد", statusFilter: "new", color: "text-blue-600", bg: "bg-blue-50", icon: Plus },
  { label: "تم التواصل", statusFilter: "contacted", color: "text-orange-600", bg: "bg-orange-50", icon: Phone },
  { label: "تم الحجز", statusFilter: "booked", color: "text-green-600", bg: "bg-green-50", icon: UserCheck },
  { label: "من واتساب", sourceFilter: "whatsapp", color: "text-primary", bg: "bg-primary/10", icon: MessageCircle },
];

export default function CrmPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");

  const filtered = DEMO_LEADS.filter((lead) => {
    const matchSearch = lead.name.includes(search) || lead.phone.includes(search);
    const matchStatus = statusFilter === "all" || lead.status === statusFilter;
    const matchSource = sourceFilter === "all" || lead.source === sourceFilter;
    return matchSearch && matchStatus && matchSource;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">العملاء والعلاقات</h1>
          <p className="text-sm text-muted-foreground">عملاء من جميع القنوات</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" className="h-9 gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            عميل جديد
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((stat) => {
          const count = "statusFilter" in stat
            ? DEMO_LEADS.filter((l) => l.status === stat.statusFilter).length
            : DEMO_LEADS.filter((l) => l.source === (stat as { sourceFilter: string }).sourceFilter).length;
          return (
            <Card key={stat.label} className="p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
                <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
              <div className={`text-2xl font-bold ${stat.color}`}>{count}</div>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="ابحث بالاسم أو الجوال..."
            className="h-9 pr-9 border-border/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
          <SelectTrigger className="w-[140px] h-9 border-border/50">
            <SelectValue placeholder="الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            <SelectItem value="new">جديد</SelectItem>
            <SelectItem value="contacted">تم التواصل</SelectItem>
            <SelectItem value="booked">تم الحجز</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sourceFilter} onValueChange={(v) => setSourceFilter(v ?? "all")}>
          <SelectTrigger className="w-[140px] h-9 border-border/50">
            <SelectValue placeholder="المصدر" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع المصادر</SelectItem>
            <SelectItem value="whatsapp">واتساب</SelectItem>
            <SelectItem value="instagram">إنستغرام</SelectItem>
            <SelectItem value="google">جوجل</SelectItem>
            <SelectItem value="referral">إحالة</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground mr-auto">
          {filtered.length} من {DEMO_LEADS.length} عميل
        </span>
      </div>

      {/* Lead Cards */}
      {filtered.length === 0 ? (
        <Card className="p-12 flex flex-col items-center gap-3 text-muted-foreground">
          <UserX className="w-10 h-10 text-muted-foreground/40" />
          <span className="text-sm">لا يوجد عملاء مطابقون</span>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((lead) => {
            const SourceIcon = SOURCE_ICON[lead.source] ?? Tag;
            return (
              <Card key={lead.id} className="p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex gap-3 items-center min-w-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold truncate">{lead.name}</div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <Phone className="w-3 h-3 shrink-0" />
                        <span className="font-mono">{lead.phone}</span>
                        <span className="text-border mx-1">·</span>
                        <span className="text-muted-foreground/60">{lead.createdAt}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center shrink-0">
                    <Badge variant="outline" className="text-xs gap-1 hidden sm:flex">
                      <SourceIcon className="w-3 h-3" />
                      {lead.source}
                    </Badge>
                    <Badge className={STATUS_COLORS[lead.status] ?? "bg-muted text-muted-foreground"}>
                      {STATUS_LABELS[lead.status] ?? lead.status}
                    </Badge>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hidden sm:flex">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
