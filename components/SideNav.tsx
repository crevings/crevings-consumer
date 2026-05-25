import React from 'react';
import { Home, UtensilsCrossed, ShoppingBag, LayoutGrid, Wallet, Store, RotateCcw, Tag, CreditCard, Megaphone, Users, UserCircle, PieChart, Settings, LogOut, Package, Star } from 'lucide-react';
import { Tab } from '../types';

interface SideNavProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
  activeOrdersCount?: number;
  onLogout?: () => void;
}

export const SideNav: React.FC<SideNavProps> = ({ currentTab, onTabChange, activeOrdersCount = 0, onLogout }) => {
  const primaryNav = [
    { id: Tab.HOME, label: 'Home', icon: Home },
    { id: Tab.ORDERS, label: 'Orders', icon: ShoppingBag },
    { id: Tab.REFUNDS, label: 'Refunds', icon: RotateCcw },
    { id: Tab.TABLES, label: 'Tables', icon: LayoutGrid },
    { id: Tab.MENU, label: 'Menu', icon: UtensilsCrossed },
    { id: Tab.INVENTORY, label: 'Inventory', icon: Package },
  ];

  const businessNav = [
    { id: Tab.EARNINGS, label: 'Payout', icon: Wallet },
    { id: Tab.CREATE_OFFER, label: 'Create Offer', icon: Tag },
    { id: Tab.SUBSCRIPTION, label: 'Subscription', icon: CreditCard },
    { id: Tab.ADS_MARKETING, label: 'Ads', icon: Megaphone },
  ];

  const managementNav = [
    { id: Tab.BUSINESS_SETUP, label: 'Business Setup', icon: Users },
    { id: Tab.CUSTOMER_DATA, label: 'Customer Info', icon: UserCircle },
    { id: Tab.CUSTOMER_RATINGS, label: 'Ratings', icon: Star },
    { id: Tab.ANALYTICS, label: 'Analytics', icon: PieChart },
  ];

  const renderNavSection = (title: string, items: typeof primaryNav) => (
    <div className="mb-6">
      {title && <h3 className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{title}</h3>}
      <div className="space-y-1">
        {items.map((item) => {
          const isActive = currentTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-blue-50 text-[#1E90FF] font-semibold' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
              }`}
            >
              <div className="relative">
                <Icon 
                  size={20} 
                  strokeWidth={isActive ? 2.5 : 2} 
                  className={`transition-colors duration-200 ${isActive ? 'text-[#1E90FF]' : 'text-slate-400 group-hover:text-slate-600'}`} 
                />
                {item.id === Tab.ORDERS && activeOrdersCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#1E90FF] rounded-full border-2 border-white" />
                )}
              </div>
              <span className="text-[14px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="hidden lg:flex flex-col w-64 bg-[#FFFFFF] border-r border-slate-200 h-screen sticky top-0 shrink-0 py-6">
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-[#1E90FF] rounded-xl flex items-center justify-center shadow-sm">
          <Store size={20} className="text-white" />
        </div>
        <span className="text-[22px] font-black text-slate-900 tracking-tight">Crevings</span>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 scrollbar-hide">
        {renderNavSection('', primaryNav)}
        {renderNavSection('Business & Growth', businessNav)}
        {renderNavSection('Management', managementNav)}
      </div>

      <div className="px-4 pt-4 border-t border-slate-100 mt-auto">
        <button 
          onClick={() => onTabChange(Tab.SETTINGS)}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors mb-1"
        >
          <Settings size={20} className="text-slate-400" />
          <span className="text-[14px]">Settings</span>
        </button>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-rose-500 hover:bg-rose-50 font-medium transition-colors mb-3"
        >
          <LogOut size={20} className="text-rose-400" />
          <span className="text-[14px]">Logout</span>
        </button>
        
        <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
            GK
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">Gourmet Kitchen</p>
            <p className="text-xs text-slate-500 truncate">View Profile</p>
          </div>
        </div>
      </div>
    </div>
  );
};
