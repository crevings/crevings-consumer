import React, { useEffect, useRef } from "react";
import { Store } from "lucide-react";
import { Restaurant } from "@/types";
import { useItemsUnder109, Under109Item } from "@/api/restaurant/index";

interface FreeDeliveryItemsSliderProps {
  restaurants: Restaurant[];
  onRestaurantClick: (restaurant: Restaurant) => void;
  onItemAdd: (restaurant: Restaurant, itemId: string) => void;
}

// 140px card + 16px gap — matches the item rail widths used across the feed.
const CARD_STEP_PX = 156;
const AUTO_SCROLL_MS = 2500;
const RESUME_AFTER_INTERACTION_MS = 4000;

/**
 * "Free Delivery • Items At ₹X" auto-slider.
 *
 * Items and the price cap (X) are fetched dynamically from the
 * /consumer/items-under-109 endpoint (MongoDB aggregation of items under the
 * offer's cap from branches running an ongoing free-delivery offer). The rail
 * renders nothing unless the backend reports `offerActive`, so it never shows
 * a hardcoded/static card when no offer is live.
 */
export const FreeDeliveryItemsSlider: React.FC<FreeDeliveryItemsSliderProps> = ({
  restaurants,
  onRestaurantClick,
  onItemAdd,
}) => {
  const { items, offerActive, priceCap, isLoading } = useItemsUnder109(20);

  // Only items that resolve to a restaurant in the feed can be shown — never
  // render an empty header or a fake restaurant card.
  const visibleItems = items.filter((item) =>
    restaurants.some((r) => r.id === item.restaurantId)
  );

  const containerRef = useRef<HTMLDivElement | null>(null);
  const pausedRef = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const indexRef = useRef(0);

  // Auto-scroll one card every few seconds, looping back to the start.
  useEffect(() => {
    if (visibleItems.length <= 1) return;
    const id = setInterval(() => {
      if (pausedRef.current) return;
      indexRef.current = (indexRef.current + 1) % visibleItems.length;
      containerRef.current?.scrollTo({ left: indexRef.current * CARD_STEP_PX, behavior: "smooth" });
    }, AUTO_SCROLL_MS);
    return () => clearInterval(id);
  }, [visibleItems.length]);

  // Pause auto-scroll while the user is interacting, then resume.
  const pauseAutoScroll = () => {
    pausedRef.current = true;
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, RESUME_AFTER_INTERACTION_MS);
  };

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  // Only show the rail when the backend confirms an ongoing offer with items.
  if (!offerActive || visibleItems.length === 0 || isLoading) return null;

  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 px-4 mb-4">
        <div className="w-[18px] h-[18px] flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" className="w-full h-full text-green-600 fill-current">
            <path d="M12 2L14.8 5.6L19.4 6.2L18.4 10.8L20.6 14.8L17 17.6L16.4 22.2L12 20.6L7.6 22.2L7 17.6L3.4 14.8L5.6 10.8L4.6 6.2L9.2 5.6L12 2Z" />
            <path d="M10 15L14 9" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <circle cx="10.5" cy="10.5" r="1.5" fill="white" />
            <circle cx="13.5" cy="13.5" r="1.5" fill="white" />
          </svg>
        </div>
        <h3 className="text-[19px] font-black text-slate-900 tracking-tight">
          Free Delivery • Items At{" "}
          {priceCap ? <span className="text-[#00bd6f]">₹{priceCap}</span> : null}
        </h3>
      </div>

      <div
        ref={containerRef}
        onTouchStart={pauseAutoScroll}
        onMouseDown={pauseAutoScroll}
        onWheel={pauseAutoScroll}
        className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 snap-x"
      >
        {visibleItems.map((item: Under109Item) => {
          const rest = restaurants.find((r) => r.id === item.restaurantId);
          if (!rest) return null;

          const handleAddClick = (e: React.MouseEvent) => {
            e.stopPropagation();
            onItemAdd(rest, item.id);
          };

          return (
            <div
              key={item.id}
              onClick={() => onRestaurantClick(rest)}
              className="min-w-[140px] w-[140px] flex flex-col shrink-0 snap-center cursor-pointer group"
            >
              <div className="relative rounded-[20px] overflow-hidden aspect-square border border-slate-100/50 mb-2.5 transform transition-all duration-300 group-active:scale-95 bg-slate-100">
                {item.image && (
                  <img
                    loading="lazy"
                    src={item.image}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={item.name}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between z-10">
                  <span className="text-white font-black text-[16px] leading-none">
                    {item.price}
                  </span>
                  <button
                    onClick={handleAddClick}
                    className="bg-white text-[#00bd6f] border border-white px-3 py-1.5 rounded-[10px] text-[12px] font-bold shadow-md hover:bg-slate-50 active:scale-90 transition-transform"
                  >
                    ADD
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-0.5 px-0.5">
                <h4 className="text-slate-900 font-bold text-[15px] leading-snug line-clamp-1 group-hover:text-[#00bd6f] transition-colors">
                  {item.name}
                </h4>
                <div className="flex items-center gap-1 text-slate-500 text-[12px] font-medium leading-tight">
                  <Store className="w-3 h-3 opacity-70" />
                  <span className="truncate">{item.restaurant}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
