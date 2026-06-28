import useSWRInfinite from "swr/infinite";
import { Offer } from "@/types";
import { fetcher } from "../fetcher";

interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  nextCursor?: string | null;
}

/**
 * Fetch restaurant active offers with SWR Infinite (cursor-based pagination).
 */
export const useRestaurantOffers = (id: string | undefined, limit: number = 5) => {
  const getKey = (pageIndex: number, previousPageData: PaginatedResponse<Offer> | null) => {
    if (!id) return null;

    // Reached the end
    if (previousPageData && !previousPageData.nextCursor) return null;

    // First page
    if (pageIndex === 0) return `/consumer/restaurants/${id}/offers?limit=${limit}`;

    // Subsequent pages
    return `/consumer/restaurants/${id}/offers?limit=${limit}&cursor=${previousPageData!.nextCursor}`;
  };

  const { data, error, size, setSize, isValidating, mutate } = useSWRInfinite<PaginatedResponse<Offer>>(
    getKey,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  const offers = data ? data.flatMap(page => page.data || []) : [];
  const isLoadingInitialData = !data && !error;
  const isLoadingMore = isLoadingInitialData || (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.data?.length === 0;
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.nextCursor === null);

  return {
    offers,
    isLoading: isLoadingInitialData,
    isLoadingMore,
    isReachingEnd,
    isError: error,
    size,
    setSize,
    mutate,
  };
};
