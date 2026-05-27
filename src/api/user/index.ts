import useSWR from "swr";
import { UserProfile } from "@/types";
import { fetcher } from "../fetcher";

const defaultProfile: UserProfile = {
  name: "Amanat Prakash",
  email: "amanat@example.com",
  phone: "9876543210",
  gender: "Male",
  dob: "1999-09-15",
  image: null,
};

/**
 * Fetch user profile information with SWR.
 */
export const useUserProfile = () => {
  const { data, error, isLoading, mutate } = useSWR<UserProfile>(
    "/user/profile",
    fetcher,
    {
      fallbackData: defaultProfile,
      revalidateOnMount: true,
      revalidateOnFocus: false,
    }
  );

  return {
    profile: data || defaultProfile,
    isLoading,
    isError: error,
    mutate,
  };
};
