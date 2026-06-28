import React, { useRef, useEffect } from 'react';
import { Offer } from "@/types";

interface RestaurantOffersProps {
  offers: Offer[];
  isLoadingMore: boolean;
  isReachingEnd: boolean;
  onLoadMore: () => void;
  onSelectOffer: (offer: Offer) => void;
}

export const RestaurantOffers: React.FC<RestaurantOffersProps> = ({
  offers,
  isLoadingMore,
  isReachingEnd,
  onLoadMore,
  onSelectOffer
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!containerRef.current || isLoadingMore || isReachingEnd) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    if (scrollWidth - scrollLeft - clientWidth < 50) {
      onLoadMore();
    }
  };

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll);
      return () => el.removeEventListener('scroll', handleScroll);
    }
  }, [isLoadingMore, isReachingEnd, onLoadMore]);

  if (!offers || offers.length === 0) {
    if (isLoadingMore) {
      return (
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 mb-4 -mx-4 px-4">
          {[1, 2, 3].map(n => (
            <div key={n} className="bg-slate-50 border border-slate-100 rounded-xl p-3 animate-pulse min-w-[240px] h-[58px] shrink-0" />
          ))}
        </div>
      );
    }
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className="flex gap-3 overflow-x-auto no-scrollbar pb-2 mb-4 -mx-4 px-4"
    >
      {offers.map((offer) => {
        let title = offer.name;
        let subtitle = offer.description || "";
        
        if (offer.offerType === 'percentage') {
          title = `${offer.discountPercent}% OFF`;
          subtitle = offer.maxCap ? `Upto ₹${offer.maxCap} | Min order ₹${offer.minOrder || 0}` : `On all orders | Min order ₹${offer.minOrder || 0}`;
        } else if (offer.offerType === 'flat') {
          title = `Flat ₹${offer.discountAmount} OFF`;
          subtitle = `On orders above ₹${offer.minOrder || 0}`;
        } else if (offer.offerType === 'bogo') {
          title = "BUY 1 GET 1";
          subtitle = "BOGO on selected items";
        } else if (offer.offerType === 'free_item') {
          title = `FREE ${offer.freeItemName}`;
          subtitle = `On orders above ₹${offer.minOrder || 0}`;
        }

        return (
          <div 
            key={offer.offerId}
            onClick={() => onSelectOffer(offer)}
            className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between cursor-pointer active:scale-95 transition-transform min-w-[240px] shrink-0"
          >
            <div className="flex flex-col text-left">
              <span className="text-sm font-bold text-black leading-tight">{title}</span>
              <span className="text-xs text-slate-500 font-medium mt-0.5">{subtitle}</span>
            </div>
            <span className="text-xs font-bold text-blue-600 ml-2 shrink-0">View</span>
          </div>
        );
      })}

      {isLoadingMore && (
        <div className="flex items-center justify-center min-w-[80px] shrink-0">
          <div className="w-5 h-5 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

