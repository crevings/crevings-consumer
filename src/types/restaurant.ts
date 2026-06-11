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
  [x: string]: string;
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
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  image: string;
}
