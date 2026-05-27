import React, { createContext, useContext, useState } from "react";

interface AppContextType {
  isLoadingView: boolean;
  setIsLoadingView: (loading: boolean) => void;
  loadingViewType: string;
  setLoadingViewType: (type: string) => void;
  isLoadingRestaurant: boolean;
  setIsLoadingRestaurant: (loading: boolean) => void;
  isLoadingCheckout: boolean;
  setIsLoadingCheckout: (loading: boolean) => void;
  isVoiceSearchOpen: boolean;
  setIsVoiceSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoadingView, setIsLoadingView] = useState(false);
  const [loadingViewType, setLoadingViewType] = useState("");
  const [isLoadingRestaurant, setIsLoadingRestaurant] = useState(false);
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);
  const [isVoiceSearchOpen, setIsVoiceSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <AppContext.Provider
      value={{
        isLoadingView,
        setIsLoadingView,
        loadingViewType,
        setLoadingViewType,
        isLoadingRestaurant,
        setIsLoadingRestaurant,
        isLoadingCheckout,
        setIsLoadingCheckout,
        isVoiceSearchOpen,
        setIsVoiceSearchOpen,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
