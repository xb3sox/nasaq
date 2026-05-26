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
import { BarChart, Bar, Tooltip, ResponsiveContainer, Cell } from "recharts";
import {
  Users, Phone, Tag, Search, Plus,
  MessageCircle, TrendingUp, UserCheck, UserX, LayoutList, KanbanSquare, CalendarCheck
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
  const [view, setView] = useState<"list" | "kanban">("list");
  
  // For Kanban we need a mutable copy of leads to allow dragging
  const [leads, setLeads] = useState([...DEMO_LEADS]);

  const filtered = leads.filter((lead) => {
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
          <Button size="sm" className="min-h-[40px] sm:min-h-0 sm:h-9 gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            عميل جديد
          </Button>
        </div>
      </div>

            {/* Stat Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
          {STAT_CARDS.map((stat) => {
            const count = "statusFilter" in stat
              ? DEMO_LEADS.filter((l) => l.status === stat.statusFilter).length
              : DEMO_LEADS.filter((l) => l.source === (stat as { sourceFilter: string }).sourceFilter).length;
            return (
              <Card key={stat.label} className="p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
                  <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </div>
                <div className={`text-2xl font-bold ${stat.color}`}>{count}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {count} من {DEMO_LEADS.length} — {Math.round((count / DEMO_LEADS.length) * 100)}%
                </div>
              </Card>
            );
          })}
        </div>
        <Card className="p-4 flex flex-col justify-between">
          <span className="text-sm font-medium text-muted-foreground mb-4">مصادر العملاء</span>
          <div className="h-[72px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'واتساب', value: DEMO_LEADS.filter(l => l.source === 'whatsapp').length, color: '#25D366' },
                { name: 'إنستغرام', value: DEMO_LEADS.filter(l => l.source === 'instagram').length, color: '#E1306C' },
                { name: 'جوجل', value: DEMO_LEADS.filter(l => l.source === 'google').length, color: '#4285F4' },
                { name: 'إحالة', value: DEMO_LEADS.filter(l => l.source === 'referral').length, color: '#00a884' }
              ]}>
                <Tooltip 
                   cursor={{fill: 'transparent'}}
                   content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background border rounded shadow-sm text-xs p-2 rtl:text-right">
                             <div className="font-semibold mb-1">{payload[0].payload.name}</div>
                             <div className="text-muted-foreground">{payload[0].value} عميل</div>
                          </div>
                        );
                      }
                      return null;
                   }}
                />
                <Bar dataKey="value" radius={[4, 4, 4, 4]}>
                  {
                    [
                      { name: 'واتساب', value: DEMO_LEADS.filter(l => l.source === 'whatsapp').length, color: '#25D366' },
                      { name: 'إنستغرام', value: DEMO_LEADS.filter(l => l.source === 'instagram').length, color: '#E1306C' },
                      { name: 'جوجل', value: DEMO_LEADS.filter(l => l.source === 'google').length, color: '#4285F4' },
                      { name: 'إحالة', value: DEMO_LEADS.filter(l => l.source === 'referral').length, color: '#0f766e' }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))
                  }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="ابحث بالاسم أو الجوال..."
            className="h-9 ps-9 border-border/50"
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
        <span className="text-xs text-muted-foreground me-auto">
          {filtered.length} من {DEMO_LEADS.length} عميل
        </span>
        <div className="flex bg-muted rounded-lg p-0.5 border">
          <Button 
            variant={view === "list" ? "secondary" : "ghost"} 
            size="sm" 
            className="h-8 px-2"
            onClick={() => setView("list")}
          >
            <LayoutList className="w-4 h-4" />
          </Button>
          <Button 
            variant={view === "kanban" ? "secondary" : "ghost"} 
            size="sm" 
            className="h-8 px-2"
            onClick={() => setView("kanban")}
          >
            <KanbanSquare className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Lead Cards */}
      {filtered.length === 0 ? (
        <Card className="p-16 flex flex-col items-center gap-4 text-muted-foreground bg-muted/20 border-dashed">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-2">
            <UserX className="w-8 h-8 text-muted-foreground/60" />
          </div>
          <div className="text-center space-y-1">
             <h3 className="font-medium text-foreground">لا يوجد عملاء مطابقون</h3>
             <p className="text-sm">قم بإضافة عميل جديد أو غير كلمات البحث.</p>
          </div>
          <Button className="mt-2"><Plus className="w-4 h-4 me-2" /> أضف عميل جديد</Button>
        </Card>
      ) : view === "list" ? (
        <div className="grid gap-3">
          {filtered.map((lead) => {
            const SourceIcon = SOURCE_ICON[lead.source] ?? Tag;
            
            const sourceColorClass = lead.source === "whatsapp" ? "text-[#25D366] bg-[#25D366]/10 border-[#25D366]/30" : 
                                     lead.source === "instagram" ? "text-pink-600 bg-pink-100 border-pink-200" :
                                     lead.source === "google" ? "text-blue-600 bg-blue-100 border-blue-200" :
                                     "text-primary bg-primary/10 border-primary/20";
                                     
            return (
              <Card key={lead.id} className="p-4 hover:shadow-md transition-shadow group relative overflow-hidden border-border/60 hover:border-border">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex gap-4 items-center min-w-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center shrink-0 text-white font-bold text-lg shadow-inner">
                      {lead.name.charAt(0)}
                    </div>
                    <div className="min-w-0 space-y-1">
                      <div className="font-bold truncate text-base">{lead.name}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1 bg-muted px-2 py-0.5 rounded-md font-mono text-foreground/80"><Phone className="w-3 h-3" /> {lead.phone}</span>
                        <span className="text-border">·</span>
                        <span>آخر نشاط: منذ ساعتين</span>
                        <span className="text-border hidden sm:inline">·</span>
                        <span className="hidden sm:inline">أضيف في: {lead.createdAt}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center shrink-0">
                    <Badge variant="outline" className={`text-xs gap-1 hidden sm:flex ${sourceColorClass}`}>
                      <SourceIcon className="w-3 h-3" />
                      {lead.source}
                    </Badge>
                    <Badge className={STATUS_COLORS[lead.status] ?? "bg-muted text-muted-foreground"}>
                      {STATUS_LABELS[lead.status] ?? lead.status}
                    </Badge>
                    
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ms-2">
                       <Button size="icon" variant="ghost" className="h-8 w-8 text-[#25D366] hover:text-[#25D366] hover:bg-[#25D366]/10 rounded-full" title="مراسلة عبر واتساب">
                         <MessageCircle className="w-4 h-4" />
                       </Button>
                       <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600 hover:text-blue-600 hover:bg-blue-50 rounded-full" title="اتصال">
                         <Phone className="w-4 h-4" />
                       </Button>
                       <Button size="icon" variant="ghost" className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10 rounded-full" title="حجز موعد">
                         <CalendarCheck className="w-4 h-4" />
                       </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
             {["new", "contacted", "booked"].map((columnStatus) => (
                <div 
                   key={columnStatus} 
                   className="bg-muted/40 rounded-xl p-4 border flex flex-col gap-3 min-h-[500px]"
                   onDragOver={(e) => e.preventDefault()}
                   onDrop={(e) => {
                      const id = e.dataTransfer.getData("text/plain");
                      if (id) {
                         const newLeads = Array.from(leads);
                         const idx = newLeads.findIndex(l => l.id === id);
                         if (idx > -1) {
                            newLeads[idx].status = columnStatus as "new" | "contacted" | "booked";
                            setLeads(newLeads);
                         }
                      }
                   }}
                >
                   <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold">{STATUS_LABELS[columnStatus]}</div>
                      <Badge variant="secondary" className="bg-background">{filtered.filter(l => l.status === columnStatus).length}</Badge>
                   </div>
                   
                   <div className="flex-1 space-y-3">
                      {filtered.filter(l => l.status === columnStatus).map((lead) => {
                         const SourceIcon = SOURCE_ICON[lead.source] ?? Tag;
                         return (
                            <div
                               key={lead.id}
                               draggable
                               onDragStart={(e) => e.dataTransfer.setData("text/plain", lead.id)}
                            >
                               <Card className="p-3 flex flex-col gap-3 group hover:shadow-sm cursor-grab active:cursor-grabbing">
                                  <div className="flex items-start justify-between">
                                     <div className="flex gap-2.5 items-center">
                                       <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center shrink-0 text-white font-bold text-xs">
                                         {lead.name.charAt(0)}
                                       </div>
                                       <div className="font-semibold text-sm truncate max-w-[120px]">{lead.name}</div>
                                     </div>
                                     <SourceIcon className="w-3.5 h-3.5 text-muted-foreground" />
                                  </div>
                                  <div className="text-xs text-muted-foreground font-mono bg-muted/50 p-1 rounded px-2 w-fit">
                                     {lead.phone}
                                  </div>
                                  <div className="flex gap-1 pt-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end border-t border-border/50">
                                    <Button size="icon" variant="ghost" className="h-7 w-7 text-[#25D366] hover:text-[#25D366] hover:bg-[#25D366]/10 rounded-full">
                                      <MessageCircle className="w-3.5 h-3.5" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-7 w-7 text-blue-600 hover:text-blue-600 hover:bg-blue-50 rounded-full">
                                      <Phone className="w-3.5 h-3.5" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-7 w-7 text-primary hover:text-primary hover:bg-primary/10 rounded-full">
                                      <CalendarCheck className="w-3.5 h-3.5" />
                                    </Button>
                                  </div>
                               </Card>
                            </div>
                         );
                      })}
                   </div>
                </div>
             ))}
           </div>
      )}
    </div>
  );
}
