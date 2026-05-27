"use client";

import { useSetupStore } from "@/lib/setup-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { DEMO_SERVICES } from "@/lib/demo-data";

export default function ServicesStep() {
  const { services, updateServices } = useSetupStore();

  const addService = () => {
    updateServices([
      ...services,
      { id: Date.now().toString(), name: "", price: 0, duration: 30 },
    ]);
  };

  const removeService = (id: string) => {
    updateServices(services.filter((s) => s.id !== id));
  };

  const updateService = (id: string, field: string, value: string | number) => {
    updateServices(
      services.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const addDemoServices = () => {
    const newServices = DEMO_SERVICES.map(s => ({
      id: s.id,
      name: s.name,
      price: s.price,
      duration: s.durationMin,
    }));
    updateServices([...services, ...newServices]);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-end">
        <Button variant="secondary" size="sm" onClick={addDemoServices}>
          ملء بخدمات تجريبية (أسنان)
        </Button>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-xl">
          لم يتم إضافة خدمات بعد
        </div>
      ) : (
        <div className="space-y-4">
          {services.map((service, index) => (
            <div key={service.id} className="p-4 border rounded-xl space-y-4 relative bg-card">
              <div className="absolute top-4 end-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeService(service.id)}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8"
                  aria-label="حذف الخدمة"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <h4 className="font-semibold text-sm">خدمة #{index + 1}</h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 md:col-span-3">
                  <Label htmlFor={`service-name-${service.id}`}>اسم الخدمة</Label>
                  <Input
                    id={`service-name-${service.id}`}
                    placeholder="تنظيف أسنان"
                    value={service.name}
                    onChange={(e) => updateService(service.id, "name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`service-price-${service.id}`}>السعر (ر.س)</Label>
                  <Input
                    id={`service-price-${service.id}`}
                    type="number"
                    placeholder="250"
                    value={service.price || ""}
                    onChange={(e) => updateService(service.id, "price", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`service-duration-${service.id}`}>المدة (بالدقائق)</Label>
                  <Input
                    id={`service-duration-${service.id}`}
                    type="number"
                    placeholder="30"
                    value={service.duration || ""}
                    onChange={(e) => updateService(service.id, "duration", parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Button onClick={addService} variant="outline" className="w-full border-dashed">
        <Plus className="w-4 h-4 me-2" /> إضافة خدمة
      </Button>
    </div>
  );
}
