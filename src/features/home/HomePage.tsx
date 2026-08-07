import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import { useLocation } from "@/contexts/LocationContext";
import { useRestaurant } from "@/contexts/RestaurantContext";
import { HomeFeed } from "@/features/home/HomeFeed";

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentLocation } = useLocation();
  const {
    hiddenRestaurantIds,
    handleItemAdd,
    setSelectedRestaurant,
    setSelectedCollection,
    setSelectedCategory,
    setFavouriteRestaurantIds,
    setConfirmModal,
  } = useRestaurant();

  const handleHideRestaurant = (id: string | number) => {
    setConfirmModal({ type: "hide", restaurantId: String(id) });
  };

  const handleFavouriteRestaurant = (id: string | number) => {
    const rid = String(id);
    setFavouriteRestaurantIds((prev) =>
      prev.includes(rid) ? prev.filter((fid) => fid !== rid) : [...prev, rid]
    );
  };

  if (!currentLocation || !currentLocation.address) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center animate-fadeInUp pt-10">
        <div className="w-32 h-32 bg-green-50 rounded-full flex items-center justify-center mb-8 shadow-inner animate-bounce">
          <MapPin className="w-14 h-14 text-green-600" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">
          Please add your location
        </h2>
        <p className="text-slate-500 text-base max-w-[300px] leading-relaxed mb-10">
          We need your delivery address to show nearby restaurants and place your food order.
        </p>
        <button
          onClick={() => navigate("/location")}
          className="w-full max-w-[280px] py-4 bg-[#00BD6F] text-white rounded-2xl text-base font-bold active:scale-95 transition-all shadow-md shadow-[#00BD6F]/20"
        >
          Add Location
        </button>
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
        setSelectedRestaurant(rest);
        navigate(`/restaurant/${rest.id}`);
      }}
      onItemAdd={handleItemAdd}
      onCollectionClick={(collection) => {
        setSelectedCollection(collection);
        navigate(`/collection/${collection.id}`);
      }}
      onSeeAllUnder99={() => navigate("/items-under-99")}
    />
  );
};
