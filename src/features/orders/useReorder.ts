import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Order, CartItem, MenuItem } from "@/types";
import { normalizeOrderItems } from "@/utils/orderItems";
import { useCart } from "@/contexts/CartContext";
import { useRestaurant } from "@/contexts/RestaurantContext";
import { useRestaurants } from "@/api/restaurant/index";

const REORDER_PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop";

/**
 * Rebuilds a cart from a past order using real line-item prices when the
 * backend provides them. Display-string fallbacks have no real price, so those
 * items are skipped rather than reordering with invented amounts.
 */
export const useReorder = () => {
  const navigate = useNavigate();
  const { setCart, setMenuItems } = useCart();
  const { setSelectedRestaurant } = useRestaurant();
  const { restaurants } = useRestaurants();

  const handleReorder = useCallback(
    (order: Order) => {
      const rawItems = order.rawItems || [];
      const newCart: CartItem[] = [];
      const newMenuItems: MenuItem[] = [];

      normalizeOrderItems(order).forEach((line, index) => {
        const quantity = line.quantity || 1;
        const name = line.name;

        // Prefer the real line-item price; skip items whose price is unknown.
        const real = rawItems.find((it) => it.name === name);
        const unitPrice = real?.price ?? 0;
        if (unitPrice <= 0) return;

        const id = `reorder-${index}`;
        const item: MenuItem = {
          id,
          name,
          price: unitPrice,
          rating: 4.5,
          ratingCount: "0",
          category: "Reorder",
          isVeg: true,
          image: REORDER_PLACEHOLDER_IMAGE,
          description: "",
          available: true,
        };
        newCart.push({ cartItemId: id, item, quantity, totalPrice: unitPrice * quantity });
        newMenuItems.push(item);
      });

      if (newCart.length === 0) return;

      setCart(newCart);
      setMenuItems(newMenuItems);

      const restaurant = restaurants.find((r) => r.name === order.restaurantName);
      if (restaurant) setSelectedRestaurant(restaurant);

      navigate("/checkout");
    },
    [navigate, restaurants, setCart, setMenuItems, setSelectedRestaurant]
  );

  return handleReorder;
};
