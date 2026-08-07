import React, { createContext, useContext, useState } from "react";
import { Restaurant, Collection, Order } from "@/types";
import { useActiveOrderLifecycle } from "@/hooks/useActiveOrderLifecycle";

interface RestaurantContextType {
  selectedRestaurant: Restaurant | null;
  setSelectedRestaurant: React.Dispatch<React.SetStateAction<Restaurant | null>>;
  selectedCollection: Collection | null;
  setSelectedCollection: React.Dispatch<React.SetStateAction<Collection | null>>;
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

interface RestaurantProviderProps {
  children: React.ReactNode;
  /** Navigation is injected by the router so the provider stays pure. */
  navigateToRestaurant: (id: string) => void;
}

export const RestaurantProvider: React.FC<RestaurantProviderProps> = ({ children, navigateToRestaurant }) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hiddenRestaurantIds, setHiddenRestaurantIds] = useState<string[]>([]);
  const [favouriteRestaurantIds, setFavouriteRestaurantIds] = useState<string[]>([]);
  const [confirmModal, setConfirmModal] = useState<{ type: "favourite" | "hide"; restaurantId: string } | null>(null);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [autoAddItem, setAutoAddItem] = useState<string | null>(null);

  // Live-status stream, tracking redirect, auto-clear and initial fetch all
  // live in this hook so the provider stays a pure state container. The only
  // navigation left here is the user-initiated "open restaurant detail" action.
  useActiveOrderLifecycle(activeOrder, setActiveOrder);

  const openRestaurantDetail = (rest: Restaurant, itemId?: string) => {
    setSelectedRestaurant(rest);
    if (itemId) setAutoAddItem(itemId);
    navigateToRestaurant(rest.id);
  };

  const handleItemAdd = (rest: Restaurant, itemId: string) => {
    openRestaurantDetail(rest, itemId);
  };

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
