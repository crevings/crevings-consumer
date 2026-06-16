import React from "react";
import { Routes, Route, Navigate, useNavigate, useParams } from "react-router-dom";
import { Sparkles } from "lucide-react";

import { MainLayout } from "../layouts/MainLayout";
import { BlankLayout } from "../layouts/BlankLayout";

import { HomePage } from "../features/home/HomePage";
import { RestaurantDetailView } from "../features/restaurant/RestaurantDetailView";
import { RestaurantInfoView } from "../features/restaurant/RestaurantInfoView";
import { CheckoutView } from "../features/cart/CheckoutView";
import { OrderTrackingView } from "../features/orders/OrderTrackingView";
import { OrdersView } from "../features/orders/OrdersView";
import { ProfileView } from "../features/profile/ProfileView";
import { WalletView } from "../features/profile/pages/WalletView";
import { EditProfileView } from "../features/profile/EditProfileView";
import { CropProfileImageView } from "../features/profile/CropProfileImageView";
import { SettingsView } from "../features/profile/pages/SettingsView";
import { SearchResultsView } from "../features/search/SearchResultsView";
import { CategoryDetailView } from "../features/collection/CategoryDetailView";
import { CollectionDetailView } from "../features/collection/CollectionDetailView";

import { HelpSupportView } from "../features/profile/pages/HelpSupportView";
import { NotificationsView } from "../features/profile/pages/NotificationsView";
import { RefundsView } from "../features/profile/pages/RefundsView";
import { AddressBookView } from "../features/profile/pages/AddressBookView";
import { ReferEarnView } from "../features/profile/pages/ReferEarnView";
import { DataSharingView } from "../features/profile/pages/DataSharingView";
import { PoliciesView } from "../features/profile/pages/PoliciesView";
import { LicensesView } from "../features/profile/pages/LicensesView";
import { GstDetailsView } from "../features/profile/pages/GstDetailsView";
import { AccessibilityView } from "../features/profile/pages/AccessibilityView";
import { GoldMembershipView } from "../features/profile/pages/GoldMembershipView";
import { HiddenRestaurantsView } from "../features/favourites/HiddenRestaurantsView";
import { FavoritesView } from "../features/favourites/FavoritesView";
import { AboutView } from "../features/profile/pages/AboutView";
import { PlatformFeedbackView } from "../features/profile/pages/PlatformFeedbackView";
import { RateOrderView } from "../features/orders/RateOrderView";
import { ViewReviewDetailsView } from "../features/orders/ViewReviewDetailsView";
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
        onFavourite={() => setConfirmModal({ type: "favourite", restaurantId: String(selectedRestaurant.id) })}
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
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 max-w-md mx-auto shadow-2xl">
        <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-bold text-sm">Loading Restaurant...</p>
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
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 max-w-md mx-auto shadow-2xl">
        <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-bold text-sm">Loading Restaurant...</p>
      </div>
    );
  }

  if (restaurants.length > 0 && !selectedRestaurant) {
    return <Navigate to="/" replace />;
  }

  return null;
};

export const AppRoutes: React.FC = () => {
  const { restaurants } = useRestaurants();
  const navigate = useNavigate();

  const { userProfile, setUserProfile, rawProfileImage, setRawProfileImage, reviews, setReviews, logout } = useUser();
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
    setConfirmModal({ type: "favourite", restaurantId: String(id) });
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
          path="/orders"
          element={
            <OrdersView
              reviews={reviews}
              onRateClick={(order) => {
                setSelectedOrder(order);
                navigate("/rate-order");
              }}
              onViewReviewClick={(order) => {
                setSelectedOrder(order);
                navigate("/view-review");
              }}
              onReorderClick={handleReorder}
              onBack={() => navigate("/")}
            />
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
              onWalletClick={() => navigate("/wallet")}
              onOrdersClick={() => navigate("/orders")}
              onLogout={logout}
              onSettingsClick={() => navigate("/settings")}
              onHelpClick={() => navigate("/help")}
              onNotificationsClick={() => navigate("/notifications")}
              onRefundsClick={() => navigate("/refunds")}
              onReferClick={() => navigate("/refer")}
              onPoliciesClick={() => navigate("/policies")}
              onLicensesClick={() => navigate("/licenses")}
              onGstClick={() => navigate("/gst")}
              onAccessibilityClick={() => navigate("/accessibility")}
              onAddressBookClick={() => navigate("/address-book")}
              onManageMembershipClick={() => navigate("/gold")}
              onAboutClick={() => navigate("/about")}
              onFeedbackClick={() => navigate("/platform-feedback")}
              onBack={() => navigate("/")}
            />
          }
        />

        <Route path="/wallet" element={<WalletView onBack={() => navigate(-1)} />} />

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
          path="/settings"
          element={<SettingsView onBack={() => navigate(-1)} onDataSharingClick={() => navigate("/data-sharing")} />}
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
          element={
            selectedCategory ? (
              <CategoryDetailView
                category={selectedCategory}
                onBack={() => navigate("/")}
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
        <Route path="/address-book" element={<AddressBookView onBack={() => navigate(-1)} />} />
        <Route path="/refer" element={<ReferEarnView onBack={() => navigate(-1)} />} />
        <Route path="/data-sharing" element={<DataSharingView onBack={() => navigate(-1)} />} />
        <Route path="/policies" element={<PoliciesView onBack={() => navigate(-1)} />} />
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

        <Route path="/about" element={<AboutView onBack={() => navigate(-1)} />} />
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
                  navigate("/orders");
                }}
              />
            ) : (
              <Navigate to="/orders" />
            )
          }
        />

        <Route
          path="/view-review"
          element={
            selectedOrder && reviews[selectedOrder.id] ? (
              <ViewReviewDetailsView
                order={selectedOrder}
                review={reviews[selectedOrder.id]}
                onBack={() => navigate(-1)}
              />
            ) : (
              <Navigate to="/orders" />
            )
          }
        />

        <Route
          path="/location"
          element={
            <LocationPickerView
              addresses={addresses}
              setAddresses={setAddresses}
              onSelectLocation={(loc) => {
                setIsLoadingView(true);
                setLoadingViewType("home");
                setTimeout(() => {
                  setCurrentLocation(loc);
                  setIsLoadingView(false);
                  navigate("/");
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
