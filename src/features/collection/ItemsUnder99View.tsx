import React, { useMemo } from "react";
import { ChevronLeft, Store } from "lucide-react";
import { useItemsUnder99 } from "@/api/restaurant";
import { MenuItem, Restaurant } from "@/types";

interface ItemsUnder99ViewProps {
  onBack: () => void;
  onRestaurantClick: (restaurant: Restaurant) => void;
  /** Same contract as the home feed: add the item to cart (via the item sheet)
   * and redirect to the restaurant page. */
  onItemAdd: (restaurant: Restaurant, itemId: string) => void;
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
    dietaryType: dietaryType,
    isVeg: dietaryType === "Veg",
    isEgg: dietaryType === "Egg",
    isNonVeg: dietaryType === "Non-Veg",
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
  onItemAdd,
}) => {
  const {
    items,
    isLoading,
    isLoadingMore,
    isReachingEnd,
    setSize,
  } = useItemsUnder99(12);

  // Client-side price guard as a safety net on top of the backend's
  // cheapest-option filter — an item priced at ₹99+ can never surface here.
  const visibleRows = useMemo(
    () =>
      (items as Under99Item[])
        .map((raw) => ({
          raw,
          menuItem: toMenuItem(raw),
          restaurant: toRestaurant(raw),
          restaurantName: raw.restaurant,
        }))
        .filter(
          ({ menuItem }) =>
            menuItem.available !== false &&
            menuItem.price < 99 &&
            menuItem.name.trim().length > 0
        ),
    [items]
  );

  return (
    <div className="w-full min-h-screen bg-white pb-24 relative left-0 right-0 p-0 m-0">
      {/* Header matching the "Item under ₹99" pill style */}
      <div className="bg-white border-b border-slate-100 px-4 pt-safe-3 pb-3 flex items-center gap-3 sticky top-0 z-20 shadow-sm">
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

      {/* Grid */}
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

            {/* Item cards — same image cards as the home "Item under ₹99" slider,
                in a 2-column grid. Tapping the card opens the restaurant; ADD
                adds the item to cart and redirects to the restaurant page. */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 pb-2">
              {visibleRows.map(({ raw, menuItem, restaurant, restaurantName }) => (
                <div
                  key={menuItem.id}
                  onClick={() => onRestaurantClick(restaurant)}
                  className="w-full flex flex-col cursor-pointer group"
                >
                  {/* Image Container */}
                  <div className="relative rounded-[20px] overflow-hidden aspect-square border border-slate-100/50 mb-2.5 transform transition-all duration-300 group-active:scale-95 bg-slate-100">
                    {raw.image && (
                      <img
                        loading="lazy"
                        src={raw.image}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        alt={menuItem.name}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                    {/* Price + ADD button */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between z-10">
                      <span className="text-white font-black text-[16px] leading-none">
                        {raw.price}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onItemAdd(restaurant, menuItem.id);
                        }}
                        className="bg-white text-[#00bd6f] border border-white px-3 py-1.5 rounded-[10px] text-[12px] font-bold shadow-md hover:bg-slate-50 active:scale-90 transition-transform"
                      >
                        ADD
                      </button>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex flex-col gap-0.5 px-0.5">
                    <h4 className="text-slate-900 font-bold text-[15px] leading-snug line-clamp-1 group-hover:text-[#00bd6f] transition-colors">
                      {menuItem.name}
                    </h4>
                    <div className="flex items-center gap-1 text-slate-500 text-[12px] font-medium leading-tight">
                      <Store className="w-3 h-3 opacity-70" />
                      <span className="truncate">{restaurantName}</span>
                    </div>
                  </div>
                </div>
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
    </div>
  );
};
