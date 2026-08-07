import React, { useState, useMemo, useEffect } from 'react';
import { Search, Home, MapPin, Briefcase, MoreVertical, ArrowLeft, Navigation, ChevronRight, ChevronDown, ChevronUp, Edit2, Trash2, X, Loader2 } from 'lucide-react';
import { MapLocationPickerView } from "@/features/location/MapLocationPickerView";
import { EditAddressView } from '@/features/location/EditAddressView';
import { motion, AnimatePresence } from 'motion/react';

import { SavedAddress } from '@/types';
import { get } from "@/api/fetcher";

interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  coords?: [number, number];
  placeId?: string;
}

function uuidv7(): string {
  const now = Date.now();
  const hexTime = now.toString(16).padStart(12, '0');
  
  let hexRandom = '';
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const randomBytes = new Uint8Array(10);
    crypto.getRandomValues(randomBytes);
    randomBytes[0] = ((randomBytes[0] ?? 0) & 0x0f) | 0x70;
    randomBytes[2] = ((randomBytes[2] ?? 0) & 0x3f) | 0x80;
    hexRandom = Array.from(randomBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  } else {
    for (let i = 0; i < 20; i++) {
      let val = Math.floor(Math.random() * 16);
      if (i === 0) val = 7;
      if (i === 4) val = (val & 0x3) | 0x8;
      hexRandom += val.toString(16);
    }
  }
    
  return [
    hexTime.slice(0, 8),
    hexTime.slice(8, 12),
    hexRandom.slice(0, 4),
    hexRandom.slice(4, 8),
    hexRandom.slice(8)
  ].join('-');
}

interface LocationPickerViewProps {
  addresses: SavedAddress[];
  setAddresses: React.Dispatch<React.SetStateAction<SavedAddress[]>>;
  onSelectLocation?: (location: { type: string, address: string }) => void;
  onClose?: () => void;
}

export const LocationPickerView: React.FC<LocationPickerViewProps> = ({ addresses, setAddresses, onSelectLocation, onClose }) => {
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [selectedInitialLocation, setSelectedInitialLocation] = useState<{ title: string, subtitle: string, coords: [number, number] } | null>(null);
  const [showEditAddress, setShowEditAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSearchingLocations, setIsSearchingLocations] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [showAllAddresses, setShowAllAddresses] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Filter saved addresses matching searchQuery
  const matchingSavedAddresses = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return (addresses || []).filter(
      a => a.type.toLowerCase().includes(q) || 
           a.address.toLowerCase().includes(q) || 
           (a.building && a.building.toLowerCase().includes(q)) || 
           (a.street && a.street.toLowerCase().includes(q))
    );
  }, [searchQuery, addresses]);

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

  interface NominatimResult {
    display_name?: string;
    place_id?: string;
    osm_id?: string;
    lat?: string;
    lon?: string;
  }

  // Dynamic location search effect (Google Places / Nominatim API)
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q || q.length < 2) {
      setSearchResults([]);
      setIsSearchingLocations(false);
      return;
    }

    setIsSearchingLocations(true);
    const timer = setTimeout(async () => {
      // 1. Modern Google Places API v2: AutocompleteSuggestion (replaces deprecated AutocompleteService)
      const placesApi = window.google?.maps?.places as unknown as {
        AutocompleteSuggestion?: {
          fetchAutocompleteSuggestions: (options: { input: string; componentRestrictions: { country: string } }) => Promise<AutocompleteSuggestionResponse>;
        };
      } | undefined;
      if (placesApi?.AutocompleteSuggestion) {
        try {
          const { AutocompleteSuggestion } = placesApi;
          const response = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
            input: q,
            componentRestrictions: { country: 'in' },
          });

          if (response && response.suggestions && response.suggestions.length > 0) {
            setIsSearchingLocations(false);
            const results: SearchResultItem[] = response.suggestions.map((s, idx: number) => {
              const p = s.placePrediction;
              return {
                id: p?.placeId || String(idx),
                title: p?.mainText?.text || p?.text?.text || q,
                subtitle: p?.secondaryText?.text || '',
                placeId: p?.placeId,
              };
            });
            setSearchResults(results);
            return;
          }
        } catch (err) {
          console.warn('[LocationPicker] AutocompleteSuggestion warning:', err);
        }
      }

      // 2. OpenStreetMap Nominatim real-time search API
      try {
        const data = await get<NominatimResult[]>(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&countrycodes=in&limit=8`
        );
        setIsSearchingLocations(false);
        if (Array.isArray(data)) {
          const results: SearchResultItem[] = data.map((item) => {
            const parts = (item.display_name || '').split(',');
            const title = parts[0] ? parts[0].trim() : (item.display_name || q);
            const subtitle = parts.slice(1).join(',').trim();
            return {
              id: String(item.place_id || item.osm_id || Math.random()),
              title,
              subtitle,
              coords: [parseFloat(item.lat || "0"), parseFloat(item.lon || "0")] as [number, number],
            };
          });
          setSearchResults(results);
        }
      } catch (err) {
        console.warn('[LocationPicker] Geocoding API search error:', err);
        setIsSearchingLocations(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectSearchResult = (result: SearchResultItem) => {
    if (result.coords) {
      setSelectedInitialLocation({
        title: result.title,
        subtitle: result.subtitle,
        coords: result.coords,
      });
      setShowMapPicker(true);
    } else if (result.placeId && typeof window !== 'undefined' && window.google?.maps?.Geocoder) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ placeId: result.placeId }, (results, status) => {
        if (status === 'OK' && results?.[0]?.geometry?.location) {
          const loc = results[0].geometry.location;
          setSelectedInitialLocation({
            title: result.title,
            subtitle: result.subtitle,
            coords: [loc.lat(), loc.lng()],
          });
        } else {
          setSelectedInitialLocation({
            title: result.title,
            subtitle: result.subtitle,
            coords: [28.6139, 77.2090], // Fallback default center
          });
        }
        setShowMapPicker(true);
      });
    } else {
      setSelectedInitialLocation({
        title: result.title,
        subtitle: result.subtitle,
        coords: [28.6139, 77.2090],
      });
      setShowMapPicker(true);
    }
  };

  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setAddresses(addresses.filter(a => a.id !== id));
    setActiveMenuId(null);
  };

  const handleEdit = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveMenuId(null);
    const addr = addresses.find(a => a.id === id);
    if (addr) {
      setEditingAddress(addr);
      setShowEditAddress(true);
    }
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(a => ({
      ...a,
      isDefault: a.id === id,
      icon: a.icon || Home
    })));
    setActiveMenuId(null);
    const selected = addresses.find(a => a.id === id);
    if (selected && onSelectLocation) {
      onSelectLocation({ type: selected.type, address: selected.address });
    }
    onClose?.();
  };

  if (isInitialLoading) {
    return (
      <div className="fixed inset-0 bg-white z-[100] flex flex-col overflow-hidden">
        <div className="bg-white pt-safe pb-4 px-4 sticky top-0 z-20 border-b border-slate-100">
           <div className="flex items-center gap-3 mt-4 px-2">
             <div className="w-[32px] h-[32px] bg-slate-100 rounded-full animate-pulse shrink-0"></div>
             <div className="h-5 w-1/3 bg-slate-100 rounded-md animate-pulse"></div>
           </div>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-5 pb-10">
           <div className="h-[54px] w-full bg-slate-100 rounded-[16px] mb-6 animate-pulse"></div>
           <div className="h-[80px] w-full bg-slate-100 rounded-[20px] mb-8 animate-pulse"></div>
           <div className="h-[18px] w-1/4 bg-slate-100 rounded-md mb-4 animate-pulse"></div>
           <div className="grid grid-cols-3 gap-3 mb-8">
             <div className="aspect-square bg-slate-100 rounded-[20px] animate-pulse"></div>
             <div className="aspect-square bg-slate-100 rounded-[20px] animate-pulse"></div>
             <div className="aspect-square bg-slate-100 rounded-[20px] animate-pulse"></div>
             <div className="aspect-square bg-slate-100 rounded-[20px] animate-pulse"></div>
             <div className="aspect-square bg-slate-100 rounded-[20px] animate-pulse"></div>
             <div className="aspect-square bg-slate-100 rounded-[20px] animate-pulse"></div>
           </div>
           <div className="h-[18px] w-1/3 bg-slate-100 rounded-md mb-4 animate-pulse mt-2"></div>
           <div className="h-[280px] w-full bg-slate-100 rounded-[24px] mb-4 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-white z-50 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="bg-white pt-safe pb-4 px-4 sticky top-0 z-20 border-b border-slate-100">
        <div className="flex items-center gap-4 mt-4">
          {addresses && addresses.length > 0 && (
            <button onClick={onClose} className="p-2 -ml-2 active:scale-95 transition-transform" aria-label="Go back">
              <ArrowLeft className="w-[22px] h-[22px] text-slate-800" strokeWidth={2.5} />
            </button>
          )}
          <h1 className="text-[18px] font-bold text-slate-900">Select Location</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-5 pb-10">
        {(!addresses || addresses.length === 0) && (
          <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-800 animate-in fade-in">
            <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs font-semibold">
              <p className="font-bold text-amber-900 text-sm mb-0.5">Delivery Address Required</p>
              Please add at least 1 delivery location to proceed using Crevings.
            </div>
          </div>
        )}
        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <Search className="w-5 h-5 stroke-[2]" />
          </div>
          <input 
            type="text" 
            placeholder="Search an area or address"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-[16px] py-[15px] pl-12 pr-12 text-[15px] focus:outline-none focus:border-[#00BD6F] focus:ring-1 focus:ring-[#00BD6F] transition-all font-medium placeholder:text-slate-400 text-slate-900 focus:bg-white"
          />
          {searchQuery.length > 0 && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 active:scale-95 transition-all"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
        </div>

        {searchQuery.length > 0 ? (
          <div className="bg-white rounded-[24px] border border-slate-100 overflow-hidden mb-8 shadow-sm">
            {/* Matching Saved Addresses */}
            {matchingSavedAddresses.length > 0 && (
              <div className="border-b border-slate-100 bg-emerald-50/40 p-3">
                <p className="text-[11px] font-bold text-[#00BD6F] uppercase tracking-wider px-2">Saved Addresses</p>
                {matchingSavedAddresses.map((addr) => (
                  <button
                    key={addr.id}
                    onClick={() => handleSetDefault(addr.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white transition-colors text-left mt-1"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                      <Home className="w-4 h-4 text-[#00BD6F]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 text-xs">{addr.type}</p>
                      <p className="text-[12px] text-slate-500 truncate">{addr.address}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Dynamic Search Results */}
            {searchResults.map((suggestion, idx, arr) => (
              <button 
                key={suggestion.id}
                onClick={() => handleSelectSearchResult(suggestion)}
                className={`w-full flex items-center gap-4 p-4 hover:bg-slate-50 active:bg-slate-100 transition-all text-left group ${idx !== arr.length - 1 ? 'border-b border-slate-100' : ''}`}
              >
                <div className="w-[40px] h-[40px] bg-[#00BD6F]/10 rounded-[14px] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#00BD6F] stroke-[2]" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <h4 className="font-bold text-slate-900 text-[14px] line-clamp-1">{suggestion.title}</h4>
                  <p className="text-[12px] text-slate-500 mt-0.5 line-clamp-2">{suggestion.subtitle}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </button>
            ))}

            {isSearchingLocations && (
              <div className="p-6 flex items-center justify-center gap-2 text-slate-500 text-xs font-medium">
                <Loader2 className="w-4 h-4 animate-spin text-[#00BD6F]" />
                Searching places...
              </div>
            )}

            {!isSearchingLocations && searchResults.length === 0 && matchingSavedAddresses.length === 0 && (
              <div className="p-8 text-center text-slate-500 text-[14px]">No location results found for "{searchQuery}"</div>
            )}
          </div>
        ) : (
          <>
            {/* Action Buttons Row */}
            <div className="mb-8">
              <button 
                onClick={() => {
                  setSelectedInitialLocation(null);
                  setShowMapPicker(true);
                }}
                className="w-full bg-white border border-slate-100 rounded-[20px] p-[18px] flex items-center justify-between active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-[46px] h-[46px] bg-[#00BD6F]/10 flex items-center justify-center rounded-[14px] shrink-0">
                    <MapPin className="w-[22px] h-[22px] text-[#00BD6F]" strokeWidth={2} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-[15px] font-bold text-slate-900">Pin on Map</h3>
                    <p className="text-[13px] text-slate-500 mt-0.5">Add a new address</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Saved Addresses Section */}
            <div>
              <h2 className="text-[17px] font-bold text-slate-900 mb-4 px-1">Saved Addresses</h2>
              
              <div className="flex flex-col gap-3">
                <AnimatePresence initial={false}>
                  {(showAllAddresses ? addresses : addresses.slice(0, 3)).map((addr) => {
                    const Icon = addr.icon || MapPin;
                    return (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        key={addr.id} 
                        onClick={() => handleSetDefault(addr.id)}
                        className={`bg-white rounded-[20px] border p-4 flex gap-4 cursor-pointer active:scale-[0.98] transition-all relative overflow-visible ${addr.isDefault ? 'border-[#00BD6F]/50 bg-[#00BD6F]/[0.02]' : 'border-slate-100 hover:border-slate-200'}`}
                      >
                        <div className="w-[42px] h-[42px] bg-slate-50 border border-slate-100 rounded-[12px] flex items-center justify-center shrink-0">
                          <Icon className="w-[20px] h-[20px] text-slate-700" strokeWidth={2} />
                        </div>
                        
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="text-[15px] font-bold text-slate-900">{addr.type}</h3>
                            {addr.isDefault && (
                              <span className="bg-[#00BD6F]/10 text-[#00BD6F] text-[10px] font-bold px-2 py-[2px] rounded uppercase tracking-wider shrink-0 break-keep">
                                Selected
                              </span>
                            )}
                          </div>
                          <p className="text-[13px] text-slate-500 leading-[1.4] line-clamp-2 pr-4 break-words whitespace-normal block mt-0.5">
                            {addr.address}
                          </p>

                        </div>
                        
                        <div className="shrink-0 flex items-center relative z-10 self-start">
                          <button 
                            onClick={(e) => toggleMenu(e, addr.id)}
                            className="text-slate-400 hover:text-slate-600 p-1.5 active:bg-slate-50 rounded-full transition-colors"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>

                          {/* Dropdown Menu */}
                          {activeMenuId === addr.id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setActiveMenuId(null); }} />
                              <div className="absolute right-0 top-10 w-48 bg-white rounded-xl border border-slate-100 py-2 shadow-lg animate-[fadeIn_0.2s_ease-out] z-20">
                                {!addr.isDefault && (
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSetDefault(addr.id);
                                    }}
                                    className="w-full px-4 py-2.5 text-left text-[14px] font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-3"
                                  >
                                    <MapPin className="w-4 h-4 text-[#00BD6F]" />
                                    Set as Default
                                  </button>
                                )}
                                <button 
                                  onClick={(e) => handleEdit(e, addr.id)}
                                  className="w-full px-4 py-2.5 text-left text-[14px] font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-3"
                                >
                                  <Edit2 className="w-4 h-4 text-slate-400" />
                                  Edit Address
                                </button>
                                <button 
                                  onClick={(e) => handleDelete(e, addr.id)}
                                  className="w-full px-4 py-2.5 text-left text-[14px] font-medium text-red-600 hover:bg-red-50 flex items-center gap-3"
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                  Delete Address
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                
                {addresses.length > 3 && (
                  <button 
                    onClick={() => setShowAllAddresses(!showAllAddresses)}
                    className="w-full p-4 text-[14px] font-bold text-[#00BD6F] flex items-center justify-center gap-1 active:scale-95 transition-transform"
                  >
                    {showAllAddresses ? 'View less' : 'View all addresses'}
                    {showAllAddresses ? <ChevronUp className="w-4 h-4 ml-0.5" /> : <ChevronDown className="w-4 h-4 ml-0.5" />}
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <AnimatePresence>
        {showMapPicker && (
          <MapLocationPickerView 
            initialLocation={selectedInitialLocation}
            onClose={() => setShowMapPicker(false)} 
            onConfirm={(newAddress) => {
              const newId = uuidv7();
              const icon = newAddress.type === 'Home' ? Home : newAddress.type === 'Work' ? Briefcase : Navigation;
              const newAddr = {
                id: newId,
                type: newAddress.type,
                icon,
                address: newAddress.address,
                building: newAddress.building,
                street: newAddress.street,
                coordinates: newAddress.coordinates,
                isDefault: true,
              };
              setAddresses(prev => [newAddr, ...prev.map(a => ({ ...a, isDefault: false }))]);
              setShowMapPicker(false);
              if (onSelectLocation) {
                onSelectLocation(newAddress);
              }
              onClose?.();
            }} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEditAddress && editingAddress && (
          <EditAddressView 
            address={editingAddress} 
            setAddresses={setAddresses}
            onClose={() => {
              setShowEditAddress(false);
              setEditingAddress(null);
            }} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};
