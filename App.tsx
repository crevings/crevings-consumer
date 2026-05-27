import React, { useState, useEffect, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
  useParams,
} from "react-router-dom";
import { Header } from "./components/Header";
import { OrderCard } from "./components/OrderCard";
import { RestaurantCard } from "./components/RestaurantCard";
import { AIChatBot } from "./components/AIChatBot";
import { WalletView } from "./components/WalletView";
import { RateOrderView } from "./components/RateOrderView";
import { ViewReviewDetailsView } from "./components/ViewReviewDetailsView";
import { OrderDetailView } from "./components/OrderDetailView";

import { PermissionManager } from "./components/PermissionManager";
import { ProfileView } from "./components/ProfileView";
import { EditProfileView } from "./components/EditProfileView";
import { CropProfileImageView } from "./components/CropProfileImageView";
import { SettingsView } from "./components/SettingsView";
import { HelpSupportView } from "./components/HelpSupportView";
import { NotificationsView } from "./components/NotificationsView";
import { RefundsView } from "./components/RefundsView";
import { AddressBookView } from "./components/AddressBookView";
import { SearchResultsView } from "./components/SearchResultsView";
import { VoiceSearchModal } from "./components/VoiceSearchModal";
import { ReferEarnView } from "./components/ReferEarnView";
import { DataSharingView } from "./components/DataSharingView";
import { PoliciesView } from "./components/PoliciesView";
import { LicensesView } from "./components/LicensesView";
import { GstDetailsView } from "./components/GstDetailsView";
import { AccessibilityView } from "./components/AccessibilityView";
import { LocationPickerView } from "./components/LocationPickerView copy";
import { FilterBottomSheet } from "./components/FilterBottomSheet";
import { SortBottomSheet } from "./components/SortBottomSheet";
import { ActiveOrderSnackbar } from "./components/ActiveOrderSnackbar";
import { CategoryDetailView } from "./components/CategoryDetailView";
import { GoldMembershipView } from "./components/GoldMembershipView";
import { HiddenRestaurantsView } from "./components/HiddenRestaurantsView";
import { FavoritesView } from "./components/FavoritesView";
import { ConfirmationBottomSheet } from "./components/ConfirmationBottomSheet";
import { AboutView } from "./components/AboutView";
import { PlatformFeedbackView } from "./components/PlatformFeedbackView";
import { RestaurantDetailView } from "./components/RestaurantDetailView";
import { RestaurantInfoView } from "./components/RestaurantInfoView";
import { CollectionDetailView } from "./components/CollectionDetailView";
import { CheckoutView } from "./components/CheckoutView";
import { OrderTrackingView } from "./components/OrderTrackingView";
import { OrdersView } from "./components/OrdersView";
import { SkeletonLoadingView } from "./components/SkeletonLoadingView";
import { ACTIVE_ORDERS, PAST_ORDERS, ALL_RESTAURANTS } from "./constants";
import {
  Order,
  UserProfile,
  Review,
  FilterOptions,
  Restaurant,
  CartItem,
  Brand,
} from "./types";
import {
  UtensilsCrossed,
  Flame,
  AlertCircle,
  X,
  EyeOff,
  Star,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Check,
  Heart,
  Home,
  Search,
  ShoppingBag,
  User,
  MapPin,
  Percent,
  Sparkles,
  Clock,
  Trophy,
  Trash2,
  Briefcase,
  Map,
  Instagram,
  Twitter,
  Facebook,
  Bike,
} from "lucide-react";

export interface SavedAddress {
  id: string;
  type: string;
  icon: any;
  address: string;
  isDefault: boolean;
}

// --- Static Data ---
const TRENDING_SPOTS = [
  {
    id: "ts-1",
    name: "Ophelia",
    offer: "Flat 20% Off",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=600&fit=crop&q=80",
    address: "Ashok Nagar",
    distance: "1.2 km",
  },
  {
    id: "ts-2",
    name: "Zenith",
    offer: "Cocktails 1+1",
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=600&fit=crop&q=80",
    address: "Indiranagar",
    distance: "2.5 km",
  },
  {
    id: "ts-3",
    name: "Bastian",
    offer: "15% OFF",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=600&fit=crop&q=80",
    address: "Koramangala",
    distance: "3.8 km",
  },
  {
    id: "ts-4",
    name: "The Olive",
    offer: "Free Dessert",
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=600&fit=crop&q=80",
    address: "Whitefield",
    distance: "5.1 km",
  },
  {
    id: "ts-5",
    name: "Skyline",
    offer: "Happy Hour",
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=400&h=600&fit=crop&q=80",
    address: "MG Road",
    distance: "0.8 km",
  },
];

const CURATED_COLLECTIONS = [
  {
    id: "col-0",
    title: "Trending Spots",
    subtitle: "Most popular right now",
    image:
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&h=600&fit=crop&q=80",
  },
  {
    id: "col-1",
    title: "New on Crevings",
    subtitle: "Explore latest spots",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop&q=80",
  },
  {
    id: "col-2",
    title: "Best in North Indian",
    subtitle: "Rich & authentic",
    image:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop&q=80",
  },
  {
    id: "col-3",
    title: "Best in Biryani",
    subtitle: "Aromatic delights",
    image:
      "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&h=600&fit=crop&q=80",
  },
  {
    id: "col-4",
    title: "Best Rooftops",
    subtitle: "Sky high vibes",
    image:
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&h=600&fit=crop&q=80",
  },
  {
    id: "col-5",
    title: "Romantic Spots",
    subtitle: "Candlelight dinners",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop&q=80",
  },
];

const MIND_CATEGORIES = [
  {
    name: "Burgers",
    image:
      "https://drive.google.com/thumbnail?id=1WaBcLRiGDVxQR1mtQVT2iYu9kfEmid88",
  },
  {
    name: "Pizzas",
    image:
      "https://static.vecteezy.com/system/resources/previews/024/589/239/large_2x/pizza-side-view-with-ai-generated-free-png.png",
  },
  {
    name: "Rolls",
    image:
      "https://static.vecteezy.com/system/resources/previews/025/268/596/large_2x/spring-roll-with-ai-generated-free-png.png",
  },
  {
    name: "Cakes",
    image:
      "https://static.vecteezy.com/system/resources/previews/044/771/684/non_2x/a-delicious-chocolate-cake-free-png.png",
  },
  {
    name: "Biryanis",
    image:
      "https://static.vecteezy.com/system/resources/previews/044/771/670/non_2x/a-bowl-of-delicious-biryani-with-chicken-pieces-free-png.png",
  },
  {
    name: "Sushi",
    image:
      "https://static.vecteezy.com/system/resources/previews/025/067/612/non_2x/sushi-with-ai-generated-free-png.png",
  },
  {
    name: "Salads",
    image:
      "https://static.vecteezy.com/system/resources/previews/046/407/647/non_2x/healthy-onion-tomato-cucumber-lettuce-salad-transparent-free-png.png",
  },
];

const FAMOUS_BRANDS: Brand[] = [
  {
    id: "brand-1",
    name: "McDonald's",
    logo: "https://tse4.mm.bing.net/th/id/OIP.jr4-V-Pj8FIE0CmCtncJMQHaFj?pid=Api&P=0&h=180",
    image:
      "https://tse4.mm.bing.net/th/id/OIP.jr4-V-Pj8FIE0CmCtncJMQHaFj?pid=Api&P=0&h=180",
  },
  {
    id: "brand-2",
    name: "Domino's Pizza",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Dominos_pizza_logo.svg/1200px-Dominos_pizza_logo.svg.png",
    image:
      "https://logospng.org/download/dominos-pizza/logo-dominos-pizza-horizontal-1024.png",
  },
  {
    id: "brand-3",
    name: "KFC",
    logo: "https://1000logos.net/wp-content/uploads/2019/07/KFC-logo-2018.jpg",
    image: "https://1000logos.net/wp-content/uploads/2019/07/KFC-logo-2018.jpg",
  },
  {
    id: "brand-4",
    name: "Subway",
    logo: "https://tse4.mm.bing.net/th/id/OIP.kxWgekjrecLnwdFjL0mKIQHaEK?pid=Api&P=0&h=180",
    image:
      "https://tse4.mm.bing.net/th/id/OIP.kxWgekjrecLnwdFjL0mKIQHaEK?pid=Api&P=0&h=180",
  },
  {
    id: "brand-5",
    name: "Starbucks",
    logo: "https://tse2.mm.bing.net/th/id/OIP.zrBkD9iNLTzGogL1E-M4xgHaHa?pid=Api&P=0&h=180",
    image:
      "https://tse2.mm.bing.net/th/id/OIP.zrBkD9iNLTzGogL1E-M4xgHaHa?pid=Api&P=0&h=180",
  },
  {
    id: "brand-6",
    name: "Burger King",
    logo: "https://3.bp.blogspot.com/-R2na0fkENZs/VyogmScFTeI/AAAAAAAAI8g/Jfvw7Q50lgso3WA11e4vj_xHw-qGmt0CQCLcB/s1600/Logo%2BBurger_King.png",
    image:
      "https://3.bp.blogspot.com/-R2na0fkENZs/VyogmScFTeI/AAAAAAAAI8g/Jfvw7Q50lgso3WA11e4vj_xHw-qGmt0CQCLcB/s1600/Logo%2BBurger_King.png",
  },
];

const HomeSkeleton: React.FC = () => {
  return (
    <div className="pb-8 space-y-10">
      {/* Spotlight Skeleton */}
      <div className="pl-4">
        <div className="h-6 w-40 bg-slate-100 rounded-lg animate-pulse mb-6" />
        <div className="flex gap-4 overflow-hidden pr-4">
          <div className="min-w-[300px] h-44 bg-slate-100 rounded-[1.5rem] animate-pulse" />
          <div className="min-w-[300px] h-44 bg-slate-100 rounded-[1.5rem] animate-pulse" />
        </div>
      </div>

      {/* Trending Skeleton */}
      <div className="px-4">
        <div className="h-6 w-36 bg-slate-100 rounded-lg animate-pulse mb-6" />
        <div className="flex gap-4 overflow-hidden">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="min-w-[280px] bg-white rounded-[1.5rem] p-3 flex items-center gap-4 border border-slate-100"
            >
              <div className="w-20 h-20 rounded-xl bg-slate-100 animate-pulse shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-slate-100 rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-slate-100 rounded animate-pulse" />
                <div className="h-3 w-1/3 bg-slate-100 rounded animate-pulse mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New on Crevings Skeleton */}
      <div className="px-4 mt-10">
        <div className="h-6 w-48 bg-slate-100 rounded-lg animate-pulse mb-2" />
        <div className="h-4 w-64 bg-slate-100 rounded-lg animate-pulse mb-4" />
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="min-w-[240px] h-[200px] rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col"
            >
              <div className="h-[130px] bg-slate-100 animate-pulse rounded-t-2xl" />
              <div className="p-3 space-y-2">
                <div className="h-4 w-2/3 bg-slate-100 rounded animate-pulse" />
                <div className="h-3 w-full bg-slate-100 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Skeleton */}
      <div className="px-4 text-center">
        <div className="h-6 w-48 bg-slate-100 rounded-lg animate-pulse mb-4 text-left" />
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-slate-100 animate-pulse" />
              <div className="h-3 w-12 bg-slate-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Restaurant List Skeleton */}
      <div className="px-4 space-y-8">
        <div className="flex justify-between items-center">
          <div className="h-6 w-44 bg-slate-100 rounded-lg animate-pulse" />
          <div className="h-6 w-16 bg-slate-100 rounded-full animate-pulse" />
        </div>
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden"
          >
            <div className="h-60 bg-slate-100 animate-pulse" />
            <div className="p-7 space-y-4">
              <div className="h-6 w-2/3 bg-slate-100 rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-slate-100 rounded animate-pulse" />
              <div className="flex gap-3 pt-2">
                <div className="h-6 w-20 bg-slate-100 rounded-xl animate-pulse" />
                <div className="h-6 w-24 bg-slate-100 rounded-xl animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const HomeFeed: React.FC<{
  onCategoryClick: (name: string) => void;
  hiddenIds: string[];
  onHide: (id: string | number) => void;
  onFavourite: (id: string | number) => void;
  onRestaurantClick: (restaurant: Restaurant) => void;
  onItemAdd: (restaurant: Restaurant, itemId: string) => void;
  onCollectionClick: (collection: any) => void;
}> = ({
  onCategoryClick,
  hiddenIds,
  onHide,
  onFavourite,
  onRestaurantClick,
  onItemAdd,
  onCollectionClick,
}) => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [activeFilters, setActiveFilters] = useState<FilterOptions>({
      maxTime: 60,
      maxDistance: 15,
      minRating: 1,
      dietary: "all",
      offersOnly: false,
      sortBy: "default",
      priceRange: null,
    });
    const [sortMode, setSortMode] = useState<string>("default");
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

    useEffect(() => {
      const timer = setTimeout(() => setIsLoading(false), 1500);
      return () => clearTimeout(timer);
    }, []);

    const visibleRestaurants = useMemo(() => {
      let list = ALL_RESTAURANTS.filter((r) => !hiddenIds.includes(String(r.id)));

      if (selectedBrand) {
        list = list.filter((r) =>
          r.name.toLowerCase().includes(selectedBrand.toLowerCase()),
        );
      }

      list = list.filter((r) => {
        const matchRating = r.rating >= activeFilters.minRating;
        const matchTime = r.timeValue <= activeFilters.maxTime;
        const matchDistance = r.distanceValue <= activeFilters.maxDistance;
        const matchOffers = !activeFilters.offersOnly || !!r.offer;
        const matchDietary =
          activeFilters.dietary === "all" ||
          r.dietary.includes(activeFilters.dietary);

        let matchPrice = true;
        if (activeFilters.priceRange) {
          const pricePerPerson = parseInt(r.price.replace(/\D/g, "")) / 2;
          if (activeFilters.priceRange === "under49") {
            matchPrice = pricePerPerson <= 49;
          } else if (activeFilters.priceRange === "49to99") {
            matchPrice = pricePerPerson > 49 && pricePerPerson <= 99;
          }
        }

        return (
          matchRating &&
          matchTime &&
          matchDistance &&
          matchOffers &&
          matchDietary &&
          matchPrice
        );
      });
      // Apply sortMode
      const currentSort = activeFilters.sortBy || sortMode;
      if (currentSort === "ratingHigh" || currentSort === "rating")
        list = [...list].sort((a, b) => b.rating - a.rating);
      else if (currentSort === "ratingLow")
        list = [...list].sort((a, b) => a.rating - b.rating);
      else if (currentSort === "time")
        list = [...list].sort((a, b) => a.timeValue - b.timeValue);
      else if (currentSort === "distanceNear" || currentSort === "distance")
        list = [...list].sort((a, b) => a.distanceValue - b.distanceValue);
      else if (currentSort === "distanceFar")
        list = [...list].sort((a, b) => b.distanceValue - a.distanceValue);
      else if (currentSort === "priceLow")
        list = [...list].sort(
          (a, b) =>
            parseInt(a.price.replace(/\D/g, "")) -
            parseInt(b.price.replace(/\D/g, "")),
        );
      else if (currentSort === "priceHigh")
        list = [...list].sort(
          (a, b) =>
            parseInt(b.price.replace(/\D/g, "")) -
            parseInt(a.price.replace(/\D/g, "")),
        );

      return list;
    }, [hiddenIds, activeFilters, sortMode, selectedBrand]);

    const sortLabel = useMemo(() => {
      switch (sortMode) {
        case "rating":
          return "Rating";
        case "time":
          return "Time";
        case "distance":
          return "Distance";
        case "priceLow":
          return "Price: Low";
        case "priceHigh":
          return "Price: High";
        default:
          return "Sort by";
      }
    }, [sortMode]);

    if (isLoading) {
      return <HomeSkeleton />;
    }

    const firstFive = visibleRestaurants.slice(0, 5);
    const remaining = visibleRestaurants.slice(5);

    return (
      <div className="pb-8 animate-fadeInUp">
        <div className="mb-8 pl-4">
          <div className="flex gap-4 overflow-x-auto no-scrollbar pr-4">
            <div className="w-[340px] h-[92px] bg-slate-900 rounded-[24px] p-4 text-white relative overflow-hidden shrink-0">
              <div className="relative z-10 h-full flex justify-between items-center">
                <div>
                  <div className="inline-block bg-yellow-400 text-slate-900 text-[9px] font-bold px-2 py-0.5 rounded mb-1">
                    LIMITED TIME
                  </div>
                  <h3 className="text-lg font-bold leading-tight mb-0.5">
                    50% OFF
                  </h3>
                  <p className="text-slate-300 text-[10px] font-medium">
                    On your first 3 orders
                  </p>
                </div>
                <button className="bg-white text-slate-900 px-4 py-2 rounded-[12px] text-xs font-bold active:scale-95 transition-transform">
                  Order Now
                </button>
              </div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500 rounded-full blur-[50px] opacity-40"></div>
            </div>
            <div className="w-[340px] h-[92px] bg-blue-600 rounded-[24px] p-4 text-white relative overflow-hidden shrink-0">
              <div className="relative z-10 h-full flex justify-between items-center">
                <div>
                  <div className="inline-block bg-white/20 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded mb-1">
                    HEALTHY EATS
                  </div>
                  <h3 className="text-lg font-bold leading-tight mb-0.5">
                    Fresh Salads
                  </h3>
                  <p className="text-blue-100 text-[10px] font-medium">
                    Start at ₹149 only
                  </p>
                </div>
                <button className="bg-white text-blue-700 px-4 py-2 rounded-[12px] text-xs font-bold active:scale-95 transition-transform">
                  Explore Menu
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Curated Collections Section */}
        <div className="mb-10 px-4">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Curated Collections
            </h3>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4">
            {CURATED_COLLECTIONS.map((collection) => (
              <div
                key={collection.id}
                onClick={() => onCollectionClick(collection)}
                className="min-w-[280px] h-[160px] relative rounded-[20px] overflow-hidden shrink-0 active:scale-95 transition-transform cursor-pointer group shadow-sm"
              >
                <img
                  src={collection.image}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  alt={collection.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                <div className="absolute bottom-4 left-4 right-4">
                  <h4 className="text-white font-bold text-[18px] leading-tight mb-1">
                    {collection.title}
                  </h4>
                  <div className="flex items-center gap-1 text-white/80 text-[13px] font-medium">
                    {collection.subtitle}
                    <span className="text-[14px]">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-10 px-4">
          <h3 className="text-base font-bold text-slate-900 mb-4 tracking-tight">
            Explore Categories
          </h3>
          <div className="grid grid-cols-5  md:grid-cols-3 lg:grid-cols-4  gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4">
            {MIND_CATEGORIES.map((cat, i) => (
              <div
                key={i}
                onClick={() => onCategoryClick(cat.name)}
                className={`flex flex-col items-center gap-2 shrink-0 group cursor-pointer active:scale-95 transition-transform `}
              >
                <div className="w-16 h-16  rounded-full  flex items-center justify-center overflow-hidden ">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs font-bold text-slate-600 transition-colors group-hover:text-slate-900">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Famous Brands Section */}
        <div className="mb-10 px-4">
          <h3 className="text-base font-bold text-slate-900 mb-4 tracking-tight">
            Top Brands for You
          </h3>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4">
            {FAMOUS_BRANDS.map((brand) => (
              <div
                key={brand.id}
                onClick={() =>
                  setSelectedBrand(
                    selectedBrand === brand.name ? null : brand.name,
                  )
                }
                className="flex flex-col items-center gap-2 shrink-0 group cursor-pointer active:scale-95 transition-transform"
              >
                <div
                  className={`w-14 h-14 rounded-full  flex items-center justify-center overflow-hidden  transition-all ${selectedBrand === brand.name ? "border-blue-500 ring-4 ring-blue-100" : "border-slate-100/50"}`}
                >
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="w-full h-full object-cover transition-transform duration-500 "
                  />
                </div>
                <span
                  className={`text-xs font-bold transition-colors ${selectedBrand === brand.name ? "text-blue-600" : "text-slate-600 group-hover:text-slate-900"}`}
                >
                  {brand.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 mb-6">
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 items-center">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-sm font-medium text-slate-700 shrink-0 active:bg-slate-50"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filter
            </button>
            {/* <button
              onClick={() => setIsSortOpen(true)}
              className="flex items-center px-4 py-2 border rounded-full transition-all shrink-0 active:scale-95 shadow-sm bg-white border-slate-200 text-slate-700 hover:border-slate-300"
            >
              <span className="text-sm font-medium">Sort By</span>
              <ChevronDown className="w-4 h-4 ml-1 text-slate-500" />
            </button> */}
            {/* add for free delivery */}
            <button
              onClick={() =>
                setActiveFilters((prev) => ({
                  ...prev,
                  offersOnly: !prev.offersOnly,
                }))
              }
              className={`flex items-center px-4 py-2 border rounded-full transition-all shrink-0 active:scale-95 shadow-sm ${activeFilters.offersOnly ? "bg-green-50 border-green-500 text-green-700" : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"}`}
            >
              <Bike className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">Free Delivery</span>
            </button>
            <button
              onClick={() =>
                setActiveFilters((prev) => ({
                  ...prev,
                  priceRange: prev.priceRange === "under49" ? null : "under49",
                }))
              }
              className={`flex items-center px-4 py-2 border rounded-full transition-all shrink-0 active:scale-95 shadow-sm ${activeFilters.priceRange === "under49" ? "bg-green-50 border-green-500 text-green-700" : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"}`}
            >
              <span className="text-sm font-medium">₹49 & under</span>
            </button>
            <button
              onClick={() =>
                setActiveFilters((prev) => ({
                  ...prev,
                  priceRange: prev.priceRange === "49to99" ? null : "49to99",
                }))
              }
              className={`flex items-center px-4 py-2 border rounded-full transition-all shrink-0 active:scale-95 shadow-sm ${activeFilters.priceRange === "49to99" ? "bg-green-50 border-green-500 text-green-700" : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"}`}
            >
              <span className="text-sm font-medium">₹49 - ₹99</span>
            </button>
            <button
              onClick={() =>
                setActiveFilters((prev) => ({
                  ...prev,
                  dietary: prev.dietary === "veg" ? "all" : "veg",
                }))
              }
              className={`flex items-center px-4 py-2 border rounded-full transition-all shrink-0 active:scale-95 shadow-sm ${activeFilters.dietary === "veg" ? "bg-green-50 border-green-500 text-green-700" : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"}`}
            >
              <div className="w-3.5 h-3.5 border border-green-600 flex items-center justify-center rounded-sm bg-white mr-2">
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />
              </div>
              <span className="text-sm font-bold">Veg</span>
            </button>
            <button
              onClick={() =>
                setActiveFilters((prev) => ({
                  ...prev,
                  dietary: prev.dietary === "non-veg" ? "all" : "non-veg",
                }))
              }
              className={`flex items-center px-4 py-2 border rounded-full transition-all shrink-0 active:scale-95 shadow-sm ${activeFilters.dietary === "non-veg" ? "bg-green-50 border-green-500 text-green-700" : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"}`}
            >
              <div className="w-3.5 h-3.5 border border-red-600 flex items-center justify-center rounded-sm bg-white mr-2">
                <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[5px] border-b-red-600" />
              </div>
              <span className="text-sm font-bold">Non Veg</span>
            </button>
            <button
              onClick={() =>
                setActiveFilters((prev) => ({
                  ...prev,
                  dietary: prev.dietary === "egg" ? "all" : "egg",
                }))
              }
              className={`flex items-center px-4 py-2 border rounded-full transition-all shrink-0 active:scale-95 shadow-sm ${activeFilters.dietary === "egg" ? "bg-green-50 border-green-500 text-green-700" : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"}`}
            >
              <div className="w-3.5 h-3.5 border border-yellow-500 flex items-center justify-center rounded-sm bg-white mr-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
              </div>
              <span className="text-sm font-bold">Egg</span>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isFilterOpen && (
            <FilterBottomSheet
              onClose={() => setIsFilterOpen(false)}
              onApply={(f) => {
                setActiveFilters(f);
                setIsFilterOpen(false);
              }}
              initialFilters={activeFilters}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {isSortOpen && (
            <SortBottomSheet
              onClose={() => setIsSortOpen(false)}
              onSelect={(m) => {
                setSortMode(m);
                setIsSortOpen(false);
              }}
              currentSort={sortMode}
            />
          )}
        </AnimatePresence>

        <div className="px-4 mb-10">
          <div className="mb-5 px-1">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              Explore all restaurants
            </h2>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              {visibleRestaurants.length} restaurants available
            </p>
          </div>
          {visibleRestaurants.length > 0 ? (
            <>
              {firstFive.map((rest) => (
                <RestaurantCard
                  key={rest.id}
                  {...rest}
                  onHide={onHide}
                  onFavourite={onFavourite}
                  onClick={() => onRestaurantClick(rest)}
                  onItemAdd={(itemId) => onItemAdd(rest, itemId)}
                />
              ))}
              {remaining.map((rest) => (
                <RestaurantCard
                  key={rest.id}
                  {...rest}
                  onHide={onHide}
                  onFavourite={onFavourite}
                  onClick={() => onRestaurantClick(rest)}
                  onItemAdd={(itemId) => onItemAdd(rest, itemId)}
                />
              ))}
              <div className="mt-8 text-left">
                <p className="text-sm font-medium text-slate-400">
                  built with 💖
                </p>
              </div>
            </>
          ) : (
            <div className="py-20 flex flex-col items-center text-center opacity-40">
              <UtensilsCrossed className="w-12 h-12 mb-4" />
              <p className="font-bold text-sm">
                No restaurants match your filters
              </p>
              <button
                onClick={() => {
                  setActiveFilters({
                    maxTime: 60,
                    maxDistance: 15,
                    minRating: 1,
                    dietary: "all",
                    offersOnly: false,
                    sortBy: "default",
                    priceRange: null,
                  });
                  setSortMode("default");
                  setSelectedBrand(null);
                }}
                className="mt-4 text-blue-600 text-xs font-black uppercase tracking-widest"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentView = useMemo(() => {
    const path = location.pathname.substring(1);
    if (!path) return "home";
    if (path.startsWith("restaurant/")) return "restaurant-detail";
    if (path.startsWith("collection/")) return "collection-detail";
    if (path.startsWith("category/")) return "category-detail";
    return path;
  }, [location]);

  const setCurrentView = (view: string) => {
    if (view === "home") navigate("/");
    else navigate(`/${view}`);
  };

  const [isLoadingView, setIsLoadingView] = useState(false);
  const [loadingViewType, setLoadingViewType] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<any | null>(
    null,
  );
  const [autoAddItem, setAutoAddItem] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);

  const [isVoiceSearchOpen, setIsVoiceSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hiddenRestaurantIds, setHiddenRestaurantIds] = useState<string[]>([]);
  const [favouriteRestaurantIds, setFavouriteRestaurantIds] = useState<
    string[]
  >([]);
  const [confirmModal, setConfirmModal] = useState<{
    type: "favourite" | "hide";
    restaurantId: string;
  } | null>(null);
  const [currentLocation, setCurrentLocation] = useState({
    type: "Home",
    address:
      "House No 37-C, 2nd Floor, Janta Flats, Block A, Phase 3, Ashok Vihar, Delhi",
  });

  const [addresses, setAddresses] = useState<SavedAddress[]>([
    {
      id: "1",
      type: "Home",
      icon: Home,
      address:
        "House No 37-C, 2nd Floor, Janta Flats, Block A, Phase 3, Ashok Vihar, Delhi",
      isDefault: true,
    },
    {
      id: "2",
      type: "Work",
      icon: Briefcase,
      address:
        "Tech Park, Building 4, 5th Floor, Sector 62, Noida, Uttar Pradesh",
      isDefault: false,
    },
    {
      id: "3",
      type: "Other",
      icon: Map,
      address:
        "12/4, Riverside Apartments, Near Metro Station, Mayur Vihar, Delhi",
      isDefault: false,
    },
    {
      id: "4",
      type: "Other",
      icon: MapPin,
      address: "Motihari, Bihar",
      isDefault: false,
    },
  ]);

  const openRestaurantDetail = (rest: Restaurant, itemId?: string) => {
    setSelectedRestaurant(rest);
    if (itemId) setAutoAddItem(itemId);
    setIsLoadingRestaurant(true);
    navigate(`/restaurant/${rest.id}`);
    setTimeout(() => setIsLoadingRestaurant(false), 2500);
  };

  const openCheckout = (newCart: any[], items: any[]) => {
    setCart(newCart);
    setMenuItems(items);
    setIsLoadingCheckout(true);
    navigate("/checkout");
    setTimeout(() => setIsLoadingCheckout(false), 2500);
  };

  const handleItemAdd = (rest: Restaurant, itemId: string) => {
    openRestaurantDetail(rest, itemId);
  };

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

  // Scroll state
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isNavVisible, setIsNavVisible] = useState(true);

  const [isPullLoading, setIsPullLoading] = useState(false);
  const [isLoadingRestaurant, setIsLoadingRestaurant] = useState(false);
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const pullStartY = React.useRef(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentView]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      pullStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (pullStartY.current > 0) {
      const y = e.touches[0].clientY;
      const distance = y - pullStartY.current;
      if (distance > 0) {
        setPullDistance(Math.min(distance * 0.5, 100));
      }
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance > 60) {
      setIsPullLoading(true);
      setTimeout(() => setIsPullLoading(false), 1500);
    }
    setPullDistance(0);
    pullStartY.current = 0;
  };

  useEffect(() => {
    const handleNavigate = (e: any) => setCurrentView(e.detail);
    window.addEventListener("navigate", handleNavigate);
    return () => window.removeEventListener("navigate", handleNavigate);
  }, []);

  useEffect(() => {
    if (activeOrder && activeOrder.type === "Delivery") {
      const timer = setTimeout(() => {
        setActiveOrder(null);
      }, 60000); // 1 minute
      return () => clearTimeout(timer);
    }
  }, [activeOrder]);

  useEffect(() => {
    let accumulatedScroll = 0;
    let prevScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // Back to top button logic (show after 2 screen heights)
      if (currentScrollY > windowHeight * 2) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }

      // Bottom nav visibility logic
      const diff = currentScrollY - prevScrollY;
      if (
        (diff > 0 && accumulatedScroll < 0) ||
        (diff < 0 && accumulatedScroll > 0)
      ) {
        accumulatedScroll = 0;
      }
      accumulatedScroll += diff;

      if (currentScrollY < 60) {
        setIsNavVisible(true);
      } else if (accumulatedScroll > 60) {
        setIsNavVisible(false);
        accumulatedScroll = 0;
      } else if (accumulatedScroll < -60) {
        setIsNavVisible(true);
        accumulatedScroll = 0;
      }

      prevScrollY = currentScrollY;
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

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

  const executeConfirmAction = () => {
    if (!confirmModal) return;
    if (confirmModal.type === "hide") {
      setHiddenRestaurantIds((prev) => [...prev, confirmModal.restaurantId]);
      if (
        currentView === "restaurant-detail" &&
        selectedRestaurant?.id.toString() === confirmModal.restaurantId
      ) {
        setCurrentView("home");
      }
    } else {
      setFavouriteRestaurantIds((prev) =>
        Array.from(new Set([...prev, confirmModal.restaurantId])),
      );
    }
    setConfirmModal(null);
  };

  const handleReorder = (order: Order) => {
    const items = order.items.split(",").map((i) => i.trim());
    const newCart: { [key: string]: number } = {};
    const newMenuItems: any[] = [];

    items.forEach((itemStr, index) => {
      const match = itemStr.match(/^(\d+)x\s+(.+)$/);
      if (match) {
        const qty = parseInt(match[1], 10);
        const name = match[2];
        const id = `reorder-${index}`;
        newCart[id] = qty;
        newMenuItems.push({
          id,
          name,
          price: Math.round(order.price / items.length),
          rating: 4.5,
          ratingCount: "100+",
          category: "Reorder",
          isVeg: true,
          image:
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop",
          description: "Reordered item",
        });
      }
    });

    setCart(newCart);
    setMenuItems(newMenuItems);

    const rest = ALL_RESTAURANTS.find((r) => r.name === order.restaurantName);
    if (rest) {
      setSelectedRestaurant(rest);
    }

    setCurrentView("checkout");
  };

  const renderContent = () => {
    switch (currentView) {
      case "home":
        if (currentLocation.address.toLowerCase().includes("motihari")) {
          return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center animate-fadeInUp">
              <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center mb-8 shadow-inner">
                <MapPin className="w-14 h-14 text-blue-500" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">
                We're not here yet!
              </h2>
              <p className="text-slate-500 text-base max-w-[300px] leading-relaxed mb-10">
                We are currently expanding our services and hope to serve you in{" "}
                <span className="font-bold text-slate-700">Motihari</span> soon.
                Stay tuned!
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
              setCurrentView("category-detail");
            }}
            hiddenIds={hiddenRestaurantIds}
            onHide={handleHideRestaurant}
            onFavourite={handleFavouriteRestaurant}
            onRestaurantClick={(rest) => {
              setIsLoadingView(true);
              setLoadingViewType("restaurant");
              setTimeout(() => {
                setSelectedRestaurant(rest);
                setCurrentView("restaurant-detail");
                setIsLoadingView(false);
              }, 2500);
            }}
            onItemAdd={handleItemAdd}
            onCollectionClick={(collection) => {
              setSelectedCollection(collection);
              setCurrentView("collection-detail");
            }}
          />
        );
      case "restaurant-detail":
        return selectedRestaurant ? (
          <RestaurantDetailView
            restaurant={selectedRestaurant}
            onBack={() => setCurrentView("home")}
            onCheckout={(newCart, items) => {
              setIsLoadingView(true);
              setLoadingViewType("checkout");
              setTimeout(() => {
                setCart(newCart);
                setMenuItems(items);
                setCurrentView("checkout");
                setIsLoadingView(false);
              }, 2500);
            }}
            onHide={() => handleHideRestaurant(selectedRestaurant.id)}
            onUnhide={() => handleUnhideRestaurant(selectedRestaurant.id)}
            onFavourite={() => handleFavouriteRestaurant(selectedRestaurant.id)}
            onRemoveFavourite={() =>
              handleRemoveFavourite(String(selectedRestaurant.id))
            }
            isFavourite={favouriteRestaurantIds.includes(
              String(selectedRestaurant.id),
            )}
            isHidden={hiddenRestaurantIds.includes(
              String(selectedRestaurant.id),
            )}
            onInfoClick={() => setCurrentView("restaurant-info")}
            autoAddItem={autoAddItem}
          />
        ) : null;
      case "restaurant-info":
        return selectedRestaurant ? (
          <RestaurantInfoView
            restaurant={selectedRestaurant}
            onBack={() => setCurrentView("restaurant-detail")}
          />
        ) : null;
      case "collection-detail":
        return selectedCollection ? (
          <CollectionDetailView
            collection={selectedCollection}
            restaurants={ALL_RESTAURANTS}
            hiddenIds={hiddenRestaurantIds}
            favouriteIds={favouriteRestaurantIds}
            onBack={() => setCurrentView("home")}
            onHide={handleHideRestaurant}
            onFavourite={handleFavouriteRestaurant}
            onRestaurantClick={(rest) => {
              setSelectedRestaurant(rest);
              setCurrentView("restaurant-detail");
            }}
            onItemAdd={handleItemAdd}
          />
        ) : null;
      case "checkout":
        return (
          <CheckoutView
            cart={cart}
            menuItems={menuItems}
            currentLocation={currentLocation}
            onBack={() => setCurrentView("restaurant-detail")}
            onReset={() => {
              setCart([]);
              setCurrentView("restaurant-detail");
            }}
            onProceed={(orderType, paymentMethod, finalCart) => {
              const itemsStr = finalCart
                .map((cartItem) => {
                  return `${cartItem.quantity}x ${cartItem.item.name}`;
                })
                .filter(Boolean)
                .join(", ");

              const newOrder: Order = {
                id: `ORD${Math.floor(Math.random() * 100000)}`,
                restaurantName: selectedRestaurant?.name || "Restaurant",
                location: selectedRestaurant?.address || "Location",
                rating: selectedRestaurant?.rating || 4.0,
                items: itemsStr,
                orderDate: new Date().toLocaleString(),
                type: orderType === "delivery" ? "Delivery" : "Takeaway",
                status: "Active",
                timeEstimate: "1 min",
                paymentMethod: paymentMethod,
              };
              setActiveOrder(newOrder);
              setCart({});
              setCurrentView("order-tracking");
            }}
            onChangeAddress={() => navigate("/location")}
          />
        );
      case "order-tracking":
        if (!activeOrder) {
          setTimeout(() => setCurrentView("home"), 0);
          return null;
        }
        return (
          <OrderTrackingView
            order={activeOrder}
            onBack={() => setCurrentView("home")}
            onCancelOrder={() => {
              setActiveOrder(null);
              setCurrentView("home");
            }}
            onOrderComplete={() => {
              setSelectedOrder(activeOrder);
              setActiveOrder(null);
              setCurrentView("rate-order");
            }}
          />
        );
      case "orders":
        return (
          <OrdersView
            reviews={reviews}
            onRateClick={(order) => {
              setSelectedOrder(order);
              setCurrentView("rate-order");
            }}
            onViewReviewClick={(order) => {
              setSelectedOrder(order);
              setCurrentView("view-review");
            }}
            onReorderClick={handleReorder}
            onBack={() => setCurrentView("home")}
          />
        );
      case "profile":
        return (
          <ProfileView
            userProfile={userProfile}
            onUpdateProfileImage={(img) =>
              setUserProfile((prev) => ({ ...prev, image: img }))
            }
            onEditProfileClick={() => setCurrentView("edit-profile")}
            onWalletClick={() => setCurrentView("wallet")}
            onOrdersClick={() => setCurrentView("orders")}
            onLogout={() => { }}
            onSettingsClick={() => setCurrentView("settings")}
            onHelpClick={() => setCurrentView("help")}
            onNotificationsClick={() => setCurrentView("notifications")}
            onRefundsClick={() => setCurrentView("refunds")}
            onReferClick={() => setCurrentView("refer")}
            onPoliciesClick={() => setCurrentView("policies")}
            onLicensesClick={() => setCurrentView("licenses")}
            onGstClick={() => setCurrentView("gst")}
            onAccessibilityClick={() => setCurrentView("accessibility")}
            onAddressBookClick={() => setCurrentView("address-book")}
            onManageMembershipClick={() => setCurrentView("gold")}
            onAboutClick={() => setCurrentView("about")}
            onFeedbackClick={() => setCurrentView("platform-feedback")}
            onBack={() => setCurrentView("home")}
          />
        );
      case "wallet":
        return <WalletView onBack={() => setCurrentView("profile")} />;
      case "rate-order":
        return selectedOrder ? (
          <RateOrderView
            order={selectedOrder}
            onBack={() => setCurrentView("orders")}
            onSubmit={(review) => {
              setReviews((prev) => ({ ...prev, [selectedOrder.id]: review }));
              setCurrentView("orders");
            }}
          />
        ) : null;
      case "view-review":
        return selectedOrder && reviews[selectedOrder.id] ? (
          <ViewReviewDetailsView
            order={selectedOrder}
            review={reviews[selectedOrder.id]}
            onBack={() => setCurrentView("orders")}
          />
        ) : null;
      case "order-detail":
        return selectedOrder ? (
          <OrderDetailView
            order={selectedOrder}
            onBack={() => setCurrentView("orders")}
          />
        ) : null;
      case "edit-profile":
        return (
          <EditProfileView
            initialData={userProfile}
            onBack={() => setCurrentView("profile")}
            onSave={(data) => {
              setUserProfile(data);
              setCurrentView("profile");
            }}
            onSelectRawImage={(img) => {
              setRawProfileImage(img);
              setCurrentView("crop-image");
            }}
          />
        );
      case "crop-image":
        return rawProfileImage ? (
          <CropProfileImageView
            imageUri={rawProfileImage}
            onBack={() => setCurrentView("edit-profile")}
            onSave={(cropped) => {
              setUserProfile((prev) => ({ ...prev, image: cropped }));
              setCurrentView("profile");
              setRawProfileImage(null);
            }}
          />
        ) : null;
      case "settings":
        return (
          <SettingsView
            onBack={() => setCurrentView("profile")}
            onDataSharingClick={() => setCurrentView("data-sharing")}
          />
        );
      case "help":
        return <HelpSupportView onBack={() => setCurrentView("profile")} />;
      case "notifications":
        return <NotificationsView onBack={() => setCurrentView("profile")} />;
      case "refunds":
        return <RefundsView onBack={() => setCurrentView("profile")} />;
      case "address-book":
        return <AddressBookView onBack={() => setCurrentView("profile")} />;
      case "search-results":
        return (
          <SearchResultsView
            onBack={() => setCurrentView("home")}
            initialQuery={searchQuery}
            onRestaurantClick={(rest) => {
              setSelectedRestaurant(rest);
              setCurrentView("restaurant-detail");
            }}
            onItemAdd={handleItemAdd}
            onMicClick={() => setIsVoiceSearchOpen(true)}
          />
        );
      case "refer":
        return <ReferEarnView onBack={() => setCurrentView("profile")} />;
      case "data-sharing":
        return <DataSharingView onBack={() => setCurrentView("settings")} />;
      case "policies":
        return <PoliciesView onBack={() => setCurrentView("profile")} />;
      case "licenses":
        return <LicensesView onBack={() => setCurrentView("profile")} />;
      case "gst":
        return <GstDetailsView onBack={() => setCurrentView("profile")} />;
      case "accessibility":
        return <AccessibilityView onBack={() => setCurrentView("profile")} />;
      case "category-detail":
        return selectedCategory ? (
          <CategoryDetailView
            category={selectedCategory}
            onBack={() => setCurrentView("home")}
            onRestaurantClick={(rest) => {
              setSelectedRestaurant(rest);
              setCurrentView("restaurant-detail");
            }}
            onItemAdd={handleItemAdd}
          />
        ) : null;
      case "gold":
        return <GoldMembershipView onClose={() => setCurrentView("profile")} />;
      case "hidden-restaurants":
        return (
          <HiddenRestaurantsView
            hiddenRestaurants={ALL_RESTAURANTS.filter((r) =>
              hiddenRestaurantIds.includes(String(r.id)),
            )}
            onUnhide={handleUnhideRestaurant}
            onBack={() => setCurrentView("profile")}
          />
        );
      case "favourites":
        return (
          <FavoritesView
            favorites={ALL_RESTAURANTS.filter((r) =>
              favouriteRestaurantIds.includes(String(r.id)),
            )}
            onRemove={handleRemoveFavourite}
            onBack={() => setCurrentView("profile")}
          />
        );
      case "about":
        return <AboutView onBack={() => setCurrentView("profile")} />;
      case "platform-feedback":
        return (
          <PlatformFeedbackView onBack={() => setCurrentView("profile")} />
        );
      case "local":
        return (
          <div className="flex items-center justify-center h-[calc(100vh-140px)] text-slate-400 font-medium">
            Local coming soon...
          </div>
        );
      case "dine-in":
        return (
          <div className="flex items-center justify-center h-[calc(100vh-140px)] text-slate-400 font-medium">
            Dine In coming soon...
          </div>
        );
      case "deals":
        return (
          <div className="flex items-center justify-center h-[calc(100vh-140px)] text-slate-400 font-medium">
            Deals coming soon...
          </div>
        );
      default:
        return null;
    }
  };

  const showHeader = ["home", "dine-in", "local", "deals"].includes(
    currentView,
  );

  return (
    <div
      className="min-h-screen bg-white pb-16"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {showHeader && (
        <Header
          currentLocation={currentLocation}
          hideSearch={currentLocation.address
            .toLowerCase()
            .includes("motihari")}
          onSearchClick={() => setCurrentView("search-results")}
          onMicClick={() => setIsVoiceSearchOpen(true)}
          onLocationClick={() => navigate("/location")}
          onProfileClick={() => setCurrentView("profile")}
        />
      )}
      <main>
        {isPullLoading && (
          <div className="flex justify-center py-4">
            <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {isLoadingView ? (
          <div className="relative">
            {/* ... skeleton loaders (collapsed for brevity) ... */}
            <HomeSkeleton />
          </div>
        ) : isPullLoading ? (
          <div className="relative">
            <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
              <div className="w-12 h-12 border-4 border-[#00bd6f]/30 border-t-[#00bd6f] rounded-full animate-spin shadow-lg"></div>
            </div>
            <HomeSkeleton />
          </div>
        ) : (
          <Routes>
            <Route
              path="/"
              element={
                currentLocation.address.toLowerCase().includes("motihari") ? (
                  <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center animate-fadeInUp">
                    <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center mb-8 shadow-inner">
                      <MapPin className="w-14 h-14 text-blue-500" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">
                      We're not here yet!
                    </h2>
                    <p className="text-slate-500 text-base max-w-[300px] leading-relaxed mb-10">
                      We are currently expanding our services and hope to serve
                      you in{" "}
                      <span className="font-bold text-slate-700">Motihari</span>{" "}
                      soon. Stay tuned!
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
                ) : (
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
                )
              }
            />

            <Route
              path="/restaurant/:id"
              element={
                selectedRestaurant ? (
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
                    onHide={() => handleHideRestaurant(selectedRestaurant.id)}
                    onUnhide={() =>
                      handleUnhideRestaurant(selectedRestaurant.id)
                    }
                    onFavourite={() =>
                      handleFavouriteRestaurant(selectedRestaurant.id)
                    }
                    onRemoveFavourite={() =>
                      handleRemoveFavourite(String(selectedRestaurant.id))
                    }
                    isFavourite={favouriteRestaurantIds.includes(
                      String(selectedRestaurant.id),
                    )}
                    isHidden={hiddenRestaurantIds.includes(
                      String(selectedRestaurant.id),
                    )}
                    onInfoClick={() =>
                      navigate(`/restaurant/${selectedRestaurant.id}/info`)
                    }
                    autoAddItem={autoAddItem}
                  />
                ) : (
                  <Navigate to="/" />
                )
              }
            />

            <Route
              path="/restaurant/:id/info"
              element={
                selectedRestaurant ? (
                  <RestaurantInfoView
                    restaurant={selectedRestaurant}
                    onBack={() => navigate(-1)}
                  />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/checkout"
              element={
                <CheckoutView
                  cart={cart}
                  menuItems={menuItems}
                  currentLocation={currentLocation}
                  onBack={() => navigate(-1)}
                  onReset={() => {
                    setCart([]);
                    navigate("/");
                  }}
                  onProceed={(orderType, paymentMethod, finalCart) => {
                    const itemsStr = finalCart
                      .map((c) => `${c.quantity}x ${c.item.name}`)
                      .join(", ");
                    const newOrder: Order = {
                      id: `ORD${Math.floor(Math.random() * 100000)}`,
                      restaurantName: selectedRestaurant?.name || "Restaurant",
                      location: selectedRestaurant?.address || "Location",
                      rating: selectedRestaurant?.rating || 4.0,
                      items: itemsStr,
                      orderDate: new Date().toLocaleString(),
                      type: orderType === "delivery" ? "Delivery" : "Takeaway",
                      status: "Active",
                      timeEstimate: "1 min",
                      paymentMethod: paymentMethod,
                    };
                    setActiveOrder(newOrder);
                    setCart({});
                    navigate("/order-tracking");
                  }}
                  onChangeAddress={() => navigate("/location")}
                />
              }
            />

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
                  onUpdateProfileImage={(img) =>
                    setUserProfile((prev) => ({ ...prev, image: img }))
                  }
                  onEditProfileClick={() => navigate("/edit-profile")}
                  onWalletClick={() => navigate("/wallet")}
                  onOrdersClick={() => navigate("/orders")}
                  onLogout={() => { }}
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
            <Route
              path="/wallet"
              element={<WalletView onBack={() => navigate(-1)} />}
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
              path="/settings"
              element={
                <SettingsView
                  onBack={() => navigate(-1)}
                  onDataSharingClick={() => navigate("/data-sharing")}
                />
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
                    restaurants={ALL_RESTAURANTS}
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

            {/* Fallback routes */}
            <Route
              path="/help"
              element={<HelpSupportView onBack={() => navigate(-1)} />}
            />
            <Route
              path="/notifications"
              element={<NotificationsView onBack={() => navigate(-1)} />}
            />
            <Route
              path="/refunds"
              element={<RefundsView onBack={() => navigate(-1)} />}
            />
            <Route
              path="/address-book"
              element={<AddressBookView onBack={() => navigate(-1)} />}
            />
            <Route
              path="/refer"
              element={<ReferEarnView onBack={() => navigate(-1)} />}
            />
            <Route
              path="/data-sharing"
              element={<DataSharingView onBack={() => navigate(-1)} />}
            />
            <Route
              path="/policies"
              element={<PoliciesView onBack={() => navigate(-1)} />}
            />
            <Route
              path="/licenses"
              element={<LicensesView onBack={() => navigate(-1)} />}
            />
            <Route
              path="/gst"
              element={<GstDetailsView onBack={() => navigate(-1)} />}
            />
            <Route
              path="/accessibility"
              element={<AccessibilityView onBack={() => navigate(-1)} />}
            />
            <Route
              path="/gold"
              element={<GoldMembershipView onClose={() => navigate(-1)} />}
            />
            <Route
              path="/hidden-restaurants"
              element={
                <HiddenRestaurantsView
                  hiddenRestaurants={ALL_RESTAURANTS.filter((r) =>
                    hiddenRestaurantIds.includes(String(r.id)),
                  )}
                  onUnhide={handleUnhideRestaurant}
                  onBack={() => navigate(-1)}
                />
              }
            />
            <Route
              path="/favourites"
              element={
                <FavoritesView
                  favorites={ALL_RESTAURANTS.filter((r) =>
                    favouriteRestaurantIds.includes(String(r.id)),
                  )}
                  onRemove={handleRemoveFavourite}
                  onBack={() => navigate(-1)}
                />
              }
            />
            <Route
              path="/about"
              element={<AboutView onBack={() => navigate(-1)} />}
            />
            <Route
              path="/platform-feedback"
              element={<PlatformFeedbackView onBack={() => navigate(-1)} />}
            />
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
                  onClose={() => navigate(-1)}
                />
              }
            />
          </Routes>
        )}
      </main>

      {/* Back to Top Button */}
      {currentView === "home" && (
        <button
          onClick={scrollToTop}
          className={`fixed z-40 right-4 bg-slate-900 text-white w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${activeOrder ? "bottom-[100px]" : "bottom-6"
            } ${showBackToTop
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10 pointer-events-none"
            }`}
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

      {currentView === "home" && activeOrder && (
        <ActiveOrderSnackbar
          order={activeOrder}
          onClick={() => setCurrentView("order-tracking")}
        />
      )}
      {currentView === "home" && cart.length > 0 && selectedRestaurant && (
        <div className="fixed bottom-[80px] left-4 right-4 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 p-4 z-40 flex items-center justify-between animate-fadeInUp">
          <div className="flex-1 overflow-hidden pr-2">
            <h4 className="font-bold text-slate-900 text-sm truncate">
              {selectedRestaurant.name}
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              {cart.length} item{cart.length > 1 ? "s" : ""} in cart
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setIsLoadingView(true);
                setLoadingViewType("checkout");
                setTimeout(() => {
                  setCurrentView("checkout");
                  setIsLoadingView(false);
                }, 2500);
              }}
              className="text-xs font-bold text-white bg-green-600 px-4 py-2.5 rounded-xl active:scale-95 transition-all shadow-sm shadow-green-600/20"
            >
              View Cart
            </button>
            <button
              onClick={() => setCart([])}
              className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl active:scale-95 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      <AIChatBot
        forceOpen={currentView === "ai"}
        onClose={() => setCurrentView("home")}
      />

      {isVoiceSearchOpen && (
        <VoiceSearchModal
          onClose={() => setIsVoiceSearchOpen(false)}
          onResult={(text) => {
            setSearchQuery(text);
            setCurrentView("search-results");
          }}
        />
      )}
      {confirmModal && (
        <ConfirmationBottomSheet
          type={confirmModal.type}
          restaurantName={
            ALL_RESTAURANTS.find((r) => r.id === confirmModal.restaurantId)
              ?.name || "this restaurant"
          }
          onConfirm={executeConfirmAction}
          onClose={() => setConfirmModal(null)}
        />
      )}

      {/* Bottom Navigation */}
      {["home", "local", "dine-in", "deals"].includes(currentView) &&
        !currentLocation.address.toLowerCase().includes("motihari") && (
          <div
            className={`fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 pb-safe z-40 transition-transform duration-300 ${isNavVisible ? "translate-y-0" : "translate-y-full"
              }`}
          >
            <div className="flex justify-around items-center h-16">
              <button
                onClick={() => setCurrentView("home")}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${currentView === "home" ? "text-slate-900" : "text-slate-400"}`}
              >
                <Home className="w-5 h-5" />
                <span className="text-[10px] font-medium">Home</span>
              </button>
              <button
                onClick={() => setCurrentView("local")}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${currentView === "local" ? "text-slate-900" : "text-slate-400"}`}
              >
                <MapPin className="w-5 h-5" />
                <span className="text-[10px] font-medium">Local</span>
              </button>
              <button
                onClick={() => setCurrentView("dine-in")}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${currentView === "dine-in" ? "text-slate-900" : "text-slate-400"}`}
              >
                <UtensilsCrossed className="w-5 h-5" />
                <span className="text-[10px] font-medium">Dine-in</span>
              </button>
              <button
                onClick={() => setCurrentView("deals")}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${currentView === "deals" ? "text-slate-900" : "text-slate-400"}`}
              >
                <Percent className="w-5 h-5" />
                <span className="text-[10px] font-medium">Deals</span>
              </button>
            </div>
          </div>
        )}
    </div>
  );
};

export default App;
