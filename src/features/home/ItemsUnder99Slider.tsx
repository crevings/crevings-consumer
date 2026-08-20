import React, { useEffect, useRef, useMemo, useState } from "react";
import { ChevronRight, Store } from "lucide-react";
import { Restaurant } from "@/types";

interface Under99Item {
  id: string;
  name: string;
  price: string | number;
  image?: string;
  restaurant: string;
  restaurantId: string;
  originalItem?: {
    dietaryType?: string;
    description?: string;
    category?: string;
    available?: boolean;
    badges?: string[];
  };
}

interface ItemsUnder99SliderProps {
  items: Under99Item[];
  restaurants: Restaurant[];
  onSeeAll: () => void;
  onRestaurantClick: (restaurant: Restaurant) => void;
  onItemAdd: (restaurant: Restaurant, itemId: string) => void;
}

const parsePrice = (p: unknown): number => {
  if (typeof p === "number") return p;
  const n = parseFloat(String(p ?? "").replace(/[^\d.]/g, ""));
  return Number.isNaN(n) ? 0 : n;
};

const CARD_STEP_PX = 156;
const AUTO_SCROLL_MS = 2500;
const RESUME_AFTER_INTERACTION_MS = 4000;

export const ItemsUnder99Slider: React.FC<ItemsUnder99SliderProps> = ({
  items,
  restaurants,
  onSeeAll,
  onRestaurantClick,
  onItemAdd,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pausedRef = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const indexRef = useRef(0);
  const [, setActiveIndex] = useState(0);

  const visibleItems = useMemo(() => {
    return items
      .map((raw) => {
        const rest =
          restaurants.find((r) => r.id === raw.restaurantId) || {
            id: raw.restaurantId ?? "",
            name: raw.restaurant || "Restaurant",
            cuisine: "",
            rating: 4.2,
            time: "",
            timeValue: 0,
            price: "",
            images: raw.image ? [raw.image] : [],
            distance: "",
            distanceValue: 0,
            offer: "",
            dietary: [],
          };

        const itemPrice = parsePrice(raw.price);
        if (itemPrice >= 99) return null;

        return { raw, rest };
      })
      .filter(Boolean) as Array<{ raw: Under99Item; rest: Restaurant }>;
  }, [items, restaurants]);

  useEffect(() => {
    if (visibleItems.length <= 1) return;
    const id = setInterval(() => {
      if (pausedRef.current) return;
      indexRef.current = (indexRef.current + 1) % visibleItems.length;
      containerRef.current?.scrollTo({
        left: indexRef.current * CARD_STEP_PX,
        behavior: "smooth",
      });
      setActiveIndex(indexRef.current);
    }, AUTO_SCROLL_MS);
    return () => clearInterval(id);
  }, [visibleItems.length]);

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

  if (visibleItems.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4 px-4">
        <h3 className="flex items-center gap-1.5 text-[19px] font-black text-slate-900 tracking-tight">
          <span>Item</span>
          <span className="bg-[#00bd6f] text-white text-[11px] font-bold tracking-wide px-2.5 py-1 rounded-full leading-none">
            under
          </span>
          <span className="text-[#00bd6f]">₹99</span>
        </h3>
        <button
          type="button"
          onClick={onSeeAll}
          className="text-[13px] font-bold text-[#00a862] active:scale-95 transition-transform flex items-center gap-0.5 cursor-pointer"
        >
          See all <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div
        ref={containerRef}
        onTouchStart={pauseAutoScroll}
        onMouseDown={pauseAutoScroll}
        onWheel={pauseAutoScroll}
        className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 snap-x snap-mandatory"
      >
        {visibleItems.map(({ raw, rest }) => {
          const handleAddClick = (e: React.MouseEvent) => {
            e.stopPropagation();
            onItemAdd(rest, raw.id);
          };

          return (
            <div
              key={raw.id}
              onClick={() => onRestaurantClick(rest)}
              className="min-w-[140px] w-[140px] flex flex-col shrink-0 snap-center cursor-pointer group"
            >
              <div className="relative rounded-[20px] overflow-hidden aspect-square border border-slate-100/50 mb-2.5 transform transition-all duration-300 group-active:scale-95 bg-slate-100">
                {raw.image && (
                  <img
                    loading="lazy"
                    src={raw.image}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={raw.name}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between z-10">
                  <span className="text-white font-black text-[16px] leading-none">
                    {raw.price}
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
                  {raw.name}
                </h4>
                <div className="flex items-center gap-1 text-slate-500 text-[12px] font-medium leading-tight">
                  <Store className="w-3 h-3 opacity-70" />
                  <span className="truncate">{raw.restaurant}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
