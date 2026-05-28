import { useState, useMemo } from "react";
import { toast } from "sonner";
import { DEMO_INVOICES } from "@/lib/demo-data";

type Invoice = typeof DEMO_INVOICES[number];

export function useInvoicesTable() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Invoice; direction: "asc" | "desc" } | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const result = DEMO_INVOICES.filter((inv) => {
      const matchSearch =
        inv.customerName.includes(search) ||
        inv.id.includes(search);
      const matchStatus =
        statusFilter === "all" || inv.status === statusFilter;
      return matchSearch && matchStatus;
    });
    
    if (sortConfig) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    
    return result;
  }, [search, statusFilter, sortConfig]);

  const handleSort = (key: keyof Invoice) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map(i => i.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleBulkAction = (action: "pay" | "remind") => {
    if (selectedIds.size === 0) return;
    if (action === "pay") {
      toast.success(`تم تحديث حالة ${selectedIds.size} فاتورة إلى مدفوعة`);
    } else {
      toast.success(`تم إرسال تذكير لـ ${selectedIds.size} عملاء`);
    }
    setSelectedIds(new Set());
  };

  return {
    search, setSearch,
    statusFilter, setStatusFilter,
    selectedInvoice, setSelectedInvoice,
    sortConfig, handleSort,
    selectedIds, toggleSelectAll, toggleSelect,
    handleBulkAction,
    filtered,
  };
}
