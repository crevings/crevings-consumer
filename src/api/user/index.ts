import useSWR from "swr";
import { UserProfile, OrderItem, Order, OrderPayment, OrderRatingData, OrderCustomer, SavedAddress } from "@/types";
import { fetcher, get, put, post } from "@/api/fetcher";

interface PastOrderItem {
  name?: string;
  quantity?: number;
}

interface BranchProfile {
  restaurantInfo?: { name?: string; address?: string; legalName?: string };
}

interface BranchDetails {
  name?: string;
  address?: string | { street?: string; city?: string };
  profile?: BranchProfile;
}

/** Raw past-order shape returned by the backend list endpoint. */
interface PastOrderDto {
  orderId?: string;
  items?: PastOrderItem[];
  createdAt?: string;
  restaurantName?: string;
  branchDetails?: BranchDetails;
  branchName?: string;
  restaurantAddress?: string;
  type?: string;
  status?: string;
  total?: number;
  subtotal?: number;
  tax?: number;
  deliveryFee?: number;
  discount?: number;
  isRated?: boolean;
  ratingData?: OrderRatingData | null;
  customerDetails?: OrderCustomer | null;
  payment?: OrderPayment | null;
}

const emptyProfile: UserProfile = {
  name: "",
  email: "",
  phone: "",
  gender: "",
  dob: "",
  image: null,
};

const profileFetcher = async (url: string): Promise<UserProfile> => {
  const data = await fetcher<{
    success: boolean;
    user?: {
      name?: string;
      email?: string;
      phone?: string;
      gender?: string;
      dob?: string;
      profileImage?: string | null;
      addresses?: SavedAddress[];
    };
  }>(url);
  if (data && data.success && data.user) {
    const u = data.user;
    return {
      name: u.name || "",
      email: u.email || "",
      phone: u.phone || "",
      gender: u.gender || "Male",
      dob: u.dob ? (new Date(u.dob).toISOString().split("T")[0] ?? "") : "",
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

  const data = await put<{ success: boolean; message?: string }>(
    "/consumer/profile",
    backendPayload
  );
  if (!data.success) {
    throw new Error(data.message || "Failed to update profile.");
  }
  return data;
};

/**
 * Fetch past orders with cursor-based pagination.
 */
export const getPastOrders = async (limit: number = 10, cursor?: string) => {
  let url = `/consumer/profile/orders/past?limit=${limit}`;
  if (cursor) {
    url += `&cursor=${encodeURIComponent(cursor)}`;
  }

  const data = await get<{
    success: boolean;
    message?: string;
    orders?: PastOrderDto[];
    nextCursor?: string | null;
    hasMore?: boolean;
  }>(url);
  if (!data.success) {
    throw new Error(data.message || "Failed to fetch past orders.");
  }
  
  const formattedOrders: Order[] = (data.orders || []).map((order: PastOrderDto): Order => {
    const lineItems: OrderItem[] = (Array.isArray(order.items) ? order.items : [])
      .map((item: PastOrderItem) => ({
        name: item.name ?? "",
        quantity: item.quantity || 1,
      }));
    const formattedDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }) : "";

    return {
      id: order.orderId || "", 
      restaurantName: order.restaurantName || order.branchDetails?.profile?.restaurantInfo?.name || order.branchDetails?.name || order.branchDetails?.profile?.restaurantInfo?.legalName || order.branchName || "",
      location: order.restaurantAddress || order.branchDetails?.profile?.restaurantInfo?.address || (typeof order.branchDetails?.address === 'string' ? order.branchDetails.address : [order.branchDetails?.address?.street, order.branchDetails?.address?.city].filter(Boolean).join(', ')) || "",
      rating: 0,
      items: lineItems,
      orderDate: formattedDate,
      type: (order.type as Order["type"]) || "Delivery",
      status: (order.status === "COMPLETED" || order.status === "DELIVERED" ? "COMPLETED" : "CANCELLED") as Order["status"],
      price: order.total || 0,
      total: order.total || 0,
      subtotal: order.subtotal || order.total || 0,
      tax: order.tax || 0,
      deliveryFee: order.deliveryFee || 0,
      discount: order.discount || 0,
      createdAt: order.createdAt,
      isRated: order.isRated || false,
      ratingData: order.ratingData ?? undefined,
      rawItems: (order.items || []) as OrderItem[],
      customerDetails: order.customerDetails ?? undefined,
      payment: order.payment ?? undefined,
    };
  });

  return {
    orders: formattedOrders,
    nextCursor: data.nextCursor ?? undefined,
    hasMore: data.hasMore,
  };
};

/**
 * Request account deletion (48-hour grace period).
 */
export const requestAccountDeletionApi = async () => {
  const data = await post<{ success: boolean; message?: string }>(
    "/consumer/profile/request-deletion"
  );
  if (!data.success) {
    throw new Error(data.message || "Failed to request account deletion.");
  }
  return data;
};
