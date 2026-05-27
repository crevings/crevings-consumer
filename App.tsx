import React from "react";
import { Loader2 } from "lucide-react";
import { SWRConfig } from "swr";
import { AppProvider, useApp } from "./src/contexts/AppContext";
import { UserProvider } from "./src/contexts/UserContext";
import { LocationProvider } from "./src/contexts/LocationContext";
import { RestaurantProvider } from "./src/contexts/RestaurantContext";
import { CartProvider } from "./src/contexts/CartContext";
import { AppRoutes } from "./src/app/routes";
import { fetcher } from "./src/api/fetcher";

const AppContent: React.FC = () => {
  const { isLoadingView, loadingViewType } = useApp();

  return (
    <>
      <AppRoutes />

      {/* Global Loading Overlay */}
      {isLoadingView && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6 animate-in fade-in duration-300 max-w-md mx-auto shadow-2xl">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
              <Loader2 size={40} className="text-green-600 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              {loadingViewType === "checkout"
                ? "Preparing Checkout..."
                : "Entering Restaurant..."}
            </h2>
            <p className="text-slate-500 text-sm">
              Please wait while we set things up for you...
            </p>
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
