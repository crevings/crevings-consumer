/**
 * useFuzzySearch.ts — client-side fuzzy search over the full restaurant and
 * dish corpora.
 *
 * Data sources (both cached by SWR, no extra server endpoints):
 *  - Restaurants: the paginated `/consumer/restaurants` feed, pumped until
 *    every page is loaded so the fuzzy index covers the whole market.
 *  - Dishes: each restaurant's `/consumer/restaurants/:id/menus` (the same
 *    endpoint the restaurant detail screen uses), fetched in one parallel
 *    batch and flattened into searchable records.
 *
 * The dish corpus is only fetched when `loadDishes` is true (i.e. the user
 * opened the Dishes tab), so the common "type in the bar" path never pays
 * for menu downloads.
 */

import { useEffect, useMemo } from "react";
import useSWR from "swr";
import { useRestaurants } from "@/api/restaurant";
import { fetcher } from "@/api/fetcher";
import type { MenuItem, Restaurant } from "@/types";
import {
  buildDishIndex,
  buildRestaurantIndex,
  searchDishes,
  searchRestaurants,
  type DishSearchRecord,
} from "@/utils/search";

/** MenuItem plus the raw id fields the backend may carry in different shapes. */
type MenuItemLoose = MenuItem & { itemId?: string; _id?: string };

interface CustomMenuSection {
  menuId?: string;
  name?: string;
  itemCount?: number;
  items?: MenuItemLoose[];
}

interface MenusResponse {
  success?: boolean;
  data?: CustomMenuSection[];
}

interface AllRestaurants {
  restaurants: Restaurant[];
  /** True once the full corpus is loaded (initial + every page). */
  isCorpusComplete: boolean;
  isLoading: boolean;
  isError: unknown;
  /** Revalidate every page (used by the error-state Retry button). */
  retry: () => void;
}

/** Hard cap so a misbehaving cursor can never spin the pump forever. */
const MAX_CORPUS_PAGES = 50;

/** Load every page of the paginated restaurant feed (pumps one page at a time). */
function useAllRestaurants(enabled: boolean): AllRestaurants {
  const {
    restaurants,
    size,
    setSize,
    isReachingEnd,
    isLoading,
    isLoadingMore,
    isError,
    mutate,
  } = useRestaurants(50);

  useEffect(() => {
    if (!enabled || isLoading || isLoadingMore || isError || isReachingEnd) return;
    if (size >= MAX_CORPUS_PAGES) return;
    setSize((s) => s + 1);
  }, [enabled, isLoading, isLoadingMore, isError, isReachingEnd, size, setSize]);

  const isCorpusComplete = Boolean(isReachingEnd) && !isLoading && !isLoadingMore;

  return { restaurants, isCorpusComplete, isLoading, isError, retry: () => void mutate() };
}

/**
 * Fetch every restaurant's menu items in a single parallel SWR request and
 * flatten them into `DishSearchRecord`s (deduped by restaurant + item).
 */
function useAllDishes(restaurants: Restaurant[], enabled: boolean) {
  const restaurantIds = useMemo(() => restaurants.map((r) => String(r.id)), [restaurants]);
  const nameById = useMemo(
    () => new Map(restaurants.map((r) => [String(r.id), r.name])),
    [restaurants]
  );
  const distanceById = useMemo(
    () => new Map(restaurants.map((r) => [String(r.id), r.distanceValue])),
    [restaurants]
  );

  const key =
    enabled && restaurantIds.length > 0 ? ["fuzzy-search-menus", ...restaurantIds] : null;

  const { data, isLoading, error, mutate } = useSWR<MenusResponse[]>(
    key,
    () =>
      Promise.all(
        restaurantIds.map((id) => fetcher<MenusResponse>(`/consumer/restaurants/${id}/menus`))
      ),
    { revalidateOnFocus: false }
  );

  const dishes = useMemo<DishSearchRecord[]>(() => {
    if (!data) return [];
    const seen = new Set<string>();
    const records: DishSearchRecord[] = [];

    data.forEach((response, index) => {
      const restaurantId = restaurantIds[index] ?? "";
      const restaurantName = nameById.get(restaurantId) ?? "";
      const distanceKm = distanceById.get(restaurantId);

      (response?.data ?? []).forEach((section) => {
        (section?.items ?? []).forEach((item) => {
          // The backend may expose the id as `id` (formatted shape), `itemId`
          // (raw menu doc), or `_id` — accept all three so a shape drift can
          // never silently empty the dish corpus.
          const itemId = String(item?.id ?? item?.itemId ?? item?._id ?? "");
          const dedupeKey = `${restaurantId}:${itemId}`;
          if (!itemId || seen.has(dedupeKey)) return;
          seen.add(dedupeKey);

          records.push({
            itemId,
            name: item?.name ?? "",
            category: item?.category,
            description: item?.description,
            price: item?.price,
            images: item?.image ? [item.image] : [],
            isVeg: item?.isVeg,
            isEgg: item?.isEgg,
            restaurant: { id: restaurantId, name: restaurantName, distanceKm },
          });
        });
      });
    });

    return records;
  }, [data, restaurantIds, nameById, distanceById]);

  return { dishes, isLoading, isError: error, retry: () => void mutate() };
}

export interface FuzzySearchOptions {
  /** Load the full restaurant corpus (default true). */
  loadRestaurants?: boolean;
  /** Also load every restaurant's dishes (used by the Dishes tab). */
  loadDishes?: boolean;
}

export interface FuzzySearchResults {
  restaurants: Restaurant[];
  dishes: DishSearchRecord[];
  restaurantsLoading: boolean;
  dishesLoading: boolean;
  isError: unknown;
  /** Revalidate both corpora (used by the error-state Retry button). */
  retry: () => void;
}

export function useFuzzySearch(query: string, options: FuzzySearchOptions = {}): FuzzySearchResults {
  const { loadRestaurants = true, loadDishes = false } = options;
  const hasQuery = query.trim().length > 0;

  const { restaurants, isCorpusComplete, isLoading, isError, retry: retryRestaurants } =
    useAllRestaurants(loadRestaurants && hasQuery);

  const restaurantIndex = useMemo(() => buildRestaurantIndex(restaurants), [restaurants]);
  const restaurantResults = useMemo(
    () => (hasQuery ? searchRestaurants(query, restaurantIndex) : []),
    [query, hasQuery, restaurantIndex]
  );

  // Only fetch menus once the corpus is fully loaded so the SWR key (and thus
  // the parallel batch) is computed against the final restaurant list.
  const { dishes, isLoading: dishesLoading, isError: dishesError, retry: retryDishes } =
    useAllDishes(restaurants, loadDishes && hasQuery && isCorpusComplete);

  const dishIndex = useMemo(() => buildDishIndex(dishes), [dishes]);
  const dishResults = useMemo(
    () => (hasQuery ? searchDishes(query, dishIndex) : []),
    [query, hasQuery, dishIndex]
  );

  return {
    restaurants: restaurantResults,
    dishes: dishResults,
    restaurantsLoading: hasQuery && isLoading,
    dishesLoading: hasQuery && (isLoading || (loadDishes && !isCorpusComplete) || dishesLoading),
    isError: isError ?? dishesError,
    retry: () => {
      retryRestaurants();
      retryDishes();
    },
  };
}
