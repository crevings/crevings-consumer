import React, { useState } from 'react';
import { Search, ArrowLeft, X, CheckCircle2, AlertCircle, Eye, Check, X as XIcon } from 'lucide-react';

interface RefundRequest {
  id: string;
  orderId: string;
  orderType: 'Delivery' | 'Takeaway' | 'Dine-in' | 'Booking';
  source: string;
  reason: string;
  amount: number;
  status: 'Pending' | 'In Verification' | 'Approved' | 'Failed';
  customerName: string;
  items: string;
  date: string;
  media?: { type: 'image' | 'video', url: string }[];
  platformContribution?: number;
  restaurantContribution?: number;
}

const SAMPLE_REFUNDS: RefundRequest[] = [
  {
    id: 'REF-001',
    orderId: 'ORD-1029',
    orderType: 'Delivery',
    source: 'Crevings',
    reason: 'Food was cold and packaging was damaged.',
    amount: 540,
    status: 'Pending',
    customerName: 'Rahul Sharma',
    items: '2x Margherita Pizza, 1x Coke',
    date: '12 Oct, 2023 - 14:30',
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1615819387471-70094711f181?w=300&h=300&fit=crop' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?w=300&h=300&fit=crop' }
    ]
  },
  {
    id: 'REF-002',
    orderId: 'ORD-0982',
    orderType: 'Takeaway',
    source: 'Crevings',
    reason: 'Missing items in the order.',
    amount: 120,
    status: 'Pending',
    customerName: 'Priya Patel',
    items: '1x Veg Burger (Missing: 1x Fries)',
    date: '12 Oct, 2023 - 13:15'
  },
  {
    id: 'REF-003',
    orderId: 'ORD-0845',
    orderType: 'Dine-in',
    source: 'Crevings',
    reason: 'Overcharged for items not ordered.',
    amount: 250,
    status: 'In Verification',
    customerName: 'Amit Kumar',
    items: '1x Paneer Tikka, 2x Naan',
    date: '11 Oct, 2023 - 20:45'
  },
  {
    id: 'REF-004',
    orderId: 'ORD-0712',
    orderType: 'Delivery',
    source: 'Crevings',
    reason: 'Wrong item delivered.',
    amount: 320,
    status: 'Approved',
    customerName: 'Sneha Gupta',
    items: '1x Chicken Biryani',
    date: '10 Oct, 2023 - 19:20',
    platformContribution: 120,
    restaurantContribution: 200,
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1633949688031-64508b292e92?w=300&h=300&fit=crop' }
    ]
  },
  {
    id: 'REF-005',
    orderId: 'ORD-0650',
    orderType: 'Booking',
    source: 'Crevings',
    reason: 'Restaurant was closed when arrived.',
    amount: 1000,
    status: 'Failed',
    customerName: 'Vikram Singh',
    items: 'Table Reservation (4 Guests)',
    date: '09 Oct, 2023 - 21:00'
  }
];

interface RefundsViewProps {
  onBack?: () => void;
}

export const RefundsView: React.FC<RefundsViewProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'Active' | 'History'>('Active');
  const [searchQuery, setSearchQuery] = useState('');
  const [refunds, setRefunds] = useState<RefundRequest[]>(SAMPLE_REFUNDS);
  
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedRefundId, setSelectedRefundId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewRefund, setViewRefund] = useState<RefundRequest | null>(null);

  const filteredRefunds = refunds.filter(refund => {
    const matchesTab = activeTab === 'Active' 
      ? ['Pending', 'In Verification'].includes(refund.status)
      : ['Approved', 'Failed'].includes(refund.status);
    
    const matchesSearch = refund.orderId.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  const handleAccept = (id: string) => {
    setRefunds(prev => prev.map(r => 
      r.id === id ? { ...r, status: 'In Verification' } : r
    ));
  };

  const openRejectModal = (id: string) => {
    setSelectedRefundId(id);
    setRejectReason('');
    setRejectModalOpen(true);
  };

  const confirmReject = () => {
    if (selectedRefundId) {
      setRefunds(prev => prev.map(r => 
        r.id === selectedRefundId ? { ...r, status: 'Failed' } : r
      ));
      setRejectModalOpen(false);
      setSelectedRefundId(null);
    }
  };

  const openViewModal = (refund: RefundRequest) => {
    setViewRefund(refund);
    setViewModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'In Verification': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'Failed': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] font-sans pb-20 lg:pb-0 animate-in fade-in duration-300">
      {/* Mobile Header */}
      <div className="lg:hidden bg-[#FFFFFF] px-4 py-4 sticky top-0 z-40 border-b border-slate-100 flex items-center gap-3">
        {onBack && (
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center text-slate-700 active:bg-slate-50 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
        )}
        <h1 className="text-xl font-bold text-slate-900">Refunds</h1>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:flex items-center justify-between mb-6 px-6 pt-6">
        <h1 className="text-2xl font-bold text-slate-900">Refunds</h1>
      </div>

      <div className="px-4 lg:px-6 space-y-6">
        {/* Top Section: Search & Tabs */}
        <div className="space-y-4">
          <div className="relative flex p-1 bg-[#F3F4F6] rounded-full">
            <div 
               className="absolute top-1 bottom-1 bg-[#FFFFFF] rounded-full shadow-sm transition-transform duration-300 ease-out"
               style={{ 
                 left: '4px', 
                 width: 'calc((100% - 8px) / 2)',
                 transform: `translateX(${['Active', 'History'].indexOf(activeTab) * 100}%)` 
               }}
            />
            <button
              onClick={() => setActiveTab('Active')}
              className={`relative z-10 flex-1 py-2.5 rounded-full text-[13px] font-semibold transition-colors duration-300 ${
                activeTab === 'Active' 
                  ? 'text-[#1E90FF]' 
                  : 'text-[#6B7280] hover:text-slate-900'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveTab('History')}
              className={`relative z-10 flex-1 py-2.5 rounded-full text-[13px] font-semibold transition-colors duration-300 ${
                activeTab === 'History' 
                  ? 'text-[#1E90FF]' 
                  : 'text-[#6B7280] hover:text-slate-900'
              }`}
            >
              History
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by Order ID" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 bg-[#FFFFFF] border border-slate-200 text-slate-900 py-2 pl-12 pr-4 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Refund Cards List */}
        <div className="space-y-4">
          {filteredRefunds.length > 0 ? (
            filteredRefunds.map(refund => (
              <div key={refund.id} className="bg-[#FFFFFF] rounded-2xl p-4 border border-slate-200 flex flex-col gap-4 transition-all hover:border-blue-300">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-900">{refund.orderId}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getStatusColor(refund.status)}`}>
                        {refund.status}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                      <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{refund.orderType}</span>
                      <span>•</span>
                      <span>{refund.source}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-slate-900">₹{refund.amount}</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-sm text-slate-700 line-clamp-2">
                    <span className="font-semibold text-slate-900">Reason:</span> {refund.reason}
                  </p>
                </div>

                {/* Status Messages */}
                {refund.status === 'In Verification' && (
                  <div className="flex items-center gap-2 text-sm font-medium text-blue-600 bg-blue-50 p-2.5 rounded-lg border border-blue-100">
                    <AlertCircle size={16} />
                    Refund initiated. Waiting for bank confirmation.
                  </div>
                )}
                {refund.status === 'Failed' && (
                  <div className="flex items-center gap-2 text-sm font-medium text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-100">
                    <XIcon size={16} />
                    Refund rejected.
                  </div>
                )}
                {refund.status === 'Approved' && (
                  <div className="flex items-center gap-2 text-sm font-medium text-green-600 bg-green-50 p-2.5 rounded-lg border border-green-100">
                    <CheckCircle2 size={16} />
                    Refund successfully processed.
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-50">
                  <button 
                    onClick={() => openViewModal(refund)}
                    className="flex-1 h-10 bg-[#FFFFFF] border border-slate-200 text-slate-700 rounded-xl font-semibold text-sm flex items-center justify-center hover:bg-slate-50 active:scale-[0.98] transition-all"
                  >
                    View
                  </button>
                  
                  {refund.status === 'Pending' && (
                    <>
                      <button 
                        onClick={() => openRejectModal(refund.id)}
                        className="flex-1 h-10 bg-[#FF0000] text-white rounded-xl font-semibold text-sm flex items-center justify-center hover:bg-red-700 active:scale-[0.98] transition-all"
                      >
                        Reject
                      </button>
                      <button 
                        onClick={() => handleAccept(refund.id)}
                        className="flex-1 h-10 bg-blue-600 text-white rounded-xl font-semibold text-sm flex items-center justify-center hover:bg-blue-700 active:scale-[0.98] transition-all"
                      >
                        Accept
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center bg-[#FFFFFF] rounded-2xl border border-dashed border-slate-200">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <Search size={24} />
               </div>
               <p className="text-[15px] font-medium text-slate-900">No refunds found</p>
               <p className="text-[13px] text-slate-500 mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div 
          className="fixed inset-0 z-[999] flex items-end justify-center bg-black/50 sm:items-center transition-opacity"
          onClick={() => setRejectModalOpen(false)}
        >
          <div 
            className="w-full bg-[#FFFFFF] rounded-t-2xl sm:rounded-2xl sm:max-w-md p-6 animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:fade-in duration-300 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-slate-900 mb-4">Reject Refund</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Reason for rejection</label>
                <textarea 
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Please provide a reason for rejecting this refund..."
                  className="w-full h-32 rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setRejectModalOpen(false)}
                  className="flex-1 h-[52px] bg-slate-50 text-slate-700 rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmReject}
                  disabled={!rejectReason.trim()}
                  className="flex-1 h-[52px] bg-[#FF0000] text-white rounded-[16px] font-semibold text-[16px] flex items-center justify-center hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewModalOpen && viewRefund && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-end sm:items-center justify-center animate-in fade-in">
          <div className="bg-[#FFFFFF] w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl h-[80vh] sm:h-auto sm:max-h-[85vh] flex flex-col animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h2 className="font-bold text-lg text-slate-900">Refund Details</h2>
              <button onClick={() => setViewModalOpen(false)} className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Header Info */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-black text-slate-900">{viewRefund.orderId}</h3>
                  <p className="text-sm text-slate-500 mt-1">{viewRefund.date}</p>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${getStatusColor(viewRefund.status)}`}>
                  {viewRefund.status}
                </span>
              </div>

              {/* Amount & Type */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-xs font-medium text-slate-500 mb-1">Refund Amount</p>
                  <p className="text-lg font-bold text-slate-900">₹{viewRefund.amount}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-xs font-medium text-slate-500 mb-1">Order Type</p>
                  <p className="text-sm font-bold text-slate-900">{viewRefund.orderType}</p>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-2">Customer</h4>
                <p className="text-sm text-slate-700">{viewRefund.customerName}</p>
              </div>

              {/* Items */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-2">Order Items</h4>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-sm text-slate-700 whitespace-pre-line">{viewRefund.items}</p>
                </div>
              </div>

              {/* Reason */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-2">Refund Reason</h4>
                <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                  <p className="text-sm text-rose-900">{viewRefund.reason}</p>
                </div>
              </div>

              {/* Customer Shared Media */}
              {viewRefund.media && viewRefund.media.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-2">Customer Shared Evidence</h4>
                  <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                    {viewRefund.media.map((item, idx) => (
                      <div key={idx} className="w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-slate-100 relative">
                        {item.type === 'image' ? (
                          <img src={item.url} alt="Evidence" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-xs font-medium text-slate-500">Video</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contribution Breakdown (History/Approved only) */}
              {viewRefund.status === 'Approved' && (
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-2">Refund Contribution</h4>
                  <div className="bg-[#FFFFFF] p-4 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-slate-600">Platform Contribution</p>
                      <p className="text-sm font-semibold text-slate-900">₹{viewRefund.platformContribution || 0}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-slate-600">Restaurant Contribution</p>
                      <p className="text-sm font-semibold text-slate-900">₹{viewRefund.restaurantContribution || 0}</p>
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                      <p className="text-sm font-bold text-slate-900">Total Refunded</p>
                      <p className="text-sm font-bold text-slate-900">₹{viewRefund.amount}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Footer (if pending) */}
            {viewRefund.status === 'Pending' && (
              <div className="p-4 border-t border-slate-100 bg-[#FFFFFF] shrink-0 flex gap-3">
                <button 
                  onClick={() => {
                    setViewModalOpen(false);
                    openRejectModal(viewRefund.id);
                  }}
                  className="flex-1 h-12 bg-[#FF0000] text-white rounded-xl font-semibold hover:bg-red-700 transition-all"
                >
                  Reject
                </button>
                <button 
                  onClick={() => {
                    handleAccept(viewRefund.id);
                    setViewModalOpen(false);
                  }}
                  className="flex-1 h-12 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
                >
                  Accept Refund
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
