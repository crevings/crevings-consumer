import React, { useRef, useEffect } from 'react';
import { Offer } from "@/types";
import { formatINR } from "@/utils/currency";

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
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className="flex gap-3 overflow-x-auto no-scrollbar pb-2 mb-4 -mx-4 px-4 pt-1"
    >
      {offers.map((offer) => {
        let title = offer.name;
        let subtitle = offer.description || "";
        
        if (offer.offerType === 'percentage') {
          title = `Get ${offer.discountPercent}% off${offer.maxCap ? ` upto ${formatINR(offer.maxCap)}` : ''}`;
          subtitle = offer.description || (offer.minOrder ? `On orders above ${formatINR(offer.minOrder)}` : `On selected items`);
        } else if (offer.offerType === 'flat') {
          title = `Flat ${formatINR(offer.discountAmount)} OFF`;
          subtitle = offer.description || `On orders above ${formatINR(offer.minOrder || 0)}`;
        } else if (offer.offerType === 'bogo') {
          title = "BUY 1 GET 1";
          subtitle = offer.description || "BOGO on selected items";
        } else if (offer.offerType === 'free_item') {
          title = `FREE ${offer.freeItemName}`;
          subtitle = offer.description || `On orders above ${formatINR(offer.minOrder || 0)}`;
        }

        return (
          <div 
            key={offer.offerId}
            onClick={() => onSelectOffer(offer)}
            className="bg-white border border-slate-200/90 rounded-[18px] p-3.5 px-4 flex items-center justify-between cursor-pointer active:scale-95 transition-transform min-w-[245px] shrink-0 shadow-sm"
          >
            <div className="flex flex-col text-left pr-2">
              <span className="text-[14px] font-semibold text-slate-900 leading-tight">{title}</span>
              <span className="text-[12px] text-slate-500 font-medium mt-0.5">{subtitle}</span>
            </div>
            <span className="text-[13px] font-bold text-[#00bd6f] ml-3 shrink-0">View</span>
          </div>
        );
      })}

      {isLoadingMore && (
        <div className="flex items-center justify-center min-w-[80px] shrink-0">
          <div className="w-5 h-5 border-2 border-slate-300 border-t-[#00bd6f] rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

