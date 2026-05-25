
import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Mic,
  ArrowLeft, 
  Plus, 
  Minus, 
  CheckCircle2,
  CreditCard,
  Banknote,
  Star,
  Circle,
  Menu as MenuIcon,
  LayoutGrid,
  ShoppingBag,
  ChevronRight,
  Utensils,
  AlertCircle,
  Mail,
  User as UserIcon,
  History,
  ChevronDown
} from 'lucide-react';
import { VoiceSearchModal } from './VoiceSearchModal';

interface OfflineOrdersViewProps {
  type: 'Offline Orders' | 'Dine-in';
  onBack: () => void;
}

interface Product {
  id: number;
  code: string;
  name: string;
  price: number;
  originalPrice: number;
  category: string;
  isVeg: boolean;
  image: string;
  description: string;
  rating: string;
  reviewCount: string;
  isBestseller?: boolean;
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    code: 'B-01',
    name: 'Half Chicken Dum Biryani',
    price: 199,
    originalPrice: 359,
    category: 'Biryani',
    isVeg: false,
    description: 'Slow-cooked aromatic rice with succulent chicken pieces.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b11adbbec4?q=80&w=400&auto=format&fit=crop',
    rating: '3.8',
    reviewCount: '224'
  },
  {
    id: 2,
    code: 'B-02',
    name: 'Half Mutton Dum Biryani',
    price: 249,
    originalPrice: 299,
    category: 'Biryani',
    isVeg: false,
    description: 'Tender mutton pieces layered with premium basmati rice.',
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=400&auto=format&fit=crop',
    rating: '3.8',
    reviewCount: '74',
    isBestseller: true
  },
  {
    id: 3,
    code: 'P-01',
    name: 'Paneer Chilly Pizza',
    price: 299,
    originalPrice: 399,
    category: 'Pizza',
    isVeg: true,
    description: 'Fresh cottage cheese with spicy green chillies.',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=400&auto=format&fit=crop',
    rating: '4.2',
    reviewCount: '156',
    isBestseller: true
  },
  {
    id: 4,
    code: 'B-03',
    name: 'Gourmet Veg Burger',
    price: 320,
    originalPrice: 450,
    category: 'Burgers',
    isVeg: true,
    description: 'Crispy quinoa patty with avocado mash.',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=400&auto=format&fit=crop',
    rating: '4.0',
    reviewCount: '89'
  },
  {
    id: 5,
    code: 'S-01',
    name: 'Peri Peri Fries',
    price: 120,
    originalPrice: 180,
    category: 'Sides',
    isVeg: true,
    description: 'Crispy golden fries tossed in spicy peri peri mix.',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=400&auto=format&fit=crop',
    rating: '4.5',
    reviewCount: '1.2k'
  },
  {
    id: 6,
    code: 'D-01',
    name: 'Coke Zero 500ml',
    price: 60,
    originalPrice: 80,
    category: 'Drinks',
    isVeg: true,
    description: 'Chilled refreshing zero sugar coke.',
    image: 'https://images.unsplash.com/photo-1543253687-c931c8e01820?q=80&w=400&auto=format&fit=crop',
    rating: '4.9',
    reviewCount: '3k'
  }
];

const TABLES = Array.from({ length: 12 }, (_, i) => `T${i + 1}`);
const CATEGORIES = ['All', 'Biryani', 'Pizza', 'Burgers', 'Sides', 'Drinks'];

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'pizza': return '🍕';
    case 'sides': return '🍟';
    case 'beverages':
    case 'drinks': return '🥤';
    case 'combos': return '🍱';
    case 'desserts': return '🍰';
    case 'burgers': return '🍔';
    case 'biryani': return '🥘';
    default: return '';
  }
};

export const OfflineOrdersView: React.FC<OfflineOrdersViewProps> = ({ type, onBack }) => {
  const [step, setStep] = useState<'setup' | 'menu' | 'review' | 'payment'>(type === 'Dine-in' ? 'setup' : 'menu');
  const [orderType, setOrderType] = useState<'Offline Orders' | 'Dine-in'>(type);
  const [searchQuery, setSearchQuery] = useState('');
  const [showVoiceSearch, setShowVoiceSearch] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [cart, setCart] = useState<Record<number, number>>({});
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [guestCount, setGuestCount] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerGender, setCustomerGender] = useState<'Male' | 'Female' | 'Other' | null>(null);
  const [isSavedCustomer, setIsSavedCustomer] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'unpaid' | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);

  // Mock past orders
  const pastOrders = [
    { id: 'ORD-5521', date: '2 days ago', total: '450', items: '2x Veg Burger' },
    { id: 'ORD-4410', date: '1 week ago', total: '1240', items: '1x Mutton Biryani, 1x Coke' }
  ];

  useEffect(() => {
    // Mock profile matching logic
    if (customerPhone.length === 10) {
      if (customerPhone.endsWith('0')) { // Arbitrary logic for demo
        setIsSavedCustomer(true);
        setCustomerName('Priya Verma');
        setCustomerEmail('priya.v@gmail.com');
        setCustomerGender('Female');
      } else {
        setIsSavedCustomer(false);
      }
    } else {
      setIsSavedCustomer(false);
      setShowHistory(false);
    }
  }, [customerPhone]);

  const toggleTable = (t: string) => {
    setSelectedTables(prev => 
      prev.includes(t) ? prev.filter(item => item !== t) : [...prev, t]
    );
  };

  const addToCart = (id: number) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id: number) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[id] > 1) {
        newCart[id] -= 1;
      } else {
        delete newCart[id];
      }
      return newCart;
    });
  };

  const totalItems = (Object.values(cart) as number[]).reduce((a: number, b: number) => a + b, 0);
  const subtotal = PRODUCTS.reduce((acc, p) => acc + (cart[p.id] || 0) * p.price, 0);
  const tax = subtotal * 0.05;
  const totalPrice = subtotal + tax;

  const handleReviewProceed = () => {
    let valid = true;
    if (!customerName.trim()) { setNameError(true); valid = false; } else { setNameError(false); }
    if (customerPhone.length < 10) { setPhoneError(true); valid = false; } else { setPhoneError(false); }
    if (valid) setStep('payment');
  };

  const handleCompleteOrder = () => {
    setIsSuccess(true);
    setTimeout(() => { onBack(); }, 2000);
  };

  const filteredProducts = PRODUCTS.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Group products by category
  const groupedProducts = filteredProducts.reduce((acc, product) => {
    if (!acc[product.category]) acc[product.category] = [];
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  const sortedCategories = Object.keys(groupedProducts).sort();

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[300] bg-[#1E90FF] flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-[#FFFFFF] rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle2 size={48} className="text-[#1E90FF]" strokeWidth={3} />
        </div>
        <h2 className="text-3xl font-black text-white text-center tracking-tighter uppercase mb-2">Order Confirmed</h2>
        <p className="text-white/80 text-center font-medium">
            {paymentStatus === 'unpaid' ? 'Unpaid order added to Active Bills' : 'Payment verified successfully'}
        </p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] bg-[#FFFFFF] flex flex-col animate-in slide-in-from-bottom duration-500 overflow-hidden font-sans">
      <div className="bg-[#FFFFFF] px-6 pt-6 pb-4 space-y-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
            <button 
              onClick={() => {
                  if (step === 'setup') onBack();
                  else if (step === 'menu') setStep(type === 'Dine-in' ? 'setup' : 'menu');
                  else if (step === 'review') setStep('menu');
                  else setStep('review');
              }} 
              className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100"
            >
                <ArrowLeft size={20} />
            </button>
            <div className="text-center">
              <h2 className="text-sm font-black text-slate-900 tracking-widest uppercase leading-none">
                {step === 'setup' ? 'Setup' : step === 'menu' ? 'Menu' : step === 'review' ? 'Review' : 'Payment'}
              </h2>
              <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest mt-1.5">{orderType}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50/50 flex items-center justify-center text-blue-500 border border-blue-100">
              <MenuIcon size={18} strokeWidth={2.5} />
            </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {step === 'setup' && (
           <div className="px-6 py-8 space-y-10">
              <section className="space-y-4">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Tables</h3>
                  <div className="grid grid-cols-4 gap-3">
                      {TABLES.map(t => (
                          <button
                              key={t}
                              onClick={() => toggleTable(t)}
                              className={`h-14 rounded-xl text-xs font-black border transition-all ${
                                  selectedTables.includes(t) ? 'bg-blue-500 border-blue-500 text-white' : 'bg-[#FFFFFF] border-slate-100 text-slate-400'
                              }`}
                          >
                              {t}
                          </button>
                      ))}
                  </div>
              </section>
              <button 
                disabled={selectedTables.length === 0}
                onClick={() => setStep('menu')}
                className="w-full h-16 bg-[#1E90FF] text-white rounded-[24px] font-black uppercase tracking-widest disabled:opacity-30"
              >
                Continue
              </button>
           </div>
        )}

        {step === 'menu' && (
          <>
            <div className="sticky top-0 bg-[#FFFFFF] z-30 pt-6 pb-2 shadow-sm">
              {/* Search Bar */}
              <div className="relative mb-6 px-6">
                <Search className="absolute left-10 top-1/2 -translate-y-1/2 text-[#6B7280]" size={20} />
                <input 
                  type="text" 
                  placeholder="Search for dishes" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-[52px] bg-[#FFFFFF] border border-[#E5E7EB] text-[#111827] py-4 pl-12 pr-12 rounded-[16px] focus:outline-none focus:border-blue-500 text-[15px] font-medium transition-all"
                />
                <Mic 
                  className="absolute right-10 top-1/2 -translate-y-1/2 text-[#1E90FF] cursor-pointer" 
                  size={20} 
                  onClick={() => setShowVoiceSearch(true)}
                />
              </div>

              <VoiceSearchModal 
                isOpen={showVoiceSearch} 
                onClose={() => setShowVoiceSearch(false)} 
                onResult={(text) => setSearchQuery(text)}
              />

              {/* Category Filter Chips */}
              <div className="flex gap-[8px] overflow-x-auto no-scrollbar mb-6 -mx-6 px-6">
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`h-[36px] px-[14px] rounded-[18px] text-[14px] font-medium whitespace-nowrap transition-all duration-300 flex-shrink-0 flex items-center gap-1.5 font-sans ${
                      activeCategory === cat 
                        ? 'bg-[#EFF6FF] text-[#1E90FF]' 
                        : 'bg-[#FFFFFF] border border-[#E5E7EB] text-[#374151]'
                    }`}
                  >
                    {getCategoryIcon(cat) && <span className="text-[18px] leading-none">{getCategoryIcon(cat)}</span>}
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-6 py-6 space-y-8 pb-44 bg-[#FFFFFF]">
              {sortedCategories.length > 0 ? (
                sortedCategories.map((catName) => (
                  <div key={catName} className="space-y-6">
                    <div className="flex items-center gap-3 px-2">
                       <div className="h-5 w-1 rounded-full bg-blue-500"></div>
                       <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">{catName}</h3>
                       <div className="flex-1 h-px bg-slate-100"></div>
                       <span className="text-[10px] font-bold text-slate-300">{groupedProducts[catName].length} Items</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-[14px]">
                      {groupedProducts[catName].map((product) => {
                        const qty = cart[product.id] || 0;
                        return (
                          <div key={product.id} className="bg-[#FFFFFF] rounded-[16px] p-[8px] border border-[#E5E7EB] flex flex-col gap-2 animate-in fade-in duration-500">
                            {/* Image Section */}
                            <div className="relative w-full h-[100px] rounded-[10px] overflow-hidden bg-slate-50 shrink-0">
                              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                              
                              {/* Veg/Non-Veg Icon */}
                              <div className="absolute top-1.5 left-1.5 bg-[#FFFFFF] p-1 rounded-md shadow-sm">
                                <div className={`w-2.5 h-2.5 rounded-sm border flex items-center justify-center ${product.isVeg ? 'border-green-500' : 'border-red-500'}`}>
                                  <div className={`w-1 h-1 rounded-full ${product.isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
                                </div>
                              </div>

                              {/* Rating Badge */}
                              <div className="absolute bottom-1.5 right-1.5 bg-[#ECFDF5] text-[#065F46] px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                                <span className="text-[9px] font-medium">⭐ {product.rating}</span>
                              </div>
                            </div>

                            {/* Content Section */}
                            <div className="flex flex-col flex-1 px-1 pb-1">
                              <div className="flex flex-col gap-1 mb-1.5">
                                <h3 className="text-[14px] font-semibold text-[#111827] leading-tight line-clamp-2">{product.name}</h3>
                                <p className="text-[10px] font-medium text-[#6B7280] uppercase tracking-wide">Code: {product.code}</p>
                              </div>
                              
                              <div className="flex items-center justify-between mt-auto pt-2">
                                <div className="flex flex-col">
                                  <span className="text-[10px] font-medium text-[#9CA3AF] line-through leading-none">₹{product.originalPrice}</span>
                                  <span className="text-[15px] font-bold text-[#111827] leading-none mt-1">₹{product.price}</span>
                                </div>
                                
                                {qty === 0 ? (
                                  <button 
                                    onClick={() => addToCart(product.id)} 
                                    className="h-[28px] px-4 bg-[#EFF6FF] text-[#1E90FF] rounded-[8px] text-[12px] font-semibold transition-colors hover:bg-blue-100"
                                  >
                                    ADD
                                  </button>
                                ) : (
                                  <div className="h-[28px] flex items-center gap-2 bg-[#1E90FF] text-white px-2 rounded-[8px]">
                                    <button onClick={() => removeFromCart(product.id)} className="p-0.5 active:scale-75"><Minus size={12} /></button>
                                    <span className="text-[12px] font-semibold w-3 text-center">{qty}</span>
                                    <button onClick={() => addToCart(product.id)} className="p-0.5 active:scale-75"><Plus size={12} /></button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 py-20 text-center text-slate-400">
                  <p className="text-sm font-bold">No items found</p>
                </div>
              )}
            </div>
          </>
        )}

        {step === 'review' && (
          <div className="px-6 py-8 space-y-6">
            {/* Order Type Selection */}
            <div className="bg-[#FFFFFF] rounded-[32px] p-6 border border-slate-100 space-y-4">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Fulfillment</h3>
              <div className="flex gap-3">
                <button 
                  onClick={() => setOrderType('Offline Orders')}
                  className={`flex-1 h-20 rounded-[24px] border-2 transition-all flex flex-col items-center justify-center gap-1.5 ${
                    orderType === 'Offline Orders' 
                      ? 'border-blue-500 bg-blue-50/50 text-blue-600' 
                      : 'border-slate-50 bg-slate-50/30 text-slate-400'
                  }`}
                >
                  <ShoppingBag size={22} strokeWidth={2.5} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Pickup</span>
                </button>
                <button 
                  onClick={() => setOrderType('Dine-in')}
                  className={`flex-1 h-20 rounded-[24px] border-2 transition-all flex flex-col items-center justify-center gap-1.5 ${
                    orderType === 'Dine-in' 
                      ? 'border-blue-500 bg-blue-50/50 text-blue-600' 
                      : 'border-slate-50 bg-slate-50/30 text-slate-400'
                  }`}
                >
                  <Utensils size={22} strokeWidth={2.5} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Dine-in</span>
                </button>
              </div>
              
              {orderType === 'Dine-in' && (
                <div className="space-y-6 pt-4 border-t border-slate-50 mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                   {/* Guest Count */}
                   <div className="flex items-center justify-between">
                      <div className="space-y-1">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Guests</p>
                         <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Enter guest count</p>
                      </div>
                      <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                         <button 
                           onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                           className="w-10 h-10 rounded-xl bg-[#FFFFFF] border border-slate-100 flex items-center justify-center text-slate-400 active:scale-90 transition-all"
                         >
                            <Minus size={16} />
                         </button>
                         <span className="text-xl font-black text-slate-900 w-6 text-center">{guestCount}</span>
                         <button 
                           onClick={() => setGuestCount(guestCount + 1)}
                           className="w-10 h-10 rounded-xl bg-[#FFFFFF] border border-slate-100 flex items-center justify-center text-slate-400 active:scale-90 transition-all"
                         >
                            <Plus size={16} />
                         </button>
                      </div>
                   </div>

                   {/* Table Selection */}
                   <div className="space-y-3">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assign Tables</p>
                      <div className="grid grid-cols-4 gap-2">
                        {TABLES.map(t => (
                          <button
                            key={t}
                            onClick={() => toggleTable(t)}
                            className={`h-11 rounded-xl text-[10px] font-black border transition-all ${
                              selectedTables.includes(t) ? 'bg-blue-500 border-blue-500 text-white' : 'bg-slate-50 border-slate-100 text-slate-400'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                   </div>
                </div>
              )}
            </div>

            {/* Redesigned Customer Details Card */}
            <div className="bg-[#FFFFFF] rounded-[32px] p-6 border border-slate-100 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer Details</h3>
                <div className="flex gap-2">
                  {isSavedCustomer ? (
                    <>
                      <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[8px] font-black uppercase border border-blue-100">Loyal Customer</span>
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[8px] font-black uppercase border border-emerald-100">Regular</span>
                    </>
                  ) : (
                    <span className="px-2 py-1 bg-slate-50 text-slate-400 rounded-lg text-[8px] font-black uppercase border border-slate-100">New Customer</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={16} />
                  <input 
                    placeholder="Phone Number" 
                    type="tel"
                    maxLength={10}
                    className={`w-full h-14 bg-slate-50/50 border rounded-2xl pl-11 pr-5 text-sm font-bold focus:outline-none focus:bg-[#FFFFFF] focus:border-blue-500 transition-all ${phoneError ? 'border-rose-500' : 'border-slate-100'}`} 
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                  />
                  {isSavedCustomer && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <CheckCircle2 size={18} className="text-emerald-500" strokeWidth={3} />
                    </div>
                  )}
                </div>

                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={16} />
                  <input 
                    placeholder="Name" 
                    className={`w-full h-14 bg-slate-50/50 border rounded-2xl pl-11 pr-5 text-sm font-bold focus:outline-none focus:bg-[#FFFFFF] focus:border-blue-500 transition-all ${nameError ? 'border-rose-500' : 'border-slate-100'}`} 
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                  />
                </div>

                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={16} />
                  <input 
                    placeholder="Email Address" 
                    type="email"
                    className="w-full h-14 bg-slate-50/50 border border-slate-100 rounded-2xl pl-11 pr-5 text-sm font-bold focus:outline-none focus:bg-[#FFFFFF] focus:border-blue-500 transition-all" 
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Gender</p>
                  <div className="flex gap-2">
                    {(['Male', 'Female', 'Other'] as const).map(g => (
                      <button 
                        key={g}
                        onClick={() => setCustomerGender(g)}
                        className={`flex-1 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                          customerGender === g 
                            ? 'bg-slate-900 border-slate-900 text-white shadow-md' 
                            : 'bg-[#FFFFFF] border-slate-100 text-slate-400 hover:bg-slate-50'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {isSavedCustomer && (
                <div className="pt-4 border-t border-slate-50 animate-in fade-in slide-in-from-top-2 duration-500">
                  <button 
                    onClick={() => setShowHistory(!showHistory)}
                    className="w-full flex items-center justify-between p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 group active:scale-[0.98] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#FFFFFF] border border-blue-100 flex items-center justify-center text-blue-500">
                        <History size={18} />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-black text-blue-700 uppercase tracking-tight">View Past Orders</p>
                        <p className="text-[9px] font-bold text-blue-500/70 uppercase">History Found: {pastOrders.length} records</p>
                      </div>
                    </div>
                    <div className={`transition-transform duration-300 ${showHistory ? 'rotate-180' : ''}`}>
                      <ChevronDown size={18} className="text-blue-400" />
                    </div>
                  </button>

                  {showHistory && (
                    <div className="mt-3 space-y-2 animate-in slide-in-from-top-2 duration-300">
                      {pastOrders.map(order => (
                        <div key={order.id} className="p-4 bg-[#FFFFFF] rounded-2xl border border-slate-50 flex items-center justify-between shadow-sm">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-semibold text-slate-900">{order.id}</span>
                              <span className="text-[9px] font-bold text-slate-400">• {order.date}</span>
                            </div>
                            <p className="text-[10px] font-medium text-slate-500 mt-1">{order.items}</p>
                          </div>
                          <span className="text-xs font-black text-slate-900">₹{order.total}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="bg-[#FFFFFF] rounded-[32px] p-6 border border-slate-100 space-y-4">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Summary</h3>
               {Object.entries(cart).map(([id, qty]) => {
                 const p = PRODUCTS.find(prod => prod.id === parseInt(id));
                 return (
                   <div key={id} className="flex justify-between text-sm">
                     <span className="font-bold text-slate-600">{qty}x {p?.name}</span>
                     <span className="font-black">₹{(p?.price || 0) * (qty as number)}</span>
                   </div>
                 );
               })}
               <div className="pt-4 border-t border-slate-50 flex justify-between">
                 <span className="text-sm font-black uppercase">Total</span>
                 <span className="text-xl font-black text-blue-500">₹{totalPrice.toFixed(0)}</span>
               </div>
            </div>
          </div>
        )}

        {step === 'payment' && (
           <div className="px-6 py-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setPaymentStatus('paid')}
                  className={`p-6 rounded-[32px] border text-center space-y-3 transition-all ${paymentStatus === 'paid' ? 'bg-blue-500 border-blue-500 text-white' : 'bg-[#FFFFFF] border-slate-100'}`}
                >
                  <CreditCard size={24} className="mx-auto" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Mark Paid</p>
                </button>
                <button 
                  onClick={() => setPaymentStatus('unpaid')}
                  className={`p-6 rounded-[32px] border text-center space-y-3 transition-all ${paymentStatus === 'unpaid' ? 'bg-amber-500 border-amber-500 text-white' : 'bg-[#FFFFFF] border-slate-100'}`}
                >
                  <Banknote size={24} className="mx-auto" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Pay Later</p>
                </button>
              </div>
              <button 
                disabled={!paymentStatus}
                onClick={handleCompleteOrder}
                className="w-full h-16 bg-[#1E90FF] text-white rounded-[24px] font-black uppercase tracking-widest disabled:opacity-30"
              >
                Complete Order
              </button>
           </div>
        )}
      </div>

      {step === 'menu' && totalItems > 0 && (
        <div className="fixed bottom-0 inset-x-0 p-6 bg-[#FFFFFF]/80 backdrop-blur-xl border-t border-slate-100 shadow-[0_-15px_40px_rgba(0,0,0,0.06)] animate-in slide-in-from-bottom duration-500 z-40">
           <button 
            onClick={() => setStep('review')}
            className="w-full h-[72px] bg-[#1E90FF] text-white rounded-[28px] flex items-center justify-between pl-2 pr-6 font-black active:scale-[0.98] transition-all shadow-2xl shadow-blue-500/30 group relative overflow-hidden"
           >
             {/* Glossy Overlay */}
             <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-50 group-hover:scale-110 transition-transform duration-700"></div>
             
             <div className="flex items-center gap-4 relative z-10">
               <div className="bg-[#FFFFFF]/15 w-14 h-14 rounded-[22px] flex items-center justify-center relative backdrop-blur-md border border-white/10 group-hover:bg-[#FFFFFF]/25 transition-colors">
                 <ShoppingBag size={24} strokeWidth={2.5} />
                 <span className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center text-[11px] font-black border-2 border-[#1E90FF] shadow-md animate-in zoom-in duration-300">
                    {totalItems}
                 </span>
               </div>
               <div className="text-left">
                 <p className="text-[14px] uppercase tracking-[0.1em] leading-none">View Review</p>
                 <p className="text-[10px] font-bold text-white/60 uppercase tracking-[0.05em] mt-1.5">{totalItems} items added</p>
               </div>
             </div>
             
             <div className="flex items-center gap-4 relative z-10">
               <div className="h-10 w-[1px] bg-[#FFFFFF]/15"></div>
               <div className="text-right">
                 <p className="text-[11px] font-bold text-white/50 uppercase tracking-widest leading-none mb-1.5">Total</p>
                 <div className="flex items-center gap-2">
                    <span className="text-[20px] tracking-tighter">₹{totalPrice.toFixed(0)}</span>
                    <ChevronRight size={20} strokeWidth={3} className="text-white/40 group-hover:translate-x-1 transition-transform" />
                 </div>
               </div>
             </div>
           </button>
        </div>
      )}

      {step === 'review' && (
        <div className="px-6 pb-10 bg-[#FFFFFF] border-t border-slate-100 mt-auto">
           <button 
            onClick={handleReviewProceed}
            className="w-full h-16 bg-[#1E90FF] text-white rounded-[24px] font-black uppercase tracking-widest mt-4 shadow-xl shadow-blue-500/20"
           >
             Go to Payment
           </button>
        </div>
      )}
    </div>
  );
};
