import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, MapPin, UtensilsCrossed, Percent } from "lucide-react";
import { useLocation as useAppLocation } from "../../contexts/LocationContext";

interface BottomNavProps {
  isVisible: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ isVisible }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentLocation } = useAppLocation();

  const currentPath = location.pathname;
  const isHome = currentPath === "/";
  const isLocal = currentPath === "/local";
  const isDineIn = currentPath === "/dine-in";
  const isDeals = currentPath === "/deals";

  const showNav =
    ["/", "/local", "/dine-in", "/deals"].includes(currentPath) &&
    currentLocation &&
    currentLocation.address &&
    !currentLocation.address.toLowerCase().includes("motihari");

  if (!showNav) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 pb-safe z-40 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex justify-around items-center h-16">
        <button
          onClick={() => navigate("/")}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
            isHome ? "text-slate-900" : "text-slate-400"
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">Home</span>
        </button>
        <button
          onClick={() => navigate("/local")}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
            isLocal ? "text-slate-900" : "text-slate-400"
          }`}
        >
          <MapPin className="w-5 h-5" />
          <span className="text-[10px] font-medium">Local</span>
        </button>
        <button
          onClick={() => navigate("/dine-in")}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
            isDineIn ? "text-slate-900" : "text-slate-400"
          }`}
        >
          <UtensilsCrossed className="w-5 h-5" />
          <span className="text-[10px] font-medium">Dine-in</span>
        </button>
        <button
          onClick={() => navigate("/deals")}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
            isDeals ? "text-slate-900" : "text-slate-400"
          }`}
        >
          <Percent className="w-5 h-5" />
          <span className="text-[10px] font-medium">Deals</span>
        </button>
      </div>
    </div>
  );
};
