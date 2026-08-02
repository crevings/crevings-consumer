import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Search, MapPin, Crosshair, Navigation, CheckCircle2, Home, Briefcase, X, Loader2 } from 'lucide-react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const libraries: ("places" | "marker" | "geometry")[] = ["places", "marker", "geometry"];

interface PredictionItem {
  id: string;
  mainText: string;
  secondaryText: string;
  fullText: string;
  suggestionObj?: any;
}

interface MapLocationPickerViewProps {
  initialLocation?: { title: string, subtitle: string, coords: [number, number] } | null;
  onClose: () => void;
  onConfirm: (address: { 
    type: string; 
    address: string;
    building?: string;
    street?: string;
    coordinates?: { lat: number; lng: number };
  }) => void;
}

export const MapLocationPickerView: React.FC<MapLocationPickerViewProps> = ({ initialLocation, onClose, onConfirm }) => {
  const [isMoving, setIsMoving] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [useAccountDetails, setUseAccountDetails] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressType, setAddressType] = useState('Home');
  const [customAddressType, setCustomAddressType] = useState('');
  const [searchQuery, setSearchQuery] = useState(initialLocation?.title || '');
  const [predictions, setPredictions] = useState<PredictionItem[]>([]);

  const [mapCenter, setMapCenter] = useState<{ lat: number, lng: number }>(() => {
    if (initialLocation && initialLocation.coords) {
      return { lat: initialLocation.coords[0], lng: initialLocation.coords[1] };
    }
    return { lat: 18.5822, lng: 73.9197 }; // Default Pune Airport
  });

  const [selectedAddress, setSelectedAddress] = useState({
    title: initialLocation?.title || 'Pune International Airport',
    subtitle: initialLocation?.subtitle || 'New Airport Road, Pune International Airport Area, Lohegaon, Pune, Maharashtra 411032, India'
  });

  const isDragging = useRef(false);
  const mapRef = useRef<google.maps.Map | null>(null);

  // Form Fields
  const [building, setBuilding] = useState('');
  const [street, setStreet] = useState('');
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
      if (google.maps.places && (google.maps.places as any).AutocompleteSuggestion) {
        const { AutocompleteSuggestion } = (google.maps.places as any);
        const response = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input: q,
          componentRestrictions: { country: "in" },
        });

        if (response && response.suggestions && response.suggestions.length > 0) {
          const mapped: PredictionItem[] = response.suggestions.map((s: any) => {
            const p = s.placePrediction;
            return {
              id: p.placeId || Math.random().toString(),
              mainText: p.mainText?.text || p.text?.text || q,
              secondaryText: p.secondaryText?.text || "",
              fullText: p.text?.text || q,
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
              mainText: titleComponent ? titleComponent.long_name : res.formatted_address.split(',')[0],
              secondaryText: res.formatted_address,
              fullText: res.formatted_address,
            };
          });
          setPredictions(mapped);
        } else {
          setPredictions([]);
        }
      });
    } catch (e) {
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
    if (window.google && google.maps.places && (google.maps.places as any).Place) {
      try {
        const PlaceClass = (google.maps.places as any).Place;
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

  const handleCameraIdle = () => {
    if (mapRef.current && isDragging.current) {
      const center = mapRef.current.getCenter();
      if (center) {
        const lat = center.lat();
        const lng = center.lng();
        setMapCenter({ lat, lng });
        updateAddressFromLatLng(lat, lng);
      }
      isDragging.current = false;
    }
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      setPermissionGranted(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setMapCenter(newPos);
          mapRef.current?.panTo(newPos);
          updateAddressFromLatLng(newPos.lat, newPos.lng);
        },
        (error) => {
          console.error("Error getting location", error);
          setPermissionGranted(false);
          alert("Could not access your location. Please check browser permissions.");
        }
      );
    }
  };

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
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-[400] bg-white shadow-sm px-4 py-3 flex items-center gap-3">
        <button onClick={onClose} className="p-2 -ml-2 text-slate-700 active:scale-95 transition-transform">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 relative">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input 
              type="text" 
              placeholder="Search for area or address"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full bg-slate-100 rounded-xl py-3 pl-10 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-[#00bd6f] transition-all text-slate-950"
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
      <div className="flex-1 relative overflow-hidden mt-[72px] z-0">
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={mapCenter}
          zoom={15}
          onLoad={(map) => { mapRef.current = map; }}
          onDragStart={() => { isDragging.current = true; }}
          onIdle={handleCameraIdle}
          options={{
            disableDefaultUI: true,
            zoomControl: false,
            gestureHandling: "greedy"
          }}
        />

        {/* Center Pin Overlay (draggable via map panning) */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10 pb-8">
          <div className="relative flex flex-col items-center">
            {/* Pulsing Target Dot on Ground */}
            <div className="w-3 h-1.5 bg-black/20 rounded-full blur-[1px] animate-pulse mb-[-2px]" />
            
            {/* Custom Google Maps Location Pin */}
            <div className={`transition-transform duration-200 ${isMoving ? '-translate-y-3 scale-110' : 'translate-y-0 scale-100'}`}>
              <div className="w-12 h-12 bg-red-500 rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white relative">
                <MapPin className="w-6 h-6 fill-white text-red-500" />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-red-500" />
              </div>
            </div>

            {/* Address Pill Overlay above Pin */}
            <div className="absolute bottom-16 bg-slate-900/90 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-lg whitespace-nowrap flex items-center gap-1.5">
              {isMoving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-green-400" />
                  <span>Locating...</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
                  <span>Order will be delivered here</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Locate Me Floating Action Button */}
        <button
          onClick={handleLocateMe}
          className="absolute right-4 bottom-6 z-20 bg-white text-slate-800 p-3.5 rounded-2xl shadow-xl border border-slate-100 hover:bg-slate-50 active:scale-95 transition-all flex items-center gap-2 font-semibold text-xs"
        >
          <Crosshair className="w-5 h-5 text-green-600" />
          <span>Locate Me</span>
        </button>
      </div>

      {/* Bottom Sheet for Confirming Address */}
      <div className="bg-white rounded-t-3xl shadow-2xl px-6 pt-5 pb-8 z-30 border-t border-slate-100 animate-[slideUp_0.3s_ease-out]">
        {!showAddressForm ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-green-50 rounded-2xl text-green-600 mt-1 shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-slate-900 truncate">{selectedAddress.title}</h3>
                <p className="text-xs font-medium text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                  {selectedAddress.subtitle}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowAddressForm(true)}
              className="w-full bg-[#00bd6f] hover:bg-[#00a862] text-white py-3.5 rounded-2xl font-bold text-sm shadow-md shadow-green-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <span>Confirm Location & Enter Address Details</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4 max-h-[75vh] overflow-y-auto no-scrollbar pt-1">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Enter Address Details</h3>
                <p className="text-xs text-slate-500 font-medium">Save complete address for faster delivery</p>
              </div>
              <button 
                onClick={() => setShowAddressForm(false)}
                className="p-1.5 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

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

            {/* Building / House No */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">House / Flat / Block No.</label>
              <input
                type="text"
                placeholder="e.g. Flat 402, Block A"
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-green-500"
              />
            </div>

            {/* Apartment / Street / Area */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Apartment / Road / Area Name</label>
              <input
                type="text"
                placeholder="e.g. Green Valley Society, MG Road"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:border-green-500"
              />
            </div>

            {/* Receiver Contact Details Toggle */}
            <div className="pt-2 border-t border-slate-100">
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
                <div className="grid grid-cols-2 gap-2 mt-3 animate-in fade-in">
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

            {/* Final Save Address Button */}
            <button
              onClick={handleFinalSave}
              className="w-full bg-[#00bd6f] hover:bg-[#00a862] text-white py-3.5 rounded-2xl font-bold text-sm shadow-md shadow-green-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-4"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Save & Proceed</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
