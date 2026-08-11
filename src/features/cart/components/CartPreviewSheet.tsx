import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Trash2, X, Plus, Minus, ChevronRight } from 'lucide-react';
import { CartItem } from '@/types';
import { ConfirmationBottomSheet } from '@/shared/components/ConfirmationBottomSheet';
import { useHardwareBack } from '@/services/backButton';

interface CartPreviewSheetProps {
  showCartPreview: boolean;
  setShowCartPreview: (show: boolean) => void;
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
  totalItems: number;
  totalPrice: number;
  handleQuantityChange: (cartItemId: string, delta: number) => void;
  onCheckoutClick: () => void;
  checkoutButtonText?: string;
  checkoutButtonPrice?: number;
}

export const CartPreviewSheet: React.FC<CartPreviewSheetProps> = ({
  showCartPreview,
  setShowCartPreview,
  cart,
  setCart,
  totalItems,
  totalPrice,
  handleQuantityChange,
  onCheckoutClick,
  checkoutButtonText = "Proceed to Checkout",
  checkoutButtonPrice
}) => {
  const [showClearConfirm, setShowClearConfirm] = React.useState(false);

  // The sheet stays mounted (visibility is prop-driven), so the back handler
  // is only registered while it is actually showing. Android hardware back
  // closes the sheet instead of exiting the app.
  useHardwareBack(() => {
    setShowCartPreview(false);
    return true;
  }, showCartPreview);

  return (
    <>
    <AnimatePresence>
      {showCartPreview && totalItems > 0 && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            onClick={() => setShowCartPreview(false)}
          />
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[70] pb-safe-8 max-h-[75vh] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 pb-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#00bd6f]/10 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-[#00bd6f]" />
                </div>
                <div>
                  <h2 className="text-[18px] font-black text-slate-900">Your Cart</h2>
                  <p className="text-[12px] text-slate-500 font-medium">{totalItems} item{totalItems > 1 ? 's' : ''} · ₹{totalPrice}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    setShowCartPreview(false);
                    setShowClearConfirm(true);
                  }}
                  className="w-9 h-9 flex items-center justify-center bg-red-50 text-red-500 rounded-full active:scale-95 transition-transform"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setShowCartPreview(false)}
                  className="w-9 h-9 flex items-center justify-center bg-slate-100 rounded-full text-slate-600 active:scale-95 transition-transform"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.map((cartItem) => (
                <div key={cartItem.cartItemId} className="flex items-center gap-3 bg-slate-50/80 rounded-2xl p-3 border border-slate-100">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 relative bg-white">
                    <img loading="lazy" src={cartItem.item.image} alt={cartItem.item.name} className="w-full h-full object-cover" />
                    {(cartItem.item.dietaryType === 'Veg' || cartItem.item.dietaryType === 'Non-Veg' || cartItem.item.dietaryType === 'Egg' || cartItem.item.isVeg || cartItem.item.isEgg || cartItem.item.isNonVeg) && (
                      <div className="absolute top-0.5 right-0.5 bg-white/90 p-0.5 rounded">
                        <div className={`w-2 h-2 border flex items-center justify-center rounded-sm ${
                          cartItem.item.dietaryType === 'Veg' || (cartItem.item.isVeg && cartItem.item.dietaryType !== 'Non-Veg' && cartItem.item.dietaryType !== 'Egg' && cartItem.item.dietaryType !== '') ? 'border-green-500' :
                          cartItem.item.dietaryType === 'Egg' || cartItem.item.isEgg ? 'border-yellow-500' : 'border-red-500'
                        }`}>
                          <div className={`w-1 h-1 rounded-full ${
                            cartItem.item.dietaryType === 'Veg' || (cartItem.item.isVeg && cartItem.item.dietaryType !== 'Non-Veg' && cartItem.item.dietaryType !== 'Egg' && cartItem.item.dietaryType !== '') ? 'bg-green-500' :
                            cartItem.item.dietaryType === 'Egg' || cartItem.item.isEgg ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[13px] font-bold text-slate-900 truncate">{cartItem.item.name}</h4>
                    {(cartItem.variant || (cartItem.selectedAddons && cartItem.selectedAddons.length > 0)) && (
                      <span className="text-[10px] text-slate-500 font-medium block truncate">
                        {[
                          cartItem.variant?.name,
                          ...(cartItem.selectedAddons?.map(a => a.name) || [])
                        ].filter(Boolean).join(', ')}
                      </span>
                    )}
                    <span className="text-[13px] font-bold text-slate-900 mt-0.5 block">₹{cartItem.totalPrice}</span>
                  </div>
                  <div className="flex items-center bg-white border border-slate-200 rounded-lg h-8 px-1 min-w-[70px] shrink-0">
                    <button onClick={() => handleQuantityChange(cartItem.cartItemId, -1)} className="w-6 h-full flex items-center justify-center text-[#00bd6f] active:scale-95">
                      <Minus size={12} className="stroke-[3]" />
                    </button>
                    <span className="text-xs font-bold text-slate-900 flex-1 text-center">{cartItem.quantity}</span>
                    <button onClick={() => handleQuantityChange(cartItem.cartItemId, 1)} className="w-6 h-full flex items-center justify-center text-[#00bd6f] active:scale-95">
                      <Plus size={12} className="stroke-[3]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Button */}
            <div className="p-4 pt-3 border-t border-slate-100 shrink-0">
              <button 
                onClick={() => { setShowCartPreview(false); onCheckoutClick(); }}
                className="w-full flex items-center justify-between bg-[#00bd6f] text-white py-3.5 px-5 rounded-2xl font-bold text-[15px] active:scale-[0.98] transition-transform shadow-sm shadow-green-600/20"
              >
                <span>{checkoutButtonText}</span>
                <span className="flex items-center gap-1.5">
                  ₹{checkoutButtonPrice !== undefined 
                      ? checkoutButtonPrice.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) 
                      : totalPrice} 
                  <ChevronRight className="w-5 h-5" />
                </span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    <AnimatePresence>
      {showClearConfirm && (
        <ConfirmationBottomSheet
          type="clear_cart"
          onConfirm={() => {
            setCart([]);
            setShowClearConfirm(false);
          }}
          onClose={() => {
            setShowClearConfirm(false);
            setShowCartPreview(true);
          }}
        />
      )}
    </AnimatePresence>
    </>
  );
};
