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
      <div className="relative aspect-[2/3] max-h-[500px] w-full shrink-0">
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
      <div className="relative -mt-6 bg-white rounded-t-3xl pt-6 px-4 z-20 flex-1">
        <div className="flex flex-col items-center text-center gap-1.5 mb-6">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-none pt-4">{restaurant.name}</h1>
          
          <button onClick={onOutletClick} className="flex items-center gap-1 text-sm text-slate-800 font-bold mt-1 active:scale-95 transition-transform bg-slate-50 px-3 py-1 rounded-full">
            <span>{selectedOutlet}</span>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>
          
          <p className="text-sm text-slate-500 font-medium mt-1">
            {restaurant.cuisine}
          </p>
          
          <div className="flex flex-col items-center gap-1.5 mt-2">
            <div className="flex items-center justify-center gap-2.5 text-[13px] font-bold text-slate-700">
              <div className="flex items-center gap-0.5 bg-[#21c55e] text-white px-1.5 py-0.5 rounded shadow-sm">
                <span className="text-[12px] leading-none pb-[1px]">{restaurant.rating}</span>
                <Star className="w-3 h-3 fill-white" />
              </div>
              <span className="text-slate-300 text-[10px]">●</span>
              <span>{restaurant.distance}</span>
              <span className="text-slate-300 text-[10px]">●</span>
              <span>{restaurant.time}</span>
            </div>
            <span className="text-slate-500 text-[11px] font-medium border-b border-dashed border-slate-300 pb-0.5">{restaurant.ratingCount || '5K+'} ratings</span>
          </div>

          {/* Restaurant Quality Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 mb-2">
            <div className="flex items-center gap-1 px-2.5 py-1.5 bg-orange-50 border border-orange-100 rounded-lg">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span className="text-[11px] font-bold text-orange-700 leading-none">Price match guarantee</span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1.5 bg-green-50 border border-green-100 rounded-lg">
              <div className="w-3 h-3 flex items-center justify-center border border-green-600 rounded-[2px]">
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />
              </div>
              <span className="text-[11px] font-bold text-green-700 leading-none">Pure Veg</span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1.5 bg-[#00bd6f]/10 border border-[#00bd6f]/20 rounded-lg">
              <Star className="w-3.5 h-3.5 text-[#00bd6f] fill-[#00bd6f]" />
              <span className="text-[11px] font-bold text-[#00bd6f] leading-none">Best in Pizzas</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[12px] font-medium mt-2">
            <span className="text-slate-600">{restaurant.price}</span>
            <span className="text-slate-300">|</span>
            <span className="text-emerald-600 font-bold">Open</span>
          </div>
        </div>

        {/* Render rest of the page contents inside the same card */}
        {children}
      </div>
    </>
  );
};
