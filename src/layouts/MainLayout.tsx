import React from "react";
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

import { ALL_RESTAURANTS } from "../data/restaurants";

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { isVoiceSearchOpen, setIsVoiceSearchOpen, setSearchQuery, setIsLoadingView, setLoadingViewType } = useApp();
  const { cart, setCart, selectedRestaurant } = useCart();
  const { currentLocation, addresses } = useAppLocation();
  const {
    activeOrder,
    setActiveOrder,
    confirmModal,
    setConfirmModal,
    favouriteRestaurantIds,
    setFavouriteRestaurantIds,
    hiddenRestaurantIds,
    setHiddenRestaurantIds,
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
          onLocationClick={() => navigate("/location")}
          onProfileClick={() => navigate("/profile")}
        />
      )}

      {/* Main Content Area */}
      <main className={`flex-1 ${isTabRoute ? "pt-20" : ""} pb-24`}>
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
      {isHome && activeOrder && (
        <ActiveOrderSnackbar
          order={activeOrder}
          onClick={() => navigate("/order-tracking")}
        />
      )}

      {/* Cart Snackbar (Sticky bottom checkout bar) */}
      {isHome && cart.length > 0 && selectedRestaurant && (
        <div className="fixed bottom-[80px] left-4 right-4 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 p-4 z-40 flex items-center justify-between animate-fadeInUp">
          <div className="flex-1 overflow-hidden pr-2">
            <h4 className="font-bold text-slate-900 text-sm truncate">
              {selectedRestaurant.name}
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              {cart.length} item{cart.length > 1 ? "s" : ""} in cart
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setIsLoadingView(true);
                setLoadingViewType("checkout");
                setTimeout(() => {
                  navigate("/checkout");
                  setIsLoadingView(false);
                }, 2500);
              }}
              className="text-xs font-bold text-white bg-green-600 px-4 py-2.5 rounded-xl active:scale-95 transition-all shadow-sm shadow-green-600/20"
            >
              View Cart
            </button>
            <button
              onClick={() => setCart([])}
              className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl active:scale-95 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

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
            ALL_RESTAURANTS.find((r) => r.id === confirmModal.restaurantId)
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
