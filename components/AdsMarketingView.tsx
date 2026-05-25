
import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Info, 
  Megaphone, 
  MessageCircle, 
  MessageSquare, 
  Search, 
  TrendingUp,
  ChevronRight,
  X,
  Calendar,
  Clock,
  Target,
  MousePointerClick,
  MapPin,
  CheckCircle2,
  Package,
  Settings2,
  TrendingDown,
  BarChart3,
  Users,
  Loader2,
  Download,
  Receipt,
  Play,
  Pause,
  CalendarClock,
  MoreVertical,
  FileText
} from 'lucide-react';

export const AdsMarketingView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [showTrendingKeywords, setShowTrendingKeywords] = useState(false);
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);

  const ongoingCampaigns = [
    { 
      id: 1, 
      title: 'Weekend Bestsellers', 
      type: 'App Campaign', 
      status: 'Active',
      spent: 4500,
      budget: 5000,
      orders: 124, 
      revenue: 34500, 
      clicks: 850,
      endsIn: '2 days'
    },
    { 
      id: 2, 
      title: 'New User Push', 
      type: 'Push Notification', 
      status: 'Active',
      spent: 1200,
      budget: 2000,
      orders: 42, 
      revenue: 12800, 
      clicks: 310,
      endsIn: '5 days'
    },
    { 
      id: 3, 
      title: 'Dinner Delights', 
      type: 'Search Boost', 
      status: 'Paused',
      spent: 5000,
      budget: 5000,
      orders: 310, 
      revenue: 89000, 
      clicks: 2100,
      endsIn: 'Completed'
    },
  ];

  if (showTrendingKeywords) {
    return <TrendingKeywordsView onBack={() => setShowTrendingKeywords(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] pb-20">
      {/* Header */}
      <header className="h-[56px] bg-[#FFFFFF] border-b border-slate-100 flex items-center justify-between px-4 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center -ml-2 text-slate-700 active:scale-95 transition-transform">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-[18px] font-semibold text-slate-900">Ads</h1>
        </div>
        <button className="w-10 h-10 flex items-center justify-center -mr-2 text-slate-700 active:scale-95 transition-transform">
          <Info size={22} />
        </button>
      </header>

      <div className="p-4 space-y-6">
        {/* Top Action Buttons Section */}
        <div className="grid grid-cols-2 gap-3">
          {/* Button 1 */}
          <button onClick={() => setShowCreateCampaign(true)} className="h-[auto] min-h-[80px] p-3 bg-[#FFFFFF] border border-[#E5E7EB] rounded-[14px] flex flex-col items-start text-left active:scale-[0.98] transition-all shadow-sm">
            <Megaphone size={20} className="text-[#1E90FF] mb-2" />
            <span className="font-bold text-slate-900 text-sm leading-tight mb-1">Create New Campaign</span>
            <span className="text-[11px] text-slate-500 leading-tight">Promote dishes inside Crevings</span>
          </button>
          {/* Button 2 */}
          <button className="h-[auto] min-h-[80px] p-3 bg-[#FFFFFF] border border-[#E5E7EB] rounded-[14px] flex flex-col items-start text-left active:scale-[0.98] transition-all shadow-sm">
            <MessageCircle size={20} className="text-emerald-600 mb-2" />
            <span className="font-bold text-slate-900 text-sm leading-tight mb-1">Create WhatsApp Campaign</span>
            <span className="text-[11px] text-slate-500 leading-tight">Send offers via WhatsApp</span>
          </button>
          {/* Button 3 */}
          <button className="h-[auto] min-h-[80px] p-3 bg-[#FFFFFF] border border-[#E5E7EB] rounded-[14px] flex flex-col items-start text-left active:scale-[0.98] transition-all shadow-sm">
            <MessageSquare size={20} className="text-amber-600 mb-2" />
            <span className="font-bold text-slate-900 text-sm leading-tight mb-1">Create SMS Campaign</span>
            <span className="text-[11px] text-slate-500 leading-tight">Send offers via SMS</span>
          </button>
          {/* Button 4 */}
          <button onClick={() => setShowTrendingKeywords(true)} className="h-[auto] min-h-[80px] p-3 bg-[#FFFFFF] border border-[#E5E7EB] rounded-[14px] flex flex-col items-start text-left active:scale-[0.98] transition-all shadow-sm">
            <Search size={20} className="text-purple-600 mb-2" />
            <span className="font-bold text-slate-900 text-sm leading-tight mb-1">Search Trending Keywords</span>
            <span className="text-[11px] text-slate-500 leading-tight">Discover demand insights</span>
          </button>
        </div>

        {/* Ongoing Campaign Section */}
        <div>
          <div className="flex justify-between items-center mb-3">
             <h2 className="text-lg font-bold text-slate-900">Ongoing Campaigns</h2>
             <button className="text-sm font-bold text-[#1E90FF]">View All</button>
          </div>
          
          <div className="space-y-4">
            {ongoingCampaigns.map((camp) => {
              const progressLine = (camp.spent / camp.budget) * 100;
              return (
                <div key={camp.id} className="bg-[#FFFFFF] rounded-[24px] border border-slate-200/60 shadow-sm p-5 relative overflow-hidden group">
                  {/* Top Header */}
                  <div className="flex justify-between items-start mb-5">
                    <div className="flex gap-3 items-start">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${camp.status === 'Active' ? 'bg-[#1E90FF]/10 text-[#1E90FF]' : 'bg-slate-100 text-slate-500'}`}>
                        <Megaphone size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="font-bold text-slate-900 text-[16px] leading-tight">{camp.title}</h3>
                          <span className="flex h-2 w-2 relative">
                            {camp.status === 'Active' && <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full opacity-75 bg-[#1E90FF]"></span>}
                            <span className={`relative inline-flex rounded-full h-2 w-2 ${camp.status === 'Active' ? 'bg-[#1E90FF]' : 'bg-amber-400'}`}></span>
                          </span>
                        </div>
                        <p className="text-[12px] text-slate-500 font-medium flex items-center gap-1.5 mt-1">
                          {camp.type} • Ends in {camp.endsIn}
                        </p>
                      </div>
                    </div>
                    <button className="text-slate-400 hover:text-slate-600 transition-colors -mr-2">
                      <MoreVertical size={18} />
                    </button>
                  </div>

                  {/* Progress Section */}
                  <div className="mb-5">
                    <div className="flex justify-between text-[13px] font-bold mb-2">
                      <span className="text-slate-900">₹{camp.spent.toLocaleString()} spent</span>
                      <span className="text-slate-400">₹{camp.budget.toLocaleString()} total</span>
                    </div>
                    <div className="h-[8px] w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${progressLine >= 90 ? 'bg-amber-500' : 'bg-[#1E90FF]'}`} 
                        style={{ width: `${progressLine}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats row - seamless */}
                  <div className="grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100 pt-4">
                     <div className="text-center px-2">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Orders</p>
                        <p className="font-bold text-slate-900 text-[17px]">{camp.orders}</p>
                     </div>
                     <div className="text-center px-2">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Clicks</p>
                        <p className="font-bold text-slate-900 text-[17px]">{camp.clicks.toLocaleString()}</p>
                     </div>
                     <div className="text-center px-2">
                        <p className="text-[11px] font-bold text-[#1E90FF]/80 uppercase tracking-wider mb-1">Revenue</p>
                        <p className="font-bold text-[#1E90FF] text-[17px]">₹{(camp.revenue/1000).toFixed(1)}k</p>
                     </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Locality Insights Section */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-3">Locality Insights</h2>
          <div className="bg-[#FFFFFF] rounded-[20px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <p className="text-xs text-slate-500 mb-1">Male / Female ratio</p>
              <p className="font-semibold text-slate-900">60% Male • 40% Female</p>
            </div>
            <div className="p-4 border-b border-slate-100">
              <p className="text-xs text-slate-500 mb-1">Average Spending Power</p>
              <p className="font-semibold text-slate-900">₹250–₹400</p>
            </div>
            <div className="p-4 border-b border-slate-100">
              <p className="text-xs text-slate-500 mb-1">Top Ordered Dishes</p>
              <p className="font-semibold text-slate-900">Pizza, Biryani, Burger</p>
            </div>
            <div className="p-4 border-b border-slate-100">
              <p className="text-xs text-slate-500 mb-1">Peak Order Time</p>
              <p className="font-semibold text-slate-900">7 PM – 10 PM</p>
            </div>
            <div className="p-4">
              <p className="text-xs text-slate-500 mb-1">High Demand Areas</p>
              <p className="font-semibold text-slate-900">HSR Layout, BTM</p>
            </div>
          </div>
        </div>

        {/* Additional Smart Insights */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-3">Smart Insights</h2>
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-[#FFFFFF] rounded-[16px] border border-slate-100 shadow-sm p-4">
              <p className="text-xs text-slate-500 mb-1">Customer Type Split</p>
              <p className="font-semibold text-slate-900">65% New • 35% Repeat</p>
            </div>
            <div className="bg-[#FFFFFF] rounded-[16px] border border-slate-100 shadow-sm p-4">
              <p className="text-xs text-slate-500 mb-1">Order Type Split</p>
              <p className="font-semibold text-slate-900">70% Delivery • 20% Dine-In • 10% Takeaway</p>
            </div>
            <div className="bg-[#FFFFFF] rounded-[16px] border border-slate-100 shadow-sm p-4">
              <p className="text-xs text-slate-500 mb-1">Trending Price Range</p>
              <p className="font-semibold text-slate-900">₹200–₹300 most selling</p>
            </div>
          </div>
        </div>

        {/* Promote (Push) Section */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-3">Promote Your Dishes</h2>
          <div className="space-y-3">
            {[
              { name: 'Paneer Pizza', price: '₹299', orders: '320' },
              { name: 'Chicken Biryani', price: '₹349', orders: '285' },
              { name: 'Veg Burger Combo', price: '₹199', orders: '210' }
            ].map((item, idx) => (
              <div key={idx} className="bg-[#FFFFFF] rounded-[16px] border border-slate-100 shadow-sm p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">{item.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-semibold text-slate-700">{item.price}</span>
                    <span className="text-xs text-slate-500">• {item.orders} orders</span>
                  </div>
                </div>
                <button className="h-[36px] px-4 bg-slate-900 text-white rounded-xl text-sm font-semibold active:scale-95 transition-transform">
                  Promote
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {showCreateCampaign && (
        <CreateCampaignBottomSheet onClose={() => setShowCreateCampaign(false)} />
      )}
    </div>
  );
};

const TrendingKeywordsView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-[#FFFFFF] pb-20">
      {/* Header */}
      <header className="h-[56px] bg-[#FFFFFF] border-b border-slate-100 flex items-center px-4 sticky top-0 z-20">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center -ml-2 text-slate-700 active:scale-95 transition-transform">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-[18px] font-semibold text-slate-900 ml-2">Trending Keywords</h1>
      </header>

      <div className="p-4 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search for dishes (e.g., Pizza, Biryani)" 
            className="w-full h-[48px] pl-10 pr-4 bg-[#FFFFFF] border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Results Section */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 mb-3">Top Trending in Your Area</h2>
          <div className="space-y-3">
            {[
              { keyword: 'Pizza', orders: '1,240', price: '₹280', demand: 'High', demandColor: 'text-emerald-600 bg-emerald-50' },
              { keyword: 'Biryani', orders: '980', price: '₹320', demand: 'High', demandColor: 'text-emerald-600 bg-emerald-50' },
              { keyword: 'Burger', orders: '650', price: '₹150', demand: 'Medium', demandColor: 'text-amber-600 bg-amber-50' },
              { keyword: 'Pasta', orders: '420', price: '₹250', demand: 'Medium', demandColor: 'text-amber-600 bg-amber-50' }
            ].map((item, idx) => (
              <div key={idx} className="bg-[#FFFFFF] rounded-[16px] border border-slate-100 shadow-sm p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-slate-900 text-lg">{item.keyword}</h3>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${item.demandColor}`}>
                    {item.demand} Demand
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-slate-500 mb-1">Total Orders</p>
                    <p className="font-bold text-slate-900">{item.orders}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-slate-500 mb-1">Avg Price</p>
                    <p className="font-bold text-slate-900">{item.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const CreateCampaignBottomSheet: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'pre-made' | 'manual'>('pre-made');
  
  // Pre-made state
  const [selectedPackage, setSelectedPackage] = useState<number>(0);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  // Manual Setup State
  const [mCampaignName, setMCampaignName] = useState<string>('');
  const [mAmount, setMAmount] = useState<string>('5000');
  const [mType, setMType] = useState<'all' | 'new' | 'old'>('all');
  const [mStartDate, setMStartDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Calculate default manual end date (+7 days)
  const defaultEndDate = new Date();
  defaultEndDate.setDate(defaultEndDate.getDate() + 7);
  const [mEndDate, setMEndDate] = useState(defaultEndDate.toISOString().split('T')[0]);
  
  const [mPlacements, setMPlacements] = useState<string[]>(['top_brand']);
  const [mTimeSlots, setMTimeSlots] = useState<string[]>(['lunch', 'dinner']);

  const packages = [
    { name: 'Starter Boost', price: '₹2,000', duration: 7, desc: 'Ideal for weekend push' },
    { name: 'Growth Plan', price: '₹6,000', duration: 7, desc: 'High visibility all week' },
    { name: 'Domination', price: '₹20,000', duration: 28, desc: 'Month-long premium spots' }
  ];

  const placementOptions = [
    { id: 'top_brand', label: 'Top Brand', cpc: 12 },
    { id: 'search_result', label: 'Search Result', cpc: 8 },
    { id: 'search_bar', label: 'Search Bar Button', cpc: 10 }
  ];

  const timeSlotOptions = [
    { id: 'breakfast', label: 'Breakfast (7AM-11AM)' },
    { id: 'lunch', label: 'Lunch (12PM-4PM)' },
    { id: 'dinner', label: 'Dinner (7PM-11PM)' },
    { id: 'all', label: 'All Hours' },
  ];

  const calculateEndDate = (start: string, days: number) => {
    try {
      const date = new Date(start);
      if (isNaN(date.getTime())) return '-';
      date.setDate(date.getDate() + days);
      return date.toISOString().split('T')[0];
    } catch {
      return '-';
    }
  };

  const togglePlacement = (id: string) => {
    setMPlacements(prev => {
      if (prev.includes(id)) {
        // Prevent deselecting all
        if (prev.length === 1) return prev;
        return prev.filter(p => p !== id);
      }
      return [...prev, id];
    });
  };

  const toggleTimeSlot = (id: string) => {
    if (id === 'all') {
      setMTimeSlots(['all']);
      return;
    }
    setMTimeSlots(prev => {
      const withoutAll = prev.filter(p => p !== 'all');
      if (withoutAll.includes(id)) {
        if (withoutAll.length === 1) return withoutAll; // Keep at least one
        return withoutAll.filter(p => p !== id);
      }
      return [...withoutAll, id];
    });
  };

  // Calculations for Manual
  const avgCpc = mPlacements.length > 0 
    ? placementOptions.filter(p => mPlacements.includes(p.id)).reduce((acc, p) => acc + p.cpc, 0) / mPlacements.length 
    : 10;
  
  const parsedAmount = parseInt(mAmount) || 0;
  const expectedClicks = Math.floor(parsedAmount / avgCpc);
  const expectedOrders = Math.floor(expectedClicks * 0.12); // Assuming 12% conversion
  const expectedRevenue = expectedOrders * 250; // Assuming ₹250 AOV

  const manualDays = Math.max(1, Math.ceil((new Date(mEndDate).getTime() - new Date(mStartDate).getTime()) / (1000 * 60 * 60 * 24)));

  // Payment Flow State
  const [paymentStage, setPaymentStage] = useState<'none' | 'confirm' | 'processing' | 'success'>('none');
  const [checkoutAmount, setCheckoutAmount] = useState<string>('');
  const [checkoutPlan, setCheckoutPlan] = useState<string>('');

  const initiatePayment = () => {
    if (activeTab === 'pre-made') {
      setCheckoutAmount(packages[selectedPackage].price);
      setCheckoutPlan(packages[selectedPackage].name);
    } else {
      setCheckoutAmount(`₹${parsedAmount.toLocaleString()}`);
      setCheckoutPlan(mCampaignName.trim() || 'Custom Manual Campaign');
    }
    setPaymentStage('confirm');
  };

  const processPayment = () => {
    setPaymentStage('processing');
    setTimeout(() => {
      setPaymentStage('success');
    }, 2000);
  };

  const handleFinish = () => {
    setPaymentStage('none');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={paymentStage === 'none' || paymentStage === 'confirm' ? () => paymentStage === 'none' ? onClose() : setPaymentStage('none') : undefined}
      />
      
      {/* Content */}
      <div className="relative bg-[#FFFFFF] rounded-t-[24px] w-full max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300 shadow-2xl">
        {paymentStage === 'none' ? (
          <>
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <div>
                <h2 className="text-[18px] font-bold text-slate-900 leading-tight">Create Campaign</h2>
            <p className="text-[13px] text-slate-500 mt-0.5">Choose how you want to promote</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 active:bg-slate-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Options toggle */}
          <div className="flex p-1 bg-slate-100 rounded-[12px] gap-1">
            <button 
              onClick={() => setActiveTab('pre-made')}
              className={`flex-1 py-2.5 text-[13px] font-bold rounded-[8px] transition-all flex items-center justify-center gap-2 ${
                activeTab === 'pre-made' ? 'bg-[#FFFFFF] text-[#1E90FF] shadow-sm' : 'text-slate-600'
              }`}
            >
              <Package size={16} /> Pre-made Package
            </button>
            <button 
              onClick={() => setActiveTab('manual')}
              className={`flex-1 py-2.5 text-[13px] font-bold rounded-[8px] transition-all flex items-center justify-center gap-2 ${
                activeTab === 'manual' ? 'bg-[#FFFFFF] text-[#1E90FF] shadow-sm' : 'text-slate-600'
              }`}
            >
              <Settings2 size={16} /> Manual Setup
            </button>
          </div>

          {activeTab === 'pre-made' ? (
            <div className="animate-in fade-in duration-300 space-y-6">
              {/* Package Selection */}
              <div>
                <h3 className="text-[14px] font-bold text-slate-900 mb-3">Select Package</h3>
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
                  {packages.map((pkg, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setSelectedPackage(idx)}
                      className={`min-w-[140px] flex-shrink-0 p-4 rounded-[16px] text-left border transition-all ${
                        selectedPackage === idx 
                          ? 'bg-[#1E90FF]/5 border-[#1E90FF] shadow-sm' 
                          : 'bg-[#FFFFFF] border-slate-200 active:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          selectedPackage === idx ? 'bg-[#1E90FF] text-white' : 'border-2 border-slate-300'
                        }`}>
                          {selectedPackage === idx && <CheckCircle2 size={12} strokeWidth={3} />}
                        </div>
                      </div>
                      <h4 className={`text-[15px] font-bold mb-0.5 ${selectedPackage === idx ? 'text-[#1E90FF]' : 'text-slate-900'}`}>{pkg.price}</h4>
                      <p className="text-[12px] font-medium text-slate-600">{pkg.name}</p>
                      <p className="text-[11px] text-slate-500 mt-1">{pkg.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Package Details */}
              <div>
                <h3 className="text-[14px] font-bold text-slate-900 mb-3">Package Details</h3>
                <div className="bg-[#FFFFFF] rounded-[16px] border border-slate-100 shadow-sm p-4 space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                      <span className="text-[13px] text-slate-500">Ad Package Name</span>
                      <span className="text-[13px] font-medium text-slate-900">{packages[selectedPackage].name}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                      <span className="text-[13px] text-slate-500">Outlet Name</span>
                      <span className="text-[13px] font-medium text-slate-900">Crevings HQ</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                      <span className="text-[13px] text-slate-500 flex items-center gap-1.5"><Calendar size={14} /> Start Date</span>
                      <input 
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="text-[13px] font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-[8px] px-2 py-1 outline-none focus:border-[#1E90FF]"
                      />
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                      <span className="text-[13px] text-slate-500 flex items-center gap-1.5"><Calendar size={14} /> End Date</span>
                      <span className="text-[13px] font-medium text-slate-900">{calculateEndDate(startDate, packages[selectedPackage].duration)} ({packages[selectedPackage].duration} days)</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                      <span className="text-[13px] text-slate-500 flex items-center gap-1.5"><Clock size={14} /> Time Slot</span>
                      <span className="text-[13px] font-medium text-slate-900">All logic hours</span>
                    </div>
                    <div className="flex justify-between items-start pb-3 border-b border-slate-50">
                      <span className="text-[13px] text-slate-500 flex items-center gap-1.5 pt-0.5"><MapPin size={14} /> Placement</span>
                      <span className="text-[13px] font-medium text-slate-900 text-right max-w-[150px]">Top brand, Search result, Search bar</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                      <span className="text-[13px] text-slate-500 flex items-center gap-1.5"><Target size={14} /> Target</span>
                      <span className="text-[13px] font-medium text-slate-900">All users</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[13px] text-slate-500 flex items-center gap-1.5"><MousePointerClick size={14} /> CPC Rate</span>
                      <span className="text-[13px] font-medium text-slate-900">₹10 per click</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in duration-300 space-y-6">
              {/* Form Config */}
              <div className="bg-[#FFFFFF] rounded-[16px] border border-slate-100 shadow-sm p-4 space-y-5">
                
                {/* Campaign Name */}
                <div>
                  <label className="text-[12px] font-bold text-slate-900 mb-1.5 block">Campaign Name</label>
                  <input 
                    type="text"
                    value={mCampaignName}
                    onChange={(e) => setMCampaignName(e.target.value)}
                    className="w-full h-[44px] bg-slate-50 border border-slate-200 rounded-[10px] px-3 text-[14px] font-medium text-slate-900 focus:border-[#1E90FF] focus:outline-none"
                    placeholder="E.g. Diwali Special Push"
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="text-[12px] font-bold text-slate-900 mb-1.5 block">Budget Amount (₹)</label>
                  <input 
                    type="number"
                    value={mAmount}
                    onChange={(e) => setMAmount(e.target.value)}
                    className="w-full h-[44px] bg-slate-50 border border-slate-200 rounded-[10px] px-3 text-[14px] font-medium text-slate-900 focus:border-[#1E90FF] focus:outline-none"
                    placeholder="E.g. 5000"
                  />
                </div>

                {/* Target Audience */}
                <div>
                  <label className="text-[12px] font-bold text-slate-900 mb-1.5 block">Customer Target</label>
                  <div className="flex gap-2">
                    {[
                      { id: 'all', label: 'All Users' },
                      { id: 'new', label: 'New Only' },
                      { id: 'old', label: 'Old Only' }
                    ].map(type => (
                      <button 
                        key={type.id}
                        onClick={() => setMType(type.id as any)}
                        className={`flex-1 h-[38px] rounded-[8px] text-[12px] font-bold border transition-colors ${
                          mType === type.id ? 'bg-[#1E90FF]/10 border-[#1E90FF] text-[#1E90FF]' : 'bg-[#FFFFFF] border-slate-200 text-slate-600'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date Range */}
                <div>
                  <div className="flex justify-between items-end mb-1.5">
                    <label className="text-[12px] font-bold text-slate-900 block">Campaign Dates</label>
                    <span className="text-[11px] font-bold text-[#1E90FF] uppercase tracking-wider bg-[#1E90FF]/10 px-2 py-0.5 rounded-md">
                      {manualDays} {manualDays === 1 ? 'Day' : 'Days'} Total
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 mb-1 block">Start Date</label>
                      <input 
                        type="date"
                        value={mStartDate}
                        onChange={(e) => setMStartDate(e.target.value)}
                        className="w-full h-[38px] bg-slate-50 border border-slate-200 rounded-[8px] px-2 text-[13px] font-medium text-slate-900 focus:border-[#1E90FF] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 mb-1 block">End Date</label>
                      <input 
                        type="date"
                        value={mEndDate}
                        onChange={(e) => setMEndDate(e.target.value)}
                        className="w-full h-[38px] bg-slate-50 border border-slate-200 rounded-[8px] px-2 text-[13px] font-medium text-slate-900 focus:border-[#1E90FF] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Placement */}
                <div>
                  <label className="text-[12px] font-bold text-slate-900 mb-1.5 block">Placement Selection</label>
                  <div className="space-y-2">
                    {placementOptions.map((plc) => (
                      <label key={plc.id} className="flex items-center justify-between p-2.5 rounded-[10px] border border-slate-100 hover:bg-slate-50 cursor-pointer">
                         <div className="flex items-center gap-3">
                           <div className={`w-5 h-5 rounded-[6px] border flex items-center justify-center transition-colors ${
                             mPlacements.includes(plc.id) ? 'bg-[#1E90FF] border-[#1E90FF]' : 'bg-[#FFFFFF] border-slate-300'
                           }`}>
                             {mPlacements.includes(plc.id) && <CheckCircle2 size={14} className="text-white" strokeWidth={3} />}
                           </div>
                           <span className="text-[13px] font-medium text-slate-900">{plc.label}</span>
                         </div>
                         <span className="text-[12px] font-bold text-slate-500">₹{plc.cpc} CPC</span>
                         <input type="checkbox" className="hidden" checked={mPlacements.includes(plc.id)} onChange={() => togglePlacement(plc.id)} />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Time Slots */}
                <div>
                  <label className="text-[12px] font-bold text-slate-900 mb-1.5 block">Time Slots</label>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlotOptions.map((ts) => {
                      const splitLabel = ts.label.split(' (');
                      const title = splitLabel[0];
                      const timeDetail = splitLabel[1] ? splitLabel[1].replace(')', '') : '';
                      return (
                        <button 
                          key={ts.id}
                          onClick={() => toggleTimeSlot(ts.id)}
                          className={`min-h-[48px] py-1.5 px-2 rounded-[8px] flex flex-col items-center justify-center border transition-colors ${
                            mTimeSlots.includes(ts.id) ? 'bg-[#1E90FF]/10 border-[#1E90FF] text-[#1E90FF]' : 'bg-[#FFFFFF] border-slate-200 text-slate-600'
                          }`}
                        >
                          <span className="text-[12px] font-bold">{title}</span>
                          {timeDetail && <span className="text-[10px] font-medium opacity-80 leading-tight">{timeDetail}</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Review & Projections */}
              <div>
                 <h3 className="text-[14px] font-bold text-slate-900 mb-3">Review Projections</h3>
                 <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-[#FFFFFF] rounded-[16px] border border-slate-100 p-4 shadow-sm">
                       <p className="text-[12px] text-slate-500 font-medium mb-1 flex items-center gap-1.5"><MousePointerClick size={14} /> Est. Clicks</p>
                       <p className="text-[18px] font-bold text-slate-900">{expectedClicks.toLocaleString()}</p>
                    </div>
                    <div className="bg-[#FFFFFF] rounded-[16px] border border-slate-100 p-4 shadow-sm">
                       <p className="text-[12px] text-slate-500 font-medium mb-1 flex items-center gap-1.5"><Package size={14} /> Est. Orders</p>
                       <p className="text-[18px] font-bold text-[#1E90FF]">~{expectedOrders.toLocaleString()}</p>
                    </div>
                 </div>
                 
                 <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-[16px] border border-emerald-100 p-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 rotate-12 opacity-10">
                       <TrendingUp size={60} className="text-emerald-500" />
                    </div>
                    <p className="text-[12px] font-bold text-emerald-800 tracking-wide uppercase mb-1">Proj. Revenue Growth</p>
                    <p className="text-[24px] font-bold text-emerald-600">₹{expectedRevenue.toLocaleString()}</p>
                    <p className="text-[11px] text-emerald-700/70 mt-1 font-medium">Based on local avg order value & conversion</p>
                 </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {activeTab === 'pre-made' ? (
          <div className="p-4 border-t border-slate-100 bg-[#FFFFFF]">
            <button 
              onClick={initiatePayment}
              className="w-full h-[48px] bg-[#1E90FF] text-white rounded-[14px] font-bold text-[14px] active:scale-95 transition-transform flex items-center justify-center gap-2 shadow-sm shadow-[#1E90FF]/25"
            >
              Confirm & Activate Plan
            </button>
          </div>
        ) : (
          <div className="p-4 border-t border-slate-100 bg-[#FFFFFF]">
             <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-[13px] font-medium text-slate-500">Net Amount to Pay</span>
                <span className="text-[18px] font-bold text-slate-900">₹{parsedAmount.toLocaleString()}</span>
             </div>
            <button 
              onClick={initiatePayment}
              className="w-full h-[48px] bg-slate-900 text-white rounded-[14px] font-bold text-[14px] active:scale-95 transition-transform flex items-center justify-center shadow-sm"
            >
              Review Ad & Pay
            </button>
          </div>
        )}
          </>
        ) : (
          <div className="p-6">
            {paymentStage === 'confirm' && (
               <div className="text-center animate-in fade-in zoom-in-95 duration-300">
                  <h2 className="text-[20px] font-bold text-slate-900 mb-2">Review & Pay</h2>
                  <p className="text-[14px] text-slate-500 mb-6 px-4">You are about to launch <span className="font-bold text-slate-700">{checkoutPlan}</span></p>
                  
                  <div className="bg-slate-50 rounded-[16px] p-6 mb-6">
                     <p className="text-[13px] font-medium text-slate-500 mb-1">Total Amount</p>
                     <p className="text-[36px] font-black text-slate-900 tracking-tight">{checkoutAmount}</p>
                  </div>

                  <div className="flex gap-3">
                     <button 
                        onClick={() => setPaymentStage('none')}
                        className="flex-1 py-3.5 rounded-[14px] font-bold text-slate-600 bg-slate-100 active:bg-slate-200 transition-colors"
                     >
                       Cancel
                     </button>
                     <button 
                        onClick={processPayment}
                        className="flex-1 py-3.5 rounded-[14px] font-bold text-white bg-[#1E90FF] active:scale-95 transition-all shadow-sm shadow-[#1E90FF]/25"
                     >
                       Pay {checkoutAmount}
                     </button>
                  </div>
               </div>
            )}

            {paymentStage === 'processing' && (
               <div className="py-12 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-300">
                  <div className="relative mb-6">
                     <div className="w-16 h-16 rounded-full border-4 border-slate-100 absolute inset-0"></div>
                     <div className="w-16 h-16 rounded-full border-4 border-[#1E90FF] border-t-transparent animate-spin relative z-10"></div>
                  </div>
                  <h2 className="text-[18px] font-bold text-slate-900 mb-1">Processing Payment</h2>
                  <p className="text-[14px] text-slate-500">Please wait while we secure your slot...</p>
               </div>
            )}

            {paymentStage === 'success' && (
               <div className="py-8 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-in zoom-in-50 duration-500 delay-150">
                     <CheckCircle2 size={40} className="text-emerald-500" strokeWidth={2.5} />
                  </div>
                  <h2 className="text-[22px] font-bold text-slate-900 mb-2">Campaign Activated!</h2>
                  <p className="text-[14px] text-slate-500 mb-8 max-w-[250px]">
                     Your ads have been successfully scheduled and will start running as planned.
                  </p>
                  <div className="w-full bg-slate-50 rounded-[16px] p-4 mb-8 text-left">
                     <div className="flex justify-between items-center mb-2">
                       <span className="text-[13px] text-slate-500">Amount Paid</span>
                       <span className="text-[14px] font-bold text-slate-900">{checkoutAmount}</span>
                     </div>
                     <div className="flex justify-between items-center">
                       <span className="text-[13px] text-slate-500">Transaction ID</span>
                       <span className="text-[13px] font-mono font-medium text-slate-600">CRV-{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
                     </div>
                  </div>
                  <button 
                     onClick={handleFinish}
                     className="w-full py-4 rounded-[14px] font-bold text-white bg-slate-900 active:scale-95 transition-all"
                  >
                    Done
                  </button>
               </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
