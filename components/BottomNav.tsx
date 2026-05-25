
import React from 'react';
import { Home, UtensilsCrossed, ShoppingBag, LayoutGrid, Wallet } from 'lucide-react';
import { Tab } from '../types';

interface BottomNavProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
  activeOrdersCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange, activeOrdersCount = 0 }) => {
  const navItems = [
    { id: Tab.HOME, label: 'Home', icon: Home },
    { id: Tab.MENU, label: 'Menu', icon: UtensilsCrossed },
    { id: Tab.ORDERS, label: 'Orders', icon: ShoppingBag },
    { id: Tab.TABLES, label: 'Tables', icon: LayoutGrid },
    { id: Tab.EARNINGS, label: 'Payout', icon: Wallet },
  ];

  const activeIndex = navItems.findIndex(item => item.id === currentTab);

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 bg-[#FFFFFF] border-t border-[#E5E7EB] h-[64px] pb-[env(safe-area-inset-bottom)]"
    >
      <div className="flex relative items-center h-full w-full max-w-md mx-auto">
        {/* Smooth Switching Indicator */}
        <div 
          className="absolute top-2 bottom-2 transition-transform duration-300 ease-out pointer-events-none flex justify-center items-center"
          style={{ 
            width: '20%', 
            transform: `translateX(${activeIndex * 100}%)` 
          }}
        >
          <div className="w-[80%] h-full bg-blue-50/80 rounded-[14px]" />
        </div>

        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="flex flex-col items-center justify-center flex-1 h-full z-10 active:scale-95 transition-transform"
            >
              <div className="relative flex items-center justify-center">
                <Icon 
                  size={20} 
                  strokeWidth={isActive ? 2.5 : 2} 
                  color={isActive ? '#1E90FF' : '#9CA3AF'}
                  className="transition-colors duration-300" 
                />
                {item.id === Tab.ORDERS && activeOrdersCount > 0 && (
                  <div 
                    className="absolute -top-1 -right-1 w-2 h-2 bg-[#1E90FF] rounded-full outline outline-2 outline-white"
                  />
                )}
              </div>
              <span 
                className={`text-[10px] font-bold leading-none mt-[3px] transition-colors duration-300 ${isActive ? 'text-[#1E90FF]' : 'text-[#9CA3AF]'}`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
