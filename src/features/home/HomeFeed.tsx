import React, { useState, useEffect, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { SlidersHorizontal, Bike, UtensilsCrossed, Star, Store, ChevronRight } from "lucide-react";
import { Restaurant, FilterOptions } from "@/types";
import { useRestaurants } from "../../api/restaurants";
import { CURATED_COLLECTIONS } from "../../data/collections";
import { MIND_CATEGORIES } from "../../data/categories";
import { Skeleton } from "boneyard-js/react";
import { RestaurantCard } from "../restaurant/RestaurantCard";
import { FilterBottomSheet } from "../../shared/components/FilterBottomSheet";
import { SortBottomSheet } from "../../shared/components/SortBottomSheet";
import { ITEMS_UNDER_89 } from "../../data/itemsUnder89";

interface HomeFeedProps {
  onCategoryClick: (name: string) => void;
  hiddenIds: string[];
  onHide: (id: string | number) => void;
  onFavourite: (id: string | number) => void;
  onRestaurantClick: (restaurant: Restaurant) => void;
  onItemAdd: (restaurant: Restaurant, itemId: string) => void;
  onCollectionClick: (collection: any) => void;
}

export const HomeFeed: React.FC<HomeFeedProps> = ({
  onCategoryClick,
  hiddenIds,
  onHide,
  onFavourite,
  onRestaurantClick,
  onItemAdd,
  onCollectionClick,
}) => {
  const { restaurants, isLoading: isApiLoading } = useRestaurants();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    maxTime: 60,
    maxDistance: 15,
    minRating: 1,
    dietary: "all",
    offersOnly: false,
    sortBy: "default",
    priceRange: null,
  });
  const [sortMode, setSortMode] = useState<string>("default");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const visibleRestaurants = useMemo(() => {
    let list = restaurants.filter((r) => !hiddenIds.includes(String(r.id)));

    if (selectedBrand) {
      list = list.filter((r) =>
        r.name.toLowerCase().includes(selectedBrand.toLowerCase())
      );
    }

    list = list.filter((r) => {
      const matchRating = r.rating >= activeFilters.minRating;
      const matchTime = r.timeValue <= activeFilters.maxTime;
      const matchDistance = r.distanceValue <= activeFilters.maxDistance;
      const matchOffers = !activeFilters.offersOnly || !!r.offer;
      const matchDietary =
        activeFilters.dietary === "all" ||
        (r.dietary && Array.isArray(r.dietary) && r.dietary.includes(activeFilters.dietary));

      let matchPrice = true;
      if (activeFilters.priceRange && r.price) {
        const pricePerPerson = parseInt(r.price.replace(/\D/g, "")) / 2;
        if (activeFilters.priceRange === "under49") {
          matchPrice = pricePerPerson <= 49;
        } else if (activeFilters.priceRange === "49to99") {
          matchPrice = pricePerPerson > 49 && pricePerPerson <= 99;
        }
      }

      return (
        matchRating &&
        matchTime &&
        matchDistance &&
        matchOffers &&
        matchDietary &&
        matchPrice
      );
    });

    const currentSort = activeFilters.sortBy || sortMode;
    if (currentSort === "ratingHigh" || currentSort === "rating")
      list = [...list].sort((a, b) => b.rating - a.rating);
    else if (currentSort === "ratingLow")
      list = [...list].sort((a, b) => a.rating - b.rating);
    else if (currentSort === "time")
      list = [...list].sort((a, b) => a.timeValue - b.timeValue);
    else if (currentSort === "distanceNear" || currentSort === "distance")
      list = [...list].sort((a, b) => a.distanceValue - b.distanceValue);
    else if (currentSort === "distanceFar")
      list = [...list].sort((a, b) => b.distanceValue - a.distanceValue);
    else if (currentSort === "priceLow")
      list = [...list].sort(
        (a, b) =>
          parseInt(a.price.replace(/\D/g, "")) -
          parseInt(b.price.replace(/\D/g, ""))
      );
    else if (currentSort === "priceHigh")
      list = [...list].sort(
        (a, b) =>
          parseInt(b.price.replace(/\D/g, "")) -
          parseInt(a.price.replace(/\D/g, ""))
      );

    return list;
  }, [restaurants, hiddenIds, activeFilters, sortMode, selectedBrand]);


  const firstFive = visibleRestaurants.slice(0, 5);
  const remaining = visibleRestaurants.slice(5);

  return (
    <Skeleton name="home-feed" loading={isLoading || isApiLoading}>
      <div className="pb-8 animate-fadeInUp">
      <div className="mb-8 px-4">
        <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-4 px-4">
          <div className="w-[340px] h-[112px] bg-slate-900 rounded-[24px] p-4 text-white relative overflow-hidden shrink-0">
            <div className="relative z-10 h-full flex justify-between items-center">
              <div>
                <div className="inline-block bg-yellow-400 text-slate-900 text-[9px] font-bold px-2 py-0.5 rounded mb-1">
                  LIMITED TIME
                </div>
                <h3 className="text-lg font-bold leading-tight mb-0.5">
                  50% OFF
                </h3>
                <p className="text-slate-300 text-[10px] font-medium">
                  On your first 3 orders
                </p>
              </div>
              <button className="bg-white text-slate-900 px-4 py-2 rounded-[12px] text-xs font-bold active:scale-95 transition-transform">
                Order Now
              </button>
            </div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500 rounded-full blur-[50px] opacity-40"></div>
          </div>
          <div className="w-[340px] h-[112px] bg-blue-600 rounded-[24px] p-4 text-white relative overflow-hidden shrink-0">
            <div className="relative z-10 h-full flex justify-between items-center">
              <div>
                <div className="inline-block bg-white/20 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded mb-1">
                  HEALTHY EATS
                </div>
                <h3 className="text-lg font-bold leading-tight mb-0.5">
                  Fresh Salads
                </h3>
                <p className="text-blue-100 text-[10px] font-medium">
                  Start at ₹149 only
                </p>
              </div>
              <button className="bg-white text-blue-700 px-4 py-2 rounded-[12px] text-xs font-bold active:scale-95 transition-transform">
                Explore Menu
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Curated Collections Section */}
      <div className="mb-10 px-4">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            Curated Collections
          </h3>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4">
          {CURATED_COLLECTIONS.map((collection) => (
            <div
              key={collection.id}
              onClick={() => onCollectionClick(collection)}
              className="min-w-[240px] h-[120px] relative rounded-[20px] overflow-hidden shrink-0 active:scale-95 transition-transform cursor-pointer group shadow-sm"
            >
              <img
                src={collection.image}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                alt={collection.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

              <div className="absolute bottom-4 left-4 right-4">
                <h4 className="text-white font-bold text-[18px] leading-tight mb-1">
                  {collection.title}
                </h4>
                <div className="flex items-center gap-1 text-white/80 text-[13px] font-medium">
                  {collection.subtitle}
                  <span className="text-[14px]">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-10 px-4">
        <h3 className="text-base font-bold text-slate-900 mb-4 tracking-tight">
          Explore Categories
        </h3>
        <div className="grid grid-cols-5 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4">
          {MIND_CATEGORIES.map((cat, i) => (
            <div
              key={i}
              onClick={() => onCategoryClick(cat.name)}
              className="flex flex-col items-center gap-2 shrink-0 group cursor-pointer active:scale-95 transition-transform"
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs font-bold text-slate-600 transition-colors group-hover:text-slate-900">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Items Under ₹99 Section */}
      <div className="mb-10 px-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[19px] font-black text-slate-900 tracking-tight">
            Items under ₹99
          </h3>
          <span className="text-[13px] font-bold text-blue-600 active:scale-95 transition-transform flex items-center gap-0.5 cursor-pointer">
            See all <ChevronRight className="w-4 h-4" />
          </span>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 snap-x -mt-1">
          {ITEMS_UNDER_89.map((item) => (
            <div
              key={item.id}
              className="min-w-[140px] w-[140px] flex flex-col shrink-0 snap-center cursor-pointer group"
            >
              {/* Image Container */}
              <div className="relative rounded-[20px] overflow-hidden aspect-square border border-slate-100/50 mb-2.5 transform transition-all duration-300 group-active:scale-95">
                <img
                  src={item.image}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  alt={item.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                {/* Rating Badge */}
                <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-md rounded-lg px-1.5 py-1 flex items-center gap-0.5 shadow-sm">
                  <Star className="w-3 h-3 text-orange-500 fill-orange-500" strokeWidth={2} />
                  <span className="text-slate-800 text-[10px] font-bold leading-none mt-0.5">
                    {item.rating}
                  </span>
                </div>

                {/* Price + ADD button */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between z-10">
                  <div className="flex flex-col">
                    <span className="text-white/70 text-[10px] font-semibold leading-none line-through mb-0.5">
                      {item.originalPrice}
                    </span>
                    <span className="text-white font-black text-[16px] leading-none">
                      {item.price}
                    </span>
                  </div>
                  <button className="bg-white text-[#f34a6e] border border-white px-3 py-1.5 rounded-[10px] text-[12px] font-bold shadow-md hover:bg-slate-50 active:scale-90 transition-transform">
                    ADD
                  </button>
                </div>
              </div>

              {/* Details */}
              <div className="flex flex-col gap-0.5 px-0.5">
                <h4 className="text-slate-900 font-bold text-[15px] leading-snug line-clamp-1 group-hover:text-[#f34a6e] transition-colors">
                  {item.name}
                </h4>
                <div className="flex items-center gap-1 text-slate-500 text-[12px] font-medium leading-tight">
                  <Store className="w-3 h-3 opacity-70" />
                  <span className="truncate">{item.restaurant}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 mb-6">
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 items-center -mx-4 px-4">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-sm font-medium text-slate-700 shrink-0 active:bg-slate-50"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filter
          </button>
          <button
            onClick={() =>
              setActiveFilters((prev) => ({
                ...prev,
                offersOnly: !prev.offersOnly,
              }))
            }
            className={`flex items-center px-4 py-2 border rounded-full transition-all shrink-0 active:scale-95 shadow-sm ${
              activeFilters.offersOnly
                ? "bg-green-50 border-green-500 text-green-700"
                : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
            }`}
          >
            <Bike className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">Free Delivery</span>
          </button>
          <button
            onClick={() =>
              setActiveFilters((prev) => ({
                ...prev,
                priceRange: prev.priceRange === "under49" ? null : "under49",
              }))
            }
            className={`flex items-center px-4 py-2 border rounded-full transition-all shrink-0 active:scale-95 shadow-sm ${
              activeFilters.priceRange === "under49"
                ? "bg-green-50 border-green-500 text-green-700"
                : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
            }`}
          >
            <span className="text-sm font-medium">₹49 & under</span>
          </button>
          <button
            onClick={() =>
              setActiveFilters((prev) => ({
                ...prev,
                priceRange: prev.priceRange === "49to99" ? null : "49to99",
              }))
            }
            className={`flex items-center px-4 py-2 border rounded-full transition-all shrink-0 active:scale-95 shadow-sm ${
              activeFilters.priceRange === "49to99"
                ? "bg-green-50 border-green-500 text-green-700"
                : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
            }`}
          >
            <span className="text-sm font-medium">₹49 - ₹99</span>
          </button>
          <button
            onClick={() =>
              setActiveFilters((prev) => ({
                ...prev,
                dietary: prev.dietary === "veg" ? "all" : "veg",
              }))
            }
            className={`flex items-center px-4 py-2 border rounded-full transition-all shrink-0 active:scale-95 shadow-sm ${
              activeFilters.dietary === "veg"
                ? "bg-green-50 border-green-500 text-green-700"
                : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
            }`}
          >
            <div className="w-3.5 h-3.5 border border-green-600 flex items-center justify-center rounded-sm bg-white mr-2">
              <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />
            </div>
            <span className="text-sm font-bold">Veg</span>
          </button>
          <button
            onClick={() =>
              setActiveFilters((prev) => ({
                ...prev,
                dietary: prev.dietary === "non-veg" ? "all" : "non-veg",
              }))
            }
            className={`flex items-center px-4 py-2 border rounded-full transition-all shrink-0 active:scale-95 shadow-sm ${
              activeFilters.dietary === "non-veg"
                ? "bg-green-50 border-green-500 text-green-700"
                : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
            }`}
          >
            <div className="w-3.5 h-3.5 border border-red-600 flex items-center justify-center rounded-sm bg-white mr-2">
              <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[5px] border-b-red-600" />
            </div>
            <span className="text-sm font-bold">Non Veg</span>
          </button>
          <button
            onClick={() =>
              setActiveFilters((prev) => ({
                ...prev,
                dietary: prev.dietary === "egg" ? "all" : "egg",
              }))
            }
            className={`flex items-center px-4 py-2 border rounded-full transition-all shrink-0 active:scale-95 shadow-sm ${
              activeFilters.dietary === "egg"
                ? "bg-green-50 border-green-500 text-green-700"
                : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
            }`}
          >
            <div className="w-3.5 h-3.5 border border-yellow-500 flex items-center justify-center rounded-sm bg-white mr-2">
              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
            </div>
            <span className="text-sm font-bold">Egg</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isFilterOpen && (
          <FilterBottomSheet
            onClose={() => setIsFilterOpen(false)}
            onApply={(f) => {
              setActiveFilters(f);
              setIsFilterOpen(false);
            }}
            initialFilters={activeFilters}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isSortOpen && (
          <SortBottomSheet
            onClose={() => setIsSortOpen(false)}
            onSelect={(m) => {
              setSortMode(m);
              setIsSortOpen(false);
            }}
            currentSort={sortMode}
          />
        )}
      </AnimatePresence>

      <div className="px-4 mb-10">
        <div className="mb-5 px-1">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">
            Explore all restaurants
          </h2>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            {visibleRestaurants.length} restaurants available
          </p>
        </div>
        {visibleRestaurants.length > 0 ? (
          <>
            {firstFive.map((rest) => (
              <RestaurantCard
                key={rest.id}
                {...rest}
                onHide={onHide}
                onFavourite={onFavourite}
                onClick={() => onRestaurantClick(rest)}
                onItemAdd={(itemId) => onItemAdd(rest, itemId)}
              />
            ))}
            {remaining.map((rest) => (
              <RestaurantCard
                key={rest.id}
                {...rest}
                onHide={onHide}
                onFavourite={onFavourite}
                onClick={() => onRestaurantClick(rest)}
                onItemAdd={(itemId) => onItemAdd(rest, itemId)}
              />
            ))}
            <div className="mt-8 text-left">
              <p className="text-sm font-medium text-slate-400">
                built with 💖
              </p>
            </div>
          </>
        ) : (
          <div className="py-20 flex flex-col items-center text-center opacity-40">
            <UtensilsCrossed className="w-12 h-12 mb-4" />
            <p className="font-bold text-sm">
              No restaurants match your filters
            </p>
            <button
              onClick={() => {
                setActiveFilters({
                  maxTime: 60,
                  maxDistance: 15,
                  minRating: 1,
                  dietary: "all",
                  offersOnly: false,
                  sortBy: "default",
                  priceRange: null,
                });
                setSortMode("default");
                setSelectedBrand(null);
              }}
              className="mt-4 text-blue-600 text-xs font-black uppercase tracking-widest"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
    </Skeleton>
  );
};
