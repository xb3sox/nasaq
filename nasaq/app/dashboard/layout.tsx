import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh bg-background" dir="rtl">
      <Sidebar />
      <main className="min-w-0 flex-1 pt-16 lg:pt-0 lg:me-64">
        {children}
      </main>
    </div>
  );
}
