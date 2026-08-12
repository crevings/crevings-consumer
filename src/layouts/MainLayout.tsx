import React, { useState, useMemo } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { ChevronUp } from "lucide-react";

import { useApp } from "@/contexts/AppContext";
import { useCart } from "@/contexts/CartContext";
import { withQuantity } from "@/utils/cartUtils";
import { useLocation as useAppLocation } from "@/contexts/LocationContext";
import { useRestaurant } from "@/contexts/RestaurantContext";

import { useScrollBehavior } from "@/shared/hooks/useScrollBehavior";
import { usePullToRefresh } from "@/shared/hooks/usePullToRefresh";

import { Header } from "@/shared/components/Header";
import { ActiveOrderSnackbar } from "@/features/orders/components/ActiveOrderSnackbar";
import { AIChatBot } from "@/shared/ui/AIChatBot";
import { VoiceSearchModal } from "@/features/search/VoiceSearchModal";
import { ConfirmationBottomSheet } from "@/shared/components/ConfirmationBottomSheet";
import { FloatingCartBar } from "@/features/restaurant/components/FloatingCartBar";
import { CartPreviewSheet } from "@/features/cart/components/CartPreviewSheet";

import { useRestaurants } from "@/api/restaurant/index";

export const MainLayout: React.FC = () => {
  const { restaurants, mutate } = useRestaurants();
  const navigate = useNavigate();
  const location = useLocation();

  const { isVoiceSearchOpen, setIsVoiceSearchOpen, setSearchQuery } = useApp();
  const { cart, setCart } = useCart();
  const [showCartPreview, setShowCartPreview] = useState(false);
  
  const { totalItems, totalPrice } = useMemo(() => {
    let items = 0;
    let price = 0;
    for (const item of cart) {
      items += item.quantity;
      price += item.totalPrice;
    }
    return { totalItems: items, totalPrice: price };
  }, [cart]);

  const handleCartQuantityChange = (cartItemId: string, delta: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.cartItemId === cartItemId);
      if (!existing) return prev;

      if (existing.quantity + delta <= 0) {
        return prev.filter((item) => item.cartItemId !== cartItemId);
      }

      return prev.map((item) => {
        if (item.cartItemId === cartItemId) {
          return withQuantity(item, item.quantity + delta);
        }
        return item;
      });
    });
  };

  const { currentLocation } = useAppLocation();
  const {
    activeOrder,
    confirmModal,
    setConfirmModal,
    setFavouriteRestaurantIds,
    setHiddenRestaurantIds,
    selectedRestaurant,
  } = useRestaurant();

  const { showBackToTop, scrollToTop } = useScrollBehavior();
  // Pull-to-refresh still revalidates the feed on the gesture; the visual
  // drag indicator was removed per UX request (the "Refreshing Feed..." state
  // below still gives feedback while the request is in flight).
  const {
    isPullLoading,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = usePullToRefresh(mutate);

  const currentPath = location.pathname;
  const isTabRoute = ["/", "/local", "/dine-in", "/deals"].includes(currentPath);
  const isHome = currentPath === "/";

  const executeConfirmAction = () => {
    if (!confirmModal) return;
    const { type, restaurantId } = confirmModal;
    if (type === "favourite") {
      setFavouriteRestaurantIds((prev) =>
        prev.includes(restaurantId)
          ? prev.filter((id) => id !== restaurantId)
          : [...prev, restaurantId]
      );
    } else if (type === "hide") {
      setHiddenRestaurantIds((prev) =>
        prev.includes(restaurantId)
          ? prev.filter((id) => id !== restaurantId)
          : [...prev, restaurantId]
      );
    }
    setConfirmModal(null);
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="min-h-screen bg-slate-50 flex flex-col app-container shadow-2xl relative"
    >
      {/* Pull Loading Overlay */}
      {isPullLoading && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-white px-5 py-3 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-slate-800 text-xs font-bold">Refreshing Feed...</span>
          </div>
        </div>
      )}

      {/* Header (Only on main tab pages) */}
      {isTabRoute && (
        <Header
          currentLocation={currentLocation ?? undefined}
          onSearchClick={() => {
            setSearchQuery('');
            navigate("/search-results");
          }}
          onMicClick={() => setIsVoiceSearchOpen(true)}
          onLocationClick={() => navigate("/location")}
          onProfileClick={() => navigate("/profile")}
        />
      )}

      {/* Main Content Area */}
      <main className={`flex-1 pb-28`}>
        <Outlet />
      </main>

      {/* Back to Top Button */}
      {isHome && (
        <button
          onClick={scrollToTop}
          className={`fixed z-40 right-4 xl:right-[max(1rem,calc(50%_-_35rem))] bg-slate-900 text-white w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
            activeOrder ? "bottom-[160px]" : "bottom-[100px]"
          } ${
            showBackToTop
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10 pointer-events-none"
          }`}
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

      {/* Active Order Snackbar */}
      {currentPath !== "/order-tracking" && activeOrder && (
        <ActiveOrderSnackbar
          order={activeOrder}
          onClick={() => navigate("/order-tracking")}
        />
      )}

      {/* Cart Snackbar (Sticky bottom checkout bar) */}
      {isTabRoute && cart.length > 0 && selectedRestaurant && (
        <FloatingCartBar
          className="bottom-3"
          totalItems={totalItems}
          totalPrice={totalPrice}
          onPreviewClick={() => setShowCartPreview(true)}
          onCheckoutClick={() => navigate("/checkout")}
        />
      )}

      {/* Cart Preview Sheet */}
      <CartPreviewSheet
        showCartPreview={showCartPreview}
        setShowCartPreview={setShowCartPreview}
        cart={cart}
        setCart={setCart}
        totalItems={totalItems}
        totalPrice={totalPrice}
        handleQuantityChange={handleCartQuantityChange}
        onCheckoutClick={() => navigate("/checkout")}
      />

      {/* AI Chatbot */}
      <AIChatBot
        forceOpen={currentPath === "/ai"}
        onClose={() => navigate("/")}
      />

      {/* Voice Search Modal */}
      {isVoiceSearchOpen && (
        <VoiceSearchModal
          onClose={() => setIsVoiceSearchOpen(false)}
          onResult={(text) => {
            setSearchQuery(text);
            navigate("/search-results");
          }}
        />
      )}

      {/* Favorite/Hide Confirmation Modal */}
      {confirmModal && (
        <ConfirmationBottomSheet
          type={confirmModal.type}
          restaurantName={
            restaurants.find((r) => r.id === confirmModal.restaurantId)
              ?.name || "this restaurant"
          }
          onConfirm={executeConfirmAction}
          onClose={() => setConfirmModal(null)}
        />
      )}

      {/* Bottom Navigation Tabs */}
    </div>
  );
};
