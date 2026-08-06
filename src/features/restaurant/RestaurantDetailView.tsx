import React, { useState, useRef, useCallback, useMemo } from 'react';
import { ArrowLeft, Search, Share2, Star, Clock, MapPin, Percent, Plus, Minus, ChevronRight, Bookmark, Mic, ChevronUp, ChevronDown, X, Trash2, Heart, EyeOff, Eye, Menu, SlidersHorizontal, CheckCircle2, Info, MoreVertical, Sparkles, ShoppingCart } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Restaurant, MenuItem, CartItem, Offer } from "@/types";
import { CustomizationBottomSheet } from "@/features/restaurant/components/CustomizationBottomSheet";
import { SortBottomSheet } from "@/shared/components/SortBottomSheet";
import { MenuItemDetailBottomSheet } from "@/features/restaurant/components/MenuItemDetailBottomSheet";
import { VoiceSearchModal } from "@/features/search/VoiceSearchModal";
import { useRestaurantDetail, useRestaurantOffers, useRestaurantCustomMenus } from "../../api/restaurants";
import { RestaurantHeader } from "./components/RestaurantHeader";
import { RestaurantOffers } from "./components/RestaurantOffers";
import { RestaurantFilters } from "./components/RestaurantFilters";
import { RestaurantMenuList } from "./components/RestaurantMenuList";
import { FloatingCartBar } from "./components/FloatingCartBar";
import { CartPreviewSheet } from "../cart/components/CartPreviewSheet";
import { RestaurantOutletsSheet } from "./components/RestaurantOutletsSheet";
import { OfferDetailsSheet } from "./components/OfferDetailsSheet";
import { useCart } from "../../contexts/CartContext";
import { useRestaurant } from "../../contexts/RestaurantContext";
import { Skeleton } from "boneyard-js/react";
import { addOrUpdateCartItem } from "@/utils/cartUtils";

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
  onInfoClick?: () => void;
  autoAddItem?: string | null;
}

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
  onInfoClick,
  autoAddItem
}) => {
  const { menuItems, isLoading: isMenuLoading, isLoadingMore, isReachingEnd, size, setSize } = useRestaurantDetail(restaurant.id);
  const { customMenus } = useRestaurantCustomMenus(restaurant.id);
  const { offers, isLoadingMore: isOffersLoadingMore, isReachingEnd: isOffersReachingEnd, size: offersSize, setSize: setOffersSize } = useRestaurantOffers(restaurant.id, 5);
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
  const [selectedOutlet, setSelectedOutlet] = useState(restaurant.address || 'Koramangala');
  const [selectedMenuItemDetail, setSelectedMenuItemDetail] = useState<MenuItem | null>(null);
  const [isMenuItemDetailOpen, setIsMenuItemDetailOpen] = useState(false);
  const [isBannerMenuOpen, setIsBannerMenuOpen] = useState(false);
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

  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback((node: HTMLDivElement) => {
    if (isLoadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !isReachingEnd) {
        setSize(size + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoadingMore, isReachingEnd, setSize, size]);

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
      if (index !== -1) {
        if (newCart[index].quantity > 1) {
          const unitPrice = newCart[index].totalPrice / newCart[index].quantity;
          newCart[index] = { 
            ...newCart[index], 
            quantity: newCart[index].quantity - 1,
            totalPrice: newCart[index].totalPrice - unitPrice
          };
        } else {
          newCart.splice(index, 1);
        }
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
            const basePrice = item.item.price;
            const variantPrice = item.variant ? item.variant.price : 0;
            const addonsPrice = (item.selectedAddons || []).reduce((s, a) => s + a.price * a.quantity, 0);
            const sidesPrice = (item.selectedSides || []).reduce((s, a) => s + a.price * a.quantity, 0);
            const singlePrice = basePrice + variantPrice + addonsPrice + sidesPrice;
            return {
              ...item,
              quantity: newQty,
              totalPrice: singlePrice * newQty
            };
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
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (isFilterActive('Pure Veg') && !item.isVeg) return false;
    if (isFilterActive('Non Veg') && (item.isVeg || item.isEgg)) return false;
    if (isFilterActive('Egg') && !item.isEgg) return false;
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

  // Unified menu-section list shown in the MENU popup — mirrors exactly what
  // RestaurantMenuList renders on the page (custom menus first, then regular
  // categories with custom-menu items excluded). Clicking one scrolls the page
  // to that section and expands it.
  const menuSections = useMemo(() => {
    const sections: { name: string; count: number }[] = [];
    const filteredItemIds = new Set(filteredMenu.map(i => i.id));
    const customMenuItemIds = new Set(
      (customMenus || []).flatMap(m => (m.items || []).map(i => i.id))
    );

    // 1. Custom menu sections in their arranged order
    (customMenus || []).forEach(menu => {
      const sectionItems = (menu.items || []).filter(item => filteredItemIds.has(item.id));
      if (sectionItems.length > 0) {
        sections.push({ name: menu.name, count: sectionItems.length });
      }
    });

    // 2. Regular categories (excluding items already shown in custom menus)
    categories.forEach(category => {
      const items = (
        category.name === 'Bestsellers'
          ? filteredMenu.filter(item => item.bestseller)
          : filteredMenu.filter(item => (item.category || 'Main Course') === category.name)
      ).filter(item => !customMenuItemIds.has(item.id));
      if (items.length > 0) {
        sections.push({ name: category.name, count: items.length });
      }
    });

    return sections;
  }, [customMenus, filteredMenu, categories]);

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


  return (
    <Skeleton name="restaurant-detail" loading={isMenuLoading}>
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
        onInfoClick={onInfoClick}
        selectedOutlet={selectedOutlet}
        onOutletClick={() => setIsOutletsOpen(true)}
      >
        <RestaurantOffers 
          offers={offers}
          isLoadingMore={isOffersLoadingMore}
          isReachingEnd={isOffersReachingEnd}
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
        
        <div ref={lastElementRef} className="py-6 flex items-center justify-center">
          {isLoadingMore && (
            <div className="w-6 h-6 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin"></div>
          )}
        </div>
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
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[70] pb-8 max-h-[70vh] flex flex-col"
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
    </Skeleton>
  );
};
