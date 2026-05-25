
import React from 'react';
import { 
  ArrowLeft, 
  Tag, 
  Edit3, 
  Trash2, 
  TrendingUp, 
  Users, 
  MousePointer2, 
  Calendar,
  Clock,
  ShieldCheck,
  ChevronRight,
  Info,
  CheckCircle2,
  Copy,
  Zap,
  MoreVertical,
  Percent,
  Wallet
} from 'lucide-react';

interface OfferDetailViewProps {
  offer: any;
  onBack: () => void;
}

export const OfferDetailView: React.FC<OfferDetailViewProps> = ({ offer, onBack }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-[#F4F7FB] flex flex-col animate-in slide-in-from-right duration-300 overflow-hidden">
      {/* Header */}
      <header className="bg-[#FFFFFF] px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-slate-50 rounded-full text-slate-600 transition-colors active:scale-90">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none">Offer Details</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{offer.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-32 px-6 pt-6 space-y-6 no-scrollbar">
        
        {/* Main Performance Hero */}
        <div className="bg-slate-900 rounded-[40px] p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-[80px] -mr-12 -mt-12 transition-transform duration-1000 group-hover:scale-125"></div>
          
          <div className="relative z-10 space-y-8">
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#FFFFFF]/10 backdrop-blur-md flex items-center justify-center text-emerald-400 border border-white/5">
                  <Zap size={28} fill="currentColor" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight leading-none">{offer.title}</h2>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="px-2.5 py-1 bg-emerald-500 rounded-lg text-[10px] font-black text-white uppercase tracking-widest">{offer.status}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{offer.type} Offer</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Usage</p>
                <p className="text-2xl font-black text-white tracking-tight">{offer.usage}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Revenue</p>
                <p className="text-2xl font-black text-white tracking-tight">{offer.revenue}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Conversion</p>
                <p className="text-2xl font-black text-emerald-400 tracking-tight">14.2%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Promo Code Card */}
        <div className="bg-[#FFFFFF] rounded-[32px] p-6 border border-slate-100 flex items-center justify-between group">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100/50">
              <Tag size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Promo Code</p>
              <p className="text-lg font-black text-slate-900 uppercase tracking-widest">{offer.code}</p>
            </div>
          </div>
          <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all active:scale-90">
            <Copy size={18} />
          </button>
        </div>

        {/* Configuration Details */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-1">Offer Configuration</h3>
          <div className="bg-[#FFFFFF] rounded-[40px] p-8 border border-slate-100 space-y-6">
            <div className="grid grid-cols-2 gap-y-8 gap-x-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-slate-400">
                  <Wallet size={14} />
                  <p className="text-[10px] font-black uppercase tracking-widest">Min. Order</p>
                </div>
                <p className="text-lg font-black text-slate-900 tracking-tight">{offer.minOrder}</p>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-slate-400">
                  <Percent size={14} />
                  <p className="text-[10px] font-black uppercase tracking-widest">Max. Disc</p>
                </div>
                <p className="text-lg font-black text-slate-900 tracking-tight">{offer.maxDiscount}</p>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-slate-400">
                  <Users size={14} />
                  <p className="text-[10px] font-black uppercase tracking-widest">Eligibility</p>
                </div>
                <p className="text-lg font-black text-slate-900 tracking-tight">New Customers</p>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-slate-400">
                  <ShieldCheck size={14} />
                  <p className="text-[10px] font-black uppercase tracking-widest">Usage Limit</p>
                </div>
                <p className="text-lg font-black text-slate-900 tracking-tight">1 per customer</p>
              </div>
            </div>
            
            <div className="pt-6 border-t border-slate-50">
              <div className="flex items-center gap-3 text-slate-400 mb-2">
                <Calendar size={14} />
                <p className="text-[10px] font-black uppercase tracking-widest">Campaign Schedule</p>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Start Date</p>
                  <p className="text-xs font-black text-slate-900">Oct 24, 2025</p>
                </div>
                <div className="h-8 w-px bg-slate-200"></div>
                <div className="text-right">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">End Date</p>
                  <p className="text-xs font-black text-slate-900">{offer.validUntil}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Distribution Channels */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-1">Display Channels</h3>
          <div className="space-y-3">
            {[
              { label: 'Homepage Banner', status: 'Active', color: 'bg-emerald-50 text-emerald-600' },
              { label: 'Menu List Highlight', status: 'Active', color: 'bg-emerald-50 text-emerald-600' },
              { label: 'Cart Page Suggestions', status: 'Inactive', color: 'bg-slate-100 text-slate-400' }
            ].map((channel, i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-[#FFFFFF] border border-slate-100 rounded-[24px]">
                <span className="text-sm font-bold text-slate-700">{channel.label}</span>
                <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${channel.color} border border-slate-100/50`}>
                  {channel.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Warning Note */}
        <div className="bg-amber-50 rounded-[28px] p-6 border border-amber-100/50 flex items-start gap-4">
          <Info size={20} className="text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-900 font-medium leading-relaxed">
            Stopping this offer will immediately invalidate the promo code for all customers. Active sessions with this code applied will still be honored.
          </p>
        </div>

      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 inset-x-0 bg-[#FFFFFF] border-t border-slate-100 p-6 z-40 flex gap-3">
        <button className="flex-1 h-[52px] bg-[#1E90FF] text-[#FFFFFF] rounded-[16px] font-semibold text-[16px] flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
          <Edit3 size={18} /> Edit Offer
        </button>
        <button className="w-[52px] h-[52px] bg-rose-50 text-rose-500 rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all border border-rose-100">
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};
