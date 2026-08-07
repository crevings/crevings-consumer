import type { LucideIcon } from "lucide-react";

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  image: string | null;
}

/** Minimal authenticated-user shape returned by the auth endpoints. */
export interface AuthUser {
  name: string;
  email: string;
  phone: string;
  gender?: string;
  dob?: string;
  profileImage?: string | null;
}

export interface SavedAddress {
  id: string;
  type: string;
  icon?: LucideIcon;
  address: string;
  building?: string;
  street?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  isDefault: boolean;
}
