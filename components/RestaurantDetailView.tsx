import React, { useState } from 'react';
import { ArrowLeft, Search, Share2, Star, Clock, MapPin, Percent, Plus, Minus, ChevronRight, Bookmark, Mic, ChevronUp, ChevronDown, X, Trash2, Heart, EyeOff, Eye, Menu, SlidersHorizontal, CheckCircle2, Info, MoreVertical } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Restaurant, MenuItem, CartItem } from '../types';
import { CustomizationBottomSheet } from './CustomizationBottomSheet';
import { SortBottomSheet } from './SortBottomSheet';
import { MenuItemDetailBottomSheet } from './MenuItemDetailBottomSheet';
import { VoiceSearchModal } from './VoiceSearchModal';
import { MOCK_MENU } from '../constants';

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
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('default');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isVoiceSearchOpen, setIsVoiceSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOffer, setSelectedOffer] = useState<{title: string, subtitle: string, code?: string} | null>(null);
  const [selectedAddonItem, setSelectedAddonItem] = useState<MenuItem | null>(null);
  const [showMenuCategories, setShowMenuCategories] = useState(false);
  const [isOutletsOpen, setIsOutletsOpen] = useState(false);
  const [selectedOutlet, setSelectedOutlet] = useState('Koramangala');
  const [selectedMenuItemDetail, setSelectedMenuItemDetail] = useState<MenuItem | null>(null);
  const [isMenuItemDetailOpen, setIsMenuItemDetailOpen] = useState(false);
  const [isBannerMenuOpen, setIsBannerMenuOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'Bestsellers': true,
    'Starters': true,
    'Pizzas': true,
    'Burgers': true,
    'Main Course': true
  });
  const [showBackToTop, setShowBackToTop] = useState(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (autoAddItem) {
      const item = MOCK_MENU.find(i => i.id === autoAddItem);
      if (item && item.available !== false) {
        setSelectedAddonItem(item);
      }
    }
  }, [autoAddItem]);

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
    const item = MOCK_MENU.find(i => i.id === id);
    if (item) {
      setSelectedAddonItem(item);
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

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  let totalItems = cart.reduce((sum, c) => sum + c.quantity, 0);
  let totalPrice = cart.reduce((sum, c) => sum + c.totalPrice, 0);

  let filteredMenu = MOCK_MENU.filter(item => {
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

  const categories = [
    { name: 'Bestsellers', count: filteredMenu.filter(i => i.bestseller).length },
    { name: 'Starters', count: filteredMenu.filter(i => i.category === 'Starters').length },
    { name: 'Pizzas', count: filteredMenu.filter(i => i.category === 'Pizzas').length },
    { name: 'Burgers', count: filteredMenu.filter(i => i.category === 'Burgers').length },
    { name: 'Main Course', count: filteredMenu.filter(i => i.category === 'Main Course').length }
  ].filter(c => c.count > 0);

  return (
    <div 
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="fixed inset-0 bg-white z-50 flex flex-col overflow-y-auto no-scrollbar pb-24"
    >
      
      {/* Hero Image Section */}
      <div className="relative aspect-[2/3] max-h-[500px] w-full shrink-0">
        <img 
          src={(restaurant.images && restaurant.images[0]) || "https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?w=1000&h=1500&fit=crop"} 
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Top Navigation */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
          <button onClick={onBack} className="w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-transform active:scale-95">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 relative">
            <button 
              onClick={() => setIsBannerMenuOpen(!isBannerMenuOpen)}
              className="w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-transform active:scale-95"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isBannerMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsBannerMenuOpen(false)} />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute top-12 right-0 w-48 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-50"
                  >
                    <div className="py-1">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isFavourite && onRemoveFavourite) {
                            onRemoveFavourite();
                          } else if (!isFavourite && onFavourite) {
                            onFavourite();
                          }
                          setIsBannerMenuOpen(false);
                        }}
                        className="w-full px-4 py-3 flex items-center gap-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Heart className={`w-4 h-4 ${isFavourite ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
                        {isFavourite ? 'Remove Favourite' : 'Favourite'}
                      </button>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isHidden && onUnhide) {
                            onUnhide();
                          } else if (!isHidden && onHide) {
                            onHide();
                          }
                          setIsBannerMenuOpen(false);
                        }}
                        className="w-full px-4 py-3 flex items-center gap-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <EyeOff className={`w-4 h-4 ${isHidden ? 'text-red-500' : 'text-slate-400'}`} />
                        {isHidden ? 'Unhide' : 'Hide'}
                      </button>

                      <button 
                        onClick={() => {
                          setIsBannerMenuOpen(false);
                          // Share logic here
                        }}
                        className="w-full px-4 py-3 flex items-center gap-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Share2 className="w-4 h-4 text-slate-400" />
                        Share
                      </button>

                      <button 
                        onClick={() => {
                          setIsBannerMenuOpen(false);
                          if (onInfoClick) onInfoClick();
                        }}
                        className="w-full px-4 py-3 flex items-center gap-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Info className="w-4 h-4 text-slate-400" />
                        Info
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Content Container (overlaps image) */}
      <div className="relative -mt-6 bg-white rounded-t-3xl pt-6 px-4 z-20 flex-1">
        
        {/* Restaurant Header Info */}
        <div className="flex flex-col items-center text-center gap-1.5 mb-6">
          <div className="w-16 h-16 bg-white rounded-2xl border border-slate-100 flex items-center justify-center overflow-hidden mb-2 -mt-14 z-30 relative">
            <img 
              src={(restaurant.images && restaurant.images[0]) || "https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?w=200&h=200&fit=crop"} 
              alt={`${restaurant.name} logo`}
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">{restaurant.name}</h1>
          
          <button onClick={() => setIsOutletsOpen(true)} className="flex items-center gap-1 text-sm text-slate-800 font-bold mt-1 active:scale-95 transition-transform bg-slate-50 px-3 py-1 rounded-full">
            <span>{selectedOutlet}</span>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>
          
          <p className="text-sm text-slate-500 font-medium mt-1">
            {restaurant.cuisine}
          </p>
          
          <div className="flex items-center gap-2 text-sm font-medium mt-0.5">
            <span className="text-slate-600">{restaurant.price}</span>
            <span className="text-slate-300">|</span>
            <span className="text-emerald-600 font-bold">Open</span>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-sm">
          <div className="flex flex-col items-center gap-1 flex-1">
            <div className="flex items-center gap-1 text-slate-900 font-bold">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{restaurant.rating}</span>
            </div>
            <span className="text-xs text-slate-500 font-medium">Rating</span>
          </div>
          
          <div className="w-px h-8 bg-slate-200" />
          
          <div className="flex flex-col items-center gap-1 flex-1">
            <div className="flex items-center gap-1 text-slate-900 font-bold">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>{restaurant.distance}</span>
            </div>
            <span className="text-xs text-slate-500 font-medium">Distance</span>
          </div>
          
          <div className="w-px h-8 bg-slate-200" />
          
          <div className="flex flex-col items-center gap-1 flex-1">
            <div className="flex items-center gap-1 text-slate-900 font-bold">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>{restaurant.time}</span>
            </div>
            <span className="text-xs text-slate-500 font-medium">Delivery</span>
          </div>
        </div>

        {/* Offers Section */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 mb-4 -mx-4 px-4">
          {/* Offer Card 1 */}
          <div 
            onClick={() => setSelectedOffer({ title: '25% OFF', subtitle: 'Selected Items', code: 'TRYNEW' })}
            className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between shadow-sm cursor-pointer active:scale-95 transition-transform min-w-[240px] shrink-0"
          >
            <div className="flex flex-col">
              <span className="text-sm font-bold text-black leading-tight">Get 25% off upto ₹50</span>
              <span className="text-xs text-slate-500 font-medium mt-0.5">On selected items</span>
            </div>
            <span className="text-xs font-bold text-blue-600 ml-2 shrink-0">View</span>
          </div>

          {/* Offer Card 2 */}
          <div 
            onClick={() => setSelectedOffer({ title: 'Flat ₹150 OFF', subtitle: 'Above ₹499', code: 'JUMBO' })}
            className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between shadow-sm cursor-pointer active:scale-95 transition-transform min-w-[240px] shrink-0"
          >
            <div className="flex flex-col">
              <span className="text-sm font-bold text-black leading-tight">Flat ₹150 OFF</span>
              <span className="text-xs text-slate-500 font-medium mt-0.5">On orders above ₹499</span>
            </div>
            <span className="text-xs font-bold text-blue-600 ml-2 shrink-0">View</span>
          </div>

          {/* Offer Card 3 */}
          <div 
            onClick={() => setSelectedOffer({ title: 'Free Delivery', subtitle: 'On all orders', code: 'FREEDEL' })}
            className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between shadow-sm cursor-pointer active:scale-95 transition-transform min-w-[240px] shrink-0"
          >
            <div className="flex flex-col">
              <span className="text-sm font-bold text-black leading-tight">Free Delivery</span>
              <span className="text-xs text-slate-500 font-medium mt-0.5">On all orders</span>
            </div>
            <span className="text-xs font-bold text-blue-600 ml-2 shrink-0">View</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2 mb-6 relative z-10">
          <div className="flex-1 flex items-center justify-between px-4 py-1.5 bg-white border border-slate-200 rounded-[1.25rem] shadow-sm transition-all focus-within:border-slate-300">
            <div className="flex items-center gap-3 flex-1">
              <Search className="w-5 h-5 text-slate-900 stroke-[2.5] shrink-0" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for dishes" 
                className="w-full py-2 bg-transparent text-slate-700 font-medium text-base focus:outline-none placeholder:text-slate-500"
              />
            </div>
            <button 
              onClick={() => setIsVoiceSearchOpen(true)}
              className="p-1 -mr-1 text-blue-600 hover:bg-blue-50 rounded-full transition-all active:scale-90"
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar mb-8 -mx-4 px-4 pb-1">
          <button 
            onClick={() => setIsSortOpen(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors shrink-0 ${
              sortBy !== 'default' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
            }`}
          >
            <SlidersHorizontal className={`w-4 h-4 ${sortBy !== 'default' ? 'text-blue-500' : 'text-gray-700'}`} />
            <span className={`text-[15px] font-medium ${sortBy !== 'default' ? 'text-blue-500' : 'text-gray-700'}`}>Sort</span>
          </button>
          
          <button 
            onClick={() => toggleFilter('Pure Veg')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors shrink-0 ${
              isFilterActive('Pure Veg') ? 'border-[#00bd6f] bg-[#e6fcf1]' : 'border-gray-200 bg-white'
            }`}
          >
            <div className="w-4 h-4 border border-green-600 flex items-center justify-center rounded-sm bg-white">
              <div className="w-2 h-2 bg-green-600 rounded-full" />
            </div>
            <span className={`text-[15px] font-medium ${isFilterActive('Pure Veg') ? 'text-[#00bd6f]' : 'text-gray-700'}`}>Pure Veg</span>
          </button>

          <button 
            onClick={() => toggleFilter('Non Veg')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors shrink-0 ${
              isFilterActive('Non Veg') ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'
            }`}
          >
            <div className="w-4 h-4 border border-red-600 flex items-center justify-center rounded-sm bg-white">
              <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-red-600" />
            </div>
            <span className={`text-[15px] font-medium ${isFilterActive('Non Veg') ? 'text-red-500' : 'text-gray-700'}`}>Non Veg</span>
          </button>

          <button 
            onClick={() => toggleFilter('Egg')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors shrink-0 ${
              isFilterActive('Egg') ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 bg-white'
            }`}
          >
            <div className="w-4 h-4 border border-yellow-500 flex items-center justify-center rounded-sm bg-white">
              <div className="w-2 h-2 bg-yellow-500 rounded-full" />
            </div>
            <span className={`text-[15px] font-medium ${isFilterActive('Egg') ? 'text-yellow-600' : 'text-gray-700'}`}>Egg</span>
          </button>

          <button 
            onClick={() => toggleFilter('Ratings 4.0+')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors shrink-0 ${
              isFilterActive('Ratings 4.0+') ? 'border-black bg-gray-100' : 'border-gray-200 bg-white'
            }`}
          >
            <span className={`text-[15px] font-medium ${isFilterActive('Ratings 4.0+') ? 'text-black' : 'text-gray-700'}`}>Ratings 4.0+</span>
          </button>

          <button 
            onClick={() => toggleFilter('Buy 1 Get 1')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors shrink-0 ${
              isFilterActive('Buy 1 Get 1') ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
            }`}
          >
            <span className={`text-[15px] font-medium ${isFilterActive('Buy 1 Get 1') ? 'text-blue-500' : 'text-gray-700'}`}>Buy 1 Get 1</span>
          </button>
        </div>

        {/* Menu Categories */}
        <div className="space-y-6">
          {filteredMenu.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="w-12 h-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">Search item is not available</h3>
              <p className="text-sm text-slate-500">Try searching for something else or clear filters.</p>
            </div>
          ) : (
            categories.map((category) => {
              const isExpanded = expandedCategories[category.name];
              const categoryItems = category.name === 'Bestsellers' 
                ? filteredMenu.filter(item => item.bestseller)
                : filteredMenu.filter(item => item.category === category.name);
              
              // Show category if it has items
              if (categoryItems.length === 0) return null;

              return (
                <div key={category.name} className="border-b border-gray-100 pb-6 last:border-0">
                  <button 
                    onClick={() => toggleCategory(category.name)}
                    className="w-full flex items-center justify-between px-4 py-4 bg-gray-50/50 rounded-xl mb-4"
                  >
                    <div className="text-left">
                      <h3 className="text-[18px] font-bold text-gray-900">{category.name}</h3>
                      <p className="text-[13px] text-gray-500 font-medium mt-0.5">{category.count} items</p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="flex overflow-x-auto gap-3 pb-4 snap-x snap-mandatory no-scrollbar -mx-4 px-4">
                      {categoryItems.map((item) => (
                        <div 
                          key={item.id} 
                          className={`relative flex flex-col p-1.5 rounded-2xl border transition-all shrink-0 w-[160px] snap-start ${
                            getItemQuantity(item.id) > 0
                              ? 'border-[#00bd6f] bg-[#f4fdf8] shadow-[0_2px_10px_rgba(0,189,111,0.1)]' 
                              : 'border-gray-200 bg-white shadow-sm'
                          } ${item.available === false ? 'opacity-50 grayscale' : ''}`}
                        >
                          {/* Top: Image & Tags */}
                          {item.image && (
                            <div 
                              className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 mb-2 cursor-pointer"
                              onClick={() => {
                                setSelectedMenuItemDetail(item);
                                setIsMenuItemDetailOpen(true);
                              }}
                            >
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              <div className="absolute top-1.5 left-1.5 bg-white/95 p-1 rounded-md shadow-sm">
                                <div className={`w-3 h-3 border flex items-center justify-center rounded-sm ${item.isVeg ? 'border-green-600' : item.isEgg ? 'border-yellow-500' : 'border-red-600'}`}>
                                  {item.isVeg ? (
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                                  ) : item.isEgg ? (
                                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                                  ) : (
                                    <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[4px] border-b-red-600" />
                                  )}
                                </div>
                              </div>
                              <div className="absolute bottom-1.5 right-1.5 flex items-center gap-1 bg-green-50/95 backdrop-blur-sm px-1.5 py-0.5 rounded text-green-700 shadow-sm">
                                <Star className="w-3 h-3 fill-current" />
                                <span className="text-[11px] font-bold">{item.rating}</span>
                                <span className="text-[10px] opacity-80">({item.ratingCount})</span>
                              </div>
                            </div>
                          )}
                          {!item.image && (
                            <div className="flex items-center justify-between mb-2 px-1.5 pt-1.5">
                              <div className={`w-4 h-4 border flex items-center justify-center rounded-sm ${item.isVeg ? 'border-green-600' : item.isEgg ? 'border-yellow-500' : 'border-red-600'}`}>
                                {item.isVeg ? (
                                  <div className="w-2 h-2 rounded-full bg-green-600" />
                                ) : item.isEgg ? (
                                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                ) : (
                                  <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-red-600" />
                                )}
                              </div>
                              <div className="flex items-center gap-1 bg-green-50 px-1.5 py-0.5 rounded text-green-700">
                                <Star className="w-3 h-3 fill-current" />
                                <span className="text-[11px] font-bold">{item.rating}</span>
                                <span className="text-[10px] opacity-80">({item.ratingCount})</span>
                              </div>
                            </div>
                          )}

                          {/* Middle: Name & Description */}
                          <div className="flex-1 mb-2 px-1.5">
                            <h4 className="text-[14px] font-bold text-gray-900 leading-tight mb-1">{item.name}</h4>
                            {item.description && (
                              <p className="text-[11px] text-gray-500 line-clamp-2 leading-snug">{item.description}</p>
                            )}
                            {item.available === false && (
                              <span className="inline-block mt-1.5 text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-md uppercase tracking-wide">Unavailable</span>
                            )}
                          </div>

                          {/* Bottom: Price & Action */}
                          <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100 px-1.5 pb-1">
                            <span className="text-[14px] font-black text-gray-900">₹{item.price}</span>
                            
                            {getItemQuantity(item.id) > 0 ? (
                              <div className="flex items-center justify-between bg-[#00bd6f] rounded-lg h-7 px-1 min-w-[64px] shadow-sm">
                                <button onClick={() => handleRemove(item.id)} className="w-6 h-full flex items-center justify-center text-white active:scale-95">
                                  <Minus className="w-3.5 h-3.5 stroke-[3]" />
                                </button>
                                <span className="text-[12px] font-bold text-white">{getItemQuantity(item.id)}</span>
                                <button onClick={() => handleAdd(item.id)} className="w-6 h-full flex items-center justify-center text-white active:scale-95">
                                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => item.available !== false && handleAdd(item.id)} 
                                disabled={item.available === false}
                                className={`px-3 py-1 rounded-lg font-bold text-[12px] flex items-center gap-1 transition-transform shadow-sm ${
                                  item.available === false 
                                    ? 'bg-gray-50 text-gray-400 border border-gray-200' 
                                    : 'bg-white text-[#00bd6f] border border-[#00bd6f]/30 hover:bg-[#f4fdf8] active:scale-95'
                                }`}
                              >
                                ADD
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Bottom Cart Bar */}
      {totalItems > 0 && (
        <div className="fixed bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md z-40 animate-[slideUp_0.3s_ease-out]">
          <div className="bg-white rounded-2xl p-4 flex items-center justify-between text-black shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setCart([])}
                className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 rounded-full active:scale-95 transition-transform"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <div>
                <div className="font-bold text-[15px] text-gray-900">{totalItems} item{totalItems > 1 ? 's' : ''}</div>
                <div className="text-[13px] font-medium text-[#00bd6f]">Total ₹{totalPrice}</div>
              </div>
            </div>
            <button 
              onClick={() => onCheckout(cart, MOCK_MENU)}
              className="flex items-center gap-1.5 font-bold text-[15px] bg-[#00bd6f] text-white px-5 py-2.5 rounded-xl active:scale-95 transition-transform"
            >
              View Cart <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

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
                <h2 className="text-[20px] font-black text-black">Menu</h2>
                <button 
                  onClick={() => setShowMenuCategories(false)}
                  className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-600 active:scale-95 transition-transform"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="overflow-y-auto p-4 space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => {
                      setExpandedCategories(prev => ({ ...prev, [category.name]: true }));
                      setShowMenuCategories(false);
                    }}
                    className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  >
                    <span className="text-[16px] font-bold text-gray-900">{category.name}</span>
                    <span className="text-[14px] font-bold text-gray-500">{category.count}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Offer Details Modal */}
      {selectedOffer && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 z-[60] animate-[fadeIn_0.2s_ease-out]"
            onClick={() => setSelectedOffer(null)}
          />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[70] animate-[slideUp_0.3s_ease-out] pb-8">
            <div className="relative pt-8 pb-6 px-4 text-center border-b border-gray-100">
              <button 
                onClick={() => setSelectedOffer(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center border-[1.5px] border-[#00bd6f] rounded-xl text-gray-600 active:scale-95 transition-transform"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-[22px] font-black text-black mb-1.5">{selectedOffer.title}</h2>
              <p className="text-[16px] text-gray-500">{selectedOffer.subtitle}</p>
            </div>
            <div className="px-4 pt-6">
              {selectedOffer.code && (
                <div className="mb-6 bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Coupon Code</span>
                    <span className="text-lg font-black text-blue-900">{selectedOffer.code}</span>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm active:scale-95 transition-transform">
                    COPY
                  </button>
                </div>
              )}
              <h3 className="text-[18px] font-bold text-black mb-4">Terms & Conditions</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-[15px] text-gray-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0 mt-2" />
                  Applicable once per user
                </li>
                <li className="flex items-start gap-3 text-[15px] text-gray-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0 mt-2" />
                  Cannot be combined with other offers
                </li>
              </ul>
            </div>
          </div>
        </>
      )}

      {/* Add-on Modal */}
      <AnimatePresence>
        {selectedAddonItem && (
          <CustomizationBottomSheet 
            item={selectedAddonItem}
            onClose={() => setSelectedAddonItem(null)}
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
                    const sideItem = MOCK_MENU.find(m => m.id === side.id) || {
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

      {/* Outlets Bottom Sheet */}
      <AnimatePresence>
        {isOutletsOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOutletsOpen(false)}
              className="fixed inset-0 bg-black/60 z-[60]"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[70] overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white">
                <h2 className="text-lg font-bold text-slate-900">Select Outlet</h2>
                <button onClick={() => setIsOutletsOpen(false)} className="p-2 bg-slate-50 rounded-full text-slate-500">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 overflow-y-auto">
                {['Koramangala', 'Indiranagar', 'HSR Layout', 'Jayanagar', 'Whitefield'].map(outlet => (
                  <button
                    key={outlet}
                    onClick={() => {
                      setSelectedOutlet(outlet);
                      setIsOutletsOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-4 border-b border-slate-50 last:border-0 active:bg-slate-50 transition-colors"
                  >
                    <div className="flex flex-col items-start">
                      <span className={`text-base font-bold ${selectedOutlet === outlet ? 'text-blue-600' : 'text-slate-900'}`}>{outlet}</span>
                      <span className="text-xs text-slate-500 mt-1">{Math.floor(Math.random() * 5 + 1)}.{Math.floor(Math.random() * 9)} km away</span>
                    </div>
                    {selectedOutlet === outlet && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
