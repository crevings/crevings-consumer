
import React, { useState, useMemo } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight,
  ShoppingBag, 
  Utensils, 
  Bike, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Banknote,
  Receipt,
  Megaphone,
  RotateCcw,
  MoreHorizontal,
  ArrowRight,
  Filter,
  Info,
  Loader2,
  X,
  Search,
  HelpCircle,
  AlertCircle,
  FileText,
  Gift
} from 'lucide-react';

export const EarningsView: React.FC = () => {
  const [availableFunds, setAvailableFunds] = useState(50000);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawStep, setWithdrawStep] = useState<'input' | 'confirm' | 'loading' | 'success'>('input');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Today');
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date(2026, 1, 1)); // Start with Feb 2026
  const [isAutoWithdrawalEnabled, setIsAutoWithdrawalEnabled] = useState(true);
  const [showAutoWithdrawConfirm, setShowAutoWithdrawConfirm] = useState(false);
  const [isPlatformFeeBreakdownOpen, setIsPlatformFeeBreakdownOpen] = useState(false);
  const [pendingAutoWithdrawState, setPendingAutoWithdrawState] = useState(true);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'main' | 'all-payouts'>('main');
  const [selectedPayout, setSelectedPayout] = useState<any | null>(null);
  const [payoutSearchQuery, setPayoutSearchQuery] = useState('');
  const [payoutFilter, setPayoutFilter] = useState<'All' | 'Completed' | 'Pending' | 'Failed'>('All');
  const [activeActionSheet, setActiveActionSheet] = useState<'floating_cash' | 'pay_fines' | 'statement' | 'incentives' | null>(null);
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const [finesPaid, setFinesPaid] = useState(false);
  const [floatingCashPaid, setFloatingCashPaid] = useState(false);
  const [selectedStatementDuration, setSelectedStatementDuration] = useState('Last 10 Days');
  const [statementStartDate, setStatementStartDate] = useState('');
  const [statementEndDate, setStatementEndDate] = useState('');

  const handlePayFloatingCash = () => {
    setIsProcessingAction(true);
    setTimeout(() => {
      setIsProcessingAction(false);
      setFloatingCashPaid(true);
    }, 2000);
  };

  const handlePayFines = () => {
    setIsProcessingAction(true);
    setTimeout(() => {
      setIsProcessingAction(false);
      setFinesPaid(true);
    }, 2000);
  };

  const handleRequestStatement = () => {
    setIsProcessingAction(true);
    setTimeout(() => {
      setIsProcessingAction(false);
      setActiveActionSheet(null);
    }, 2000);
  };

  const handlePrevMonth = () => {
    setCurrentMonthDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const { onlineBreakdown, offlineBreakdown, deductionsData, grossRevenue, totalDeductions, netEarnings, overallRevenue } = useMemo(() => {
    switch (selectedFilter) {
      case 'Today':
        return {
          onlineBreakdown: [
            { label: 'Dine-in', icon: Utensils, percent: '20%', amount: '₹ 1,000', color: 'bg-slate-50 text-slate-500 border border-slate-100' },
            { label: 'Takeaway', icon: ShoppingBag, percent: '10%', amount: '₹ 500', color: 'bg-slate-50 text-slate-500 border border-slate-100' },
            { label: 'Delivery', icon: Bike, percent: '24%', amount: '₹ 1,200', color: 'bg-slate-50 text-slate-500 border border-slate-100' },
            { label: 'Booking', icon: Calendar, percent: '6%', amount: '₹ 300', color: 'bg-slate-50 text-slate-500 border border-slate-100' },
          ],
          offlineBreakdown: [
            { label: 'Dine-in', icon: Utensils, percent: '24%', amount: '₹ 1,200', color: 'bg-slate-50 text-slate-500 border border-slate-100' },
            { label: 'Takeaway', icon: ShoppingBag, percent: '16%', amount: '₹ 800', color: 'bg-slate-50 text-slate-500 border border-slate-100' },
          ],
          deductionsData: [
            { label: 'Offline Cash', icon: Banknote, sub: 'Collected at counter', amount: '- ₹200' },
            { label: 'GST (Delivery)', icon: Receipt, sub: '5% on delivery orders', amount: '- ₹75' },
            { label: 'Platform Fees', icon: ShoppingBag, sub: 'On online orders', amount: '- ₹150' },
          ],
          grossRevenue: '₹ 5,000',
          totalDeductions: '- ₹ 425',
          netEarnings: '₹ 4,375',
          overallRevenue: '₹ 5,000'
        };
      case 'Last 3 days':
        return {
          onlineBreakdown: [
            { label: 'Dine-in', icon: Utensils, percent: '19%', amount: '₹ 3,000', color: 'bg-slate-50 text-slate-500 border border-slate-100' },
            { label: 'Takeaway', icon: ShoppingBag, percent: '13%', amount: '₹ 2,000', color: 'bg-slate-50 text-slate-500 border border-slate-100' },
            { label: 'Delivery', icon: Bike, percent: '26%', amount: '₹ 4,000', color: 'bg-slate-50 text-slate-500 border border-slate-100' },
            { label: 'Booking', icon: Calendar, percent: '8%', amount: '₹ 1,200', color: 'bg-slate-50 text-slate-500 border border-slate-100' },
          ],
          offlineBreakdown: [
            { label: 'Dine-in', icon: Utensils, percent: '22%', amount: '₹ 3,400', color: 'bg-slate-50 text-slate-500 border border-slate-100' },
            { label: 'Takeaway', icon: ShoppingBag, percent: '13%', amount: '₹ 2,000', color: 'bg-slate-50 text-slate-500 border border-slate-100' },
          ],
          deductionsData: [
            { label: 'Offline Cash', icon: Banknote, sub: 'Collected at counter', amount: '- ₹600' },
            { label: 'GST (Delivery)', icon: Receipt, sub: '5% on delivery orders', amount: '- ₹250' },
            { label: 'Ads Spend', icon: Megaphone, sub: 'In-app promotions', amount: '- ₹100' },
            { label: 'Platform Fees', icon: ShoppingBag, sub: 'On online orders', amount: '- ₹500' },
          ],
          grossRevenue: '₹ 15,600',
          totalDeductions: '- ₹ 1,450',
          netEarnings: '₹ 13,550',
          overallRevenue: '₹ 15,600'
        };
      case 'Last 7 days':
        return {
          onlineBreakdown: [
            { label: 'Dine-in', icon: Utensils, percent: '23%', amount: '₹ 8,000', color: 'bg-slate-50 text-slate-500 border border-slate-100' },
            { label: 'Takeaway', icon: ShoppingBag, percent: '11%', amount: '₹ 4,000', color: 'bg-slate-50 text-slate-500 border border-slate-100' },
            { label: 'Delivery', icon: Bike, percent: '23%', amount: '₹ 8,000', color: 'bg-slate-50 text-slate-500 border border-slate-100' },
            { label: 'Booking', icon: Calendar, percent: '6%', amount: '₹ 2,000', color: 'bg-slate-50 text-slate-500 border border-slate-100' },
          ],
          offlineBreakdown: [
            { label: 'Dine-in', icon: Utensils, percent: '24%', amount: '₹ 8,500', color: 'bg-slate-50 text-slate-500 border border-slate-100' },
            { label: 'Takeaway', icon: ShoppingBag, percent: '14%', amount: '₹ 5,000', color: 'bg-slate-50 text-slate-500 border border-slate-100' },
          ],
          deductionsData: [
            { label: 'Offline Cash', icon: Banknote, sub: 'Collected at counter', amount: '- ₹2,000' },
            { label: 'GST (Delivery)', icon: Receipt, sub: '5% on delivery orders', amount: '- ₹500' },
            { label: 'Ads Spend', icon: Megaphone, sub: 'In-app promotions', amount: '- ₹250' },
            { label: 'Refunds', icon: RotateCcw, sub: '1 Cancelled Order', amount: '- ₹250' },
            { label: 'Platform Fees', icon: ShoppingBag, sub: 'On online orders', amount: '- ₹1,000' },
          ],
          grossRevenue: '₹ 35,500',
          totalDeductions: '- ₹ 4,000',
          netEarnings: '₹ 29,500',
          overallRevenue: '₹ 35,500'
        };
      case 'Last 14 days':
        return {
          onlineBreakdown: [
            { label: 'Dine-in', icon: Utensils, percent: '25%', amount: '₹ 15,000', color: 'bg-slate-50 text-slate-500 border border-slate-100' },
            { label: 'Takeaway', icon: ShoppingBag, percent: '13%', amount: '₹ 8,000', color: 'bg-slate-50 text-slate-500 border border-slate-100' },
            { label: 'Delivery', icon: Bike, percent: '25%', amount: '₹ 15,000', color: 'bg-slate-50 text-slate-500 border border-slate-100' },
            { label: 'Booking', icon: Calendar, percent: '5%', amount: '₹ 3,200', color: 'bg-slate-50 text-slate-500 border border-slate-100' },
          ],
          offlineBreakdown: [
            { label: 'Dine-in', icon: Utensils, percent: '20%', amount: '₹ 12,000', color: 'bg-slate-50 text-slate-500 border border-slate-100' },
            { label: 'Takeaway', icon: ShoppingBag, percent: '13%', amount: '₹ 8,000', color: 'bg-slate-50 text-slate-500 border border-slate-100' },
          ],
          deductionsData: [
            { label: 'Offline Cash', icon: Banknote, sub: 'Collected at counter', amount: '- ₹3,700' },
            { label: 'GST (Delivery)', icon: Receipt, sub: '5% on delivery orders', amount: '- ₹900' },
            { label: 'Ads Spend', icon: Megaphone, sub: 'In-app promotions', amount: '- ₹400' },
            { label: 'Refunds', icon: RotateCcw, sub: '1 Cancelled Order', amount: '- ₹250' },
            { label: 'Platform Fees', icon: ShoppingBag, sub: 'On online orders', amount: '- ₹1,200' },
          ],
          grossRevenue: '₹ 61,200',
          totalDeductions: '- ₹ 6,450',
          netEarnings: '₹ 51,050',
          overallRevenue: '₹ 61,200'
        };
      case 'Last month':
      default:
        return {
          onlineBreakdown: [
            { label: 'Dine-in', icon: Utensils, percent: '24%', amount: '₹ 20,000', color: 'bg-slate-50 text-slate-500 border border-slate-100' },
            { label: 'Takeaway', icon: ShoppingBag, percent: '12%', amount: '₹ 10,000', color: 'bg-slate-50 text-slate-500 border border-slate-100' },
            { label: 'Delivery', icon: Bike, percent: '24%', amount: '₹ 20,000', color: 'bg-slate-50 text-slate-500 border border-slate-100' },
            { label: 'Booking', icon: Calendar, percent: '6%', amount: '₹ 5,000', color: 'bg-slate-50 text-slate-500 border border-slate-100' },
          ],
          offlineBreakdown: [
            { label: 'Dine-in', icon: Utensils, percent: '21%', amount: '₹ 18,000', color: 'bg-slate-50 text-slate-500 border border-slate-100' },
            { label: 'Takeaway', icon: ShoppingBag, percent: '14%', amount: '₹ 12,000', color: 'bg-slate-50 text-slate-500 border border-slate-100' },
          ],
          deductionsData: [
            { label: 'Offline Cash', icon: Banknote, sub: 'Collected at counter', amount: '- ₹5,000' },
            { label: 'GST (Delivery)', icon: Receipt, sub: '5% on delivery orders', amount: '- ₹1,250' },
            { label: 'Ads Spend', icon: Megaphone, sub: 'In-app promotions', amount: '- ₹500' },
            { label: 'Refunds', icon: RotateCcw, sub: '1 Cancelled Order', amount: '- ₹250' },
            { label: 'Subscription', icon: CheckCircle2, sub: 'Monthly plan', amount: '- ₹999' },
            { label: 'Platform Fees', icon: ShoppingBag, sub: 'On online orders', amount: '- ₹1,500' },
          ],
          grossRevenue: '₹ 85,000',
          totalDeductions: '- ₹ 9,499',
          netEarnings: '₹ 70,501',
          overallRevenue: '₹ 85,000'
        };
    }
  }, [selectedFilter]);

  const recentPayouts = [
    { amount: '₹ 1,200', date: 'Today, 10:00 AM', status: 'Processing' },
    { amount: '₹ 15,450', date: 'May 1, 2025', status: 'Paid' },
    { amount: '₹ 8,900', date: 'Apr 24, 2025', status: 'Paid' },
  ];

  const faqData = [
    { question: 'How does the payout system work?', answer: 'Our payout system automatically calculates your earnings from online orders, deducts any applicable fees or refunds, and transfers the remaining balance to your registered bank account. You can choose between daily auto-withdrawals or manual requests.' },
    { question: 'How are platform fees calculated?', answer: 'Platform fees are calculated as a fixed percentage of each online order\'s subtotal. This fee covers payment processing, platform maintenance, and customer support. Taxes and delivery charges are not subject to platform fees.' },
    { question: 'Why did my payout fail?', answer: 'Payouts typically fail due to incorrect bank account details, issues with the receiving bank, or temporary network errors. If a payout fails, the funds will be returned to your available balance, and you can initiate a new withdrawal request.' },
    { question: 'When will I receive my funds?', answer: 'For auto-withdrawals, funds are processed daily and typically arrive within 24 hours (T+1 settlement cycle). Manual withdrawals are processed within 1-2 business days depending on your bank.' },
  ];

  const allPayoutsData = [
    { id: 'PO-1042', amount: '₹ 1,200', date: 'Today, 10:00 AM', status: 'Pending', type: 'Manual', restaurant: 'Burger King', account: '**** 4567', created: '13 Mar 2026, 09:45 AM', notice: 'Your payout is currently being processed by our banking partner.' },
    { id: 'PO-1041', amount: '₹ 15,450', date: 'May 1, 2025', status: 'Completed', type: 'Auto', restaurant: 'Burger King', account: '**** 4567', created: '01 May 2025, 02:00 AM', notice: 'Payout successfully transferred to your bank account.' },
    { id: 'PO-1040', amount: '₹ 8,900', date: 'Apr 24, 2025', status: 'Completed', type: 'Auto', restaurant: 'Burger King', account: '**** 4567', created: '24 Apr 2025, 02:00 AM', notice: 'Payout successfully transferred to your bank account.' },
    { id: 'PO-1039', amount: '₹ 4,200', date: 'Apr 15, 2025', status: 'Failed', type: 'Manual', restaurant: 'Burger King', account: '**** 4567', created: '15 Apr 2025, 11:30 AM', notice: 'Failed due to invalid IFSC code. Please update your bank details.' },
    { id: 'PO-1038', amount: '₹ 12,100', date: 'Apr 02, 2025', status: 'Completed', type: 'Auto', restaurant: 'Burger King', account: '**** 4567', created: '02 Apr 2025, 02:00 AM', notice: 'Payout successfully transferred to your bank account.' },
  ];

  const platformFeeOrders = [
    { orderNo: 1, orderId: '#ORD-1048', dateTime: 'Today, 12:30 PM', price: '₹420', platformFee: '₹21.00' },
    { orderNo: 2, orderId: '#ORD-1047', dateTime: 'Today, 11:15 AM', price: '₹850', platformFee: '₹42.50' },
    { orderNo: 3, orderId: '#ORD-1046', dateTime: 'Yesterday, 09:45 PM', price: '₹320', platformFee: '₹16.00' },
    { orderNo: 4, orderId: '#ORD-1045', dateTime: 'Yesterday, 08:20 PM', price: '₹1,200', platformFee: '₹60.00' },
    { orderNo: 5, orderId: '#ORD-1044', dateTime: 'Yesterday, 07:10 PM', price: '₹550', platformFee: '₹27.50' },
    { orderNo: 6, orderId: '#ORD-1043', dateTime: '17 May, 06:15 PM', price: '₹680', platformFee: '₹34.00' },
  ];

  if (viewMode === 'all-payouts') {
    const filteredPayouts = allPayoutsData.filter(p => {
      const matchesSearch = p.id.toLowerCase().includes(payoutSearchQuery.toLowerCase()) || p.amount.includes(payoutSearchQuery);
      const matchesFilter = payoutFilter === 'All' || p.status === payoutFilter;
      return matchesSearch && matchesFilter;
    });

    return (
      <div className="pb-32 px-4 pt-6 animate-in fade-in slide-in-from-right-4 duration-300 bg-[#FFFFFF] min-h-screen">
        <div className="flex items-center gap-3 mb-6">
          <button 
            onClick={() => setViewMode('main')}
            className="w-10 h-10 bg-[#FFFFFF] border border-slate-200 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-50"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-slate-900">All Payouts</h1>
        </div>

        <div className="relative mb-4">
          <input 
            type="text" 
            placeholder="Search by ID or amount..." 
            value={payoutSearchQuery}
            onChange={(e) => setPayoutSearchQuery(e.target.value)}
            className="w-full h-12 bg-[#FFFFFF] border border-slate-200 rounded-2xl pl-11 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 -mx-4 px-4">
          {['All', 'Completed', 'Pending', 'Failed'].map((filter) => (
            <button
              key={filter}
              onClick={() => setPayoutFilter(filter as any)}
              className={`h-9 px-4 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                payoutFilter === filter
                  ? 'bg-slate-900 text-white' 
                  : 'bg-[#FFFFFF] border border-slate-200 text-slate-600'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredPayouts.map((payout, i) => (
            <div key={i} className="bg-[#FFFFFF] rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    payout.status === 'Pending' ? 'bg-amber-50 text-amber-500' : 
                    payout.status === 'Failed' ? 'bg-rose-50 text-rose-500' :
                    'bg-emerald-50 text-emerald-500'
                  }`}>
                    {payout.status === 'Pending' ? <Clock size={18} /> : 
                     payout.status === 'Failed' ? <RotateCcw size={18} /> :
                     <CheckCircle2 size={18} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{payout.amount}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{payout.date} • {payout.id}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                  payout.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                  payout.status === 'Failed' ? 'bg-rose-100 text-rose-700' :
                  'bg-emerald-100 text-emerald-700'
                }`}>
                  {payout.status}
                </span>
              </div>
              <button 
                onClick={() => setSelectedPayout(payout)}
                className="w-full h-10 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-medium rounded-xl transition-colors"
              >
                View Details
              </button>
            </div>
          ))}
          {filteredPayouts.length === 0 && (
            <div className="text-center py-10 text-slate-500 text-sm">
              No payouts found matching your criteria.
            </div>
          )}
        </div>

        {/* Payout Details Modal */}
        {selectedPayout && (
          <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center bg-black/50 sm:p-4 animate-in fade-in duration-200">
            <div className="bg-[#FFFFFF] w-full sm:max-w-md rounded-t-[24px] sm:rounded-[24px] p-6 shadow-xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900">Payout Details</h3>
                <button 
                  onClick={() => setSelectedPayout(null)}
                  className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex flex-col items-center justify-center py-4 mb-6 border-b border-slate-100">
                <p className="text-sm text-slate-500 mb-1">Amount</p>
                <h2 className="text-3xl font-bold text-slate-900">{selectedPayout.amount}</h2>
                <span className={`mt-3 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                  selectedPayout.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                  selectedPayout.status === 'Failed' ? 'bg-rose-100 text-rose-700' :
                  'bg-emerald-100 text-emerald-700'
                }`}>
                  {selectedPayout.status}
                </span>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Transaction ID</span>
                  <span className="text-sm font-medium text-slate-900">{selectedPayout.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Type</span>
                  <span className="text-sm font-medium text-slate-900">{selectedPayout.type} Withdrawal</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Restaurant</span>
                  <span className="text-sm font-medium text-slate-900">{selectedPayout.restaurant}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Account</span>
                  <span className="text-sm font-medium text-slate-900">{selectedPayout.account}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Requested On</span>
                  <span className="text-sm font-medium text-slate-900">{selectedPayout.created}</span>
                </div>
              </div>

              <div className={`p-4 rounded-xl text-sm leading-relaxed ${
                selectedPayout.status === 'Pending' ? 'bg-amber-50 text-amber-800 border border-amber-200' : 
                selectedPayout.status === 'Failed' ? 'bg-rose-50 text-rose-800 border border-rose-200' :
                'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}>
                <div className="flex gap-2 items-start">
                  <Info size={16} className="mt-0.5 flex-shrink-0" />
                  <p>{selectedPayout.notice}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="pb-32 px-4 pt-6 animate-in fade-in duration-500 bg-[#FFFFFF] min-h-screen space-y-6 lg:bg-transparent lg:px-0 lg:pt-0 lg:pb-10 lg:grid lg:grid-cols-2 lg:gap-8 lg:space-y-0">
      
      {/* Wallet Section */}
      <div className="space-y-4 lg:col-span-1">
        <div className="flex items-center justify-between">
          <p className="text-[12px] font-bold text-[#6B7280] uppercase tracking-wider">PERIOD - 1 TO 28 FEBRUARY 2026</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {/* Card 1 */}
          <div className="bg-[#FFFFFF] p-4 rounded-[20px] border border-slate-200 shadow-sm flex flex-col justify-between h-[110px]">
            <div>
              <div className="text-[13px] font-semibold text-slate-700 leading-tight">Total Orders</div>
              <div className="text-[11px] text-slate-500 mt-0.5">complete This Month</div>
            </div>
            <div className="text-2xl font-black text-slate-900">1.3k</div>
          </div>
          
          {/* Card 2 */}
          <div className="bg-[#FFFFFF] p-4 rounded-[20px] border border-slate-200 shadow-sm flex flex-col justify-between h-[110px]">
            <div>
              <div className="text-[13px] font-semibold text-slate-700 leading-tight">Total Orders</div>
              <div className="text-[11px] text-slate-500 mt-0.5">complete today</div>
            </div>
            <div className="text-2xl font-black text-slate-900">230</div>
          </div>
          
          {/* Card 3 */}
          <div className="bg-[#FFFFFF] p-4 rounded-[20px] border border-slate-200 shadow-sm flex flex-col justify-between h-[110px]">
            <div>
              <div className="text-[13px] font-semibold text-emerald-600 leading-tight">Total Earnings</div>
              <div className="text-[11px] text-emerald-600/80 mt-0.5">This Month</div>
            </div>
            <div className="text-2xl font-black text-emerald-600">₹1,00,000</div>
          </div>
          
          {/* Card 4 */}
          <div className="bg-[#FFFFFF] p-4 rounded-[20px] border border-slate-200 shadow-sm flex flex-col justify-between h-[110px]">
            <div>
              <div className="text-[13px] font-semibold text-slate-700 leading-tight">Available Funds</div>
              <div className="text-[11px] text-slate-500 mt-0.5">For Withdrawal</div>
            </div>
            <div className="text-2xl font-black text-slate-900">₹{availableFunds.toLocaleString('en-IN')}</div>
          </div>
        </div>

        <button 
          onClick={() => {
            setWithdrawStep('input');
            setWithdrawAmount('');
            setIsWithdrawModalOpen(true);
          }}
          className="w-full h-[52px] bg-[#1E90FF] text-[#FFFFFF] rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all"
        >
          Withdraw Funds
        </button>

        {/* Upcoming Payout Section */}
        <div className="relative overflow-hidden bg-[#FFFFFF] rounded-[16px] p-5 border border-slate-200 shadow-sm">
          <div className="absolute -right-4 -top-4 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl pointer-events-none"></div>
          <div className="relative z-10 flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-slate-500">Next Payout</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">₹18,420</h3>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-emerald-600">Arrives Tomorrow</p>
              <p className="text-xs text-slate-500 mt-1">Settlement cycle: T+1</p>
            </div>
          </div>
          
          <div className="relative z-10 pt-4 border-t border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Auto Withdrawal</p>
              <p className="text-xs text-slate-500 mt-0.5 max-w-[200px]">
                Daily automatic transfers to your bank account
              </p>
            </div>
            <button 
              onClick={() => {
                setPendingAutoWithdrawState(!isAutoWithdrawalEnabled);
                setShowAutoWithdrawConfirm(true);
              }}
              className={`w-[32px] h-[18px] rounded-full p-[2px] transition-colors duration-300 relative shrink-0 ${isAutoWithdrawalEnabled ? 'bg-[#1E90FF]' : 'bg-[#D1D5DB]'}`}
            >
              <div className={`w-[14px] h-[14px] bg-[#FFFFFF] rounded-full transform transition-transform duration-300 shadow-sm ${isAutoWithdrawalEnabled ? 'translate-x-[14px]' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        <div className="bg-[#FFF7ED] rounded-[14px] p-[16px] border border-[#FED7AA] flex items-start gap-[12px]">
          <Info className="text-[#7C2D12] shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="text-[14px] font-semibold text-[#7C2D12] leading-tight">Notice</h4>
            <p className="text-[13px] text-[#7C2D12] mt-1 leading-snug">
              These funds and others include only payments and orders from online orders processed through the Crevings platform.
              <br/><br/>
              Offline orders payments are settled directly with customers.
            </p>
          </div>
        </div>
      </div>

      {/* Filters & Month Selector */}
      <div className="space-y-4 lg:col-span-1">
        {/* Month Selector */}
        <div className="bg-[#FFFFFF] rounded-[16px] p-4 border border-slate-200 shadow-sm flex items-center justify-between">
          <button 
            onClick={handlePrevMonth}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-blue-600" />
              <span className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                {formatMonthYear(currentMonthDate)}
              </span>
            </div>
            <span className="text-xs text-slate-500 mt-1">
              Sales & Deductions Report
            </span>
          </div>
          <button 
            onClick={handleNextMonth}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-[8px] overflow-x-auto no-scrollbar -mx-4 px-4">
          {['Today', 'Last 3 days', 'Last 7 days', 'Last 14 days', 'Last month'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`h-[36px] px-[14px] rounded-[18px] text-[14px] font-medium whitespace-nowrap transition-all duration-300 flex-shrink-0 flex items-center gap-1.5 font-sans ${
                selectedFilter === filter
                  ? 'bg-[#EFF6FF] text-[#1E90FF]' 
                  : 'bg-[#FFFFFF] border border-[#E5E7EB] text-[#374151]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="bg-[#FFFFFF] rounded-3xl p-5 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Revenue Breakdown</h3>
            <p className="text-xs text-slate-500 mt-0.5">Where your money comes from</p>
          </div>
          <button className="text-slate-400 hover:text-slate-600">
            <Filter size={18} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Online Sales */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 px-2">Online Sales</h4>
            <div className="space-y-4">
              {onlineBreakdown.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${item.color}`}>
                      <item.icon size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.percent} of total</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-emerald-600">{item.amount}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Offline Sales */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 px-2">Offline Sales</h4>
            <div className="space-y-4">
              {offlineBreakdown.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${item.color}`}>
                      <item.icon size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.percent} of total</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-emerald-600">{item.amount}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-500">Gross Revenue</span>
          <span className="text-lg font-bold text-emerald-600">{grossRevenue}</span>
        </div>
      </div>

      {/* Deductions */}
      <div className="bg-[#FFFFFF] rounded-3xl p-5 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Deductions</h3>
            <p className="text-xs text-slate-500 mt-0.5">Taxes, fees, and refunds</p>
          </div>
          <div className="flex items-center gap-1 text-rose-500 bg-rose-50 px-2 py-1 rounded-md text-xs font-medium">
            <ArrowDownRight size={14} />
            <span>8%</span>
          </div>
        </div>

        <div className="space-y-4">
          {deductionsData.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-100">
                  <item.icon size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-slate-500">{item.sub}</p>
                    {item.label === 'Platform Fees' && (
                      <button 
                        onClick={() => setIsPlatformFeeBreakdownOpen(true)}
                        className="text-[10px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded uppercase tracking-wider"
                      >
                        View Breakdown
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-sm font-semibold text-rose-500">{item.amount}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-500">Total Deductions</span>
          <span className="text-lg font-bold text-rose-500">{totalDeductions}</span>
        </div>
      </div>

      {/* Net Earnings & Overall Revenue */}
      <div className="flex flex-col gap-4">
        {/* Net Earnings on Crevings */}
        <div className="bg-[#FFFFFF] rounded-3xl p-6 shadow-sm border border-slate-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-0 blur-2xl"></div>
          <div className="relative z-10 flex flex-col gap-1">
            <div>
              <h3 className="text-sm font-semibold text-slate-700">Net Earnings on Crevings</h3>
              <p className="text-xs text-slate-500 mt-0.5">After platform deductions</p>
            </div>
            <div className="text-3xl font-black text-emerald-600 tracking-tight mt-1">{netEarnings}</div>
          </div>
        </div>

        {/* Overall Revenue */}
        <div className="bg-[#FFFFFF] rounded-3xl p-6 shadow-sm border border-slate-200 relative overflow-hidden">
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-50 rounded-full blur-2xl -z-0"></div>
          <div className="relative z-10 flex flex-col gap-1">
            <div>
              <h3 className="text-sm font-semibold text-slate-700">Overall Revenue</h3>
              <p className="text-xs text-slate-500 mt-0.5">Inc. offline cash at counter</p>
            </div>
            <div className="text-3xl font-black text-emerald-600 tracking-tight mt-1">{overallRevenue}</div>
          </div>
        </div>
      </div>

      {/* Recent Payouts */}
      <div className="bg-[#FFFFFF] rounded-3xl p-5 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-semibold text-slate-900">Recent Payouts</h3>
          <button 
            onClick={() => setViewMode('all-payouts')}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View All
          </button>
        </div>

        <div className="space-y-4">
          {recentPayouts.map((payout, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  payout.status === 'Processing' 
                    ? 'bg-amber-50 text-amber-500' 
                    : 'bg-emerald-50 text-emerald-500'
                }`}>
                  {payout.status === 'Processing' ? <Clock size={18} /> : <CheckCircle2 size={18} />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{payout.amount}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{payout.date}</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                payout.status === 'Processing'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-emerald-100 text-emerald-700'
              }`}>
                {payout.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-3 my-6">
        <button onClick={() => setActiveActionSheet('floating_cash')} className="flex items-center gap-3 p-4 bg-[#FFFFFF] border border-slate-200 rounded-2xl shadow-sm hover:bg-slate-50 active:scale-95 transition-all mb-0">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center shrink-0">
            <Banknote size={20} strokeWidth={1.5} />
          </div>
          <span className="text-[13px] font-semibold text-slate-700 text-left leading-tight">Floating Cash</span>
        </button>
        <button onClick={() => setActiveActionSheet('pay_fines')} className="flex items-center gap-3 p-4 bg-[#FFFFFF] border border-slate-200 rounded-2xl shadow-sm hover:bg-slate-50 active:scale-95 transition-all mb-0">
          <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center shrink-0">
            <AlertCircle size={20} strokeWidth={1.5} />
          </div>
          <span className="text-[13px] font-semibold text-slate-700 text-left leading-tight">Pay Fines</span>
        </button>
        <button onClick={() => setActiveActionSheet('statement')} className="flex items-center gap-3 p-4 bg-[#FFFFFF] border border-slate-200 rounded-2xl shadow-sm hover:bg-slate-50 active:scale-95 transition-all mb-0">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
            <FileText size={20} strokeWidth={1.5} />
          </div>
          <span className="text-[13px] font-semibold text-slate-700 text-left leading-tight">Statement</span>
        </button>
        <button onClick={() => setActiveActionSheet('incentives')} className="flex items-center gap-3 p-4 bg-[#FFFFFF] border border-slate-200 rounded-2xl shadow-sm hover:bg-slate-50 active:scale-95 transition-all mb-0">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
            <Gift size={20} strokeWidth={1.5} />
          </div>
          <span className="text-[13px] font-semibold text-slate-700 text-left leading-tight">Incentives</span>
        </button>
      </div>

      {/* FAQ Section */}
      <div className="bg-[#FFFFFF] rounded-3xl p-5 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle size={20} className="text-blue-600" />
          <h3 className="text-base font-semibold text-slate-900">Frequently Asked Questions</h3>
        </div>
        <div className="space-y-3">
          {faqData.map((faq, index) => (
            <div key={index} className="border border-slate-100 rounded-2xl overflow-hidden">
              <button 
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <span className="text-sm font-semibold text-slate-800 text-left pr-4">{faq.question}</span>
                {expandedFaq === index ? <ChevronUp size={18} className="text-slate-500 flex-shrink-0" /> : <ChevronDown size={18} className="text-slate-500 flex-shrink-0" />}
              </button>
              {expandedFaq === index && (
                <div className="p-4 bg-[#FFFFFF] text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Withdraw Modal */}
      {isWithdrawModalOpen && (
        <div 
          className="fixed inset-0 z-[999] flex items-end justify-center bg-black/50 sm:items-center transition-opacity"
          onClick={() => setIsWithdrawModalOpen(false)}
        >
          <div 
            className="w-full bg-[#FFFFFF] rounded-t-2xl sm:rounded-2xl sm:max-w-md p-6 animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:fade-in duration-300 relative"
            onClick={e => e.stopPropagation()}
          >
            {withdrawStep === 'input' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Withdraw Funds</h3>
                  <p className="text-sm text-slate-500 mt-1">Available Balance: ₹{availableFunds.toLocaleString('en-IN')}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Withdrawal Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">₹</span>
                    <input 
                      type="number" 
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full h-[52px] bg-slate-50 border border-slate-200 rounded-[16px] pl-8 pr-4 text-slate-900 font-medium focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="bg-slate-50 rounded-[16px] p-4 space-y-3 border border-slate-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Bank Name</span>
                    <span className="font-medium text-slate-900">HDFC Bank (**** 1234)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">TDS (2%)</span>
                    <span className="font-medium text-rose-500">- ₹{withdrawAmount ? (Number(withdrawAmount) * 0.02).toFixed(2) : '0.00'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Processing Fee</span>
                    <span className="font-medium text-rose-500">- ₹10.00</span>
                  </div>
                  <div className="pt-3 border-t border-slate-200 flex justify-between">
                    <span className="font-semibold text-slate-900">You will get</span>
                    <span className="font-bold text-emerald-600">
                      ₹{withdrawAmount ? Math.max(0, Number(withdrawAmount) - (Number(withdrawAmount) * 0.02) - 10).toFixed(2) : '0.00'}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => setWithdrawStep('confirm')}
                  disabled={!withdrawAmount || Number(withdrawAmount) <= 0 || Number(withdrawAmount) > availableFunds}
                  className="w-full h-[52px] bg-[#1E90FF] text-[#FFFFFF] rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Withdraw
                </button>
              </div>
            )}

            {withdrawStep === 'confirm' && (
              <div className="space-y-6 text-center py-4">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                  <Wallet size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Confirm Withdrawal</h3>
                  <p className="text-slate-500 mt-2">Are you sure you want to withdraw ₹{Number(withdrawAmount).toLocaleString('en-IN')} to your HDFC Bank account?</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setWithdrawStep('input')}
                    className="flex-1 h-[52px] bg-slate-50 text-slate-700 rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      setWithdrawStep('loading');
                      setTimeout(() => {
                        setAvailableFunds(prev => prev - Number(withdrawAmount));
                        setWithdrawStep('success');
                      }, 2000);
                    }}
                    className="flex-1 h-[52px] bg-[#1E90FF] text-[#FFFFFF] rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all"
                  >
                    Yes, Withdraw
                  </button>
                </div>
              </div>
            )}

            {withdrawStep === 'loading' && (
              <div className="space-y-6 text-center py-8">
                <Loader2 size={48} className="text-blue-600 animate-spin mx-auto" />
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Processing Request</h3>
                  <p className="text-slate-500 mt-2">Please wait while we process your withdrawal...</p>
                </div>
              </div>
            )}

            {withdrawStep === 'success' && (
              <div className="space-y-6 text-center py-4">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Request Received</h3>
                  <p className="text-slate-500 mt-2 leading-relaxed">
                    We received your request. Our team will start processing your withdrawal request and you will get it within 24 hours.
                  </p>
                </div>
                <button 
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="w-full h-[52px] bg-slate-50 text-slate-700 rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Auto Withdrawal Confirm Modal */}
      {showAutoWithdrawConfirm && (
        <div 
          className="fixed inset-0 z-[999] flex items-end justify-center bg-black/50 sm:items-center transition-opacity"
          onClick={() => setShowAutoWithdrawConfirm(false)}
        >
          <div 
            className="w-full bg-[#FFFFFF] rounded-t-2xl sm:rounded-2xl sm:max-w-md p-6 animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:fade-in duration-300 relative"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Banknote size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 text-center mb-2">
              {pendingAutoWithdrawState ? 'Enable' : 'Disable'} Auto Withdrawal?
            </h3>
            <p className="text-slate-500 text-center mb-6 leading-relaxed">
              {pendingAutoWithdrawState 
                ? 'Our team will automatically transfer your available funds to your bank account each day.' 
                : 'You will need to manually send withdrawal requests to transfer funds to your bank account.'}
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowAutoWithdrawConfirm(false)}
                className="flex-1 h-[52px] bg-slate-50 text-slate-700 rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setIsAutoWithdrawalEnabled(pendingAutoWithdrawState);
                  setShowAutoWithdrawConfirm(false);
                }}
                className="flex-1 h-[52px] bg-[#1E90FF] text-[#FFFFFF] rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Platform Fee Breakdown Bottom Sheet */}
      {isPlatformFeeBreakdownOpen && (
        <div 
          className="fixed inset-0 z-[1000] flex items-end justify-center bg-black/50 sm:items-center transition-opacity"
          onClick={() => setIsPlatformFeeBreakdownOpen(false)}
        >
          <div 
            className="w-full bg-[#FFFFFF] rounded-t-2xl sm:rounded-2xl sm:max-w-md p-6 animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:fade-in duration-300 relative flex flex-col max-h-[85vh]"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Platform Fees Breakdown</h3>
                <p className="text-sm text-slate-500 mt-1">Order-wise charge details</p>
              </div>
              <button 
                onClick={() => setIsPlatformFeeBreakdownOpen(false)}
                className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto -mx-2 px-2 pb-2 space-y-3 no-scrollbar">
              {platformFeeOrders.map((order) => (
                <div key={order.orderId} className="bg-[#FFFFFF] border border-slate-100 rounded-[16px] p-4 active:scale-[0.98] transition-transform shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[15px] font-bold text-slate-900">{order.orderId}</span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
                          Completed
                        </span>
                      </div>
                      <p className="text-[13px] text-slate-600 font-medium flex items-center gap-1.5">
                        <Calendar size={14} className="text-slate-400" />
                        {order.dateTime}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[15px] font-bold text-slate-900">{order.price}</p>
                    </div>
                  </div>
                  
                  <div className="h-px bg-slate-100 w-full mb-3" />
                  
                  <div className="flex items-center justify-between text-[13px] font-medium">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <ShoppingBag size={14} />
                      <span>Platform Fee (5%)</span>
                    </div>
                    <span className="font-bold text-rose-500">{order.platformFee}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="pt-6 border-t border-slate-100 mt-2">
               <div className="flex items-center justify-between mb-5">
                  <span className="text-[15px] font-bold text-slate-500">Total Platform Fees</span>
                  <span className="text-[20px] font-black text-slate-900 tracking-tight">₹201.00</span>
               </div>
               <button 
                 onClick={() => setIsPlatformFeeBreakdownOpen(false)}
                 className="w-full h-[52px] bg-[#1E90FF] text-white rounded-[16px] font-bold text-[16px] active:scale-[0.98] transition-all shadow-lg shadow-blue-500/20"
               >
                 Got It
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Action Sheets */}
      {activeActionSheet && (
        <div 
          className="fixed inset-0 z-[999] flex items-end justify-center bg-black/50 sm:items-center transition-opacity"
          onClick={() => setActiveActionSheet(null)}
        >
          <div 
            className="w-full bg-[#FFFFFF] rounded-t-2xl sm:rounded-2xl sm:max-w-md p-6 animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:fade-in duration-300 relative"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setActiveActionSheet(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-slate-50 text-slate-500 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X size={18} />
            </button>
            
            {activeActionSheet === 'floating_cash' && (
              <div className="pt-2 flex flex-col max-h-[80vh]">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4 shrink-0">
                  <Banknote size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 shrink-0">Floating Cash Limit</h3>
                
                <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 mb-4 shrink-0">
                  <div className="text-sm text-slate-700 mb-1">Your current floating cash limit is</div>
                  <div className="text-2xl font-bold text-rose-600 mb-2">₹ 2,000</div>
                  <p className="text-xs text-rose-700 leading-tight">
                    Without paying floating cash you won't be able to accept new orders and won't be able to withdraw your earnings.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-3 shrink-0 flex items-center justify-between">
                  <div className="text-sm font-medium text-slate-700">Remaining to limit</div>
                  <div className="text-lg font-bold text-slate-900">₹ {floatingCashPaid ? 2000 : 850}</div>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-6 shrink-0 flex items-center justify-between">
                  <div className="text-sm font-medium text-slate-700">Payable Amount</div>
                  <div className="text-lg font-bold text-indigo-600">₹ {floatingCashPaid ? 0 : 1150}</div>
                </div>

                {!floatingCashPaid && (
                  <>
                    <h4 className="text-sm font-semibold text-slate-900 mb-3 shrink-0">Order History (Cash to collect)</h4>
                    <div className="overflow-y-auto flex-1 mb-6 -mx-2 px-2 pb-4 space-y-3">
                      {[
                        { id: 'ORD-7291', amount: 350, date: 'Today, 2:30 PM' },
                        { id: 'ORD-7288', amount: 420, date: 'Today, 1:15 PM' },
                        { id: 'ORD-7275', amount: 180, date: 'Yesterday, 8:45 PM' },
                        { id: 'ORD-7262', amount: 200, date: 'Yesterday, 1:20 PM' }
                      ].map((order, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-[#FFFFFF] border border-slate-100 rounded-xl shadow-sm">
                          <div>
                            <div className="text-sm font-medium text-slate-900">{order.id}</div>
                            <div className="text-xs text-slate-500">{order.date}</div>
                          </div>
                          <div className="text-sm font-bold text-slate-900">₹ {order.amount}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {floatingCashPaid ? (
                  <button onClick={() => setActiveActionSheet(null)} className="w-full h-[52px] bg-[#1E90FF] text-[#FFFFFF] rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all shrink-0">
                    Close
                  </button>
                ) : (
                  <button 
                    onClick={handlePayFloatingCash}
                    disabled={isProcessingAction}
                    className="w-full h-[52px] bg-[#1E90FF] text-[#FFFFFF] rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all shrink-0 disabled:opacity-70"
                  >
                    {isProcessingAction ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                      </span>
                    ) : (
                      'Pay Floating Cash'
                    )}
                  </button>
                )}
              </div>
            )}

            {activeActionSheet === 'pay_fines' && (
              <div className="pt-2 flex flex-col max-h-[80vh]">
                <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mb-4 shrink-0">
                  <AlertCircle size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 shrink-0">Pay Fines</h3>
                
                <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between mb-4 shrink-0">
                  <span className="text-sm font-semibold text-slate-700">Total Payable Amount</span>
                  <span className="text-lg font-bold text-rose-600">₹ {finesPaid ? 0 : 350}</span>
                </div>

                {!finesPaid ? (
                  <>
                    <h4 className="text-sm font-semibold text-slate-900 mb-3 shrink-0">Outstanding Fines</h4>
                    <div className="overflow-y-auto flex-1 mb-6 -mx-2 px-2 pb-4 space-y-3">
                      {[
                        { reason: 'Order Cancellation (ORD-7102)', amount: 150, date: '21 Apr 2026' },
                        { reason: 'Late Food Preparation (ORD-7089)', amount: 200, date: '20 Apr 2026' }
                      ].map((fine, i) => (
                        <div key={i} className="flex items-start justify-between p-3 bg-[#FFFFFF] border border-rose-100 rounded-xl shadow-sm">
                          <div>
                            <div className="text-sm font-medium text-slate-900 mb-1 leading-tight">{fine.reason}</div>
                            <div className="text-xs text-slate-500">{fine.date}</div>
                          </div>
                          <div className="text-sm font-bold text-rose-600 shrink-0 ml-2">₹ {fine.amount}</div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center py-8 mb-6">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle2 size={32} />
                    </div>
                    <p className="text-slate-700 font-medium text-center">You have no outstanding fines.</p>
                  </div>
                )}

                {finesPaid ? (
                  <button onClick={() => setActiveActionSheet(null)} className="w-full h-[52px] bg-[#1E90FF] text-[#FFFFFF] rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all shrink-0">
                    Close
                  </button>
                ) : (
                  <button 
                    onClick={handlePayFines}
                    disabled={isProcessingAction}
                    className="w-full h-[52px] bg-[#1E90FF] text-[#FFFFFF] rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all shrink-0 disabled:opacity-70"
                  >
                    {isProcessingAction ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                      </span>
                    ) : (
                      'Pay Fines'
                    )}
                  </button>
                )}
              </div>
            )}

            {activeActionSheet === 'statement' && (
              <div className="pt-2 flex flex-col max-h-[80vh]">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 shrink-0">
                  <FileText size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 shrink-0">Financial Statement</h3>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed shrink-0">
                  Select a duration to receive your detailed financial statement via email.
                </p>
                
                <div className="overflow-y-auto flex-1 mb-6 -mx-2 px-2 pb-2">
                  <div className="space-y-3">
                    {['Last 10 Days', 'Last 20 Days', 'This Month', 'Last Month', 'Custom Date Range'].map((option, i) => (
                      <label key={i} className="flex flex-col p-3 bg-slate-50 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <input 
                            type="radio" 
                            name="statement_duration" 
                            className="w-4 h-4 text-[#1E90FF]" 
                            checked={selectedStatementDuration === option}
                            onChange={() => setSelectedStatementDuration(option)}
                          />
                          <span className="text-sm font-medium text-slate-800">{option}</span>
                        </div>
                        
                        {option === 'Custom Date Range' && selectedStatementDuration === 'Custom Date Range' && (
                          <div className="mt-4 pl-7 grid grid-cols-2 gap-3" onClick={e => e.stopPropagation()}>
                            <div>
                              <label className="block text-xs font-medium text-slate-500 mb-1">Start Date</label>
                              <input 
                                type="date" 
                                value={statementStartDate}
                                onChange={(e) => setStatementStartDate(e.target.value)}
                                className="w-full text-sm p-2 border border-slate-200 rounded-lg outline-none focus:border-[#1E90FF] bg-[#FFFFFF] transition-colors" 
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-500 mb-1">End Date</label>
                              <input 
                                type="date"
                                value={statementEndDate}
                                onChange={(e) => setStatementEndDate(e.target.value)}
                                className="w-full text-sm p-2 border border-slate-200 rounded-lg outline-none focus:border-[#1E90FF] bg-[#FFFFFF] transition-colors" 
                              />
                            </div>
                          </div>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={handleRequestStatement}
                  disabled={isProcessingAction}
                  className="w-full h-[52px] bg-[#1E90FF] text-[#FFFFFF] rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all shrink-0 disabled:opacity-70"
                >
                  {isProcessingAction ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                    </span>
                  ) : (
                    'Request Statement to Email'
                  )}
                </button>
              </div>
            )}

            {activeActionSheet === 'incentives' && (
              <div className="pt-2">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                  <Gift size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">My Incentives</h3>
                
                <div className="bg-emerald-50 text-emerald-800 text-xs px-3 py-2 rounded-lg mb-6 flex items-start gap-2">
                  <div className="bg-emerald-200 p-1 rounded-full shrink-0 mt-0.5">
                    <AlertCircle size={12} className="text-emerald-700" />
                  </div>
                  <span>Incentives earned are added automatically to your next payout.</span>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 border-2 border-emerald-500">
                        <span className="text-sm font-bold">10</span>
                     </div>
                     <div className="flex-1">
                        <div className="text-sm font-bold text-slate-900">₹ 50</div>
                        <div className="text-xs text-slate-500">Complete 10 orders</div>
                     </div>
                     <div className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">Completed</div>
                  </div>
                  
                  <div className="h-4 border-l-2 border-dashed border-slate-200 ml-5 -my-2" />

                  <div className="flex items-center gap-4 opacity-50 grayscale">
                     <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 border-2 border-slate-300">
                        <span className="text-sm font-bold">20</span>
                     </div>
                     <div className="flex-1">
                        <div className="text-sm font-bold text-slate-900">₹ 150</div>
                        <div className="text-xs text-slate-500">Complete 20 orders</div>
                     </div>
                  </div>

                  <div className="h-4 border-l-2 border-dashed border-slate-200 ml-5 -my-2" />

                  <div className="flex items-center gap-4 opacity-50 grayscale">
                     <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 border-2 border-slate-300">
                        <span className="text-sm font-bold">30</span>
                     </div>
                     <div className="flex-1">
                        <div className="text-sm font-bold text-slate-900">₹ 300</div>
                        <div className="text-xs text-slate-500">Complete 30 orders</div>
                     </div>
                  </div>
                </div>

                <button onClick={() => setActiveActionSheet(null)} className="w-full h-[52px] bg-[#1E90FF] text-[#FFFFFF] rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all border border-[#1E90FF] hover:bg-blue-50 hover:text-[#1E90FF]">
                  Close
                </button>
              </div>
            )}
            
          </div>
        </div>
      )}
    </div>
  );
};

