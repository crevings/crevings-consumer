import React, { useState } from 'react';
import { 
  ArrowLeft, Download, Clock, CalendarDays, Users, User, XCircle, AlertCircle, CheckCircle2, ShoppingBag, Coffee, Sun, CloudSun, Moon, List, PieChart, Globe, Store, AlertTriangle
} from 'lucide-react';

interface SalesReportViewProps {
  onBack?: () => void;
}

export const SalesReportView: React.FC<SalesReportViewProps> = ({ onBack }) => {

  const worstItemsData = [
    { name: 'Veg Hakka Noodles', category: 'Chinese', quantity: 12, revenue: '₹ 1,800', percent: '2%' },
    { name: 'Mushroom Soup', category: 'Soups', quantity: 8, revenue: '₹ 1,200', percent: '1.5%' },
    { name: 'Diet Coke', category: 'Beverages', quantity: 5, revenue: '₹ 300', percent: '0.8%' },
    { name: 'Plain Dosa', category: 'South Indian', quantity: 3, revenue: '₹ 240', percent: '0.5%' },
    { name: 'Green Salad', category: 'Sides', quantity: 2, revenue: '₹ 150', percent: '0.2%' },
  ];

  const timeBasedData = [
    { label: 'Breakfast', time: '6:00 AM - 11:00 AM', icon: Coffee, revenue: '₹ 12,400', orders: 45, color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: 'Lunch', time: '11:00 AM - 3:00 PM', icon: Sun, revenue: '₹ 45,600', orders: 120, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Evening', time: '3:00 PM - 7:00 PM', icon: CloudSun, revenue: '₹ 28,500', orders: 85, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Dinner', time: '7:00 PM - 12:00 AM', icon: Moon, revenue: '₹ 68,900', orders: 210, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  ];

  const categoryData = [
    { label: 'Main Course', percent: '45%', amount: '₹ 56,025', color: 'bg-orange-100 text-orange-600' },
    { label: 'Starters', percent: '25%', amount: '₹ 31,125', color: 'bg-teal-100 text-teal-600' },
    { label: 'Beverages', percent: '15%', amount: '₹ 18,675', color: 'bg-cyan-100 text-cyan-600' },
    { label: 'Desserts', percent: '10%', amount: '₹ 12,450', color: 'bg-pink-100 text-pink-600' },
    { label: 'Breads', percent: '5%', amount: '₹ 6,225', color: 'bg-yellow-100 text-yellow-600' },
  ];

  const subCategoryData = [
    { label: 'Pizza', percent: '30%', amount: '₹ 37,350', color: 'bg-red-100 text-red-600' },
    { label: 'Burgers', percent: '20%', amount: '₹ 24,900', color: 'bg-blue-100 text-blue-600' },
    { label: 'Pasta', percent: '15%', amount: '₹ 18,675', color: 'bg-green-100 text-green-600' },
    { label: 'Shakes', percent: '12%', amount: '₹ 14,940', color: 'bg-purple-100 text-purple-600' },
    { label: 'Ice Cream', percent: '8%', amount: '₹ 9,960', color: 'bg-pink-100 text-pink-600' },
    { label: 'Others', percent: '15%', amount: '₹ 18,675', color: 'bg-slate-100 text-slate-600' },
  ];

  const foodItemsData = [
    { name: 'Margherita Pizza', category: 'Pizza', quantity: 145, revenue: '₹ 43,500', percent: '35%' },
    { name: 'Paneer Tikka', category: 'Starters', quantity: 120, revenue: '₹ 30,000', percent: '24%' },
    { name: 'Veggie Burger', category: 'Burgers', quantity: 180, revenue: '₹ 27,000', percent: '21%' },
    { name: 'Cold Coffee', category: 'Beverages', quantity: 95, revenue: '₹ 14,250', percent: '11%' },
    { name: 'Garlic Bread', category: 'Sides', quantity: 65, revenue: '₹ 9,750', percent: '9%' },
  ];

  return (
    <div className="min-h-screen bg-[#FFFFFF] font-sans animate-in fade-in duration-300 pb-20">
      {/* Page Header */}
      <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-slate-100 h-[56px] flex items-center justify-between px-4">
        <div className="flex items-center">
          <button 
            onClick={onBack} 
            className="w-10 h-10 flex items-center justify-center -ml-2 text-slate-700 active:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-[18px] font-semibold text-slate-900 ml-2">Sales Report</h1>
        </div>
        <button className="h-8 px-3 bg-blue-50 text-blue-600 rounded-full text-[13px] font-medium flex items-center gap-1.5 active:scale-95 transition-transform">
          <Download size={14} />
          Download
        </button>
      </header>

      <div className="p-4 space-y-4 pt-6">
        
        {/* Operational Hours Card */}
        <div className="bg-[#FFFFFF] rounded-[20px] p-5 border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="flex-1 border-r border-slate-100">
            <div className="flex items-center gap-2 text-slate-500 mb-2 mt-1">
              <CalendarDays size={18} className="text-[#1E90FF]"/>
              <h3 className="text-[13px] font-medium">Days Opened</h3>
            </div>
            <p className="text-2xl font-bold text-slate-900">26 <span className="text-[12px] font-medium text-slate-500 ml-1">days</span></p>
          </div>
          <div className="flex-1 pl-5">
            <div className="flex items-center gap-2 text-slate-500 mb-2 mt-1">
              <Clock size={18} className="text-emerald-500"/>
              <h3 className="text-[13px] font-medium">Total Hours</h3>
            </div>
            <p className="text-2xl font-bold text-slate-900">312 <span className="text-[12px] font-medium text-slate-500 ml-1">hours</span></p>
          </div>
        </div>

        {/* Sales Overview Advanced Layout */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[16px] font-bold text-slate-900">Sales Overview</h3>
            <span className="text-[12px] font-medium text-slate-500">Today</span>
          </div>

          {/* Hero Net Sales */}
          <div className="bg-slate-900 rounded-[20px] p-5 relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <p className="text-white/70 text-[12px] font-bold uppercase tracking-wider mb-1">Net Sales</p>
            <p className="text-[32px] font-black text-white leading-tight mb-2">₹ 1,24,500</p>
            <div className="inline-flex items-center bg-white/10 px-2 py-1 rounded-lg">
              <ShoppingBag size={12} className="text-white/80 mr-1.5" />
              <span className="text-[12px] font-medium text-white/90">420 Orders</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
             {/* Online Orders Card */}
             <div className="bg-[#FFFFFF] border border-slate-200 rounded-[20px] p-4 flex flex-col">
               <div className="flex items-center gap-2 mb-3">
                 <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                   <Globe size={14} className="text-[#1E90FF]" />
                 </div>
                 <span className="font-bold text-slate-800 text-[14px]">Online</span>
               </div>
               <p className="text-[20px] font-black text-slate-900 mb-0.5">₹ 85,200</p>
               <p className="text-[12px] font-medium text-slate-500 mb-4">285 Orders</p>
               
               <div className="mt-auto space-y-2 border-t border-slate-100 pt-3">
                 <div className="flex justify-between items-center">
                   <span className="text-[11px] font-bold text-slate-400 uppercase">Delivery</span>
                   <span className="text-[12px] font-bold text-slate-700">₹49.3K <span className="font-medium text-slate-400">/ 198</span></span>
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="text-[11px] font-bold text-slate-400 uppercase">Takeaway</span>
                   <span className="text-[12px] font-bold text-slate-700">₹15.4K <span className="font-medium text-slate-400">/ 42</span></span>
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="text-[11px] font-bold text-slate-400 uppercase">Dine In</span>
                   <span className="text-[12px] font-bold text-slate-700">₹12K <span className="font-medium text-slate-400">/ 30</span></span>
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="text-[11px] font-bold text-slate-400 uppercase">Booking</span>
                   <span className="text-[12px] font-bold text-slate-700">₹8.5K <span className="font-medium text-slate-400">/ 15</span></span>
                 </div>
               </div>
             </div>

             {/* Offline Orders Card */}
              <div className="bg-[#FFFFFF] border border-slate-200 rounded-[20px] p-4 flex flex-col">
               <div className="flex items-center gap-2 mb-3">
                 <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
                   <Store size={14} className="text-amber-600" />
                 </div>
                 <span className="font-bold text-slate-800 text-[14px]">Offline</span>
               </div>
               <p className="text-[20px] font-black text-slate-900 mb-0.5">₹ 39,300</p>
               <p className="text-[12px] font-medium text-slate-500 mb-4">135 Orders</p>
               
               <div className="mt-auto space-y-2 border-t border-slate-100 pt-3">
                 <div className="flex justify-between items-center">
                   <span className="text-[11px] font-bold text-slate-400 uppercase">Dine In</span>
                   <span className="text-[12px] font-bold text-slate-700">₹25K <span className="font-medium text-slate-400">/ 90</span></span>
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="text-[11px] font-bold text-slate-400 uppercase">Takeaway</span>
                   <span className="text-[12px] font-bold text-slate-700">₹14.3K <span className="font-medium text-slate-400">/ 45</span></span>
                 </div>
               </div>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
             {/* AOV Metrics */}
             <div className="bg-[#FFFFFF] border border-slate-200 rounded-[20px] p-4 flex flex-col justify-between">
                <div>
                   <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Net AOV</p>
                   <p className="text-[20px] font-black text-slate-900">₹ 296</p>
                </div>
                <div className="mt-4 space-y-2">
                   <div className="flex justify-between">
                     <span className="text-[11px] font-medium text-slate-500">Dine In</span>
                     <span className="text-[12px] font-bold text-slate-700">₹308</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-[11px] font-medium text-slate-500">Takeaway</span>
                     <span className="text-[12px] font-bold text-slate-700">₹341</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-[11px] font-medium text-slate-500">Delivery</span>
                     <span className="text-[12px] font-bold text-slate-700">₹248</span>
                   </div>
                </div>
             </div>

             {/* Refund & Cancellations */}
             <div className="flex flex-col gap-3">
               <div className="bg-rose-50 border border-rose-100 rounded-[20px] p-4 flex-1 flex flex-col justify-center">
                  <div className="flex items-center justify-between mb-2">
                     <p className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">Refund Loss</p>
                     <AlertCircle size={14} className="text-rose-500" />
                  </div>
                  <p className="text-[20px] font-black text-slate-900">₹ 1,200</p>
                  <p className="text-[11px] font-medium text-rose-500 mt-0.5">4 orders</p>
               </div>
               <div className="bg-orange-50 border border-orange-100 rounded-[20px] p-4 flex-1 flex flex-col justify-center">
                  <div className="flex items-center justify-between mb-2">
                     <p className="text-[11px] font-bold text-orange-600 uppercase tracking-wider">Cancelled</p>
                     <XCircle size={14} className="text-orange-500" />
                  </div>
                  <p className="text-[20px] font-black text-slate-900">23</p>
                  <p className="text-[11px] font-medium text-orange-500 mt-0.5">orders</p>
               </div>
             </div>
          </div>
        </div>

        {/* Customer Type Contribution */}
        <div className="bg-[#FFFFFF] rounded-[20px] p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[15px] font-semibold text-slate-900">Customer Type</h3>
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500">
              <Users size={16} />
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">New vs Returning</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
            <div className="h-full bg-blue-500" style={{ width: '68%' }} />
            <div className="h-full bg-emerald-500" style={{ width: '32%' }} />
          </div>
          <div className="flex justify-between mt-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-xs font-medium text-slate-600">New (68%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-slate-600">Returning (32%)</span>
            </div>
          </div>
        </div>

        {/* Gender Ratio */}
        <div className="bg-[#FFFFFF] rounded-[20px] p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[15px] font-semibold text-slate-900">Gender Ratio</h3>
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500">
              <User size={16} />
            </div>
          </div>
          
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
            <div className="h-full bg-indigo-500" style={{ width: '55%' }} />
            <div className="h-full bg-pink-500" style={{ width: '45%' }} />
          </div>
          <div className="flex justify-between mt-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500" />
              <span className="text-xs font-medium text-slate-600">Male (55%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-pink-500" />
              <span className="text-xs font-medium text-slate-600">Female (45%)</span>
            </div>
          </div>
        </div>

        {/* Order Analytics */}
        <div className="bg-[#FFFFFF] rounded-[20px] p-5 border border-slate-100 shadow-sm">
          <h3 className="text-[15px] font-semibold text-slate-900 mb-5">Order Analytics</h3>
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <ShoppingBag size={14} />
                <span className="text-xs font-medium uppercase tracking-wider">Total</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">1,245</h3>
            </div>
            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
              <div className="flex items-center gap-2 text-emerald-600 mb-1">
                <CheckCircle2 size={14} />
                <span className="text-xs font-medium uppercase tracking-wider">Completed</span>
              </div>
              <h3 className="text-xl font-bold text-emerald-700">1,180</h3>
            </div>
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
              <div className="flex items-center gap-2 text-amber-600 mb-1">
                <Clock size={14} />
                <span className="text-xs font-medium uppercase tracking-wider">Delayed</span>
              </div>
              <h3 className="text-xl font-bold text-amber-700">42</h3>
            </div>
            <div className="bg-rose-50 rounded-2xl p-4 border border-rose-100">
              <div className="flex items-center gap-2 text-rose-600 mb-1">
                <XCircle size={14} />
                <span className="text-xs font-medium uppercase tracking-wider">Cancelled</span>
              </div>
              <h3 className="text-xl font-bold text-rose-700">23</h3>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-600">
              <AlertCircle size={16} />
              <span className="text-[14px] font-medium">Cancellation Rate</span>
            </div>
            <h3 className="text-lg font-bold text-rose-500">1.8%</h3>
          </div>
        </div>

        {/* Time-Based Insights */}
        <div className="bg-[#FFFFFF] rounded-[20px] p-5 border border-slate-100 shadow-sm">
          <div className="mb-6">
            <h3 className="text-[15px] font-semibold text-slate-900">Time-Based Insights</h3>
            <p className="text-xs text-slate-500 mt-1">Order volume during different times of day</p>
          </div>
          
          <div className="space-y-3">
            {timeBasedData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${item.bg} ${item.color} rounded-full flex items-center justify-center`}>
                    <item.icon size={18} />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-semibold text-slate-900">{item.label}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">{item.revenue}</p>
                  <p className="text-[11px] font-medium text-slate-500 mt-0.5">{item.orders} orders</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Contribution */}
        <div className="bg-[#FFFFFF] rounded-[20px] p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-[15px] font-semibold text-slate-900">Category Contribution</h3>
              <p className="text-xs text-slate-500 mt-0.5">Revenue by main categories</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500">
              <PieChart size={16} />
            </div>
          </div>

          <div className="space-y-4">
            {categoryData.map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${item.color.split(' ')[0].replace('bg-', 'bg-').replace('-100', '-500')}`} />
                    <span className="text-sm font-medium text-slate-700">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-slate-500">{item.percent}</span>
                    <span className="text-sm font-semibold text-slate-900">{item.amount}</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${item.color.split(' ')[0].replace('bg-', 'bg-').replace('-100', '-500')}`} 
                    style={{ width: item.percent }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sub-Category Contribution */}
        <div className="bg-[#FFFFFF] rounded-[20px] p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-[15px] font-semibold text-slate-900">Sub-Category Contribution</h3>
              <p className="text-xs text-slate-500 mt-0.5">Revenue by sub-categories</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500">
              <PieChart size={16} />
            </div>
          </div>

          <div className="space-y-4">
            {subCategoryData.map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${item.color.split(' ')[0].replace('bg-', 'bg-').replace('-100', '-500')}`} />
                    <span className="text-sm font-medium text-slate-700">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-slate-500">{item.percent}</span>
                    <span className="text-sm font-semibold text-slate-900">{item.amount}</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${item.color.split(' ')[0].replace('bg-', 'bg-').replace('-100', '-500')}`} 
                    style={{ width: item.percent }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Items Revenue */}
        <div className="bg-[#FFFFFF] rounded-[20px] p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-[15px] font-semibold text-slate-900">Top Items Revenue</h3>
              <p className="text-xs text-slate-500 mt-0.5">Best performing food items</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500">
              <List size={16} />
            </div>
          </div>

          <div className="space-y-4">
            {foodItemsData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                    #{idx + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">{item.name}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] font-medium text-slate-500">{item.category}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span className="text-[11px] font-medium text-slate-500">{item.quantity} sold</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">{item.revenue}</p>
                  <p className="text-[11px] font-medium text-emerald-600 mt-0.5">{item.percent} of total</p>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 py-3 text-sm font-semibold text-blue-600 bg-blue-50 rounded-xl active:scale-[0.98] transition-transform">
            View All Items
          </button>
        </div>

        {/* Worst Performing Items */}
        <div className="bg-[#FFFFFF] rounded-[20px] p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-[15px] font-semibold text-slate-900">Worst Performing Items</h3>
              <p className="text-xs text-slate-500 mt-0.5">Items with lowest sales volume</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500">
              <List size={16} />
            </div>
          </div>

          <div className="space-y-3">
            {worstItemsData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs">
                    #{idx + 1}
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-slate-900">{item.name}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] font-medium text-slate-500">{item.category}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span className="text-[11px] font-medium text-slate-500">{item.quantity} sold</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-bold text-slate-900">{item.revenue}</p>
                  <p className="text-[11px] font-medium text-slate-500 mt-0.5">{item.percent} of total</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
