import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Order } from "@/types";
import { BASE_URL, get } from "@/api/fetcher";
import { ORDER_STATUS, TERMINAL_ORDER_STATUSES, TRACKING_TRIGGER_STATUSES } from "@/config/constants";
import { createSSEClient } from "@/lib/sse-client";

type SetOrder = React.Dispatch<React.SetStateAction<Order | null>>;

/**
 * Owns the entire lifecycle of the active delivery order:
 * - loads the active order from the server on mount,
 * - opens an SSE live-status stream for the current order and redirects to
 *   the tracking screen when the restaurant accepts it,
 * - closes the stream at terminal states and auto-clears the active order a
 *   few seconds after it completes.
 *
 * Keeps EventSource connections and navigation side effects out of the
 * provider, which now only stores state.
 */
export const useActiveOrderLifecycle = (
  activeOrder: Order | null,
  setActiveOrder: SetOrder
) => {
  const navigate = useNavigate();

  // Load and sync active order dynamically with server
  useEffect(() => {
    let cancelled = false;
    const fetchActiveOrder = async () => {
      try {
        const res = await get<{ success: boolean; order?: Order | null }>(
          "/consumer/profile/orders/active"
        );
        if (cancelled) return;
        if (res && res.success && res.order) {
          const status = (res.order.status || "").toUpperCase();
          if (TERMINAL_ORDER_STATUSES.includes(status)) {
            setActiveOrder(null);
          } else {
            setActiveOrder(res.order);
          }
        } else {
          setActiveOrder(null);
        }
      } catch (err) {
        if (!cancelled) {
          setActiveOrder(null);
        }
        console.error("Error loading active order:", err);
      }
    };

    fetchActiveOrder();
    const interval = setInterval(fetchActiveOrder, 5000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [setActiveOrder]);

  // Listen to active order status updates to redirect to tracking page
  // dynamically when accepted or update state
  useEffect(() => {
    if (!activeOrder || activeOrder.type !== "Delivery") return;

    const orderId = activeOrder.realOrderId || activeOrder.id;
    const restaurantId = activeOrder.restaurantId;
    if (!orderId || !restaurantId) return;

    // If order is already completed, cancelled, or rejected, don't listen
    const status = (activeOrder.status || ORDER_STATUS.NEW).toUpperCase();
    if (TERMINAL_ORDER_STATUSES.includes(status)) {
      return;
    }

    const sseClient = createSSEClient({
      url: `${BASE_URL}/consumer/restaurants/${restaurantId}/orders/${orderId}/live`,
      events: {
        message: (data: any) => {
          if (data.status) {
            const upperStatus = data.status.toUpperCase();
            setActiveOrder((prev) => {
              if (!prev) return null;
              if (prev.status !== data.status) {
                if (
                  (prev.status === ORDER_STATUS.NEW || prev.status === ORDER_STATUS.PENDING_ACCEPT) &&
                  TRACKING_TRIGGER_STATUSES.includes(data.status)
                ) {
                  setTimeout(() => {
                    navigate("/order-tracking");
                  }, 0);
                }
                return { ...prev, status: data.status };
              }
              return prev;
            });

            if (TERMINAL_ORDER_STATUSES.includes(upperStatus)) {
              sseClient.close();
            }
          }
        },
      },
      maxRetries: 20,
    });

    sseClient.connect();

    return () => {
      sseClient.close();
    };
  }, [activeOrder?.id, navigate, setActiveOrder]);

  // Auto-clear active order once it reaches completed, cancelled, or rejected state
  useEffect(() => {
    if (activeOrder) {
      const status = (activeOrder.status || ORDER_STATUS.NEW).toUpperCase();
      if (TERMINAL_ORDER_STATUSES.includes(status)) {
        const timer = setTimeout(() => {
          setActiveOrder(null);
        }, 3000); // Wait 3 seconds so user can see it's complete/delivered, then disappear
        return () => clearTimeout(timer);
      }
    }
  }, [activeOrder?.status, setActiveOrder]);
};
