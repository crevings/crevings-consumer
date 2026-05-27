import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Restaurant, Order } from "@/types";
import { useApp } from "./AppContext";

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

  // Active order auto-clear effect (from App.tsx line 991)
  useEffect(() => {
    if (activeOrder && activeOrder.type === "Delivery") {
      const timer = setTimeout(() => {
        setActiveOrder(null);
      }, 60000); // 1 minute
      return () => clearTimeout(timer);
    }
  }, [activeOrder]);

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
