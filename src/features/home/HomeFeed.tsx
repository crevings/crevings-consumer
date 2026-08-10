import React, { useState, useMemo, useRef, useCallback } from "react";
import { AnimatePresence } from "motion/react";
import { SlidersHorizontal, UtensilsCrossed, Store, ChevronRight } from "lucide-react";
import { Restaurant, FilterOptions, Collection } from "@/types";
import { FILTER_DEFAULTS } from "@/config/constants";
import { useRestaurants, useItemsUnder99, useFilteredRestaurants } from "@/api/restaurant/index";
import { MIND_CATEGORIES } from "@/config/content";
import { RestaurantCard } from "@/features/restaurant/RestaurantCard";
import { FilterBottomSheet } from "@/shared/components/FilterBottomSheet";
import { SortBottomSheet } from "@/shared/components/SortBottomSheet";
import { PromotionsCarousel } from "@/features/home/PromotionsCarousel";
import { FreeDeliveryItemsSlider } from "@/features/home/FreeDeliveryItemsSlider";

interface HomeFeedProps {
  onCategoryClick: (name: string) => void;
  hiddenIds: string[];
  onHide: (id: string | number) => void;
  onFavourite: (id: string | number) => void;
  onRestaurantClick: (restaurant: Restaurant) => void;
  onItemAdd: (restaurant: Restaurant, itemId: string) => void;
  onCollectionClick: (collection: Collection) => void;
  onSeeAllUnder99: () => void;
}

export const HomeFeed: React.FC<HomeFeedProps> = ({
  onCategoryClick,
  hiddenIds,
  onHide,
  onFavourite,
  onRestaurantClick,
  onItemAdd,
  onSeeAllUnder99,
}) => {
  const { restaurants, isLoading: isApiLoading, isLoadingMore, isReachingEnd, size, setSize } = useRestaurants();
  const {
    items: itemsUnder99,
    isLoadingMore: isLoadingMoreUnder99,
    isReachingEnd: isReachingEndUnder99,
    setSize: setUnder99Page
  } = useItemsUnder99(10);

  // Explore Categories rail: curated static list with correct icons (as before).
  // Area filtering is enforced backend-side for category detail pages and
  // items-under-₹99, not on this rail.
  const categories = MIND_CATEGORIES;

  const handleUnder99Scroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollRight = target.scrollWidth - target.scrollLeft - target.clientWidth;
    if (scrollRight < 100 && !isLoadingMoreUnder99 && !isReachingEndUnder99) {
      setUnder99Page(prev => prev + 1);
    }
  };

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({ ...FILTER_DEFAULTS });
  const [sortMode, setSortMode] = useState<string>("default");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  // Server-side filtering: whenever any filter/sort is active, the feed comes
  // from the single /consumer/restaurants/filter API. UI is untouched — the
  // chips and the Filter/Sort sheets keep driving the same state as before.
  const usingServerFeed =
    (activeFilters.minRating ?? 0) > FILTER_DEFAULTS.minRating ||
    activeFilters.maxTime < FILTER_DEFAULTS.maxTime ||
    activeFilters.maxDistance < FILTER_DEFAULTS.maxDistance ||
    activeFilters.dietary !== FILTER_DEFAULTS.dietary ||
    activeFilters.offersOnly ||
    activeFilters.priceRange !== null ||
    (activeFilters.sortBy && activeFilters.sortBy !== FILTER_DEFAULTS.sortBy) ||
    sortMode !== FILTER_DEFAULTS.sortBy;

  const filteredFeed = useFilteredRestaurants({
    ...activeFilters,
    sortBy: (activeFilters.sortBy && activeFilters.sortBy !== "default" ? activeFilters.sortBy : sortMode) as FilterOptions["sortBy"],
  });

  const feedRestaurants = usingServerFeed ? filteredFeed.restaurants : restaurants;
  const feedIsLoadingMore = usingServerFeed ? filteredFeed.isLoadingMore : isLoadingMore;
  const feedIsReachingEnd = usingServerFeed ? filteredFeed.isReachingEnd : isReachingEnd;
  const activePage = usingServerFeed ? filteredFeed.size : size;
  const setActivePage = usingServerFeed ? filteredFeed.setSize : setSize;

  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback((node: HTMLDivElement) => {
    if (feedIsLoadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0]?.isIntersecting && !feedIsReachingEnd) {
        setActivePage(activePage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [feedIsLoadingMore, feedIsReachingEnd, setActivePage, activePage]);

  // The backend already applies filters + sort when the server feed is active;
  // here we only drop hidden restaurants and the brand keyword client-side.
  const visibleRestaurants = useMemo(() => {
    let list = feedRestaurants.filter((r) => !hiddenIds.includes(String(r.id)));

    if (selectedBrand) {
      list = list.filter((r) =>
        r.name.toLowerCase().includes(selectedBrand.toLowerCase())
      );
    }

    return list;
  }, [feedRestaurants, hiddenIds, selectedBrand]);

  const hasAppliedFilters = useMemo(() => {
    return (
      (activeFilters.minRating ?? 0) > FILTER_DEFAULTS.minRating ||
      activeFilters.maxTime < FILTER_DEFAULTS.maxTime ||
      activeFilters.maxDistance < FILTER_DEFAULTS.maxDistance ||
      activeFilters.dietary !== FILTER_DEFAULTS.dietary ||
      activeFilters.offersOnly === true ||
      activeFilters.priceRange !== null ||
      selectedBrand !== null
    );
  }, [activeFilters, selectedBrand]);

  const firstFive = visibleRestaurants.slice(0, 5);
  const remaining = visibleRestaurants.slice(5);

  return (
    <>
      {isApiLoading || (usingServerFeed && filteredFeed.isLoading) ? (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-10 h-10 border-2 border-slate-200 border-t-[#00bd6f] rounded-full animate-spin mb-3" />
        <p className="text-slate-500 font-bold text-sm">Loading restaurants...</p>
      </div>
    ) : (
      <div className="pb-8 animate-fadeInUp">
        <PromotionsCarousel />

        {/* Free Delivery • Items At ₹109 — auto-slider, only when offers are live */}
        <FreeDeliveryItemsSlider
          restaurants={restaurants}
          onRestaurantClick={onRestaurantClick}
          onItemAdd={onItemAdd}
        />

        {/* Explore Categories - 2-Row Horizontal Touch Slider */}
        <div className="mb-10 px-4">
          <h3 className="text-lg font-black text-slate-900 mb-4 tracking-tight">
            Explore Categories
          </h3>
          <div className="grid grid-rows-2 grid-flow-col gap-x-4 gap-y-2 overflow-x-auto no-scrollbar pb-3 -mx-4 px-4 snap-x">
            {categories.map((cat, i) => (
              <div
                key={i}
                onClick={() => onCategoryClick(cat.name)}
                className="w-[90px] flex flex-col items-center gap-0.5 shrink-0 group cursor-pointer active:scale-95 transition-transform snap-start"
              >
                <div className="w-[80px] h-[72px] flex items-center justify-center">
                  <img
loading="lazy"                     src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
                  />
                </div>
                <span className="text-[13px] font-bold text-slate-800 text-center leading-tight transition-colors group-hover:text-slate-950 line-clamp-1 -mt-0.5">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Items Under ₹99 Section */}
        <div className="mb-10 px-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-1.5 text-[19px] font-black text-slate-900 tracking-tight">
              <span>Item</span>
              <span className="bg-[#00bd6f] text-white text-[11px] font-bold tracking-wide px-2.5 py-1 rounded-full leading-none">
                under
              </span>
              <span className="text-[#00bd6f]">₹99</span>
            </h3>
            <button
              type="button"
              onClick={onSeeAllUnder99}
              className="text-[13px] font-bold text-[#00a862] active:scale-95 transition-transform flex items-center gap-0.5 cursor-pointer"
            >
              See all <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div
            onScroll={handleUnder99Scroll}
            className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 snap-x -mt-1"
          >
            {itemsUnder99.map((item) => {
              // Resolve the restaurant from the loaded feed when available;
              // otherwise build a minimal stub from the item's own payload.
              // The feed is paginated by distance, so a restaurant beyond the
              // first page used to hide ALL of its items here — the home
              // slider rendered empty while "See all" showed the full list.
              const rest =
                restaurants.find((r) => r.id === item.restaurantId) || {
                  id: item.restaurantId ?? "",
                  name: item.restaurant || "Restaurant",
                  cuisine: "",
                  rating: 4.2,
                  time: "",
                  timeValue: 0,
                  price: "",
                  images: item.image ? [item.image] : [],
                  distance: "",
                  distanceValue: 0,
                  offer: "",
                  dietary: [],
                };

              // Safety net on top of the backend's cheapest-option filter:
              // never surface an item that isn't actually under ₹99.
              const itemPrice = parseFloat(String(item.price ?? "").replace(/[^\d.]/g, ""));
              if (!Number.isNaN(itemPrice) && itemPrice >= 99) return null;

              const handleAddClick = (e: React.MouseEvent) => {
                e.stopPropagation();
                onItemAdd(rest, item.id);
              };

              const handleCardClick = () => {
                onRestaurantClick(rest);
              };

              return (
                <div
                  key={item.id}
                  onClick={handleCardClick}
                  className="min-w-[140px] w-[140px] flex flex-col shrink-0 snap-center cursor-pointer group"
                >
                  {/* Image Container */}
                  <div className="relative rounded-[20px] overflow-hidden aspect-square border border-slate-100/50 mb-2.5 transform transition-all duration-300 group-active:scale-95 bg-slate-100">
                    {item.image && (
                      <img
loading="lazy"                         src={item.image}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        alt={item.name}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                    {/* Price + ADD button */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between z-10">
                      <div className="flex flex-col">
                        <span className="text-white font-black text-[16px] leading-none">
                          {item.price}
                        </span>
                      </div>
                      <button
                        onClick={handleAddClick}
                        className="bg-white text-[#00bd6f] border border-white px-3 py-1.5 rounded-[10px] text-[12px] font-bold shadow-md hover:bg-slate-50 active:scale-90 transition-transform"
                      >
                        ADD
                      </button>
                    </div>
                  </div>

                  {/* Details */}
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
            {isLoadingMoreUnder99 && (
              <div className="min-w-[80px] flex items-center justify-center shrink-0">
                <div className="w-5 h-5 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>

        <div id="all-restaurants-section" className="px-4 mb-6">
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
                  priceRange: prev.priceRange === "under49" ? null : "under49",
                }))
              }
              className={`flex items-center px-4 py-2 border rounded-full transition-all shrink-0 active:scale-95 shadow-sm ${activeFilters.priceRange === "under49"
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
              className={`flex items-center px-4 py-2 border rounded-full transition-all shrink-0 active:scale-95 shadow-sm ${activeFilters.priceRange === "49to99"
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
              className={`flex items-center px-4 py-2 border rounded-full transition-all shrink-0 active:scale-95 shadow-sm ${activeFilters.dietary === "veg"
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
              className={`flex items-center px-4 py-2 border rounded-full transition-all shrink-0 active:scale-95 shadow-sm ${activeFilters.dietary === "non-veg"
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
              className={`flex items-center px-4 py-2 border rounded-full transition-all shrink-0 active:scale-95 shadow-sm ${activeFilters.dietary === "egg"
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
          {(restaurants.length === 0 || (!hasAppliedFilters && visibleRestaurants.length === 0)) ? (
            <div className="py-16 flex flex-col items-center text-center px-4 animate-fadeIn">
              <img loading="lazy" src="/no_restaurants_open.svg" alt="No restaurants open" className="w-72 h-auto max-h-48 object-contain mb-2" />
              <p className="font-bold text-base text-slate-800">
                No Restaurants Open
              </p>
              <p className="text-xs text-slate-500 max-w-[280px] mt-1 leading-relaxed">
                All restaurants are currently offline or unavailable in your city.
              </p>
            </div>
          ) : visibleRestaurants.length > 0 ? (
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

              <div ref={lastElementRef} className="pt-6 pb-2 flex items-center justify-center">
                {feedIsLoadingMore && (
                  <div className="w-6 h-6 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin"></div>
                )}
              </div>

              {/* Bottom Page Art SVG & Loud Greyed-Out Crevings Branding */}
              {(!isLoadingMore || isReachingEnd) && visibleRestaurants.length > 0 && (
                <div className="mt-8 mb-6 flex flex-col items-center text-center px-2">
                  {/* Home Page Bottom Art SVG */}
                  <div className="w-[calc(100%+2rem)] -mx-4 mb-6 overflow-hidden bg-white flex items-center justify-center">
                    <img loading="lazy" 
                      src="/home-page-bottom-art.svg" 
                      alt="Crevings Bottom Art" 
                      className="w-full h-[260px] sm:h-[320px] object-contain bg-white" 
                    />
                  </div>

                  {/* Loud Greyed-Out Crevings Branding */}
                  <div className="py-4 flex flex-col items-center select-none opacity-80">
                   

                    <p className="text-xs font-bold text-slate-400 flex items-center gap-2">
                      <span>You've reached the end!</span>
                      <span>•</span>
                      <span>Built with 💖</span>
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-20 flex flex-col items-center text-center">
              <div className="opacity-45 flex flex-col items-center">
                <UtensilsCrossed className="w-12 h-12 mb-4 text-slate-600" />
                <p className="font-bold text-sm text-slate-700">
                  No restaurants match your filters
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveFilters({ ...FILTER_DEFAULTS });
                  setSortMode(FILTER_DEFAULTS.sortBy);
                  setSelectedBrand(null);
                }}
                className="mt-5 px-5 py-2 bg-emerald-50 text-[#00bd6f] text-xs font-bold rounded-xl active:scale-95 transition-transform"
              >
                Clear All Filters
              </button>
            </div>
          )}</div>
      </div>
      )}
    </>
  );
};
