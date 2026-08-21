import { useState, useEffect, useRef } from "react";
import { Order, DeliveryPartner } from "@/types";
import { CANCEL_WINDOW_SECONDS } from "@/config/constants";
import { BASE_URL, post } from "@/api/fetcher";
import { createSSEClient } from "@/lib/sse-client";

interface UseOrderLiveUpdatesOptions {
  onOrderComplete: () => void;
  onCancelOrder?: () => void;
}

/**
 * Owns the live state of an in-progress order: the SSE stream from the
 * restaurant/partner, derived progress, cancel-window timers and the cancel
 * API call. Extracted from OrderTrackingView so the view stays presentational.
 */
export const useOrderLiveUpdates = (order: Order, { onOrderComplete, onCancelOrder }: UseOrderLiveUpdatesOptions) => {
  const [progress, setProgress] = useState(0);
  const [deliveryPin, setDeliveryPin] = useState(order.customerPin || order.pickupOtp || "");
  const [cancelTimeLeft, setCancelTimeLeft] = useState(() => {
    if (order.type !== "Delivery") return 0;
    if (!order.createdAt) return CANCEL_WINDOW_SECONDS;
    const createdTime = new Date(order.createdAt).getTime();
    const now = new Date().getTime();
    const secondsElapsed = Math.floor((now - createdTime) / 1000);
    const timeLeft = CANCEL_WINDOW_SECONDS - secondsElapsed;
    return timeLeft > 0 ? timeLeft : 0;
  });
  const [isCancelled, setIsCancelled] = useState(order.status === "Cancelled");
  const [isCancellingOrder, setIsCancellingOrder] = useState(false);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [showAcceptedBanner, setShowAcceptedBanner] = useState(false);
  const [orderStatus, setOrderStatus] = useState<string>(order.status || "NEW");
  const [assignedPartner, setAssignedPartner] = useState<DeliveryPartner | null>(order.deliveryPartner || null);
  const [secondsElapsed, setSecondsElapsed] = useState(() => {
    if (!order.createdAt) return 0;
    const createdTime = new Date(order.createdAt).getTime();
    const now = new Date().getTime();
    return Math.max(0, Math.floor((now - createdTime) / 1000));
  });
  const [prepTime, setPrepTime] = useState<string>(order.prepTime || order.timeEstimate || "");
  const [driverLocation, setDriverLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Keep the latest completion callback in a ref so the SSE handler never
  // captures a stale inline function (and the stream doesn't need reconnecting).
  const onOrderCompleteRef = useRef(onOrderComplete);
  useEffect(() => {
    onOrderCompleteRef.current = onOrderComplete;
  }, [onOrderComplete]);

  // Live SSE stream: partner location, PIN, status transitions.
  useEffect(() => {
    const restaurantId = order.restaurantId;
    const orderId = order.realOrderId || order.id;

    if (!orderId || !restaurantId) return;

    const sseClient = createSSEClient({
      url: `${BASE_URL}/consumer/restaurants/${restaurantId}/orders/${orderId}/live`,
      events: {
        message: (data: any) => {
          if (data.customerPin) {
            setDeliveryPin(data.customerPin);
          }
          if (data.deliveryPartner) {
            setAssignedPartner(data.deliveryPartner);
          }
          if (data.lat && data.lng) {
            setDriverLocation({ lat: Number(data.lat), lng: Number(data.lng) });
          }
          if (data.status) {
            // Location-only and informational pings — DRIVER_LOCATION fires on
            // every driver movement and NO_DRIVERS_AVAILABLE is a search notice —
            // must not overwrite the lifecycle status. Doing so falls through the
            // progress switch's default (progress -> 0, timeline resets) and leaks
            // the raw status code into the UI.
            if (data.status !== "DRIVER_LOCATION" && data.status !== "NO_DRIVERS_AVAILABLE") {
              const STATUS_RANK: Record<string, number> = {
                "NEW": 0, "PENDING_ACCEPT": 1, "ACCEPTED": 2, "PREPARING": 3,
                "READY": 4, "READY_FOR_PICKUP": 4,
                "DRIVER_ASSIGNED": 5, "DRIVER_ARRIVED": 6,
                "OUT FOR DELIVERY": 7, "OUT_FOR_DELIVERY": 7, "ORDER_PICKED_UP": 7,
                "REACHED_CUSTOMER": 8, "ARRIVING_SOON": 8,
                "DELIVERED": 9, "COMPLETED": 10,
                "CANCELLED": 99, "REJECTED": 99,
              };
              setOrderStatus((prev) => {
                const prevRank = STATUS_RANK[prev] ?? -1;
                const nextRank = STATUS_RANK[data.status] ?? -1;

                // Block regression: don't let a lower-rank status overwrite a higher one
                // (except terminal statuses like CANCELLED/COMPLETED which always apply)
                if (nextRank < prevRank && nextRank < 99) {
                  return prev;
                }

                if ((data.status === "PREPARING" || data.status === "ACCEPTED") && (prev === "NEW" || prev === "PENDING_ACCEPT")) {
                  setShowAcceptedBanner(true);
                }
                return data.status;
              });

              // Any status change away from NEW means the 60s cancellation window has completed or ended
              if (data.status !== "NEW") {
                setCancelTimeLeft(0);
              }
            }
            if (data.status === "CANCELLED") {
              setIsCancelled(true);
              if (data.reason) {
                setRejectionReason(data.reason);
              }
            }
            if (data.status === "COMPLETED") {
              // Takeaway orders only finish when the CONSUMER confirms the
              // pickup PIN (handlePickupComplete in OrderTrackingView) — the
              // restaurant/partner can mark the order complete server-side, but
              // the consumer must enter the PIN first. So don't auto-complete
              // (and auto-redirect to rating) for Takeaway here; Delivery still
              // completes automatically when the rider marks it delivered.
              if (order.type !== "Takeaway") {
                onOrderCompleteRef.current();
              }
            }
          }
          if (data.prepTime) {
            setPrepTime(data.prepTime);
          }
        },
      },
      maxRetries: 30,
    });

    sseClient.connect();

    return () => {
      sseClient.close();
    };
  }, [order.id, order.realOrderId, order.restaurantId, order.type]);

  // Derive progress from the current status.
  useEffect(() => {
    let computedProgress = 0;
    switch (orderStatus) {
      case "NEW":
      case "PENDING_ACCEPT":
        computedProgress = 10;
        break;
      case "PREPARING":
        computedProgress = 30;
        break;
      case "ACCEPTED":
      case "DRIVER_ASSIGNED":
        computedProgress = 55;
        break;
      case "READY":
      case "READY_FOR_PICKUP":
        computedProgress = 45;
        break;
      case "DRIVER_ARRIVED":
        computedProgress = 60;
        break;
      case "OUT FOR DELIVERY":
      case "ORDER_PICKED_UP":
        computedProgress = 75;
        break;
      case "REACHED_CUSTOMER":
      case "ARRIVING_SOON":
        computedProgress = 90;
        break;
      case "COMPLETED":
      case "DELIVERED":
        computedProgress = 100;
        break;
      default:
        // Auxiliary statuses (DRIVER_LOCATION, NO_DRIVERS_AVAILABLE) carry no
        // progression — keep the last progress so the timeline never resets.
        return;
    }
    setProgress(computedProgress);
  }, [orderStatus]);

  useEffect(() => {
    if (isCancelled && onCancelOrder) {
      onCancelOrder();
    }
  }, [isCancelled, onCancelOrder]);

  // Countdown for the 60-second cancellation window:
  // Derived directly from the order creation timestamp to prevent clock drift.
  useEffect(() => {
    if (isCancelled || orderStatus !== "NEW") {
      setCancelTimeLeft(0);
      return;
    }

    const timer = setInterval(() => {
      if (!order.createdAt) {
        setCancelTimeLeft(0);
        return;
      }
      const createdTime = new Date(order.createdAt).getTime();
      const now = Date.now();
      const elapsed = Math.floor((now - createdTime) / 1000);
      const remaining = CANCEL_WINDOW_SECONDS - elapsed;
      setCancelTimeLeft(remaining > 0 ? remaining : 0);
    }, 1000);

    return () => clearInterval(timer);
  }, [isCancelled, orderStatus, order.createdAt]);

  // Track elapsed seconds since order creation
  useEffect(() => {
    if (!order.createdAt) return;
    const timer = setInterval(() => {
      const createdTime = new Date(order.createdAt!).getTime();
      const now = Date.now();
      setSecondsElapsed(Math.max(0, Math.floor((now - createdTime) / 1000)));
    }, 1000);
    return () => clearInterval(timer);
  }, [order.createdAt]);

  // Cancel order API call
  const cancelOrder = async () => {
    if (isCancellingOrder) return;
    setIsCancellingOrder(true);
    try {
      await post(`/consumer/restaurants/${order.restaurantId}/orders/${order.realOrderId || order.id}/cancel`, {});
      setIsCancelled(true);
      setRejectionReason("Cancelled by you");
    } catch (err: any) {
      console.error("Failed to cancel order:", err);
      throw err;
    } finally {
      setIsCancellingOrder(false);
    }
  };

  return {
    progress,
    deliveryPin,
    cancelTimeLeft,
    isCancelled,
    isCancellingOrder,
    rejectionReason,
    showAcceptedBanner,
    setShowAcceptedBanner,
    orderStatus,
    assignedPartner,
    secondsElapsed,
    prepTime,
    driverLocation,
    cancelOrder,
    handleCancelOrderApi: cancelOrder,
  };
};
