import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Restaurant, Order } from "@/types";
import { useApp } from "./AppContext";
import { BASE_URL } from "../api/fetcher";

interface RestaurantContextType {
  selectedRestaurant: Restaurant | null;
  setSelectedRestaurant: React.Dispatch<React.SetStateAction<Restaurant | null>>;
  selectedCollection: any | null;
  setSelectedCollection: React.Dispatch<React.SetStateAction<any | null>>;
  selectedCategory: string | null;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | null>>;
  hiddenRestaurantIds: string[];
  setHiddenRestaurantIds: React.Dispatch<React.SetStateAction<string[]>>;
  favouriteRestaurantIds: string[];
  setFavouriteRestaurantIds: React.Dispatch<React.SetStateAction<string[]>>;
  confirmModal: { type: "favourite" | "hide"; restaurantId: string } | null;
  setConfirmModal: React.Dispatch<React.SetStateAction<{ type: "favourite" | "hide"; restaurantId: string } | null>>;
  activeOrder: Order | null;
  setActiveOrder: React.Dispatch<React.SetStateAction<Order | null>>;
  selectedOrder: Order | null;
  setSelectedOrder: React.Dispatch<React.SetStateAction<Order | null>>;
  autoAddItem: string | null;
  setAutoAddItem: React.Dispatch<React.SetStateAction<string | null>>;
  openRestaurantDetail: (rest: Restaurant, itemId?: string) => void;
  handleItemAdd: (rest: Restaurant, itemId: string) => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<any | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hiddenRestaurantIds, setHiddenRestaurantIds] = useState<string[]>([]);
  const [favouriteRestaurantIds, setFavouriteRestaurantIds] = useState<string[]>([]);
  const [confirmModal, setConfirmModal] = useState<{ type: "favourite" | "hide"; restaurantId: string } | null>(null);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [autoAddItem, setAutoAddItem] = useState<string | null>(null);

  const { setIsLoadingRestaurant } = useApp();
  const navigate = useNavigate();

  const openRestaurantDetail = (rest: Restaurant, itemId?: string) => {
    setSelectedRestaurant(rest);
    if (itemId) setAutoAddItem(itemId);
    setIsLoadingRestaurant(true);
    navigate(`/restaurant/${rest.id}`);
    setTimeout(() => setIsLoadingRestaurant(false), 2500);
  };

  const handleItemAdd = (rest: Restaurant, itemId: string) => {
    openRestaurantDetail(rest, itemId);
  };

  // Listen to active order status updates to redirect to tracking page dynamically when accepted or update state
  useEffect(() => {
    if (!activeOrder || activeOrder.type !== "Delivery") return;

    const orderId = activeOrder.realOrderId || activeOrder.id;
    const restaurantId = activeOrder.restaurantId;
    if (!orderId || !restaurantId) return;

    // If order is already completed, cancelled, or rejected, don't listen
    const status = (activeOrder.status || 'NEW').toUpperCase();
    if (['COMPLETED', 'CANCELLED', 'REJECTED', 'DELIVERED'].includes(status)) {
      return;
    }

    const eventSource = new EventSource(
      `${BASE_URL}/consumer/restaurants/${restaurantId}/orders/${orderId}/live`,
      { withCredentials: true }
    );

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.status) {
          const upperStatus = data.status.toUpperCase();
          setActiveOrder(prev => {
            if (!prev) return null;
            if (prev.status !== data.status) {
              if (['NEW', 'PENDING_ACCEPT'].includes(prev.status) && ['ACCEPTED', 'PREPARING', 'READY'].includes(data.status)) {
                setTimeout(() => {
                  navigate("/order-tracking");
                }, 0);
              }
              return { ...prev, status: data.status };
            }
            return prev;
          });

          if (['COMPLETED', 'CANCELLED', 'REJECTED', 'DELIVERED'].includes(upperStatus)) {
            eventSource.close();
          }
        }
      } catch (err) {
        console.error("Error parsing live status in context:", err);
      }
    };

    return () => {
      eventSource.close();
    };
  }, [activeOrder?.id, navigate]);

  // Auto-clear active order once it reaches completed, cancelled, or rejected state
  useEffect(() => {
    if (activeOrder) {
      const status = (activeOrder.status || 'NEW').toUpperCase();
      if (['COMPLETED', 'CANCELLED', 'REJECTED', 'DELIVERED'].includes(status)) {
        const timer = setTimeout(() => {
          setActiveOrder(null);
        }, 3000); // Wait 3 seconds so user can see it's complete/delivered, then disappear
        return () => clearTimeout(timer);
      }
    }
  }, [activeOrder?.status]);

  // Load active order on mount from the server
  useEffect(() => {
    const fetchActiveOrder = async () => {
      try {
        const response = await fetch(`${BASE_URL}/consumer/profile/orders/active`, {
          credentials: "include"
        });
        if (response.ok) {
          const res = await response.json();
          if (res.success && res.order) {
            setActiveOrder(res.order);
          }
        }
      } catch (err) {
        console.error("Error loading active order on mount:", err);
      }
    };
    fetchActiveOrder();
  }, []);

  return (
    <RestaurantContext.Provider
      value={{
        selectedRestaurant,
        setSelectedRestaurant,
        selectedCollection,
        setSelectedCollection,
        selectedCategory,
        setSelectedCategory,
        hiddenRestaurantIds,
        setHiddenRestaurantIds,
        favouriteRestaurantIds,
        setFavouriteRestaurantIds,
        confirmModal,
        setConfirmModal,
        activeOrder,
        setActiveOrder,
        selectedOrder,
        setSelectedOrder,
        autoAddItem,
        setAutoAddItem,
        openRestaurantDetail,
        handleItemAdd,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error("useRestaurant must be used within a RestaurantProvider");
  }
  return context;
};
