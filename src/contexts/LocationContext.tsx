import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { SavedAddress, Zone } from "@/types";
import { deepEqual } from "@/utils/deepEqual";
import { useVerifyToken } from "@/api/auth";
import { get, put } from "@/api/fetcher";

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
  activeZone: Zone | null;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data } = useVerifyToken();
  const [currentLocation, setCurrentLocation] = useState<{ type: string; address: string; coordinates?: { lat: number; lng: number } } | null>(null);
  const [addresses, setAddressesState] = useState<SavedAddress[]>([]);
  const [isServiceable, setIsServiceable] = useState<boolean>(true);
  const [checkingServiceability, setCheckingServiceability] = useState<boolean>(false);
  const [activeZone, setActiveZone] = useState<Zone | null>(null);
  const lastSavedRef = useRef<SavedAddress[] | null>(null);

  // Check serviceability whenever currentLocation updates. The request is
  // aborted on unmount/location change so stale responses can't race.
  useEffect(() => {
    if (!currentLocation) return;
    const coords = currentLocation.coordinates;
    if (coords && typeof coords.lat === "number" && typeof coords.lng === "number") {
      const controller = new AbortController();
      setCheckingServiceability(true);
      get<{ success: boolean; serviceable?: boolean; zone?: Zone | null }>(
        `/zones/check?lat=${coords.lat}&lng=${coords.lng}`,
        { signal: controller.signal }
      )
        .then((resData) => {
          setCheckingServiceability(false);
          if (resData.success) {
            setIsServiceable(resData.serviceable ?? false);
            setActiveZone(resData.zone || null);
          }
        })
        .catch((err) => {
          if (controller.signal.aborted) return;
          console.error("Failed to check zone serviceability:", err);
          setCheckingServiceability(false);
        });
      return () => controller.abort();
    } else {
      // No coordinates attached — the zone check cannot run. Do NOT claim
      // serviceability; keep the last known value until a geocoded location
      // is available (the home page shows the "add location" state instead).
      setCheckingServiceability(false);
    }
  }, [currentLocation]);

  // Sync addresses from backend on load/verify
  useEffect(() => {
    if (data && data.success && data.user && data.user.addresses) {
      const apiAddresses = data.user.addresses.map((addr: SavedAddress) => ({
        ...addr,
        icon: getIcon(addr.type),
      }));
      setAddressesState(apiAddresses);

      // Remember the initial snapshot so we don't re-save unchanged data
      const stripped = apiAddresses.map(({ id, type, address, isDefault, building, street, coordinates }: SavedAddress) => ({
        id, type, address, isDefault, building, street, coordinates
      }));
      lastSavedRef.current = stripped;

      // By default show user their primary location (isDefault: true) or first address
      const defaultAddr = apiAddresses.find((a: SavedAddress) => a.isDefault) || apiAddresses[0];
      if (defaultAddr) {
        setCurrentLocation({
          type: defaultAddr.type,
          address: defaultAddr.address,
          // Carry coordinates through so the /zones/check serviceability
          // check actually runs for saved addresses — it previously never
          // fired because coordinates were dropped here, silently defaulting
          // every saved address to "serviceable".
          coordinates: defaultAddr.coordinates,
        });
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
      if (lastSavedRef.current && deepEqual(strippedAddresses, lastSavedRef.current)) {
        return; // Deduplicate duplicate updates
      }
      lastSavedRef.current = strippedAddresses;

      const resData = await put<{ success: boolean }>("/consumer/profile/addresses", {
        addresses: strippedAddresses,
      });
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
