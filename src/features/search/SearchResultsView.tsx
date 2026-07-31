import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import Fuse from 'fuse.js';
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
import { useRestaurants, useSearch, useSearchSuggestions } from "@/api/restaurants";
import { MOCK_MENU } from "@/data/menu";
import { Restaurant, MenuItem, FilterOptions } from "@/types";
import { FilterBottomSheet } from "@/shared/components/FilterBottomSheet";
import { GridMenuItemCard } from "@/features/collection/GridMenuItemCard";

interface SearchResultsViewProps {
  onBack: () => void;
  initialQuery?: string;
  onRestaurantClick?: (restaurant: Restaurant) => void;
  onItemAdd?: (restaurant: Restaurant, itemId: string) => void;
  onMicClick?: () => void;
}

const FILTER_CHIPS = [
  { label: 'Filters', icon: <SlidersHorizontal className="w-4 h-4" />, action: 'filter' },
  { label: 'Veg Only', action: 'veg' },
  { label: 'Rating 4.0+', action: 'rating' },
  { label: 'Under 15 km', action: 'near' },
];

export const SearchResultsView: React.FC<SearchResultsViewProps> = ({ onBack, initialQuery = 'Burger', onRestaurantClick, onItemAdd, onMicClick }) => {
  const [query, setQuery] = useState(initialQuery);
  const [searchType, setSearchType] = useState<'restaurant' | 'dish'>('restaurant');
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

  // Call real-time H3 powered search API
  const { data: searchApiResult, isLoading: isSearchLoading } = useSearch({
    query,
    vegOnly: activeFilters.dietary === 'veg',
    minRating: activeFilters.minRating,
  });

  const { suggestions } = useSearchSuggestions(query);

  const apiRestaurants = useMemo(() => {
    if (!searchApiResult?.restaurants) return [];
    return searchApiResult.restaurants.map((b: any) => ({
      id: b.branchId,
      name: b.name,
      cuisine: b.cuisineType,
      rating: b.rating || 4.2,
      time: `${b.estimatedDeliveryMinutes || 25} min`,
      timeValue: b.estimatedDeliveryMinutes || 25,
      price: '₹350 for two',
      images: b.logo ? [b.logo] : [],
      distance: `${b.distanceKm || 1.5} km`,
      distanceValue: b.distanceKm || 1.5,
      isDeliverable: b.isDeliverable,
      area: b.address?.city || 'Local',
      dietary: ['veg', 'non-veg'],
    }));
  }, [searchApiResult]);

  const apiDishes = useMemo(() => {
    if (!searchApiResult?.dishes) return [];
    return searchApiResult.dishes.map((d: any) => ({
      id: d.itemId,
      name: d.name,
      category: d.category || 'Special',
      description: d.description || '',
      price: d.price || 199,
      isVeg: d.dietaryType === 'Veg',
      images: d.images?.length > 0 ? d.images : ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c'],
      rating: 4.5,
      restaurant: {
        id: d.restaurant?.branchId || 'temp',
        name: d.restaurant?.name || 'Restaurant',
        cuisine: 'Multi',
        rating: 4.5,
        time: '25 min',
        timeValue: 25,
        price: '₹350 for two',
        images: [],
        distance: `${d.restaurant?.distanceKm || 2} km`,
        distanceValue: d.restaurant?.distanceKm || 2,
        isDeliverable: d.restaurant?.isDeliverable,
        dietary: [],
      },
    }));
  }, [searchApiResult]);

  const currentResultsLength = searchType === 'restaurant' ? apiRestaurants.length : apiDishes.length;

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <div className="bg-white sticky top-0 z-30 pt-10 pb-3 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        <div className="px-4 mb-5">
          <div className="w-full flex items-center justify-between pl-2 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl group transition-colors focus-within:bg-white focus-within:border-slate-200">
            <div className="flex items-center gap-2 truncate flex-1">
              <button onClick={onBack} className="p-2 flex items-center justify-center text-slate-600 hover:text-slate-900 active:scale-95 transition-transform shrink-0 rounded-full hover:bg-slate-200">
                <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
              </button>
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search food, restaurants..."
                className="w-full bg-transparent text-slate-900 font-bold focus:outline-none placeholder:text-slate-400 placeholder:font-medium text-[15px]"
                autoFocus
              />
            </div>
            <div className="flex items-center gap-2 shrink-0 border-l border-slate-200 pl-2">
              {query ? (
                <button onClick={() => setQuery('')} className="p-1.5 text-slate-400 hover:text-slate-800 rounded-full transition-colors">
                  <X className="w-[18px] h-[18px]" strokeWidth={2.5} />
                </button>
              ) : (
                <button onClick={onMicClick} className="p-1.5 text-[#00BD6F] hover:bg-[#00BD6F]/10 rounded-full transition-colors">
                  <Mic className="w-[18px] h-[18px]" strokeWidth={2.5} />
                </button>
              )}
            </div>
          </div>
        </div>
        
        {query && (
          <>
            {/* Toggle Restaurant / Dishes */}
            <div className="px-4 mb-4">
              <div className="flex p-1 bg-slate-100/80 rounded-[14px]">
                <button
                  onClick={() => setSearchType('restaurant')}
                  className={`relative z-10 flex-1 py-2 text-[14px] font-bold rounded-[10px] transition-colors ${searchType === 'restaurant' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {searchType === 'restaurant' && (
                    <motion.div
                      layoutId="search-toggle"
                      className="absolute inset-0 bg-white rounded-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-50 -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  Restaurants
                </button>
                <button
                  onClick={() => setSearchType('dish')}
                  className={`relative z-10 flex-1 py-2 text-[14px] font-bold rounded-[10px] transition-colors ${searchType === 'dish' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {searchType === 'dish' && (
                    <motion.div
                      layoutId="search-toggle"
                      className="absolute inset-0 bg-white rounded-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-50 -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  Dishes
                </button>
              </div>
            </div>

            {/* Filter Chips */}
            <div className="px-4">
              <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 items-center">
                {FILTER_CHIPS.map((chip, i) => (
                  <button 
                    key={i} 
                    onClick={() => chip.action === 'filter' ? setIsFilterOpen(true) : null}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 border rounded-[12px] text-[13px] font-bold whitespace-nowrap active:scale-95 transition-all ${
                      chip.action === 'filter' 
                        ? 'border-slate-200 bg-white text-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.03)]' 
                        : 'border-slate-100 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:border-slate-200'
                    }`}
                  >
                    {chip.icon && chip.icon}
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-24 px-4 pt-6">
        {!query && (
          <div className="animate-[fadeIn_0.3s_ease-out]">
            {/* Recent searches */}
            <div className="mb-6">
              <h3 className="flex items-center gap-2 text-[14px] font-bold text-slate-800 mb-3 px-1">
                <History className="w-[16px] h-[16px] text-slate-600" />
                Recent searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {['paneer tikka', 'dosa', 'kfc'].map((tag) => (
                  <button 
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-slate-200 rounded-[12px] text-[12px] font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
                  >
                    <History className="w-3.5 h-3.5 text-slate-400" />
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular in your area */}
            <div className="mb-8">
              <h3 className="flex items-center gap-2 text-[14px] font-bold text-slate-800 mb-3 px-1">
                <TrendingUp className="w-[16px] h-[16px] text-slate-600" />
                Popular in your area
              </h3>
              <div className="flex flex-wrap gap-2">
                {['biryani', 'pizza', 'burger', 'shawarma', 'chicken', 'momos', 'thali'].map((tag) => (
                  <button 
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-[12px] text-[12px] font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {query && currentResultsLength > 0 && (
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-[13px] font-black text-slate-800 uppercase tracking-widest">
              {searchType === 'restaurant' ? 'Restaurants' : 'Dishes'}
            </h2>
            <span className="text-[12px] font-bold text-slate-500 bg-slate-200/50 px-2.5 py-0.5 rounded-full">{currentResultsLength} results</span>
          </div>
        )}

        {query && (
          <div className="animate-[fadeSlideUp_0.4s_ease-out]">
            {currentResultsLength > 0 ? (
              searchType === 'restaurant' ? (
                 <div className="space-y-4">
                   {apiRestaurants.map((item: any) => (
                      <div key={item.id} className="relative">
                        {!item.isDeliverable && (
                          <div className="mb-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-lg inline-flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-amber-600" />
                            Outside 15 km delivery radius (City Search Result)
                          </div>
                        )}
                        <RestaurantCard
                          {...item}
                          onClick={() => onRestaurantClick?.(item)}
                        />
                      </div>
                   ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 pb-6">
                  {apiDishes.map((item: any) => (
                    <div key={`${item.restaurant.id}-${item.id}`} className="relative">
                      {!item.restaurant.isDeliverable && (
                        <div className="mb-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Out of range
                        </div>
                      )}
                      <GridMenuItemCard
                        item={item}
                        quantity={0}
                        restaurantName={item.restaurant.name}
                        onAdd={(id) => {
                          onRestaurantClick?.(item.restaurant);
                          onItemAdd?.(item.restaurant, id);
                        }}
                        onRemove={() => {}}
                        onClick={() => {
                          onRestaurantClick?.(item.restaurant);
                        }}
                      />
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center pt-20 px-8 text-center animate-[fadeIn_0.3s_ease-out]">
                  <div className="w-24 h-24 mb-6 relative">
                      <div className="absolute inset-0 bg-slate-100 rounded-full animate-ping opacity-20"></div>
                      <div className="w-full h-full bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 relative z-10 shadow-sm">
                          <Search className="w-10 h-10 text-slate-300" strokeWidth={2} />
                      </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">No match found</h3>
                  <p className="text-[14px] font-medium text-slate-500 mb-8 max-w-[240px]">We couldn't find any delicious matches for "{query}". Try searching for something else.</p>
                  <button onClick={() => setQuery('')} className="bg-[#00BD6F]/10 text-[#00BD6F] px-8 py-3 rounded-[16px] font-bold text-[14px] active:scale-95 transition-all">Clear Search</button>
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