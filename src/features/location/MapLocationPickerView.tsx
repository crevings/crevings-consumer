import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowLeft, Search, MapPin, Crosshair, Navigation, CheckCircle2, Home, Briefcase, X, Loader2 } from 'lucide-react';
import { GoogleMap, useJsApiLoader, Autocomplete } from '@react-google-maps/api';

const libraries: ("places" | "marker" | "geometry")[] = ["places", "marker", "geometry"];

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
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

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

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const newPos = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };
        setMapCenter(newPos);
        setSelectedAddress({
          title: place.name || 'Selected Location',
          subtitle: place.formatted_address || ''
        });
        mapRef.current?.panTo(newPos);
      }
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
          <Autocomplete 
            onLoad={setAutocomplete} 
            onPlaceChanged={onPlaceChanged}
          >
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input 
                type="text" 
                placeholder="Search for area or address"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 rounded-xl py-3 pl-10 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-[#00bd6f] transition-all text-slate-950"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-slate-200 text-slate-500 rounded-full hover:bg-slate-300"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </Autocomplete>
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
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full z-[400] flex flex-col items-center pointer-events-none">
          <div className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-xl mb-2 whitespace-nowrap transition-all duration-300">
            {isMoving ? 'Fetching details...' : 'Order will be delivered here'}
            <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-slate-900"></div>
          </div>
          <MapPin className="w-10 h-10 text-green-600 fill-green-600/30" />
        </div>

        {/* Current Location Button */}
        <div className="absolute bottom-6 right-4 z-[400] flex flex-col gap-3">
          <button 
            onClick={handleLocateMe}
            className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-700 hover:text-[#00BD6F] active:scale-95 transition-all"
          >
            <Crosshair className="w-4 h-4" />
          </button>

          {/* Grant Permission Toggle Indicator */}
          <button 
            onClick={() => setPermissionGranted(!permissionGranted)}
            className={`flex items-center justify-center gap-1 px-3 h-10 rounded-full shadow-lg text-[10px] font-bold transition-all ${permissionGranted ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-white text-slate-700 border border-slate-200'}`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            {permissionGranted ? 'GPS Active' : 'GPS Off'}
          </button>
        </div>
      </div>

      {/* Bottom Sheet */}
      <div className="bg-white rounded-t-[24px] shadow-[0_-10px_40px_rgba(0,0,0,0.08)] relative z-[500] px-4 pt-5 pb-6 transition-all duration-300">
        {!showAddressForm ? (
          <>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {isMoving ? 'Locating...' : 'Select Delivery Location'}
              </h3>
            </div>

            <div className="flex gap-3 mb-5 items-start bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="mt-0.5 shrink-0">
                <div className="w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-[#00bd6f] fill-[#00bd6f]/20" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-base font-bold text-slate-900 mb-0.5">{isMoving ? 'Fetching address...' : selectedAddress.title}</h2>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {isMoving ? 'Please wait while we locate you' : selectedAddress.subtitle}
                </p>
              </div>
            </div>

            <button 
              onClick={() => setShowAddressForm(true)}
              disabled={isMoving}
              className={`w-full font-bold text-sm py-3 rounded-xl active:scale-[0.98] transition-all ${isMoving ? 'bg-slate-200 text-slate-400' : 'bg-[#00bd6f] text-white hover:bg-[#00a35f]'}`}
            >
              Confirm Location
            </button>
          </>
        ) : (
          <div className="animate-[fadeIn_0.3s_ease-out] max-h-[70vh] overflow-y-auto no-scrollbar">
            {/* Header & Change button */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Location Details</h2>
              <button 
                onClick={() => setShowAddressForm(false)} 
                className="text-sm font-bold text-[#00bd6f] hover:text-green-700 transition-colors"
              >
                Change
              </button>
            </div>

            {/* Address Type Selector Pills */}
            <div className="mb-5">
              <div className="flex gap-3">
                <button 
                  onClick={() => setAddressType('Home')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs transition-all border ${addressType === 'Home' ? 'bg-slate-900 border-slate-900 text-white shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
                >
                  <Home className="w-3.5 h-3.5" />
                  House
                </button>
                <button 
                  onClick={() => setAddressType('Work')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs transition-all border ${addressType === 'Work' ? 'bg-slate-900 border-slate-900 text-white shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  Office
                </button>
                <button 
                  onClick={() => setAddressType('Other')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs transition-all border ${addressType === 'Other' ? 'bg-slate-900 border-slate-900 text-white shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Other
                </button>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              {/* Building / Floor Input */}
              <div>
                <input 
                  type="text" 
                  placeholder="Building / Floor *"
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl py-3.5 px-4 text-[14px] focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-[#00bd6f] transition-all font-medium text-slate-950 placeholder:text-slate-400"
                  required
                />
              </div>
             
              {/* Street Input */}
              <div>
                <input 
                  type="text" 
                  placeholder="Street (Recommended)"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl py-3.5 px-4 text-[14px] focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-[#00bd6f] transition-all font-medium text-slate-950 placeholder:text-slate-400"
                />
              </div>

              {/* Area / Locality Swiggy-Style Field with Map Thumbnail */}
              <div className="flex gap-3 items-stretch">
                <div className="flex-1 relative border border-slate-200 rounded-xl px-4 py-3 bg-slate-50/50 flex flex-col justify-center">
                  <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Area/Locality
                  </span>
                  <p className="text-[13px] text-slate-600 font-bold leading-relaxed line-clamp-2 pr-2 pt-1">
                    {selectedAddress.subtitle}
                  </p>
                </div>
                
                <button 
                  onClick={() => setShowAddressForm(false)}
                  className="w-[76px] h-[76px] bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shrink-0 relative flex flex-col items-center justify-center group active:scale-95 transition-all"
                >
                  <div className="absolute inset-0 bg-slate-50 flex items-center justify-center opacity-40">
                    <div className="w-full h-full relative bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:12px_12px]" />
                  </div>
                  <div className="relative z-10 flex flex-col items-center justify-center">
                    <MapPin className="w-5 h-5 text-[#00bd6f] fill-[#00bd6f]/20" />
                    <span className="text-[11px] font-bold text-[#00bd6f] mt-0.5">Change</span>
                  </div>
                </button>
              </div>

              {/* Save Address As Input (Shown when address type is Custom/Other) */}
              {addressType === 'Other' && (
                <div className="animate-[fadeIn_0.2s_ease-out]">
                  <input 
                    type="text" 
                    placeholder="Save address as *"
                    value={customAddressType}
                    onChange={(e) => setCustomAddressType(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl py-3.5 px-4 text-[14px] focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-[#00bd6f] transition-all font-medium text-slate-950 placeholder:text-slate-400"
                    required
                  />
                </div>
              )}

              {/* Receiver Details */}
              <div className="pt-4 border-t border-slate-100 mt-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-slate-900">Receiver Details</span>
                  <button 
                    onClick={() => setUseAccountDetails(!useAccountDetails)}
                    className="flex items-center gap-2 text-xs font-bold text-slate-600 active:scale-95 transition-transform"
                  >
                    <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${useAccountDetails ? 'bg-[#00bd6f] border-[#00bd6f]' : 'border-slate-300'}`}>
                      {useAccountDetails && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </div>
                    Use my account details
                  </button>
                </div>
                
                {!useAccountDetails && (
                  <div className="space-y-3 animate-[fadeIn_0.2s_ease-out]">
                    <input 
                      type="text" 
                      placeholder="Receiver Name"
                      value={receiverName}
                      onChange={(e) => setReceiverName(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl py-3.5 px-4 text-[14px] focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-[#00bd6f] transition-all font-medium text-slate-950 placeholder:text-slate-400"
                    />
                    <input 
                      type="tel" 
                      placeholder="Receiver Phone Number"
                      value={receiverPhone}
                      onChange={(e) => setReceiverPhone(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl py-3.5 px-4 text-[14px] focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-[#00bd6f] transition-all font-medium text-slate-950 placeholder:text-slate-400"
                    />
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={handleFinalSave}
              disabled={building.trim() === ''}
              className={`w-full text-white font-bold text-base py-4 rounded-xl active:scale-[0.98] transition-all shadow-md ${building.trim() === '' ? 'bg-slate-300 cursor-not-allowed' : 'bg-[#00bd6f] hover:bg-[#00a35f]'}`}
            >
              Save Address
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
