/**
 * Order domain types.
 *
 * `OrderStatus` intentionally mirrors the backend lifecycle values
 * (NEW → PENDING_ACCEPT → ACCEPTED → PREPARING → READY → OUT FOR DELIVERY → DELIVERED)
 * plus the display-mapped variants the UI produces when formatting history.
 */

export type OrderStatus =
  | "NEW"
  | "PENDING_ACCEPT"
  | "ACCEPTED"
  | "PREPARING"
  | "READY"
  | "READY_FOR_PICKUP"
  | "DRIVER_ASSIGNED"
  | "DRIVER_ARRIVED"
  | "OUT FOR DELIVERY"
  | "REACHED_CUSTOMER"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED"
  | "REJECTED"
  // Display-mapped statuses used by the profile/order history UI
  | "Active"
  | "Completed"
  | "Cancelled";

export type OrderType = "Delivery" | "Takeaway" | "Dine-in" | "Booking" | "Booking with Pre-order";

export interface OrderItem {
  name: string;
  quantity: number;
  price?: number;
  id?: string;
}

export interface DeliveryPartner {
  name?: string;
  photo?: string;
  rating?: number | string;
  phone?: string;
}

export interface OrderRatingData {
  deliveryRating?: number;
  restaurantRating?: number;
  itemRatings?: Record<string, number>;
  reviewText?: string;
  selectedTags?: string[];
  mediaFiles?: { url: string; type: "image" | "video" }[];
  date?: string;
}

export interface OrderCustomer {
  name?: string;
  phone?: string;
  address?: string;
}

export interface OrderPayment {
  method?: string;
  status?: string;
}

export interface Review {
  itemsRating: Record<string, number>;
  deliveryRating: number;
  reviewText: string;
  selectedTags: string[];
  mediaFiles: { url: string; type: "image" | "video" }[];
  date: string;
}

/** The order object returned by the place-order API. */
export interface CreatedOrder {
  orderId: string;
  displayOrderId?: string;
  displayOrderNumber?: string;
  items: OrderItem[];
  type?: string;
  status?: string;
  total?: number;
  createdAt?: string;
  pickupOtp?: string;
  customerDetails?: OrderCustomer;
  payment?: OrderPayment;
  restaurantCoordinates?: { lat: number; lng: number } | null;
  deliveryCoordinates?: { lat: number; lng: number } | null;
}

export interface Order {
  customerPin?: string;
  deliveryPartner?: DeliveryPartner | null;
  id: string;
  restaurantName: string;
  location: string;
  rating: number;
  timeEstimate?: string;
  /**
   * Typed line items when the backend sends them structured; legacy
   * comma-joined string (e.g. "2x Chicken Biryani, Gulab Jamun") otherwise.
   * Always read through normalizeOrderItems() — never call .map() directly.
   */
  items: OrderItem[] | string;
  orderDate: string;
  type: OrderType;
  status: OrderStatus;
  price?: number;
  total?: number;
  offer?: string;
  paymentMethod?: string;
  realOrderId?: string;
  displayOrderNumber?: string;
  restaurantId?: string;
  createdAt?: string;
  prepTime?: string;
  pickupOtp?: string;
  restaurantCoordinates?: { lat: number; lng: number } | null;
  deliveryCoordinates?: { lat: number; lng: number } | null;
  isRated?: boolean;
  ratingData?: OrderRatingData | null;
  subtotal?: number;
  tax?: number;
  deliveryFee?: number;
  discount?: number;
  rawItems?: OrderItem[];
  customerDetails?: OrderCustomer;
  customer?: string;
  payment?: OrderPayment;
}
