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
  realOrderId?: string;
  restaurantId?: string;
  createdAt?: string;
  prepTime?: string;
  pickupOtp?: string;
  restaurantCoordinates?: { lat: number; lng: number } | null;
  deliveryCoordinates?: { lat: number; lng: number } | null;
}
