import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartItem } from "@/types";
import { useApp } from "./AppContext";

interface CartContextType {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  menuItems: any[];
  setMenuItems: React.Dispatch<React.SetStateAction<any[]>>;
  openCheckout: (newCart: any[], items: any[]) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const { setIsLoadingCheckout } = useApp();
  const navigate = useNavigate();

  const openCheckout = (newCart: any[], items: any[]) => {
    setCart(newCart);
    setMenuItems(items);
    setIsLoadingCheckout(true);
    navigate("/checkout");
    setTimeout(() => setIsLoadingCheckout(false), 2500);
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
