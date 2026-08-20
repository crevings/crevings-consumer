export interface FilterOptions {
  maxTime: number;
  maxDistance: number;
  minRating: number | null;
  dietary: "all" | "veg" | "non-veg" | "egg";
  offersOnly: boolean;
  sortBy?: "default" | "priceLow" | "priceHigh" | "ratingHigh" | "ratingLow" | "distanceNear" | "distanceFar";
  priceRange?: "under49" | "49to99" | null;
}

/**
 * The backend may serve `address` as either a display string or an object
 * carrying a `coordinates` pair (GeoJSON [lng, lat] order).
 */
export interface DeliveryFeeSlab {
  minKm: number;
  maxKm: number;
  fee: number;
}

export interface RestaurantAddress {
  coordinates?: [number, number] | { coordinates: [number, number] };
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  ratingCount?: string;
  time: string;
  timeValue: number;
  price: string;
  images: string[];
  distance: string;
  distanceValue: number;
  offer?: string;
  /** Ongoing offers for this branch, formatted for the under-card offer rail. */
  offers?: string[];
  dietary: string[];
  address?: string | RestaurantAddress;
  phone?: string;
  openingHours?: string;
  facilities?: string[];
  fssaiNo?: string;
  gstin?: string;
  registeredName?: string;
  deliveryFee?: number;
  deliveryFeeSlabs?: DeliveryFeeSlab[];
  isOnline?: boolean;
  isOpen?: boolean;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  image: string;
}

export interface Offer {
  offerId: string;
  restaurantId: string;
  name: string;
  offerType: "percentage" | "flat" | "bogo" | "free_item";
  discountPercent?: number;
  maxCap?: number;
  discountAmount?: number;
  freeItemName?: string;
  applicableScope: "all" | "category" | "items";
  applicableIds: string[];
  customerType: "all" | "new" | "returning";
  orderTypes: {
    delivery: boolean;
    takeaway: boolean;
    dineIn: boolean;
  };
  paymentMode: "all" | "prepaid";
  allowClubbing: boolean;
  minOrder?: number;
  perUserLimit?: number;
  totalUsageLimit?: number;
  startDate?: string;
  endDate?: string;
  status: "Active" | "Paused" | "Scheduled" | "Expired";
}
