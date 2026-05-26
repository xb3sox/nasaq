"use client";

import { useSetupStore } from "@/lib/setup-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function ClinicInfoStep() {
  const { clinicInfo, updateClinicInfo } = useSetupStore();

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nameAr">اسم العيادة (بالعربية)</Label>
          <Input 
            id="nameAr" 
            placeholder="مثال: عيادات النخبة" 
            value={clinicInfo.nameAr}
            onChange={(e) => updateClinicInfo({ nameAr: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nameEn">اسم العيادة (بالإنجليزية)</Label>
          <Input 
            id="nameEn" 
            placeholder="e.g. Elite Clinics" 
            dir="ltr"
            value={clinicInfo.nameEn}
            onChange={(e) => updateClinicInfo({ nameEn: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">المدينة</Label>
          <Input 
            id="city" 
            placeholder="الرياض" 
            value={clinicInfo.city}
            onChange={(e) => updateClinicInfo({ city: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">رقم الهاتف</Label>
          <Input 
            id="phone" 
            placeholder="05X XXX XXXX" 
            dir="ltr"
            value={clinicInfo.phone}
            onChange={(e) => updateClinicInfo({ phone: e.target.value })}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">العنوان بالتفصيل</Label>
          <Input 
            id="address" 
            placeholder="حي الملقا، طريق الملك فهد" 
            value={clinicInfo.address}
            onChange={(e) => updateClinicInfo({ address: e.target.value })}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="workingHours">ساعات العمل</Label>
          <Input 
            id="workingHours" 
            placeholder="من الأحد إلى الخميس، 9 صباحاً - 9 مساءً" 
            value={clinicInfo.workingHours}
            onChange={(e) => updateClinicInfo({ workingHours: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
