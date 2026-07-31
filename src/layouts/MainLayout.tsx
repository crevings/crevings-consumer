import React, { useState } from "react";
import { Outlet, useNavigate, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ChevronUp, Trash2 } from "lucide-react";

import { useApp } from "../contexts/AppContext";
import { useCart } from "../contexts/CartContext";
import { useLocation as useAppLocation } from "../contexts/LocationContext";
import { useRestaurant } from "../contexts/RestaurantContext";

import { useScrollBehavior } from "../shared/hooks/useScrollBehavior";
import { usePullToRefresh } from "../shared/hooks/usePullToRefresh";

import { Header } from "../shared/components/Header";
import { BottomNav } from "../shared/components/BottomNav";
import { ActiveOrderSnackbar } from "../features/orders/components/ActiveOrderSnackbar";
import { AIChatBot } from "../shared/ui/AIChatBot";
import { VoiceSearchModal } from "../features/search/VoiceSearchModal";
import { ConfirmationBottomSheet } from "../shared/components/ConfirmationBottomSheet";
import { FloatingCartBar } from "../features/restaurant/components/FloatingCartBar";
import { CartPreviewSheet } from "../features/cart/components/CartPreviewSheet";

import { useRestaurants } from "../api/restaurants";

export const MainLayout: React.FC = () => {
  const { restaurants } = useRestaurants();
  const navigate = useNavigate();
  const location = useLocation();

  const { isVoiceSearchOpen, setIsVoiceSearchOpen, setSearchQuery, setIsLoadingView, setLoadingViewType } = useApp();
  const { cart, setCart } = useCart();
  const [showCartPreview, setShowCartPreview] = useState(false);
  
  const totalItems = cart.reduce((sum, c) => sum + c.quantity, 0);
  const totalPrice = cart.reduce((sum, c) => sum + c.totalPrice, 0);

  const handleCartQuantityChange = (cartItemId: string, delta: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.cartItemId === cartItemId);
      if (!existing) return prev;

      if (existing.quantity + delta <= 0) {
        return prev.filter((item) => item.cartItemId !== cartItemId);
      }

      return prev.map((item) => {
        if (item.cartItemId === cartItemId) {
          const newQuantity = item.quantity + delta;
          const unitPrice = item.totalPrice / item.quantity;
          return {
            ...item,
            quantity: newQuantity,
            totalPrice: unitPrice * newQuantity,
          };
        }
        return item;
      });
    });
  };

  const { currentLocation, addresses, isServiceable } = useAppLocation();
  const {
    activeOrder,
    setActiveOrder,
    confirmModal,
    setConfirmModal,
    favouriteRestaurantIds,
    setFavouriteRestaurantIds,
    hiddenRestaurantIds,
    setHiddenRestaurantIds,
    selectedRestaurant,
  } = useRestaurant();

  const { showBackToTop, isNavVisible, scrollToTop } = useScrollBehavior();
  const {
    isPullLoading,
    pullDistance,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = usePullToRefresh();

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
      className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto shadow-2xl relative"
    >
      {/* Pull to Refresh Indicator */}
      {pullDistance > 0 && (
        <div
          className="absolute left-0 right-0 flex justify-center items-center pointer-events-none z-50 transition-all duration-75"
          style={{
            top: `${Math.max(10, pullDistance - 20)}px`,
            opacity: pullDistance / 60,
          }}
        >
          <div className="bg-white p-2 rounded-full shadow-md border border-slate-100 flex items-center justify-center animate-spin">
            <span className="text-green-600 text-xs font-bold">↻</span>
          </div>
        </div>
      )}

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
          currentLocation={currentLocation}
          onSearchClick={() => {
            setSearchQuery('');
            navigate("/search-results");
          }}
          onMicClick={() => setIsVoiceSearchOpen(true)}
          onLocationClick={() => navigate("/location")}
          onProfileClick={() => navigate("/profile")}
        />
      )}

      {/* Non-serviceable zone banner */}
      {!isServiceable && currentLocation && (
        <div className="bg-amber-500 text-white px-4 py-2 text-center text-xs font-bold flex items-center justify-center gap-2 sticky top-[60px] z-30 shadow-md">
          <span>⚠️ Crevings is not available in your selected area yet!</span>
          <button 
            onClick={() => navigate("/location")} 
            className="underline bg-amber-600 px-2 py-0.5 rounded text-[11px] hover:bg-amber-700"
          >
            Change Location
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className={`flex-1 pb-24`}>
        <Outlet />
      </main>

      {/* Back to Top Button */}
      {isHome && (
        <button
          onClick={scrollToTop}
          className={`fixed z-40 right-4 bg-slate-900 text-white w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
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
          className="bottom-20"
          totalItems={totalItems}
          totalPrice={totalPrice}
          onPreviewClick={() => setShowCartPreview(true)}
          onCheckoutClick={() => {
            setIsLoadingView(true);
            setLoadingViewType("checkout");
            setTimeout(() => {
              navigate("/checkout");
              setIsLoadingView(false);
            }, 2500);
          }}
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
        onCheckoutClick={() => {
          setIsLoadingView(true);
          setLoadingViewType("checkout");
          setTimeout(() => {
            navigate("/checkout");
            setIsLoadingView(false);
          }, 2500);
        }}
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
      <BottomNav isVisible={isNavVisible} />
    </div>
  );
};
