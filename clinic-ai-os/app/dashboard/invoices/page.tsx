import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";

export default function InvoicesPage() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">الفواتير</h1>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          إنشاء فاتورة
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>أحدث الفواتير</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>رقم الفاتورة</TableHead>
                <TableHead>العميل</TableHead>
                <TableHead>التاريخ</TableHead>
                <TableHead>المبلغ</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">INV-2026-001</TableCell>
                <TableCell>أحمد محمد</TableCell>
                <TableCell>2026-05-20</TableCell>
                <TableCell>250 ر.س</TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">مدفوعة</span>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    PDF
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">INV-2026-002</TableCell>
                <TableCell>سارة أحمد</TableCell>
                <TableCell>2026-05-19</TableCell>
                <TableCell>1,500 ر.س</TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">غير مدفوعة</span>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    PDF
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
