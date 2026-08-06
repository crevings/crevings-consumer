import React from 'react';
import { Percent, Minus, Plus } from 'lucide-react';
import { MenuItem } from '@/types';

interface MenuItemCardProps {
  item: MenuItem;
  getItemQuantity: (id: string) => number;
  handleAdd: (id: string) => void;
  handleRemove: (id: string) => void;
  onItemClick: (item: MenuItem) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  getItemQuantity,
  handleAdd,
  handleRemove,
  onItemClick
}) => {
  const quantity = getItemQuantity(item.id);

  return (
    <div 
      className={`flex border border-gray-200 rounded-2xl p-2.5 bg-white relative transition-all ${
        quantity > 0 ? 'border-[#00bd6f] bg-[#f4fdf8]' : ''
      } ${item.available === false ? 'opacity-50 grayscale' : ''}`}
    >
      {/* Image side */}
      {item.image && (
        <div 
          className="relative w-[130px] h-[130px] shrink-0 mr-3 cursor-pointer"
          onClick={() => onItemClick(item)}
        >
          <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-[14px]" />
          
          {/* Veg/Nonveg badge top-left */}
          <div className="absolute top-1.5 left-1.5 bg-white p-0.5 rounded shadow-sm">
            <div className={`w-3.5 h-3.5 border flex items-center justify-center rounded-sm ${item.isVeg ? 'border-green-600' : item.isEgg ? 'border-yellow-500' : 'border-red-600'}`}>
              {item.isVeg ? (
                <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
              ) : item.isEgg ? (
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
              ) : (
                <div className="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-b-[5px] border-b-red-600" />
              )}
            </div>
          </div>
        </div>
      )}

      {!item.image && (
        <div className="relative shrink-0 mr-3 w-[24px]">
          <div className="absolute top-1 bg-white p-0.5 rounded shadow-sm">
            <div className={`w-3.5 h-3.5 border flex items-center justify-center rounded-sm ${item.isVeg ? 'border-green-600' : item.isEgg ? 'border-yellow-500' : 'border-red-600'}`}>
              {item.isVeg ? (
                <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
              ) : item.isEgg ? (
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
              ) : (
                <div className="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-b-[5px] border-b-red-600" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content side */}
      <div className="flex-1 flex flex-col pt-1">
        <div className="flex gap-1.5 mb-1.5">
          {item.bestseller && (
            <span className="text-[10px] items-center font-bold text-[#b45309] bg-[#fef3c7] px-1.5 py-0.5 rounded uppercase tracking-wide">Bestseller</span>
          )}
          {item.spicy && (
            <span className="text-[10px] items-center font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded uppercase tracking-wide">Spicy</span>
          )}
        </div>
        <div className="flex justify-between items-start">
          <h4 className="text-[16px] font-bold text-gray-900 leading-tight pr-2">{item.name}</h4>
        </div>
        
        {item.description && (
          <p className="text-[13px] text-gray-500 line-clamp-2 leading-snug mt-1.5">{item.description}</p>
        )}

        {/* Individual Item Offer Tag */}
        {item.bestseller && (
          <div className="mt-2.5">
            <div className="inline-flex items-center gap-1 bg-[#00bd6f]/10 px-1.5 py-0.5 rounded-[4px] border border-[#00bd6f]/20">
              <Percent className="w-3 h-3 text-[#00bd6f]" />
              <span className="text-[9px] font-bold text-[#00bd6f] uppercase tracking-wider">Buy 1 Get 1 Free</span>
            </div>
          </div>
        )}
        {item.category === 'Pizzas' && !item.bestseller && (
          <div className="mt-2.5">
            <div className="inline-flex items-center gap-1 bg-blue-50 px-1.5 py-0.5 rounded-[4px] border border-blue-100">
              <Percent className="w-3 h-3 text-blue-600" />
              <span className="text-[9px] font-bold text-blue-600 uppercase tracking-wider">Flat ₹100 Off</span>
            </div>
          </div>
        )}

        {/* Tags layer (if unavailable, show that) */}
        {item.available === false && (
          <div className="mt-1.5">
            <span className="inline-block text-[10px] items-center font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-md uppercase tracking-wide">Unavailable</span>
          </div>
        )}
        
        <div className="flex items-center justify-between mt-auto pt-2">
          {/* Price & Tags */}
          <div className="flex items-center gap-3">
            <span className="text-[17px] font-bold text-gray-900 leading-none">₹{item.price}</span>
          </div>
          
          {/* Action Button */}
          {quantity > 0 ? (
            <div className="flex items-center justify-between bg-[#21c55e] rounded-full h-[32px] px-1 min-w-[80px]">
              <button onClick={() => handleRemove(item.id)} className="w-7 h-full flex items-center justify-center text-white active:scale-95">
                <Minus className="w-4 h-4 stroke-[3]" />
              </button>
              <span className="text-[14px] font-bold text-white">{quantity}</span>
              <button onClick={() => handleAdd(item.id)} className="w-7 h-full flex items-center justify-center text-white active:scale-95">
                <Plus className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => item.available !== false && handleAdd(item.id)} 
              disabled={item.available === false}
              className={`px-5 py-1.5 rounded-full font-bold text-[13px] flex items-center transition-transform tracking-wide ${
                item.available === false 
                  ? 'bg-gray-100 text-gray-400' 
                  : 'bg-[#21c55e] text-white hover:bg-[#16a34a] active:scale-95'
              }`}
            >
              ADD
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
