
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  rating: number;
  ratingCount: string;
  image: string;
  isVeg: boolean;
  isEgg?: boolean;
  description?: string;
  category: string;
  bestseller?: boolean;
  spicy?: boolean;
  available?: boolean;
  hasOffer?: boolean;
  servingSize?: string;
  piecesInfo?: string;
}

export interface CartItem {
  cartItemId: string;
  item: MenuItem;
  quantity: number;
  variant?: { id: string; name: string; price: number };
  selectedAddons?: { id: string; name: string; price: number; quantity: number }[];
  selectedSides?: { id: string; name: string; price: number; quantity: number }[];
  totalPrice: number;
}

export type OrderStatus = 'Active' | 'Completed' | 'Cancelled';
export type OrderType = 'Delivery' | 'Takeaway' | 'Dine-in' | 'Booking' | 'Booking with Pre-order';

export interface Review {
  itemsRating: Record<string, number>;
  deliveryRating: number;
  reviewText: string;
  selectedTags: string[];
  mediaFiles: { url: string; type: 'image' | 'video' }[];
  date: string;
}

export interface Order {
  id: string;
  restaurantName: string;
  location: string;
  rating: number;
  timeEstimate?: string;
  items: string;
  orderDate: string;
  type: OrderType;
  status: OrderStatus;
  price?: number;
  total?: number;
  offer?: string;
  paymentMethod?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export interface Transaction {
  id: string;
  title: string;
  description: string;
  amount: number;
  date: string;
  type: 'credit' | 'debit';
  expiryDate?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  image: string | null;
}

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
