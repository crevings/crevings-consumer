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
      restaurantName: o.restaurantName || o.branchDetails?.profile?.restaurantInfo?.name || o.branchDetails?.name || o.branchDetails?.profile?.restaurantInfo?.legalName || o.branchName || "",
      location: o.restaurantAddress || o.branchDetails?.profile?.restaurantInfo?.address || (typeof o.branchDetails?.address === 'string' ? o.branchDetails.address : [o.branchDetails?.address?.street, o.branchDetails?.address?.city].filter(Boolean).join(', ')) || "",
      rating: 0,
      items: itemsList || "1 item",
      orderDate: formattedDate,
      type: o.type || "Delivery",
      status: o.status === "COMPLETED" || o.status === "DELIVERED" ? "Completed" : "Cancelled",
      price: o.total || 0,
      total: o.total || 0,
      subtotal: o.subtotal || o.total || 0,
      tax: o.tax || 0,
      deliveryFee: o.deliveryFee || 0,
      discount: o.discount || 0,
      createdAt: o.createdAt,
      isRated: o.isRated || false,
      ratingData: o.ratingData || null,
      rawItems: o.items || [],
      customerDetails: o.customerDetails || null,
      payment: o.payment || null,
    };
  });

  return {
    orders: formattedOrders,
    nextCursor: data.nextCursor,
    hasMore: data.hasMore,
  };
};

/**
 * Request account deletion (48-hour grace period).
 */
export const requestAccountDeletionApi = async () => {
  const response = await fetch(`${BASE_URL}/consumer/profile/request-deletion`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to request account deletion.");
  }
  return data;
};
