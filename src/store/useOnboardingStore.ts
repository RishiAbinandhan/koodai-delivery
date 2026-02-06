import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ---------- TYPES ---------- */

interface BasicInfo {
  name: string;
  address: string;
  emergency?: string;
  phone: string;
  email: string;
}

interface Permissions {
  cameraAllowed: boolean;
  notificationAllowed: boolean;
  gpsAllowed: boolean;
}

interface Vehicle {
  vehicleType: string;
  plate: string;
  model: string;
  license: string;
}

interface Payment {
  holderName: string;
  accountNo: string;
  ifsc: string;
  upi?: string;
}

/* Spark-plan safe (Base64 KYC) */
interface KYC {
  aadhaarBase64: string;
  panBase64: string;
  licenseBase64: string;
}

/* ---------- STORE STATE ---------- */

interface OnboardingState {
  basicInfo: BasicInfo | null;
  permissions: Permissions | null;
  vehicle: Vehicle | null;
  payment: Payment | null;
  kyc: KYC | null;

  setBasicInfo: (data: BasicInfo) => void;
  setPermissions: (data: Permissions) => void;
  setVehicle: (data: Vehicle) => void;
  setPayment: (data: Payment) => void;
  setKYC: (data: KYC) => void;

  reset: () => void;
}

/* ---------- STORE ---------- */

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      basicInfo: null,
      permissions: null,
      vehicle: null,
      payment: null,
      kyc: null,

      setBasicInfo: (data) => set({ basicInfo: data }),
      setPermissions: (data) => set({ permissions: data }),
      setVehicle: (data) => set({ vehicle: data }),
      setPayment: (data) => set({ payment: data }),
      setKYC: (data) => set({ kyc: data }),

      reset: () =>
        set({
          basicInfo: null,
          permissions: null,
          vehicle: null,
          payment: null,
          kyc: null,
        }),
    }),
    {
      name: "delivery-onboarding", // localStorage key
    }
  )
);