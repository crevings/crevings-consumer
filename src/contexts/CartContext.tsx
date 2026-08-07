import React, { createContext, useContext, useState, useMemo } from "react";
import { CartItem, MenuItem } from "@/types";
import { consolidateCart } from "@/utils/cartUtils";

interface CartContextType {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  openCheckout: (newCart: CartItem[], items: MenuItem[]) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: React.ReactNode;
  /** Navigation is injected by the router so the provider stays pure. */
  onNavigateToCheckout: () => void;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children, onNavigateToCheckout }) => {
  const [rawCart, setRawCart] = useState<CartItem[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const cart = useMemo(() => consolidateCart(rawCart), [rawCart]);

  const setCart: React.Dispatch<React.SetStateAction<CartItem[]>> = (action) => {
    setRawCart((prev) => {
      const nextCart = typeof action === "function" ? action(prev) : action;
      return consolidateCart(nextCart);
    });
  };

  const openCheckout = (newCart: CartItem[], items: MenuItem[]) => {
    setCart(newCart);
    setMenuItems(items);
    onNavigateToCheckout();
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        menuItems,
        setMenuItems,
        openCheckout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
