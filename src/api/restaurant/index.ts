import useSWRInfinite from "swr/infinite";
import { Restaurant, MenuItem } from "@/types";
import { fetcher } from "@/api/fetcher";

// L1 SWR cache policy: revalidateOnFocus ensures the user sees live online/offline status
// immediately when switching back to the app, with single-flight deduping.
const SWR_HOT = { revalidateOnFocus: true, staleTime: 10_000, dedupingInterval: 4_000 }; // feed / filter / search
const SWR_WARM = { revalidateOnFocus: false, staleTime: 180_000 }; // menu / categories / promotions
const SWR_LIVE = { revalidateOnFocus: true, staleTime: 10_000 }; // items-under-* / suggestions / category detail

interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  nextCursor?: string | null;
}

/**
 * Fetch all registered restaurants from the backend database with SWR Infinite.
 */
export const useRestaurants = (limit: number = 10) => {
  const getKey = (pageIndex: number, previousPageData: PaginatedResponse<Restaurant> | null) => {
    // Reached the end
    if (previousPageData && !previousPageData.nextCursor) return null;

    // First page, we don't have previousPageData
    if (pageIndex === 0) return `/consumer/restaurants?limit=${limit}`;

    // Add the cursor to the API endpoint
    return `/consumer/restaurants?limit=${limit}&cursor=${previousPageData!.nextCursor}`;
  };

  const { data, error, size, setSize, mutate } = useSWRInfinite<PaginatedResponse<Restaurant>>(
    getKey,
    fetcher,
    SWR_HOT
  );

  const restaurants = data ? data.flatMap(page => page.data || []) : [];
  const isLoadingInitialData = !data && !error;
  const isLoadingMore = isLoadingInitialData || (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.data?.length === 0;
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.nextCursor === null);

  return {
    restaurants,
    isLoading: isLoadingInitialData,
    isLoadingMore,
    isReachingEnd,
    isError: error,
    size,
    setSize,
    mutate,
  };
};

/**
 * Fetch restaurant menu details with SWR Infinite by restaurant ID from the backend database.
 */
export const useRestaurantDetail = (id: string | undefined, limit: number = 20) => {
  const getKey = (pageIndex: number, previousPageData: PaginatedResponse<MenuItem> | null) => {
    if (!id) return null;

    // Reached the end
    if (previousPageData && !previousPageData.nextCursor) return null;

    // First page
    if (pageIndex === 0) return `/consumer/restaurants/${id}/menu?limit=${limit}`;

    // Subsequent pages
    return `/consumer/restaurants/${id}/menu?limit=${limit}&cursor=${previousPageData!.nextCursor}`;
  };

  const { data, error, size, setSize, mutate } = useSWRInfinite<PaginatedResponse<MenuItem>>(
    getKey,
    fetcher,
    SWR_WARM
  );

  const menuItems = data ? data.flatMap(page => page.data || []) : [];
  const isLoadingInitialData = !data && !error;
  const isLoadingMore = isLoadingInitialData || (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.data?.length === 0;
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.nextCursor === null);

  return {
    menuItems,
    isLoading: isLoadingInitialData,
    isLoadingMore,
    isReachingEnd,
    isError: error,
    size,
    setSize,
    mutate,
  };
};

/**
 * Fetch active custom menus with their highlighted items arranged in order.
 */
export const useRestaurantCustomMenus = (id: string | undefined) => {
  const { data, error, isLoading } = useSWR<{
    data?: Array<{
      menuId: string;
      name: string;
      itemCount: number;
      items: MenuItem[];
    }>;
  }>(
    id ? `/consumer/restaurants/${id}/menus` : null,
    fetcher,
    SWR_WARM
  );

  return {
    customMenus: (data?.data || []) as Array<{
      menuId: string;
      name: string;
      itemCount: number;
      items: MenuItem[];
    }>,
    isLoading,
    isError: error,
  };
};

/**
 * Fetch items under 99 with SWR Infinite.
 */
export interface Under99Item {
  id: string;
  name: string;
  price: number;
  image?: string;
  restaurantId?: string;
  restaurant?: string;
}

export const useItemsUnder99 = (limit: number = 10) => {
  const getKey = (pageIndex: number, previousPageData: PaginatedResponse<Under99Item> | null) => {
    // Reached the end
    if (previousPageData && !previousPageData.nextCursor) return null;

    // First page
    if (pageIndex === 0) return `/consumer/items-under-99?limit=${limit}`;

    // Subsequent pages
    return `/consumer/items-under-99?limit=${limit}&cursor=${previousPageData!.nextCursor}`;
  };

  const { data, error, size, setSize } = useSWRInfinite<PaginatedResponse<Under99Item>>(
    getKey,
    fetcher,
    SWR_LIVE
  );

  const items = data ? data.flatMap(page => page.data || []) : [];
  const isLoadingInitialData = !data && !error;
  const isLoadingMore = isLoadingInitialData || (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.data?.length === 0;
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.nextCursor === null);

  return {
    items,
    isLoading: isLoadingInitialData,
    isLoadingMore,
    isReachingEnd,
    isError: error,
    size,
    setSize,
  };
};

export interface Under109Item {
  id: string;
  name: string;
  price: string;
  image?: string;
  restaurantId?: string;
  restaurant?: string;
}

/**
 * Free-delivery rail: items under ₹109 from restaurants currently running an
 * ongoing offer. The backend aggregation returns `offerActive` so the UI can
 * hide the rail entirely when no offer is live in the user's area.
 */
export const useItemsUnder109 = (limit: number = 20) => {
  const { data, error, isLoading } = useSWR<{
    success: boolean;
    offerActive?: boolean;
    priceCap?: number | null;
    data?: Under109Item[];
    nextCursor?: string | null;
  }>(`/consumer/items-under-109?limit=${limit}`, fetcher, SWR_LIVE);

  return {
    items: (data?.data || []) as Under109Item[],
    offerActive: data?.offerActive ?? false,
    priceCap: data?.priceCap ?? null,
    isLoading,
    isError: error,
  };
};

import useSWR from "swr";
import { CompanyPromotion, FilterOptions } from "@/types";

/**
 * Filtered restaurant feed — everything is applied server-side by the single
 * /consumer/restaurants/filter API (rating, time, distance, dietary, offers,
 * price range, sort). Returns the same shape as useRestaurants so the home
 * feed can swap data sources without touching the UI.
 */
export const useFilteredRestaurants = (filters: FilterOptions, limit: number = 10) => {
  const hasFilters = Boolean(
    (filters.minRating && filters.minRating > 1) ||
      (filters.maxTime !== undefined && filters.maxTime < 60) ||
      (filters.maxDistance !== undefined && filters.maxDistance < 15) ||
      (filters.dietary && filters.dietary !== "all") ||
      filters.offersOnly ||
      (filters.priceRange !== undefined && filters.priceRange !== null) ||
      (filters.sortBy && filters.sortBy !== "default")
  );

  const getKey = (pageIndex: number, previousPageData: PaginatedResponse<Restaurant> | null) => {
    if (!hasFilters) return null;
    if (previousPageData && !previousPageData.nextCursor) return null;

    const qp = new URLSearchParams();
    if (filters.minRating && filters.minRating > 1) qp.set("minRating", String(filters.minRating));
    if (filters.maxTime !== undefined && filters.maxTime < 60) qp.set("maxTime", String(filters.maxTime));
    if (filters.maxDistance !== undefined && filters.maxDistance < 15) qp.set("maxDistance", String(filters.maxDistance));
    if (filters.dietary && filters.dietary !== "all") qp.set("dietary", filters.dietary);
    if (filters.offersOnly) qp.set("offersOnly", "true");
    if (filters.priceRange) qp.set("priceRange", filters.priceRange);
    if (filters.sortBy && filters.sortBy !== "default") qp.set("sortBy", filters.sortBy);
    qp.set("limit", String(limit));
    if (pageIndex > 0 && previousPageData?.nextCursor) qp.set("cursor", previousPageData.nextCursor);

    return `/consumer/restaurants/filter?${qp.toString()}`;
  };

  const { data, error, size, setSize, mutate } = useSWRInfinite<PaginatedResponse<Restaurant>>(
    getKey,
    fetcher,
    SWR_HOT
  );

  const restaurants = data ? data.flatMap((page) => page.data || []) : [];
  const isLoadingInitialData = !data && !error;
  const isLoadingMore = isLoadingInitialData || (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.data?.length === 0;
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.nextCursor === null);

  return {
    restaurants,
    isLoading: isLoadingInitialData,
    isLoadingMore,
    isReachingEnd,
    isError: error,
    size,
    setSize,
    mutate,
  };
};

export interface SearchApiParams {
  query: string;
  lat?: number;
  lng?: number;
  city?: string;
  vegOnly?: boolean;
  minRating?: number;
  limit?: number;
  offset?: number;
}

export const useSearch = (params: SearchApiParams) => {
  const { query, lat, lng, city, vegOnly, minRating, limit = 20, offset = 0 } = params;
  const shouldFetch = Boolean(query && query.trim().length > 0);

  const queryParams = new URLSearchParams();
  if (query) queryParams.set("q", query);
  if (lat) queryParams.set("lat", String(lat));
  if (lng) queryParams.set("lng", String(lng));
  if (city) queryParams.set("city", city);
  if (vegOnly) queryParams.set("vegOnly", "true");
  if (minRating) queryParams.set("minRating", String(minRating));
  queryParams.set("limit", String(limit));
  queryParams.set("offset", String(offset));

  const endpoint = shouldFetch ? `/consumer/restaurants/search?${queryParams.toString()}` : null;
  const { data, error, isLoading, mutate } = useSWR<{
    restaurants?: Array<{
      branchId: string;
      name: string;
      cuisineType?: string;
      rating?: number;
      estimatedDeliveryMinutes?: number;
      logo?: string;
      distanceKm?: number;
      isDeliverable?: boolean;
      address?: { city?: string };
    }>;
    dishes?: Array<{
      itemId: string;
      name: string;
      category?: string;
      description?: string;
      price?: number;
      dietaryType?: string;
      images?: string[];
      restaurant?: {
        branchId?: string;
        name?: string;
        distanceKm?: number;
        isDeliverable?: boolean;
      };
    }>;
  }>(endpoint, fetcher, SWR_HOT);

  return {
    data,
    isLoading,
    isError: error,
    mutate,
  };
};

export const useSearchSuggestions = (query: string, city?: string) => {
  const shouldFetch = Boolean(query && query.trim().length >= 2);
  const endpoint = shouldFetch
    ? `/consumer/restaurants/search/suggestions?q=${encodeURIComponent(query)}${city ? `&city=${encodeURIComponent(city)}` : ""}`
    : null;

  const { data, error, isLoading } = useSWR<{
    suggestions?: {
      restaurants?: unknown[];
      dishes?: unknown[];
      cuisines?: unknown[];
    };
  }>(endpoint, fetcher, SWR_LIVE);

  return {
    suggestions: data?.suggestions || { restaurants: [], dishes: [], cuisines: [] },
    isLoading,
    isError: error,
  };
};

export interface CategoryMenuItem {
  id: string;
  name: string;
  price: number;
  rating?: number;
  dietaryType?: string;
  veg?: boolean;
  isEgg?: boolean;
  isNonVeg?: boolean;
  image?: string;
  images?: string[];
  imageUrl?: string;
}

export interface CategoryRestaurant extends Restaurant {
  menu?: CategoryMenuItem[];
  items?: CategoryMenuItem[];
}

export interface CategoryResponse {
  success: boolean;
  category: string;
  totalRestaurants: number;
  restaurants: CategoryRestaurant[];
  nextCursor?: string | null;
  hasMore?: boolean;
}

/**
 * Fetch restaurants & dishes for a category with cursor-based infinite
 * pagination — mirrors the nextCursor contract used by the other consumer
 * list endpoints (restaurants, menu, items-under-99).
 */
export const useCategoryDetail = (categoryName: string, limit: number = 20) => {
  const getKey = (pageIndex: number, previousPageData: CategoryResponse | null) => {
    if (!categoryName || !categoryName.trim()) return null;

    // Reached the end
    if (previousPageData && !previousPageData.nextCursor) return null;

    const base = `/consumer/restaurants/search/category/${encodeURIComponent(categoryName)}?limit=${limit}`;

    // First page — no cursor yet
    if (pageIndex === 0) return base;

    // Subsequent pages carry the cursor from the previous response
    return `${base}&cursor=${previousPageData!.nextCursor}`;
  };

  const { data, error, size, setSize, mutate } = useSWRInfinite<CategoryResponse>(
    getKey,
    fetcher,
    SWR_LIVE
  );

  const restaurants = data ? data.flatMap((page) => page.restaurants || []) : [];
  const isLoadingInitialData = !data && !error;
  const isLoadingMore = isLoadingInitialData || (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.restaurants?.length === 0;
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.nextCursor == null);

  return {
    categoryData: data?.[0],
    restaurants,
    isLoading: isLoadingInitialData,
    isLoadingMore,
    isReachingEnd,
    isError: error,
    size,
    setSize,
    mutate,
  };
};

/**
 * Fetch the area-aware category list for the home "Explore Categories" rail.
 * The backend only returns categories available from deliverable branches in
 * the user's area (same area access check as menus).
 */
export const useCategories = (limit: number = 12) => {
  const { data, error, isLoading } = useSWR<{ data?: Array<{ name: string; count: number }> }>(
    `/consumer/restaurants/categories?limit=${limit}`,
    fetcher,
    SWR_WARM
  );

  return {
    categories: (data?.data || []) as Array<{ name: string; count: number }>,
    isLoading,
    isError: error,
  };
};

/**
 * Fetch active company-level promotional cards from the backend.
 * The backend only returns isActive: true promotions, each carrying its
 * full design config as JSON for the dynamic rendering engine.
 */
export const usePromotions = () => {
  const { data, error, isLoading, mutate } = useSWR<{ data?: CompanyPromotion[] }>(
    "/consumer/promotions",
    fetcher,
    SWR_WARM
  );

  return {
    promotions: ((data?.data || []) as CompanyPromotion[]).filter((p) => p.isActive !== false),
    isLoading,
    isError: error,
    mutate,
  };
};

export * from "@/api/restaurant/offers";
