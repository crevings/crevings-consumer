import React, { useState } from 'react';
import { ArrowLeft, Heart, Share2, Check, Star, ChevronRight, Info, CheckCircle2 } from 'lucide-react';
import { Restaurant } from '@/types';
import { getRestaurantAddress } from "@/utils/restaurantUtils";

interface RestaurantHeaderProps {
  restaurant: Restaurant;
  onBack: () => void;
  isFavourite?: boolean;
  onFavourite?: () => void;
  onRemoveFavourite?: () => void;
  isHidden?: boolean;
  onHide?: () => void;
  onUnhide?: () => void;
  onInfoClick?: () => void;
  selectedOutlet: string;
  onOutletClick: () => void;
}

export const RestaurantHeader: React.FC<React.PropsWithChildren<RestaurantHeaderProps>> = ({
  restaurant,
  onBack,
  isFavourite,
  onFavourite,
  onRemoveFavourite,
  onInfoClick,
  selectedOutlet,
  onOutletClick,
  children
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleFavouriteToggle = () => {
    if (isFavourite && onRemoveFavourite) {
      onRemoveFavourite();
    } else if (!isFavourite && onFavourite) {
      onFavourite();
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: restaurant.name,
      text: `Order from ${restaurant.name} on Crevings`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch {
      // User dismissed the share sheet (AbortError) — ignore silently
    }
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-100">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-800 active:scale-90 transition-transform" aria-label="Go back">
          <ArrowLeft className="w-6 h-6 stroke-[2]" />
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={handleFavouriteToggle}
            className="p-2 text-slate-700 active:scale-90 transition-transform"
            aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
          >
            <Heart className={`w-5 h-5 stroke-[2] transition-colors ${isFavourite ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            className="p-2 -mr-2 text-slate-700 active:scale-90 transition-transform"
            aria-label="Share restaurant"
          >
            {isCopied ? <Check className="w-5 h-5 text-emerald-500 stroke-[2]" /> : <Share2 className="w-5 h-5 stroke-[2]" />}
          </button>
        </div>
      </div>

      {/* Restaurant Header Info */}
      <div className="px-4 py-2 mb-2">
        <div className="flex justify-between items-start mb-3">
          <div className="flex flex-col items-start gap-1 flex-1 pr-4">
            <div className="flex items-center gap-1.5 mb-0.5">
              <h1 className="text-[20px] font-bold text-slate-900 tracking-tight leading-none">
                {restaurant.name}
              </h1>
              {onInfoClick && (
                <button
                  onClick={onInfoClick}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label="Restaurant information"
                >
                  <Info className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              onClick={onOutletClick}
              className="flex items-center gap-0.5 text-[11px] text-slate-700 font-bold active:scale-95 transition-transform text-left"
            >
              <span>
                {selectedOutlet || getRestaurantAddress(restaurant)} • {restaurant.distance} • {restaurant.time}
              </span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </button>

            {restaurant.cuisine && (
              <p className="text-[10px] text-slate-500 font-medium">
                {restaurant.cuisine}
              </p>
            )}

            <div className="flex items-center gap-1.5 text-[10px] font-medium mt-0.5">
              {restaurant.price && <span className="text-slate-500">{restaurant.price}</span>}
              {restaurant.price && <span className="text-slate-300">|</span>}
              <span className="text-[#1db83e] font-bold">Open until 11 PM</span>
            </div>
          </div>

          {/* Rating Box */}
          <div className="flex flex-col items-center shrink-0">
            <div className="bg-[#00bd6f] text-white flex items-center gap-0.5 px-1.5 py-0.5 rounded-md">
              <Star className="w-2.5 h-2.5 fill-current" />
              <span className="font-bold text-[11px]">{restaurant.rating}</span>
            </div>
            {restaurant.ratingCount && (
              <span className="text-[8px] text-slate-500 mt-0.5 font-semibold">
                {restaurant.ratingCount} ratings
              </span>
            )}
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center mb-4">
          <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-full px-3 py-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#1db83e]" />
            <span className="text-[12px] font-bold text-slate-700">Offline Price Match Guarantee</span>
          </div>
        </div>
      </div>

      {/* Rest of the page contents */}
      <div className="px-4 pb-4">
        {children}
      </div>
    </>
  );
};
