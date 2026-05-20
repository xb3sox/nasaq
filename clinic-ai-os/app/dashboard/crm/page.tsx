import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";

export default function CRMPage() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">العملاء</h1>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          إضافة عميل
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="بحث عن عميل..." className="pr-10" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الاسم</TableHead>
                <TableHead>رقم الهاتف</TableHead>
                <TableHead>تاريخ الإضافة</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">أحمد محمد</TableCell>
                <TableCell dir="ltr" className="text-right">+966 50 123 4567</TableCell>
                <TableCell>2026-05-20</TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">حجز مؤكد</span>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">التفاصيل</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">سارة أحمد</TableCell>
                <TableCell dir="ltr" className="text-right">+966 55 987 6543</TableCell>
                <TableCell>2026-05-19</TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">جديد</span>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">التفاصيل</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
