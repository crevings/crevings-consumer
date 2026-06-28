export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  image: string | null;
}

export interface SavedAddress {
  id: string;
  type: string;
  icon: any;
  address: string;
  building?: string;
  street?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  isDefault: boolean;
}
