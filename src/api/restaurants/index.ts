import useSWRInfinite from "swr/infinite";
import { Restaurant, MenuItem } from "@/types";
import { fetcher } from "../fetcher";

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

  const { data, error, size, setSize, isValidating, mutate } = useSWRInfinite<PaginatedResponse<Restaurant>>(
    getKey,
    fetcher,
    {
      revalidateOnFocus: false,
    }
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

  const { data, error, size, setSize, isValidating, mutate } = useSWRInfinite<PaginatedResponse<MenuItem>>(
    getKey,
    fetcher,
    {
      revalidateOnFocus: false,
    }
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
  const { data, error, isLoading } = useSWR(
    id ? `/consumer/restaurants/${id}/menus` : null,
    fetcher,
    { revalidateOnFocus: false }
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
export const useItemsUnder99 = (limit: number = 10) => {
  const getKey = (pageIndex: number, previousPageData: PaginatedResponse<any> | null) => {
    // Reached the end
    if (previousPageData && !previousPageData.nextCursor) return null;

    // First page
    if (pageIndex === 0) return `/consumer/items-under-99?limit=${limit}`;

    // Subsequent pages
    return `/consumer/items-under-99?limit=${limit}&cursor=${previousPageData!.nextCursor}`;
  };

  const { data, error, size, setSize, isValidating } = useSWRInfinite<PaginatedResponse<any>>(
    getKey,
    fetcher,
    {
      revalidateOnFocus: false,
    }
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

  const { data, error, size, setSize, isValidating, mutate } = useSWRInfinite<PaginatedResponse<Restaurant>>(
    getKey,
    fetcher,
    { revalidateOnFocus: false }
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
  const { data, error, isLoading, mutate } = useSWR(endpoint, fetcher, { revalidateOnFocus: false });

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

  const { data, error, isLoading } = useSWR(endpoint, fetcher, { revalidateOnFocus: false });

  return {
    suggestions: data?.suggestions || { restaurants: [], dishes: [], cuisines: [] },
    isLoading,
    isError: error,
  };
};

export interface CategoryResponse {
  success: boolean;
  category: string;
  totalRestaurants: number;
  restaurants: any[];
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

  const { data, error, size, setSize, isValidating, mutate } = useSWRInfinite<CategoryResponse>(
    getKey,
    fetcher,
    {
      revalidateOnFocus: false,
    }
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
  const { data, error, isLoading } = useSWR(
    `/consumer/restaurants/categories?limit=${limit}`,
    fetcher,
    { revalidateOnFocus: false }
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
  const { data, error, isLoading, mutate } = useSWR(
    "/consumer/promotions",
    fetcher,
    { revalidateOnFocus: false }
  );

  return {
    promotions: ((data?.data || []) as CompanyPromotion[]).filter((p) => p.isActive !== false),
    isLoading,
    isError: error,
    mutate,
  };
};

export * from "./offers";
