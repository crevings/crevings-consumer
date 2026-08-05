import React, { useState, useMemo } from 'react';
import { ChevronLeft, SlidersHorizontal } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { FilterBottomSheet } from "@/shared/components/FilterBottomSheet";
import { SortBottomSheet } from "@/shared/components/SortBottomSheet";
import { FilterOptions } from '@/types';
import { GridMenuItemCard } from './GridMenuItemCard';
import { useCategoryDetail } from '@/api/restaurants';

interface CategoryDetailViewProps {
  category: string;
  onBack: () => void;
  onRestaurantClick: (restaurant: any) => void;
  onItemAdd: (restaurant: any, itemId: string) => void;
}

export const CategoryDetailView: React.FC<CategoryDetailViewProps> = ({ category, onBack, onRestaurantClick, onItemAdd }) => {
  const { restaurants: liveRestaurants, isLoading } = useCategoryDetail(category);

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

    let items = liveRestaurants.flatMap((rest: any) => 
      (rest.menu || []).map((item: any) => ({
        ...item,
        restaurant: rest
      }))
    );

    // Filter items based on activeFilters
    items = items.filter((item: any) => {
      const matchRating = (item.rating || 4.2) >= activeFilters.minRating;
      const matchDietary = activeFilters.dietary === 'all' || 
                           (activeFilters.dietary === 'veg' && item.veg) || 
                           (activeFilters.dietary === 'non-veg' && !item.veg) ||
                           (activeFilters.dietary === 'egg' && item.isEgg);
      return matchRating && matchDietary;
    });

    const currentSort = activeFilters.sortBy || sortMode;
    if (currentSort === 'ratingHigh' || currentSort === 'rating') items = [...items].sort((a: any, b: any) => b.rating - a.rating);
    else if (currentSort === 'ratingLow') items = [...items].sort((a: any, b: any) => a.rating - b.rating);
    else if (currentSort === 'priceLow') items = [...items].sort((a: any, b: any) => a.price - b.price);
    else if (currentSort === 'priceHigh') items = [...items].sort((a: any, b: any) => b.price - a.price);

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
        {allItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 pb-6">
            {allItems.map((item: any) => (
              <GridMenuItemCard
                key={`${item.restaurant.id}-${item.id}`}
                item={{...item, isVeg: item.veg ?? item.isVeg}}
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