import React from "react";
import { Routes, Route, Navigate, useNavigate, useParams, useLocation as useReactRouterLocation } from "react-router-dom";
import { Sparkles } from "lucide-react";

import { MainLayout } from "../layouts/MainLayout";
import { BlankLayout } from "../layouts/BlankLayout";

import { HomePage } from "../features/home/HomePage";
import { RestaurantDetailView } from "../features/restaurant/RestaurantDetailView";
import { RestaurantInfoView } from "../features/restaurant/RestaurantInfoView";
import { CheckoutView } from "../features/cart/CheckoutView";
import { OrderTrackingView } from "../features/orders/OrderTrackingView";
import { ProfileView } from "../features/profile/ProfileView";
import { EditProfileView } from "../features/profile/EditProfileView";
import { CropProfileImageView } from "../features/profile/CropProfileImageView";
import { SearchResultsView } from "../features/search/SearchResultsView";
import { CategoryDetailView } from "../features/collection/CategoryDetailView";
import { CollectionDetailView } from "../features/collection/CollectionDetailView";

import { HelpSupportView } from "../features/profile/pages/HelpSupportView";
import { NotificationsView } from "../features/profile/pages/NotificationsView";
import { RefundsView } from "../features/profile/pages/RefundsView";
import { PoliciesView } from "../features/profile/pages/PoliciesView";
import { PrivacyPolicyView } from "../features/profile/pages/PrivacyPolicyView";
import { TermsAndConditionsView } from "../features/profile/pages/TermsAndConditionsView";
import { LicensesView } from "../features/profile/pages/LicensesView";
import { GstDetailsView } from "../features/profile/pages/GstDetailsView";
import { AccessibilityView } from "../features/profile/pages/AccessibilityView";
import { GoldMembershipView } from "../features/profile/pages/GoldMembershipView";
import { HiddenRestaurantsView } from "../features/favourites/HiddenRestaurantsView";
import { FavoritesView } from "../features/favourites/FavoritesView";
import { PlatformFeedbackView } from "../features/profile/pages/PlatformFeedbackView";
import { RateOrderView } from "../features/orders/RateOrderView";
import { LocationPickerView } from "../features/location/LocationPickerView";

import { useUser } from "../contexts/UserContext";
import { useLocation as useAppLocation } from "../contexts/LocationContext";
import { useRestaurant } from "../contexts/RestaurantContext";
import { useCart } from "../contexts/CartContext";
import { useApp } from "../contexts/AppContext";

import { useRestaurants } from "../api/restaurants";
import { Order } from "@/types";

// Coming Soon Component for tabs
const ComingSoonPage: React.FC<{ title: string }> = ({ title }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center animate-fadeInUp pt-10">
      <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
        <Sparkles className="w-10 h-10 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">{title} Page</h2>
      <p className="text-slate-500 text-sm max-w-[280px] mb-8">
        We're cooking up something exciting! This section is coming soon.
      </p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold active:scale-95 transition-all shadow-sm shadow-green-600/20"
      >
        Go Back Home
      </button>
    </div>
  );
};

const RestaurantDetailRouteWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { restaurants, isLoading: isRestaurantsLoading } = useRestaurants();
  const {
    selectedRestaurant,
    setSelectedRestaurant,
    favouriteRestaurantIds,
    setFavouriteRestaurantIds,
    hiddenRestaurantIds,
    setHiddenRestaurantIds,
    autoAddItem,
    setConfirmModal,
  } = useRestaurant();
  const { setCart, setMenuItems } = useCart();
  const { setIsLoadingView, setLoadingViewType } = useApp();

  React.useEffect(() => {
    if (!selectedRestaurant && restaurants.length > 0 && id) {
      const found = restaurants.find((r) => String(r.id) === id);
      if (found) {
        setSelectedRestaurant(found);
      }
    }
  }, [id, restaurants, selectedRestaurant, setSelectedRestaurant]);

  if (selectedRestaurant) {
    return (
      <RestaurantDetailView
        restaurant={selectedRestaurant}
        onBack={() => navigate("/")}
        onCheckout={(newCart, items) => {
          setIsLoadingView(true);
          setLoadingViewType("checkout");
          setTimeout(() => {
            setCart(newCart);
            setMenuItems(items);
            navigate("/checkout");
            setIsLoadingView(false);
          }, 2500);
        }}
        onHide={() => setConfirmModal({ type: "hide", restaurantId: String(selectedRestaurant.id) })}
        onUnhide={() => setHiddenRestaurantIds((prev) => prev.filter((hid) => hid !== String(selectedRestaurant.id)))}
        onFavourite={() =>
          setFavouriteRestaurantIds((prev) =>
            prev.includes(String(selectedRestaurant.id))
              ? prev
              : [...prev, String(selectedRestaurant.id)]
          )
        }
        onRemoveFavourite={() => setFavouriteRestaurantIds((prev) => prev.filter((fid) => fid !== String(selectedRestaurant.id)))}
        isFavourite={favouriteRestaurantIds.includes(String(selectedRestaurant.id))}
        isHidden={hiddenRestaurantIds.includes(String(selectedRestaurant.id))}
        onInfoClick={() => navigate(`/restaurant/${selectedRestaurant.id}/info`)}
        autoAddItem={autoAddItem}
      />
    );
  }

  if (isRestaurantsLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <div className="w-10 h-10 border-2 border-slate-200 border-t-[#00bd6f] rounded-full animate-spin mb-3"></div>
        <p className="text-slate-500 font-bold text-sm">Loading...</p>
      </div>
    );
  }

  if (restaurants.length > 0 && !selectedRestaurant) {
    return <Navigate to="/" replace />;
  }

  return null;
};

const RestaurantInfoRouteWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { restaurants, isLoading: isRestaurantsLoading } = useRestaurants();
  const { selectedRestaurant, setSelectedRestaurant } = useRestaurant();

  React.useEffect(() => {
    if (!selectedRestaurant && restaurants.length > 0 && id) {
      const found = restaurants.find((r) => String(r.id) === id);
      if (found) {
        setSelectedRestaurant(found);
      }
    }
  }, [id, restaurants, selectedRestaurant, setSelectedRestaurant]);

  if (selectedRestaurant) {
    return <RestaurantInfoView restaurant={selectedRestaurant} onBack={() => navigate(-1)} />;
  }

  if (isRestaurantsLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <div className="w-10 h-10 border-2 border-slate-200 border-t-[#00bd6f] rounded-full animate-spin mb-3"></div>
        <p className="text-slate-500 font-bold text-sm">Loading...</p>
      </div>
    );
  }

  if (restaurants.length > 0 && !selectedRestaurant) {
    return <Navigate to="/" replace />;
  }

  return null;
};

const CategoryDetailRouteWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedCategory, setSelectedRestaurant, handleItemAdd } = useRestaurant();

  const categoryName = id || selectedCategory || "Burgers";

  return (
    <CategoryDetailView
      category={categoryName}
      onBack={() => {
        if (window.history.length > 1) {
          navigate(-1);
        } else {
          navigate("/");
        }
      }}
      onRestaurantClick={(rest) => {
        setSelectedRestaurant(rest);
        navigate(`/restaurant/${rest.id}`);
      }}
      onItemAdd={handleItemAdd}
    />
  );
};

export const AppRoutes: React.FC = () => {
  const { restaurants } = useRestaurants();
  const navigate = useNavigate();
  const reactRouterLocation = useReactRouterLocation();

  const { userProfile, setUserProfile, rawProfileImage, setRawProfileImage, reviews, setReviews, logout, isAuthenticated } = useUser();
  const { currentLocation, setCurrentLocation, addresses, setAddresses } = useAppLocation();
  const {
    selectedRestaurant,
    setSelectedRestaurant,
    selectedCollection,
    setSelectedCollection,
    selectedCategory,
    setSelectedCategory,
    hiddenRestaurantIds,
    setHiddenRestaurantIds,
    favouriteRestaurantIds,
    setFavouriteRestaurantIds,
    activeOrder,
    setActiveOrder,
    selectedOrder,
    setSelectedOrder,
    autoAddItem,
    setAutoAddItem,
    handleItemAdd,
    setConfirmModal,
  } = useRestaurant();
  const { cart, setCart, menuItems, setMenuItems } = useCart();
  const { setIsLoadingView, setLoadingViewType, isVoiceSearchOpen, setIsVoiceSearchOpen, searchQuery, setSearchQuery } = useApp();

  const handleHideRestaurant = (id: string | number) => {
    setConfirmModal({ type: "hide", restaurantId: String(id) });
  };

  const handleFavouriteRestaurant = (id: string | number) => {
    const rid = String(id);
    setFavouriteRestaurantIds((prev) =>
      prev.includes(rid) ? prev.filter((fid) => fid !== rid) : [...prev, rid]
    );
  };

  const handleUnhideRestaurant = (id: string | number) => {
    setHiddenRestaurantIds((prev) => prev.filter((hid) => hid !== String(id)));
  };

  const handleRemoveFavourite = (id: string) => {
    setFavouriteRestaurantIds((prev) => prev.filter((fid) => fid !== id));
  };

  const handleReorder = (order: Order) => {
    const items = order.items.split(",").map((i) => i.trim());
    const newCart: any[] = [];
    const newMenuItems: any[] = [];

    items.forEach((itemStr, index) => {
      const match = itemStr.match(/^(\d+)x\s+(.+)$/);
      if (match) {
        const qty = parseInt(match[1], 10);
        const name = match[2];
        const id = `reorder-${index}`;
        
        newCart.push({
          cartItemId: id,
          item: {
            id,
            name,
            price: Math.round((order.price || 300) / items.length),
            rating: 4.5,
            ratingCount: "100+",
            category: "Reorder",
            isVeg: true,
            image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop",
            description: "Reordered item",
            available: true,
          },
          quantity: qty,
          totalPrice: Math.round((order.price || 300) / items.length) * qty,
        });
        
        newMenuItems.push({
          id,
          name,
          price: Math.round((order.price || 300) / items.length),
          category: "Reorder",
        });
      }
    });

    setCart(newCart);
    setMenuItems(newMenuItems);

    const rest = restaurants.find((r) => r.name === order.restaurantName);
    if (rest) {
      setSelectedRestaurant(rest);
    }

    navigate("/checkout");
  };

  const isAddressRequired = isAuthenticated && (!addresses || addresses.length === 0);

  React.useEffect(() => {
    if (isAddressRequired && reactRouterLocation.pathname !== "/location") {
      navigate("/location", { replace: true, state: { from: reactRouterLocation.pathname } });
    }
  }, [isAddressRequired, reactRouterLocation.pathname, navigate]);

  return (
    <Routes>
      {/* Main Layout: wrapped tab views */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/local" element={<ComingSoonPage title="Local Search" />} />
        <Route path="/dine-in" element={<ComingSoonPage title="Dine-in booking" />} />
        <Route path="/deals" element={<ComingSoonPage title="Latest Deals" />} />
        <Route path="/ai" element={<HomePage />} /> {/* Render HomePage under /ai and MainLayout handles AI Overlay */}
      </Route>

      {/* Blank Layout: wrapped subpages and full-screen flows */}
      <Route element={<BlankLayout />}>
        <Route
          path="/restaurant/:id"
          element={<RestaurantDetailRouteWrapper />}
        />

        <Route
          path="/restaurant/:id/info"
          element={<RestaurantInfoRouteWrapper />}
        />

        <Route path="/checkout" element={<CheckoutView />} />

        <Route
          path="/order-tracking"
          element={
            activeOrder ? (
              <OrderTrackingView
                order={activeOrder}
                onBack={() => navigate("/")}
                onCancelOrder={() => {
                  setActiveOrder(null);
                  navigate("/");
                }}
                onOrderComplete={() => {
                  setSelectedOrder(activeOrder);
                  setActiveOrder(null);
                  navigate("/rate-order");
                }}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />



        <Route
          path="/profile"
          element={
            <ProfileView
              userProfile={userProfile}
              onUpdateProfileImage={(img) => setUserProfile((prev) => ({ ...prev, image: img }))}
              onUpdateProfile={setUserProfile}
              onEditProfileClick={() => navigate("/edit-profile")}
              onLogout={logout}
              onHelpClick={() => navigate("/help")}
              onNotificationsClick={() => navigate("/notifications")}
              onRefundsClick={() => navigate("/refunds")}
              onPoliciesClick={() => navigate("/terms")}
              onPrivacyClick={() => navigate("/privacy-policy")}
              onLicensesClick={() => navigate("/licenses")}
              onGstClick={() => navigate("/gst")}
              onAccessibilityClick={() => navigate("/accessibility")}
              onAddressBookClick={() => navigate("/location", { state: { from: "/profile" } })}
              onManageMembershipClick={() => navigate("/gold")}
              onFeedbackClick={() => navigate("/platform-feedback")}
              onBack={() => navigate("/")}
              reviews={reviews}
              onRateClick={(order) => {
                setSelectedOrder(order);
                navigate("/rate-order");
              }}
              onReorderClick={handleReorder}
              onViewDetailsClick={(order) => {
                if (order.status === 'Active') {
                  setActiveOrder(order);
                  navigate("/order-tracking");
                } else {
                  setSelectedOrder(order);
                  navigate("/rate-order");
                }
              }}
            />
          }
        />



        <Route
          path="/edit-profile"
          element={
            <EditProfileView
              initialData={userProfile}
              onBack={() => navigate(-1)}
              onSave={(data) => {
                setUserProfile(data);
                navigate("/profile");
              }}
              onSelectRawImage={(img) => {
                setRawProfileImage(img);
                navigate("/crop-image");
              }}
            />
          }
        />

        <Route
          path="/crop-image"
          element={
            rawProfileImage ? (
              <CropProfileImageView
                imageUri={rawProfileImage}
                onBack={() => navigate(-1)}
                onSave={(cropped) => {
                  setUserProfile((prev) => ({ ...prev, image: cropped }));
                  navigate("/profile");
                  setRawProfileImage(null);
                }}
              />
            ) : (
              <Navigate to="/profile" />
            )
          }
        />


        <Route
          path="/search-results"
          element={
            <SearchResultsView
              onBack={() => navigate("/")}
              initialQuery={searchQuery}
              onRestaurantClick={(rest) => {
                setSelectedRestaurant(rest);
                navigate(`/restaurant/${rest.id}`);
              }}
              onItemAdd={handleItemAdd}
              onMicClick={() => setIsVoiceSearchOpen(true)}
            />
          }
        />

        <Route
          path="/category/:id"
          element={<CategoryDetailRouteWrapper />}
        />

        <Route
          path="/collection/:id"
          element={
            selectedCollection ? (
              <CollectionDetailView
                collection={selectedCollection}
                restaurants={restaurants}
                hiddenIds={hiddenRestaurantIds}
                favouriteIds={favouriteRestaurantIds}
                onBack={() => navigate("/")}
                onHide={handleHideRestaurant}
                onFavourite={handleFavouriteRestaurant}
                onRestaurantClick={(rest) => {
                  setSelectedRestaurant(rest);
                  navigate(`/restaurant/${rest.id}`);
                }}
                onItemAdd={handleItemAdd}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route path="/help" element={<HelpSupportView onBack={() => navigate(-1)} />} />
        <Route path="/notifications" element={<NotificationsView onBack={() => navigate(-1)} />} />
        <Route path="/refunds" element={<RefundsView onBack={() => navigate(-1)} />} />


        <Route path="/policies" element={<PoliciesView onBack={() => navigate(-1)} />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyView onBack={() => navigate(-1)} />} />
        <Route path="/terms" element={<TermsAndConditionsView onBack={() => navigate(-1)} />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditionsView onBack={() => navigate(-1)} />} />
        <Route path="/licenses" element={<LicensesView onBack={() => navigate(-1)} />} />
        <Route path="/gst" element={<GstDetailsView onBack={() => navigate(-1)} />} />
        <Route path="/accessibility" element={<AccessibilityView onBack={() => navigate(-1)} />} />
        <Route path="/gold" element={<GoldMembershipView onClose={() => navigate(-1)} />} />
        
        <Route
          path="/hidden-restaurants"
          element={
            <HiddenRestaurantsView
              hiddenRestaurants={restaurants.filter((r) => hiddenRestaurantIds.includes(String(r.id)))}
              onUnhide={handleUnhideRestaurant}
              onBack={() => navigate(-1)}
            />
          }
        />

        <Route
          path="/favourites"
          element={
            <FavoritesView
              favorites={restaurants.filter((r) => favouriteRestaurantIds.includes(String(r.id)))}
              onRemove={handleRemoveFavourite}
              onBack={() => navigate(-1)}
            />
          }
        />

        <Route path="/platform-feedback" element={<PlatformFeedbackView onBack={() => navigate(-1)} />} />

        <Route
          path="/rate-order"
          element={
            selectedOrder ? (
              <RateOrderView
                order={selectedOrder}
                onBack={() => navigate(-1)}
                onSubmit={(review) => {
                  setReviews((prev) => ({
                    ...prev,
                    [selectedOrder.id]: review,
                  }));
                  navigate("/");
                }}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/location"
          element={
            <LocationPickerView
              addresses={addresses}
              setAddresses={setAddresses}
              onClose={() => {
                const from = (reactRouterLocation.state as any)?.from || "/";
                navigate(from);
              }}
              onSelectLocation={(loc) => {
                const from = (reactRouterLocation.state as any)?.from || "/";
                setIsLoadingView(true);
                setLoadingViewType(from === "/checkout" ? "checkout" : "home");
                setTimeout(() => {
                  setCurrentLocation(loc);
                  setIsLoadingView(false);
                  navigate(from);
                }, 2500);
              }}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
