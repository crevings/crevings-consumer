import React, { useMemo } from "react";
import { ChevronLeft } from "lucide-react";
import { GridMenuItemCard } from "@/features/collection/GridMenuItemCard";
import { useItemsUnder99 } from "@/api/restaurant";
import { MenuItem, Restaurant } from "@/types";

interface ItemsUnder99ViewProps {
  onBack: () => void;
  onRestaurantClick: (restaurant: Restaurant) => void;
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
// "₹90", so normalize it to a number for the grid card.
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
  onItemAdd,
}) => {
  const {
    items,
    isLoading,
    isLoadingMore,
    isReachingEnd,
    setSize,
  } = useItemsUnder99(12);

  const rows = useMemo(
    () =>
      (items as Under99Item[]).map((raw) => ({
        menuItem: toMenuItem(raw),
        restaurant: toRestaurant(raw),
        restaurantName: raw.restaurant,
      })),
    [items]
  );

  return (
    <div className="w-full min-h-screen bg-white pb-20 relative left-0 right-0 p-0 m-0">
      {/* Header matching Category detail layout */}
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

      {/* All Items Under ₹99 Grid */}
      <div className="p-4">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center text-center">
            <div className="w-10 h-10 border-3 border-slate-200 border-t-[#00bd6f] rounded-full animate-spin mb-3"></div>
            <p className="text-slate-500 font-bold text-sm">Loading items under ₹99...</p>
          </div>
        ) : rows.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-3 pb-6">
              {rows.map(({ menuItem, restaurant, restaurantName }) => (
                <GridMenuItemCard
                  key={menuItem.id}
                  item={menuItem}
                  quantity={0}
                  restaurantName={restaurantName}
                  onAdd={(id) => {
                    // handleItemAdd already selects the restaurant, queues the
                    // item and navigates to the restaurant detail page.
                    onItemAdd(restaurant, id);
                  }}
                  onRemove={() => {}}
                  onClick={() => {
                    onRestaurantClick(restaurant);
                  }}
                />
              ))}
            </div>

            {/* Cursor-based pagination: fetch the next page of items. */}
            {(!isReachingEnd || isLoadingMore) && (
              <div className="pb-6 flex justify-center">
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
