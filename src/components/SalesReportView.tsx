import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Download, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  ChevronRight, 
  PieChart, 
  BarChart3, 
  Clock, 
  Users, 
  Wallet, 
  AlertCircle, 
  FileText, 
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Flame,
  ChevronDown,
  ChevronUp,
  ShoppingBag
} from 'lucide-react';
import * as XLSX from 'xlsx';

interface SalesReportViewProps {
  onBack: () => void;
}

type DateFilter = 'Today' | 'Yesterday' | 'Last 7 Days' | 'Last 30 Days' | 'Custom Range';

export const SalesReportView: React.FC<SalesReportViewProps> = ({ onBack }) => {
  const [dateFilter, setDateFilter] = useState<DateFilter>('Today');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const filters: DateFilter[] = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'Custom Range'];

  const handleDownload = (reportName: string) => {
    setIsDownloading(true);
    
    // Simulate API call and data generation
    setTimeout(() => {
      // Dummy data for the report
      const data = [
        { Date: '2026-03-23', OrderID: 'ORD-1001', Type: 'Delivery', Amount: 450, Status: 'Completed' },
        { Date: '2026-03-23', OrderID: 'ORD-1002', Type: 'Dine-In', Amount: 1200, Status: 'Completed' },
        { Date: '2026-03-23', OrderID: 'ORD-1003', Type: 'Takeaway', Amount: 350, Status: 'Completed' },
        { Date: '2026-03-23', OrderID: 'ORD-1004', Type: 'Delivery', Amount: 800, Status: 'Cancelled' },
      ];

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Report Data");
      
      // Generate Excel file and trigger download
      XLSX.writeFile(wb, `${reportName.replace(/\s+/g, '_')}_${dateFilter.replace(/\s+/g, '_')}.xlsx`);
      
      setIsDownloading(false);
    }, 1000);
  };

  const toggleCategory = (category: string) => {
    if (expandedCategory === category) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(category);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] pb-24 animate-in fade-in duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-700 active:scale-95 transition-transform"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-lg font-bold text-slate-900">Sales Report</h1>
        </div>
        <button 
          onClick={() => document.getElementById('download-section')?.scrollIntoView({ behavior: 'smooth' })}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 font-semibold text-sm active:scale-95 transition-transform"
        >
          <Download size={16} />
          <span>Export</span>
        </button>
      </header>

      {/* Date Filter */}
      <div className="bg-white border-b border-slate-200 pt-3 pb-3 sticky top-14 z-40">
        <div className="flex overflow-x-auto no-scrollbar px-4 gap-2">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setDateFilter(filter)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                dateFilter === filter 
                  ? 'bg-slate-900 text-white shadow-sm' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filter === 'Custom Range' && <Calendar size={14} className="inline mr-1.5 -mt-0.5" />}
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-6">
        
        {/* Top Summary Section (Hero) */}
        <section className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Summary</h2>
            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
              <TrendingUp size={14} />
              <span className="text-xs font-bold">+12% vs last period</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Sales</p>
              <p className="text-2xl font-black text-slate-900 tracking-tight">₹1,24,500</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Net Earnings</p>
              <p className="text-2xl font-black text-blue-600 tracking-tight">₹1,02,300</p>
            </div>
          </div>
          
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                <ShoppingBag size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Total Orders</p>
                <p className="text-base font-bold text-slate-900">320 Orders</p>
              </div>
            </div>
          </div>
        </section>

        {/* Smart Insights */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider px-1">Smart Insights</h3>
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-4 border border-indigo-100/50 space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5"><Flame size={16} className="text-orange-500" /></div>
              <p className="text-sm font-medium text-slate-700"><strong className="text-slate-900">Pizza</strong> contributes 32% of your total revenue.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5"><TrendingDown size={16} className="text-rose-500" /></div>
              <p className="text-sm font-medium text-slate-700"><strong className="text-slate-900">Lunch orders</strong> dropped 12% compared to yesterday.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5"><Lightbulb size={16} className="text-amber-500" /></div>
              <p className="text-sm font-medium text-slate-700"><strong className="text-slate-900">Promote Biryani</strong> for growth during dinner hours.</p>
            </div>
          </div>
        </section>

        {/* Revenue Breakdown */}
        <section className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Revenue Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-600">Gross Sales</span>
              <span className="text-sm font-bold text-slate-900">₹1,24,500</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-600">Discounts</span>
              <span className="text-sm font-bold text-rose-600">-₹8,000</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-600">Taxes</span>
              <span className="text-sm font-bold text-slate-900">₹10,500</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-600">Platform Fees</span>
              <span className="text-sm font-bold text-rose-600">-₹4,200</span>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
              <span className="text-base font-bold text-slate-900">Net Earnings</span>
              <span className="text-lg font-black text-blue-600">₹1,02,300</span>
            </div>
          </div>
        </section>

        {/* Sales Breakdown (By Order Type) */}
        <section className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Sales by Order Type</h3>
          <div className="space-y-4">
            {[
              { label: 'Delivery', amount: '₹60,000', percent: 48, color: 'bg-blue-500' },
              { label: 'Takeaway', amount: '₹25,000', percent: 20, color: 'bg-indigo-500' },
              { label: 'Dine-In', amount: '₹30,000', percent: 24, color: 'bg-emerald-500' },
              { label: 'Booking', amount: '₹9,500', percent: 8, color: 'bg-amber-500' },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-bold text-slate-700">{item.label}</span>
                  <span className="text-sm font-bold text-slate-900">{item.amount}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Order Metrics & Payment Split */}
        <div className="grid grid-cols-2 gap-4">
          <section className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Order Metrics</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Total</p>
                <p className="text-sm font-bold text-slate-900">320</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Completed</p>
                <p className="text-sm font-bold text-emerald-600">304</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Cancelled</p>
                <p className="text-sm font-bold text-rose-600">16 (5%)</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Avg Value</p>
                <p className="text-sm font-bold text-slate-900">₹389</p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Payment Split</h3>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Prepaid (Online)</p>
                <p className="text-sm font-bold text-slate-900">₹84,500</p>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1">
                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '68%' }}></div>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Cash on Delivery</p>
                <p className="text-sm font-bold text-slate-900">₹40,000</p>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1">
                  <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '32%' }}></div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Category Contribution Section */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Category Contribution</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {[
              { name: 'Pizza', amount: '₹40,000', percent: '32%', items: [{ name: 'Veg Supreme Pizza', amount: '₹18,000' }, { name: 'Farmhouse Pizza', amount: '₹12,000' }, { name: 'Margherita', amount: '₹10,000' }] },
              { name: 'Biryani', amount: '₹30,000', percent: '24%', items: [{ name: 'Chicken Biryani', amount: '₹22,000' }, { name: 'Veg Biryani', amount: '₹8,000' }] },
              { name: 'Beverages', amount: '₹15,000', percent: '12%', items: [{ name: 'Coke Zero', amount: '₹8,000' }, { name: 'Cold Coffee', amount: '₹7,000' }] },
            ].map((category, idx) => (
              <div key={idx} className="bg-white">
                <button 
                  onClick={() => toggleCategory(category.name)}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                      <PieChart size={14} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-slate-900">{category.name}</p>
                      <p className="text-xs font-medium text-slate-500">{category.percent} of revenue</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-900">{category.amount}</span>
                    {expandedCategory === category.name ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                  </div>
                </button>
                
                {/* Drill Down */}
                {expandedCategory === category.name && (
                  <div className="bg-slate-50 px-4 py-3 border-t border-slate-100/50">
                    <div className="space-y-2">
                      {category.items.map((item, i) => (
                        <div key={i} className="flex justify-between items-center pl-11 pr-7">
                          <span className="text-xs font-medium text-slate-600">{item.name}</span>
                          <span className="text-xs font-bold text-slate-900">{item.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Item Performance Section */}
        <div className="grid grid-cols-2 gap-4">
          <section className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={16} className="text-emerald-500" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Top Items</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-bold text-slate-800 truncate">Chicken Biryani</p>
                <p className="text-[10px] font-medium text-emerald-600">₹22,000</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 truncate">Paneer Pizza</p>
                <p className="text-[10px] font-medium text-emerald-600">₹18,000</p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown size={16} className="text-rose-500" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Low Items</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-bold text-slate-800 truncate">Veg Soup</p>
                <p className="text-[10px] font-medium text-rose-600">3 orders</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 truncate">Cold Salad</p>
                <p className="text-[10px] font-medium text-rose-600">2 orders</p>
              </div>
            </div>
          </section>
        </div>

        {/* Time-Based & Customer Insights */}
        <div className="grid grid-cols-2 gap-4">
          <section className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Time Insights</h3>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Peak Hours</p>
                <p className="text-sm font-bold text-slate-900">7 PM – 10 PM</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Low Hours</p>
                <p className="text-sm font-bold text-slate-900">3 PM – 5 PM</p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Customers</h3>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">New</p>
                <p className="text-sm font-bold text-slate-900">120</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Repeat</p>
                <p className="text-sm font-bold text-slate-900">200</p>
              </div>
            </div>
          </section>
        </div>

        {/* Customer Insight Banner */}
        <div className="bg-blue-50 rounded-xl p-3 border border-blue-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <Users size={14} />
          </div>
          <p className="text-xs font-medium text-blue-900">
            Top 20% of your customers generate <strong>60% of your revenue</strong>.
          </p>
        </div>

        {/* Settlement & Refund Section */}
        <section className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Available Balance</p>
              <p className="text-xl font-black text-slate-900">₹42,500</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Pending Settlement</p>
              <p className="text-xl font-black text-slate-900">₹18,200</p>
            </div>
          </div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Next Payout Date</p>
              <p className="text-sm font-bold text-slate-900">24 Mar 2026</p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-1">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Refund Amount</p>
              <p className="text-sm font-bold text-rose-600">₹2,400</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Cancellation Loss</p>
              <p className="text-sm font-bold text-rose-600">₹1,800</p>
            </div>
          </div>
        </section>

        {/* Download Reports Section */}
        <section id="download-section" className="pt-4">
          <h2 className="text-lg font-black text-slate-900 mb-4 px-1">Download Reports</h2>
          
          <div className="space-y-6">
            {/* Sales Reports */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Sales Reports</h3>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
                {[
                  { name: 'Sales Summary Report', icon: BarChart3 },
                  { name: 'Order-Level Report', icon: FileText },
                  { name: 'Item Performance Report', icon: PieChart },
                ].map((report, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleDownload(report.name)}
                    disabled={isDownloading}
                    className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors disabled:opacity-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <report.icon size={16} />
                      </div>
                      <span className="text-sm font-bold text-slate-700">{report.name}</span>
                    </div>
                    <Download size={18} className="text-slate-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* Financial Reports */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Financial Reports</h3>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
                {[
                  { name: 'Settlement / Payout Report', icon: Wallet },
                  { name: 'GST / Tax Report', icon: FileSpreadsheet },
                  { name: 'Refund Report', icon: AlertCircle },
                ].map((report, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleDownload(report.name)}
                    disabled={isDownloading}
                    className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors disabled:opacity-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <report.icon size={16} />
                      </div>
                      <span className="text-sm font-bold text-slate-700">{report.name}</span>
                    </div>
                    <Download size={18} className="text-slate-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* Customer & Operational Reports */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Other Reports</h3>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
                {[
                  { name: 'Customer Data Export', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                  { name: 'Time-Based Sales Report', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
                  { name: 'Payment Mode Report', icon: Wallet, color: 'text-purple-600', bg: 'bg-purple-50' },
                  { name: 'Category Performance Report', icon: PieChart, color: 'text-rose-600', bg: 'bg-rose-50' },
                ].map((report, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleDownload(report.name)}
                    disabled={isDownloading}
                    className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors disabled:opacity-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${report.bg} flex items-center justify-center ${report.color}`}>
                        <report.icon size={16} />
                      </div>
                      <span className="text-sm font-bold text-slate-700">{report.name}</span>
                    </div>
                    <Download size={18} className="text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Loading Overlay for Download */}
      {isDownloading && (
        <div className="fixed inset-0 z-[100] bg-slate-900/20 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 shadow-xl flex flex-col items-center max-w-[200px]">
            <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-bold text-slate-900 text-center">Generating Report...</p>
            <p className="text-xs text-slate-500 text-center mt-1">Please wait</p>
          </div>
        </div>
      )}
    </div>
  );
};
