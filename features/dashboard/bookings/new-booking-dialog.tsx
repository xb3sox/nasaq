"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEMO_DOCTORS, DEMO_SERVICES } from "@/lib/demo-data";
import { Plus, Loader2 } from "lucide-react";

export function NewBookingDialog({ onAdd }: { onAdd: () => void }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800)); // simulate
    setSaving(false);
    setOpen(false);
    onAdd();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button size="touch" className="gap-1.5">
          <Plus className="w-4 h-4" />
          حجز جديد
        </Button>
      } />
      <DialogContent className="max-w-md" dir="rtl">
        <DialogTitle>إضافة حجز جديد</DialogTitle>
        <DialogDescription className="sr-only">قم بتعبئة بيانات العميل والخدمة لإضافة حجز جديد.</DialogDescription>
        <div className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label>اسم العميل</Label>
            <Input placeholder="مثال: نورة المحمد" size="touch" />
          </div>
          <div className="space-y-1.5">
            <Label>رقم الجوال</Label>
            <Input placeholder="+966 5XX XXX XXXX" dir="ltr" size="touch" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>الخدمة</Label>
              <Select>
                <SelectTrigger size="touch"><SelectValue placeholder="اختر الخدمة" /></SelectTrigger>
                <SelectContent>
                  {DEMO_SERVICES.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name} — {s.price} ر.س</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>الطبيب</Label>
              <Select>
                <SelectTrigger size="touch"><SelectValue placeholder="اختر الطبيب" /></SelectTrigger>
                <SelectContent>
                  {DEMO_DOCTORS.map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>التاريخ</Label>
              <Input type="date" size="touch" />
            </div>
            <div className="space-y-1.5">
              <Label>الوقت</Label>
              <Input type="time" size="touch" />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button size="touch" className="flex-1" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin ms-1" /> : null}
              حفظ الحجز
            </Button>
            <Button variant="outline" size="touch" className="flex-1" onClick={() => setOpen(false)}>إلغاء</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
