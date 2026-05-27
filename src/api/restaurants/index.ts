import useSWR from "swr";
import { Restaurant, MenuItem } from "@/types";
import { fetcher } from "../fetcher";
import { ALL_RESTAURANTS } from "@/data/restaurants";
import { MOCK_MENU } from "@/data/menu";

/**
 * Fetch all restaurants with SWR.
 * Fallbacks to the static mock data if the API is offline or loading.
 */
export const useRestaurants = () => {
  const { data, error, isLoading, mutate } = useSWR<Restaurant[]>(
    "/restaurants",
    fetcher,
    {
      fallbackData: ALL_RESTAURANTS,
      revalidateOnMount: true,
      revalidateOnFocus: false,
    }
  );

  return {
    restaurants: data || ALL_RESTAURANTS,
    isLoading,
    isError: error,
    mutate,
  };
};

/**
 * Fetch restaurant menu details with SWR by restaurant ID.
 * Fallbacks to the static mock menu items if the API is offline.
 */
export const useRestaurantDetail = (id: string | undefined) => {
  const { data, error, isLoading, mutate } = useSWR<MenuItem[]>(
    id ? `/restaurants/${id}/menu` : null,
    fetcher,
    {
      fallbackData: MOCK_MENU,
      revalidateOnMount: true,
      revalidateOnFocus: false,
    }
  );

  return {
    menuItems: data || MOCK_MENU,
    isLoading: !data && isLoading,
    isError: error,
    mutate,
  };
};
