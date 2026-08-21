import useSWR from "swr";
import { fetcher, post } from "@/api/fetcher";
import { SavedAddress } from "@/types";

/**
 * Custom hook to verify the consumer's authentication token using SWR.
 */
export const useVerifyToken = () => {
  return useSWR<{
    success: boolean;
    user?: {
      name?: string;
      phone?: string;
      email?: string;
      addresses?: SavedAddress[];
    };
  }>("/consumer/auth/verify-token", fetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });
};

/**
 * Log in a consumer with email and password.
 */
export const login = async (payload: Record<string, unknown>) => {
  const data = await post<{ success: boolean; message?: string }>(
    "/consumer/auth/login",
    payload
  );
  if (!data.success) {
    throw new Error(data.message || "Something went wrong. Please try again.");
  }
  return data;
};

/**
 * Register a new consumer.
 */
export const register = async (payload: Record<string, unknown>) => {
  const data = await post<{ success: boolean; message?: string }>(
    "/consumer/auth/register",
    payload
  );
  if (!data.success) {
    throw new Error(data.message || "Something went wrong. Please try again.");
  }
  return data;
};

/**
 * Log out the authenticated consumer.
 */
export const logout = async () => {
  // Call role-specific logout + refresh token revocation
  await post<{ success?: boolean } | undefined>("/consumer/auth/logout").catch(() => {});
  await post("/auth/logout").catch(() => {});
  return { success: true };
};
