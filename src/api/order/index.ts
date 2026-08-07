import useSWR from "swr";
import { Order } from "@/types";
import { fetcher } from "@/api/fetcher";

/**
 * Fetch all active orders with SWR.
 */
export const useActiveOrders = () => {
  const { data, error, isLoading, mutate } = useSWR<Order[]>(
    "/orders/active",
    fetcher,
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
    }
  );

  return {
    activeOrders: data || [],
    isLoading,
    isError: error,
    mutate,
  };
};

/**
 * Fetch past order history with cursor-based pagination.
 */
export const useOrderHistory = (limit: number = 10, cursor?: string) => {
  const endpoint = `/consumer/profile/orders/past?limit=${limit}${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`;
  const { data, error, isLoading, mutate } = useSWR<
    { success: boolean; orders?: unknown[]; nextCursor?: string | null; hasMore?: boolean }
  >(
    endpoint,
    fetcher,
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
    }
  );

  return {
    pastOrders: data?.orders || [],
    nextCursor: data?.nextCursor,
    hasMore: data?.hasMore || false,
    isLoading,
    isError: error,
    mutate,
  };
};
