import { useState, useEffect, useRef } from "react";
import { Order, DeliveryPartner } from "@/types";
import { CANCEL_WINDOW_SECONDS } from "@/config/constants";
import { BASE_URL, post } from "@/api/fetcher";

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

    const eventSource = new EventSource(
      `${BASE_URL}/consumer/restaurants/${restaurantId}/orders/${orderId}/live`,
      { withCredentials: true }
    );

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
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
            setOrderStatus((prev) => {
              if ((data.status === "PREPARING" || data.status === "ACCEPTED") && (prev === "NEW" || prev === "PENDING_ACCEPT")) {
                setShowAcceptedBanner(true);
              }
              return data.status;
            });
          }
          if (data.status !== "NEW") {
            setCancelTimeLeft(0);
          }
          if (data.status === "CANCELLED") {
            setIsCancelled(true);
            if (data.reason) {
              setRejectionReason(data.reason);
            }
          }
          if (data.status === "COMPLETED") {
            onOrderCompleteRef.current();
          }
        }
        if (data.prepTime) {
          setPrepTime(data.prepTime);
        }
      } catch (err) {
        console.error("Error parsing SSE status message:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE Connection Error:", err);
    };

    return () => {
      eventSource.close();
    };
  }, [order.id, order.realOrderId, order.restaurantId]);

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

  // Countdown for the 60-second cancellation window.
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (cancelTimeLeft > 0 && !isCancelled) {
      timer = setInterval(() => {
        setCancelTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [cancelTimeLeft, isCancelled]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCancelOrderApi = async () => {
    if (isCancellingOrder) return;
    setIsCancellingOrder(true);
    try {
      const result = await post<{ success: boolean; message?: string }>(
        `/consumer/restaurants/${order.restaurantId}/orders/${order.realOrderId || order.id}/cancel`,
        {}
      );
      if (result.success) {
        setIsCancelled(true);
      } else {
        alert(result.message || "Failed to cancel order.");
      }
    } catch {
      alert("Failed to cancel order due to network issue.");
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
    handleCancelOrderApi,
  };
};
