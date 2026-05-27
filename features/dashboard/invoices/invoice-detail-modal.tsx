"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { DEMO_INVOICES } from "@/lib/demo-data";

type Invoice = typeof DEMO_INVOICES[number];

async function generateZatcaPDF(inv: Invoice) {
  const element = document.getElementById("invoice-modal-content");
  if (!element) return;

  // Wait for fonts to load and hide buttons
  const buttons = element.querySelectorAll('button');
  buttons.forEach(b => b.style.display = 'none');

  try {
    const [html2canvasMod, jsPDFMod] = await Promise.all([
      import("html2canvas"),
      import("jspdf")
    ]);
    const html2canvas = html2canvasMod.default;
    const { jsPDF } = jsPDFMod;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      windowWidth: 800,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`invoice-${inv.id}.pdf`);
    toast.success("تم تنزيل الفاتورة بنجاح");
  } catch {
    toast.error("حدث خطأ أثناء إنشاء ملف PDF. حاول مرة أخرى.");
  } finally {
    buttons.forEach(b => b.style.display = '');
  }
}

export function InvoiceDetailModal({ inv, onClose }: { inv: Invoice; onClose: () => void }) {
  const vatRate = 0.15;
  const subtotal = inv.amount;
  const vat = +(subtotal * vatRate).toFixed(2);
  const total = +(subtotal + vat).toFixed(2);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogTitle>فاتورة زكاتية — {inv.id.toUpperCase()}</DialogTitle>
        <div id="invoice-modal-content" className="space-y-4 text-sm bg-background p-4 rounded-xl">
          {/* Header */}
          <div className="p-4 rounded-xl bg-muted/50 border border-border/40 space-y-1">
            <div className="font-bold text-lg">عيادات النخبة</div>
            <div className="text-xs text-muted-foreground">رقم سجل ضريبة: 310000000000003 | 31xxxxx | سي7 رقم تسجيل ZATCA</div>
            <div className="text-xs text-muted-foreground">تاريخ الفاتورة: {inv.date} · العملة: SAR</div>
          </div>

          {/* Customer */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-muted-foreground mb-1">العميل</div>
              <div className="font-medium">{inv.customerName}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">رقم الفاتورة</div>
              <div className="font-mono font-medium">{inv.id.toUpperCase()}</div>
            </div>
          </div>

          {/* Line item */}
          <div className="border rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted/50 border-b">
                  <th className="text-end p-2.5 font-medium">الوصف</th>
                  <th className="text-start p-2.5 font-medium">السعر</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2.5">{inv.serviceName}</td>
                  <td className="p-2.5 text-start font-mono">{new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(subtotal)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="space-y-2 border-t pt-3">
            <div className="flex justify-between text-muted-foreground">
              <span>المجموع قبل الضريبة</span>
              <span className="font-mono">{new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>ضريبة القيمة المضافة (15%)</span>
              <span className="font-mono">{new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(vat)}</span>
            </div>
            <div className="flex justify-between font-bold text-base border-t pt-2">
              <span>الإجمالي شامل الضريبة</span>
              <span className="font-mono text-primary">{new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(total)}</span>
            </div>
          </div>

          {/* ZATCA Formatting */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-xl bg-muted/30 border border-border/40 mt-4">
            <div className="w-24 h-24 bg-white border border-border/50 rounded-lg flex flex-col items-center justify-center p-2 shrink-0">
              <div
                aria-label="رمز QR لفاتورة ZATCA"
                className="grid h-full w-full grid-cols-5 gap-0.5 rounded bg-white p-1"
                role="img"
              >
                {Array.from({ length: 25 }).map((_, index) => (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "rounded-[1px]",
                      [0, 1, 3, 4, 5, 6, 8, 9, 15, 16, 18, 19, 20, 21, 23, 24].includes(index)
                        ? "bg-foreground"
                        : "bg-muted",
                    )}
                    key={index}
                  />
                ))}
              </div>
              <span className="text-[10px] text-muted-foreground mt-1 font-mono">QR ZATCA</span>
            </div>
            <div className="text-sm text-muted-foreground space-y-2 flex-1 text-center sm:text-start">
              <div className="font-semibold text-foreground">فاتورة ضريبية مبسطة (ZATCA Compliant)</div>
              <div className="text-xs space-y-1">
                <div className="flex justify-between sm:justify-start sm:gap-4 border-b pb-1"><span className="text-muted-foreground/80 w-24">رقم التسجيل الضريبي:</span> <span className="font-mono text-foreground">300000000000003</span></div>
                <div className="flex justify-between sm:justify-start sm:gap-4"><span className="text-muted-foreground/80 w-24">تاريخ الإصدار:</span> <span className="font-mono text-foreground">{inv.date}</span></div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <Button size="sm" className="flex-1" onClick={async () => { await generateZatcaPDF(inv); }}>تنزيل PDF</Button>
            <Button size="sm" variant="outline" className="flex-1" onClick={onClose}>إغلاق</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}