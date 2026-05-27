import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Search, 
  Star, 
  Clock, 
  MapPin, 
  Plus, 
  Utensils, 
  ChevronRight, 
  SlidersHorizontal,
  History,
  TrendingUp,
  Flame,
  X,
  ShoppingBag,
  Store,
  Mic,
  Bookmark
} from 'lucide-react';
import { RestaurantCard } from "@/features/restaurant/RestaurantCard";
import { ALL_RESTAURANTS } from "@/data/restaurants";
import { MOCK_MENU } from "@/data/menu";;
import { Restaurant, MenuItem, FilterOptions } from "@/types";
import { FilterBottomSheet } from "@/shared/components/FilterBottomSheet";

interface SearchResultsViewProps {
  onBack: () => void;
  initialQuery?: string;
  onRestaurantClick?: (restaurant: Restaurant) => void;
  onItemAdd?: (restaurant: Restaurant, itemId: string) => void;
  onMicClick?: () => void;
}

const FILTER_CHIPS = [
  { label: 'Filters', icon: <SlidersHorizontal className="w-4 h-4" />, action: 'filter' },
  { label: 'Dressing: Tandoori' },
  { label: 'Burger' },
  { label: 'Flat 50% OFF' },
  { label: 'New to you' },
  { label: 'Great offers' },
];

export const SearchResultsView: React.FC<SearchResultsViewProps> = ({ onBack, initialQuery = 'Burger', onRestaurantClick, onItemAdd, onMicClick }) => {
  const [query, setQuery] = useState(initialQuery);
  const [searchType, setSearchType] = useState<'restaurant' | 'dish'>('restaurant');
  const [restaurantResults, setRestaurantResults] = useState<Restaurant[]>([]);
  const [dishResults, setDishResults] = useState<(MenuItem & { restaurant: Restaurant })[]>([]);
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    maxTime: 60,
    maxDistance: 15,
    minRating: 1,
    dietary: 'all',
    offersOnly: false,
    sortBy: 'default',
    priceRange: null
  });

  useEffect(() => {
    if (!query.trim()) {
      setRestaurantResults([]);
      setDishResults([]);
      return;
    }
    const lowerQuery = query.toLowerCase();
    
    // Filter restaurants
    const filteredRestaurants = ALL_RESTAURANTS.filter(r => {
      const matchQuery = r.name.toLowerCase().includes(lowerQuery) || r.cuisine.toLowerCase().includes(lowerQuery);
      const matchRating = r.rating >= activeFilters.minRating;
      const matchDietary = activeFilters.dietary === 'all' || r.dietary?.includes(activeFilters.dietary);
      const matchOffer = !activeFilters.offersOnly || !!r.offer;
      return matchQuery && matchRating && matchDietary && matchOffer;
    });
    setRestaurantResults(filteredRestaurants);

    // Filter dishes
    const filteredDishes = MOCK_MENU.filter(m => {
      const matchQuery = m.name.toLowerCase().includes(lowerQuery) || (m.description && m.description.toLowerCase().includes(lowerQuery)) || m.category.toLowerCase().includes(lowerQuery);
      const matchRating = m.rating >= activeFilters.minRating;
      const matchDietary = activeFilters.dietary === 'all' || (activeFilters.dietary === 'veg' && m.isVeg) || (activeFilters.dietary === 'non-veg' && !m.isVeg);
      return matchQuery && matchRating && matchDietary;
    }).map((item, index) => ({
      ...item,
      // Assign a deterministic restaurant for the mock data
      restaurant: ALL_RESTAURANTS[index % ALL_RESTAURANTS.length]
    }));
    setDishResults(filteredDishes);
  }, [query, activeFilters]);

  const currentResultsLength = searchType === 'restaurant' ? restaurantResults.length : dishResults.length;

  return (
    <div className="min-h-screen bg-white animate-fadeInUp flex flex-col">
      <div className="bg-white sticky top-0 z-30 pt-10 pb-2 shadow-sm border-b border-slate-100">
        <div className="px-4 flex items-center gap-3 mb-4">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-800 hover:bg-slate-50 active:scale-95 transition-all shrink-0">
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          <div className="flex-1 flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-[1.25rem] shadow-sm transition-all group overflow-hidden">
            <div className="flex items-center gap-3 truncate flex-1">
              <Search className="w-5 h-5 text-slate-900 stroke-[2.5] shrink-0" />
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for restaurants, items or more"
                className="w-full bg-transparent text-slate-900 font-medium focus:outline-none placeholder:text-slate-400 text-base"
                autoFocus
              />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {query && (
                <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-600 rounded-full transition-all active:scale-90">
                  <X className="w-5 h-5" />
                </button>
              )}
              <button onClick={onMicClick} className="p-1 -mr-1 text-blue-600 hover:bg-blue-50 rounded-full transition-all active:scale-90">
                <Mic className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Toggle Restaurant / Dishes */}
        <div className="px-4 mb-3">
          <div className="flex p-1 bg-slate-100 rounded-xl relative">
            <button
              onClick={() => setSearchType('restaurant')}
              className={`relative z-10 flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${searchType === 'restaurant' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {searchType === 'restaurant' && (
                <motion.div
                  layoutId="search-toggle"
                  className="absolute inset-0 bg-white rounded-lg shadow-sm -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              Restaurants
            </button>
            <button
              onClick={() => setSearchType('dish')}
              className={`relative z-10 flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${searchType === 'dish' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {searchType === 'dish' && (
                <motion.div
                  layoutId="search-toggle"
                  className="absolute inset-0 bg-white rounded-lg shadow-sm -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              Dishes
            </button>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="px-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 items-center">
            {FILTER_CHIPS.map((chip, i) => (
              <button 
                key={i} 
                onClick={() => chip.action === 'filter' ? setIsFilterOpen(true) : null}
                className="flex items-center gap-1.5 px-3.5 py-1.5 border border-slate-200 rounded-full bg-white text-slate-700 text-sm font-medium whitespace-nowrap shadow-sm active:scale-95 transition-all"
              >
                {chip.icon && chip.icon}
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-24 px-4 pt-6 bg-slate-50/50">
        {query && currentResultsLength > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-bold text-slate-500 tracking-wider uppercase mb-1">
              {searchType === 'restaurant' ? 'ALL RESTAURANTS' : 'ALL DISHES'}
            </h2>
            <p className="text-xs font-semibold text-slate-400">Featured</p>
          </div>
        )}

        {query && (
          <div className="animate-fadeInUp">
            {currentResultsLength > 0 ? (
              searchType === 'restaurant' ? (
                <div className="space-y-6">
                   {restaurantResults.map((item) => (
                      <RestaurantCard
                        key={item.id}
                        {...item}
                        onClick={() => onRestaurantClick?.(item)}
                      />
                   ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {dishResults.map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => {
                        onRestaurantClick?.(item.restaurant);
                        onItemAdd?.(item.restaurant, item.id);
                      }}
                      className={`flex flex-col bg-white rounded-2xl p-2 border border-gray-100 shadow-sm relative cursor-pointer active:scale-95 transition-transform ${item.available === false ? 'opacity-60' : ''}`}
                    >
                      {item.image && (
                        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-2.5">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          <div className="absolute top-1.5 left-1.5 bg-white/95 p-1 rounded-md shadow-sm">
                            <div className={`w-3 h-3 border flex items-center justify-center rounded-sm ${item.isVeg ? 'border-green-600' : item.isEgg ? 'border-yellow-500' : 'border-red-600'}`}>
                              {item.isVeg ? (
                                <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                              ) : item.isEgg ? (
                                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                              ) : (
                                <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[4px] border-b-red-600" />
                              )}
                            </div>
                          </div>
                          <div className="absolute bottom-1.5 right-1.5 flex items-center gap-1 bg-green-50/95 backdrop-blur-sm px-1.5 py-0.5 rounded text-green-700 shadow-sm">
                            <Star className="w-3 h-3 fill-current" />
                            <span className="text-[11px] font-bold">{item.rating}</span>
                            <span className="text-[10px] opacity-80">({item.ratingCount || '100+'})</span>
                          </div>
                        </div>
                      )}
                      {!item.image && (
                        <div className="flex items-center justify-between mb-2 px-1.5 pt-1.5">
                          <div className={`w-4 h-4 border flex items-center justify-center rounded-sm ${item.isVeg ? 'border-green-600' : item.isEgg ? 'border-yellow-500' : 'border-red-600'}`}>
                            {item.isVeg ? (
                              <div className="w-2 h-2 rounded-full bg-green-600" />
                            ) : item.isEgg ? (
                              <div className="w-2 h-2 rounded-full bg-yellow-500" />
                            ) : (
                              <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-red-600" />
                            )}
                          </div>
                          <div className="flex items-center gap-1 bg-green-50 px-1.5 py-0.5 rounded text-green-700">
                            <Star className="w-3 h-3 fill-current" />
                            <span className="text-[11px] font-bold">{item.rating}</span>
                            <span className="text-[10px] opacity-80">({item.ratingCount || '100+'})</span>
                          </div>
                        </div>
                      )}

                      {/* Middle: Name & Description */}
                      <div className="flex-1 mb-2 px-1.5">
                        <h4 className="text-[14px] font-bold text-gray-900 leading-tight mb-1">{item.name}</h4>
                        <p className="text-[11px] font-medium text-gray-500 mb-1 truncate">from {item.restaurant.name}</p>
                        {item.description && (
                          <p className="text-[11px] text-gray-500 line-clamp-2 leading-snug">{item.description}</p>
                        )}
                        {item.available === false && (
                          <span className="inline-block mt-1.5 text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-md uppercase tracking-wide">Unavailable</span>
                        )}
                      </div>

                      {/* Bottom: Price & Action */}
                      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100 px-1.5 pb-1">
                        <span className="text-[14px] font-black text-gray-900">₹{item.price}</span>
                        
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (item.available !== false) {
                              onRestaurantClick?.(item.restaurant);
                              onItemAdd?.(item.restaurant, item.id);
                            }
                          }}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${item.available === false ? 'bg-gray-100 text-gray-400' : 'bg-orange-50 text-orange-600 hover:bg-orange-100'}`}
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center pt-20 px-8 text-center animate-fadeInUp">
                  <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200 mb-6 rotate-3">
                      <ShoppingBag className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">Search item is not available</h3>
                  <button onClick={() => setQuery('')} className="bg-orange-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-orange-500/20 active:scale-95 transition-all">Reset Search</button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {isFilterOpen && (
        <FilterBottomSheet 
          onClose={() => setIsFilterOpen(false)} 
          onApply={(f) => { setActiveFilters(f); setIsFilterOpen(false); }} 
          initialFilters={activeFilters} 
        />
      )}
    </div>
  );
};