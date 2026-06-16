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
