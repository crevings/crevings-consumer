import React, { useState, useMemo } from 'react';
import { ArrowLeft, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { RestaurantCard } from './RestaurantCard';
import { FilterBottomSheet } from './FilterBottomSheet';
import { SortBottomSheet } from './SortBottomSheet';
import { Restaurant, FilterOptions } from '../types';

interface CollectionDetailViewProps {
  collection: any;
  restaurants: Restaurant[];
  hiddenIds: string[];
  favouriteIds: string[];
  onBack: () => void;
  onHide: (id: string | number) => void;
  onFavourite: (id: string | number) => void;
  onRestaurantClick: (restaurant: Restaurant) => void;
  onItemAdd: (restaurant: Restaurant, itemId: string) => void;
}

export const CollectionDetailView: React.FC<CollectionDetailViewProps> = ({
  collection,
  restaurants,
  hiddenIds,
  favouriteIds,
  onBack,
  onHide,
  onFavourite,
  onRestaurantClick,
  onItemAdd
}) => {
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

  const visibleRestaurants = useMemo(() => {
    let list = restaurants.filter(r => !hiddenIds.includes(String(r.id)));
    
    list = list.filter(r => {
      const matchRating = r.rating >= activeFilters.minRating;
      const matchTime = r.timeValue <= activeFilters.maxTime;
      const matchDistance = r.distanceValue <= activeFilters.maxDistance;
      const matchOffers = !activeFilters.offersOnly || !!r.offer;
      const matchDietary = activeFilters.dietary === 'all' || r.dietary.includes(activeFilters.dietary);
      return matchRating && matchTime && matchDistance && matchOffers && matchDietary;
    });

    const currentSort = activeFilters.sortBy || sortMode;
    if (currentSort === 'ratingHigh' || currentSort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    else if (currentSort === 'ratingLow') list = [...list].sort((a, b) => a.rating - b.rating);
    else if (currentSort === 'time') list = [...list].sort((a, b) => a.timeValue - b.timeValue);
    else if (currentSort === 'distanceNear' || currentSort === 'distance') list = [...list].sort((a, b) => a.distanceValue - b.distanceValue);
    else if (currentSort === 'distanceFar') list = [...list].sort((a, b) => b.distanceValue - a.distanceValue);
    else if (currentSort === 'priceLow') list = [...list].sort((a, b) => parseInt(a.price.replace(/\D/g, '')) - parseInt(b.price.replace(/\D/g, '')));
    else if (currentSort === 'priceHigh') list = [...list].sort((a, b) => parseInt(b.price.replace(/\D/g, '')) - parseInt(a.price.replace(/\D/g, '')));
    
    return list;
  }, [restaurants, hiddenIds, activeFilters, sortMode]);

  const sortLabel = useMemo(() => {
    switch (sortMode) {
      case 'rating': return 'Rating';
      case 'time': return 'Time';
      case 'distance': return 'Distance';
      case 'priceLow': return 'Price: Low';
      case 'priceHigh': return 'Price: High';
      default: return 'Sort by';
    }
  }, [sortMode]);

  return (
    <div className="min-h-screen bg-white pb-20 animate-fadeInRight">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-100">
        <div className="flex items-center gap-3 px-4 py-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-slate-900 leading-tight">{collection.title}</h1>
            <p className="text-xs text-slate-500 font-medium">{collection.subtitle}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="px-4 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-sm font-medium text-slate-700 shrink-0 active:bg-slate-50"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filter
          </button>
          <button 
            onClick={() => setIsSortOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-sm font-medium text-slate-700 shrink-0 active:bg-slate-50"
          >
            {sortLabel}
            <ChevronDown className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setActiveFilters(prev => ({ ...prev, priceRange: prev.priceRange === 'under49' ? null : 'under49' }))}
            className={`flex items-center px-3 py-1.5 border rounded-full transition-all shrink-0 active:scale-95 shadow-sm ${activeFilters.priceRange === 'under49' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'}`}>
              <span className="text-sm font-medium">₹49 & under</span>
          </button>
          <button 
            onClick={() => setActiveFilters(prev => ({ ...prev, priceRange: prev.priceRange === '49to99' ? null : '49to99' }))}
            className={`flex items-center px-3 py-1.5 border rounded-full transition-all shrink-0 active:scale-95 shadow-sm ${activeFilters.priceRange === '49to99' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'}`}>
              <span className="text-sm font-medium">₹49 - ₹99</span>
          </button>
          <button 
            onClick={() => setActiveFilters(prev => ({ ...prev, dietary: prev.dietary === 'veg' ? 'all' : 'veg' }))}
            className={`flex items-center px-3 py-1.5 border rounded-full transition-all shrink-0 active:scale-95 shadow-sm ${activeFilters.dietary === 'veg' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'}`}>
              <span className="text-sm font-medium">Veg</span>
          </button>
          <button 
            onClick={() => setActiveFilters(prev => ({ ...prev, dietary: prev.dietary === 'non-veg' ? 'all' : 'non-veg' }))}
            className={`flex items-center px-3 py-1.5 border rounded-full transition-all shrink-0 active:scale-95 shadow-sm ${activeFilters.dietary === 'non-veg' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'}`}>
              <span className="text-sm font-medium">Non Veg</span>
          </button>
          <button 
            onClick={() => setActiveFilters(prev => ({ ...prev, dietary: prev.dietary === 'egg' ? 'all' : 'egg' }))}
            className={`flex items-center px-3 py-1.5 border rounded-full transition-all shrink-0 active:scale-95 shadow-sm ${activeFilters.dietary === 'egg' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'}`}>
              <span className="text-sm font-medium">Egg</span>
          </button>
        </div>
      </div>

      {/* Collection Banner */}
      <div className="px-4 py-4">
        <div className="w-full h-[180px] rounded-[24px] overflow-hidden relative shadow-sm">
          <img src={collection.image} alt={collection.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-white font-black text-2xl leading-tight mb-1">{collection.title}</h2>
            <p className="text-white/80 text-sm font-medium">{visibleRestaurants.length} places to explore</p>
          </div>
        </div>
      </div>

      {/* Restaurant List */}
      <div className="px-4">
        {visibleRestaurants.length > 0 ? (
          visibleRestaurants.map((rest) => (
            <RestaurantCard 
              key={rest.id} 
              {...rest} 
              onHide={onHide} 
              onFavourite={onFavourite} 
              onClick={() => onRestaurantClick(rest)} 
              onItemAdd={(itemId) => onItemAdd(rest, itemId)} 
            />
          ))
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
