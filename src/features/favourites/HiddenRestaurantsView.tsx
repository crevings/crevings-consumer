import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, Eye, EyeOff, Search, Star, MapPin, Clock, RotateCcw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Restaurant } from "@/types";

interface HiddenRestaurantsViewProps {
  hiddenRestaurants: Restaurant[];
  onUnhide: (id: string | number) => void;
  onBack: () => void;
}

const FILTER_CHIPS = [
  { label: 'Veg', value: 'veg' },
  { label: 'Non-Veg', value: 'non-veg' },
  { label: 'Top Rated', value: 'top-rated' },
  { label: 'Recently Hidden', value: 'recently-hidden' },
];

export const HiddenRestaurantsView: React.FC<HiddenRestaurantsViewProps> = ({ 
  hiddenRestaurants, 
  onUnhide, 
  onBack 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [localHiddenRestaurants, setLocalHiddenRestaurants] = useState<Restaurant[]>(hiddenRestaurants);
  const [snackbar, setSnackbar] = useState<{ restaurant: Restaurant, timeoutId: NodeJS.Timeout } | null>(null);

  // Sync local state with props if props change (e.g., initial load)
  useEffect(() => {
    // Only update if we don't have a snackbar active to prevent jarring UI changes during undo window
    if (!snackbar) {
      setLocalHiddenRestaurants(hiddenRestaurants);
    }
  }, [hiddenRestaurants, snackbar]);

  const handleFilterToggle = (filterValue: string) => {
    setActiveFilters(prev => 
      prev.includes(filterValue) ? prev.filter(f => f !== filterValue) : [...prev, filterValue]
    );
  };

  const filteredRestaurants = useMemo(() => {
    return localHiddenRestaurants.filter(r => {
      const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            r.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;
      
      if (activeFilters.length === 0) return true;
      
      return activeFilters.every(f => {
        if (f === 'veg') return r.dietary.includes('veg');
        if (f === 'non-veg') return r.dietary.includes('non-veg');
        if (f === 'top-rated') return r.rating >= 4.5;
        // 'recently-hidden' would need timestamp logic, skipping for now
        if (f === 'recently-hidden') return true;
        return true;
      });
    });
  }, [searchQuery, activeFilters, localHiddenRestaurants]);

  const handleUnhideSwipe = (restaurant: Restaurant) => {
    // Optimistically remove from local state
    setLocalHiddenRestaurants(prev => prev.filter(r => r.id !== restaurant.id));
    
    // Clear existing snackbar timeout if any
    if (snackbar) {
      clearTimeout(snackbar.timeoutId);
      // Actually unhide the previous one since we're replacing it
      onUnhide(snackbar.restaurant.id);
    }

    // Set new snackbar with 4s timeout
    const timeoutId = setTimeout(() => {
      onUnhide(restaurant.id);
      setSnackbar(null);
    }, 4000);

    setSnackbar({ restaurant, timeoutId });
  };

  const handleUndo = () => {
    if (snackbar) {
      clearTimeout(snackbar.timeoutId);
      // Restore to local state
      setLocalHiddenRestaurants(prev => {
        // Find original index if possible, or just prepend
        const originalIndex = hiddenRestaurants.findIndex(r => r.id === snackbar.restaurant.id);
        const newState = [...prev];
        if (originalIndex !== -1 && originalIndex <= newState.length) {
          newState.splice(originalIndex, 0, snackbar.restaurant);
        } else {
          newState.unshift(snackbar.restaurant);
        }
        return newState;
      });
      setSnackbar(null);
    }
  };

  const handleCloseSnackbar = () => {
    if (snackbar) {
      clearTimeout(snackbar.timeoutId);
      onUnhide(snackbar.restaurant.id);
      setSnackbar(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative">
      {/* Top Navigation Bar */}
      <div className="bg-white px-4 pt-12 pb-4 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-700 active:bg-slate-100 transition-colors shrink-0"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1 text-center pr-10">
            <h1 className="text-lg font-bold text-slate-900">Hidden Restaurants</h1>
          </div>
        </div>
        <p className="text-xs text-slate-500 text-center px-8">Manage restaurants you have hidden from your feed</p>
      </div>

      {/* Intro Information Banner */}
      <div className="bg-blue-50 border border-blue-100 p-4 mx-4 mt-4 rounded-2xl flex items-start gap-3">
        <div className="bg-blue-100 p-2 rounded-full shrink-0 mt-0.5">
          <EyeOff className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-blue-900 mb-1">Your hidden restaurants</h4>
          <p className="text-xs text-blue-700 leading-relaxed">Swipe a restaurant card to the left to unhide it and bring it back to your feed.</p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="px-4 mt-6 mb-4">
        <div className="relative mb-4">
          <input 
            type="text" 
            placeholder="Search hidden restaurants" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 pl-11 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>
        
        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
          {FILTER_CHIPS.map(chip => (
            <button
              key={chip.value}
              onClick={() => handleFilterToggle(chip.value)}
              className={`px-4 py-2 rounded-full text-xs font-bold border transition-colors whitespace-nowrap shrink-0 ${
                activeFilters.includes(chip.value)
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hidden Restaurant List */}
      <div className="flex-1 overflow-y-auto px-4 pb-32 no-scrollbar">
        {filteredRestaurants.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-20 text-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-slate-300 mb-6 shadow-sm border border-slate-100">
              <Eye className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">No hidden restaurants</h2>
            <p className="text-slate-500 text-sm px-8">
              {searchQuery || activeFilters.length > 0 
                ? "No hidden restaurants match your search or filters." 
                : "You haven't hidden any restaurants yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {filteredRestaurants.map((restaurant) => (
                <SwipeableRestaurantCard 
                  key={restaurant.id} 
                  restaurant={restaurant} 
                  onUnhide={() => handleUnhideSwipe(restaurant)} 
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Snackbar for Undo */}
      <AnimatePresence>
        {snackbar && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 left-4 right-4 bg-slate-900 text-white px-4 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 z-50"
          >
            <div className="bg-white/20 p-1.5 rounded-full shrink-0">
              <Eye className="w-4 h-4 text-white" />
            </div>
            <p className="text-sm font-medium flex-1 truncate">
              <span className="font-bold">{snackbar.restaurant.name}</span> unhidden
            </p>
            <button 
              onClick={handleUndo} 
              className="text-blue-400 font-bold text-sm px-2 py-1 active:scale-95 transition-transform flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Undo
            </button>
            <div className="w-px h-4 bg-white/20 mx-1"></div>
            <button 
              onClick={handleCloseSnackbar} 
              className="text-slate-400 hover:text-white transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SwipeableRestaurantCard: React.FC<{
  restaurant: Restaurant;
  onUnhide: () => void;
}> = ({ restaurant, onUnhide }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, x: -100 }}
      transition={{ duration: 0.2 }}
      className="relative rounded-2xl overflow-hidden bg-blue-500"
    >
      {/* Background Action Area (Unhide) */}
      <div className="absolute inset-0 flex items-center justify-end pr-6 bg-blue-500 text-white">
        <div className="flex flex-col items-center gap-1">
          <Eye className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Unhide</span>
        </div>
      </div>

      {/* Foreground Draggable Card */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -100, right: 0 }}
        dragElastic={0.1}
        onDragEnd={(_e, { offset, velocity }) => {
          if (offset.x < -80 || velocity.x < -500) {
            onUnhide();
          }
        }}
        whileTap={{ cursor: 'grabbing' }}
        className="bg-white rounded-2xl p-3 flex gap-4 shadow-sm border border-slate-100 relative z-10 w-full"
      >
        {/* Restaurant Image */}
        <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 relative">
          <img loading="lazy" src={restaurant.images && restaurant.images.length > 0 && restaurant.images[0] ? restaurant.images[0] : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=400&fit=crop&q=80'} alt={restaurant.name} className="w-full h-full object-cover" />
          <div className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-md text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
            <EyeOff className="w-3 h-3" />
            HIDDEN
          </div>
        </div>

        {/* Restaurant Details */}
        <div className="flex-1 flex flex-col justify-center py-1">
          <div className="flex justify-between items-start mb-1">
            <h4 className="font-bold text-slate-900 text-base leading-tight line-clamp-1 pr-2">{restaurant.name}</h4>
            <div className="flex items-center gap-1 bg-green-50 px-1.5 py-0.5 rounded text-[11px] font-bold text-green-700 shrink-0">
              {restaurant.rating}
              <Star className="w-3 h-3 fill-green-700" />
            </div>
          </div>
          
          <p className="text-xs text-slate-500 mb-2 line-clamp-1">{restaurant.cuisine}</p>
          
          <div className="flex items-center gap-3 text-xs font-medium text-slate-600 mt-auto">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {restaurant.time}
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-300"></div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {restaurant.distance}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};