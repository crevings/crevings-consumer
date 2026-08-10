import React, { useMemo, useState } from "react";
import { ChevronLeft, Store, Star, SlidersHorizontal, ChevronRight } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useItemsUnder99 } from "@/api/restaurant";
import { MenuItem, Restaurant, FilterOptions } from "@/types";
import { FilterBottomSheet } from "@/shared/components/FilterBottomSheet";

interface ItemsUnder99ViewProps {
  onBack: () => void;
  onRestaurantClick: (restaurant: Restaurant) => void;
}

interface Under99Item {
  id: string;
  name: string;
  price: string | number;
  image: string;
  restaurant: string;
  restaurantId: string;
  rating?: number;
  originalItem?: {
    dietaryType?: string;
    description?: string;
    category?: string;
    available?: boolean;
    badges?: string[];
  };
}

// The /consumer/items-under-99 API returns the price as a display string like
// "₹90", so normalize it to a number for filtering.
const parsePrice = (p: unknown): number => {
  if (typeof p === "number") return p;
  const n = parseFloat(String(p ?? "").replace(/[^\d.]/g, ""));
  return Number.isNaN(n) ? 0 : n;
};

const toMenuItem = (raw: Under99Item): MenuItem => {
  const original = raw.originalItem;
  const dietaryType = original?.dietaryType ?? "";
  const badges = original?.badges ?? [];

  return {
    id: raw.id,
    name: raw.name,
    price: parsePrice(raw.price),
    rating: raw.rating ?? 4.2,
    ratingCount: "",
    image: raw.image ?? "",
    // Unknown dietary type (schema allows "") defaults to veg so the card
    // doesn't mislabel items as non-veg.
    isVeg: dietaryType !== "Non-Veg" && dietaryType !== "Egg",
    isEgg: dietaryType === "Egg",
    description: original?.description,
    category: original?.category ?? "Popular",
    bestseller: badges.includes("bestseller") || badges.includes("Bestseller"),
    spicy: badges.includes("spicy") || badges.includes("Spicy"),
    available: original?.available ?? true,
  };
};

const toRestaurant = (raw: Under99Item): Restaurant => ({
  id: raw.restaurantId ?? "",
  name: raw.restaurant,
  cuisine: "",
  rating: raw.rating ?? 0,
  time: "",
  timeValue: 0,
  price: "",
  images: raw.image ? [raw.image] : [],
  distance: "",
  distanceValue: 0,
  offer: "",
  dietary: [],
});

export const ItemsUnder99View: React.FC<ItemsUnder99ViewProps> = ({
  onBack,
  onRestaurantClick,
}) => {
  const {
    items,
    isLoading,
    isLoadingMore,
    isReachingEnd,
    setSize,
  } = useItemsUnder99(12);

  const [priceRange, setPriceRange] = useState<FilterOptions["priceRange"]>(null);
  const [vegOnly, setVegOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Client-side price guard as a safety net on top of the backend's
  // cheapest-option filter — an item priced at ₹99+ can never surface here.
  const rows = useMemo(
    () =>
      (items as Under99Item[])
        .map((raw) => ({
          menuItem: toMenuItem(raw),
          restaurant: toRestaurant(raw),
          restaurantName: raw.restaurant,
        }))
        .filter(({ menuItem }) => menuItem.available !== false && menuItem.price < 99),
    [items]
  );

  const visibleRows = useMemo(() => {
    return rows.filter(({ menuItem }) => {
      if (priceRange === "under49" && menuItem.price > 49) return false;
      if (priceRange === "49to99" && !(menuItem.price > 49 && menuItem.price <= 99)) return false;
      if (vegOnly && !menuItem.isVeg) return false;
      if (minRating > 0 && (menuItem.rating ?? 0) < minRating) return false;
      return true;
    });
  }, [rows, priceRange, vegOnly, minRating]);

  const togglePriceRange = (value: NonNullable<FilterOptions["priceRange"]>) => {
    setPriceRange((prev) => (prev === value ? null : value));
  };

  return (
    <div className="w-full min-h-screen bg-white pb-24 relative left-0 right-0 p-0 m-0">
      {/* Header matching the "Item under ₹99" pill style */}
      <div className="bg-white border-b border-slate-100 px-4 py-4 flex items-center gap-3 sticky top-0 z-20 shadow-sm">
        <button
          type="button"
          onClick={onBack}
          className="p-2 -ml-2 rounded-full active:scale-95 transition-transform text-slate-800"
          aria-label="Go back"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2 tracking-tight">
          <span>Item</span>
          <span className="bg-[#00bd6f] text-white text-[11px] font-bold tracking-wide px-2.5 py-1 rounded-full leading-none">
            under
          </span>
          <span className="text-[#00bd6f]">₹99</span>
        </h1>
      </div>

      {/* Filter pills — client-side on the loaded under-99 items */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pt-4 pb-1 items-center">
        <button
          type="button"
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-sm font-medium text-slate-700 shrink-0 active:bg-slate-50"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filter
        </button>
        <button
          type="button"
          onClick={() => togglePriceRange("under49")}
          className={`flex items-center px-4 py-2 border rounded-full transition-all shrink-0 active:scale-95 shadow-sm ${
            priceRange === "under49"
              ? "bg-green-50 border-green-500 text-green-700"
              : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
          }`}
        >
          <span className="text-sm font-medium">₹49 & under</span>
        </button>
        <button
          type="button"
          onClick={() => togglePriceRange("49to99")}
          className={`flex items-center px-4 py-2 border rounded-full transition-all shrink-0 active:scale-95 shadow-sm ${
            priceRange === "49to99"
              ? "bg-green-50 border-green-500 text-green-700"
              : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
          }`}
        >
          <span className="text-sm font-medium">₹49 - ₹99</span>
        </button>
        <button
          type="button"
          onClick={() => setVegOnly((prev) => !prev)}
          className={`flex items-center px-4 py-2 border rounded-full transition-all shrink-0 active:scale-95 shadow-sm ${
            vegOnly
              ? "bg-green-50 border-green-500 text-green-700"
              : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
          }`}
        >
          <div className="w-3.5 h-3.5 border border-green-600 flex items-center justify-center rounded-sm bg-white mr-2">
            <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />
          </div>
          <span className="text-sm font-bold">Veg</span>
        </button>
      </div>

      {/* List */}
      <div className="px-4 pt-5">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center text-center">
            <div className="w-10 h-10 border-3 border-slate-200 border-t-[#00bd6f] rounded-full animate-spin mb-3"></div>
            <p className="text-slate-500 font-bold text-sm">Loading items under ₹99...</p>
          </div>
        ) : visibleRows.length > 0 ? (
          <>
            {/* Section header */}
            <div className="mb-5 px-1">
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                Explore all items
              </h2>
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                {visibleRows.length} items available
              </p>
            </div>

            {/* Item cards — same presentation as the feed's list cards */}
            <div className="flex flex-col gap-3 pb-2">
              {visibleRows.map(({ menuItem, restaurant, restaurantName }) => (
                <button
                  key={menuItem.id}
                  type="button"
                  onClick={() => onRestaurantClick(restaurant)}
                  className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3.5 flex items-center justify-between gap-3 text-left hover:border-slate-300 active:scale-[0.99] transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-bold text-slate-900 truncate">
                      {menuItem.name}
                    </p>
                    <p className="text-[13px] text-slate-500 truncate mt-0.5 flex items-center gap-1">
                      <Store className="w-3.5 h-3.5 opacity-70 shrink-0" />
                      <span className="truncate">{restaurantName}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="bg-[#00bd6f] text-white flex items-center gap-0.5 px-1.5 py-0.5 rounded-md">
                      <Star className="w-2.5 h-2.5 fill-current" />
                      <span className="font-bold text-[11px]">
                        {menuItem.rating ?? 4.2}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </div>
                </button>
              ))}
            </div>

            {/* Cursor-based pagination: fetch the next page of items. */}
            {(!isReachingEnd || isLoadingMore) && (
              <div className="py-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => setSize((s: number) => s + 1)}
                  disabled={isLoadingMore}
                  className="w-full max-w-xs h-12 rounded-xl font-semibold text-[15px] flex items-center justify-center gap-2 transition-all bg-[#00bd6f] text-white active:scale-[0.98] shadow-md shadow-emerald-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoadingMore ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                      Loading more...
                    </>
                  ) : (
                    "Load more"
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="py-20 flex flex-col items-center text-center opacity-40">
            <h3 className="text-lg font-bold mb-1">No items found</h3>
            <p className="text-sm">Check back soon for more items under ₹99</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isFilterOpen && (
          <FilterBottomSheet
            onClose={() => setIsFilterOpen(false)}
            initialFilters={{
              maxTime: 60,
              maxDistance: 15,
              minRating: 1,
              dietary: vegOnly ? "veg" : "all",
              offersOnly: false,
              sortBy: "default",
              priceRange,
            }}
            onApply={(f) => {
              setPriceRange(f.priceRange ?? null);
              setVegOnly(f.dietary === "veg");
              setMinRating(f.minRating ?? 0);
              setIsFilterOpen(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
