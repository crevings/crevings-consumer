import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Instagram, Twitter, Facebook } from "lucide-react";
import { useLocation } from "../../contexts/LocationContext";
import { useRestaurant } from "../../contexts/RestaurantContext";
import { useApp } from "../../contexts/AppContext";
import { HomeFeed } from "./HomeFeed";

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentLocation } = useLocation();
  const {
    hiddenRestaurantIds,
    handleItemAdd,
    setSelectedRestaurant,
    setSelectedCollection,
    setSelectedCategory,
    favouriteRestaurantIds,
    setConfirmModal,
  } = useRestaurant();
  const { setIsLoadingView, setLoadingViewType } = useApp();

  const handleHideRestaurant = (id: string | number) => {
    setConfirmModal({ type: "hide", restaurantId: String(id) });
  };

  const handleFavouriteRestaurant = (id: string | number) => {
    setConfirmModal({ type: "favourite", restaurantId: String(id) });
  };

  const isMotihari = currentLocation.address.toLowerCase().includes("motihari");

  if (isMotihari) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center animate-fadeInUp pt-10">
        <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center mb-8 shadow-inner">
          <MapPin className="w-14 h-14 text-blue-500" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">
          We're not here yet!
        </h2>
        <p className="text-slate-500 text-base max-w-[300px] leading-relaxed mb-10">
          We are currently expanding our services and hope to serve you in{" "}
          <span className="font-bold text-slate-700">Motihari</span> soon. Stay tuned!
        </p>
        <div className="w-full max-w-[280px] p-6 bg-slate-50 rounded-3xl border border-slate-100">
          <p className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">
            Follow our journey
          </p>
          <div className="flex justify-center gap-6">
            <a
              href="#"
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-pink-600 shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-400 shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <HomeFeed
      onCategoryClick={(cat) => {
        setSelectedCategory(cat);
        navigate(`/category/${cat}`);
      }}
      hiddenIds={hiddenRestaurantIds}
      onHide={handleHideRestaurant}
      onFavourite={handleFavouriteRestaurant}
      onRestaurantClick={(rest) => {
        setIsLoadingView(true);
        setLoadingViewType("restaurant");
        setTimeout(() => {
          setSelectedRestaurant(rest);
          navigate(`/restaurant/${rest.id}`);
          setIsLoadingView(false);
        }, 2500);
      }}
      onItemAdd={handleItemAdd}
      onCollectionClick={(collection) => {
        setSelectedCollection(collection);
        navigate(`/collection/${collection.id}`);
      }}
    />
  );
};
