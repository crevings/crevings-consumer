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

export interface SearchApiParams {
  query: string;
  lat?: number;
  lng?: number;
  city?: string;
  vegOnly?: boolean;
  minRating?: number;
}

export const useSearch = (params: SearchApiParams) => {
  const { query, lat, lng, city, vegOnly, minRating } = params;
  const shouldFetch = Boolean(query && query.trim().length > 0);

  const queryParams = new URLSearchParams();
  if (query) queryParams.set("q", query);
  if (lat) queryParams.set("lat", String(lat));
  if (lng) queryParams.set("lng", String(lng));
  if (city) queryParams.set("city", city);
  if (vegOnly) queryParams.set("vegOnly", "true");
  if (minRating) queryParams.set("minRating", String(minRating));

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

export const useCategoryDetail = (categoryName: string, lat?: number, lng?: number, city?: string) => {
  const shouldFetch = Boolean(categoryName && categoryName.trim().length > 0);
  const queryParams = new URLSearchParams();
  if (lat) queryParams.set("lat", String(lat));
  if (lng) queryParams.set("lng", String(lng));
  if (city) queryParams.set("city", city);

  const endpoint = shouldFetch
    ? `/consumer/restaurants/search/category/${encodeURIComponent(categoryName)}?${queryParams.toString()}`
    : null;

  const { data, error, isLoading, mutate } = useSWR(endpoint, fetcher, { revalidateOnFocus: false });

  return {
    categoryData: data,
    restaurants: data?.restaurants || [],
    isLoading,
    isError: error,
    mutate,
  };
};

export * from "./offers";
