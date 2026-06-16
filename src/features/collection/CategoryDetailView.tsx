import React, { useState, useMemo } from 'react';
import { ArrowLeft, SlidersHorizontal, Star } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { FilterBottomSheet } from "@/shared/components/FilterBottomSheet";
import { SortBottomSheet } from "@/shared/components/SortBottomSheet";
import { FilterOptions } from '@/types';
import { GridMenuItemCard } from './GridMenuItemCard';

interface CategoryDetailViewProps {
  category: string;
  onBack: () => void;
  onRestaurantClick: (restaurant: any) => void;
  onItemAdd: (restaurant: any, itemId: string) => void;
}

const CATEGORY_DATA: Record<string, any> = {
  'Pizza': {
    icon: '🍕',
    banner: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
    description: 'Crispy crusts and melty cheese await.',
    restaurants: [
      {
        id: 1,
        name: 'Pizza Hut',
        rating: 4.2,
        time: '35 min',
        distance: '1.2 km',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80',
        tags: ['Classic', 'Family Size'],
        offer: '60% OFF',
        menu: [
          { id: 101, name: 'Margherita Pizza', price: 249, rating: 4.5, image: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?w=200&q=80', veg: true },
          { id: 102, name: 'Pepperoni Overload', price: 499, rating: 4.8, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=200&q=80', veg: false },
          { id: 103, name: 'Double Cheese', price: 349, rating: 4.3, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&q=80', veg: true },
        ]
      },
      {
        id: 2,
        name: 'Dominos Pizza',
        rating: 4.1,
        time: '25 min',
        distance: '0.8 km',
        image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=400&q=80',
        tags: ['Fastest', 'Cheese Burst'],
        offer: 'FREE DELIVERY',
        menu: [
          { id: 201, name: 'Cheese Burst Pizza', price: 450, rating: 4.7, image: 'https://images.unsplash.com/photo-1573821663912-56990544c383?w=200&q=80', veg: true },
          { id: 202, name: 'Farmhouse Pizza', price: 380, rating: 4.6, image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=200&q=80', veg: true },
        ]
      }
    ]
  },
  'Burger': {
    icon: '🍔',
    banner: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80',
    description: 'Juicy patties and artisan buns.',
    restaurants: [
      {
        id: 3,
        name: 'Truffles',
        rating: 4.5,
        time: '30 min',
        distance: '1.5 km',
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&q=80',
        tags: ['Premium', 'Bestseller'],
        offer: 'BOGO',
        menu: [
          { id: 301, name: 'Classic Beef Burger', price: 280, rating: 4.7, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80', veg: false },
          { id: 302, name: 'Zinger Burger', price: 190, rating: 4.6, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=200&q=80', veg: false },
          { id: 303, name: 'Aloo Patty Burger', price: 140, rating: 4.2, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=200&q=80', veg: true },
        ]
      }
    ]
  },
  'Biryani': {
    icon: '🍗',
    banner: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&q=80',
    description: 'Aromatic spices and perfectly cooked rice.',
    restaurants: [
      {
        id: 4,
        name: 'Meghana Foods',
        rating: 4.4,
        time: '40 min',
        distance: '2.5 km',
        image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&q=80',
        tags: ['Authentic', 'Spicy'],
        offer: 'FREE GIFT',
        menu: [
          { id: 401, name: 'Chicken Biryani', price: 320, rating: 4.8, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&q=80', veg: false },
          { id: 402, name: 'Veg Dum Biryani', price: 280, rating: 4.5, image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=200&q=80', veg: true },
        ]
      }
    ]
  }
};

export const CategoryDetailView: React.FC<CategoryDetailViewProps> = ({ category, onBack, onRestaurantClick, onItemAdd }) => {
  const data = CATEGORY_DATA[category] || CATEGORY_DATA['Pizza'];
  
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
    let items = data.restaurants.flatMap((rest: any) => 
      rest.menu.map((item: any) => ({
        ...item,
        restaurant: rest
      }))
    );

    // Filter items based on activeFilters
    items = items.filter((item: any) => {
      const matchRating = item.rating >= activeFilters.minRating;
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
  }, [data, activeFilters, sortMode]);

  return (
    <div className="min-h-screen bg-white pb-20 animate-fadeInRight relative">
      {/* Header / Banner */}
      <div className="relative w-full h-[260px] rounded-b-[40px] overflow-hidden mb-6 shadow-sm">
        <img src={data.banner} alt={category} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-80"></div>
        
        {/* Top Actions */}
        <div className="absolute top-0 left-0 right-0 pt-safe px-4 py-4 flex items-center justify-between z-10">
          <button 
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/30 backdrop-blur-md active:scale-95 transition-transform text-white/90"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Text Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-8 z-10">
          <h2 className="text-amber-50 font-serif italic text-4xl sm:text-5xl tracking-tight mb-3 drop-shadow-md text-center px-4 leading-tight">Wholesome Meals</h2>
          <div className="bg-black/30 backdrop-blur-sm px-4 py-1.5 rounded-full">
            <span className="text-white font-bold text-[10px] uppercase tracking-[0.2em]">Curated for you</span>
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