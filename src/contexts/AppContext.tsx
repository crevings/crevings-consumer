import React, { createContext, useContext, useState } from "react";

interface AppContextType {
  isVoiceSearchOpen: boolean;
  setIsVoiceSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isVoiceSearchOpen, setIsVoiceSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <AppContext.Provider
      value={{
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
