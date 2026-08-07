/**
 * Domain constants shared across features.
 * Centralizing these prevents the status strings and magic numbers
 * that were previously scattered across contexts and views.
 */

/** Order lifecycle statuses as produced by the backend. */
export const ORDER_STATUS = {
  NEW: "NEW",
  PENDING_ACCEPT: "PENDING_ACCEPT",
  ACCEPTED: "ACCEPTED",
  PREPARING: "PREPARING",
  READY: "READY",
  OUT_FOR_DELIVERY: "OUT FOR DELIVERY",
  DELIVERED: "DELIVERED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  REJECTED: "REJECTED",
} as const;

export type OrderStatusValue = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

/** Statuses that mean the order is still live and worth tracking/streaming. */
export const LIVE_ORDER_STATUSES: readonly string[] = [
  ORDER_STATUS.NEW,
  ORDER_STATUS.PENDING_ACCEPT,
  ORDER_STATUS.ACCEPTED,
  ORDER_STATUS.PREPARING,
  ORDER_STATUS.READY,
  ORDER_STATUS.OUT_FOR_DELIVERY,
];

/** Terminal statuses — the order is over and listeners should be closed. */
export const TERMINAL_ORDER_STATUSES: readonly string[] = [
  ORDER_STATUS.COMPLETED,
  ORDER_STATUS.CANCELLED,
  ORDER_STATUS.REJECTED,
  ORDER_STATUS.DELIVERED,
];

/** Statuses reached only after the restaurant has accepted the order. */
export const ACCEPTED_ORDER_STATUSES: readonly string[] = [
  ORDER_STATUS.ACCEPTED,
  ORDER_STATUS.PREPARING,
  ORDER_STATUS.READY,
  ORDER_STATUS.OUT_FOR_DELIVERY,
  ORDER_STATUS.DELIVERED,
  ORDER_STATUS.COMPLETED,
];

/** Statuses that navigate the user to order tracking once reached. */
export const TRACKING_TRIGGER_STATUSES: readonly string[] = [
  ORDER_STATUS.ACCEPTED,
  ORDER_STATUS.PREPARING,
  ORDER_STATUS.READY,
];

/** Default filter state for the restaurant feed (backend applies them). */
export const FILTER_DEFAULTS = {
  maxTime: 60,
  maxDistance: 15,
  minRating: 1,
  dietary: "all",
  offersOnly: false,
  sortBy: "default",
  priceRange: null,
} as const;

/** Pricing constants applied at checkout. */
export const FEES = {
  platformFee: 5,
  taxRate: 0.05,
} as const;

/** Seconds after placing a delivery order during which the customer may cancel it. */
export const CANCEL_WINDOW_SECONDS = 60;

/** Static route paths. */
export const ROUTES = {
  home: "/",
  checkout: "/checkout",
  orderTracking: "/order-tracking",
  location: "/location",
  profile: "/profile",
  rateOrder: "/rate-order",
} as const;
