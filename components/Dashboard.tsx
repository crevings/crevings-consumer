
import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Clock, 
  ChevronRight, 
  Users, 
  Package, 
  Wallet, 
  CheckCircle, 
  User,
  TrendingUp,
  Globe,
  BellRing,
  LayoutGrid,
  Circle,
  ArrowRight,
  AlertCircle,
  AlertTriangle,
  MapPin,
  ChevronDown,
  Bell,
  Plus,
  Zap,
  X,
  Store
} from 'lucide-react';
import { NewOrderAlert } from './NewOrderAlert';
import { OrderCard } from './OrderCard';
import { Order, Tab } from '../types';

interface DashboardProps {
  orders: Order[];
  onAddOrder: (order: Order) => void;
  onUpdateOrderStatus: (orderId: string) => void;
  onNavigateToOrders?: () => void;
  onNavigateToTables?: () => void;
  onNavigateToOffers?: () => void;
  onQuickOrder?: (type: 'Offline Orders' | 'Dine-in') => void;
  onCreateOrder?: () => void;
  isOnline: boolean;
  setIsOnline: (val: boolean) => void;
  rushHour: boolean;
  setRushHour: (val: boolean) => void;
  selectedBranch: any;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  orders,
  onAddOrder,
  onUpdateOrderStatus,
  onNavigateToOrders, 
  onNavigateToTables,
  onNavigateToOffers,
  onQuickOrder,
  onCreateOrder,
  isOnline, 
  setIsOnline,
  rushHour,
  setRushHour,
  selectedBranch
}) => {
  const [activeOrderTab, setActiveOrderTab] = useState<'Delivery' | 'Dine-in' | 'Takeaway'>('Delivery');
  const [showNewOrderAlert, setShowNewOrderAlert] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<Order | null>(null);
  const [showOutletSheet, setShowOutletSheet] = useState(false);

  const mockOutletsList = [
    { id: '1', name: "Domino's", location: 'HSR Layout', status: 'Active' },
    { id: '2', name: "Domino's Express", location: 'Koramangala', status: 'Active' },
    { id: '3', name: "Pizza Maker", location: 'Indiranagar', status: 'Inactive' }
  ];

  const triggerRandomOrder = () => {
    const types: ('Delivery' | 'Takeaway' | 'Dine-in' | 'Table Booking')[] = ['Delivery', 'Takeaway', 'Dine-in', 'Table Booking'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: ['Priya Verma', 'Rahul Sharma', 'Amit Kumar', 'Neha Singh'][Math.floor(Math.random() * 4)],
      type: randomType,
      channel: randomType === 'Delivery' ? ['Zomato', 'Swiggy', 'Direct'][Math.floor(Math.random() * 3)] : 'Direct',
      items: '2 Items • Custom Order',
      itemList: [
        { name: 'Veg Supreme Pizza', quantity: 1, size: 'Large', addOns: ['Extra Cheese', 'Jalapenos'], price: 850 }, 
        { name: 'Coke Zero', quantity: 2, size: '500ml', price: 60 }
      ],
      paymentStatus: 'Paid',
      address: randomType === 'Delivery' ? 'House No. 42, Green Avenue, Sector 15' : undefined,
      subtotal: 970,
      tax: 48.50,
      discount: 100,
      total: '918.50',
      status: 'Incoming',
      time: '--',
      customerType: 'Regular',
      phone: '+91 98765 43210',
      customerNote: 'Please ring the bell twice.',
      offer: 'FLAT100 (₹100 off)'
    };
    
    setPendingOrder(newOrder);
    setShowNewOrderAlert(true);
  };

  const activeOrders = orders.filter(o => {
    if (activeOrderTab === 'Delivery') return o.type === 'Delivery';
    if (activeOrderTab === 'Dine-in') return o.type === 'Offline Orders' || o.type === 'Dine-in';
    if (activeOrderTab === 'Takeaway') return o.type === 'Takeaway';
    return false;
  });
  const incomingOrders = orders.filter(o => o.status === 'Incoming');

  const stats = [
    { label: 'REVENUE', val: '₹12,450', comparison: 'vs yesterday', action: 'See Earnings', icon: Wallet, color: 'text-blue-500', bg: 'bg-rose-50', badgeColor: 'text-rose-500' },
    { label: 'REFUND', val: '₹450', comparison: '2 requests', action: 'View Refunds', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50', badgeColor: 'text-red-600' },
    { label: 'TOTAL ORDERS', val: '42', comparison: 'from last Sunday', action: 'View Orders', icon: ShoppingBag, color: 'text-indigo-500', bg: 'bg-emerald-50', badgeColor: 'text-emerald-600' },
    { label: 'ONLINE ORDERS', val: '28', comparison: 'Zomato, Swiggy', action: 'View Online', icon: Globe, color: 'text-blue-500', bg: 'bg-blue-50', badgeColor: 'text-blue-600' },
    { label: 'OFFLINE ORDERS', val: '14', comparison: 'Dine-in, Takeaway', action: 'View Offline', icon: Store, color: 'text-amber-500', bg: 'bg-amber-50', badgeColor: 'text-amber-600' }
  ];

  return (
    <div className="pb-44 px-6 pt-6 space-y-10 animate-in fade-in duration-700 bg-[#FFFFFF] relative lg:bg-transparent lg:p-0 lg:pb-10">

      {/* Restaurant Info Card */}
      <button 
        onClick={() => setShowOutletSheet(true)}
        className="w-full text-left h-[80px] rounded-[18px] p-[16px] bg-[#FFFFFF] border border-[#E5E7EB] flex items-center justify-between shadow-sm lg:hidden active:scale-[0.98] transition-transform"
      >
        <div className="flex items-center gap-4">
          {/* Left: Icon Container */}
          <div className="w-[48px] h-[48px] rounded-[12px] bg-[#F3F4F6] flex items-center justify-center shrink-0">
            <Store size={24} className="text-slate-600" />
          </div>
          
          {/* Center: Content */}
          <div className="flex flex-col justify-center">
            <h2 className="text-[16px] font-bold text-slate-900 leading-tight">Domino's</h2>
            <p className="text-[13px] text-[#6B7280] leading-tight mt-0.5">HSR Layout</p>
          </div>
        </div>
        <ChevronRight size={20} className="text-slate-400" />
      </button>

      <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 lg:gap-8 lg:space-y-0 gap-10">
        <div className="lg:col-span-8 space-y-10">
          {/* Active Orders Section */}
          <section className="bg-[#FFFFFF] lg:p-6 lg:rounded-2xl lg:border lg:border-slate-200 lg:shadow-sm">
            <div className="flex items-center justify-between mb-5 px-1 lg:px-0">
               <h3 className="text-[15px] font-bold text-slate-900 tracking-tight leading-none uppercase">Active Orders</h3>
               <button onClick={onNavigateToOrders} className="text-[10px] font-semibold text-[#1E90FF] uppercase tracking-[0.1em] transition-colors hover:opacity-80">View All</button>
            </div>

            <div className="relative flex p-1 bg-[#F3F4F6] rounded-full mb-6">
               <div 
                 className="absolute top-1 bottom-1 bg-[#FFFFFF] rounded-full shadow-sm transition-all duration-300 ease-out"
                 style={{ 
                   left: '4px', 
                   width: 'calc((100% - 8px) / 3)',
                   transform: `translateX(${['Delivery', 'Dine-in', 'Takeaway'].indexOf(activeOrderTab) * 100}%)` 
                 }}
               />
               {(['Delivery', 'Dine-in', 'Takeaway'] as const).map(tab => (
                 <button 
                  key={tab}
                  onClick={() => setActiveOrderTab(tab)}
                  className={`relative z-10 flex-1 py-2.5 rounded-full text-[13px] font-semibold transition-colors duration-300 ${
                    activeOrderTab === tab 
                    ? 'text-[#1E90FF]' 
                    : 'text-[#6B7280] hover:text-slate-900'
                  }`}
                 >
                    {tab}
                 </button>
               ))}
            </div>

            {activeOrders.length > 0 ? (
              <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-4">
                {activeOrders.map((order) => (
                  <OrderCard 
                    key={order.id}
                    order={order}
                    onClick={() => {}}
                    onUpdateStatus={(e) => { e.stopPropagation(); onUpdateOrderStatus(order.id); }}
                    isCompact={false}
                  />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center bg-[#FFFFFF] rounded-[32px] border border-slate-200 border-dashed">
                 <div className="w-12 h-12 bg-[#FFFFFF] border border-slate-200 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-200">
                    <ShoppingBag size={20} />
                 </div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Active Orders</p>
                 <p className="text-[9px] font-bold text-slate-300 mt-1">New orders will appear here</p>
              </div>
            )}
          </section>
        </div>

        <div className="lg:col-span-4 space-y-10">
          {/* Tables Section */}
          <section className="space-y-4 bg-[#FFFFFF] lg:p-6 lg:rounded-2xl lg:border lg:border-slate-200 lg:shadow-sm">
            <div className="flex items-center justify-between px-1 lg:px-0">
               <h3 className="text-[14px] font-bold text-slate-900 tracking-tight leading-none uppercase">Tables</h3>
               <button onClick={onNavigateToTables} className="text-[10px] font-semibold text-[#1E90FF] uppercase tracking-[0.1em] transition-colors hover:opacity-80">View All</button>
            </div>
            
            <div className="flex gap-3 px-1 lg:px-0 lg:flex-col">
               <div className="flex-1 bg-emerald-50 border border-emerald-100 rounded-2xl p-3 flex flex-col items-center justify-center lg:flex-row lg:justify-between lg:px-5">
                  <p className="text-[10px] font-semibold text-emerald-600/80 uppercase tracking-wider">Available</p>
                  <p className="text-2xl font-bold text-emerald-600">12</p>
               </div>
               <div className="flex-1 bg-blue-50 border border-blue-100 rounded-2xl p-3 flex flex-col items-center justify-center lg:flex-row lg:justify-between lg:px-5">
                  <p className="text-[10px] font-semibold text-blue-600/80 uppercase tracking-wider">Occupied</p>
                  <p className="text-2xl font-bold text-blue-600">6</p>
               </div>
               <div className="flex-1 bg-amber-50 border border-amber-100 rounded-2xl p-3 flex flex-col items-center justify-center lg:flex-row lg:justify-between lg:px-5">
                  <p className="text-[10px] font-semibold text-amber-600/80 uppercase tracking-wider">Booked</p>
                  <p className="text-2xl font-bold text-amber-600">2</p>
               </div>
            </div>
          </section>

          {/* Quick Stats for Desktop */}
          <section className="hidden lg:block bg-[#FFFFFF] p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
             <h3 className="text-[14px] font-bold text-slate-900 tracking-tight leading-none uppercase mb-4">Quick Stats</h3>
             <div className="space-y-3">
               {stats.slice(0, 3).map((stat, idx) => (
                 <div key={idx} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100">
                   <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center shrink-0`}>
                     <stat.icon size={18} className={stat.color} />
                   </div>
                   <div>
                     <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                     <p className="text-[16px] font-bold text-slate-900">{stat.val}</p>
                   </div>
                 </div>
               ))}
             </div>
          </section>
        </div>
      </div>

      {pendingOrder && (
        <NewOrderAlert 
          isOpen={showNewOrderAlert} 
          onClose={() => setShowNewOrderAlert(false)} 
          onAccept={(prepTime) => {
            onAddOrder({
              ...pendingOrder,
              time: `${prepTime}:00`,
              status: 'Preparing'
            });
            setPendingOrder(null);
            setShowNewOrderAlert(false);
          }}
          onReject={() => {
            setPendingOrder(null);
            setShowNewOrderAlert(false);
          }}
          order={pendingOrder}
        />
      )}

      {/* Floating Create Order Button */}
      <div className="fixed bottom-24 right-6 flex flex-col gap-3 z-50">
        <button 
          className="h-[52px] bg-slate-800 text-[#FFFFFF] rounded-[16px] font-semibold text-[16px] px-6 flex items-center justify-center gap-2 shadow-xl active:scale-[0.98] transition-all"
          onClick={triggerRandomOrder}
        >
          <BellRing size={20} />
          <span className="text-sm font-bold uppercase tracking-wider">Test Alert</span>
        </button>
        <button 
          className="h-[52px] bg-[#1E90FF] text-[#FFFFFF] rounded-[16px] font-semibold text-[16px] px-6 flex items-center justify-center gap-2 shadow-xl active:scale-[0.98] transition-all"
          onClick={onCreateOrder}
        >
          <span className="text-sm font-bold uppercase tracking-wider">Create Order</span>
        </button>
      </div>

      {showOutletSheet && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex flex-col justify-end animate-in fade-in duration-200">
          <div className="bg-[#FFFFFF] rounded-t-[24px] w-full max-h-[80vh] flex flex-col animate-in slide-in-from-bottom-full duration-300">
            <header className="h-[60px] border-b border-slate-100 flex items-center justify-between px-5 shrink-0">
              <h2 className="text-[18px] font-bold text-slate-900">Switch Outlet</h2>
              <button onClick={() => setShowOutletSheet(false)} className="w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-600 rounded-full active:scale-95 transition-transform">
                <X size={18} />
              </button>
            </header>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {mockOutletsList.map((outlet) => (
                <button
                  key={outlet.id}
                  onClick={() => setShowOutletSheet(false)}
                  className={`w-full text-left p-4 rounded-[16px] border flex flex-col gap-1 active:scale-[0.98] transition-all ${outlet.name === "Domino's" && outlet.location === 'HSR Layout' ? 'bg-blue-50 border-[#1E90FF]' : 'bg-[#FFFFFF] border-slate-200 hover:border-[#1E90FF]'}`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className={`text-[15px] font-bold ${outlet.name === "Domino's" && outlet.location === 'HSR Layout' ? 'text-[#1E90FF]' : 'text-slate-900'}`}>
                      {outlet.name}
                    </h3>
                    {outlet.name === "Domino's" && outlet.location === 'HSR Layout' && (
                       <CheckCircle size={18} className="text-[#1E90FF]" />
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <MapPin size={12} className="text-slate-400" />
                    <span className="text-[13px] text-slate-500">{outlet.location}</span>
                  </div>
                  <span className={`inline-block px-2 py-0.5 mt-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider w-fit ${
                    outlet.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {outlet.status}
                  </span>
                </button>
              ))}
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50 pb-safe">
              <p className="text-xs text-center text-slate-500 font-medium">To edit or add outlets, go to Profile &gt; Manage Outlets</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
