import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation as useReactRouterLocation } from "react-router-dom";

import { MainLayout } from "@/layouts/MainLayout";
import { BlankLayout } from "@/layouts/BlankLayout";
import { PageLoader } from "@/shared/components/PageLoader";

import { ComingSoonPage } from "@/app/routes/ComingSoonPage";
import { RestaurantDetailRoute } from "@/app/routes/RestaurantRoutes";
import { CategoryDetailRoute, ItemsUnder99Route } from "@/app/routes/CollectionRoutes";

import { useUser } from "@/contexts/UserContext";
import { useLocation as useAppLocation } from "@/contexts/LocationContext";
import { useRestaurant } from "@/contexts/RestaurantContext";
import { useApp } from "@/contexts/AppContext";
import { useRestaurants } from "@/api/restaurant/index";
import { useReorder } from "@/features/orders/useReorder";

/* Route-level code splitting — each page ships as its own chunk. */
const HomePage = lazy(() => import("@/features/home/HomePage").then((m) => ({ default: m.HomePage })));
const CheckoutView = lazy(() => import("@/features/cart/CheckoutView").then((m) => ({ default: m.CheckoutView })));
const OrderTrackingView = lazy(() => import("@/features/orders/OrderTrackingView").then((m) => ({ default: m.OrderTrackingView })));
const ProfileView = lazy(() => import("@/features/profile/ProfileView").then((m) => ({ default: m.ProfileView })));
const EditProfileView = lazy(() => import("@/features/profile/EditProfileView").then((m) => ({ default: m.EditProfileView })));
const CropProfileImageView = lazy(() => import("@/features/profile/CropProfileImageView").then((m) => ({ default: m.CropProfileImageView })));
const SearchResultsView = lazy(() => import("@/features/search/SearchResultsView").then((m) => ({ default: m.SearchResultsView })));
const CollectionDetailView = lazy(() => import("@/features/collection/CollectionDetailView").then((m) => ({ default: m.CollectionDetailView })));
const RateOrderView = lazy(() => import("@/features/orders/RateOrderView").then((m) => ({ default: m.RateOrderView })));
const LocationPickerView = lazy(() => import("@/features/location/LocationPickerView").then((m) => ({ default: m.LocationPickerView })));
const HelpSupportView = lazy(() => import("@/features/profile/pages/HelpSupportView").then((m) => ({ default: m.HelpSupportView })));
const NotificationsView = lazy(() => import("@/features/profile/pages/NotificationsView").then((m) => ({ default: m.NotificationsView })));
const RefundsView = lazy(() => import("@/features/profile/pages/RefundsView").then((m) => ({ default: m.RefundsView })));
const PoliciesView = lazy(() => import("@/features/profile/pages/PoliciesView").then((m) => ({ default: m.PoliciesView })));
const PrivacyPolicyView = lazy(() => import("@/features/profile/pages/PrivacyPolicyView").then((m) => ({ default: m.PrivacyPolicyView })));
const TermsAndConditionsView = lazy(() => import("@/features/profile/pages/TermsAndConditionsView").then((m) => ({ default: m.TermsAndConditionsView })));
const RefundPolicyView = lazy(() => import("@/features/profile/pages/RefundPolicyView").then((m) => ({ default: m.RefundPolicyView })));
const LicensesView = lazy(() => import("@/features/profile/pages/LicensesView").then((m) => ({ default: m.LicensesView })));
const GstDetailsView = lazy(() => import("@/features/profile/pages/GstDetailsView").then((m) => ({ default: m.GstDetailsView })));
const AccessibilityView = lazy(() => import("@/features/profile/pages/AccessibilityView").then((m) => ({ default: m.AccessibilityView })));
const GoldMembershipView = lazy(() => import("@/features/profile/pages/GoldMembershipView").then((m) => ({ default: m.GoldMembershipView })));
const HiddenRestaurantsView = lazy(() => import("@/features/favourites/HiddenRestaurantsView").then((m) => ({ default: m.HiddenRestaurantsView })));
const FavoritesView = lazy(() => import("@/features/favourites/FavoritesView").then((m) => ({ default: m.FavoritesView })));
const PlatformFeedbackView = lazy(() => import("@/features/profile/pages/PlatformFeedbackView").then((m) => ({ default: m.PlatformFeedbackView })));

interface LocationRouteState {
  from?: string;
}

export const AppRoutes: React.FC = () => {
  const { restaurants } = useRestaurants();
  const navigate = useNavigate();
  const reactRouterLocation = useReactRouterLocation();
  const handleReorder = useReorder();

  const { userProfile, setUserProfile, rawProfileImage, setRawProfileImage, reviews, setReviews, logout, isAuthenticated } = useUser();
  const { addresses, setAddresses, setCurrentLocation } = useAppLocation();
  const {
    setSelectedRestaurant,
    selectedCollection,
    hiddenRestaurantIds,
    setHiddenRestaurantIds,
    favouriteRestaurantIds,
    setFavouriteRestaurantIds,
    activeOrder,
    setActiveOrder,
    selectedOrder,
    setSelectedOrder,
    handleItemAdd,
    setConfirmModal,
  } = useRestaurant();
  const { searchQuery, setIsVoiceSearchOpen } = useApp();

  const handleHideRestaurant = (id: string | number) => {
    setConfirmModal({ type: "hide", restaurantId: String(id) });
  };

  const handleFavouriteRestaurant = (id: string | number) => {
    const restaurantId = String(id);
    setFavouriteRestaurantIds((prev) =>
      prev.includes(restaurantId) ? prev.filter((fid) => fid !== restaurantId) : [...prev, restaurantId]
    );
  };

  const handleUnhideRestaurant = (id: string | number) => {
    setHiddenRestaurantIds((prev) => prev.filter((hid) => hid !== String(id)));
  };

  const handleRemoveFavourite = (id: string | number) => {
    setFavouriteRestaurantIds((prev) => prev.filter((fid) => fid !== String(id)));
  };


  const isAddressRequired = isAuthenticated && (!addresses || addresses.length === 0);

  React.useEffect(() => {
    if (isAddressRequired && reactRouterLocation.pathname !== "/location") {
      navigate("/location", { replace: true, state: { from: reactRouterLocation.pathname } });
    }
  }, [isAddressRequired, reactRouterLocation.pathname, navigate]);

  const locationFromState = (reactRouterLocation.state as LocationRouteState | null)?.from || "/";

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
      {/* Main Layout: wrapped tab views */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/local" element={<ComingSoonPage title="Local Search" />} />
        <Route path="/dine-in" element={<ComingSoonPage title="Dine-in booking" />} />
        <Route path="/deals" element={<ComingSoonPage title="Latest Deals" />} />
        <Route path="/ai" element={<HomePage />} />
      </Route>

      {/* Blank Layout: wrapped subpages and full-screen flows */}
      <Route element={<BlankLayout />}>
        <Route path="/restaurant/:id" element={<RestaurantDetailRoute />} />
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
              onRefundsClick={() => navigate("/refund-policy")}
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
                if (order.status === "Active") {
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
                  setRawProfileImage(null);
                  navigate("/profile");
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

        <Route path="/category/:id" element={<CategoryDetailRoute />} />
        <Route path="/items-under-99" element={<ItemsUnder99Route />} />

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
        <Route path="/refund-policy" element={<RefundPolicyView onBack={() => navigate(-1)} />} />
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
              onClose={() => navigate(locationFromState)}
              onSelectLocation={(loc) => {
                setCurrentLocation(loc);
                navigate(locationFromState);
              }}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
      </Routes>
    </Suspense>
  );
};
