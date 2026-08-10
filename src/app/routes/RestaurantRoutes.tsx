import React from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { RestaurantDetailView } from "@/features/restaurant/RestaurantDetailView";
import { useRestaurants } from "@/api/restaurant/index";
import { useRestaurant } from "@/contexts/RestaurantContext";
import { useCart } from "@/contexts/CartContext";
import { PageLoader } from "@/shared/components/PageLoader";

/**
 * Resolves the restaurant from the feed by :id and exposes it as the
 * context-wide `selectedRestaurant` (shared with the header / cart flows).
 */
function useSelectedRestaurant(id: string | undefined) {
  const { restaurants, isLoading } = useRestaurants();
  const { selectedRestaurant, setSelectedRestaurant } = useRestaurant();

  React.useEffect(() => {
    if (!selectedRestaurant && restaurants.length > 0 && id) {
      const found = restaurants.find((r) => String(r.id) === id);
      if (found) setSelectedRestaurant(found);
    }
  }, [id, restaurants, selectedRestaurant, setSelectedRestaurant]);

  return { restaurants, selectedRestaurant, isLoading };
}

export const RestaurantDetailRoute: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { restaurants, selectedRestaurant, isLoading } = useSelectedRestaurant(id);
  const {
    favouriteRestaurantIds,
    setFavouriteRestaurantIds,
    hiddenRestaurantIds,
    setHiddenRestaurantIds,
    autoAddItem,
    setConfirmModal,
  } = useRestaurant();
  const { setCart, setMenuItems } = useCart();

  if (selectedRestaurant) {
    return (
      <RestaurantDetailView
        restaurant={selectedRestaurant}
        // History-aware back: return to wherever the user came from (feed,
        // search, category, under-99 page); fall back to home on deep links.
        onBack={() => (window.history.length > 1 ? navigate(-1) : navigate("/"))}
        onCheckout={(cart, items) => {
          setCart(cart);
          setMenuItems(items);
          navigate("/checkout");
        }}
        onHide={() => setConfirmModal({ type: "hide", restaurantId: String(selectedRestaurant.id) })}
        onUnhide={() => setHiddenRestaurantIds((prev) => prev.filter((hid) => hid !== String(selectedRestaurant.id)))}
        onFavourite={() =>
          setFavouriteRestaurantIds((prev) =>
            prev.includes(String(selectedRestaurant.id))
              ? prev
              : [...prev, String(selectedRestaurant.id)]
          )
        }
        onRemoveFavourite={() => setFavouriteRestaurantIds((prev) => prev.filter((fid) => fid !== String(selectedRestaurant.id)))}
        isFavourite={favouriteRestaurantIds.includes(String(selectedRestaurant.id))}
        isHidden={hiddenRestaurantIds.includes(String(selectedRestaurant.id))}
        autoAddItem={autoAddItem}
      />
    );
  }

  if (isLoading) return <PageLoader />;
  if (restaurants.length > 0) return <Navigate to="/" replace />;
  return null;
};
