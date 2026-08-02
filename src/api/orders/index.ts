import useSWR from "swr";
import { Order } from "@/types";
import { fetcher } from "../fetcher";
import { ACTIVE_ORDERS, PAST_ORDERS } from "@/data/orders";

/**
 * Fetch all active orders with SWR.
 */
export const useActiveOrders = () => {
  const { data, error, isLoading, mutate } = useSWR<Order[]>(
    "/orders/active",
    fetcher,
    {
      fallbackData: ACTIVE_ORDERS,
      revalidateOnMount: true,
      revalidateOnFocus: false,
    }
  );

  return {
    activeOrders: data || ACTIVE_ORDERS,
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
  const { data, error, isLoading, mutate } = useSWR(
    endpoint,
    fetcher,
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
    }
  );

  return {
    pastOrders: data?.orders || PAST_ORDERS,
    nextCursor: data?.nextCursor,
    hasMore: data?.hasMore || false,
    isLoading,
    isError: error,
    mutate,
  };
};
