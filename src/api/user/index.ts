import useSWR from "swr";
import { UserProfile } from "@/types";
import { fetcher, BASE_URL } from "../fetcher";

const emptyProfile: UserProfile = {
  name: "",
  email: "",
  phone: "",
  gender: "",
  dob: "",
  image: null,
};

const profileFetcher = async (url: string): Promise<UserProfile> => {
  const data = await fetcher(url);
  if (data && data.success && data.user) {
    const u = data.user;
    return {
      name: u.name || "",
      email: u.email || "",
      phone: u.phone || "",
      gender: u.gender || "Male",
      dob: u.dob ? new Date(u.dob).toISOString().split('T')[0] : "1999-09-15",
      image: u.profileImage || null,
    };
  }
  throw new Error("Invalid profile response");
};

/**
 * Fetch user profile information with SWR.
 */
export const useUserProfile = () => {
  const { data, error, isLoading, mutate } = useSWR<UserProfile>(
    "/consumer/profile",
    profileFetcher,
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
    }
  );

  return {
    profile: data || emptyProfile,
    isLoading,
    isError: error,
    mutate,
  };
};

/**
 * Update user profile information.
 */
export const updateUserProfile = async (payload: Partial<UserProfile>) => {
  const backendPayload = {
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    gender: payload.gender,
    dob: payload.dob,
    profileImage: payload.image,
  };

  const response = await fetch(`${BASE_URL}/consumer/profile`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(backendPayload),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to update profile.");
  }
  return data;
};

/**
 * Fetch past orders with cursor-based pagination.
 */
export const getPastOrders = async (limit: number = 10, cursor?: string) => {
  let url = `${BASE_URL}/consumer/profile/orders/past?limit=${limit}`;
  if (cursor) {
    url += `&cursor=${encodeURIComponent(cursor)}`;
  }

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch past orders.");
  }
  
  const formattedOrders = (data.orders || []).map((o: any) => {
    const itemsList = (o.items || []).map((item: any) => `${item.name} x${item.quantity}`).join(", ");
    const formattedDate = o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }) : "";

    return {
      id: o.orderId,
      restaurantName: o.branchDetails?.profile?.restaurantInfo?.name || "Crevings Restaurant",
      location: o.branchDetails?.profile?.restaurantInfo?.address || o.customerDetails?.address || "Delivery Address",
      rating: 0,
      items: itemsList || "1 item",
      orderDate: formattedDate,
      type: o.type || "Delivery",
      status: o.status === "COMPLETED" || o.status === "DELIVERED" ? "Completed" : "Cancelled",
      price: o.total || 0,
      total: o.total || 0,
      createdAt: o.createdAt,
    };
  });

  return {
    orders: formattedOrders,
    nextCursor: data.nextCursor,
    hasMore: data.hasMore,
  };
};
