import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Search, MapPin, Crosshair, Navigation, CheckCircle2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom pin icon
const customIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMkM4LjEzIDIgNSA1LjEzIDUgOUM1IDE0LjI1IDEyIDIyIDEyIDIyQzEyIDIyIDE5IDE0LjI1IDE5IDlDMTkgNS4xMyAxNS44NyAyIDEyIDJaTTEyIDExLjVDMTAuNjIgMTEuNSA5LjUgMTAuMzggOS41IDlDOS41IDcuNjIgMTAuNjIgNi41IDEyIDYuNUMxMy4zOCA2LjUgMTQuNSA3LjYyIDE0LjUgOUMxNC41IDEwLjM4IDEzLjM4IDExLjUgMTIgMTEuNVoiIGZpbGw9IiMwMGJkNmYiLz48L3N2Zz4=',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

interface MapLocationPickerViewProps {
  initialLocation?: { title: string, subtitle: string, coords: [number, number] } | null;
  onClose: () => void;
  onConfirm: (address: { type: string, address: string }) => void;
}

// Component to handle map center updates
const MapUpdater = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);
  return null;
};

const MapEvents = ({ onMoveStart, onMoveEnd }: { onMoveStart: () => void, onMoveEnd: () => void }) => {
  useMapEvents({
    movestart: onMoveStart,
    moveend: onMoveEnd,
  });
  return null;
};

export const MapLocationPickerView: React.FC<MapLocationPickerViewProps> = ({ initialLocation, onClose, onConfirm }) => {
  const [isMoving, setIsMoving] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [useAccountDetails, setUseAccountDetails] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressType, setAddressType] = useState('Home');
  const [searchQuery, setSearchQuery] = useState(initialLocation?.title || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>(initialLocation?.coords || [18.5822, 73.9197]); // Default Pune Airport
  const [selectedAddress, setSelectedAddress] = useState({
    title: initialLocation?.title || 'Pune International Airport',
    subtitle: initialLocation?.subtitle || 'New Airport Road, Pune International Airport Area, Lohegaon, Pune, Maharashtra 411032, India'
  });

  const searchSuggestions = [
    { id: 1, title: 'Koregaon Park', subtitle: 'Pune, Maharashtra', coords: [18.5362, 73.8939] as [number, number] },
    { id: 2, title: 'Viman Nagar', subtitle: 'Pune, Maharashtra', coords: [18.5679, 73.9143] as [number, number] },
    { id: 3, title: 'Baner', subtitle: 'Pune, Maharashtra', coords: [18.5590, 73.7868] as [number, number] },
    { id: 4, title: 'Kalyani Nagar', subtitle: 'Pune, Maharashtra', coords: [18.5482, 73.9033] as [number, number] },
    { id: 5, title: 'Hinjewadi', subtitle: 'Pune, Maharashtra', coords: [18.5913, 73.7389] as [number, number] },
  ];

  const handleSuggestionClick = (suggestion: typeof searchSuggestions[0]) => {
    setMapCenter(suggestion.coords);
    setSelectedAddress({
      title: suggestion.title,
      subtitle: suggestion.subtitle
    });
    setSearchQuery(suggestion.title);
    setShowSuggestions(false);
  };

  return (
    <div className="fixed inset-0 z-[110] bg-[#e8eaed] flex flex-col animate-[slideInRight_0.3s_ease-out]">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-[400] bg-white shadow-sm px-4 py-3 flex items-center gap-3">
        <button onClick={onClose} className="p-2 -ml-2 text-slate-700 active:scale-95 transition-transform">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input 
            type="text" 
            placeholder="Search for area or address"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            className="w-full bg-slate-100 rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
          />
          
          {/* Autocomplete Suggestions */}
          {showSuggestions && searchQuery.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-[500]">
              {searchSuggestions.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.subtitle.toLowerCase().includes(searchQuery.toLowerCase())).map((suggestion, idx, arr) => (
                <button 
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`w-full flex items-center gap-3 p-3 hover:bg-slate-50 active:bg-slate-100 transition-all text-left ${idx !== arr.length - 1 ? 'border-b border-slate-100' : ''}`}
                >
                  <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">{suggestion.title}</h4>
                    <p className="text-xs text-slate-500 truncate">{suggestion.subtitle}</p>
                  </div>
                </button>
              ))}
              {searchSuggestions.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.subtitle.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                <div className="p-4 text-center text-slate-500 text-sm">No results found</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative overflow-hidden mt-[72px] z-0">
        <MapContainer center={mapCenter} zoom={15} zoomControl={false} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <MapUpdater center={mapCenter} />
          <MapEvents onMoveStart={() => setIsMoving(true)} onMoveEnd={() => setIsMoving(false)} />
          <Marker position={mapCenter} icon={customIcon} />
        </MapContainer>

        {/* Center Pin Overlay (for visual effect when moving map) */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full z-[400] flex flex-col items-center pointer-events-none">
          <div className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-xl mb-2 whitespace-nowrap transition-all duration-300">
            {isMoving ? 'Place the pin at exact delivery location' : 'Order will be delivered here'}
            <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-slate-900"></div>
          </div>
        </div>

        {/* Current Location Button */}
        <div className="absolute bottom-6 right-4 z-[400]">
          <button 
            onClick={() => {
              setMapCenter([18.5822, 73.9197]);
              setSelectedAddress({
                title: 'Pune International Airport',
                subtitle: 'New Airport Road, Pune International Airport Area, Lohegaon, Pune, Maharashtra 411032, India'
              });
              setSearchQuery('');
            }}
            className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-700 hover:text-[#00BD6F] active:scale-95 transition-all"
          >
            <Navigation className="w-4 h-4" />
          </button>
        </div>

        {/* Grant Permission Toggle */}
        <div className="absolute top-20 right-4 z-[400]">
          <button 
            onClick={() => setPermissionGranted(!permissionGranted)}
            className={`flex items-center gap-1 px-2 py-1 rounded-full shadow-sm text-[9px] font-bold transition-all ${permissionGranted ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-white text-slate-700 border border-slate-200'}`}
          >
            <Crosshair className="w-2.5 h-2.5" />
            {permissionGranted ? 'Location On' : 'Enable Location'}
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
          <div className="animate-[fadeIn_0.3s_ease-out]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Enter address details</h2>
              <button onClick={() => setShowAddressForm(false)} className="text-sm font-bold text-green-600">Change</button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <input 
                  type="text" 
                  placeholder="House / Flat / Block No."
                  className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium text-slate-900"
                />
              </div>
              <div>
                <input 
                  type="text" 
                  placeholder="Apartment / Road / Area"
                  className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium text-slate-900"
                />
              </div>
              <div>
                <input 
                  type="text" 
                  placeholder="Directions to reach (Optional)"
                  className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium placeholder:text-slate-400 text-slate-900"
                />
              </div>
              
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Save As</label>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setAddressType('Home')}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-colors ${addressType === 'Home' ? 'border-2 border-green-500 bg-green-50 text-green-700' : 'border border-slate-200 text-slate-600'}`}
                  >
                    Home
                  </button>
                  <button 
                    onClick={() => setAddressType('Work')}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-colors ${addressType === 'Work' ? 'border-2 border-green-500 bg-green-50 text-green-700' : 'border border-slate-200 text-slate-600'}`}
                  >
                    Work
                  </button>
                  <button 
                    onClick={() => setAddressType('Other')}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-colors ${addressType === 'Other' ? 'border-2 border-green-500 bg-green-50 text-green-700' : 'border border-slate-200 text-slate-600'}`}
                  >
                    Other
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-slate-900">Receiver Details</span>
                  <button 
                    onClick={() => setUseAccountDetails(!useAccountDetails)}
                    className="flex items-center gap-2 text-sm font-medium text-slate-600"
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${useAccountDetails ? 'bg-green-600 border-green-600' : 'border-slate-300'}`}>
                      {useAccountDetails && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </div>
                    Use my account details
                  </button>
                </div>
                
                {!useAccountDetails && (
                  <div className="space-y-3 animate-[fadeIn_0.2s_ease-out]">
                    <input 
                      type="text" 
                      placeholder="Receiver Name"
                      className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium text-slate-900"
                    />
                    <input 
                      type="tel" 
                      placeholder="Receiver Phone Number"
                      className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium text-slate-900"
                    />
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={() => onConfirm({ type: addressType, address: selectedAddress.subtitle })}
              className="w-full bg-green-700 text-white font-bold text-lg py-4 rounded-2xl active:scale-[0.98] transition-all shadow-md"
            >
              Save Address
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
