import React, { useEffect, useState } from "react";
import { SWRConfig } from "swr";
import { AppProvider } from "@/contexts/AppContext";
import { UserProvider, useUser } from "@/contexts/UserContext";
import { LocationProvider } from "@/contexts/LocationContext";
import { RestaurantProvider } from "@/contexts/RestaurantContext";
import { CartProvider } from "@/contexts/CartContext";
import { AppRoutes } from "@/app/router";
import { fetcher } from "@/api/fetcher";
import { initBackButtonListener } from "@/services/backButton";
import { initPushNotifications } from "@/services/push";
import { LoginView } from "@/shared/components/LoginView";
import { RotateDeviceOverlay } from "@/shared/components/RotateDeviceOverlay";
import { useLocation, useNavigate } from "react-router-dom";

const TermsAndConditionsView = React.lazy(() => import("@/features/profile/pages/TermsAndConditionsView").then(m => ({ default: m.TermsAndConditionsView })));
const PrivacyPolicyView = React.lazy(() => import("@/features/profile/pages/PrivacyPolicyView").then(m => ({ default: m.PrivacyPolicyView })));
const RefundPolicyView = React.lazy(() => import("@/features/profile/pages/RefundPolicyView").then(m => ({ default: m.RefundPolicyView })));

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoadingAuth, onLoginSuccess } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [minLoadingDone, setMinLoadingDone] = useState(false);

  useEffect(() => {
    initPushNotifications();
    return initBackButtonListener();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinLoadingDone(true);
    }, 2000); // 2s compulsory display
    return () => clearTimeout(timer);
  }, []);

  const showLoadingScreen = isLoadingAuth || !minLoadingDone;

  if (showLoadingScreen) {
    return (
      <div className="fixed inset-0 bg-[#00bd6f] z-[99999] flex flex-col items-center justify-between overflow-hidden p-0 m-0 border-none outline-none select-none">
        <img
          src="/app loading screen.svg"
          alt="Crevings Loading"
          className="absolute inset-0 w-full h-full object-cover object-center border-none p-0 m-0 outline-none"
        />

        {/* Bottom Network Notice Overlay */}
        <div className="relative z-10 mt-auto mb-8 px-5 w-full max-w-sm">
          <div className="bg-black/35 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-white shadow-2xl text-center space-y-1.5">
            <div className="flex items-center justify-center gap-2 text-amber-300 font-bold text-xs tracking-wide">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Temporary Network Issue</span>
            </div>
            <p className="text-[11px] text-white/95 leading-relaxed font-medium">
              Crevings may not open properly on some Wi-Fi networks, especially Airtel Wi-Fi. Please switch to mobile data to continue using the app. We’re working to fix this issue. Sorry for the inconvenience.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Legal pages must be reachable BEFORE login (they are linked from the
    // login screen — Terms of Service / Privacy Policy / Refund Policy).
    const isTerms = location.pathname === "/terms" || location.pathname === "/terms-and-conditions";
    const isPrivacy = location.pathname === "/privacy-policy";
    const isRefund = location.pathname === "/refund-policy";

    if (isTerms || isPrivacy || isRefund) {
      return (
        <React.Suspense fallback={<div className="min-h-screen bg-white" />}>
          <div className="min-h-screen bg-white flex flex-col app-container shadow-2xl relative">
            {isTerms ? (
              <TermsAndConditionsView onBack={() => navigate(-1)} />
            ) : isPrivacy ? (
              <PrivacyPolicyView onBack={() => navigate(-1)} />
            ) : (
              <RefundPolicyView onBack={() => navigate(-1)} />
            )}
          </div>
        </React.Suspense>
      );
    }

    return <LoginView onLoginSuccess={onLoginSuccess} />;
  }

    return (
      <>
        <RotateDeviceOverlay />
        <AppRoutes />
      </>
    );
  };

/**
 * Wraps the providers with router-driven navigation callbacks so the
 * providers themselves stay pure (no useNavigate inside context modules).
 */
const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  return (
    <UserProvider onNavigateHome={() => navigate("/")}>
      <LocationProvider>
        <RestaurantProvider navigateToRestaurant={(id) => navigate(`/restaurant/${id}`)}>
          <CartProvider onNavigateToCheckout={() => navigate("/checkout")}>
            {children}
          </CartProvider>
        </RestaurantProvider>
      </LocationProvider>
    </UserProvider>
  );
};

export default function App() {
  // Android hardware back closes open overlays (voice search, map picker,
  // cart sheet) before falling back to default history/exit navigation.
  useEffect(() => {
    initBackButtonListener();
  }, []);

  return (
    <SWRConfig
      value={{
        fetcher,
        // No refetch on window focus (mobile — avoid noisy background polls);
        // remounting a page (navigation back/forward) revalidates instead, so
        // the feed/menu/category data is auto-refreshed on every visit without
        // needing a hard refresh.
        revalidateOnFocus: false,
        // Bounded retries: a single transient failure (cold backend, timeout)
        // must not permanently leave the feed empty until a hard refresh —
        // SWR retries a couple of times, then self-heals on the next remount.
        shouldRetryOnError: true,
        errorRetryCount: 2,
        // Coalesce concurrent requests for the same key within 2s (L1 cache
        // policy — see backend caching-strategy.md).
        dedupingInterval: 2000,
      }}
    >
      <AppProvider>
        <AppProviders>
          <AppContent />
        </AppProviders>
      </AppProvider>
    </SWRConfig>
  );
}
