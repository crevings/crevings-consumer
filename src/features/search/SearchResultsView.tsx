import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  History,
  TrendingUp,
  X,
  Mic,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { RestaurantCard } from "@/features/restaurant/RestaurantCard";
import { useFuzzySearch } from "@/hooks/useFuzzySearch";
import { Restaurant, FilterOptions, MenuItem } from "@/types";
import { FilterBottomSheet } from "@/shared/components/FilterBottomSheet";
import { GridMenuItemCard } from "@/features/collection/GridMenuItemCard";
import { useDebounce } from "@/shared/hooks/useDebounce";
import type { DishSearchRecord } from "@/utils/search";

interface SearchResultsViewProps {
  onBack: () => void;
  initialQuery?: string;
  onRestaurantClick?: (restaurant: Restaurant) => void;
  onItemAdd?: (restaurant: Restaurant, itemId: string) => void;
  onMicClick?: () => void;
}

interface QuickFilters {
  veg: boolean;
  rating: boolean;
  near: boolean;
}

const FILTER_CHIPS: Array<{
  label: string;
  action: 'filter' | 'veg' | 'rating' | 'near';
  icon?: React.ReactNode;
}> = [
  { label: 'Filters', action: 'filter', icon: <SlidersHorizontal className="w-4 h-4" /> },
  { label: 'Veg Only', action: 'veg' },
  { label: 'Rating 4.0+', action: 'rating' },
  { label: 'Under 15 km', action: 'near' },
];

/** Build the lightweight Restaurant object needed to open/add from a dish card. */
const dishRestaurant = (dish: DishSearchRecord): Restaurant => ({
  id: dish.restaurant.id,
  name: dish.restaurant.name,
  cuisine: '',
  rating: 0,
  time: '',
  timeValue: 0,
  price: '',
  images: [],
  distance: dish.restaurant.distanceKm != null ? `${dish.restaurant.distanceKm} km` : '',
  distanceValue: dish.restaurant.distanceKm ?? 0,
  dietary: [],
});

/** Shape a dish record for the GridMenuItemCard. */
const dishToMenuItem = (dish: DishSearchRecord): MenuItem => ({
  id: dish.itemId,
  name: dish.name,
  price: dish.price ?? 0,
  rating: 0,
  ratingCount: '0',
  image: dish.images?.[0] ?? '',
  isVeg: dish.isVeg ?? false,
  isEgg: dish.isEgg,
  description: dish.description,
  category: dish.category || 'Special',
  available: true,
});

export const SearchResultsView: React.FC<SearchResultsViewProps> = ({
  onBack,
  initialQuery = 'Burger',
  onRestaurantClick,
  onItemAdd,
  onMicClick,
}) => {
  const [query, setQuery] = useState(initialQuery);

  // Sync internal query when initialQuery changes (e.g. from voice search
  // setting AppContext.searchQuery while already on this route — React Router
  // does NOT remount the component for same-route navigations, so useState's
  // initial value is stale).
  React.useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);
  const debouncedQuery = useDebounce(query, 300);
  const [searchType, setSearchType] = useState<'restaurant' | 'dish'>('restaurant');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [quickFilters, setQuickFilters] = useState<QuickFilters>({ veg: false, rating: false, near: false });
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    maxTime: 60,
    maxDistance: 15,
    minRating: 1,
    dietary: 'all',
    offersOnly: false,
    sortBy: 'default',
    priceRange: null,
  });

  // Client-side Fuse.js fuzzy search over the full restaurant + dish corpora.
  // The dish corpus is only fetched once the user opens the Dishes tab.
  const {
    restaurants: fuzzyRestaurants,
    dishes: fuzzyDishes,
    restaurantsLoading,
    dishesLoading,
    isError,
    retry,
  } = useFuzzySearch(debouncedQuery, { loadDishes: searchType === 'dish' });

  const filteredRestaurants = useMemo(() => {
    let list = fuzzyRestaurants;

    if (quickFilters.veg) {
      list = list.filter((r) => !r.dietary || r.dietary.length === 0 || r.dietary.includes('veg'));
    }
    if (quickFilters.rating) {
      list = list.filter((r) => r.rating >= 4);
    }
    if (quickFilters.near) {
      list = list.filter((r) => (r.distanceValue ?? Infinity) <= 15);
    }

    // Sheet filters (FilterBottomSheet)
    if (activeFilters.minRating && activeFilters.minRating > 1) {
      list = list.filter((r) => r.rating >= (activeFilters.minRating ?? 0));
    }
    if (activeFilters.dietary === 'veg') {
      list = list.filter((r) => !r.dietary || r.dietary.length === 0 || r.dietary.includes('veg'));
    }
    if (activeFilters.maxDistance !== undefined && activeFilters.maxDistance < 15) {
      list = list.filter((r) => r.distanceValue <= activeFilters.maxDistance);
    }
    if (activeFilters.offersOnly) {
      list = list.filter((r) => Boolean(r.offer));
    }

    if (activeFilters.sortBy && activeFilters.sortBy !== 'default') {
      list = [...list].sort((a, b) => {
        switch (activeFilters.sortBy) {
          case 'ratingHigh': return b.rating - a.rating;
          case 'ratingLow': return a.rating - b.rating;
          case 'distanceNear': return a.distanceValue - b.distanceValue;
          case 'distanceFar': return b.distanceValue - a.distanceValue;
          default: return 0;
        }
      });
    }

    return list;
  }, [fuzzyRestaurants, quickFilters, activeFilters]);

  const filteredDishes = useMemo(() => {
    let list = fuzzyDishes;

    if (quickFilters.veg) {
      list = list.filter((d) => d.isVeg !== false);
    }
    if (quickFilters.near) {
      list = list.filter((d) => (d.restaurant.distanceKm ?? Infinity) <= 15);
    }

    if (activeFilters.dietary === 'veg') {
      list = list.filter((d) => d.isVeg !== false);
    }
    if (activeFilters.priceRange === 'under49') {
      list = list.filter((d) => (d.price ?? 0) <= 49);
    } else if (activeFilters.priceRange === '49to99') {
      list = list.filter((d) => (d.price ?? 0) >= 49 && (d.price ?? 0) <= 99);
    }
    if (activeFilters.sortBy === 'priceLow') {
      list = [...list].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    } else if (activeFilters.sortBy === 'priceHigh') {
      list = [...list].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    }

    return list;
  }, [fuzzyDishes, quickFilters, activeFilters]);

  const isSearching =
    searchType === 'restaurant'
      ? restaurantsLoading
      : searchType === 'dish' && dishesLoading;

  const currentResultsLength =
    searchType === 'restaurant' ? filteredRestaurants.length : filteredDishes.length;

  const toggleQuickFilter = (action: 'veg' | 'rating' | 'near') => {
    setQuickFilters((prev) => ({ ...prev, [action]: !prev[action] }));
  };

  const chipIsActive = (action: string): boolean => {
    if (action === 'veg' || action === 'rating' || action === 'near') {
      return quickFilters[action];
    }
    return false;
  };

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
                {FILTER_CHIPS.map((chip) => (
                  <button
                    key={chip.action}
                    onClick={() => (chip.action === 'filter' ? setIsFilterOpen(true) : toggleQuickFilter(chip.action))}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 border rounded-[12px] text-[13px] font-bold whitespace-nowrap active:scale-95 transition-all ${
                      chip.action === 'filter'
                        ? 'border-slate-200 bg-white text-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.03)]'
                        : chipIsActive(chip.action)
                          ? 'border-[#00BD6F] bg-[#00BD6F]/10 text-[#008A52]'
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
            <h2 className="text-[13px] font-bold text-slate-800 uppercase tracking-widest">
              {searchType === 'restaurant' ? 'Restaurants' : 'Dishes'}
            </h2>
            <span className="text-[12px] font-bold text-slate-500 bg-slate-200/50 px-2.5 py-0.5 rounded-full">{currentResultsLength} results</span>
          </div>
        )}

        {query && (
          <div className="animate-[fadeSlideUp_0.4s_ease-out]">
            {isSearching ? (
              <div className="flex flex-col items-center justify-center pt-24">
                <Loader2 className="w-8 h-8 text-[#00BD6F] animate-spin" strokeWidth={2.5} />
                <p className="mt-3 text-[13px] font-bold text-slate-400">Searching delicious food...</p>
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center pt-20 px-8 text-center animate-[fadeIn_0.3s_ease-out]">
                <div className="w-24 h-24 mb-6 rounded-full bg-red-50 flex items-center justify-center border border-red-100 shadow-sm">
                  <AlertCircle className="w-10 h-10 text-red-300" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">Something went wrong</h3>
                <p className="text-[14px] font-medium text-slate-500 mb-8 max-w-[240px]">We couldn't load search results. Check your connection and try again.</p>
                <button onClick={retry} className="bg-[#00BD6F] text-white px-8 py-3 rounded-[16px] font-bold text-[14px] active:scale-95 transition-all">Try Again</button>
              </div>
            ) : currentResultsLength > 0 ? (
              searchType === 'restaurant' ? (
                <div className="space-y-4">
                  {filteredRestaurants.map((item) => (
                    <RestaurantCard
                      key={item.id}
                      {...item}
                      onClick={() => onRestaurantClick?.(item)}
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 pb-6">
                  {filteredDishes.map((dish) => {
                    const restaurant = dishRestaurant(dish);
                    return (
                      <GridMenuItemCard
                        key={`${dish.restaurant.id}-${dish.itemId}`}
                        item={dishToMenuItem(dish)}
                        quantity={0}
                        restaurantName={dish.restaurant.name}
                        onAdd={(id) => {
                          onRestaurantClick?.(restaurant);
                          onItemAdd?.(restaurant, id);
                        }}
                        onRemove={() => {}}
                        onClick={() => {
                          onRestaurantClick?.(restaurant);
                        }}
                      />
                    );
                  })}
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
