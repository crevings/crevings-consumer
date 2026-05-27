
import React, { useState } from 'react';
import { Search, Home, MapPin, Briefcase, Map, MoreVertical, Plus, ArrowLeft, Navigation, ChevronRight, ChevronDown, ChevronUp, Edit2, Trash2, Landmark, Building, Castle, Building2, Church, HandMetal } from 'lucide-react';
import { MapLocationPickerView } from "@/features/location/MapLocationPickerView";
import { EditAddressView } from '@/features/location/EditAddressView';
import { motion, AnimatePresence } from 'framer-motion';

import { SavedAddress } from '@/types';

interface LocationPickerViewProps {
  addresses: SavedAddress[];
  setAddresses: React.Dispatch<React.SetStateAction<SavedAddress[]>>;
  onSelectLocation?: (location: { type: string, address: string }) => void;
  onClose: () => void;
}

export const LocationPickerView: React.FC<LocationPickerViewProps> = ({ addresses, setAddresses, onSelectLocation, onClose }) => {
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [selectedInitialLocation, setSelectedInitialLocation] = useState<{ title: string, subtitle: string, coords: [number, number] } | null>(null);
  const [showEditAddress, setShowEditAddress] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [showAllAddresses, setShowAllAddresses] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const searchSuggestions = [
    { id: 1, title: 'Koregaon Park', subtitle: 'Pune, Maharashtra', coords: [18.5362, 73.8939] as [number, number], distance: '2.4 km' },
    { id: 2, title: 'Viman Nagar', subtitle: 'Pune, Maharashtra', coords: [18.5679, 73.9143] as [number, number], distance: '4.1 km' },
    { id: 3, title: 'Baner', subtitle: 'Pune, Maharashtra', coords: [18.5590, 73.7868] as [number, number], distance: '8.5 km' },
    { id: 4, title: 'Kalyani Nagar', subtitle: 'Pune, Maharashtra', coords: [18.5482, 73.9033] as [number, number], distance: '3.2 km' },
    { id: 5, title: 'Hinjewadi', subtitle: 'Pune, Maharashtra', coords: [18.5913, 73.7389] as [number, number], distance: '12.8 km' },
  ];

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
    setShowEditAddress(true);
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(a => ({
      ...a,
      isDefault: a.id === id
    })));
    setActiveMenuId(null);
    const selected = addresses.find(a => a.id === id);
    if (selected && onSelectLocation) {
      onSelectLocation({ type: selected.type, address: selected.address });
    }
  };

  if (isInitialLoading) {
    return (
      <div className="fixed inset-0 bg-white z-[100] flex flex-col overflow-hidden animate-[slideInRight_0.3s_ease-out]">
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
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 bg-white z-50 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="bg-white pt-safe pb-4 px-4 sticky top-0 z-20 border-b border-slate-100">
        <div className="flex items-center gap-4 mt-4">
          <button onClick={onClose} className="p-2 -ml-2 active:scale-95 transition-transform" aria-label="Go back">
            <ArrowLeft className="w-[22px] h-[22px] text-slate-800" strokeWidth={2.5} />
          </button>
          <h1 className="text-[18px] font-bold text-slate-900">Select Location</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-5 pb-10">
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
            className="w-full bg-white border border-slate-200 rounded-[16px] py-[15px] pl-12 pr-4 text-[15px] focus:outline-none focus:border-[#00BD6F] focus:ring-1 focus:ring-[#00BD6F] transition-all font-medium placeholder:text-slate-400 text-slate-900"
          />
        </div>

        {searchQuery.length > 0 ? (
          <div className="bg-white rounded-[24px] border border-slate-100 overflow-hidden mb-8">
            {searchSuggestions.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.subtitle.toLowerCase().includes(searchQuery.toLowerCase())).map((suggestion, idx, arr) => (
              <button 
                key={suggestion.id}
                onClick={() => {
                  setSelectedInitialLocation({ title: suggestion.title, subtitle: suggestion.subtitle, coords: suggestion.coords });
                  setShowMapPicker(true);
                }}
                className={`w-full flex items-center gap-4 p-5 hover:bg-slate-50 active:bg-slate-100 transition-all group ${idx !== arr.length - 1 ? 'border-b border-slate-100' : ''}`}
              >
                  <div className="w-[42px] h-[42px] bg-[#F4F4F8] rounded-[14px] flex items-center justify-center shrink-0 group-hover:bg-[#00BD6F]/10 transition-colors">
                      <MapPin className="w-5 h-5 text-slate-400 group-hover:text-[#00BD6F] stroke-[2]" />
                  </div>
                  <div className="flex-1 text-left">
                      <h4 className="font-bold text-slate-900 text-[15px]">{suggestion.title}</h4>
                      <p className="text-[13px] text-slate-500 mt-0.5">{suggestion.subtitle}</p>
                  </div>
                  <div className="text-[12px] font-bold text-slate-400 shrink-0">
                      {suggestion.distance}
                  </div>
              </button>
            ))}
            {searchSuggestions.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.subtitle.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
              <div className="p-8 text-center text-slate-500 text-[14px]">No results found for "{searchQuery}"</div>
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
              <h2 className="text-[13px] font-bold text-slate-900 mb-4 px-1">Saved Addresses</h2>
              
              <div className="bg-white rounded-[24px] border border-slate-100 overflow-hidden">
                <motion.div layout className="divide-y divide-slate-100 relative">
                  <AnimatePresence initial={false}>
                    {(showAllAddresses ? addresses : addresses.slice(0, 3)).map((addr) => {
                      const Icon = addr.icon || MapPin;
                      return (
                        <motion.div 
                          layout
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          key={addr.id} 
                          onClick={() => handleSetDefault(addr.id)}
                          className="p-5 flex gap-4 cursor-pointer hover:bg-slate-50 active:bg-slate-100 transition-colors relative"
                        >
                          <div className="w-[42px] h-[42px] bg-[#00BD6F]/10 rounded-[14px] flex items-center justify-center shrink-0">
                            <Icon className="w-5 h-5 text-[#00BD6F]" strokeWidth={2} />
                          </div>
                          
                          <div className="flex-1 min-w-0 flex flex-col justify-center overflow-hidden">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-[15px] font-bold text-slate-900">{addr.type}</h3>
                              {addr.isDefault && (
                                <span className="bg-[#00BD6F]/10 text-[#00BD6F] text-[10px] font-bold px-2 py-[2px] rounded uppercase tracking-wider shrink-0 break-keep">
                                  Selected
                                </span>
                              )}
                            </div>
                            <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-2 pr-4 break-words whitespace-normal relative w-full block">
                              {addr.address}
                            </p>
                          </div>
                          
                          <div className="shrink-0 flex items-center relative">
                            <button 
                              onClick={(e) => toggleMenu(e, addr.id)}
                              className="text-slate-400 hover:text-slate-600 p-1 active:bg-slate-100 rounded-full transition-colors"
                            >
                              <MoreVertical className="w-5 h-5" />
                            </button>

                            {/* Dropdown Menu */}
                            {activeMenuId === addr.id && (
                              <>
                                <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setActiveMenuId(null); }} />
                                <div className="absolute right-0 top-12 w-48 bg-white rounded-xl border border-slate-100 py-2 z-20 animate-[fadeIn_0.2s_ease-out]">
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
                </motion.div>
                
                {addresses.length > 3 && (
                  <button 
                    onClick={() => setShowAllAddresses(!showAllAddresses)}
                    className="w-full p-4 border-t border-slate-100 text-[14px] font-bold text-[#00BD6F] flex items-center justify-center gap-1 hover:bg-slate-50 active:bg-slate-100 transition-colors"
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
              const newId = Math.random().toString(36).substr(2, 9);
              const icon = newAddress.type === 'Home' ? Home : newAddress.type === 'Work' ? Briefcase : Navigation;
              const newAddr = {
                id: newId,
                type: newAddress.type,
                icon,
                address: newAddress.address,
                isDefault: true,
              };
              setAddresses(prev => [newAddr, ...prev.map(a => ({ ...a, isDefault: false }))]);
              setShowMapPicker(false);
              if (onSelectLocation) {
                onSelectLocation(newAddress);
              }
              onClose();
            }} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEditAddress && (
          <EditAddressView onClose={() => setShowEditAddress(false)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};
