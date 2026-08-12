import React from 'react';
import { ChevronDown, Search, Mic, User, MapPin } from 'lucide-react';
import { BRAND } from "@/config/brand";

interface HeaderProps {
  currentLocation?: { type: string, address: string };
  onSearchClick: () => void;
  onMicClick: () => void;
  onLocationClick: () => void;
  onProfileClick: () => void;
  hideSearch?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ currentLocation, onSearchClick, onMicClick, onLocationClick, onProfileClick, hideSearch }) => {
  return (
    <div className="bg-white pb-3 px-4 pt-safe-3 relative overflow-hidden">
      {/* Top Bar: Location Section */}
      <div className="flex justify-between items-center mb-3 relative z-10">
        <div 
          onClick={onLocationClick}
          className="flex flex-col cursor-pointer active:opacity-70 transition-all group"
        >
          <div className="flex items-center gap-1">
            {/* Home text in blue */}
            <MapPin className="w-4 h-4 text-blue-500" />
            <h2 className="text-lg font-medium text-blue-500 leading-none">{currentLocation?.type || 'Home'}</h2>
            <ChevronDown className="w-4 h-4 text-blue-500 group-hover:translate-y-0.5 transition-transform" />
          </div>
          <p className="text-[12px] font-bold text-slate-500 mt-1.5 truncate max-w-[200px]">
            {currentLocation?.address || 'Select Delivery Location'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
            {/* Profile Icon */}
            <button 
              onClick={onProfileClick}
              className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 active:scale-95 transition-all shadow-sm"
            >
              <User className="w-5 h-5" />
            </button>
        </div>
      </div>

      {/* Search Bar Section */}
      {!hideSearch && (
        <div className="flex items-center gap-2 mb-1 relative z-10">
          <div 
            onClick={onSearchClick}
            className="flex-1 flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-[1.25rem] cursor-pointer transition-all active:scale-[0.98] group overflow-hidden"
          >
            <div className="flex items-center gap-3 truncate">
              <Search className="w-5 h-5 text-slate-900 stroke-[2.5] shrink-0" />
              <span className="text-slate-700 font-medium text-base truncate">{BRAND.DEFAULT_SEARCH_PLACEHOLDER}</span>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); onMicClick(); }}
              className="p-1 -mr-1 text-blue-600 hover:bg-blue-50 rounded-full transition-all active:scale-90"
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};