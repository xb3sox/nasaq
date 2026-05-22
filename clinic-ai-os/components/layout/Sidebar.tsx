"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  MessageCircle, 
  BarChart, 
  Receipt, 
  Settings,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

const routes = [
  { name: "لوحة القيادة", href: "/dashboard", icon: LayoutDashboard },
  { name: "العملاء والعلاقات", href: "/dashboard/crm", icon: Users },
  { name: "الحجوزات", href: "/dashboard/bookings", icon: Calendar },
  { name: "صندوق الواتساب", href: "/dashboard/inbox", icon: MessageCircle },
  { name: "التقارير", href: "/dashboard/reports", icon: BarChart },
  { name: "الفواتير", href: "/dashboard/invoices", icon: Receipt },
  { name: "الإعدادات", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-l border-border/50 h-screen bg-card flex flex-col fixed right-0 top-0 z-30">
      <div className="px-5 py-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
            <Activity className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground leading-none">Clinic AI</h1>
            <p className="text-[10px] text-muted-foreground leading-none mt-0.5">Operating System</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 border-b border-border/30">
        <div className="px-3 py-2.5 rounded-xl bg-muted/60">
          <p className="text-xs font-medium text-foreground">عيادات النخبة</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">حي الملقا، الرياض</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {routes.map((route) => {
          const isActive = pathname === route.href || (route.href !== "/dashboard" && pathname.startsWith(route.href));
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <route.icon className={cn("w-4 h-4 shrink-0", isActive ? "text-primary-foreground" : "")} />
              <span>{route.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/50">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-muted transition-colors cursor-pointer">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground text-sm font-bold shadow-sm">
            م
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">المدير</p>
            <p className="text-[10px] text-muted-foreground truncate">owner@clinic.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
