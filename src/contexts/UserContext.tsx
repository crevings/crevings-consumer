import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import { UserProfile, Review } from "@/types";
import { fetcher } from "../api/fetcher";
import { useVerifyToken, logout as apiLogout } from "../api/auth";

interface UserContextType {
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  rawProfileImage: string | null;
  setRawProfileImage: React.Dispatch<React.SetStateAction<string | null>>;
  reviews: Record<string, Review>;
  setReviews: React.Dispatch<React.SetStateAction<Record<string, Review>>>;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  onLoginSuccess: (user: any) => void;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "",
    email: "",
    phone: "",
    gender: "Male",
    dob: "1999-09-15",
    image: null,
  });
  const [rawProfileImage, setRawProfileImage] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Record<string, Review>>({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Authenticate token using SWR config
  const { data, error, mutate } = useVerifyToken();

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).__BONEYARD_BUILD) {
      setIsAuthenticated(true);
      setIsLoadingAuth(false);
      return;
    }

    if (data && data.success && data.user) {
      setUserProfile({
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
        gender: "Male",
        dob: "1999-09-15",
        image: null,
      });
      setIsAuthenticated(true);
      setIsLoadingAuth(false);
    } else if (error) {
      setIsAuthenticated(false);
      setIsLoadingAuth(false);
    } else if (data === undefined && !error) {
      setIsLoadingAuth(true);
    }
  }, [data, error]);

  const onLoginSuccess = (user: any) => {
    setUserProfile({
      name: user.name,
      email: user.email,
      phone: user.phone,
      gender: "Male",
      dob: "1999-09-15",
      image: null,
    });
    setIsAuthenticated(true);
    mutate(); // Mutate SWR cache to update
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
        dob: "1999-09-15",
        image: null,
      });
      mutate(null, false); // Clear SWR token verification cache
      navigate("/");
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
