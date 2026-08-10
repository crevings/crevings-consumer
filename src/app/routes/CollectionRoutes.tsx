import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CategoryDetailView } from "@/features/collection/CategoryDetailView";
import { ItemsUnder99View } from "@/features/collection/ItemsUnder99View";
import { useRestaurant } from "@/contexts/RestaurantContext";

/** Navigate back when history exists, otherwise fall back to the home feed. */
function goBack(navigate: ReturnType<typeof useNavigate>) {
  if (window.history.length > 1) {
    navigate(-1);
  } else {
    navigate("/");
  }
}

export const CategoryDetailRoute: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedCategory, setSelectedRestaurant, handleItemAdd } = useRestaurant();

  const categoryName = id || selectedCategory || "Burgers";

  return (
    <CategoryDetailView
      category={categoryName}
      onBack={() => goBack(navigate)}
      onRestaurantClick={(rest) => {
        setSelectedRestaurant(rest);
        navigate(`/restaurant/${rest.id}`);
      }}
      onItemAdd={handleItemAdd}
    />
  );
};

export const ItemsUnder99Route: React.FC = () => {
  const navigate = useNavigate();
  const { setSelectedRestaurant, handleItemAdd } = useRestaurant();

  return (
    <ItemsUnder99View
      onBack={() => goBack(navigate)}
      onRestaurantClick={(rest) => {
        setSelectedRestaurant(rest);
        navigate(`/restaurant/${rest.id}`);
      }}
      onItemAdd={handleItemAdd}
    />
  );
};
