
import React, { useState } from 'react';
import { 
  Plus, 
  ArrowLeft,
  TrendingUp,
  Tag,
  Clock,
  MoreVertical,
  Edit2,
  PauseCircle,
  PlayCircle,
  Trash2,
  Copy,
  Eye,
  Sparkles,
  ChevronRight,
  Wallet,
  ShoppingBag,
  Search
} from 'lucide-react';

interface OffersViewProps {
  onNavigateToCreateOffer: () => void;
  onBack?: () => void;
}

export const OffersView: React.FC<OffersViewProps> = ({ onNavigateToCreateOffer, onBack }) => {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Active' | 'Paused' | 'Expired'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock Data
  const summary = {
    activeOffers: 3,
    totalOffers: 12,
    revenue: '₹12,500',
    orders: 145
  };

  const [offers, setOffers] = useState([
    {
      id: 'OFF-772',
      name: 'Weekend Bonanza',
      type: 'Percentage Discount',
      status: 'Active',
      description: '50% off up to ₹250 on orders above ₹500',
      validity: '01 Oct – 30 Oct',
      usage: '124 / 500',
      orders: 124,
      revenue: '₹12,450'
    },
    {
      id: 'OFF-775',
      name: 'First Order Special',
      type: 'Flat Discount',
      status: 'Active',
      description: 'Flat ₹100 off on orders above ₹300',
      validity: '01 Nov – 31 Dec',
      usage: '45 / 1000',
      orders: 45,
      revenue: '₹4,500'
    },
    {
      id: 'OFF-801',
      name: 'Happy Hours',
      type: 'Percentage Discount',
      status: 'Paused',
      description: '20% off up to ₹100 on orders above ₹200',
      validity: '15 Oct – 28 Oct',
      usage: '0 / 200',
      orders: 0,
      revenue: '₹0'
    },
    {
      id: 'OFF-802',
      name: 'Summer Splash',
      type: 'Combo Offer',
      status: 'Expired',
      description: 'Free Coke with any Large Pizza',
      validity: '01 May – 31 May',
      usage: '350 / 350',
      orders: 350,
      revenue: '₹35,000'
    }
  ]);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const filteredOffers = offers.filter(o => {
    const matchesFilter = activeFilter === 'All' || o.status === activeFilter;
    const matchesSearch = o.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          o.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const toggleOfferStatus = (id: string) => {
    setOffers(offers.map(o => {
      if (o.id === id) {
        if (o.status === 'Active') return { ...o, status: 'Paused' };
        if (o.status === 'Paused') return { ...o, status: 'Active' };
      }
      return o;
    }));
    setOpenMenuId(null);
  };

  const deleteOffer = (id: string) => {
    setOffers(offers.filter(o => o.id !== id));
    setOpenMenuId(null);
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] pb-24 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-slate-100 h-[56px] flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center -ml-2 text-slate-700 active:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-[18px] font-semibold text-slate-900">Offers</h1>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Card 1 */}
          <div className="bg-[#FFFFFF] p-4 rounded-[20px] border border-slate-200 shadow-sm flex flex-col justify-between h-[110px]">
            <div>
              <div className="text-[13px] font-semibold text-slate-700 leading-tight">Active Offers</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Currently running</div>
            </div>
            <div className="text-2xl font-black text-slate-900">{summary.activeOffers}</div>
          </div>
          
          {/* Card 2 */}
          <div className="bg-[#FFFFFF] p-4 rounded-[20px] border border-slate-200 shadow-sm flex flex-col justify-between h-[110px]">
            <div>
              <div className="text-[13px] font-semibold text-slate-700 leading-tight">Inactive Offers</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Paused or expired</div>
            </div>
            <div className="text-2xl font-black text-slate-900">{summary.totalOffers - summary.activeOffers}</div>
          </div>
          
          {/* Card 3 */}
          <div className="bg-[#FFFFFF] p-4 rounded-[20px] border border-slate-200 shadow-sm flex flex-col justify-between h-[110px]">
            <div>
              <div className="text-[13px] font-semibold text-emerald-600 leading-tight">Revenue Impact</div>
              <div className="text-[11px] text-emerald-600/80 mt-0.5">Generated via offers</div>
            </div>
            <div className="text-2xl font-black text-emerald-600">{summary.revenue}</div>
          </div>
          
          {/* Card 4 */}
          <div className="bg-[#FFFFFF] p-4 rounded-[20px] border border-slate-200 shadow-sm flex flex-col justify-between h-[110px]">
            <div>
              <div className="text-[13px] font-semibold text-slate-700 leading-tight">Orders via Offers</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Total orders placed</div>
            </div>
            <div className="text-2xl font-black text-slate-900">{summary.orders}</div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" size={20} />
          <input 
            type="text" 
            placeholder="Search offers by name or ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[52px] bg-[#FFFFFF] border border-[#E5E7EB] text-[#111827] py-4 pl-12 pr-4 rounded-[16px] focus:outline-none focus:border-blue-500 text-[15px] font-medium transition-all"
          />
        </div>

        {/* Quick Filter Tabs */}
        <div className="flex gap-[8px] overflow-x-auto no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0 lg:flex-wrap">
          {['All', 'Active', 'Paused', 'Expired'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter as any)}
              className={`h-[36px] px-[16px] rounded-[18px] text-[14px] font-medium whitespace-nowrap transition-all duration-300 flex-shrink-0 ${
                activeFilter === filter 
                  ? 'bg-[#1E90FF] text-white shadow-md shadow-blue-500/20' 
                  : 'bg-[#FFFFFF] border border-[#E5E7EB] text-[#4B5563] hover:bg-slate-50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Offer List Section */}
        <div className="space-y-4">
          {filteredOffers.length === 0 ? (
            <div className="bg-[#FFFFFF] rounded-[20px] p-8 border border-slate-100 text-center shadow-sm">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Tag size={24} />
              </div>
              <h3 className="text-[16px] font-bold text-slate-900 mb-2">No offers created yet</h3>
              <p className="text-[14px] text-slate-500 mb-6">Create your first offer to boost sales and attract more customers.</p>
              <button 
                onClick={onNavigateToCreateOffer}
                className="h-[44px] px-6 bg-[#1E90FF] text-white rounded-xl font-semibold text-[14px] active:scale-[0.98] transition-all inline-flex items-center gap-2"
              >
                <Plus size={18} />
                Create your first offer
              </button>
            </div>
          ) : (
            filteredOffers.map((offer) => (
              <div key={offer.id} className="bg-[#FFFFFF] rounded-[20px] p-5 border border-slate-100 shadow-sm relative">
                
                {/* 3 Dot Menu */}
                <div className="absolute top-4 right-4">
                  <button 
                    onClick={() => setOpenMenuId(openMenuId === offer.id ? null : offer.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-50 text-slate-400 transition-colors"
                  >
                    <MoreVertical size={18} />
                  </button>
                  
                  {openMenuId === offer.id && (
                    <div className="absolute right-0 top-10 w-48 bg-[#FFFFFF] rounded-xl shadow-lg border border-slate-100 py-1 z-10 animate-in fade-in zoom-in-95 duration-200">
                      <button className="w-full px-4 py-2.5 text-left text-[14px] font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                        <Copy size={16} className="text-slate-400" /> Duplicate Offer
                      </button>
                      <button className="w-full px-4 py-2.5 text-left text-[14px] font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                        <Eye size={16} className="text-slate-400" /> View Details
                      </button>
                    </div>
                  )}
                </div>

                <div className="pr-10 mb-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                      offer.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 
                      offer.status === 'Paused' ? 'bg-amber-50 text-amber-600' : 
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {offer.status}
                    </span>
                    <span className="text-[12px] font-medium text-slate-400">{offer.type}</span>
                  </div>
                  <h3 className="text-[18px] font-bold text-slate-900 leading-tight mb-1">{offer.name}</h3>
                  <p className="text-[13px] text-slate-600">{offer.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-5 bg-slate-50 p-3 rounded-xl">
                  <div>
                    <p className="text-[11px] font-medium text-slate-500 mb-0.5">Validity</p>
                    <p className="text-[13px] font-semibold text-slate-900">{offer.validity}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-slate-500 mb-0.5">Usage</p>
                    <p className="text-[13px] font-semibold text-slate-900">Used {offer.usage}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-slate-500 mb-0.5">Orders Generated</p>
                    <p className="text-[13px] font-semibold text-slate-900">{offer.orders} Orders</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-slate-500 mb-0.5">Revenue Generated</p>
                    <p className="text-[13px] font-semibold text-emerald-600">{offer.revenue}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 h-[36px] bg-[#FFFFFF] border border-slate-200 text-slate-700 rounded-lg font-medium text-[13px] flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors">
                    <Edit2 size={14} /> Edit
                  </button>
                  {offer.status !== 'Expired' && (
                    <button 
                      onClick={() => toggleOfferStatus(offer.id)}
                      className="flex-1 h-[36px] bg-[#FFFFFF] border border-slate-200 text-slate-700 rounded-lg font-medium text-[13px] flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors"
                    >
                      {offer.status === 'Active' ? <><PauseCircle size={14} /> Pause</> : <><PlayCircle size={14} /> Resume</>}
                    </button>
                  )}
                  <button 
                    onClick={() => deleteOffer(offer.id)}
                    className="w-[36px] h-[36px] bg-[#FFFFFF] border border-slate-200 text-rose-500 rounded-lg flex items-center justify-center hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

              </div>
            ))
          )}
        </div>
      </div>

      {/* Floating Create Button */}
      <button 
        onClick={onNavigateToCreateOffer}
        className="fixed bottom-[100px] right-6 lg:bottom-10 lg:right-10 z-50 h-14 px-6 bg-[#1E90FF] text-[#FFFFFF] rounded-full flex items-center justify-center shadow-lg active:scale-[0.98] transition-all font-semibold text-[15px]"
      >
        Create
      </button>

    </div>
  );
};

