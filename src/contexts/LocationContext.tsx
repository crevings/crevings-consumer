import React, { createContext, useContext, useState } from "react";
import { SavedAddress } from "@/types";
import { Home, Briefcase, Map, MapPin } from "lucide-react";

interface LocationContextType {
  currentLocation: { type: string; address: string };
  setCurrentLocation: React.Dispatch<React.SetStateAction<{ type: string; address: string }>>;
  addresses: SavedAddress[];
  setAddresses: React.Dispatch<React.SetStateAction<SavedAddress[]>>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState({
    type: "Home",
    address: "House No 37-C, 2nd Floor, Janta Flats, Block A, Phase 3, Ashok Vihar, Delhi",
  });

  const [addresses, setAddresses] = useState<SavedAddress[]>([
    {
      id: "1",
      type: "Home",
      icon: Home,
      address: "House No 37-C, 2nd Floor, Janta Flats, Block A, Phase 3, Ashok Vihar, Delhi",
      isDefault: true,
    },
    {
      id: "2",
      type: "Work",
      icon: Briefcase,
      address: "Tech Park, Building 4, 5th Floor, Sector 62, Noida, Uttar Pradesh",
      isDefault: false,
    },
    {
      id: "3",
      type: "Other",
      icon: Map,
      address: "12/4, Riverside Apartments, Near Metro Station, Mayur Vihar, Delhi",
      isDefault: false,
    },
    {
      id: "4",
      type: "Other",
      icon: MapPin,
      address: "Motihari, Bihar",
      isDefault: false,
    },
  ]);

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        setCurrentLocation,
        addresses,
        setAddresses,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};
