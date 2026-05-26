import { create } from 'zustand';

export interface SetupState {
  isSetupComplete: boolean;
  clinicInfo: {
    nameAr: string;
    nameEn: string;
    city: string;
    address: string;
    phone: string;
    workingHours: string;
  };
  doctors: Array<{
    id: string;
    name: string;
    specialty: string;
    schedule: string;
  }>;
  services: Array<{
    id: string;
    name: string;
    price: number;
    duration: number;
  }>;
  aiConfig: {
    provider: 'demo' | 'openai' | 'gemini';
    apiKey: string;
  };
  whatsapp: {
    phoneNumberId: string;
    accessToken: string;
    verifyToken: string;
  };
  completeSetup: () => void;
  updateClinicInfo: (info: Partial<SetupState['clinicInfo']>) => void;
  updateDoctors: (doctors: SetupState['doctors']) => void;
  updateServices: (services: SetupState['services']) => void;
  updateAiConfig: (config: Partial<SetupState['aiConfig']>) => void;
  updateWhatsapp: (config: Partial<SetupState['whatsapp']>) => void;
}

export const useSetupStore = create<SetupState>((set) => ({
  isSetupComplete: false,
  clinicInfo: {
    nameAr: '',
    nameEn: '',
    city: '',
    address: '',
    phone: '',
    workingHours: '',
  },
  doctors: [],
  services: [],
  aiConfig: {
    provider: 'demo',
    apiKey: '',
  },
  whatsapp: {
    phoneNumberId: '',
    accessToken: '',
    verifyToken: '',
  },
  completeSetup: () => set({ isSetupComplete: true }),
  updateClinicInfo: (info) =>
    set((state) => ({ clinicInfo: { ...state.clinicInfo, ...info } })),
  updateDoctors: (doctors) => set({ doctors }),
  updateServices: (services) => set({ services }),
  updateAiConfig: (config) =>
    set((state) => ({ aiConfig: { ...state.aiConfig, ...config } })),
  updateWhatsapp: (config) =>
    set((state) => ({ whatsapp: { ...state.whatsapp, ...config } })),
}));
