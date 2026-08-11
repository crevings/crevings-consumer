import React, { useState, useRef } from 'react';
import { AddressDetailsFields } from './components/AddressDetailsFields';
import { LocationMapCanvas, DropPin } from './components/LocationMapCanvas';
import { ArrowLeft, Search, MapPin, Home, Briefcase, X, Loader2, ChevronRight } from 'lucide-react';
import { useJsApiLoader } from '@react-google-maps/api';
import {
  isCapacitorNative,
  openLocationSettings,
  requestLocationAndGetPosition,
  openDeviceLocationSettings,
} from '@/services/geolocation';
import { useHardwareBack } from '@/services/backButton';

const libraries: ("places" | "marker" | "geometry")[] = ["places", "marker", "geometry"];

interface GooglePlaceLike {
  location?: { lat: () => number; lng: () => number };
  displayName?: string;
  formattedAddress?: string;
  fetchFields: (options: { fields: string[] }) => Promise<void>;
}

interface GooglePlacesWithPlace {
  Place?: new (options: { id: string }) => GooglePlaceLike;
}

interface AutocompleteSuggestionResponse {
  suggestions?: Array<{
    placePrediction?: {
      placeId?: string;
      mainText?: { text?: string };
      secondaryText?: { text?: string };
      text?: { text?: string };
    };
  }>;
}

interface GooglePlacesWithAutocomplete {
  AutocompleteSuggestion?: {
    fetchAutocompleteSuggestions: (options: { input: string; componentRestrictions: { country: string } }) => Promise<AutocompleteSuggestionResponse>;
  };
}

interface PredictionItem {
  id: string;
  mainText: string;
  secondaryText: string;
  fullText: string;
  suggestionObj?: {
    placePrediction?: {
      placeId?: string;
      mainText?: { text?: string };
      secondaryText?: { text?: string };
      text?: { text?: string };
      toPlace?: () => GooglePlaceLike;
    };
  };
}

interface MapLocationPickerViewProps {
  initialLocation?: { title: string, subtitle: string, coords: [number, number] } | null;
  initialBuilding?: string;
  initialStreet?: string;
  initialAddressType?: string;
  isEditing?: boolean;
  onClose: () => void;
  onConfirm: (address: { 
    type: string; 
    address: string;
    building?: string;
    street?: string;
    coordinates?: { lat: number; lng: number };
  }) => void;
}

export const MapLocationPickerView: React.FC<MapLocationPickerViewProps> = ({ 
  initialLocation, 
  initialBuilding = '',
  initialStreet = '',
  initialAddressType = 'Home',
  onClose, 
  onConfirm 
}) => {
  // Android hardware back closes the picker instead of exiting the app.
  useHardwareBack(() => {
    onClose();
    return true;
  });

  const [isMoving, setIsMoving] = useState(false);
  const [_permissionGranted, setPermissionGranted] = useState(false);
  const [useAccountDetails, setUseAccountDetails] = useState(true);
  const [addressType, setAddressType] = useState(initialAddressType);
  const [customAddressType, setCustomAddressType] = useState('');
  const [searchQuery, setSearchQuery] = useState(initialLocation?.title || '');
  const [predictions, setPredictions] = useState<PredictionItem[]>([]);

  // Location permission modal state
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isGpsOff, setIsGpsOff] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const [mapCenter, setMapCenter] = useState<{ lat: number, lng: number }>(() => {
    if (initialLocation && initialLocation.coords) {
      return { lat: initialLocation.coords[0], lng: initialLocation.coords[1] };
    }
    return { lat: 28.6139, lng: 77.2090 }; // Default Center
  });

  const [selectedAddress, setSelectedAddress] = useState({
    title: initialLocation?.title || 'Selected Location',
    subtitle: initialLocation?.subtitle || 'Selected Address Area'
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Form Fields
  const [building, setBuilding] = useState(initialBuilding);
  const [street, setStreet] = useState(initialStreet);
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries
  });

  const updateAddressFromLatLng = (lat: number, lng: number) => {
    if (!window.google) return;
    setIsMoving(true);
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      setIsMoving(false);
      if (status === "OK" && results?.[0]) {
        const res = results[0];
        
        // Find a title component (neighborhood/sublocality)
        const titleComponent = res.address_components.find(
          c => c.types.includes('sublocality_level_1') || 
               c.types.includes('locality') || 
               c.types.includes('neighborhood')
        );

        setSelectedAddress({
          title: titleComponent ? titleComponent.long_name : 'Selected Location',
          subtitle: res.formatted_address
        });

        // Auto-fill the road/area field from the geocoded location when empty
        setStreet(prev => {
          if (prev && prev.trim()) return prev;
          const roadComponent = res.address_components.find(
            c => c.types.includes('route') || c.types.includes('sublocality_level_2')
          );
          return roadComponent ? roadComponent.long_name : prev;
        });
      }
    });
  };

  const handleSearchChange = async (q: string) => {
    setSearchQuery(q);
    if (!q.trim() || !window.google) {
      setPredictions([]);
      return;
    }

    // 1. Modern Places API v2: AutocompleteSuggestion
    try {
      const placesApi = google.maps.places as unknown as GooglePlacesWithAutocomplete;
      if (google.maps.places && placesApi.AutocompleteSuggestion) {
        const { AutocompleteSuggestion } = placesApi;
        const response = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input: q,
          componentRestrictions: { country: "in" },
        });

        if (response && response.suggestions && response.suggestions.length > 0) {
          const mapped: PredictionItem[] = response.suggestions.map((s) => {
            const p = s.placePrediction;
            return {
              id: p?.placeId || Math.random().toString(),
              mainText: p?.mainText?.text || p?.text?.text || q,
              secondaryText: p?.secondaryText?.text || "",
              fullText: p?.text?.text || q,
              suggestionObj: s,
            };
          });
          setPredictions(mapped);
          return;
        }
      }
    } catch (err) {
      console.warn("AutocompleteSuggestion notice, falling back to Geocoder search:", err);
    }

    // 2. Geocoder fallback (100% reliable across all Maps SDK builds & keys, 0 deprecation warnings)
    try {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: q, componentRestrictions: { country: "IN" } }, (results, status) => {
        if (status === "OK" && results && results.length > 0) {
          const mapped: PredictionItem[] = results.slice(0, 5).map((res) => {
            const titleComponent = res.address_components.find(
              c => c.types.includes('sublocality_level_1') || 
                   c.types.includes('locality') || 
                   c.types.includes('neighborhood')
            );
            return {
              id: res.place_id,
              mainText: titleComponent ? titleComponent.long_name : (res.formatted_address.split(',')[0] ?? res.formatted_address),
              secondaryText: res.formatted_address,
              fullText: res.formatted_address,
            };
          });
          setPredictions(mapped);
        } else {
          setPredictions([]);
        }
      });
    } catch {
      setPredictions([]);
    }
  };

  const handleSelectPrediction = async (item: PredictionItem) => {
    setPredictions([]);
    setSearchQuery(item.fullText);

    // 1. Fetch location from AutocompleteSuggestion -> Place
    if (item.suggestionObj && item.suggestionObj.placePrediction?.toPlace) {
      try {
        const place = item.suggestionObj.placePrediction.toPlace();
        await place.fetchFields({ fields: ["location", "displayName", "formattedAddress"] });
        if (place.location) {
          const newPos = {
            lat: place.location.lat(),
            lng: place.location.lng()
          };
          setMapCenter(newPos);
          setSelectedAddress({
            title: place.displayName || item.mainText,
            subtitle: place.formattedAddress || item.secondaryText || item.fullText
          });
          mapRef.current?.panTo(newPos);
          return;
        }
      } catch (err) {
        console.warn("Place.fetchFields error:", err);
      }
    }

    // 2. Modern google.maps.places.Place class
    const placesApi = google.maps.places as unknown as GooglePlacesWithPlace;
    if (window.google && placesApi.Place) {
      try {
        const PlaceClass = placesApi.Place;
        const place = new PlaceClass({ id: item.id });
        await place.fetchFields({ fields: ["location", "displayName", "formattedAddress"] });
        if (place.location) {
          const newPos = {
            lat: place.location.lat(),
            lng: place.location.lng()
          };
          setMapCenter(newPos);
          setSelectedAddress({
            title: place.displayName || item.mainText,
            subtitle: place.formattedAddress || item.secondaryText || item.fullText
          });
          mapRef.current?.panTo(newPos);
          return;
        }
      } catch (err) {
        console.warn("Place constructor error:", err);
      }
    }

    // 3. Geocoder fallback
    if (window.google) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: item.fullText }, (results, status) => {
        if (status === "OK" && results?.[0] && results[0].geometry?.location) {
          const loc = results[0].geometry.location;
          const newPos = { lat: loc.lat(), lng: loc.lng() };
          setMapCenter(newPos);
          setSelectedAddress({
            title: item.mainText,
            subtitle: results[0].formatted_address
          });
          mapRef.current?.panTo(newPos);
        }
      });
    }
  };

  // User tapped "Use current location" → directly request browser / Android system location permissions
  // NOTE: we deliberately do NOT clear locationError at the start. Keeping the
  // error card on screen during the retry avoids the flicker where the modal
  // briefly flashes back to the "Allow location access?" state (the glitch
  // users saw when tapping "Try Again").
  const handleLocateMe = async () => {
    setIsLocating(true);
    try {
      const pos = await requestLocationAndGetPosition();
      const newPos = { lat: pos.lat, lng: pos.lng };
      setMapCenter(newPos);
      mapRef.current?.panTo(newPos);
      updateAddressFromLatLng(newPos.lat, newPos.lng);
      setPermissionGranted(true);
      setShowLocationModal(false);
      setLocationError(null);
      setIsGpsOff(false);
    } catch (error) {
      const err = error as { code?: number } | null;
      if (err?.code !== 1) console.error("Error getting location", error);
      setPermissionGranted(false);

      if (err?.code === 1) {
        // App-level permission denied
        setIsGpsOff(false);
        setLocationError(
          'Location permission is turned off in your browser or device settings. Please allow location access and try again.'
        );
      } else {
        // GPS / Location Services toggle is OFF on the device
        setIsGpsOff(true);
        setLocationError(
          'Your device\'s location service (GPS) is turned off. Please enable it to get your current location.'
        );
      }
      setShowLocationModal(true);
    } finally {
      setIsLocating(false);
    }
  };

  const handleAllowLocation = handleLocateMe;

  const handleFinalSave = () => {
    const finalType = addressType === 'Other' ? (customAddressType || 'Other') : addressType;
    const combinedAddress = [
      building,
      street,
      selectedAddress.subtitle
    ].filter(Boolean).join(', ');

    onConfirm({
      type: finalType,
      address: combinedAddress,
      building: building || undefined,
      street: street || undefined,
      coordinates: {
        lat: mapCenter.lat,
        lng: mapCenter.lng
      }
    });
  };

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 bg-white z-[110] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-green-600 w-10 h-10" />
        <span className="text-sm font-semibold text-slate-500 mt-2">Loading Map...</span>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[110] bg-[#e8eaed] flex flex-col animate-[slideInRight_0.3s_ease-out] font-sans">
      <style>{`
        button:focus, input:focus, select:focus, textarea:focus, [tabindex]:focus, div:focus {
          outline: none !important;
          box-shadow: none !important;
        }
        .gm-style div:focus, .gm-style button:focus {
          outline: none !important;
        }
      `}</style>

      {/* Header: back + title, search bar below */}
      <div className="bg-white px-4 pt-3 pb-3 shadow-sm z-[400]">
        <div className="flex items-center gap-2">
          <button onClick={onClose} className="p-2 -ml-2 text-slate-700 active:scale-95 transition-transform" aria-label="Go back">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-[17px] font-bold text-slate-900">Select delivery location</h1>
        </div>

        <div className="mt-2.5 relative">
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search for area, street name..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full bg-slate-100 rounded-xl py-3 pl-11 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-[#00bd6f] transition-all text-slate-950"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setPredictions([]);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-slate-200 text-slate-500 rounded-full hover:bg-slate-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Autocomplete Predictions Dropdown */}
          {predictions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[500] max-h-60 overflow-y-auto">
              {predictions.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPrediction(p)}
                  className="w-full px-4 py-3 text-left hover:bg-slate-50 border-b border-slate-100 last:border-0 flex items-start gap-3 transition-colors"
                >
                  <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {p.mainText}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {p.secondaryText || p.fullText}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Map Area */}
      <LocationMapCanvas
        center={mapCenter}
        isMoving={isMoving}
        isLocating={isLocating}
        onLocateMe={handleLocateMe}
        onCenterChange={(lat, lng) => {
          setMapCenter({ lat, lng });
          updateAddressFromLatLng(lat, lng);
        }}
        mapRef={mapRef}
      />

      {/* Bottom Sheet: Delivery details */}
      <div className="bg-white rounded-t-3xl shadow-2xl z-30 border-t border-slate-100 animate-[slideUp_0.3s_ease-out]">
        {/* Drag handle */}
        <div className="mx-auto mt-3 mb-1 h-1 w-10 rounded-full bg-slate-200" />

        <div className="px-5 pt-1 pb-8 space-y-4 max-h-[46vh] overflow-y-auto no-scrollbar">
          {/* Section title */}
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Delivery details</p>

          {/* Address card (tap to search) */}
          <button
            onClick={() => searchInputRef.current?.focus()}
            className="w-full flex items-center gap-3 bg-white border border-slate-200 rounded-2xl p-3.5 text-left hover:border-slate-300 active:scale-[0.99] transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
              <DropPin className="w-6 h-7" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-bold text-slate-900 truncate">{selectedAddress.title}</p>
              <p className="text-[13px] text-slate-500 leading-snug line-clamp-2 mt-0.5">{selectedAddress.subtitle}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
          </button>

          <AddressDetailsFields
            building={building}
            onBuildingChange={setBuilding}
            street={street}
            onStreetChange={setStreet}
          />

          {/* Address Type Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">Save address as</label>
            <div className="flex gap-2">
              {[
                { label: 'Home', icon: Home },
                { label: 'Work', icon: Briefcase },
                { label: 'Other', icon: MapPin },
              ].map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  onClick={() => setAddressType(label)}
                  className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    addressType === label
                      ? 'border-green-500 bg-green-50 text-green-700 shadow-sm'
                      : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {addressType === 'Other' && (
              <input
                type="text"
                placeholder="e.g. Friend's Place, Gym"
                value={customAddressType}
                onChange={(e) => setCustomAddressType(e.target.value)}
                className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-green-500"
              />
            )}
          </div>

          {/* Receiver Contact Details */}
          <div className="pt-2 border-t border-slate-100 space-y-2.5">
            <p className="text-xs font-bold text-slate-700">Receiver details for</p>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useAccountDetails}
                onChange={(e) => setUseAccountDetails(e.target.checked)}
                className="w-4 h-4 accent-green-600 rounded"
              />
              <span className="text-xs font-semibold text-slate-700">Use my profile details for delivery contact</span>
            </label>

            {!useAccountDetails && (
              <div className="grid grid-cols-2 gap-2 animate-in fade-in">
                <input
                  type="text"
                  placeholder="Receiver's Name"
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-green-500"
                />
                <input
                  type="tel"
                  placeholder="Receiver's Phone"
                  value={receiverPhone}
                  onChange={(e) => setReceiverPhone(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-green-500"
                />
              </div>
            )}
          </div>

          {/* Save Address Button */}
          <button
            onClick={handleFinalSave}
            className="w-full bg-[#00bd6f] hover:bg-[#00a862] text-white py-4 rounded-2xl font-bold text-[15px] shadow-md shadow-green-500/20 active:scale-[0.99] transition-all"
          >
            Save address
          </button>
        </div>
      </div>

      {/* Location permission modal (replaces the old alert()) */}
      {showLocationModal && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/50 backdrop-blur-[2px] px-6">
          <div className="w-full max-w-[340px] bg-white rounded-3xl shadow-2xl p-6 text-center animate-[slideUp_0.25s_ease-out]">
            <div className="mx-auto w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
              <DropPin className="w-7 h-[32px]" />
            </div>

            <h3 className="text-[16px] font-bold text-slate-900 mt-4">
              {locationError
                ? (isGpsOff ? 'Turn on Location' : 'Location access needed')
                : 'Allow location access?'
              }
            </h3>
            <p className="text-[13px] text-slate-500 mt-1.5 leading-relaxed">
              {locationError
                ? locationError
                : 'Crevings needs your location to drop the pin at your exact delivery address.'}
            </p>

            {isLocating && (
              <div className="mt-4 flex items-center justify-center gap-2 text-[13px] font-bold text-[#00bd6f]">
                <Loader2 className="w-4 h-4 animate-spin" />
                Getting your location...
              </div>
            )}

            {locationError ? (
              <div className="mt-5 space-y-2">
                {isCapacitorNative() && isGpsOff && (
                  <button
                    onClick={openDeviceLocationSettings}
                    disabled={isLocating}
                    className="w-full bg-[#00bd6f] hover:bg-[#00a862] text-white py-3 rounded-xl font-bold text-[13px] active:scale-[0.99] transition-all disabled:opacity-60"
                  >
                    Turn on GPS
                  </button>
                )}
                {isCapacitorNative() && !isGpsOff && (
                  <button
                    onClick={openLocationSettings}
                    disabled={isLocating}
                    className="w-full bg-[#00bd6f] hover:bg-[#00a862] text-white py-3 rounded-xl font-bold text-[13px] active:scale-[0.99] transition-all disabled:opacity-60"
                  >
                    Open Settings
                  </button>
                )}
                <button
                  onClick={handleAllowLocation}
                  disabled={isLocating}
                  className="w-full border border-slate-200 text-slate-700 py-3 rounded-xl font-bold text-[13px] hover:bg-slate-50 active:scale-[0.99] transition-all disabled:opacity-60"
                >
                  {isLocating ? 'Requesting...' : 'Try Again'}
                </button>
                <button
                  onClick={() => { setShowLocationModal(false); setLocationError(null); setIsGpsOff(false); }}
                  className="w-full py-2 text-slate-400 text-[12px] font-semibold"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => setShowLocationModal(false)}
                  className="flex-1 border border-slate-200 text-slate-700 py-3 rounded-xl font-bold text-[13px] hover:bg-slate-50 active:scale-[0.99] transition-all"
                >
                  Not now
                </button>
                <button
                  onClick={handleAllowLocation}
                  disabled={isLocating}
                  className="flex-1 bg-[#00bd6f] hover:bg-[#00a862] text-white py-3 rounded-xl font-bold text-[13px] shadow-md shadow-green-500/20 active:scale-[0.99] transition-all disabled:opacity-60"
                >
                  Allow
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
