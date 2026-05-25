import React, { useState } from 'react';
import { 
  Search, 
  Mic, 
  Plus, 
  Minus,
  ArrowLeft,
  X,
  Star,
  Sparkles,
  CheckCircle2,
  Check,
  Printer,
  Receipt,
  Loader2,
  Trash2
} from 'lucide-react';
import { VoiceSearchModal } from './VoiceSearchModal';
import { SAMPLE_ITEMS, MenuItem } from './MenuView';
import { printKOT, printInvoice } from '../lib/print';

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'pizza': return '🍕';
    case 'sides': return '🍟';
    case 'beverages': return '🥤';
    case 'combos': return '🍱';
    case 'desserts': return '🍰';
    default: return '';
  }
};

const getVariations = (item: MenuItem) => {
  const name = item.name.toLowerCase();
  const cat = item.category.toLowerCase();
  
  if (cat === 'pizza') {
    return [
      { name: 'Small', price: item.price },
      { name: 'Medium', price: item.price + 100 },
      { name: 'Large', price: item.price + 200 }
    ];
  }
  if (name.includes('biryani')) {
    return [
      { name: 'Half', price: item.price },
      { name: 'Kilo', price: item.price * 2 }
    ];
  }
  if (name.includes('butter chicken')) {
    return [
      { name: 'Half', price: item.price },
      { name: 'Full', price: item.price * 1.8 }
    ];
  }
  return null;
};

interface CartItem {
  id: string;
  itemId: number;
  name: string;
  variation?: string;
  price: number;
  quantity: number;
  toppings?: { name: string, price: number }[];
}

type ViewState = 'menu' | 'checkout';
type OrderType = 'Dine In' | 'Pick-up' | null;
type PaymentMethod = 'Cash' | 'UPI' | 'Card' | 'Hold' | null;

import { Order } from '../types';

interface CreateOrderViewProps {
  onBack: () => void;
  onCreateOrder?: (order: Order) => void;
  existingOrder?: Order | null;
}

const AVAILABLE_TOPPINGS = [
  { name: 'Extra Cheese', price: 50 },
  { name: 'Mushroom', price: 40 },
  { name: 'Onion', price: 30 },
  { name: 'Jalapeno', price: 40 },
  { name: 'Black Olives', price: 45 },
  { name: 'Extra Paneer', price: 60 }
];

export const CreateOrderView: React.FC<CreateOrderViewProps> = ({ onBack, onCreateOrder, existingOrder }) => {
  const [items] = useState<MenuItem[]>(SAMPLE_ITEMS);
  const [activeCategory, setActiveCategory] = useState('All');
  const [dietaryFilter, setDietaryFilter] = useState('All'); // 'All', 'Veg', 'Non-Veg', 'Egg', 'Bestseller'
  const [searchQuery, setSearchQuery] = useState('');
  const [showVoiceSearch, setShowVoiceSearch] = useState(false);
  const [categories] = useState(['All', 'Pizza', 'Sides', 'Beverages', 'Combos']);
  
  const [viewState, setViewState] = useState<ViewState>('menu');
  const [cart, setCart] = useState<{[key: string]: CartItem}>({});
  const [selectedItemForVariation, setSelectedItemForVariation] = useState<MenuItem | null>(null);
  const [selectedVariationDetails, setSelectedVariationDetails] = useState<{name: string, price: number} | null>(null);
  const [selectedToppings, setSelectedToppings] = useState<{name: string, price: number}[]>([]);

  React.useEffect(() => {
    if (existingOrder && existingOrder.itemList) {
      const initialCart: {[key: string]: CartItem} = {};
      existingOrder.itemList.forEach((item, idx) => {
        const cartId = `existing-${idx}`;
        // Try to find price from SAMPLE_ITEMS or default to 0
        const menuItem = SAMPLE_ITEMS.find(i => i.name.toLowerCase() === item.name.toLowerCase());
        initialCart[cartId] = {
          id: cartId,
          itemId: menuItem ? menuItem.id : idx,
          name: item.name,
          price: menuItem ? menuItem.price : 0,
          quantity: item.quantity
        };
      });
      setCart(initialCart);
    }
  }, [existingOrder]);

  // Checkout state
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerGender, setCustomerGender] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [isRegularCustomer, setIsRegularCustomer] = useState(false);

  const [appliedOffer, setAppliedOffer] = useState<string | null>(null);
  const [customDiscountType, setCustomDiscountType] = useState<'percentage' | 'fixed' | null>(null);
  const [customDiscountValue, setCustomDiscountValue] = useState<string>('');
  const [orderType, setOrderType] = useState<OrderType>(null);
  const [tableNumbers, setTableNumbers] = useState<string[]>([]);
  const [guestCount, setGuestCount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [confirmedOrderDetails, setConfirmedOrderDetails] = useState<any>(null);
  const [showPastOrders, setShowPastOrders] = useState(false);

  // Split Payment State
  const [splitMode, setSplitMode] = useState<'single' | 'equal' | 'custom'>('single');
  const [splitCount, setSplitCount] = useState(2);
  const [customPayments, setCustomPayments] = useState<{ method: string, amount: number }[]>([]);
  const [customPaymentMethod, setCustomPaymentMethod] = useState<string>('Cash');
  const [customPaymentAmount, setCustomPaymentAmount] = useState<string>('');

  const handleAddToCartClick = (item: MenuItem) => {
    const variations = getVariations(item);
    if (variations) {
      setSelectedItemForVariation(item);
      setSelectedVariationDetails(null);
      setSelectedToppings([]);
    } else {
      handleAddToCart(item.id.toString(), item, item.price);
    }
  };

  const handleAddToCart = (cartId: string, item: MenuItem, price: number, variation?: string, toppings?: {name: string, price: number}[]) => {
    setCart(prev => ({
      ...prev,
      [cartId]: {
        id: cartId,
        itemId: item.id,
        name: item.name,
        variation,
        toppings,
        price,
        quantity: (prev[cartId]?.quantity || 0) + 1
      }
    }));
    setSelectedItemForVariation(null);
    setSelectedVariationDetails(null);
    setSelectedToppings([]);
  };

  const handleRemoveFromCart = (cartId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[cartId].quantity > 1) {
        newCart[cartId].quantity -= 1;
      } else {
        delete newCart[cartId];
      }
      return newCart;
    });
  };

  const getItemTotalQuantity = (itemId: number) => {
    return Object.values(cart).filter(c => c.itemId === itemId).reduce((sum, c) => sum + c.quantity, 0);
  };

  const filteredItems = items.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (item.itemCode && item.itemCode.toLowerCase().includes(searchQuery.toLowerCase()));
      
    let matchesDietary = true;
    if (dietaryFilter === 'Veg') matchesDietary = item.isVeg;
    else if (dietaryFilter === 'Non-Veg') matchesDietary = !item.isVeg && item.dietaryType !== 'Egg';
    else if (dietaryFilter === 'Egg') matchesDietary = item.dietaryType === 'Egg';
    else if (dietaryFilter === 'Bestseller') matchesDietary = item.badges?.includes('bestseller') || false;

    return matchesCategory && matchesSearch && matchesDietary && item.isAvailable;
  });

  const groupedItems = filteredItems.reduce((acc, item) => {
    const cat = item.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const cartTotalItems = Object.values(cart).reduce((a, b) => a + b.quantity, 0);
  const cartTotalPrice = Object.values(cart).reduce((total, item) => total + (item.price * item.quantity), 0);

  const itemTotal = cartTotalPrice;
  let discount = 0;
  if (appliedOffer) {
    discount = itemTotal * 0.1; // 10% discount for demo
  } else if (customDiscountType === 'percentage') {
    discount = itemTotal * (Number(customDiscountValue) / 100);
  } else if (customDiscountType === 'fixed') {
    discount = Number(customDiscountValue);
  }
  const subtotal = itemTotal - discount;
  const tax = subtotal * 0.05;
  const netTotal = subtotal + tax;

  const checkoutContent = (
    <div className="min-h-screen lg:min-h-full bg-[#FFFFFF] pb-32 lg:pb-24 font-sans animate-in slide-in-from-right lg:animate-none relative z-50 lg:z-auto overflow-y-auto h-full">
        <button 
          onClick={() => setViewState('menu')} 
          className="lg:hidden absolute top-4 left-4 z-50 w-10 h-10 bg-[#FFFFFF] flex items-center justify-center text-slate-700 active:bg-slate-50 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>

        <div className="p-4 pt-20 space-y-6">
          {/* Order Details */}
          <div className="bg-[#FFFFFF] rounded-2xl p-4 border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-4">Order Details</h3>
            <div className="space-y-4">
              {Object.values(cart).map(item => (
                <div key={item.id} className="flex justify-between items-start">
                  <div className="flex-1 pr-4">
                    <p className="font-semibold text-slate-800">{item.name}</p>
                    {item.variation && <p className="text-[13px] text-slate-500">{item.variation}</p>}
                    {item.toppings && item.toppings.length > 0 && (
                      <p className="text-[12px] text-slate-400 leading-tight mt-0.5 max-w-[200px]">
                        + {item.toppings.map(t => t.name).join(', ')}
                      </p>
                    )}
                    <p className="text-sm font-medium text-slate-900 mt-1">₹{item.price} x {item.quantity}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="font-bold text-slate-900">₹{item.price * item.quantity}</p>
                    <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-1 border border-slate-200">
                      <button onClick={() => handleRemoveFromCart(item.id)} className="w-6 h-6 flex items-center justify-center text-slate-600"><Minus size={14}/></button>
                      <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                      <button onClick={() => handleAddToCart(item.id, items.find(i=>i.id===item.itemId)!, item.price, item.variation, item.toppings)} className="w-6 h-6 flex items-center justify-center text-slate-600"><Plus size={14}/></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Details */}
          <div className="bg-[#FFFFFF] rounded-2xl p-4 border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-4">Customer Details (Optional)</h3>
            <div className="space-y-3">
              <input 
                type="tel" 
                placeholder="Phone Number" 
                value={customerPhone}
                maxLength={10}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  if (val.length <= 10) {
                    setCustomerPhone(val);
                    if (val === '9876543210') {
                      setIsRegularCustomer(true);
                      setCustomerName('John Doe');
                      setCustomerEmail('john.doe@example.com');
                      setCustomerGender('Male');
                    } else if (val.length === 10) {
                      setIsRegularCustomer(false);
                      setCustomerName('');
                      setCustomerEmail('');
                      setCustomerGender('');
                    }
                  }
                }}
                className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none"
              />
              {customerPhone.length === 10 && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  {isRegularCustomer ? (
                    <div className="flex items-center justify-between bg-blue-50 p-3 rounded-xl border border-blue-100 mb-3">
                      <div className="flex items-center gap-2">
                        <Star className="text-blue-600 fill-blue-600" size={16} />
                        <span className="text-sm font-bold text-blue-900">Regular Customer</span>
                      </div>
                      <button onClick={() => setShowPastOrders(true)} className="text-xs font-bold text-blue-600 underline">View Past Orders</button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 bg-green-50 p-3 rounded-xl border border-green-100 mb-3">
                      <Sparkles className="text-green-600" size={16} />
                      <span className="text-sm font-bold text-green-900">New Customer</span>
                    </div>
                  )}
                  <div className="space-y-3">
                    <input type="text" placeholder="Name" value={customerName} onChange={e=>setCustomerName(e.target.value)} className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none" />
                    <select value={customerGender} onChange={e=>setCustomerGender(e.target.value)} className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none bg-[#FFFFFF]">
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <input type="email" placeholder="Email (Optional)" value={customerEmail} onChange={e=>setCustomerEmail(e.target.value)} className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Offers */}
          <div className="bg-[#FFFFFF] rounded-2xl p-4 border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-4">Offers & Discounts</h3>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-4">
              {['OFFLINE10', 'FLAT50'].map(code => (
                <button 
                  key={code}
                  onClick={() => {
                    setAppliedOffer(appliedOffer === code ? null : code);
                    setCustomDiscountType(null);
                    setCustomDiscountValue('');
                  }}
                  className={`shrink-0 px-4 py-2 rounded-xl border font-bold text-sm transition-all ${appliedOffer === code ? 'bg-green-50 border-green-500 text-green-700' : 'bg-[#FFFFFF] border-slate-200 text-slate-700 hover:border-slate-300'}`}
                >
                  {code}
                </button>
              ))}
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 block">Custom Discount</label>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setCustomDiscountType(customDiscountType === 'percentage' ? null : 'percentage');
                    setAppliedOffer(null);
                  }}
                  className={`flex-1 h-10 rounded-lg font-bold border transition-all ${customDiscountType === 'percentage' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-[#FFFFFF] border-slate-200 text-slate-600 hover:border-slate-300'}`}
                >
                  Percentage (%)
                </button>
                <button
                  onClick={() => {
                    setCustomDiscountType(customDiscountType === 'fixed' ? null : 'fixed');
                    setAppliedOffer(null);
                  }}
                  className={`flex-1 h-10 rounded-lg font-bold border transition-all ${customDiscountType === 'fixed' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-[#FFFFFF] border-slate-200 text-slate-600 hover:border-slate-300'}`}
                >
                  Fixed Amount (₹)
                </button>
              </div>
              {customDiscountType && (
                <input
                  type="number"
                  placeholder={customDiscountType === 'percentage' ? "Enter percentage" : "Enter amount"}
                  value={customDiscountValue}
                  onChange={(e) => setCustomDiscountValue(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none"
                />
              )}
            </div>
          </div>

          {/* Order Type */}
          <div className="bg-[#FFFFFF] rounded-2xl p-4 border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-4">Order Type</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button 
                onClick={() => setOrderType('Dine In')}
                className={`h-12 rounded-xl font-bold border transition-all ${orderType === 'Dine In' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-[#FFFFFF] border-slate-200 text-slate-600'}`}
              >
                Dine In
              </button>
              <button 
                onClick={() => setOrderType('Pick-up')}
                className={`h-12 rounded-xl font-bold border transition-all ${orderType === 'Pick-up' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-[#FFFFFF] border-slate-200 text-slate-600'}`}
              >
                Pick-up
              </button>
            </div>
            {orderType === 'Dine In' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-2 block">Select Table(s)</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8'].map(table => (
                      <button
                        key={table}
                        onClick={() => {
                          setTableNumbers(prev => 
                            prev.includes(table) ? prev.filter(t => t !== table) : [...prev, table]
                          );
                        }}
                        className={`h-10 rounded-lg font-bold border transition-all ${tableNumbers.includes(table) ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-[#FFFFFF] border-slate-200 text-slate-600 hover:border-slate-300'}`}
                      >
                        {table}
                      </button>
                    ))}
                  </div>
                </div>
                <input type="number" placeholder="No. of Guests" value={guestCount} onChange={e=>setGuestCount(e.target.value)} className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none" />
              </div>
            )}
          </div>

          {/* Billing Details */}
          <div className="bg-[#FFFFFF] rounded-2xl p-4 border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-4">Billing Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Item Total</span>
                <span>₹{itemTotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({appliedOffer})</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Tax (5%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="pt-2 mt-2 border-t border-slate-100 flex justify-between font-bold text-lg text-slate-900">
                <span>Net Total</span>
                <span>₹{netTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pay Button */}
        <div className="fixed lg:absolute bottom-0 left-0 right-0 p-4 bg-[#FFFFFF] border-t border-slate-100 z-40 max-w-md lg:max-w-none mx-auto">
          <button 
            onClick={() => setShowPaymentModal(true)}
            disabled={!orderType}
            className={`w-full h-[52px] rounded-[16px] font-semibold text-[16px] flex items-center justify-center transition-all ${orderType ? 'bg-[#1E90FF] text-[#FFFFFF] active:scale-[0.98]' : 'bg-slate-200 text-slate-400'}`}
          >
            Pay ₹{netTotal.toFixed(2)}
          </button>
        </div>

        {/* Past Orders Modal */}
      {showPastOrders && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center animate-in fade-in">
          <div className="bg-[#FFFFFF] w-full sm:w-[400px] sm:rounded-2xl rounded-t-2xl h-[80vh] sm:h-[600px] flex flex-col animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-lg text-slate-900">Past Orders</h2>
              <button onClick={() => setShowPastOrders(false)} className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {[
                { id: 'ORD-1029', date: '12 Oct, 2023', items: '2x Margherita Pizza, 1x Coke', total: 540, status: 'Completed' },
                { id: 'ORD-0982', date: '05 Oct, 2023', items: '1x Veg Burger, 1x Fries', total: 250, status: 'Completed' },
                { id: 'ORD-0845', date: '28 Sep, 2023', items: '1x Paneer Tikka, 2x Naan', total: 420, status: 'Completed' },
              ].map((order, idx) => (
                <div key={idx} className="border border-slate-100 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">{order.id}</span>
                      <p className="text-xs text-slate-500">{order.date}</p>
                    </div>
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">{order.status}</span>
                  </div>
                  <p className="text-sm text-slate-700 mb-2">{order.items}</p>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                    <span className="text-sm font-bold text-slate-900">₹{order.total}</span>
                    <button className="text-xs font-bold text-blue-600 border border-blue-200 px-3 py-1 rounded-lg">Reorder</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 z-[100] bg-black/50 flex items-end justify-center animate-in fade-in">
            <div className="bg-[#FFFFFF] w-full max-w-md rounded-t-[24px] p-6 animate-in slide-in-from-bottom-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900">Payment Details</h3>
                <button onClick={() => setShowPaymentModal(false)} className="p-2 bg-slate-100 rounded-full text-slate-600">
                  <X size={20} />
                </button>
              </div>

              {/* Split Mode Selector */}
              <div className="flex gap-2 p-1 bg-slate-100 rounded-xl mb-6">
                <button 
                  onClick={() => setSplitMode('single')}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${splitMode === 'single' ? 'bg-[#FFFFFF] text-slate-900 shadow-sm' : 'text-slate-500'}`}
                >
                  Single
                </button>
                <button 
                  onClick={() => setSplitMode('equal')}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${splitMode === 'equal' ? 'bg-[#FFFFFF] text-slate-900 shadow-sm' : 'text-slate-500'}`}
                >
                  Split Equally
                </button>
                <button 
                  onClick={() => setSplitMode('custom')}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${splitMode === 'custom' ? 'bg-[#FFFFFF] text-slate-900 shadow-sm' : 'text-slate-500'}`}
                >
                  Custom Split
                </button>
              </div>

              {splitMode === 'single' && (
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {['Cash', 'UPI', 'Card', 'Hold'].map(method => (
                    <button 
                      key={method}
                      onClick={() => setPaymentMethod(method as PaymentMethod)}
                      className={`h-14 rounded-xl font-bold border transition-all ${paymentMethod === method ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-[#FFFFFF] border-slate-200 text-slate-700 hover:border-slate-300'}`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              )}

              {splitMode === 'equal' && (
                <div className="mb-6 space-y-4">
                  <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="font-medium text-slate-700">Number of People</span>
                    <div className="flex items-center gap-4">
                      <button onClick={() => setSplitCount(Math.max(2, splitCount - 1))} className="w-8 h-8 flex items-center justify-center bg-[#FFFFFF] border border-slate-200 rounded-full text-slate-600 font-bold">-</button>
                      <span className="text-lg font-bold text-slate-900">{splitCount}</span>
                      <button onClick={() => setSplitCount(splitCount + 1)} className="w-8 h-8 flex items-center justify-center bg-[#FFFFFF] border border-slate-200 rounded-full text-slate-600 font-bold">+</button>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex justify-between items-center">
                    <span className="font-medium text-blue-800">Amount Per Person</span>
                    <span className="text-xl font-bold text-blue-900">₹{(netTotal / splitCount).toFixed(2)}</span>
                  </div>
                </div>
              )}

              {splitMode === 'custom' && (
                <div className="mb-6 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-slate-500">Total Bill: ₹{netTotal.toFixed(2)}</span>
                    <span className={`font-bold ${netTotal - customPayments.reduce((sum, p) => sum + p.amount, 0) === 0 ? 'text-green-600' : 'text-rose-600'}`}>
                      Remaining: ₹{(netTotal - customPayments.reduce((sum, p) => sum + p.amount, 0)).toFixed(2)}
                    </span>
                  </div>

                  {customPayments.map((payment, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-700">{payment.method}</span>
                        <span className="text-slate-900 font-medium">₹{payment.amount.toFixed(2)}</span>
                      </div>
                      <button onClick={() => setCustomPayments(prev => prev.filter((_, i) => i !== idx))} className="text-rose-500 p-1">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}

                  {(netTotal - customPayments.reduce((sum, p) => sum + p.amount, 0)) > 0 && (
                    <div className="flex gap-2 items-end">
                      <div className="flex-1 space-y-1">
                        <label className="text-xs font-medium text-slate-500">Method</label>
                        <select 
                          value={customPaymentMethod}
                          onChange={(e) => setCustomPaymentMethod(e.target.value)}
                          className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 bg-[#FFFFFF] text-sm"
                        >
                          <option value="Cash">Cash</option>
                          <option value="UPI">UPI</option>
                          <option value="Card">Card</option>
                        </select>
                      </div>
                      <div className="flex-1 space-y-1">
                        <label className="text-xs font-medium text-slate-500">Amount (₹)</label>
                        <input 
                          type="number"
                          value={customPaymentAmount}
                          onChange={(e) => setCustomPaymentAmount(e.target.value)}
                          placeholder={(netTotal - customPayments.reduce((sum, p) => sum + p.amount, 0)).toFixed(2)}
                          className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 text-sm"
                        />
                      </div>
                      <button 
                        onClick={() => {
                          const amt = parseFloat(customPaymentAmount) || (netTotal - customPayments.reduce((sum, p) => sum + p.amount, 0));
                          if (amt > 0) {
                            setCustomPayments([...customPayments, { method: customPaymentMethod, amount: amt }]);
                            setCustomPaymentAmount('');
                          }
                        }}
                        className="h-10 px-4 bg-slate-900 text-white rounded-lg text-sm font-bold"
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>
              )}

              <button 
                onClick={() => {
                  setIsPlacingOrder(true);
                  
                  let finalPaymentStatus = 'Paid';
                  let finalPaymentMethod = paymentMethod;

                  if (splitMode === 'equal') {
                    finalPaymentMethod = 'Split Equally' as any;
                  } else if (splitMode === 'custom') {
                    finalPaymentMethod = customPayments.map(p => `${p.method}: ₹${p.amount}`).join(', ') as any;
                  } else if (paymentMethod === 'Hold') {
                    finalPaymentStatus = 'Unpaid';
                  }
                  
                  const newOrder: Order = {
                    id: existingOrder ? existingOrder.id : `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
                    customer: existingOrder ? existingOrder.customer : (customerName || 'Guest'),
                    type: existingOrder ? existingOrder.type : (orderType === 'Dine In' ? 'Dine-in' : 'Offline Orders'),
                    channel: existingOrder ? existingOrder.channel : (orderType === 'Dine In' ? 'offline, dine in' : 'offline, Takeaway'),
                    items: `${Object.values(cart).reduce((acc, item) => acc + item.quantity, 0)} items`,
                    itemList: Object.values(cart).map(item => ({ name: item.name, quantity: item.quantity })),
                    total: `₹${netTotal.toFixed(2)}`,
                    status: existingOrder ? existingOrder.status : 'Incoming',
                    time: existingOrder ? existingOrder.time : 'Just now',
                    paymentStatus: existingOrder ? existingOrder.paymentStatus : (finalPaymentStatus as any),
                    phone: existingOrder ? existingOrder.phone : customerPhone,
                    offer: existingOrder ? existingOrder.offer : (appliedOffer || undefined),
                    tableNumber: existingOrder ? existingOrder.tableNumber : tableNumbers.join(', ')
                  };

                  setTimeout(() => {
                    setIsPlacingOrder(false);
                    if (onCreateOrder) {
                      onCreateOrder(newOrder);
                    }
                    if (!existingOrder) {
                      setConfirmedOrderDetails(newOrder);
                      setOrderConfirmed(true);
                    }
                  }, 1500); // Simulate network request
                }}
                disabled={
                  isPlacingOrder || 
                  (!existingOrder && splitMode === 'single' && !paymentMethod) || 
                  (!existingOrder && splitMode === 'custom' && (netTotal - customPayments.reduce((sum, p) => sum + p.amount, 0)) > 0.01)
                }
                className={`w-full h-[52px] rounded-[16px] font-semibold text-[16px] flex items-center justify-center transition-all ${
                  (!isPlacingOrder && (
                    existingOrder ||
                    (splitMode === 'single' && paymentMethod) || 
                    (splitMode === 'equal') || 
                    (splitMode === 'custom' && (netTotal - customPayments.reduce((sum, p) => sum + p.amount, 0)) <= 0.01)
                  )) ? 'bg-green-600 text-white active:scale-[0.98]' : 'bg-slate-200 text-slate-400'
                }`}
              >
                {isPlacingOrder ? <Loader2 className="animate-spin" size={24} /> : (existingOrder ? 'Update Menu' : 'Save & Confirm Order')}
              </button>
            </div>
          </div>
        )}

        {/* Order Confirmed Overlay */}
        {orderConfirmed && confirmedOrderDetails && (
          <div className="fixed inset-0 z-[200] bg-green-600 flex flex-col items-center justify-center animate-in fade-in p-6">
            <div className="w-24 h-24 bg-[#FFFFFF] rounded-full flex items-center justify-center mb-6 animate-bounce">
              <CheckCircle2 size={48} className="text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Order Confirmed!</h2>
            <p className="text-green-100 mb-8 text-lg">Order ID: {confirmedOrderDetails.id}</p>
            
            <div className="w-full max-w-sm space-y-3">
              <button 
                onClick={() => printKOT(confirmedOrderDetails.id, confirmedOrderDetails.itemList || [], confirmedOrderDetails.tableNumber, confirmedOrderDetails.type)}
                className="w-full h-[56px] bg-[#FFFFFF] text-green-700 rounded-xl font-bold flex items-center justify-center gap-3 active:scale-95 transition-transform"
              >
                <Printer size={20} />
                Print KOT
              </button>
              <button 
                onClick={() => printInvoice(confirmedOrderDetails.id, confirmedOrderDetails.itemList || [], parseFloat(confirmedOrderDetails.total.replace('₹', '')), confirmedOrderDetails.customer, confirmedOrderDetails.type)}
                className="w-full h-[56px] bg-green-700 text-white border border-green-500 rounded-xl font-bold flex items-center justify-center gap-3 active:scale-95 transition-transform"
              >
                <Receipt size={20} />
                Print Invoice
              </button>
              <button 
                onClick={onBack}
                className="w-full h-[56px] bg-transparent text-green-100 rounded-xl font-medium flex items-center justify-center mt-4 active:bg-green-700 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
  );

  const menuContent = (
    <div className="pb-32 lg:pb-0 pt-0 animate-in fade-in duration-500 bg-[#FFFFFF] min-h-screen lg:min-h-full font-sans relative z-50 lg:z-auto overflow-y-auto h-full">
      
      {/* Sticky Header with Search */}
      <div className="sticky top-0 z-40 bg-[#FFFFFF] px-4 py-3 flex items-center gap-3 border-b border-slate-100 shadow-sm">
        <button 
          onClick={onBack} 
          className="w-10 h-10 shrink-0 flex items-center justify-center text-slate-700 active:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search menus or items" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[40px] bg-slate-100 border border-transparent text-slate-900 py-2 pl-10 pr-10 rounded-full focus:outline-none focus:border-blue-500 focus:bg-[#FFFFFF] transition-all text-sm font-medium"
          />
          <Mic 
            className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 cursor-pointer" 
            size={18} 
            onClick={() => setShowVoiceSearch(true)}
          />
        </div>
      </div>

      <div className="px-4 pt-4 bg-[#FFFFFF]">
        <VoiceSearchModal 
          isOpen={showVoiceSearch} 
          onClose={() => setShowVoiceSearch(false)} 
          onResult={(text) => setSearchQuery(text)}
        />

        {/* Dietary Filter Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-2">
          {['All', 'Veg', 'Non-Veg', 'Egg', 'Bestseller'].map(diet => (
            <button 
              key={diet}
              onClick={() => setDietaryFilter(diet)}
              className={`h-[32px] px-4 rounded-full text-[13px] font-bold whitespace-nowrap transition-all duration-300 flex-shrink-0 flex items-center gap-1.5 ${
                dietaryFilter === diet 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'bg-[#FFFFFF] border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {diet === 'Veg' && <span className="text-green-500 text-lg leading-none">•</span>}
              {diet === 'Non-Veg' && <span className="text-red-500 text-lg leading-none">•</span>}
              {diet === 'Egg' && <span className="text-amber-500 text-lg leading-none">•</span>}
              {diet === 'Bestseller' && <Star size={14} className={dietaryFilter === diet ? "text-amber-400 fill-amber-400" : "text-amber-500 fill-amber-500"} />}
              {diet}
            </button>
          ))}
        </div>

        {/* Category Filter Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-2 border-b border-slate-100">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`h-[36px] px-[14px] rounded-[12px] text-[14px] font-bold whitespace-nowrap transition-all duration-300 flex-shrink-0 flex items-center gap-1.5 ${
                activeCategory === cat 
                  ? 'bg-blue-50 text-blue-700 font-bold border-b-2 border-blue-600 rounded-b-none' 
                  : 'bg-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {getCategoryIcon(cat) && <span className="text-[18px] leading-none">{getCategoryIcon(cat)}</span>}
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 pb-8 space-y-8">
        {/* Menu Item Cards Groupped */}
        {Object.keys(groupedItems).length > 0 ? (
          Object.entries(groupedItems).map(([category, catItems]) => (
            <div key={category} className="space-y-4">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{category}</h2>
                <div className="h-px bg-slate-200 flex-1 ml-2"></div>
              </div>
              <div className="flex overflow-x-auto gap-4 no-scrollbar pb-2 snap-x">
                {catItems.map((item) => {
                  const variations = getVariations(item);
                  const totalQty = getItemTotalQuantity(item.id);
                  
                  return (
                    <div key={item.id} className="min-w-[150px] w-[150px] rounded-[16px] p-[8px] border border-slate-200 flex flex-col gap-2 transition-colors duration-300 bg-[#FFFFFF] snap-start">
                      {/* Image Section */}
                      <div className="relative w-full h-[120px] rounded-[10px] overflow-hidden bg-slate-50 shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        
                        {/* Veg/Non-Veg Icon */}
                        <div className="absolute top-1.5 left-1.5 bg-[#FFFFFF] p-1 rounded-md shadow-sm">
                          <div className={`w-2.5 h-2.5 rounded-sm border flex items-center justify-center ${item.isVeg ? 'border-green-500' : 'border-red-500'}`}>
                            <div className={`w-1 h-1 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
                          </div>
                        </div>

                        {/* Rating Badge */}
                        <div className="absolute bottom-1.5 right-1.5 bg-[#ECFDF5] text-[#065F46] px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                          <span className="text-[10px] font-bold">⭐ 4.3</span>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="flex flex-col flex-1 px-1 pb-1">
                        <div className="flex items-start justify-between gap-1 mb-1.5">
                          <h3 className="text-[13px] font-bold text-slate-900 leading-tight flex-1 line-clamp-2">{item.name}</h3>
                        </div>
                        
                        <div className="flex flex-col gap-2 mt-auto">
                          <span className="text-[14px] font-black text-slate-900">₹{item.price}</span>
                          
                          <div className="flex items-center justify-between gap-1 mt-1">
                            {variations ? (
                              <button 
                                onClick={() => handleAddToCartClick(item)}
                                className="w-full h-[32px] bg-[#FFFFFF] border border-[#E5E7EB] text-[#1E90FF] rounded-lg font-bold text-[13px] flex items-center justify-center active:scale-[0.98] transition-all hover:bg-blue-50 hover:border-blue-100"
                              >
                                {totalQty > 0 ? `${totalQty} ADDED +` : 'ADD +'}
                              </button>
                            ) : totalQty > 0 ? (
                              <div className="w-full h-[32px] bg-blue-50 rounded-lg flex items-center justify-between px-2 border border-blue-100">
                                <button 
                                  onClick={() => handleRemoveFromCart(item.id.toString())}
                                  className="w-6 h-6 flex items-center justify-center text-[#1E90FF] active:scale-95 bg-[#FFFFFF] rounded-md shadow-sm"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="text-[13px] font-bold text-[#1E90FF]">{totalQty}</span>
                                <button 
                                  onClick={() => handleAddToCart(item.id.toString(), item, item.price)}
                                  className="w-6 h-6 flex items-center justify-center text-[#1E90FF] active:scale-95 bg-[#FFFFFF] rounded-md shadow-sm"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => handleAddToCartClick(item)}
                                className="w-full h-[32px] bg-[#FFFFFF] border border-[#E5E7EB] text-[#1E90FF] rounded-lg font-bold text-[13px] flex items-center justify-center active:scale-[0.98] transition-all hover:bg-blue-50 hover:border-blue-100"
                              >
                                ADD
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center bg-[#FFFFFF] rounded-[18px] border border-dashed border-[#E5E7EB]">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#6B7280]">
                <Search size={24} />
             </div>
             <p className="text-[15px] font-medium text-[#111827]">No matching items</p>
             <p className="text-[13px] text-[#6B7280] mt-1">Try searching by a different name</p>
             {searchQuery && (
               <button 
                onClick={() => setSearchQuery('')}
                className="mt-4 text-[14px] font-medium text-[#1E90FF]"
               >
                 Clear Search
               </button>
             )}
          </div>
        )}
      </div>

      {/* Cart Summary Bottom Bar */}
      {cartTotalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#FFFFFF] border-t border-slate-100 z-50 animate-in slide-in-from-bottom-4 max-w-md mx-auto lg:hidden">
          <div className="flex items-center justify-between mb-3 px-2">
            <div>
              <p className="text-[12px] font-medium text-slate-500 uppercase tracking-wider">Total Items</p>
              <p className="text-[16px] font-bold text-slate-900">{cartTotalItems} items</p>
            </div>
            <div className="text-right">
              <p className="text-[12px] font-medium text-slate-500 uppercase tracking-wider">Subtotal</p>
              <p className="text-[18px] font-black text-[#1E90FF]">₹{cartTotalPrice}</p>
            </div>
          </div>
          <button 
            onClick={() => {
              if (existingOrder) {
                setIsPlacingOrder(true);
                const newOrder: Order = {
                  ...existingOrder,
                  items: `${Object.values(cart).reduce((acc, item) => acc + item.quantity, 0)} items`,
                  itemList: Object.values(cart).map(item => ({ name: item.name, quantity: item.quantity })),
                  total: `₹${netTotal.toFixed(2)}`
                };
                setTimeout(() => {
                  setIsPlacingOrder(false);
                  if (onCreateOrder) onCreateOrder(newOrder);
                }, 500);
              } else {
                setViewState('checkout');
              }
            }}
            className="w-full h-[52px] bg-[#1E90FF] text-[#FFFFFF] rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all"
          >
            {isPlacingOrder ? <Loader2 className="animate-spin" size={24} /> : (existingOrder ? 'Update Menu' : 'Continue to Order')}
          </button>
        </div>
      )}

      {/* Variation Selection Modal */}
      {selectedItemForVariation && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-end justify-center animate-in fade-in" onClick={() => setSelectedItemForVariation(null)}>
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="bg-[#FFFFFF] w-full max-w-md rounded-t-[24px] p-6 animate-in slide-in-from-bottom-full overflow-y-auto max-h-[85vh] flex flex-col"
          >
            <div className="flex justify-between items-center mb-4 shrink-0">
              <h3 className="text-xl font-bold text-slate-900">
                {!selectedVariationDetails ? 'Select Variation' : 'Customize Your Pizza'}
              </h3>
              <button 
                onClick={() => {
                  if (selectedVariationDetails) {
                    setSelectedVariationDetails(null);
                    setSelectedToppings([]);
                  } else {
                    setSelectedItemForVariation(null);
                  }
                }} 
                className="p-2 bg-slate-100 rounded-full text-slate-600 active:bg-slate-200"
              >
                {!selectedVariationDetails ? <X size={20} /> : <ArrowLeft size={20} />}
              </button>
            </div>

            {!selectedVariationDetails ? (
              <div className="space-y-3">
                {getVariations(selectedItemForVariation)?.map(v => (
                  <button 
                    key={v.name}
                    onClick={() => {
                      if (selectedItemForVariation.category === 'Pizza') {
                        setSelectedVariationDetails(v);
                      } else {
                        handleAddToCart(`${selectedItemForVariation.id}_${v.name}`, selectedItemForVariation, v.price, v.name);
                      }
                    }}
                    className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all active:scale-[0.98]"
                  >
                    <span className="font-semibold text-slate-800 text-lg">{v.name}</span>
                    <span className="font-bold text-slate-900 text-lg">₹{v.price}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col flex-1 pb-4">
                <div className="mb-4">
                  <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg flex justify-between items-center">
                    <span className="font-semibold text-blue-900">{selectedItemForVariation.name} - {selectedVariationDetails.name}</span>
                    <span className="font-bold text-blue-900">₹{selectedVariationDetails.price}</span>
                  </div>
                </div>

                <div className="space-y-4 flex-1">
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <h4 className="font-bold text-slate-800">Add Toppings</h4>
                      <span className="text-[12px] text-slate-500 font-medium">Optional</span>
                    </div>
                    <div className="space-y-2">
                      {AVAILABLE_TOPPINGS.map(topping => {
                        const isSelected = selectedToppings.some(t => t.name === topping.name);
                        return (
                          <button 
                            key={topping.name}
                            onClick={() => {
                              if (isSelected) {
                                setSelectedToppings(prev => prev.filter(t => t.name !== topping.name));
                              } else {
                                setSelectedToppings(prev => [...prev, topping]);
                              }
                            }}
                            className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all active:scale-[0.98] ${
                              isSelected ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-[#FFFFFF]'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-5 h-5 rounded overflow-hidden flex items-center justify-center border ${
                                isSelected ? 'bg-blue-500 border-blue-500' : 'border-slate-300'
                              }`}>
                                {isSelected && <Check size={14} className="text-white" strokeWidth={3} />}
                              </div>
                              <span className={`font-medium ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>{topping.name}</span>
                            </div>
                            <span className={`font-semibold ${isSelected ? 'text-blue-700' : 'text-slate-600'}`}>+₹{topping.price}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-slate-600">Item Total</span>
                    <span className="font-black text-slate-900 text-xl">
                      ₹{selectedVariationDetails.price + selectedToppings.reduce((sum, t) => sum + t.price, 0)}
                    </span>
                  </div>
                  <button 
                    onClick={() => {
                      const toppingsStr = selectedToppings.length > 0 ? `-${selectedToppings.map(t=>t.name.replace(/\s/g,'')).join('-')}` : '';
                      const cartId = `${selectedItemForVariation.id}_${selectedVariationDetails.name}${toppingsStr}`;
                      const totalPrice = selectedVariationDetails.price + selectedToppings.reduce((sum, t) => sum + t.price, 0);
                      handleAddToCart(cartId, selectedItemForVariation, totalPrice, selectedVariationDetails.name, selectedToppings);
                    }}
                    className="w-full h-[52px] bg-[#1E90FF] text-[#FFFFFF] rounded-[16px] font-bold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all"
                  >
                    Add to Order
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-[#FFFFFF] flex flex-col lg:flex-row">
      {/* Mobile View */}
      <div className="lg:hidden w-full h-full overflow-y-auto">
        {viewState === 'checkout' ? checkoutContent : menuContent}
      </div>
      
      {/* Desktop View */}
      <div className="hidden lg:flex w-full h-full">
        <div className="flex-1 h-full border-r border-slate-200 bg-[#FFFFFF] relative">
          {menuContent}
        </div>
        <div className="w-[400px] xl:w-[480px] h-full bg-slate-50 relative border-l border-slate-200">
          {checkoutContent}
        </div>
      </div>
    </div>
  );
};
