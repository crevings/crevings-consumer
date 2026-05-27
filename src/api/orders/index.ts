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
 * Fetch past order history with SWR.
 */
export const useOrderHistory = () => {
  const { data, error, isLoading, mutate } = useSWR<Order[]>(
    "/orders/past",
    fetcher,
    {
      fallbackData: PAST_ORDERS,
      revalidateOnMount: true,
      revalidateOnFocus: false,
    }
  );

  return {
    pastOrders: data || PAST_ORDERS,
    isLoading,
    isError: error,
    mutate,
  };
};
