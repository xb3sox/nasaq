import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  MessageCircle, 
  BarChart, 
  Receipt, 
  Settings 
} from "lucide-react";

export function Sidebar() {
  const routes = [
    { name: "لوحة القيادة", href: "/dashboard", icon: LayoutDashboard },
    { name: "العملاء", href: "/dashboard/crm", icon: Users },
    { name: "الحجوزات", href: "/dashboard/bookings", icon: Calendar },
    { name: "الواتساب", href: "/dashboard/inbox", icon: MessageCircle },
    { name: "التقارير", href: "/dashboard/reports", icon: BarChart },
    { name: "الفواتير", href: "/dashboard/invoices", icon: Receipt },
    { name: "الإعدادات", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="w-64 border-l h-screen bg-card text-card-foreground flex flex-col hidden md:flex">
      <div className="p-6">
        <h1 className="text-xl font-bold text-primary">Clinic AI OS</h1>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors"
          >
            <route.icon className="w-5 h-5" />
            <span>{route.name}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            A
          </div>
          <div>
            <p className="text-sm font-medium">المدير</p>
            <p className="text-xs text-muted-foreground">admin@clinic.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
