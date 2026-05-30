import useSWR from "swr";
import { fetcher, BASE_URL } from "../fetcher";

/**
 * Custom hook to verify the consumer's authentication token using SWR.
 */
export const useVerifyToken = () => {
  return useSWR("/consumer/auth/verify-token", fetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });
};

/**
 * Log in a consumer with email and password.
 */
export const login = async (payload: any) => {
  const response = await fetch(`${BASE_URL}/consumer/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Something went wrong. Please try again.");
  }
  return data;
};

/**
 * Register a new consumer.
 */
export const register = async (payload: any) => {
  const response = await fetch(`${BASE_URL}/consumer/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Something went wrong. Please try again.");
  }
  return data;
};

/**
 * Log out the authenticated consumer.
 */
export const logout = async () => {
  const response = await fetch(`${BASE_URL}/consumer/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Logout failed");
  }
  
  // Try to parse JSON response if exists, otherwise return simple success
  try {
    return await response.json();
  } catch {
    return { success: true };
  }
};
