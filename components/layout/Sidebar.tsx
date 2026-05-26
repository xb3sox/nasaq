"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  MessageCircle, 
  BarChart, 
  Receipt, 
  Settings,
  Activity,
  Bell,
  Menu,
  X,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";
import { useSetupStore } from "@/lib/setup-store";

// Mock notification counts
const notificationCounts: Record<string, number> = {
  "/dashboard/inbox": 3,
  "/dashboard/reminders": 5,
};

const routes = [
  { name: "لوحة القيادة", href: "/dashboard", icon: LayoutDashboard },
  { name: "العملاء والعلاقات", href: "/dashboard/crm", icon: Users },
  { name: "الحجوزات", href: "/dashboard/bookings", icon: Calendar },
  { name: "صندوق الواتساب", href: "/dashboard/inbox", icon: MessageCircle },
  { name: "التذكيرات", href: "/dashboard/reminders", icon: Bell },
  { name: "التقارير", href: "/dashboard/reports", icon: BarChart },
  { name: "الفواتير", href: "/dashboard/invoices", icon: Receipt },
  { name: "الإعدادات", href: "/dashboard/settings", icon: Settings },
];

function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  const pathname = usePathname();
  const { isSetupComplete } = useSetupStore();

  return (
    <>
      <div className="px-5 py-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
            <Activity className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground leading-none">{BRAND.name}</h1>
            <p className="text-xs text-muted-foreground leading-none mt-0.5">{BRAND.nameAr}</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 border-b border-border/30">
        <button className="w-full px-3 py-2.5 rounded-xl hover:bg-muted/60 transition-colors flex items-center justify-between group">
          <div className="flex flex-col items-start">
            <p className="text-sm font-bold text-foreground">عيادات النخبة</p>
            <p className="text-xs text-muted-foreground mt-0.5">حي الملقا، الرياض</p>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto" role="navigation" aria-label="القائمة الرئيسية">
        {!isSetupComplete && (
          <Link
            href="/setup"
            onClick={onNavClick}
            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 group bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border border-amber-500/20 mb-4"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-4 h-4 shrink-0 text-amber-600" />
              <span>أكمل الإعداد</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
          </Link>
        )}
        {routes.map((route) => {
          const isActive = pathname === route.href || (route.href !== "/dashboard" && pathname.startsWith(route.href));
          const count = notificationCounts[route.href];
          return (
            <Link
              key={route.href}
              href={route.href}
              onClick={onNavClick}
              aria-label={route.name}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 group",
                isActive
                  ? "bg-primary/5 text-primary border-e-2 border-primary rounded-e-none"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <route.icon className={cn("w-4 h-4 shrink-0 transition-colors duration-150", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                <span>{route.name}</span>
              </div>
              {count > 0 && (
                <div className={cn(
                  "flex items-center justify-center min-w-[20px] h-5 rounded-full text-[10px] font-bold px-1.5",
                  isActive ? "bg-primary text-primary-foreground" : "bg-destructive text-destructive-foreground"
                )}>
                  {count}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/50">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-muted transition-colors cursor-pointer group">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground text-sm font-bold shadow-sm">
              م
            </div>
            <div className="absolute -bottom-1 -start-1 w-3.5 h-3.5 bg-green-500 border-2 border-card rounded-full"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">المدير</p>
            <p className="text-xs text-muted-foreground truncate">owner@clinic.com</p>
          </div>
        </div>
      </div>
    </>
  );
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Hamburger — visible on mobile only */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 start-4 z-40 lg:hidden w-10 h-10 rounded-xl bg-card border border-border shadow-sm flex items-center justify-center hover:bg-muted transition-colors"
        aria-label="فتح القائمة"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Desktop sidebar — hidden on mobile */}
      <aside className="hidden lg:flex w-64 border-e border-border/50 h-screen bg-card flex-col fixed start-0 top-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="القائمة الجانبية للتنقل">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          {/* Drawer: slide in from right (RTL: start-0) */}
          <aside className="fixed start-0 top-0 h-full w-72 bg-card border-e border-border/50 z-50 flex flex-col shadow-2xl transition-transform duration-300 translate-x-0">
            <div className="flex justify-end p-3">
              <button
                onClick={() => setMobileOpen(false)}
                className="w-9 h-9 rounded-xl hover:bg-muted flex items-center justify-center transition-colors focus:ring-2 focus:ring-primary focus:outline-none"
                aria-label="إغلاق القائمة"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <SidebarContent onNavClick={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
