import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  ShoppingCart, 
  Package, 
  Coffee, 
  Box, 
  Tag,
  ChevronRight,
  Star,
  Plus,
  Trash2,
  SlidersHorizontal,
  MapPin,
  ChevronDown,
  User,
  Mic,
  QrCode,
  Home,
  Briefcase,
  Map,
  MoreVertical
} from 'lucide-react';

interface PartnerStoreViewProps {
  onBack?: () => void;
  onNavigateToProduct?: () => void;
  onNavigateToCheckout?: () => void;
  onNavigateToPinOnMap?: () => void;
}

export const PartnerStoreView: React.FC<PartnerStoreViewProps> = ({ onBack, onNavigateToProduct, onNavigateToCheckout, onNavigateToPinOnMap }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Filter state
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [showLocationSheet, setShowLocationSheet] = useState(false);
  const [showVoiceSearchSheet, setShowVoiceSearchSheet] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showCartSnackbar, setShowCartSnackbar] = useState(true);
  
  // Filter Draft State (for bottom sheet)
  const [draftRating, setDraftRating] = useState<number | null>(null);
  const [draftDistance, setDraftDistance] = useState<number>(3);
  const [draftDietary, setDraftDietary] = useState<string[]>([]);
  const [draftOffersOnly, setDraftOffersOnly] = useState(false);
  const [draftSort, setDraftSort] = useState<string | null>(null);

  const categories = [
    { id: 'All', name: 'All', icon: Package },
    { id: 'Packaging', name: 'Packaging', icon: Box },
    { id: 'Ingredients', name: 'Ingredients', icon: Coffee },
    { id: 'Marketing', name: 'Marketing', icon: Tag },
  ];

  const featuredBrands = [
    { id: '1', name: 'Zomato', image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=150&auto=format&fit=crop' },
    { id: '2', name: 'Swiggy', image: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=150&auto=format&fit=crop' },
    { id: '3', name: 'Blinkit', image: 'https://images.unsplash.com/photo-1516876437184-593fda40c7ce?q=80&w=150&auto=format&fit=crop' },
    { id: '4', name: 'Zepto', image: 'https://images.unsplash.com/photo-1550525811-e5869dd03032?q=80&w=150&auto=format&fit=crop' },
    { id: '5', name: 'Instamart', image: 'https://images.unsplash.com/photo-1633409361618-c73427e4e206?q=80&w=150&auto=format&fit=crop' },
  ];

  const featuredVendors = [
    {
      id: 'v1',
      badge: 'BEST IN PACKAGING',
      name: 'EcoPack Solutions',
      rating: '4.8',
      details: 'Industrial Area • 5.2 km • Same day',
      tags: 'Boxes, Containers, Carry Bags',
      offerText: 'Free Delivery • Min. Order ₹500',
      products: [
        {
          id: 'p1',
          label: 'BESTSELLER',
          image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=400&auto=format&fit=crop',
          price: '₹1,200',
          name: 'Premium Pizza Boxes (10")',
          isVeg: true
        },
        {
          id: 'p2',
          label: 'BESTSELLER',
          image: 'https://images.unsplash.com/photo-1604147706283-d7119b5b822c?q=80&w=400&auto=format&fit=crop',
          price: '₹850',
          name: 'Burger Containers',
          isVeg: true
        }
      ]
    },
    {
      id: 'v2',
      badge: 'PREMIUM INGREDIENTS',
      name: 'Fresh Farms',
      rating: '4.6',
      details: 'City Center • 2.1 km • 2 hours',
      tags: 'Vegetables, Dairy, Spices',
      offerText: '10% Off • Items At ₹200',
      products: [
        {
          id: 'p3',
          label: 'BESTSELLER',
          image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=400&auto=format&fit=crop',
          price: '₹1,500',
          name: 'Arabica Coffee Beans',
          isVeg: true
        },
        {
          id: 'p4',
          label: 'FRESH',
          image: 'https://images.unsplash.com/photo-1596649281358-372583db6779?q=80&w=400&auto=format&fit=crop',
          price: '₹450',
          name: 'Organic Tomatoes',
          isVeg: true
        }
      ]
    }
  ];

  const products = [
    {
      id: '1',
      name: 'Premium Pizza Boxes (10")',
      category: 'Packaging',
      price: '₹1,200',
      unit: 'per 100 pcs',
      rating: 4.8,
      reviews: 124,
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=400&auto=format&fit=crop',
      badge: 'Best Seller'
    },
    {
      id: '2',
      name: 'Eco-friendly Burger Containers',
      category: 'Packaging',
      price: '₹850',
      unit: 'per 100 pcs',
      rating: 4.6,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1604147706283-d7119b5b822c?q=80&w=400&auto=format&fit=crop'
    },
    {
      id: '3',
      name: 'Restaurant Table Tents',
      category: 'Marketing',
      price: '₹450',
      unit: 'per 50 pcs',
      rating: 4.5,
      reviews: 42,
      image: 'https://images.unsplash.com/photo-1543165365-07232ed12fad?q=80&w=400&auto=format&fit=crop'
    },
    {
      id: '4',
      name: 'Premium Coffee Beans (Arabica)',
      category: 'Ingredients',
      price: '₹1,500',
      unit: 'per 1 kg',
      rating: 4.9,
      reviews: 215,
      image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=400&auto=format&fit=crop',
      badge: 'New'
    }
  ];

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleQuickFilter = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };
  
  const resetFilters = () => {
    setDraftRating(null);
    setDraftDistance(3);
    setDraftDietary([]);
    setDraftOffersOnly(false);
    setDraftSort(null);
  };
  
  const applyFilters = () => {
    // In a real app we would apply these states to the active filter variables
    setShowFilterSheet(false);
  };

  const toggleDietaryDraft = (diet: string) => {
    setDraftDietary(prev => 
      prev.includes(diet) ? prev.filter(d => d !== diet) : [...prev, diet]
    );
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] pb-24 font-dm">
      {/* Hero Section */}
      <div className="px-4 pt-6 pb-2">
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 mb-1 cursor-pointer" onClick={() => setShowLocationSheet(true)}>
              <MapPin size={22} className="text-[#00bd6f] stroke-[2.5]" />
              <h1 className="text-[20px] font-bold text-[#00bd6f] tracking-tight">Home</h1>
              <ChevronDown size={20} className="text-[#00bd6f] stroke-[2.5]" />
            </div>
            <p className="text-[14px] font-medium text-slate-500 truncate max-w-[260px]">
              House No 37-C, 2nd Floor, Janta Fl...
            </p>
          </div>
          <button 
            onClick={onBack} // Optional: bind onBack to user profile or back button if needed, here keeping to the requested design
            className="w-[48px] h-[48px] bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 active:scale-95 transition-transform shrink-0"
          >
            <User size={22} className="text-slate-600" />
          </button>
        </div>

        {/* Search Bar - Menu View Style */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" size={20} />
          <input 
            type="text" 
            placeholder='Search for "plum cake"' 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[52px] bg-[#FFFFFF] border border-[#E5E7EB] text-[#111827] py-4 pl-12 pr-12 rounded-[16px] focus:outline-none focus:border-[#00bd6f] text-[15px] font-medium transition-all"
          />
          <Mic 
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#00bd6f] cursor-pointer active:scale-90 transition-transform" 
            size={20} 
            strokeWidth={2.5}
            onClick={() => setShowVoiceSearchSheet(true)}
          />
        </div>
      </div>

      <div className="p-4 space-y-6 pt-2">
        {/* Promotional Banner */}
        <div className="bg-gradient-to-r from-[#00bd6f] to-[#009b5a] rounded-[24px] p-5 text-white shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFFFFF]/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <span className="inline-block px-2.5 py-1 bg-[#FFFFFF]/20 backdrop-blur-sm rounded-lg text-[11px] font-bold uppercase tracking-wider mb-2">Special Offer</span>
            <h3 className="text-xl font-bold mb-1">Get 20% Off</h3>
            <p className="text-green-50 text-sm mb-4">On all eco-friendly packaging</p>
            <button className="bg-[#FFFFFF] text-[#00bd6f] px-5 py-2 rounded-xl text-sm font-bold active:scale-95 transition-transform">
              Shop Now
            </button>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h2 className="text-[16px] font-bold text-slate-900 mb-3">Categories</h2>
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex flex-col items-center justify-center min-w-[80px] h-[80px] rounded-[20px] transition-all duration-300 flex-shrink-0 border ${
                    isActive 
                      ? 'bg-[#00bd6f] text-white border-[#00bd6f] shadow-md shadow-[#00bd6f]/30' 
                      : 'bg-[#FFFFFF] text-slate-600 border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={24} className="mb-2" />
                  <span className="text-[12px] font-medium">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured Brands */}
        <div>
          <h2 className="text-[16px] font-bold text-slate-900 mb-3">Featured Brands</h2>
          <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0">
            {featuredBrands.map((brand) => (
              <div key={brand.id} className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer">
                <div className="w-[72px] h-[72px] rounded-full overflow-hidden border border-slate-100 shadow-sm">
                  <img src={brand.image} alt={brand.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-[12px] font-medium text-slate-700">{brand.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex gap-[8px] overflow-x-auto no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0 lg:flex-wrap">
          <button
            onClick={() => setShowFilterSheet(true)}
            className="h-[36px] px-[14px] rounded-[18px] text-[14px] font-medium whitespace-nowrap transition-all duration-300 flex-shrink-0 flex items-center gap-1.5 font-sans bg-[#FFFFFF] border border-[#E5E7EB] text-[#374151]"
          >
            <SlidersHorizontal size={16} /> Filter
          </button>
          
          {['Free delivery', 'Offer', 'Veg', 'Non-veg', 'Egg', 'Under 100rs'].map((filter) => {
            const isActive = activeFilters.includes(filter);
            return (
              <button
                key={filter}
                onClick={() => toggleQuickFilter(filter)}
                className={`h-[36px] px-[14px] rounded-[18px] text-[14px] font-medium whitespace-nowrap transition-all duration-300 flex-shrink-0 flex items-center gap-1.5 font-sans ${
                  isActive 
                    ? 'bg-[#e6f8f1] text-[#00bd6f] border border-[#e6f8f1]' 
                    : 'bg-[#FFFFFF] border border-[#E5E7EB] text-[#374151]'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* Featured Vendors */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[20px] font-bold text-slate-900 leading-tight">Explore all vendors</h2>
              <p className="text-[13px] text-slate-500">{featuredVendors.length} vendors available</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-5">
            {featuredVendors.map((vendor) => (
              <div key={vendor.id} className="bg-[#FFFFFF] rounded-[20px] border border-slate-200 p-3 flex flex-col cursor-pointer transition-shadow">
                
                {/* Vendor Header */}
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="inline-block px-1.5 py-0.5 bg-[#FFF3E0] text-[#E65100] text-[9px] font-bold uppercase tracking-wider rounded w-fit mb-1.5">{vendor.badge}</span>
                    <h3 className="text-[16px] font-bold text-slate-900 leading-tight mb-0.5">{vendor.name}</h3>
                    <p className="text-[12px] font-medium text-slate-600 mb-0.5">{vendor.details}</p>
                    <p className="text-[12px] text-slate-500 line-clamp-1">{vendor.tags}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-[#00bd6f] text-white px-2 py-0.5 rounded-lg shrink-0">
                    <span className="text-[12px] font-bold">{vendor.rating}</span>
                    <Star size={10} className="fill-white text-white" />
                  </div>
                </div>

                {/* Inline Products Scroll */}
                <div className="flex gap-2.5 overflow-x-auto no-scrollbar -mx-3 px-3 py-1 mt-1">
                  {vendor.products.map(prod => (
                    <div key={prod.id} className="w-[110px] flex-shrink-0 relative">
                       <div className="relative h-[86px] rounded-[14px] overflow-hidden mb-1.5 border border-slate-100">
                         <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                         <div className="absolute top-0 left-0 bg-[#FFFFFF]/95 backdrop-blur-sm px-1.5 py-0.5 rounded-br-md text-[#00bd6f] text-[8px] font-bold tracking-wider">
                           {prod.label}
                         </div>
                         <div className="absolute bottom-1.5 left-1.5 text-white font-bold text-[13px] leading-none">
                           {prod.price}
                         </div>
                         <button className="absolute bottom-1.5 right-1.5 w-6 h-6 bg-[#FFFFFF] rounded-full flex items-center justify-center text-[#00bd6f] shadow-sm active:scale-90 transition-transform">
                           <Plus size={14} strokeWidth={3} />
                         </button>
                       </div>
                       <div className="flex items-start gap-1">
                          <div className={`mt-[3px] w-2.5 h-2.5 shrink-0 rounded-sm border flex items-center justify-center ${prod.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                             <div className={`w-1 h-1 rounded-full ${prod.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
                          </div>
                          <span className="text-[11px] font-bold text-slate-800 leading-tight line-clamp-2">{prod.name}</span>
                       </div>
                    </div>
                  ))}
                </div>

                {/* Offer Footer */}
                <div className="mt-3 bg-[#F4F7FB] rounded-lg px-2.5 py-2 flex items-center gap-1.5 border border-slate-100">
                  <div className="w-4 h-4 rounded-full bg-[#E6F8F1] flex items-center justify-center shrink-0">
                     <Star size={8} className="fill-[#00bd6f] text-[#00bd6f]" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700">{vendor.offerText}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* View Cart Snackbar */}
      {showCartSnackbar && (
        <div className="fixed bottom-[90px] left-4 right-4 z-50 max-w-md mx-auto lg:bottom-10 lg:left-auto lg:right-10 lg:w-[400px]">
          <div className="h-[64px] rounded-[16px] bg-[#FFFFFF] p-3 shadow-xl border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center relative border border-slate-100">
                <ShoppingCart size={20} className="text-slate-700" />
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                  2
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-bold text-slate-900 leading-tight">₹2,400</span>
                <span className="text-[12px] text-slate-500 leading-tight mt-0.5">Plus taxes</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowCartSnackbar(false)}
                className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <Trash2 size={18} />
              </button>
              <button 
                onClick={onNavigateToCheckout}
                className="h-[40px] px-4 rounded-xl bg-[#00bd6f] text-white text-[14px] font-bold active:scale-95 transition-transform flex items-center gap-1.5"
              >
                View Cart <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Bottom Sheet */}
      {showFilterSheet && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 sm:items-center transition-opacity" onClick={() => setShowFilterSheet(false)}>
          <div 
            onClick={e => e.stopPropagation()} 
            className="w-full bg-[#FFFFFF] rounded-t-2xl sm:rounded-2xl sm:max-w-sm p-6 animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:fade-in duration-300 flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between mb-4 shrink-0">
              <h3 className="text-lg font-bold text-slate-900">Filters</h3>
              <button onClick={resetFilters} className="text-[14px] font-medium text-[#00bd6f] active:scale-95 transition-transform">Reset</button>
            </div>
            
            <div className="overflow-y-auto flex-1 no-scrollbar pb-4 -mx-2 px-2 space-y-8">
              {/* Rating */}
              <div>
                <h3 className="text-[15px] font-bold text-slate-900 mb-3">Rating</h3>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button 
                      key={star}
                      onClick={() => setDraftRating(star === draftRating ? null : star)}
                      className={`h-[40px] px-4 rounded-xl flex items-center gap-1.5 flex-shrink-0 border transition-all ${
                        draftRating === star 
                          ? 'bg-amber-50 border-amber-200 text-amber-700' 
                          : 'bg-[#FFFFFF] border-slate-200 text-slate-600'
                      }`}
                    >
                      <Star size={16} className={draftRating === star ? 'fill-amber-500 text-amber-500' : 'text-slate-400'} />
                      <span className="font-medium text-[14px]">{star} Star</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Distance Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[15px] font-bold text-slate-900">Distance</h3>
                  <span className="text-[14px] font-medium text-[#00bd6f]">Up to {draftDistance} km</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="7" 
                  step="0.5"
                  value={draftDistance} 
                  onChange={(e) => setDraftDistance(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#00bd6f]"
                />
                <div className="flex justify-between text-[12px] text-slate-400 mt-2 font-medium">
                  <span>0 km</span>
                  <span>7 km</span>
                </div>
              </div>

              {/* Dietary Preferences */}
              <div>
                <h3 className="text-[15px] font-bold text-slate-900 mb-3">Dietary Preferences</h3>
                <div className="flex gap-3 flex-wrap">
                  <button 
                    onClick={() => toggleDietaryDraft('Veg')}
                    className={`h-[42px] px-4 rounded-xl border flex items-center gap-2 transition-all ${
                      draftDietary.includes('Veg') ? 'border-green-500 bg-green-50' : 'border-slate-200 bg-[#FFFFFF]'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-sm border border-green-600 flex items-center justify-center">
                       <div className="w-2 h-2 rounded-full bg-green-600"></div>
                    </div>
                    <span className={`text-[14px] font-medium ${draftDietary.includes('Veg') ? 'text-green-700' : 'text-slate-700'}`}>Veg</span>
                  </button>
                  <button 
                    onClick={() => toggleDietaryDraft('Non-veg')}
                    className={`h-[42px] px-4 rounded-xl border flex items-center gap-2 transition-all ${
                      draftDietary.includes('Non-veg') ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-[#FFFFFF]'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-sm border border-red-600 flex items-center justify-center">
                       <div className="w-0 h-0 border-l-[4px] border-l-transparent border-b-[6px] border-b-red-600 border-r-[4px] border-r-transparent"></div>
                    </div>
                    <span className={`text-[14px] font-medium ${draftDietary.includes('Non-veg') ? 'text-red-700' : 'text-slate-700'}`}>Non-veg</span>
                  </button>
                  <button 
                    onClick={() => toggleDietaryDraft('Egg')}
                    className={`h-[42px] px-4 rounded-xl border flex items-center gap-2 transition-all ${
                      draftDietary.includes('Egg') ? 'border-yellow-500 bg-yellow-50' : 'border-slate-200 bg-[#FFFFFF]'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-sm border border-yellow-600 flex items-center justify-center">
                       <div className="w-2.5 h-2 rounded-full bg-yellow-600"></div>
                    </div>
                    <span className={`text-[14px] font-medium ${draftDietary.includes('Egg') ? 'text-yellow-700' : 'text-slate-700'}`}>Egg</span>
                  </button>
                </div>
              </div>

              {/* Offers & Discounts */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[15px] font-bold text-slate-900 mb-0.5">Offers & Discounts</h3>
                  <p className="text-[13px] text-slate-500">Show only places with deals</p>
                </div>
                <button 
                  onClick={() => setDraftOffersOnly(!draftOffersOnly)}
                  className={`w-12 h-6 rounded-full transition-colors duration-300 relative ${draftOffersOnly ? 'bg-[#00bd6f]' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-[#FFFFFF] transition-transform duration-300 ease-in-out shadow-sm ${draftOffersOnly ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Sort By Price */}
              <div>
                <h3 className="text-[15px] font-bold text-slate-900 mb-3">Sort by Price</h3>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center w-5 h-5">
                      <input 
                        type="radio" 
                        name="sort" 
                        className="peer appearance-none w-5 h-5 border border-slate-300 rounded-full checked:border-[#00bd6f] checked:border-[6px] transition-all"
                        checked={draftSort === 'low_to_high'}
                        onChange={() => setDraftSort('low_to_high')}
                      />
                    </div>
                    <span className="text-[15px] text-slate-700">Low to High</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center w-5 h-5">
                      <input 
                        type="radio" 
                        name="sort" 
                        className="peer appearance-none w-5 h-5 border border-slate-300 rounded-full checked:border-[#00bd6f] checked:border-[6px] transition-all"
                        checked={draftSort === 'high_to_low'}
                        onChange={() => setDraftSort('high_to_low')}
                      />
                    </div>
                    <span className="text-[15px] text-slate-700">High to Low</span>
                  </label>
                </div>
              </div>

            </div>
            
            <div className="flex gap-3 mt-6 shrink-0">
              <button 
                onClick={() => setShowFilterSheet(false)}
                className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-semibold rounded-xl active:scale-95 transition-transform"
              >
                Cancel
              </button>
              <button 
                onClick={applyFilters}
                className="flex-1 py-3 px-4 bg-[#00bd6f] text-white font-semibold rounded-xl active:scale-95 transition-transform"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Location Bottom Sheet */}
      {showLocationSheet && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 sm:items-center transition-opacity" onClick={() => setShowLocationSheet(false)}>
          <div 
            onClick={e => e.stopPropagation()} 
            className="w-full bg-[#FFFFFF] rounded-t-2xl sm:rounded-2xl sm:max-w-sm p-6 animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:fade-in duration-300 flex flex-col max-h-[90vh]"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-6">Select a location</h3>
            
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" size={20} />
              <input 
                type="text" 
                placeholder="Search area, street name..." 
                className="w-full h-[52px] bg-[#FFFFFF] border border-[#E5E7EB] text-[#111827] py-4 pl-12 pr-12 rounded-[16px] focus:outline-none focus:border-[#00bd6f] text-[15px] font-medium transition-all shadow-sm"
              />
              <Mic className="absolute right-4 top-1/2 -translate-y-1/2 text-[#00bd6f] cursor-pointer" size={20} onClick={() => setShowVoiceSearchSheet(true)} />
            </div>

            <button 
              onClick={() => {
                setShowLocationSheet(false);
                setShowVoiceSearchSheet(true);
              }} 
              className="flex items-center gap-3 w-full p-4 border border-[#E5E7EB] rounded-[16px] mb-3 hover:bg-slate-50 transition-colors shadow-sm active:scale-[0.98]"
            >
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                 <Mic className="text-blue-600" size={20} />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[16px] font-bold text-slate-900 leading-tight">Voice Search</span>
                <span className="text-[13px] text-slate-500 font-medium mt-0.5">Speak area, street or landmark</span>
              </div>
              <ChevronRight className="ml-auto text-slate-400" size={20} />
            </button>
            
            <button 
              onClick={() => {
                setShowLocationSheet(false);
                if (onNavigateToPinOnMap) onNavigateToPinOnMap();
              }} 
              className="flex items-center gap-3 w-full p-4 border border-[#E5E7EB] rounded-[16px] mb-6 hover:bg-slate-50 transition-colors shadow-sm active:scale-[0.98]"
            >
              <div className="w-10 h-10 bg-[#e6f8f1] rounded-full flex items-center justify-center shrink-0">
                 <MapPin className="text-[#00bd6f]" size={20} />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[16px] font-bold text-slate-900 leading-tight">Pin on Map</span>
                <span className="text-[13px] text-slate-500 font-medium mt-0.5">Choose exact location on map</span>
              </div>
              <ChevronRight className="ml-auto text-slate-400" size={20} />
            </button>

            <div className="px-1">
              <h3 className="font-bold text-[18px] text-slate-900 mb-4">Saved Addresses</h3>
              <div className="flex flex-col gap-3">
                 {/* Address Card 1 */}
                 <div className="bg-[#FFFFFF] rounded-[16px] p-4 flex items-start gap-4 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] border border-slate-100 cursor-pointer hover:border-[#00bd6f] transition-all relative group">
                   <div className="mt-1 flex-shrink-0">
                     <Home size={24} className="text-slate-700" strokeWidth={1.5} />
                   </div>
                   <div className="flex flex-col flex-1 pr-4">
                     <div className="flex items-center gap-2 mb-1">
                       <span className="text-[16px] font-bold text-slate-900">Home</span>
                       <span className="bg-[#10B981] text-white px-2 py-0.5 rounded-[4px] text-[10px] font-bold tracking-wide">DEFAULT</span>
                     </div>
                     <span className="text-[14px] text-slate-500 leading-snug">House No 37-C, 2nd Floor, Janta Flats, Block A, Phase 3, Ashok Vihar, Delhi</span>
                   </div>
                   <button className="absolute top-4 right-3 p-1">
                     <MoreVertical size={20} className="text-slate-400" />
                   </button>
                 </div>
                 
                 {/* Address Card 2 */}
                 <div className="bg-[#FFFFFF] rounded-[16px] p-4 flex items-start gap-4 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] border border-slate-100 cursor-pointer hover:border-[#00bd6f] transition-all relative group">
                   <div className="mt-1 flex-shrink-0">
                     <Briefcase size={24} className="text-slate-700" strokeWidth={1.5} />
                   </div>
                   <div className="flex flex-col flex-1 pr-4">
                     <div className="flex items-center gap-2 mb-1">
                       <span className="text-[16px] font-bold text-slate-900">Work</span>
                     </div>
                     <span className="text-[14px] text-slate-500 leading-snug">Tech Park, Building 4, 5th Floor, Sector 62, Noida, Uttar Pradesh</span>
                   </div>
                   <button className="absolute top-4 right-3 p-1">
                     <MoreVertical size={20} className="text-slate-400" />
                   </button>
                 </div>
            
                 {/* Address Card 3 */}
                 <div className="bg-[#FFFFFF] rounded-[16px] p-4 flex items-start gap-4 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] border border-slate-100 cursor-pointer hover:border-[#00bd6f] transition-all relative group">
                   <div className="mt-1 flex-shrink-0">
                     <Map size={24} className="text-slate-700" strokeWidth={1.5} />
                   </div>
                   <div className="flex flex-col flex-1 pr-4">
                     <div className="flex items-center gap-2 mb-1">
                       <span className="text-[16px] font-bold text-slate-900">Other</span>
                     </div>
                     <span className="text-[14px] text-slate-500 leading-snug">12/4, Riverside Apartments, Near Metro Station, Mayur Vihar, Delhi</span>
                   </div>
                   <button className="absolute top-4 right-3 p-1">
                     <MoreVertical size={20} className="text-slate-400" />
                   </button>
                 </div>
              </div>
             </div>
            
            <div className="flex gap-3 mt-6 shrink-0">
              <button 
                onClick={() => setShowLocationSheet(false)}
                className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-semibold rounded-xl active:scale-95 transition-transform"
              >
                Cancel
              </button>
            </div>
            
          </div>
        </div>
      )}

      {/* Voice Search Bottom Sheet */}
      {showVoiceSearchSheet && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 sm:items-center transition-opacity" onClick={() => setShowVoiceSearchSheet(false)}>
          <div 
            onClick={e => e.stopPropagation()} 
            className="w-full bg-[#FFFFFF] rounded-t-3xl sm:rounded-3xl sm:max-w-sm p-8 animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:fade-in duration-300 flex flex-col items-center max-h-[90vh] pb-12"
          >
            <h3 className="text-[20px] font-bold text-slate-900 mb-8 mt-2 text-center">Listening...</h3>
            
            <div className="relative flex items-center justify-center w-32 h-32 mb-8">
              <div className="absolute inset-0 bg-[#00bd6f] rounded-full opacity-20 animate-ping" style={{ animationDuration: '2s' }}></div>
              <div className="absolute inset-2 bg-[#00bd6f] rounded-full opacity-40 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }}></div>
              
              <div className="relative w-20 h-20 bg-[#00bd6f] rounded-full flex items-center justify-center shadow-lg shadow-[#00bd6f]/40 z-10">
                <Mic size={36} className="text-white" strokeWidth={2.5} />
              </div>
            </div>

            <p className="text-[15px] text-slate-500 font-medium mb-10 text-center">Speak what you are looking for<br/>or your area name</p>

            <button 
              onClick={() => setShowVoiceSearchSheet(false)}
              className="w-14 h-14 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center active:scale-95 transition-transform"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </div>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
