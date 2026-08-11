import React from 'react';
import { ShoppingCart, ChevronRight } from 'lucide-react';

interface FloatingCartBarProps {
  totalItems: number;
  totalPrice: number;
  onPreviewClick: () => void;
  onCheckoutClick: () => void;
  checkoutButtonText?: string;
  className?: string;
}

export const FloatingCartBar: React.FC<FloatingCartBarProps> = ({
  totalItems,
  totalPrice,
  onPreviewClick,
  onCheckoutClick,
  checkoutButtonText = "Checkout",
  className = "bottom-3"
}) => {
  if (totalItems <= 0) return null;

  return (
    <div className={`fixed ${className} left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md z-40 animate-[slideUp_0.3s_ease-out]`}>
      <div className="bg-white rounded-2xl p-3.5 flex items-center justify-between text-black shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100">
        <button 
          onClick={onPreviewClick}
          className="flex items-center gap-3 flex-1 min-w-0"
        >
          <div className="relative w-10 h-10 flex items-center justify-center bg-[#00bd6f]/10 rounded-full shrink-0">
            <ShoppingCart className="w-5 h-5 text-[#00bd6f]" />
            <span className="absolute -top-1 -right-1 bg-[#00bd6f] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
              {totalItems}
            </span>
          </div>
          <div className="text-left min-w-0">
            <div className="font-bold text-[15px] text-gray-900">
              {totalItems} item{totalItems > 1 ? 's' : ''}
            </div>
            <div className="text-[13px] font-medium text-[#00bd6f]">
              ₹{totalPrice} · Tap to view
            </div>
          </div>
        </button>
        <button 
          onClick={onCheckoutClick}
          className="flex items-center gap-1.5 font-bold text-[14px] bg-[#00bd6f] text-white px-4 py-2.5 rounded-xl active:scale-95 transition-transform shrink-0 ml-2"
        >
          {checkoutButtonText} <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
