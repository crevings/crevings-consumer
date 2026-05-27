
import React, { useState } from 'react';
import { X, Search, Home, MoreHorizontal, Upload, ChevronRight, Crosshair, MapPinOff, MapPin, Briefcase, Map, MoreVertical, Edit2, CheckCircle, Trash2 } from 'lucide-react';
import { MapLocationPickerView } from './MapLocationPickerView';
import { EditAddressView } from './EditAddressView';
import { motion, AnimatePresence } from 'framer-motion';

import { SavedAddress } from '../App';

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
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (activeMenuId === id) {
      setActiveMenuId(null);
    } else {
      setActiveMenuId(id);
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setAddresses(addresses.filter(a => a.id !== id));
    setActiveMenuId(null);
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

  const handleEdit = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveMenuId(null);
    setShowEditAddress(true);
  };

  const searchSuggestions = [
    { id: 1, title: 'Koregaon Park', subtitle: 'Pune, Maharashtra', coords: [18.5362, 73.8939] as [number, number], distance: '2.4 km' },
    { id: 2, title: 'Viman Nagar', subtitle: 'Pune, Maharashtra', coords: [18.5679, 73.9143] as [number, number], distance: '4.1 km' },
    { id: 3, title: 'Baner', subtitle: 'Pune, Maharashtra', coords: [18.5590, 73.7868] as [number, number], distance: '8.5 km' },
    { id: 4, title: 'Kalyani Nagar', subtitle: 'Pune, Maharashtra', coords: [18.5482, 73.9033] as [number, number], distance: '3.2 km' },
    { id: 5, title: 'Hinjewadi', subtitle: 'Pune, Maharashtra', coords: [18.5913, 73.7389] as [number, number], distance: '12.8 km' },
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 z-[100]"
      />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 bg-slate-50 rounded-t-3xl z-[110] overflow-hidden flex flex-col h-[85vh] w-full max-w-md mx-auto"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-slate-900">Select delivery location</h2>
          <button 
            onClick={onClose} 
            className="p-2 bg-slate-50 rounded-full text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-10 pt-4">
              <div className="relative mb-6 group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00BD6F] transition-colors">
                      <Search className="w-5 h-5 stroke-[2]" />
                  </div>
                  <input 
                      type="text" 
                      placeholder="Search for area, street name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-[15px] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00BD6F]/20 focus:border-[#00BD6F] transition-all font-medium placeholder:text-slate-400 text-slate-900"
                  />
              </div>

              {searchQuery.length > 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-8 overflow-hidden">
                  {searchSuggestions.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.subtitle.toLowerCase().includes(searchQuery.toLowerCase())).map((suggestion, idx, arr) => (
                    <button 
                      key={suggestion.id}
                      onClick={() => {
                        setSelectedInitialLocation({ title: suggestion.title, subtitle: suggestion.subtitle, coords: suggestion.coords });
                        setShowMapPicker(true);
                      }}
                      className={`w-full flex items-center gap-4 p-4 hover:bg-slate-50 active:bg-slate-100 transition-all group ${idx !== arr.length - 1 ? 'border-b border-slate-100' : ''}`}
                    >
                        <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center shrink-0 group-hover:bg-slate-100 transition-colors">
                            <MapPin className="w-5 h-5 text-slate-400 stroke-[2]" />
                        </div>
                        <div className="flex-1 text-left">
                            <h4 className="font-semibold text-slate-900 text-[15px]">{suggestion.title}</h4>
                            <p className="text-[12px] text-slate-500 mt-0.5">{suggestion.subtitle}</p>
                        </div>
                        <div className="text-[11px] font-bold text-slate-400 shrink-0">
                            {suggestion.distance}
                        </div>
                    </button>
                  ))}
                  {searchSuggestions.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.subtitle.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                    <div className="p-6 text-center text-slate-500 text-sm">No results found for "{searchQuery}"</div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => {
                    setSelectedInitialLocation(null);
                    setShowMapPicker(true);
                  }}
                  className="w-full min-h-[64px] py-3 h-auto bg-white rounded-[16px] shadow-sm border border-slate-100 flex items-center px-4 mb-8 active:scale-[0.98] transition-transform"
                >
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center shrink-0 mr-3">
                    <MapPin className="w-5 h-5 text-[#00BD6F]" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-[15px] font-bold text-slate-900">Use Current Location</h3>
                    <p className="text-[12px] text-slate-500 mt-0.5 leading-snug">Detect your current delivery location automatically.</p>
                  </div>
                </button>
              )}

              <div className="mb-4">
                  <h2 className="text-[15px] font-bold text-slate-800 mb-4">Saved Addresses</h2>
                  
                  <div className="space-y-[12px]">
                    {addresses.map((addr) => {
                      const Icon = addr.icon;
                      return (
                        <div 
                          key={addr.id} 
                          onClick={() => handleSetDefault(addr.id)}
                          className="bg-white rounded-[16px] shadow-sm border border-slate-100 p-4 relative flex gap-3 h-[90px] cursor-pointer hover:bg-slate-50 active:scale-[0.98] transition-all"
                        >
                          <div className="mt-0.5 shrink-0">
                            <Icon className="w-6 h-6 text-slate-700" strokeWidth={1.5} />
                          </div>
                          <div className="flex-1 min-w-0 pr-6">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-[15px] font-bold text-slate-900">{addr.type}</h3>
                              {addr.isDefault && (
                                <span className="bg-[#00BD6F] text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-[13px] text-slate-500 leading-snug line-clamp-2">
                              {addr.address}
                            </p>
                          </div>
                          
                          <div className="absolute top-3 right-2">
                            <button 
                              onClick={(e) => toggleMenu(e, addr.id)}
                              className="p-2 text-slate-400 hover:text-slate-600 active:bg-slate-50 rounded-full transition-colors"
                            >
                              <MoreVertical className="w-5 h-5" />
                            </button>
                            
                            {/* Dropdown Menu */}
                            {activeMenuId === addr.id && (
                              <>
                                <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setActiveMenuId(null); }} />
                                <div className="absolute right-4 top-10 w-48 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-slate-100 py-2 z-20 animate-[fadeIn_0.2s_ease-out]">
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
                                    <Trash2 className="w-4 h-4 text-red-400" />
                                    Delete Address
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
              </div>
          </div>
        </motion.div>

      <AnimatePresence>
        {showMapPicker && (
          <MapLocationPickerView 
            initialLocation={selectedInitialLocation}
            onClose={() => setShowMapPicker(false)} 
            onConfirm={(newAddress) => {
              const newId = Math.random().toString(36).substr(2, 9);
              const icon = newAddress.type === 'Home' ? Home : newAddress.type === 'Work' ? Briefcase : Map;
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
    </>
  );
};
