import React, { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { useSWRConfig } from "swr";
import { SlidersHorizontal, UtensilsCrossed } from "lucide-react";
import { Restaurant, FilterOptions, Collection } from "@/types";
import { FILTER_DEFAULTS } from "@/config/constants";
import { useRestaurants, useItemsUnder99, useFilteredRestaurants } from "@/api/restaurant/index";
import { MIND_CATEGORIES } from "@/config/content";
import { RestaurantCard } from "@/features/restaurant/RestaurantCard";
import { FilterBottomSheet } from "@/shared/components/FilterBottomSheet";
import { SortBottomSheet } from "@/shared/components/SortBottomSheet";
import { PromotionsCarousel } from "@/features/home/PromotionsCarousel";
import { ItemsUnder99Slider } from "@/features/home/ItemsUnder99Slider";

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
  const { items: itemsUnder99 } = useItemsUnder99(10);
  const { mutate } = useSWRConfig();

  // Periodic silent background sync: seamlessly checks open/closed statuses every 5s without screen flash
  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        mutate(
          (key) => typeof key === "string" && key.startsWith("/consumer/restaurants"),
          undefined,
          { revalidate: true }
        );
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [mutate]);

  // Trigger native permission requests immediately after landing on home page
  useEffect(() => {
    const triggerHomePermissions = async () => {
      // 1. Precise location
      try {
        const { requestLocationAndGetPosition } = await import("@/services/geolocation");
        await requestLocationAndGetPosition();
      } catch { }

      // 2. Push notifications
      try {
        const { initPushNotifications } = await import("@/services/push");
        await initPushNotifications();
        if ('Notification' in window && Notification.permission === 'default') {
          await Notification.requestPermission();
        }
      } catch { }

      // 3. Voice / microphone pre-check
      try {
        const { createSpeechService } = await import("@/services/speech");
        const speech = createSpeechService({
          onResult: () => {},
          onError: () => {},
          onEnd: () => {},
        });
        if (speech.supported && speech.requestPermission) {
          await speech.requestPermission();
        }
      } catch { }
    };

    const timer = setTimeout(triggerHomePermissions, 800);
    return () => clearTimeout(timer);
  }, []);

  const categories = MIND_CATEGORIES;



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

          {/* Explore Categories - 2-Row Horizontal Touch Slider (mobile) / wrapping grid (tablet+) */}
          <div className="mb-10 px-4">
            <h3 className="text-lg font-black text-slate-900 mb-4 tracking-tight">
              Explore Categories
            </h3>
            <div className="grid grid-rows-2 grid-flow-col gap-x-4 gap-y-2 overflow-x-auto no-scrollbar pb-3 -mx-4 px-4 snap-x md:grid-rows-none md:grid-flow-row md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 md:overflow-visible md:snap-none md:mx-0 md:px-0 md:pb-0 md:gap-y-4">
              {categories.map((cat, i) => (
                <div
                  key={i}
                  onClick={() => onCategoryClick(cat.name)}
                  className="w-[90px] flex flex-col items-center gap-0.5 shrink-0 group cursor-pointer active:scale-95 transition-transform snap-start md:w-full"
                >
                  <div className="w-[80px] h-[72px] flex items-center justify-center">
                    <img
                      loading="lazy" src={cat.image}
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

          {/* Items Under ₹99 — auto-slider */}
          <div className="px-4">
            <ItemsUnder99Slider
              items={itemsUnder99 as any}
              restaurants={restaurants}
              onSeeAll={onSeeAllUnder99}
              onRestaurantClick={onRestaurantClick}
              onItemAdd={onItemAdd}
            />
          </div>

          <div id="all-restaurants-section" className="px-4 mb-6">
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 items-center -mx-4 px-4 md:flex-wrap md:overflow-visible md:mx-0 md:px-0 md:pb-0">
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
                <div className="md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-5">
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
                </div>

                <div ref={lastElementRef} className="pt-6 pb-2 flex items-center justify-center">
                  {feedIsLoadingMore && (
                    <div className="w-6 h-6 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin"></div>
                  )}
                </div>

                {/* Bottom Page Art SVG & Loud Greyed-Out Crevings Branding */}
                {(!isLoadingMore || isReachingEnd) && visibleRestaurants.length > 0 && (
                  <div className="mt-8 mb-6 flex flex-col items-center text-center px-2">
                    {/* Home Page Bottom Art SVG */}
                    <div className="w-[calc(100%+2rem)] -mx-4 mb-6 overflow-hidden bg-white flex items-center justify-center md:w-full md:mx-0">
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
