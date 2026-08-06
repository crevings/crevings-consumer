import React from "react";
import { SWRConfig } from "swr";
import { UtensilsCrossed } from "lucide-react";
import { AppProvider, useApp } from "./src/contexts/AppContext";
import { UserProvider, useUser } from "./src/contexts/UserContext";
import { LocationProvider } from "./src/contexts/LocationContext";
import { RestaurantProvider } from "./src/contexts/RestaurantContext";
import { CartProvider } from "./src/contexts/CartContext";
import { AppRoutes } from "./src/app/routes";
import { fetcher } from "./src/api/fetcher";
import { LoginView } from "./src/shared/components/LoginView";
import { TermsAndConditionsView } from "./src/features/profile/pages/TermsAndConditionsView";
import { PrivacyPolicyView } from "./src/features/profile/pages/PrivacyPolicyView";
import { useLocation, useNavigate } from "react-router-dom";

const AppContent: React.FC = () => {
  const { isLoadingView } = useApp();
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

      {/* Global Loading Overlay — Checkout Skeleton */}
      {isLoadingView && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden animate-in fade-in duration-200">
          {/* Header skeleton */}
          <div className="bg-white px-4 py-4 flex items-center justify-between border-b border-slate-100/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 animate-pulse" />
              <div className="h-5 w-24 bg-slate-100 rounded-lg animate-pulse" />
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-100 animate-pulse" />
          </div>

          <div className="p-4 space-y-4 flex-1 overflow-hidden">
            {/* Order type toggle skeleton */}
            <div className="bg-slate-100 p-1 rounded-2xl flex h-[52px] animate-pulse">
              <div className="flex-1 rounded-xl bg-white m-0.5" />
              <div className="flex-1 rounded-xl m-0.5" />
            </div>

            {/* Address card skeleton */}
            <div className="bg-white rounded-[20px] p-4 border border-slate-100">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 animate-pulse shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-36 bg-slate-100 rounded-lg animate-pulse" />
                    <div className="h-5 w-16 bg-slate-100 rounded animate-pulse" />
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded animate-pulse" />
                  <div className="h-3 w-2/3 bg-slate-100 rounded animate-pulse" />
                  <div className="h-7 w-28 bg-slate-100 rounded-lg animate-pulse mt-1" />
                </div>
              </div>
            </div>

            {/* Order summary skeleton */}
            <div className="bg-white rounded-[24px] p-5 border border-slate-100">
              <div className="h-5 w-28 bg-slate-100 rounded-lg animate-pulse mb-5" />
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 animate-pulse shrink-0" />
                    <div className="flex-1 space-y-2 pt-0.5">
                      <div className="h-3.5 w-28 bg-slate-100 rounded animate-pulse" />
                      <div className="h-3 w-40 bg-slate-50 rounded animate-pulse" />
                      <div className="h-3.5 w-12 bg-slate-100 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="w-[70px] h-8 rounded-lg bg-slate-100 animate-pulse shrink-0" />
                </div>
              ))}
              <div className="border-t border-slate-100 pt-4 mt-2">
                <div className="h-10 w-full bg-slate-50 rounded-xl animate-pulse" />
              </div>
              <div className="border-t border-slate-100 pt-4 mt-4">
                <div className="h-12 w-full bg-slate-50 rounded-2xl animate-pulse" />
              </div>
            </div>

            {/* Coupon skeleton */}
            <div className="bg-white rounded-[20px] p-4 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 animate-pulse" />
                <div className="space-y-1.5">
                  <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
                  <div className="h-3 w-32 bg-slate-50 rounded animate-pulse" />
                </div>
              </div>
              <div className="w-5 h-5 bg-slate-100 rounded animate-pulse" />
            </div>

            {/* Price breakdown skeleton */}
            <div className="bg-white border border-slate-100 rounded-[24px] overflow-hidden">
              <div className="p-4 border-b border-slate-100">
                <div className="h-5 w-32 bg-slate-100 rounded-lg animate-pulse" />
              </div>
              <div className="p-5 space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-3.5 w-24 bg-slate-50 rounded animate-pulse" />
                    <div className="h-3.5 w-12 bg-slate-50 rounded animate-pulse" />
                  </div>
                ))}
                <div className="border-t border-dashed border-slate-200 my-1" />
                <div className="flex justify-between pt-1">
                  <div className="h-5 w-16 bg-slate-100 rounded animate-pulse" />
                  <div className="h-5 w-14 bg-slate-100 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom action bar skeleton */}
          <div className="bg-white border-t border-slate-100 p-4">
            <div className="h-14 bg-slate-100 rounded-2xl animate-pulse" />
          </div>
        </div>
      )}
    </>
  );
};

export default function App() {
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false,
        shouldRetryOnError: false,
      }}
    >
      <AppProvider>
        <UserProvider>
          <LocationProvider>
            <RestaurantProvider>
              <CartProvider>
                <AppContent />
              </CartProvider>
            </RestaurantProvider>
          </LocationProvider>
        </UserProvider>
      </AppProvider>
    </SWRConfig>
  );
}
