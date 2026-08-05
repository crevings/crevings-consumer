import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MoreVertical, Heart, Share2, Info, EyeOff, Star, ChevronRight, Sparkles } from 'lucide-react';
import { Restaurant } from '@/types';

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
  isHidden,
  onHide,
  onUnhide,
  onInfoClick,
  selectedOutlet,
  onOutletClick,
  children
}) => {
  const [isBannerMenuOpen, setIsBannerMenuOpen] = useState(false);

  return (
    <>
      {/* Hero Image Section */}
      <div className="relative aspect-[16/9] w-full shrink-0">
        <img
          src={(restaurant.images && restaurant.images[0]) || "https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?w=1000&h=1500&fit=crop"}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Top Navigation */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
          <button onClick={onBack} className="w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-transform active:scale-95">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 relative">
            <button
              onClick={() => setIsBannerMenuOpen(!isBannerMenuOpen)}
              className="w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-transform active:scale-95"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isBannerMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsBannerMenuOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute top-12 right-0 w-48 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-50"
                  >
                    <div className="py-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isFavourite && onRemoveFavourite) {
                            onRemoveFavourite();
                          } else if (!isFavourite && onFavourite) {
                            onFavourite();
                          }
                          setIsBannerMenuOpen(false);
                        }}
                        className="w-full px-4 py-3 flex items-center gap-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Heart className={`w-4 h-4 ${isFavourite ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
                        {isFavourite ? 'Remove Favourite' : 'Favourite'}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isHidden && onUnhide) {
                            onUnhide();
                          } else if (!isHidden && onHide) {
                            onHide();
                          }
                          setIsBannerMenuOpen(false);
                        }}
                        className="w-full px-4 py-3 flex items-center gap-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <EyeOff className={`w-4 h-4 ${isHidden ? 'text-red-500' : 'text-slate-400'}`} />
                        {isHidden ? 'Unhide' : 'Hide'}
                      </button>

                      <button
                        onClick={() => {
                          setIsBannerMenuOpen(false);
                          // Share logic here
                        }}
                        className="w-full px-4 py-3 flex items-center gap-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Share2 className="w-4 h-4 text-slate-400" />
                        Share
                      </button>

                      <button
                        onClick={() => {
                          setIsBannerMenuOpen(false);
                          if (onInfoClick) onInfoClick();
                        }}
                        className="w-full px-4 py-3 flex items-center gap-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Info className="w-4 h-4 text-slate-400" />
                        Info
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Restaurant Header Info (overlapping card container) */}
      <div className="relative -mt-6 bg-white rounded-t-3xl pt-5 px-5 z-20 flex-1">
        <div className="flex flex-col gap-1.5 mb-5 text-left">
          {/* Line 1: Title with Info Icon */}
          <div className="flex items-center gap-2 pt-2">
            <h1 className="text-[24px] font-extrabold text-slate-900 tracking-tight leading-tight">
              {restaurant.name}
            </h1>
            {onInfoClick && (
              <button
                onClick={onInfoClick}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                aria-label="Restaurant information"
              >
                <Info className="w-5 h-5 stroke-[1.8]" />
              </button>
            )}
          </div>

          {/* Line 2: Location • Distance • Time > */}
          <button
            onClick={onOutletClick}
            className="flex items-center gap-1.5 text-[14px] text-slate-700 font-bold mt-0.5 text-left hover:text-slate-900 active:scale-[0.99] transition-all"
          >
            <span>{selectedOutlet || restaurant.address}</span>
            {restaurant.distance && (
              <>
                <span className="text-slate-400 font-normal">•</span>
                <span>{restaurant.distance}</span>
              </>
            )}
            {restaurant.time && (
              <>
                <span className="text-slate-400 font-normal">•</span>
                <span>{restaurant.time}</span>
              </>
            )}
            <ChevronRight className="w-4 h-4 text-slate-400 inline stroke-[2] ml-0.5" />
          </button>

          {/* Line 3: Cuisines */}
          {restaurant.cuisine && (
            <p className="text-[14px] text-slate-500 font-medium mt-0.5 leading-snug">
              {restaurant.cuisine}
            </p>
          )}

          {/* Line 4: Price & Open Status */}
          <div className="flex items-center gap-2 text-[14px] font-medium mt-1">
            {restaurant.price && <span className="text-slate-500 font-semibold">{restaurant.price}</span>}
            {restaurant.price && <span className="text-slate-300">|</span>}
            <span className="text-[#00bd6f] font-bold">Open</span>
          </div>

          {/* Dynamic Rating (Matching RestaurantCard rating card style) */}
          {typeof restaurant.rating === 'number' && restaurant.rating > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex flex-col items-center justify-center bg-green-700 rounded-xl px-2.5 py-1 shadow-sm shrink-0">
                <div className="flex items-center gap-1">
                  <span className="text-white font-bold text-sm">{restaurant.rating}</span>
                  <Star className="w-3.5 h-3.5 text-white fill-white" />
                </div>
              </div>
              {restaurant.ratingCount && (
                <span className="text-slate-500 text-[12px] font-medium">{restaurant.ratingCount} ratings</span>
              )}
            </div>
          )}

          {/* Line 5: Price Match Guarantee Tag */}
          <div className="mt-3.5 mb-1 flex items-center">
            <div className="flex items-center gap-2.5 px-4 py-2 bg-slate-50 border border-slate-100 rounded-full shadow-sm">
              <span className="text-[13px] font-bold text-slate-800">Offline Price Match Guarantee</span>
            </div>
          </div>
        </div>

        {/* Render rest of the page contents inside the same card */}
        {children}
      </div>
    </>
  );
};
