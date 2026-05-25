
import React, { useState } from 'react';
import { 
  ArrowLeft,
  Bell,
  Settings,
  Upload,
  QrCode,
  Download,
  Share2,
  CheckCircle2,
  Store,
  User,
  Clock,
  MenuSquare,
  FileText,
  Landmark,
  Users,
  ShoppingBag,
  Blocks,
  ChevronRight,
  Star,
  LogOut,
  CreditCard,
  Megaphone,
  UserCircle,
  TrendingUp,
  PieChart,
  Tag,
  HeartHandshake,
  Package,
  RotateCcw,
  Receipt,
  MessageSquare,
  Palette,
  Scale
} from 'lucide-react';
import { Tab } from '../types';

interface ProfileViewProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab?: (tab: Tab) => void;
  onLogout?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ isOpen, onClose, onNavigateToTab, onLogout }) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleNavigate = (tab: Tab) => {
    onNavigateToTab?.(tab);
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-[110] w-full bg-slate-50 transform transition-transform duration-300 ease-out flex flex-col lg:bg-black/50 lg:items-center lg:justify-center lg:p-4 ${isOpen ? 'translate-x-0 lg:opacity-100 lg:translate-x-0' : '-translate-x-full lg:opacity-0 lg:pointer-events-none'}`}>
      <div className="flex flex-col w-full h-full bg-slate-50 lg:h-auto lg:max-h-[90vh] lg:max-w-2xl lg:rounded-3xl lg:overflow-hidden lg:shadow-2xl">
        {/* Page Header */}
        <div className="h-[56px] bg-[#FFFFFF] border-b border-slate-100 flex items-center justify-between px-4 shrink-0 sticky top-0 z-20 lg:h-16 lg:px-6">
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center -ml-2 text-slate-700 active:scale-95 transition-transform lg:hidden">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-[18px] font-semibold text-slate-900 lg:text-xl">Restaurant Profile</h1>
          <div className="flex items-center gap-2 -mr-2 lg:mr-0">
            <button onClick={() => handleNavigate(Tab.SETTINGS)} className="w-10 h-10 flex items-center justify-center text-slate-700 active:scale-95 transition-transform lg:hidden">
              <Settings size={22} />
            </button>
            <button onClick={onClose} className="hidden lg:flex w-10 h-10 items-center justify-center text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft size={24} className="rotate-180" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar pb-12 px-4 pt-4 space-y-6 lg:p-6 lg:space-y-8">
        
        {/* Restaurant Info Card */}
        <div className="bg-[#FFFFFF] rounded-[16px] p-4 shadow-sm border border-slate-100">
          <div className="flex flex-col items-center text-center">
            <div 
              className="w-[64px] h-[64px] rounded-[16px] border border-slate-100 flex flex-col items-center justify-center bg-slate-50 overflow-hidden shadow-sm mb-3"
            >
              <img src="https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover" alt="Logo" />
            </div>
            
            <h2 className="text-[18px] font-bold text-slate-900 leading-tight mb-2 tracking-tight">Gourmet Kitchen</h2>
            
            <button className="flex items-center justify-center gap-0.5 px-3 py-1 bg-slate-50 rounded-full font-bold text-[13px] text-slate-800 mb-3 transition-colors hover:bg-slate-100">
              Civil Lines, Prayagraj
              <ChevronRight size={14} className="text-slate-500" />
            </button>

            <p className="text-[13px] font-semibold text-slate-500 mb-1.5">North Indian, Chinese, Fast Food</p>
            
            <div className="flex items-center justify-center gap-2 text-[13px] font-semibold mb-4">
              <span className="text-slate-600">₹800 for two</span>
              <span className="text-slate-300">|</span>
              <span className="text-emerald-600">
                Open
              </span>
            </div>

            <button 
              onClick={() => handleNavigate(Tab.OUTLET_INFO)}
              className="w-full h-[36px] bg-slate-100 text-[#1E90FF] rounded-[10px] text-[13px] font-semibold active:scale-95 transition-transform hover:bg-[#EBF3FF]"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* QR Code Card */}
        <div className="bg-[#FFFFFF] rounded-[20px] p-4 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-20 h-20 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center shrink-0">
            <QrCode size={48} className="text-slate-800" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-900">Restaurant QR Code</h3>
            <p className="text-xs text-slate-500 mb-3">For Dine-in & Orders</p>
            <div className="flex items-center gap-2">
              <button className="flex-1 h-[36px] border border-[#E5E7EB] rounded-[10px] flex items-center justify-center gap-1.5 text-sm font-medium text-slate-700 active:scale-95 transition-transform">
                <Download size={16} /> Download
              </button>
              <button className="flex-1 h-[36px] border border-[#E5E7EB] rounded-[10px] flex items-center justify-center gap-1.5 text-sm font-medium text-slate-700 active:scale-95 transition-transform">
                <Share2 size={16} /> Share
              </button>
            </div>
          </div>
        </div>

        {/* Manage Outlet Section */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-sm font-bold text-slate-900">Manage Outlet</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Store, title: 'Outlet Info', desc: 'Cuisine, delivery radius', tab: Tab.OUTLET_INFO },
              { icon: Clock, title: 'Opening Hours', desc: 'Configure timings', tab: Tab.OPENING_HOURS },
              { icon: MenuSquare, title: 'Digital Menu', desc: 'Upload menu & PDFs', tab: Tab.DIGITAL_MENU },
              { icon: Package, title: 'Inventory', desc: 'Manage item stock', tab: Tab.INVENTORY }
            ].map((item, i) => (
              <button 
                key={i} 
                onClick={() => item.tab && handleNavigate(item.tab)}
                className="bg-[#FFFFFF] p-3.5 rounded-2xl border border-slate-100 flex flex-col hover:border-slate-200 active:scale-95 transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-full bg-[#EBF3FF] flex items-center justify-center text-[#1E90FF] mb-3 transition-colors">
                  <item.icon size={20} strokeWidth={2} />
                </div>
                <div className="flex flex-col flex-1">
                  <h4 className="text-[13px] font-bold text-slate-900 leading-tight mb-1 line-clamp-1">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">{item.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Growth Tools Section */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-sm font-bold text-slate-900">Growth Tools</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Megaphone, title: 'Ads & Mktg', desc: 'Promote your store', tab: Tab.ADS_MARKETING },
              { icon: Tag, title: 'Offers', desc: 'Manage discounts', tab: Tab.OFFERS },
              { icon: Upload, title: 'Upload Banners', desc: 'Manage brand banners', tab: Tab.UPLOAD_BANNERS }
            ].map((item, i) => (
              <button 
                key={i} 
                onClick={() => item.tab && handleNavigate(item.tab)}
                className="bg-[#FFFFFF] p-3.5 rounded-2xl border border-slate-100 flex flex-col hover:border-slate-200 active:scale-95 transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-full bg-[#EBF3FF] flex items-center justify-center text-[#1E90FF] mb-3 transition-colors">
                  <item.icon size={20} strokeWidth={2} />
                </div>
                <div className="flex flex-col flex-1">
                  <h4 className="text-[13px] font-bold text-slate-900 leading-tight mb-1 line-clamp-1">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">{item.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Finance and Payout Section */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-sm font-bold text-slate-900">Finance and Payout</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Landmark, title: 'Payout', desc: 'Manage payouts', tab: Tab.PAYOUT },
              { icon: Landmark, title: 'Bank DB', desc: 'Linked account info', tab: Tab.BANK_ACCOUNTS },
              { icon: RotateCcw, title: 'Refunds', desc: 'Manage requests', tab: Tab.REFUNDS },
              { icon: Receipt, title: 'Manage Billing', desc: 'Billing details & charges', tab: Tab.MANAGE_BILLING }
            ].map((item, i) => (
              <button 
                key={i} 
                onClick={() => item.tab && handleNavigate(item.tab)}
                className="bg-[#FFFFFF] p-3.5 rounded-2xl border border-slate-100 flex flex-col hover:border-slate-200 active:scale-95 transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-full bg-[#EBF3FF] flex items-center justify-center text-[#1E90FF] mb-3 transition-colors">
                  <item.icon size={20} strokeWidth={2} />
                </div>
                <div className="flex flex-col flex-1">
                  <h4 className="text-[13px] font-bold text-slate-900 leading-tight mb-1 line-clamp-1">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">{item.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Business Section */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-sm font-bold text-slate-900">Business</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Store, title: 'Business Setup', desc: 'Outlets & staff config', tab: Tab.BUSINESS_SETUP },
              { icon: User, title: 'Owner Info', desc: 'Name, contact, email', tab: Tab.OWNER_INFO },
              { icon: ShoppingBag, title: 'Partner Store', desc: 'Manage your store', tab: Tab.PARTNER_STORE },
              { icon: CheckCircle2, title: 'Subscription', desc: 'Manage active plan', tab: Tab.SUBSCRIPTION },
              { icon: FileText, title: 'Order History', desc: 'View past orders', tab: Tab.ORDER_HISTORY }
            ].map((item, i) => (
              <button 
                key={i} 
                onClick={() => item.tab && handleNavigate(item.tab)}
                className="bg-[#FFFFFF] p-3.5 rounded-2xl border border-slate-100 flex flex-col hover:border-slate-200 active:scale-95 transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-full bg-[#EBF3FF] flex items-center justify-center text-[#1E90FF] mb-3 transition-colors">
                  <item.icon size={20} strokeWidth={2} />
                </div>
                <div className="flex flex-col flex-1">
                  <h4 className="text-[13px] font-bold text-slate-900 leading-tight mb-1 line-clamp-1">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">{item.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Analytics and Insights Section */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-sm font-bold text-slate-900">Analytics and Insights</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: PieChart, title: 'Analytics', desc: 'View store insights', tab: Tab.ANALYTICS },
              { icon: TrendingUp, title: 'Sales Report', desc: 'View sales data', tab: Tab.SALES_REPORT },
              { icon: Star, title: 'Ratings', desc: 'View customer reviews', tab: Tab.CUSTOMER_RATINGS },
              { icon: UserCircle, title: 'Customer Info', desc: 'View customers log', tab: Tab.CUSTOMER_INFO }
            ].map((item, i) => (
              <button 
                key={i} 
                onClick={() => item.tab && handleNavigate(item.tab)}
                className="bg-[#FFFFFF] p-3.5 rounded-2xl border border-slate-100 flex flex-col hover:border-slate-200 active:scale-95 transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-full bg-[#EBF3FF] flex items-center justify-center text-[#1E90FF] mb-3 transition-colors">
                  <item.icon size={20} strokeWidth={2} />
                </div>
                <div className="flex flex-col flex-1">
                  <h4 className="text-[13px] font-bold text-slate-900 leading-tight mb-1 line-clamp-1">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">{item.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Others Section */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-sm font-bold text-slate-900">Others</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Blocks, title: 'Integrations', desc: 'Third-party apps', tab: Tab.INTEGRATIONS },
              { icon: HeartHandshake, title: 'Rel. Manager', desc: 'Contact support', tab: Tab.RELATIONSHIP_MANAGER },
              { icon: Palette, title: 'Crevings Studio', desc: 'Graphic design', tab: Tab.CREVINGS_STUDIO },
              { icon: Scale, title: 'Crevings Legal', desc: 'FSSAI & trademark', tab: Tab.CREVINGS_LEGAL }
            ].map((item, i) => (
              <button 
                key={i} 
                onClick={() => item.tab && handleNavigate(item.tab)}
                className="bg-[#FFFFFF] p-3.5 rounded-2xl border border-slate-100 flex flex-col hover:border-slate-200 active:scale-95 transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-full bg-[#EBF3FF] flex items-center justify-center text-[#1E90FF] mb-3 transition-colors">
                  <item.icon size={20} strokeWidth={2} />
                </div>
                <div className="flex flex-col flex-1">
                  <h4 className="text-[13px] font-bold text-slate-900 leading-tight mb-1 line-clamp-1">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">{item.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Support Button */}
        <div className="pt-4 pb-2">
          <button 
            onClick={() => handleNavigate(Tab.SUPPORT)}
            className="w-full h-[52px] bg-slate-50 text-slate-700 rounded-[16px] border border-slate-200 font-semibold text-[16px] flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          >
            <MessageSquare size={20} />
            Talk to Support
          </button>
        </div>

        {/* Logout Button */}
        <div className="pt-2">
          <button 
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full h-[52px] bg-rose-50 text-rose-500 rounded-[16px] border border-rose-100 font-semibold text-[16px] flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
        </div>

      </div>

      {/* Logout Confirmation Bottom Sheet */}
      {showLogoutConfirm && (
        <div 
          className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50 sm:items-center transition-opacity"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div 
            className="w-full bg-[#FFFFFF] rounded-t-2xl sm:rounded-2xl sm:max-w-md p-6 animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:fade-in duration-300"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 text-center mb-2">Logout</h3>
            <p className="text-slate-500 text-center mb-6">Are you sure you want to logout from your account?</p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-semibold rounded-xl active:scale-95 transition-transform"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setShowLogoutConfirm(false);
                  onClose();
                  onLogout?.();
                }}
                className="flex-1 py-3 px-4 bg-rose-500 text-white font-semibold rounded-xl active:scale-95 transition-transform"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
