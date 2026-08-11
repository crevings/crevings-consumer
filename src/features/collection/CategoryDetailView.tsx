import React, { useState, useMemo } from 'react';
import { ChevronLeft } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { FilterBottomSheet } from "@/shared/components/FilterBottomSheet";
import { SortBottomSheet } from "@/shared/components/SortBottomSheet";
import { FilterOptions, Restaurant } from '@/types';
import { GridMenuItemCard } from '@/features/collection/GridMenuItemCard';
import { useCategoryDetail, CategoryRestaurant, CategoryMenuItem } from '@/api/restaurant';

interface CategoryDetailViewProps {
  category: string;
  onBack: () => void;
  onRestaurantClick: (restaurant: Restaurant) => void;
  onItemAdd: (restaurant: Restaurant, itemId: string) => void;
}

export const CategoryDetailView: React.FC<CategoryDetailViewProps> = ({ category, onBack, onRestaurantClick, onItemAdd }) => {
  const { restaurants: liveRestaurants, isLoading, isLoadingMore, isReachingEnd, setSize } = useCategoryDetail(category);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    maxTime: 60,
    maxDistance: 15,
    minRating: 1,
    dietary: 'all',
    offersOnly: false,
    sortBy: 'default',
    priceRange: null
  });
  const [sortMode, setSortMode] = useState<string>('default');

  const allItems = useMemo(() => {
    if (!liveRestaurants || liveRestaurants.length === 0) return [];

    let items = liveRestaurants.flatMap((rest: CategoryRestaurant) =>
      (rest.menu || []).map((item: CategoryMenuItem) => ({
        ...item,
        restaurant: rest,
      }))
    );

    // Filter items based on activeFilters
    items = items.filter((item) => {
      const matchRating = (item.rating || 4.2) >= (activeFilters.minRating ?? 0);
      const matchDietary = activeFilters.dietary === 'all' ||
                           (activeFilters.dietary === 'veg' && item.veg) ||
                           (activeFilters.dietary === 'non-veg' && !item.veg) ||
                           (activeFilters.dietary === 'egg' && item.isEgg);
      return matchRating && matchDietary;
    });

    const currentSort = activeFilters.sortBy || sortMode;
    if (currentSort === 'ratingHigh' || currentSort === 'rating') items = [...items].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (currentSort === 'ratingLow') items = [...items].sort((a, b) => (a.rating || 0) - (b.rating || 0));
    else if (currentSort === 'priceLow') items = [...items].sort((a, b) => a.price - b.price);
    else if (currentSort === 'priceHigh') items = [...items].sort((a, b) => b.price - a.price);

    return items;
  }, [liveRestaurants, activeFilters, sortMode]);

  return (
    <div className="w-full min-h-screen bg-white pb-20 relative left-0 right-0 p-0 m-0">
      {/* Header matching Settings View layout */}
      <div className="bg-white border-b border-slate-100 px-4 py-4 flex items-center gap-3 sticky top-0 z-20 shadow-sm">
        <button
          type="button"
          onClick={onBack}
          className="p-2 -ml-2 rounded-full active:scale-95 transition-transform text-slate-800"
          aria-label="Go back"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-slate-900 capitalize">
          {category}
        </h1>
      </div>

      {/* Food Items Grid directly under header */}
      <div className="p-4">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center text-center">
            <div className="w-10 h-10 border-3 border-slate-200 border-t-[#00bd6f] rounded-full animate-spin mb-3"></div>
            <p className="text-slate-500 font-bold text-sm">Loading {category}...</p>
          </div>
        ) : allItems.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-3 pb-6">
              {allItems.map((item) => (
                <GridMenuItemCard
                  key={`${item.restaurant.id}-${item.id}`}
                  item={{
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    rating: item.rating || 4.2,
                    ratingCount: "100+",
                    image: item.image || "",
                    dietaryType: item.dietaryType || (item.veg ? "Veg" : ""),
                    isVeg: item.dietaryType === "Veg" || Boolean(item.veg),
                    isEgg: item.dietaryType === "Egg",
                    isNonVeg: item.dietaryType === "Non-Veg",
                    category: "Special",
                  }}
                  quantity={0}
                  restaurantName={item.restaurant.name}
                  onAdd={(id) => {
                    onRestaurantClick(item.restaurant);
                    onItemAdd(item.restaurant, id);
                  }}
                  onRemove={() => {}}
                  onClick={() => {
                    onRestaurantClick(item.restaurant);
                  }}
                />
              ))}
            </div>

            {/* Cursor-based pagination: fetch the next page of restaurants/items.
                Keep the button visible while its own page is loading. */}
            {(!isReachingEnd || isLoadingMore) && (
              <div className="pb-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => setSize((s: number) => s + 1)}
                  disabled={isLoadingMore}
                  className="w-full max-w-xs h-12 rounded-xl font-semibold text-[15px] flex items-center justify-center gap-2 transition-all bg-[#00bd6f] text-white active:scale-[0.98] shadow-md shadow-emerald-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoadingMore ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                      Loading more...
                    </>
                  ) : (
                    "Load more"
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="py-20 flex flex-col items-center text-center opacity-40">
            <h3 className="text-lg font-bold mb-1">No items found</h3>
            <p className="text-sm">Check back soon for additions in {category}</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isFilterOpen && (
          <FilterBottomSheet 
            onClose={() => setIsFilterOpen(false)}
            initialFilters={activeFilters}
            onApply={(f) => { setActiveFilters(f); setIsFilterOpen(false); }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSortOpen && (
          <SortBottomSheet
            onClose={() => setIsSortOpen(false)}
            currentSort={sortMode}
            onSelect={(m) => { setSortMode(m); setIsSortOpen(false); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};