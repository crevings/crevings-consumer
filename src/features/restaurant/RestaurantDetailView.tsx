import React, { useState, useMemo } from 'react';
import { ChevronUp, X, Menu, ArrowLeft, UtensilsCrossed } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useSWRConfig } from 'swr';
import { Restaurant, MenuItem, CartItem, Offer } from "@/types";
import { CustomizationBottomSheet } from "@/features/restaurant/components/CustomizationBottomSheet";
import { SortBottomSheet } from "@/shared/components/SortBottomSheet";
import { MenuItemDetailBottomSheet } from "@/features/restaurant/components/MenuItemDetailBottomSheet";
import { VoiceSearchModal } from "@/features/search/VoiceSearchModal";
import { useRestaurantOffers, useRestaurantCustomMenus } from "@/api/restaurant/index";
import { RestaurantHeader } from "@/features/restaurant/components/RestaurantHeader";
import { RestaurantOffers } from "@/features/restaurant/components/RestaurantOffers";
import { RestaurantFilters } from "@/features/restaurant/components/RestaurantFilters";
import { RestaurantMenuList } from "@/features/restaurant/components/RestaurantMenuList";
import { FloatingCartBar } from "@/features/restaurant/components/FloatingCartBar";
import { CartPreviewSheet } from "@/features/cart/components/CartPreviewSheet";
import { RestaurantOutletsSheet } from "@/features/restaurant/components/RestaurantOutletsSheet";
import { OfferDetailsSheet } from "@/features/restaurant/components/OfferDetailsSheet";
import { useCart } from "@/contexts/CartContext";
import { useRestaurant } from "@/contexts/RestaurantContext";
import { addOrUpdateCartItem, withQuantity } from "@/utils/cartUtils";
import { getRestaurantAddress } from "@/utils/restaurantUtils";
import { normalizeSearchText } from "@/utils/search";

interface RestaurantDetailViewProps {
  restaurant: Restaurant;
  onBack: () => void;
  onCheckout: (cart: CartItem[], items: MenuItem[]) => void;
  onHide?: () => void;
  onUnhide?: () => void;
  onFavourite?: () => void;
  onRemoveFavourite?: () => void;
  isFavourite?: boolean;
  isHidden?: boolean;
  autoAddItem?: string | null;
}

/** Skeleton shown while the menu streams in — keeps the header + back button
 * visible so the user is never trapped on a full-screen spinner. */
const MenuLoadingSkeleton: React.FC = () => {
  const shimmer = "relative overflow-hidden bg-slate-100 rounded-xl";
  return (
    <div className="px-4 pb-6 pt-1 space-y-6 animate-pulse">
      {[0, 1, 2].map((i) => (
        <div key={i}>
          <div className={`${shimmer} h-12 mb-4`} />
          <div className="space-y-3">
            {[0, 1, 2].map((j) => (
              <div key={j} className="flex items-center gap-3">
                <div className={`${shimmer} w-20 h-20 rounded-2xl shrink-0`} />
                <div className="flex-1 space-y-2">
                  <div className={`${shimmer} h-4 w-3/4`} />
                  <div className={`${shimmer} h-3 w-1/2`} />
                  <div className={`${shimmer} h-3 w-1/4`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export const RestaurantDetailView: React.FC<RestaurantDetailViewProps> = ({ 
  restaurant, 
  onBack, 
  onCheckout,
  onHide,
  onUnhide,
  onFavourite,
  onRemoveFavourite,
  isFavourite,
  isHidden,
  autoAddItem
}) => {
  const { customMenus, isLoading: isMenuLoading, isError: isMenuError } = useRestaurantCustomMenus(restaurant.id);
  const { mutate: mutateMenu } = useSWRConfig();
  const { offers, isLoadingMore: isOffersLoadingMore, isReachingEnd: isOffersReachingEnd, size: offersSize, setSize: setOffersSize } = useRestaurantOffers(restaurant.id, 5);

  const menuItems = useMemo(() => {
    if (!customMenus || customMenus.length === 0) return [];
    const map = new Map<string, MenuItem>();
    customMenus.forEach(menu => {
      (menu.items || []).forEach(item => {
        if (item && item.id) map.set(item.id, item);
      });
    });
    return Array.from(map.values());
  }, [customMenus]);
  const { cart, setCart } = useCart();
  const { setAutoAddItem } = useRestaurant();
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('default');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isVoiceSearchOpen, setIsVoiceSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [selectedAddonItem, setSelectedAddonItem] = useState<MenuItem | null>(null);
  const [showMenuCategories, setShowMenuCategories] = useState(false);
  const [isOutletsOpen, setIsOutletsOpen] = useState(false);
  const [selectedOutlet, setSelectedOutlet] = useState<string>(getRestaurantAddress(restaurant) || 'Koramangala');
  const [selectedMenuItemDetail, setSelectedMenuItemDetail] = useState<MenuItem | null>(null);
  const [isMenuItemDetailOpen, setIsMenuItemDetailOpen] = useState(false);
  const [showCartPreview, setShowCartPreview] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'Bestsellers': true,
    'Starters': true,
    'Pizzas': true,
    'Burgers': true,
    'Main Course': true
  });
  const [showBackToTop, setShowBackToTop] = useState(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [isCopied, setIsCopied] = useState(false);

  React.useEffect(() => {
    setIsCopied(false);
  }, [selectedOffer]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  React.useEffect(() => {
    if (autoAddItem) {
      const item = menuItems.find(i => i.id === autoAddItem);
      if (item && item.available !== false) {
        setSelectedAddonItem(item);
      }
    }
  }, [autoAddItem, menuItems]);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      if (scrollContainerRef.current.scrollTop > 500) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    }
  };



  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const isFilterActive = (filter: string) => activeFilters.includes(filter);

  const getItemQuantity = (id: string) => {
    return cart.filter(c => c.item.id === id).reduce((sum, c) => sum + c.quantity, 0);
  };

  const handleAdd = (id: string) => {
    const item = menuItems.find(i => i.id === id);
    if (item) {
      const hasPricingOptions = item.pricing_options && item.pricing_options.length > 1;
      const hasAddons = item.allowedAddons && item.allowedAddons.length > 0;
      const hasToppings = item.allowedToppings && item.allowedToppings.length > 0;
      const hasBeverages = item.allowedBeverages && item.allowedBeverages.length > 0;

      if (!hasPricingOptions && !hasAddons && !hasToppings && !hasBeverages) {
        const newItem: CartItem = {
          cartItemId: Math.random().toString(36).substr(2, 9),
          item: item,
          quantity: 1,
          totalPrice: item.price
        };
        setCart(prev => addOrUpdateCartItem(prev, newItem));
      } else {
        setSelectedAddonItem(item);
      }
    }
  };

  const handleRemove = (id: string) => {
    setCart(prev => {
      const newCart = [...prev];
      const index = newCart.findIndex(c => c.item.id === id);
      const entry = index !== -1 ? newCart[index] : undefined;
      if (entry && entry.quantity > 1) {
        const unitPrice = entry.totalPrice / entry.quantity;
        newCart[index] = { 
          ...entry, 
          quantity: entry.quantity - 1,
          totalPrice: entry.totalPrice - unitPrice
        };
      } else if (entry) {
        newCart.splice(index, 1);
      }
      return newCart;
    });
  };

  const handleCartQuantityChange = (cartItemId: string, delta: number) => {
    setCart(prev => {
      const updated = prev
        .map(item => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return withQuantity(item, newQty);
          }
          return item;
        })
        .filter(Boolean) as CartItem[];

      if (updated.length === 0) {
        setShowCartPreview(false);
      }
      return updated;
    });
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  let totalItems = cart.reduce((sum, c) => sum + c.quantity, 0);
  let totalPrice = cart.reduce((sum, c) => sum + c.totalPrice, 0);

  let filteredMenu = menuItems.filter(item => {
    if (searchQuery && !normalizeSearchText(item.name).includes(normalizeSearchText(searchQuery))) return false;
    if (isFilterActive('Pure Veg') && item.dietaryType !== 'Veg' && !item.isVeg) return false;
    if (isFilterActive('Non Veg') && item.dietaryType !== 'Non-Veg' && !item.isNonVeg) return false;
    if (isFilterActive('Egg') && item.dietaryType !== 'Egg' && !item.isEgg) return false;
    if (isFilterActive('Ratings 4.0+') && item.rating < 4.0) return false;
    if (isFilterActive('Buy 1 Get 1') && !item.hasOffer) return false;
    return true;
  });

  if (sortBy === 'ratingHigh') {
    filteredMenu.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'priceLow') {
    filteredMenu.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'priceHigh') {
    filteredMenu.sort((a, b) => b.price - a.price);
  }

  // Dynamically extract unique categories from filteredMenu
  const uniqueCategories = Array.from(new Set(filteredMenu.map(i => i.category || 'Main Course')));
  const categories = uniqueCategories.map(catName => ({
    name: catName,
    count: filteredMenu.filter(i => (i.category || 'Main Course') === catName).length
  })).filter(c => c.count > 0);
  
  // Add Bestsellers if any exist
  const bestsellerCount = filteredMenu.filter(i => i.bestseller).length;
  if (bestsellerCount > 0) {
    if (!categories.some(c => c.name === 'Bestsellers')) {
      categories.unshift({ name: 'Bestsellers', count: bestsellerCount });
    }
  }

  // Menu-section list shown in the MENU popup — mirrors exactly what
  // RestaurantMenuList renders on the page (custom menus created by restaurant).
  const menuSections = useMemo(() => {
    const sections: { name: string; count: number }[] = [];
    const filteredItemIds = new Set(filteredMenu.map(i => i.id));

    // Custom menu sections in their arranged order
    (customMenus || []).forEach(menu => {
      const sectionItems = (menu.items || []).filter(item => filteredItemIds.has(item.id));
      if (sectionItems.length > 0) {
        sections.push({ name: menu.name, count: sectionItems.length });
      }
    });

    return sections;
  }, [customMenus, filteredMenu]);

  // Expand the chosen section, close the MENU popup, then smooth-scroll to it
  const handleMenuSectionSelect = (name: string) => {
    setExpandedCategories(prev => ({ ...prev, [name]: true }));
    setShowMenuCategories(false);
    // Wait a tick for the sheet to close & section to expand before scrolling
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = scrollContainerRef.current?.querySelector(`[data-menu-section="${name}"]`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  };

  // Menu failed to load and we have nothing cached — full error state with a
  // working back button and a retry, never a silent spinner.
  if (isMenuError && customMenus.length === 0) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        <div className="flex items-center justify-between px-4 pt-safe-3 pb-3 bg-white border-b border-slate-100">
          <button
            onClick={onBack}
            className="p-2 -ml-2 text-slate-800 active:scale-90 transition-transform"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2]" />
          </button>
          <span className="text-[16px] font-bold text-slate-900 truncate flex-1 ml-2">
            {restaurant.name}
          </span>
          <span className="w-8 shrink-0" />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <UtensilsCrossed className="w-12 h-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-1">Couldn't load the menu</h3>
          <p className="text-sm text-slate-500 mb-6">Check your connection and try again.</p>
          <button
            onClick={() => void mutateMenu(`/consumer/restaurants/${restaurant.id}/menus`)}
            className="px-5 py-2.5 bg-[#00bd6f] text-white rounded-xl font-bold text-sm active:scale-95 transition-transform"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // First load (nothing cached yet): render the header + a skeleton so the
  // back button stays reachable and the page isn't a blank spinner.
  const isInitialMenuLoad = isMenuLoading && customMenus.length === 0;

  return (
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="fixed inset-0 bg-white z-50 flex flex-col overflow-y-auto no-scrollbar pb-24"
      >
      
      {/* Hero Image & Content Card wrapper */}
      <RestaurantHeader 
        restaurant={restaurant}
        onBack={onBack}
        isFavourite={isFavourite}
        onFavourite={onFavourite}
        onRemoveFavourite={onRemoveFavourite}
        isHidden={isHidden}
        onHide={onHide}
        onUnhide={onUnhide}
        selectedOutlet={selectedOutlet}
        onOutletClick={() => setIsOutletsOpen(true)}
      >
        {isInitialMenuLoad ? (
          <MenuLoadingSkeleton />
        ) : (
          <>
            <RestaurantOffers 
              offers={offers}
              isLoadingMore={!!isOffersLoadingMore}
              isReachingEnd={!!isOffersReachingEnd}
              onLoadMore={() => setOffersSize(offersSize + 1)}
              onSelectOffer={setSelectedOffer}
            />

            <RestaurantFilters 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setIsVoiceSearchOpen={setIsVoiceSearchOpen}
              sortBy={sortBy}
              setIsSortOpen={setIsSortOpen}
              isFilterActive={isFilterActive}
              toggleFilter={toggleFilter}
            />

            <RestaurantMenuList 
              customMenus={customMenus}
              filteredMenu={filteredMenu}
              categories={categories}
              expandedCategories={expandedCategories}
              toggleCategory={toggleCategory}
              getItemQuantity={getItemQuantity}
              handleAdd={handleAdd}
              handleRemove={handleRemove}
              onItemClick={(item) => {
                setSelectedMenuItemDetail(item);
                setIsMenuItemDetailOpen(true);
              }}
            />
          </>
        )}
      </RestaurantHeader>

      <FloatingCartBar 
        totalItems={totalItems}
        totalPrice={totalPrice}
        onPreviewClick={() => setShowCartPreview(true)}
        onCheckoutClick={() => onCheckout(cart, menuItems)}
      />

      <CartPreviewSheet 
        showCartPreview={showCartPreview}
        setShowCartPreview={setShowCartPreview}
        cart={cart}
        setCart={setCart}
        totalItems={totalItems}
        totalPrice={totalPrice}
        handleQuantityChange={handleCartQuantityChange}
        onCheckoutClick={() => onCheckout(cart, menuItems)}
      />

      {/* Floating Menu Button */}
      <div className={`fixed left-1/2 -translate-x-1/2 z-30 transition-all duration-300 ${totalItems > 0 ? 'bottom-[100px]' : 'bottom-8'}`}>
        <button 
          onClick={() => setShowMenuCategories(true)}
          className="bg-black text-white px-4 py-2 rounded-full font-bold text-[12px] shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex items-center gap-1.5 active:scale-95 transition-transform"
        >
          <Menu className="w-3.5 h-3.5" />
          MENU
        </button>
      </div>

      {/* Menu Categories Bottom Sheet */}
      <AnimatePresence>
        {showMenuCategories && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[60]"
              onClick={() => setShowMenuCategories(false)}
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[70] pb-safe-8 max-h-[70vh] flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
                <h2 className="text-[20px] font-bold text-black">Menu</h2>
                <button 
                  onClick={() => setShowMenuCategories(false)}
                  className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-600 active:scale-95 transition-transform"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="overflow-y-auto p-4 space-y-2">
                {menuSections.length === 0 && (
                  <p className="text-center text-sm text-gray-400 py-6">No menu items available</p>
                )}
                {menuSections.map((section) => (
                  <button
                    key={section.name}
                    onClick={() => handleMenuSectionSelect(section.name)}
                    className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  >
                    <span className="text-[16px] font-bold text-gray-900">{section.name}</span>
                    <span className="text-[14px] font-bold text-gray-500">{section.count}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <OfferDetailsSheet 
        selectedOffer={selectedOffer}
        setSelectedOffer={setSelectedOffer}
        handleCopyCode={handleCopyCode}
        isCopied={isCopied}
      />

      {/* Add-on Modal */}
      <AnimatePresence>
        {selectedAddonItem && (
          <CustomizationBottomSheet 
            item={selectedAddonItem}
            onClose={() => {
              setSelectedAddonItem(null);
              setAutoAddItem(null);
            }}
            onAddToCart={(cartItem) => {
              setCart(prev => {
                const newItems: CartItem[] = [];
                
                let sidesTotal = 0;
                if (cartItem.selectedSides) {
                  cartItem.selectedSides.forEach(side => {
                    sidesTotal += side.price * side.quantity;
                  });
                }

                newItems.push({
                  ...cartItem,
                  cartItemId: Math.random().toString(36).substr(2, 9),
                  quantity: cartItem.mainQuantity,
                  totalPrice: cartItem.totalPrice - sidesTotal,
                  selectedSides: []
                });
                
                if (cartItem.selectedSides) {
                  cartItem.selectedSides.forEach(side => {
                    const sideItem = menuItems.find(m => m.id === side.id) || {
                      id: side.id,
                      name: side.name,
                      price: side.price,
                      rating: 4.0,
                      ratingCount: '100+',
                      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop',
                      isVeg: true,
                      category: 'Sides'
                    };
                    newItems.push({
                      cartItemId: Math.random().toString(36).substr(2, 9),
                      item: sideItem,
                      quantity: side.quantity,
                      totalPrice: side.price * side.quantity
                    });
                  });
                }
                return [...prev, ...newItems];
              });
              setSelectedAddonItem(null);
              setAutoAddItem(null);
            }}
          />
        )}
      </AnimatePresence>

      <MenuItemDetailBottomSheet
        item={selectedMenuItemDetail}
        isOpen={isMenuItemDetailOpen}
        onClose={() => setIsMenuItemDetailOpen(false)}
        quantity={selectedMenuItemDetail ? getItemQuantity(selectedMenuItemDetail.id) : 0}
        onUpdateQuantity={(delta) => {
          if (!selectedMenuItemDetail) return;
          if (delta > 0) {
            handleAdd(selectedMenuItemDetail.id);
          } else {
            handleRemove(selectedMenuItemDetail.id);
          }
        }}
      />

      {/* Sort Bottom Sheet */}
      {isSortOpen && (
        <SortBottomSheet 
          currentSort={sortBy}
          options={[
            { id: 'default', label: 'Relevance (Default)' },
            { id: 'priceLow', label: 'Cost: Low to High' },
            { id: 'priceHigh', label: 'Cost: High to Low' },
          ]}
          onSelect={(sort) => {
            setSortBy(sort);
            setIsSortOpen(false);
          }}
          onClose={() => setIsSortOpen(false)}
        />
      )}

      <RestaurantOutletsSheet 
        isOutletsOpen={isOutletsOpen}
        setIsOutletsOpen={setIsOutletsOpen}
        selectedOutlet={selectedOutlet}
        setSelectedOutlet={setSelectedOutlet}
      />

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed z-40 right-4 bg-slate-900 text-white w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          totalItems > 0 ? 'bottom-[100px]' : 'bottom-6'
        } ${
          showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        <ChevronUp className="w-5 h-5" />
      </button>
      <AnimatePresence>
        {isVoiceSearchOpen && (
          <VoiceSearchModal 
            onClose={() => setIsVoiceSearchOpen(false)} 
            onResult={(text) => { 
              setSearchQuery(text); 
            }} 
          />
        )}
      </AnimatePresence>

      </div>
  );
};
