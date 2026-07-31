import React, { useState, useMemo } from 'react';
import { ArrowLeft, SlidersHorizontal, Star, MapPin } from 'lucide-react';
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

const getCategoryBanner = (catName: string) => {
  const nameLower = catName.toLowerCase();
  if (nameLower.includes("burger")) return "/categories/Burger.png";
  if (nameLower.includes("pizza")) return "/categories/Pizza.png";
  if (nameLower.includes("chole") || nameLower.includes("bhatur")) return "/categories/Chola Bhatura.png";
  if (nameLower.includes("dimsum") || nameLower.includes("momo")) return "/categories/Dimsums.png";
  if (nameLower.includes("idli") || nameLower.includes("dosa")) return "/categories/Idli.png";
  if (nameLower.includes("juice")) return "/categories/Juices.png";
  if (nameLower.includes("noodle") || nameLower.includes("chow")) return "/categories/Noodles.png";
  if (nameLower.includes("paratha")) return "/categories/Paratha.png";
  if (nameLower.includes("pasta")) return "/categories/Pasta.png";
  if (nameLower.includes("pastry") || nameLower.includes("cake")) return "/categories/Pastry.png";
  if (nameLower.includes("rice") || nameLower.includes("biryani")) return "/categories/Rice.png";
  if (nameLower.includes("sand")) return "/categories/Sandwhich.png";
  if (nameLower.includes("shake")) return "/categories/Shakes.png";
  if (nameLower.includes("sweet")) return "/categories/Sweets.png";
  if (nameLower.includes("tea") || nameLower.includes("chai")) return "/categories/Tea.png";
  return "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80";
};

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

  const bannerImg = getCategoryBanner(category);

  return (
    <div className="w-full min-h-screen bg-white pb-20 relative left-0 right-0 p-0 m-0">
      {/* Header / Banner */}
      <div className="relative w-full h-[260px] rounded-b-[40px] overflow-hidden mb-6 shadow-sm">
        <img src={bannerImg} alt={category} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-90"></div>
        
        {/* Top Actions */}
        <div className="absolute top-0 left-0 right-0 pt-safe px-4 py-4 flex items-center justify-between z-20">
          <button 
            type="button"
            onClick={onBack}
            className="w-11 h-11 flex items-center justify-center rounded-full bg-slate-900/60 backdrop-blur-md active:scale-95 transition-transform text-white shadow-md cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Text Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-6 z-10">
          <h2 className="text-amber-50 font-serif italic text-4xl sm:text-5xl tracking-tight mb-3 drop-shadow-lg text-center px-4 leading-tight">{category}</h2>
          <div className="bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
            <span className="text-white font-bold text-[10px] uppercase tracking-[0.2em]">Curated in your City</span>
          </div>
        </div>
      </div>

      {/* Filters (Veg / Non-veg / Egg) */}
      <div className="px-4 mb-6 flex gap-3 overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setActiveFilters(prev => ({ ...prev, dietary: prev.dietary === 'veg' ? 'all' : 'veg' }))}
          className={`flex items-center gap-2 px-3 py-2 border rounded-[12px] bg-white transition-all shrink-0 shadow-sm ${activeFilters.dietary === 'veg' ? 'border-green-500 shadow-green-100' : 'border-slate-200'}`}
        >
          <div className="w-3.5 h-3.5 border border-green-600 flex items-center justify-center rounded-[3px]">
             <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
          </div>
          <span className="text-[13px] font-bold text-slate-700">Veg</span>
        </button>

        <button 
          onClick={() => setActiveFilters(prev => ({ ...prev, dietary: prev.dietary === 'non-veg' ? 'all' : 'non-veg' }))}
          className={`flex items-center gap-2 px-3 py-2 border rounded-[12px] bg-white transition-all shrink-0 shadow-sm ${activeFilters.dietary === 'non-veg' ? 'border-red-500 shadow-red-100' : 'border-slate-200'}`}
        >
          <div className="w-3.5 h-3.5 border border-red-600 flex items-center justify-center rounded-[3px]">
             <div className="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-b-[5px] border-b-red-600" />
          </div>
          <span className="text-[13px] font-bold text-slate-700">Non-Veg</span>
        </button>

        <button 
          onClick={() => setActiveFilters(prev => ({ ...prev, dietary: prev.dietary === 'egg' ? 'all' : 'egg' }))}
          className={`flex items-center gap-2 px-3 py-2 border rounded-[12px] bg-white transition-all shrink-0 shadow-sm ${activeFilters.dietary === 'egg' ? 'border-yellow-500 shadow-yellow-100' : 'border-slate-200'}`}
        >
          <div className="w-3.5 h-3.5 border border-yellow-500 flex items-center justify-center rounded-[3px]">
             <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
          </div>
          <span className="text-[13px] font-bold text-slate-700">Egg</span>
        </button>
      </div>

      {/* Food Items Grid */}
      <div className="px-4">
        {allItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 pb-6">
            {allItems.map((item: any) => (
              <GridMenuItemCard
                key={`${item.restaurant.id}-${item.id}`}
                item={{...item, isVeg: item.veg ?? item.isVeg}} // Handle API mapping discrepancy
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
            <SlidersHorizontal className="w-12 h-12 mb-4" />
            <h3 className="text-lg font-bold mb-1">No matches found</h3>
            <p className="text-sm">Try adjusting your filters</p>
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