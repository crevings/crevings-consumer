import React from 'react';
import { X, Star, Plus, Minus, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  rating: number;
  ratingCount: string;
  image: string;
  isVeg: boolean;
  isEgg?: boolean;
  description?: string;
  category: string;
  bestseller?: boolean;
  spicy?: boolean;
  available?: boolean;
  hasOffer?: boolean;
  servingSize?: string;
  piecesInfo?: string;
}

interface MenuItemDetailBottomSheetProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  quantity: number;
  onUpdateQuantity: (delta: number) => void;
}

export const MenuItemDetailBottomSheet: React.FC<MenuItemDetailBottomSheetProps> = ({
  item,
  isOpen,
  onClose,
  quantity,
  onUpdateQuantity
}) => {
  return (
    <AnimatePresence>
      {isOpen && item && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[60]"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[70] overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Floating Close Button */}
            <div className="absolute top-4 right-4 z-10">
              <button 
                onClick={onClose}
                className="w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white active:scale-95 transition-transform"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto pb-safe">
              {/* Image Header */}
              {item.image && (
                <div className="relative w-full aspect-square max-h-[40vh]">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Veg/Non-Veg Icon */}
                    <div className={`w-4 h-4 border flex items-center justify-center rounded-sm mb-2 ${item.isVeg ? 'border-green-500' : item.isEgg ? 'border-yellow-500' : 'border-red-500'}`}>
                      <div className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-500' : item.isEgg ? 'bg-yellow-500' : 'bg-red-500'}`} />
                    </div>
                    
                    <h2 className="text-xl font-bold text-slate-900 leading-tight mb-2">{item.name}</h2>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-slate-500 line-through">₹{Math.round(item.price * 1.2)}</span>
                      <span className="text-lg font-bold text-slate-900">₹{item.price}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-1 bg-green-50 text-green-700 px-1.5 py-0.5 rounded text-xs font-bold">
                        <Star className="w-3 h-3 fill-current" />
                        {item.rating}
                      </div>
                      <span className="text-xs text-slate-500 font-medium">({item.ratingCount})</span>
                    </div>
                  </div>

                  {/* Add Button / Quantity Selector */}
                  <div className="flex flex-col items-center shrink-0">
                    {quantity === 0 ? (
                      <button 
                        onClick={() => onUpdateQuantity(1)}
                        className="w-24 py-2.5 bg-white border border-[#00bd6f] text-[#00bd6f] rounded-xl font-bold text-sm shadow-sm active:scale-95 transition-transform hover:bg-[#00bd6f]/5"
                      >
                        ADD
                      </button>
                    ) : (
                      <div className="flex items-center justify-between bg-[#00bd6f] rounded-xl h-10 px-1 w-24 shadow-sm">
                        <button onClick={() => onUpdateQuantity(-1)} className="w-8 h-full flex items-center justify-center text-white active:scale-95 transition-transform">
                          <Minus className="w-4 h-4 stroke-[3]" />
                        </button>
                        <span className="text-sm font-bold text-white">{quantity}</span>
                        <button onClick={() => onUpdateQuantity(1)} className="w-8 h-full flex items-center justify-center text-white active:scale-95 transition-transform">
                          <Plus className="w-4 h-4 stroke-[3]" />
                        </button>
                      </div>
                    )}
                    <span className="text-[10px] text-slate-500 font-medium mt-1.5">Customisable</span>
                  </div>
                </div>

                {/* Details Section */}
                {(item.servingSize || item.piecesInfo) && (
                  <div className="flex flex-wrap gap-3 py-2 border-y border-slate-100">
                    {item.servingSize && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-700">Serving Size:</span>
                        <span className="text-xs font-medium text-slate-500">{item.servingSize}</span>
                      </div>
                    )}
                    {item.piecesInfo && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-700">Pieces Info:</span>
                        <span className="text-xs font-medium text-slate-500">{item.piecesInfo}</span>
                      </div>
                    )}
                  </div>
                )}

                {item.description && (
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
