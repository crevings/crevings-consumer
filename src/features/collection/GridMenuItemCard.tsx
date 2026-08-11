import React from 'react';
import { Plus, Minus, Flame, Store, Trophy, ChefHat } from 'lucide-react';
import { MenuItem } from '@/types';

interface GridMenuItemCardProps {
  item: MenuItem;
  quantity: number;
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  onClick: (item: MenuItem) => void;
  restaurantName?: string;
}

const GridMenuItemCardUnmemoized: React.FC<GridMenuItemCardProps> = ({ item, quantity, onAdd, onRemove, onClick, restaurantName }) => {
  return (
    <div 
      className={`flex flex-col w-full snap-center cursor-pointer group ${item.available === false ? 'opacity-50 grayscale' : ''}`}
      onClick={() => onClick(item)}
    >
        {/* Image Container */}
        <div className="relative rounded-[20px] overflow-hidden aspect-square mb-2.5 transform transition-all duration-300 bg-slate-50">
            {item.image ? (
                <img loading="lazy" src={item.image} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={item.name} />
            ) : (
                <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                    <ChefHat className="w-8 h-8 text-slate-300" />
                </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none"></div>
            

            {/* Bestseller Badge (Top Right) */}
            {item.bestseller && (
                <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-md rounded-full w-5 h-5 flex items-center justify-center z-10 pointer-events-none">
                    <Trophy className="w-3 h-3 text-[#b45309] fill-[#b45309]/20" />
                </div>
            )}
            
            <div className="absolute bottom-2 right-2 flex items-center justify-center z-20">
                <div onClick={(e) => e.stopPropagation()}>
                    {quantity > 0 ? (
                        <div className="flex items-center justify-between bg-[#00bd6f] rounded-[10px] h-[32px] px-1 w-[72px] border border-[#00bd6f]">
                            <button onClick={() => onRemove(item.id)} className="w-6 h-full flex items-center justify-center text-white active:scale-95">
                                <Minus className="w-3.5 h-3.5 stroke-[3]" />
                            </button>
                            <span className="text-[13px] font-black text-white">{quantity}</span>
                            <button onClick={() => onAdd(item.id)} className="w-6 h-full flex items-center justify-center text-white active:scale-95">
                                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <button 
                                onClick={() => item.available !== false && onAdd(item.id)}
                                disabled={item.available === false}
                                className={`h-[32px] px-5 rounded-[12px] text-[13px] font-black transition-transform flex items-center justify-center ${
                                    item.available === false 
                                    ? 'bg-white/90 text-slate-400 cursor-not-allowed' 
                                    : 'bg-[#00bd6f] text-white hover:bg-emerald-600 active:scale-90 border border-emerald-500'
                                }`}
                            >
                                Add
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Details Container */}
        <div className="flex flex-col px-1 mb-2">
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
               {/* Veg/Nonveg/Egg indicator & Serves */}
               <div className="flex items-center gap-1 px-1.5 py-[3px] rounded-full border border-slate-200 bg-white">
                   {(item.dietaryType === 'Veg' || item.dietaryType === 'Non-Veg' || item.dietaryType === 'Egg' || item.isVeg || item.isEgg || item.isNonVeg) && (
                     item.dietaryType === 'Veg' || (item.isVeg && item.dietaryType !== 'Non-Veg' && item.dietaryType !== 'Egg' && item.dietaryType !== '') ? (
                       <div className="w-2.5 h-2.5 border border-green-600 flex items-center justify-center rounded-[2px]">
                         <div className="w-1 h-1 rounded-full bg-green-600" />
                       </div>
                     ) : item.dietaryType === 'Egg' || item.isEgg ? (
                       <div className="w-2.5 h-2.5 border border-yellow-500 flex items-center justify-center rounded-[2px]">
                         <div className="w-1 h-1 rounded-full bg-yellow-500" />
                       </div>
                     ) : (
                       <div className="w-2.5 h-2.5 border border-red-600 flex items-center justify-center rounded-[2px]">
                         <div className="w-0 h-0 border-l-[2px] border-l-transparent border-r-[2px] border-r-transparent border-b-[3px] border-b-red-600" />
                       </div>
                     )
                   )}
                   <span className="text-[9px] font-bold text-slate-700">
                     Serves 1
                   </span>
               </div>

               {/* Spicy Tag */}
               {item.spicy && (
                  <div className="flex items-center gap-0.5 px-1.5 py-[3px] rounded-full bg-red-50 border border-red-100">
                     <Flame className="w-2.5 h-2.5 text-red-600 fill-red-600" />
                     <span className="text-[9px] font-bold text-red-700">Spicy</span>
                  </div>
               )}
            </div>

            <h4 className="text-slate-900 font-bold text-[14px] leading-[1.1] mb-0.5 line-clamp-2">{item.name}</h4>
            
            {restaurantName && (
              <div className="flex items-center gap-1 text-slate-500 mb-0.5 mt-0.5">
                <Store className="w-3 h-3 opacity-70 shrink-0" />
                <span className="text-[11px] font-semibold truncate leading-tight">{restaurantName}</span>
              </div>
            )}
            
            {/* Description */}
            {item.description && (
               <p className="text-[12px] text-slate-500 line-clamp-2 leading-[1.3] font-medium">{item.description}</p>
            )}

            {/* Price */}
            <div className="mt-1.5 flex flex-col">
                <span className="text-slate-900 font-black text-[15px] leading-none">₹{item.price}</span>
            </div>
        </div>
    </div>
  );
};

export const GridMenuItemCard = React.memo(GridMenuItemCardUnmemoized);
