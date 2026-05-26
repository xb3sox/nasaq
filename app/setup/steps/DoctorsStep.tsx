"use client";

import { useSetupStore } from "@/lib/setup-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

export default function DoctorsStep() {
  const { doctors, updateDoctors } = useSetupStore();

  const addDoctor = () => {
    updateDoctors([
      ...doctors,
      { id: Date.now().toString(), name: "", specialty: "", schedule: "" },
    ]);
  };

  const removeDoctor = (id: string) => {
    updateDoctors(doctors.filter((d) => d.id !== id));
  };

  const updateDoctor = (id: string, field: string, value: string) => {
    updateDoctors(
      doctors.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {doctors.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-xl">
          لم يتم إضافة أطباء بعد
        </div>
      ) : (
        <div className="space-y-4">
          {doctors.map((doctor, index) => (
            <div key={doctor.id} className="p-4 border rounded-xl space-y-4 relative bg-card">
              <div className="absolute top-4 end-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeDoctor(doctor.id)}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <h4 className="font-semibold text-sm">طبيب #{index + 1}</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`doctor-name-${doctor.id}`}>اسم الطبيب</Label>
                  <Input
                    id={`doctor-name-${doctor.id}`}
                    placeholder="د. أحمد محمد"
                    value={doctor.name}
                    onChange={(e) => updateDoctor(doctor.id, "name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`doctor-specialty-${doctor.id}`}>التخصص</Label>
                  <Input
                    id={`doctor-specialty-${doctor.id}`}
                    placeholder="طب أسنان عام"
                    value={doctor.specialty}
                    onChange={(e) => updateDoctor(doctor.id, "specialty", e.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor={`doctor-schedule-${doctor.id}`}>جدول العمل</Label>
                  <Input
                    id={`doctor-schedule-${doctor.id}`}
                    placeholder="الأحد - الخميس (4م - 10م)"
                    value={doctor.schedule}
                    onChange={(e) => updateDoctor(doctor.id, "schedule", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Button onClick={addDoctor} variant="outline" className="w-full border-dashed">
        <Plus className="w-4 h-4 me-2" /> إضافة طبيب
      </Button>
    </div>
  );
}
