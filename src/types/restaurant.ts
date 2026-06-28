export interface FilterOptions {
  maxTime: number;
  maxDistance: number;
  minRating: number;
  dietary: 'all' | 'veg' | 'non-veg' | 'egg';
  offersOnly: boolean;
  sortBy?: 'default' | 'priceLow' | 'priceHigh' | 'ratingHigh' | 'ratingLow' | 'distanceNear' | 'distanceFar';
  priceRange?: 'under49' | '49to99' | null;
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
  dietary: string[];
  address?: string;
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
  description?: string;
  offerType: 'percentage' | 'flat' | 'bogo' | 'free_item';
  discountPercent?: number;
  maxCap?: number;
  discountAmount?: number;
  freeItemName?: string;
  applicableScope: 'all' | 'category' | 'items';
  applicableIds: string[];
  customerType: 'all' | 'new' | 'returning';
  orderTypes: {
    delivery: boolean;
    takeaway: boolean;
    dineIn: boolean;
  };
  paymentMode: 'all' | 'prepaid';
  allowClubbing: boolean;
  minOrder?: number;
  startDate?: string;
  endDate?: string;
  status: 'Active' | 'Paused' | 'Scheduled' | 'Expired';
}

