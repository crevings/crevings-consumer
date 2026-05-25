
import React, { useState } from 'react';
import { 
  ArrowLeft,
  BarChart3, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Users, 
  ShoppingBag, 
  Clock, 
  Filter, 
  Calendar,
  ChevronDown,
  Info,
  Sparkles,
  RefreshCw,
  PieChart as PieIcon,
  MousePointer2,
  Trophy,
  Wallet,
  XCircle,
  ChevronRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Cell,
  PieChart,
  Pie
} from 'recharts';

const blueColor = '#1E90FF';

const salesData = [
  { name: 'Mon', value: 4200 },
  { name: 'Tue', value: 3800 },
  { name: 'Wed', value: 5100 },
  { name: 'Thu', value: 4600 },
  { name: 'Fri', value: 7200 },
  { name: 'Sat', value: 8900 },
  { name: 'Sun', value: 8400 },
];

const peakHoursData = [
  { hour: '12 PM', orders: 12 },
  { hour: '1 PM', orders: 18 },
  { hour: '2 PM', orders: 15 },
  { hour: '7 PM', orders: 22 },
  { hour: '8 PM', orders: 34 },
  { hour: '9 PM', orders: 28 },
  { hour: '10 PM', orders: 14 },
];

const channelData = [
  { name: 'Direct', value: 45, color: '#1E90FF' },
  { name: 'Zomato', value: 35, color: '#E23744' },
  { name: 'Swiggy', value: 20, color: '#FC8019' },
];

const topItems = [
  { name: 'Paneer Pizza', sales: 142, revenue: '₹42,458', growth: '+12%' },
  { name: 'Gourmet Burger', sales: 98, revenue: '₹44,100', growth: '+8%' },
  { name: 'Coke Zero', sales: 85, revenue: '₹10,200', growth: '+4%' },
];

const todayMetrics = [
  { label: 'GROSS REVENUE', val: '₹12,450', sub: '+18%', icon: Wallet, color: 'text-blue-500', bg: 'bg-blue-50' },
  { label: 'TOTAL ORDERS', val: '42', sub: '+12%', icon: ShoppingBag, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { label: 'AVG ORDER VAL', val: '₹296', sub: '-2%', icon: MousePointer2, color: 'text-amber-500', bg: 'bg-amber-50' },
  { label: 'CANCELLED', val: '01', sub: '0%', icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-50' }
];

export const AnalyticsView: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [timeRange, setTimeRange] = useState('This Week');

  return (
    <div className="pb-40 px-6 pt-8 space-y-10 animate-in fade-in duration-1000 bg-[#FFFFFF] min-h-screen font-sans lg:bg-transparent lg:px-0 lg:pt-0 lg:pb-10">
      <header className="flex items-end justify-between px-1">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            {onBack && (
              <button onClick={onBack} className="w-8 h-8 flex items-center justify-center -ml-2 text-slate-700 active:scale-95 transition-transform">
                <ArrowLeft size={20} />
              </button>
            )}
            <div style={{ backgroundColor: blueColor }} className="w-2 h-2 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Intelligence Suite</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">Analytics</h1>
        </div>
        <button className="w-[52px] h-[52px] bg-[#1E90FF] text-[#FFFFFF] rounded-[16px] flex items-center justify-center active:scale-[0.98] transition-all shadow-sm">
           <RefreshCw size={18} />
        </button>
      </header>

      {/* Today Stats Section - Added per user request */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
           <h3 className="text-[12px] font-black text-slate-900 tracking-widest leading-none uppercase">Today Live Metrics</h3>
           <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-blue-50/50 border border-blue-100/50">
              <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest animate-pulse">Real-time Sync</span>
           </div>
        </div>
        
        <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-6 px-6 py-1">
           {todayMetrics.map((stat, idx) => (
             <div 
               key={idx} 
               className="flex-shrink-0 w-[180px] bg-[#FFFFFF] rounded-[28px] p-5 border border-slate-100 shadow-sm hover:border-blue-200 transition-all group"
             >
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                     <stat.icon size={20} />
                  </div>
                  <div className={`px-2 py-0.5 rounded-lg text-[9px] font-black ${stat.sub.startsWith('+') ? 'text-emerald-500 bg-emerald-50' : stat.sub === '0%' ? 'text-slate-400 bg-slate-50' : 'text-rose-500 bg-rose-50'}`}>
                    {stat.sub}
                  </div>
                </div>
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <h4 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{stat.val}</h4>
                </div>
             </div>
           ))}
        </div>
      </section>

      {/* Time Range Selector */}
      <section className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 pt-2">
         {['Today', 'This Week', 'This Month', 'YTD'].map(range => (
           <button 
             key={range}
             onClick={() => setTimeRange(range)}
             className={`flex-shrink-0 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
               timeRange === range 
                ? 'bg-slate-900 border-slate-900 text-white shadow-lg' 
                : 'bg-[#FFFFFF] border-slate-100 text-slate-400 hover:border-slate-300'
             }`}
           >
             {range}
           </button>
         ))}
      </section>

      {/* Primary KPI Grid */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
         <div className="bg-[#FFFFFF] rounded-[32px] p-6 border border-slate-100 space-y-4 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
               <TrendingUp size={20} />
            </div>
            <div>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Sales</p>
               <h3 className="text-2xl font-black text-slate-900 tracking-tighter">₹42.5k</h3>
               <div className="flex items-center gap-1 mt-1 text-emerald-500">
                  <ArrowUpRight size={12} strokeWidth={3} />
                  <span className="text-[10px] font-black">+14.2%</span>
               </div>
            </div>
         </div>
         <div className="bg-[#FFFFFF] rounded-[32px] p-6 border border-slate-100 space-y-4 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
               <ShoppingBag size={20} />
            </div>
            <div>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Orders</p>
               <h3 className="text-2xl font-black text-slate-900 tracking-tighter">1,240</h3>
               <div className="flex items-center gap-1 mt-1 text-emerald-500">
                  <ArrowUpRight size={12} strokeWidth={3} />
                  <span className="text-[10px] font-black">+5.8%</span>
               </div>
            </div>
         </div>
         <div className="bg-[#FFFFFF] rounded-[32px] p-6 border border-slate-100 space-y-4 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
               <MousePointer2 size={20} />
            </div>
            <div>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Avg Order Val</p>
               <h3 className="text-2xl font-black text-slate-900 tracking-tighter">₹342</h3>
               <div className="flex items-center gap-1 mt-1 text-rose-500">
                  <ArrowDownRight size={12} strokeWidth={3} />
                  <span className="text-[10px] font-black">-2.1%</span>
               </div>
            </div>
         </div>
         <div className="bg-[#FFFFFF] rounded-[32px] p-6 border border-slate-100 space-y-4 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
               <Users size={20} />
            </div>
            <div>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">New Guests</p>
               <h3 className="text-2xl font-black text-slate-900 tracking-tighter">412</h3>
               <div className="flex items-center gap-1 mt-1 text-emerald-500">
                  <ArrowUpRight size={12} strokeWidth={3} />
                  <span className="text-[10px] font-black">+22%</span>
               </div>
            </div>
         </div>
      </section>

      {/* Main Revenue Chart */}
      <section className="bg-[#FFFFFF] rounded-[40px] p-8 border border-slate-100 space-y-8 shadow-sm">
         <div className="flex items-center justify-between">
            <div>
               <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Revenue Trend</h3>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Daily gross performance</p>
            </div>
            <div className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Sales</span>
            </div>
         </div>
         
         <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={salesData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                     <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={blueColor} stopOpacity={0.1}/>
                        <stop offset="95%" stopColor={blueColor} stopOpacity={0}/>
                     </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis 
                     dataKey="name" 
                     axisLine={false} 
                     tickLine={false} 
                     tick={{ fontSize: 10, fontWeight: 700, fill: '#94A3B8' }} 
                     dy={10}
                  />
                  <YAxis 
                     axisLine={false} 
                     tickLine={false} 
                     tick={{ fontSize: 10, fontWeight: 700, fill: '#94A3B8' }} 
                  />
                  <Tooltip 
                     contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Area 
                     type="monotone" 
                     dataKey="value" 
                     stroke={blueColor} 
                     strokeWidth={4} 
                     fillOpacity={1} 
                     fill="url(#colorValue)" 
                  />
               </AreaChart>
            </ResponsiveContainer>
         </div>
      </section>

      {/* Channel Breakdown & Peak Hours */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
         <section className="bg-[#FFFFFF] rounded-[40px] p-8 border border-slate-100 space-y-8 shadow-sm">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                  <Clock size={20} />
               </div>
               <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Peak Load</h3>
            </div>
            <div className="h-56 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={peakHoursData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                     <XAxis 
                        dataKey="hour" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 9, fontWeight: 700, fill: '#94A3B8' }} 
                     />
                     <Bar dataKey="orders" radius={[10, 10, 0, 0]}>
                        {peakHoursData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.orders > 25 ? '#F43F5E' : blueColor} />
                        ))}
                     </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </section>

         <section className="bg-[#FFFFFF] rounded-[40px] p-8 border border-slate-100 flex items-center justify-between shadow-sm">
            <div className="space-y-6">
               <div>
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-none">Channel Mix</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Revenue source ratio</p>
               </div>
               <div className="space-y-3">
                  {channelData.map(item => (
                     <div key={item.name} className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-[10px] font-black text-slate-700 uppercase tracking-wide">{item.name}</span>
                        <span className="text-[10px] font-bold text-slate-400">{item.value}%</span>
                     </div>
                  ))}
               </div>
            </div>
            <div className="w-32 h-32">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie
                        data={channelData}
                        innerRadius={35}
                        outerRadius={55}
                        paddingAngle={5}
                        dataKey="value"
                     >
                        {channelData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                     </Pie>
                  </PieChart>
               </ResponsiveContainer>
            </div>
         </section>
      </div>

      {/* AI Performance Insight */}
      <section className="bg-slate-900 rounded-[44px] p-10 relative overflow-hidden group shadow-xl">
         <div style={{ backgroundColor: blueColor }} className="absolute top-0 right-0 w-64 h-64 opacity-10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
         <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#FFFFFF]/10 rounded-2xl flex items-center justify-center text-blue-400 border border-white/5">
                     <Sparkles size={24} fill="currentColor" />
                  </div>
                  <h4 className="text-white font-black text-xl tracking-tight leading-none uppercase italic">Gemini Insights</h4>
               </div>
               <div className="bg-blue-500 text-white px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest">Live Analysis</div>
            </div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-[0.15em] leading-relaxed">
              Your "Evening Rush" conversion is <span className="text-white font-black">18% higher</span> than market average. Recommend scaling inventory for Paneer Pizza by Thursday.
            </p>
            <div className="flex gap-4">
               <div className="flex-1 bg-[#FFFFFF]/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Impact Potential</p>
                  <p className="text-lg font-black text-emerald-400">₹8,400/mo</p>
               </div>
               <div className="flex-1 bg-[#FFFFFF]/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Confidence</p>
                  <p className="text-lg font-black text-blue-400">94%</p>
               </div>
            </div>
         </div>
      </section>

      {/* Leaderboard */}
      <section className="space-y-6">
         <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
               <Trophy size={16} className="text-amber-500" />
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Top Performing Items</h3>
            </div>
            <button className="text-[9px] font-black text-blue-500 uppercase">View Menu</button>
         </div>
         <div className="bg-[#FFFFFF] rounded-[40px] border border-slate-100 overflow-hidden divide-y divide-slate-50 shadow-sm">
            {topItems.map((item, idx) => (
               <div key={idx} className="p-6 flex items-center justify-between group hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 font-black text-xs border border-slate-100 group-hover:bg-[#FFFFFF] group-hover:text-blue-500 transition-all">
                        0{idx + 1}
                     </div>
                     <div>
                        <h4 className="text-sm font-black text-slate-900 leading-none uppercase">{item.name}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{item.sales} units sold</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-sm font-black text-slate-900 leading-none">{item.revenue}</p>
                     <p className="text-[10px] font-black text-emerald-500 mt-2 uppercase">{item.growth}</p>
                  </div>
               </div>
            ))}
         </div>
      </section>

      <footer className="text-center py-8 opacity-20">
         <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.4em]">Crevings Platform Engine • BI Node 4.2</p>
      </footer>
    </div>
  );
};
