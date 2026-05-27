import React, { useState, useMemo } from 'react';
import { ArrowLeft, SlidersHorizontal, ChevronDown, Plus, Star } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { FilterBottomSheet } from "@/shared/components/FilterBottomSheet";
import { SortBottomSheet } from "@/shared/components/SortBottomSheet";
import { FilterOptions } from "@/types";

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
                           (activeFilters.dietary === 'non-veg' && !item.veg);
      return matchRating && matchDietary;
    });

    const currentSort = activeFilters.sortBy || sortMode;
    if (currentSort === 'ratingHigh' || currentSort === 'rating') items = [...items].sort((a: any, b: any) => b.rating - a.rating);
    else if (currentSort === 'ratingLow') items = [...items].sort((a: any, b: any) => a.rating - b.rating);
    else if (currentSort === 'priceLow') items = [...items].sort((a: any, b: any) => a.price - b.price);
    else if (currentSort === 'priceHigh') items = [...items].sort((a: any, b: any) => b.price - a.price);

    return items;
  }, [data, activeFilters, sortMode]);

  const sortLabel = useMemo(() => {
    switch (sortMode) {
      case 'rating': return 'Rating';
      case 'priceLow': return 'Price: Low';
      case 'priceHigh': return 'Price: High';
      default: return 'Sort by';
    }
  }, [sortMode]);

  return (
    <div className="min-h-screen bg-white pb-20 animate-fadeInRight">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="flex items-center gap-3 px-4 py-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-slate-900 leading-tight">{category}</h1>
            <p className="text-xs text-slate-500 font-medium">{data.description}</p>
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

      {/* Category Banner */}
      <div className="px-4 py-4">
        <div className="w-full h-[180px] rounded-[24px] overflow-hidden relative shadow-sm">
          <img src={data.banner} alt={category} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-white font-black text-2xl leading-tight mb-1">Best of {category}</h2>
            <p className="text-white/80 text-sm font-medium">{allItems.length} items to explore</p>
          </div>
        </div>
      </div>

      {/* Food Items Grid */}
      <div className="px-4">
        {allItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {allItems.map((item: any) => (
              <div 
                key={item.id} 
                onClick={() => {
                  onRestaurantClick(item.restaurant);
                  onItemAdd(item.restaurant, item.id);
                }}
                className={`flex flex-col bg-white rounded-2xl p-2 border border-gray-100 shadow-sm relative cursor-pointer active:scale-95 transition-transform ${item.available === false ? 'opacity-60' : ''}`}
              >
                {item.image && (
                  <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-2.5">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    <div className="absolute top-1.5 left-1.5 bg-white/95 p-1 rounded-md shadow-sm">
                      <div className={`w-3 h-3 border flex items-center justify-center rounded-sm ${item.veg ? 'border-green-600' : item.isEgg ? 'border-yellow-500' : 'border-red-600'}`}>
                        {item.veg ? (
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
                    <div className={`w-4 h-4 border flex items-center justify-center rounded-sm ${item.veg ? 'border-green-600' : item.isEgg ? 'border-yellow-500' : 'border-red-600'}`}>
                      {item.veg ? (
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
                        onRestaurantClick(item.restaurant);
                        onItemAdd(item.restaurant, item.id);
                      }
                    }} 
                    disabled={item.available === false}
                    className={`px-3 py-1 rounded-lg font-bold text-[12px] flex items-center gap-1 transition-transform shadow-sm ${
                      item.available === false 
                        ? 'bg-gray-50 text-gray-400 border border-gray-200' 
                        : 'bg-white text-[#00bd6f] border border-[#00bd6f]/30 hover:bg-[#f4fdf8] active:scale-95'
                    }`}
                  >
                    ADD
                  </button>
                </div>
              </div>
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