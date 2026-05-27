import React, { createContext, useContext, useState } from "react";
import { UserProfile, Review } from "@/types";

interface UserContextType {
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  rawProfileImage: string | null;
  setRawProfileImage: React.Dispatch<React.SetStateAction<string | null>>;
  reviews: Record<string, Review>;
  setReviews: React.Dispatch<React.SetStateAction<Record<string, Review>>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Amanat Prakash",
    email: "amanat@example.com",
    phone: "9876543210",
    gender: "Male",
    dob: "1999-09-15",
    image: null,
  });
  const [rawProfileImage, setRawProfileImage] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Record<string, Review>>({});

  return (
    <UserContext.Provider
      value={{
        userProfile,
        setUserProfile,
        rawProfileImage,
        setRawProfileImage,
        reviews,
        setReviews,
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
