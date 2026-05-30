import useSWR from "swr";
import { Restaurant, MenuItem } from "@/types";
import { fetcher } from "../fetcher";
import { MOCK_MENU } from "@/data/menu";

/**
 * Fetch all registered restaurants from the backend database with SWR.
 */
export const useRestaurants = () => {
  const { data: responseData, error, isLoading, mutate } = useSWR<{ success: boolean; data: Restaurant[] }>(
    "/consumer/restaurants",
    fetcher,
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
    }
  );

  return {
    restaurants: responseData?.success ? responseData.data : [],
    isLoading,
    isError: error,
    mutate,
  };
};

/**
 * Fetch restaurant menu details with SWR by restaurant ID from the backend database.
 */
export const useRestaurantDetail = (id: string | undefined) => {
  const { data: responseData, error, isLoading, mutate } = useSWR<{ success: boolean; data: MenuItem[] }>(
    id ? `/consumer/restaurants/${id}/menu` : null,
    fetcher,
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
    }
  );

  return {
    menuItems: responseData?.success ? responseData.data : [],
    isLoading,
    isError: error,
    mutate,
  };
};
