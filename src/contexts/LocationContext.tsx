import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { SavedAddress } from "@/types";
import { useVerifyToken } from "@/api/auth";
import { BASE_URL } from "@/api/fetcher";

// Helper to assign icons based on type
import { Home, Briefcase, MapPin } from "lucide-react";
const getIcon = (type: string) => {
  if (type === "Home") return Home;
  if (type === "Work") return Briefcase;
  return MapPin;
};

interface LocationContextType {
  currentLocation: { type: string; address: string; coordinates?: { lat: number; lng: number } } | null;
  setCurrentLocation: React.Dispatch<React.SetStateAction<{ type: string; address: string; coordinates?: { lat: number; lng: number } } | null>>;
  addresses: SavedAddress[];
  setAddresses: (value: React.SetStateAction<SavedAddress[]>) => void;
  isServiceable: boolean;
  checkingServiceability: boolean;
  activeZone: any;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data } = useVerifyToken();
  const [currentLocation, setCurrentLocation] = useState<{ type: string; address: string; coordinates?: { lat: number; lng: number } } | null>(null);
  const [addresses, setAddressesState] = useState<SavedAddress[]>([]);
  const [isServiceable, setIsServiceable] = useState<boolean>(true);
  const [checkingServiceability, setCheckingServiceability] = useState<boolean>(false);
  const [activeZone, setActiveZone] = useState<any>(null);
  const lastSavedJson = useRef("");

  // Check serviceability whenever currentLocation updates
  useEffect(() => {
    if (!currentLocation) return;
    const coords = currentLocation.coordinates;
    if (coords && coords.lat && coords.lng) {
      setCheckingServiceability(true);
      fetch(`${BASE_URL}/zones/check?lat=${coords.lat}&lng=${coords.lng}`)
        .then((res) => res.json())
        .then((resData) => {
          setCheckingServiceability(false);
          if (resData.success) {
            setIsServiceable(resData.serviceable);
            setActiveZone(resData.zone || null);
          }
        })
        .catch((err) => {
          console.error("Failed to check zone serviceability:", err);
          setCheckingServiceability(false);
        });
    } else {
      // Default to true if coordinates are not attached
      setIsServiceable(true);
    }
  }, [currentLocation]);

  // Sync addresses from backend on load/verify
  useEffect(() => {
    if (data && data.success && data.user && data.user.addresses) {
      const apiAddresses = data.user.addresses.map((addr: any) => ({
        ...addr,
        icon: getIcon(addr.type),
      }));
      setAddressesState(apiAddresses);

      // Initialize lastSavedJson to avoid re-saving initial data
      const stripped = apiAddresses.map(({ id, type, address, isDefault, building, street, coordinates }: any) => ({
        id, type, address, isDefault, building, street, coordinates
      }));
      lastSavedJson.current = JSON.stringify(stripped);

      // By default show user their primary location (isDefault: true) or first address
      const defaultAddr = apiAddresses.find((a: any) => a.isDefault) || apiAddresses[0];
      if (defaultAddr) {
        setCurrentLocation({ type: defaultAddr.type, address: defaultAddr.address });
      } else {
        setCurrentLocation(null);
      }
    } else {
      setAddressesState([]);
      setCurrentLocation(null);
    }
  }, [data]);

  // Sync addresses to backend when updated locally
  const saveAddresses = async (newAddresses: SavedAddress[]) => {
    try {
      const strippedAddresses = newAddresses.map(({ id, type, address, isDefault, building, street, coordinates }) => ({
        id,
        type,
        address,
        isDefault,
        building,
        street,
        coordinates,
      }));
      const jsonStr = JSON.stringify(strippedAddresses);
      if (jsonStr === lastSavedJson.current) {
        return; // Deduplicate duplicate updates
      }
      lastSavedJson.current = jsonStr;

      const res = await fetch(`${BASE_URL}/consumer/profile/addresses`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ addresses: strippedAddresses }),
      });
      const resData = await res.json();
      if (resData.success) {
        // If a default is set, update currentLocation
        const defaultAddr = newAddresses.find((a) => a.isDefault);
        if (defaultAddr) {
          setCurrentLocation({ type: defaultAddr.type, address: defaultAddr.address });
        }
      }
    } catch (err) {
      console.error("Failed to save addresses to backend:", err);
    }
  };

  const setAddresses = (value: React.SetStateAction<SavedAddress[]>) => {
    setAddressesState((prev) => {
      const next = typeof value === "function" ? value(prev) : value;
      saveAddresses(next);
      return next;
    });
  };

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        setCurrentLocation,
        addresses,
        setAddresses,
        isServiceable,
        checkingServiceability,
        activeZone,
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
