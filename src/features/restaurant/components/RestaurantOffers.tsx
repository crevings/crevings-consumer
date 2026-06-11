import React from 'react';

interface Offer {
  title: string;
  subtitle: string;
  code: string;
}

interface RestaurantOffersProps {
  onSelectOffer: (offer: Offer) => void;
}

export const RestaurantOffers: React.FC<RestaurantOffersProps> = ({ onSelectOffer }) => {
  return (
    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 mb-4 -mx-4 px-4">
      {/* Offer Card 1 */}
      <div 
        onClick={() => onSelectOffer({ title: 'Get 25% off upto ₹50', subtitle: 'On selected items', code: 'TRYNEW' })}
        className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between cursor-pointer active:scale-95 transition-transform min-w-[240px] shrink-0"
      >
        <div className="flex flex-col">
          <span className="text-sm font-bold text-black leading-tight">Get 25% off upto ₹50</span>
          <span className="text-xs text-slate-500 font-medium mt-0.5">On selected items</span>
        </div>
        <span className="text-xs font-bold text-blue-600 ml-2 shrink-0">View</span>
      </div>

      {/* Offer Card 2 */}
      <div 
        onClick={() => onSelectOffer({ title: 'Flat ₹150 OFF', subtitle: 'On orders above ₹499', code: 'JUMBO' })}
        className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between cursor-pointer active:scale-95 transition-transform min-w-[240px] shrink-0"
      >
        <div className="flex flex-col">
          <span className="text-sm font-bold text-black leading-tight">Flat ₹150 OFF</span>
          <span className="text-xs text-slate-500 font-medium mt-0.5">On orders above ₹499</span>
        </div>
        <span className="text-xs font-bold text-blue-600 ml-2 shrink-0">View</span>
      </div>

      {/* Offer Card 3 */}
      <div 
        onClick={() => onSelectOffer({ title: 'Free Delivery', subtitle: 'On all orders', code: 'FREEDEL' })}
        className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between cursor-pointer active:scale-95 transition-transform min-w-[240px] shrink-0"
      >
        <div className="flex flex-col">
          <span className="text-sm font-bold text-black leading-tight">Free Delivery</span>
          <span className="text-xs text-slate-500 font-medium mt-0.5">On all orders</span>
        </div>
        <span className="text-xs font-bold text-blue-600 ml-2 shrink-0">View</span>
      </div>
    </div>
  );
};
