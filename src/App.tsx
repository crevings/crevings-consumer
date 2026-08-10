import React from "react";
import { SWRConfig } from "swr";
import { AppProvider } from "@/contexts/AppContext";
import { UserProvider, useUser } from "@/contexts/UserContext";
import { LocationProvider } from "@/contexts/LocationContext";
import { RestaurantProvider } from "@/contexts/RestaurantContext";
import { CartProvider } from "@/contexts/CartContext";
import { AppRoutes } from "@/app/router";
import { fetcher } from "@/api/fetcher";
import { LoginView } from "@/shared/components/LoginView";
import { TermsAndConditionsView } from "@/features/profile/pages/TermsAndConditionsView";
import { PrivacyPolicyView } from "@/features/profile/pages/PrivacyPolicyView";
import { useLocation, useNavigate } from "react-router-dom";

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoadingAuth, onLoginSuccess } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="w-10 h-10 border-3 border-slate-200 border-t-[#00bd6f] rounded-full animate-spin mb-3" />
        <p className="text-slate-500 font-bold text-sm">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Legal pages must be reachable BEFORE login (they are linked from the
    // login screen — Terms of Service / Privacy Policy).
    const isTerms = location.pathname === "/terms" || location.pathname === "/terms-and-conditions";
    const isPrivacy = location.pathname === "/privacy-policy";

    if (isTerms || isPrivacy) {
      return (
        <div className="min-h-screen bg-white flex flex-col max-w-md mx-auto shadow-2xl relative">
          {isTerms ? (
            <TermsAndConditionsView onBack={() => navigate(-1)} />
          ) : (
            <PrivacyPolicyView onBack={() => navigate(-1)} />
          )}
        </div>
      );
    }

    return <LoginView onLoginSuccess={onLoginSuccess} />;
  }

  return (
    <>
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
