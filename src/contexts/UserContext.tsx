import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile, Review, AuthUser } from "@/types";
import { useVerifyToken, logout as apiLogout } from "@/api/auth/index";
import { useUserProfile } from "@/api/user/index";

interface UserContextType {
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  rawProfileImage: string | null;
  setRawProfileImage: React.Dispatch<React.SetStateAction<string | null>>;
  reviews: Record<string, Review>;
  setReviews: React.Dispatch<React.SetStateAction<Record<string, Review>>>;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  onLoginSuccess: (user: AuthUser) => void;
  logout: () => Promise<void>;
  mutateProfile: () => Promise<unknown>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: React.ReactNode;
  /** Navigation is injected by the router so the provider stays pure. */
  onNavigateHome: () => void;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children, onNavigateHome }) => {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "",
    email: "",
    phone: "",
    gender: "Male",
    dob: "",
    image: null,
  });
  const [rawProfileImage, setRawProfileImage] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Record<string, Review>>({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const { data, error, mutate } = useVerifyToken();
  const { profile, mutate: mutateProfile } = useUserProfile();

  useEffect(() => {
    if (data && data.success && data.user) {
      setIsAuthenticated(true);
      setIsLoadingAuth(false);
    } else if (error) {
      setIsAuthenticated(false);
      setIsLoadingAuth(false);
    } else if (data === undefined && !error) {
      setIsLoadingAuth(true);
    }
  }, [data, error]);

  useEffect(() => {
    if (isAuthenticated && profile) {
      setUserProfile(profile);
    }
  }, [isAuthenticated, profile]);

  const onLoginSuccess = (user: AuthUser) => {
    setUserProfile({
      name: user.name,
      email: user.email,
      phone: user.phone,
      gender: user.gender || "",
      dob: user.dob ? (new Date(user.dob).toISOString().split('T')[0] ?? "") : "",
      image: user.profileImage || null,
    });
    setIsAuthenticated(true);
    mutate(); // Mutate SWR cache to update
    mutateProfile(); // Mutate profile SWR cache
  };

  const logout = async () => {
    try {
      await apiLogout();
      setIsAuthenticated(false);
      setUserProfile({
        name: "",
        email: "",
        phone: "",
        gender: "Male",
        dob: "",
        image: null,
      });
      mutate(undefined, false); // Clear SWR token verification cache
      onNavigateHome();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <UserContext.Provider
      value={{
        userProfile,
        setUserProfile,
        rawProfileImage,
        setRawProfileImage,
        reviews,
        setReviews,
        isAuthenticated,
        isLoadingAuth,
        onLoginSuccess,
        logout,
        mutateProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
