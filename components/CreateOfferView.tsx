import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Percent, 
  Wallet, 
  Tag, 
  Gift, 
  Package, 
  Search, 
  Calendar, 
  Clock, 
  Users, 
  ShoppingBag, 
  CreditCard, 
  Eye, 
  EyeOff, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  ChevronRight,
  X,
  Check
} from 'lucide-react';

interface CreateOfferViewProps {
  onBack: () => void;
}

export const CreateOfferView: React.FC<CreateOfferViewProps> = ({ onBack }) => {
  const [offerName, setOfferName] = useState('');
  const [offerDescription, setOfferDescription] = useState('');
  const [offerType, setOfferType] = useState<'percentage' | 'flat' | 'bogo' | 'combo' | 'free_item'>('percentage');
  
  const [discountPercent, setDiscountPercent] = useState('');
  const [maxCap, setMaxCap] = useState('');
  const [discountAmount, setDiscountAmount] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  
  const [minOrder, setMinOrder] = useState('');
  const [totalUsageLimit, setTotalUsageLimit] = useState('');
  const [perCustomerLimit, setPerCustomerLimit] = useState('');
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  
  const [applicableOn, setApplicableOn] = useState<'all' | 'categories' | 'items'>('all');
  const [customerTargeting, setCustomerTargeting] = useState<'all' | 'new' | 'existing' | 'inactive'>('all');
  
  const [orderTypes, setOrderTypes] = useState({ delivery: true, takeaway: true, dineIn: true, booking: false });
  const [paymentMode, setPaymentMode] = useState<'prepaid' | 'all'>('all');
  
  const [couponSetting, setCouponSetting] = useState<'manual' | 'auto'>('manual');
  const [manualCode, setManualCode] = useState('');
  
  const [visibility, setVisibility] = useState<'visible' | 'private'>('visible');
  
  const [scheduleDays, setScheduleDays] = useState<string[]>([]);
  const [stacking, setStacking] = useState<'allow' | 'disable'>('disable');
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // BOGO selection states
  const [isItemSelectSheetOpen, setIsItemSelectSheetOpen] = useState(false);
  const [itemSearchQuery, setItemSearchQuery] = useState('');
  const [selectedBogoItems, setSelectedBogoItems] = useState<string[]>([]);

  const bogoMenuCategories = [
    { 
      id: 'c1', 
      name: 'Starters',
      items: [
        { id: 'i1', name: 'Paneer Tikka' },
        { id: 'i2', name: 'Chicken Wings' },
        { id: 'i3', name: 'Spring Rolls' }
      ]
    },
    { 
      id: 'c2', 
      name: 'Main Course',
      items: [
        { id: 'i4', name: 'Butter Chicken' },
        { id: 'i5', name: 'Dal Makhani' },
        { id: 'i6', name: 'Garlic Naan' }
      ]
    },
    { 
      id: 'c3', 
      name: 'Desserts',
      items: [
        { id: 'i7', name: 'Gulab Jamun' },
        { id: 'i8', name: 'Ice Cream' }
      ]
    }
  ];

  const allItemIds = bogoMenuCategories.flatMap(c => c.items.map(i => i.id));
  const isAllSelected = selectedBogoItems.length === allItemIds.length && allItemIds.length > 0;

  const handleSelectAllItems = () => {
    if (isAllSelected) {
      setSelectedBogoItems([]);
    } else {
      setSelectedBogoItems(allItemIds);
    }
  };

  const handleSelectCategory = (categoryId: string) => {
    const category = bogoMenuCategories.find(c => c.id === categoryId);
    if (!category) return;
    
    const categoryItemIds = category.items.map(i => i.id);
    const allCategoryItemsSelected = categoryItemIds.every(id => selectedBogoItems.includes(id));
    
    if (allCategoryItemsSelected) {
      setSelectedBogoItems(prev => prev.filter(id => !categoryItemIds.includes(id)));
    } else {
      setSelectedBogoItems(prev => {
        const newSelection = [...prev];
        categoryItemIds.forEach(id => {
          if (!newSelection.includes(id)) newSelection.push(id);
        });
        return newSelection;
      });
    }
  };

  const handleSelectItem = (itemId: string) => {
    setSelectedBogoItems(prev => 
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  // Derived calculations for Cost Impact & Profit Protection
  const estimatedOrders = 150; // Mock base orders
  const avgOrderValue = 400; // Mock AOV
  
  let estimatedDiscountCost = 0;
  let marginWarning = false;
  let highDiscountWarning = false;
  let expectedOrderIncrease = 0;
  let expectedRevenueBoost = 0;

  if (offerType === 'percentage' && discountPercent) {
    const pct = parseFloat(discountPercent);
    const cap = parseFloat(maxCap) || (avgOrderValue * (pct / 100));
    const actualDiscountPerOrder = Math.min(avgOrderValue * (pct / 100), cap);
    estimatedDiscountCost = actualDiscountPerOrder * estimatedOrders;
    
    if (pct > 30) highDiscountWarning = true;
    if (pct > 40) marginWarning = true;
    
    expectedOrderIncrease = Math.min(pct * 0.8, 40); // Mock logic
    expectedRevenueBoost = Math.min(pct * 0.5, 25);
  } else if (offerType === 'flat' && discountAmount) {
    const amt = parseFloat(discountAmount);
    estimatedDiscountCost = amt * estimatedOrders;
    
    if (amt > 150) highDiscountWarning = true;
    if (amt > 200) marginWarning = true;
    
    expectedOrderIncrease = Math.min((amt / avgOrderValue) * 100 * 0.8, 40);
    expectedRevenueBoost = Math.min((amt / avgOrderValue) * 100 * 0.5, 25);
  }

  const handleSave = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onBack();
    }, 2500);
  };

  const toggleOrderType = (type: keyof typeof orderTypes) => {
    setOrderTypes(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const toggleScheduleDay = (day: string) => {
    setScheduleDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const renderPreviewText = () => {
    if (offerType === 'percentage') {
      return `Get ${discountPercent || 'X'}% off${maxCap ? ` up to ₹${maxCap}` : ''} on orders above ₹${minOrder || 'Y'}`;
    } else if (offerType === 'flat') {
      return `Get flat ₹${discountAmount || 'X'} off on orders above ₹${minOrder || 'Y'}`;
    } else if (offerType === 'bogo') {
      const selectedCount = selectedBogoItems.length;
      const itemName = selectedCount === allItemIds.length ? 'all items' : 
                       selectedCount > 0 ? `${selectedCount} selected items` : 
                       (selectedItem || 'selected items');
      return `Buy 1 Get 1 Free on ${itemName} (Min order ₹${minOrder || 'Y'})`;
    } else if (offerType === 'combo') {
      return `Special Combo Offer on ${selectedItem || 'selected items'} (Min order ₹${minOrder || 'Y'})`;
    } else if (offerType === 'free_item') {
      return `Free ${selectedItem || 'item'} on orders above ₹${minOrder || 'Y'}`;
    }
    return 'Configure offer to see preview';
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={40} className="text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Offer created successfully</h2>
        <p className="text-slate-500 text-center mb-8">Track performance in Campaign Dashboard</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] pb-32 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-slate-100 h-[56px] flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : onBack()} className="w-10 h-10 flex items-center justify-center -ml-2 text-slate-700 active:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-[18px] font-semibold text-slate-900">Create Offer <span className="text-slate-400 text-sm font-normal ml-2">Step {currentStep} of 3</span></h1>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Step Progression Indicators */}
        <div className="flex items-center gap-2 mb-2">
          <div className={`h-1.5 flex-1 rounded-full ${currentStep >= 1 ? 'bg-blue-500' : 'bg-slate-100'}`} />
          <div className={`h-1.5 flex-1 rounded-full ${currentStep >= 2 ? 'bg-blue-500' : 'bg-slate-100'}`} />
          <div className={`h-1.5 flex-1 rounded-full ${currentStep >= 3 ? 'bg-blue-500' : 'bg-slate-100'}`} />
        </div>

        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            
            
            {/* Offer Basic Info */}
            <div className="bg-[#FFFFFF] rounded-[20px] p-5 border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-[16px] font-bold text-slate-900 mb-2">Basic Info</h3>
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-slate-600">Offer Name</label>
                <input 
                  type="text" 
                  value={offerName}
                  onChange={(e) => setOfferName(e.target.value)}
                  placeholder="e.g. Weekend Delight"
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-[12px] text-[15px] focus:bg-[#FFFFFF] focus:border-[#1E90FF] focus:outline-none transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-slate-600">Offer Description (Optional)</label>
                <textarea 
                  value={offerDescription}
                  onChange={(e) => setOfferDescription(e.target.value)}
                  placeholder="Additional details for customers..."
                  className="w-full min-h-[80px] p-4 bg-slate-50 border border-slate-200 rounded-[12px] text-[15px] focus:bg-[#FFFFFF] focus:border-[#1E90FF] focus:outline-none transition-colors resize-y"
                />
              </div>
            </div>

            {/* Targeting & Application */}
            <div className="bg-[#FFFFFF] rounded-[20px] p-5 border border-slate-100 shadow-sm space-y-5">
              <h3 className="text-[16px] font-bold text-slate-900 mb-2">Targeting</h3>
              <div className="space-y-3">
                <label className="text-[13px] font-medium text-slate-600">Customer Segment</label>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setCustomerTargeting('all')} className={`h-10 rounded-[10px] text-[13px] font-semibold transition-all ${customerTargeting === 'all' ? 'bg-[#1E90FF] text-white' : 'bg-slate-50 text-slate-600'}`}>All Customers</button>
                  <button onClick={() => setCustomerTargeting('new')} className={`h-10 rounded-[10px] text-[13px] font-semibold transition-all ${customerTargeting === 'new' ? 'bg-[#1E90FF] text-white' : 'bg-slate-50 text-slate-600'}`}>New only</button>
                  <button onClick={() => setCustomerTargeting('existing')} className={`h-10 rounded-[10px] text-[13px] font-semibold transition-all ${customerTargeting === 'existing' ? 'bg-[#1E90FF] text-white' : 'bg-slate-50 text-slate-600'}`}>Existing</button>
                  <button onClick={() => setCustomerTargeting('inactive')} className={`h-10 rounded-[10px] text-[13px] font-semibold transition-all ${customerTargeting === 'inactive' ? 'bg-[#1E90FF] text-white' : 'bg-slate-50 text-slate-600'}`}>Inactive</button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[13px] font-medium text-slate-600">Order Type</label>
                <div className="flex flex-wrap gap-2">
                  {['delivery', 'takeaway', 'dineIn'].map((type) => (
                    <button key={type} onClick={() => toggleOrderType(type as 'delivery'|'takeaway'|'dineIn')} className={`px-4 h-9 rounded-full text-[13px] font-semibold transition-all border ${orderTypes[type as 'delivery'|'takeaway'|'dineIn'] ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600'}`}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="text-[13px] font-medium text-slate-600">Payment Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setPaymentMode('all')} className={`h-10 rounded-[10px] text-[13px] font-semibold transition-all ${paymentMode === 'all' ? 'bg-[#1E90FF] text-white' : 'bg-slate-50 text-slate-600'}`}>All Modes</button>
                  <button onClick={() => setPaymentMode('prepaid')} className={`h-10 rounded-[10px] text-[13px] font-semibold transition-all ${paymentMode === 'prepaid' ? 'bg-[#1E90FF] text-white' : 'bg-slate-50 text-slate-600'}`}>Prepaid Online</button>
                </div>
              </div>
            </div>

            {/* Offer Validity & Scheduling */}
            <div className="bg-[#FFFFFF] rounded-[20px] p-5 border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-[16px] font-bold text-slate-900 mb-2">Validity & Schedule</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-slate-600">Start Date</label>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-[12px] text-[14px] focus:bg-[#FFFFFF] focus:border-[#1E90FF] focus:outline-none transition-colors" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-slate-600">End Date</label>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-[12px] text-[14px] focus:bg-[#FFFFFF] focus:border-[#1E90FF] focus:outline-none transition-colors" />
                </div>
              </div>
              <div className="space-y-1.5 pt-2">
                <label className="text-[13px] font-medium text-slate-600">Valid Days</label>
                <div className="flex flex-wrap gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <button key={day} onClick={() => toggleScheduleDay(day)} className={`w-10 h-10 rounded-full text-[13px] font-semibold transition-all ${scheduleDays.includes(day) ? 'bg-[#1E90FF] text-white' : 'bg-slate-50 text-slate-600'}`}>
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            
            
            
            {/* Offer Type Selection */}
            <div className="bg-[#FFFFFF] rounded-[20px] p-5 border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-[16px] font-bold text-slate-900 mb-2">Offer Mechanics</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'percentage', label: 'Percentage', icon: <Percent size={18} /> },
                  { id: 'flat', label: 'Flat Amount', icon: <Wallet size={18} /> },
                  { id: 'bogo', label: 'BOGO', icon: <Gift size={18} /> },
                  { id: 'free_item', label: 'Free Item', icon: <Package size={18} /> }
                ].map((type) => (
                  <button 
                    key={type.id}
                    onClick={() => setOfferType(type.id as any)}
                    className={`h-[60px] flex items-center gap-3 px-4 rounded-[14px] border transition-all ${offerType === type.id ? 'bg-blue-50 border-blue-200 text-[#1E90FF]' : 'bg-[#FFFFFF] border-slate-200 text-slate-700'}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${offerType === type.id ? 'bg-white' : 'bg-slate-50'}`}>
                      {type.icon}
                    </div>
                    <span className="text-[14px] font-bold">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Discount Configuration */}
            <div className="bg-[#FFFFFF] rounded-[20px] p-5 border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-[16px] font-bold text-slate-900 mb-2">Value Configuration</h3>
              
              {offerType === 'percentage' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-medium text-slate-600">Discount %</label>
                      <div className="relative">
                        <input type="number" value={discountPercent} onChange={(e) => setDiscountPercent(e.target.value)} placeholder="0" className="w-full h-11 pl-4 pr-10 bg-slate-50 border border-slate-200 rounded-[12px] text-[15px] focus:bg-[#FFFFFF] inline-block" />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">%</span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-medium text-slate-600">Max Capping (₹)</label>
                      <input type="number" value={maxCap} onChange={(e) => setMaxCap(e.target.value)} placeholder="0" className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-[12px] text-[15px] focus:bg-[#FFFFFF]" />
                    </div>
                  </div>
                </div>
              )}

              {offerType === 'flat' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-slate-600">Discount Amount (₹)</label>
                    <input type="number" value={discountAmount} onChange={(e) => setDiscountAmount(e.target.value)} placeholder="0" className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-[12px] text-[15px]" />
                  </div>
                </div>
              )}

              {(offerType === 'bogo' || offerType === 'free_item') && (
                <div className="space-y-4 animate-in fade-in">
                  <button onClick={() => setIsItemSelectSheetOpen(true)} className="w-full h-[52px] bg-slate-50 border border-slate-200 border-dashed rounded-[14px] flex items-center justify-center gap-2 text-[#1E90FF] font-bold text-[14px]">
                    <Search size={18} />
                    {selectedBogoItems.length > 0 ? `${selectedBogoItems.length} Items Selected` : 'Choose Items'}
                  </button>
                </div>
              )}
            </div>

            {/* Usage Limits */}
            <div className="bg-[#FFFFFF] rounded-[20px] p-5 border border-slate-100 shadow-sm space-y-4">
               <h3 className="text-[16px] font-bold text-slate-900 mb-2">Conditions</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-slate-600">Min Order Value (₹)</label>
                    <input type="number" value={minOrder} onChange={(e) => setMinOrder(e.target.value)} placeholder="0" className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-[12px] text-[15px]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-slate-600">Per User Usage Limit</label>
                    <input type="number" value={perCustomerLimit} onChange={(e) => setPerCustomerLimit(e.target.value)} placeholder="Uncapped" className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-[12px] text-[15px]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-slate-600">Total Campaign Usage</label>
                    <input type="number" value={totalUsageLimit} onChange={(e) => setTotalUsageLimit(e.target.value)} placeholder="Uncapped" className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-[12px] text-[15px]" />
                  </div>
               </div>
            </div>

          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            
            
            
            
            {/* Coupon & Visibility */}
            <div className="bg-[#FFFFFF] rounded-[20px] p-5 border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-[16px] font-bold text-slate-900 mb-2">Distribution</h3>
              
              <div className="space-y-3">
                <label className="text-[13px] font-medium text-slate-600">Application Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setCouponSetting('auto')} className={`h-10 rounded-[10px] text-[13px] font-semibold transition-all ${couponSetting === 'auto' ? 'bg-[#1E90FF] text-white' : 'bg-slate-50 text-slate-600'}`}>Auto-Apply</button>
                  <button onClick={() => setCouponSetting('manual')} className={`h-10 rounded-[10px] text-[13px] font-semibold transition-all ${couponSetting === 'manual' ? 'bg-[#1E90FF] text-white' : 'bg-slate-50 text-slate-600'}`}>Require Code</button>
                </div>
                {couponSetting === 'manual' && (
                  <div className="animate-in slide-in-from-top-1">
                    <input type="text" value={manualCode} onChange={(e) => setManualCode(e.target.value)} placeholder="e.g. GET50" className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-[12px] text-[15px] uppercase font-mono tracking-wider" />
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100">
                <label className="text-[13px] font-medium text-slate-600">Stacking & Visibility</label>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setStacking(stacking === 'allow' ? 'disable' : 'allow')} className={`h-10 rounded-[10px] text-[13px] font-semibold transition-all border ${stacking === 'allow' ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-white border-slate-200 text-slate-600'}`}>
                    {stacking === 'allow' ? 'Stacking Allowed' : 'Prevent Stacking'}
                  </button>
                  <button onClick={() => setVisibility(visibility === 'visible' ? 'private' : 'visible')} className={`h-10 rounded-[10px] text-[13px] font-semibold transition-all border ${visibility === 'visible' ? 'bg-white border-slate-200 text-slate-600' : 'bg-purple-50 border-purple-200 text-purple-700'}`}>
                    {visibility === 'visible' ? 'Visible to All' : 'Hidden Code'}
                  </button>
                </div>
              </div>
            </div>

            {/* Offer Preview */}
            <div className="bg-slate-900 rounded-[20px] p-5 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Tag size={80} />
              </div>
              <h3 className="text-[13px] font-bold text-slate-400 mb-3 uppercase tracking-wider relative z-10">Live Preview</h3>
              <div className="bg-[#FFFFFF] rounded-[16px] p-4 relative z-10">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-emerald-100 text-emerald-700 p-1.5 rounded-lg"><Tag size={16} /></div>
                    <span className="font-bold text-slate-900">{offerName || 'Offer Name'}</span>
                  </div>
                  {couponSetting === 'manual' && manualCode && (
                    <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-[12px] font-bold font-mono tracking-wider">{manualCode.toUpperCase()}</span>
                  )}
                </div>
                <p className="text-[14px] text-slate-600 leading-snug">{renderPreviewText()}</p>
                {offerDescription && <p className="text-[12px] text-slate-400 mt-2 line-clamp-2">{offerDescription}</p>}
              </div>
            </div>

            {/* Cost Impact */}
            <div className="bg-[#FFFFFF] rounded-[20px] p-5 border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center gap-2 mb-2">
                 <TrendingUp size={18} className="text-blue-500" />
                 <h3 className="text-[16px] font-bold text-slate-900">Projected Impact</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                 <div className="bg-slate-50 p-3 rounded-[12px]">
                   <span className="text-[12px] font-medium text-slate-500 block mb-1">Expected Orders</span>
                   <span className="text-[16px] font-bold text-slate-900">+{expectedOrderIncrease.toFixed(1)}%</span>
                 </div>
                 <div className="bg-slate-50 p-3 rounded-[12px]">
                   <span className="text-[12px] font-medium text-slate-500 block mb-1">Revenue Boost</span>
                   <span className="text-[16px] font-bold text-slate-900">+{expectedRevenueBoost.toFixed(1)}%</span>
                 </div>
              </div>
              {(marginWarning || highDiscountWarning) && (
                <div className="bg-amber-50 rounded-[12px] p-3 flex gap-3 text-amber-800">
                  <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                  <p className="text-[13px] font-medium leading-snug">
                    {marginWarning ? 'This high discount may negatively impact your profit margin. Ensure you have high volume to offset.' : 'High discount selected. Consider adding a max cap limit.'}
                  </p>
                </div>
              )}
            </div>

            {/* Abuse Protection Info */}
            <div className="flex gap-3 bg-blue-50 rounded-[16px] p-4 items-start">
               <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
               <p className="text-[13px] font-semibold text-blue-800 leading-snug">Device fingerprinting and bot protection is active for this campaign to prevent fraud.</p>
            </div>

          </div>
        )}
      </div>

      {/* Save/Next Button */}
      <div className="fixed bottom-[72px] left-0 right-0 p-4 bg-[#FFFFFF] border-t border-slate-100 z-40 max-w-md mx-auto">
        <div className="flex gap-3">
          {currentStep === 1 ? (
            <button 
              onClick={onBack}
              className="flex-1 h-[52px] bg-slate-50 text-slate-700 rounded-[14px] font-semibold text-[16px] active:scale-[0.98] transition-all"
            >
              Cancel
            </button>
          ) : (
            <button 
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="flex-1 h-[52px] bg-slate-50 text-slate-700 rounded-[14px] font-semibold text-[16px] active:scale-[0.98] transition-all"
            >
              Back
            </button>
          )}
          
          {currentStep < 3 ? (
            <button 
              onClick={() => setCurrentStep(prev => prev + 1)} 
              className="flex-[2] h-[52px] bg-[#1E90FF] text-[#FFFFFF] rounded-[14px] font-semibold text-[16px] active:scale-[0.98] transition-all shadow-sm"
            >
              Next Step
            </button>
          ) : (
            <button 
              onClick={handleSave} 
              className="flex-[2] h-[52px] bg-[#1E90FF] text-[#FFFFFF] rounded-[14px] font-semibold text-[16px] active:scale-[0.98] transition-all shadow-sm"
            >
              Finish & Create
            </button>
          )}
        </div>
      </div>

      {/* Select Items Bottom Sheet */}
      {isItemSelectSheetOpen && (
        <div className="fixed inset-0 z-[999] flex items-end justify-center bg-black/50 sm:items-center transition-opacity animate-in fade-in duration-200">
          <div className="bg-[#FFFFFF] w-full sm:max-w-md rounded-t-[24px] sm:rounded-[24px] shadow-xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            
            <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h3 className="text-[18px] font-bold text-slate-900">Select Items</h3>
              <button 
                onClick={() => setIsItemSelectSheetOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 border-b border-slate-100 shrink-0">
              <div className="relative">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={itemSearchQuery}
                  onChange={(e) => setItemSearchQuery(e.target.value)}
                  placeholder="Search items or categories..."
                  className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-[12px] text-[15px] focus:bg-[#FFFFFF] focus:border-[#1E90FF] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              
              <div 
                className="flex items-center gap-3 cursor-pointer"
                onClick={handleSelectAllItems}
              >
                <div className={`w-5 h-5 rounded-[6px] border flex items-center justify-center transition-colors ${
                  isAllSelected ? 'bg-[#1E90FF] border-[#1E90FF]' : 'border-slate-300'
                }`}>
                  {isAllSelected && <Check size={14} className="text-white" />}
                </div>
                <span className="text-[15px] font-bold text-slate-900">Select All Items</span>
              </div>

              <div className="space-y-5">
                {bogoMenuCategories.filter(c => c.name.toLowerCase().includes(itemSearchQuery.toLowerCase()) || c.items.some(i => i.name.toLowerCase().includes(itemSearchQuery.toLowerCase()))).map(category => {
                  
                  const filteredItems = category.items.filter(i => i.name.toLowerCase().includes(itemSearchQuery.toLowerCase()) || category.name.toLowerCase().includes(itemSearchQuery.toLowerCase()));
                  if (filteredItems.length === 0) return null;

                  const categoryItemIds = category.items.map(i => i.id);
                  const isCategoryFullySelected = categoryItemIds.every(id => selectedBogoItems.includes(id));
                  const isCategoryPartiallySelected = categoryItemIds.some(id => selectedBogoItems.includes(id)) && !isCategoryFullySelected;

                  return (
                    <div key={category.id} className="space-y-3">
                      <div 
                        className="flex items-center gap-3 cursor-pointer p-2 bg-slate-50 rounded-lg"
                        onClick={() => handleSelectCategory(category.id)}
                      >
                        <div className={`w-5 h-5 rounded-[6px] border flex items-center justify-center transition-colors ${
                          isCategoryFullySelected ? 'bg-[#1E90FF] border-[#1E90FF]' : 
                          isCategoryPartiallySelected ? 'bg-[#1E90FF] border-[#1E90FF]' : 'border-slate-300 bg-[#FFFFFF]'
                        }`}>
                          {isCategoryFullySelected && <Check size={14} className="text-white" />}
                          {isCategoryPartiallySelected && <div className="w-2.5 h-0.5 bg-white rounded-full" />}
                        </div>
                        <span className="text-[14px] font-bold text-slate-900">{category.name}</span>
                      </div>

                      <div className="space-y-2 pl-3">
                        {filteredItems.map(item => {
                          const isItemSelected = selectedBogoItems.includes(item.id);
                          return (
                            <div 
                              key={item.id} 
                              className="flex items-center gap-3 cursor-pointer py-1.5"
                              onClick={() => handleSelectItem(item.id)}
                            >
                              <div className={`w-5 h-5 rounded-[6px] border flex items-center justify-center transition-colors ${
                                isItemSelected ? 'bg-[#1E90FF] border-[#1E90FF]' : 'border-slate-300'
                              }`}>
                                {isItemSelected && <Check size={14} className="text-white" />}
                              </div>
                              <span className="text-[14px] font-medium text-slate-700">{item.name}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            <div className="p-4 border-t border-slate-100 shrink-0 bg-[#FFFFFF]">
              <button 
                onClick={() => setIsItemSelectSheetOpen(false)}
                className="w-full h-[52px] bg-[#1E90FF] text-[#FFFFFF] rounded-[16px] font-bold text-[16px] active:scale-[0.98] transition-all"
              >
                Confirm Selection ({selectedBogoItems.length})
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
