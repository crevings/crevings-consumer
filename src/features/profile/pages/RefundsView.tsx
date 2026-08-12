
import React from 'react';
import { ChevronLeft, Clock, CheckCircle2 } from 'lucide-react';

interface RefundsViewProps {
  onBack: () => void;
}

export const RefundsView: React.FC<RefundsViewProps> = ({ onBack }) => {
  const refunds = [
    {
        id: 'REF-8821',
        amount: 120,
        date: 'Aug 12, 2024',
        restaurant: 'Pizza Hut',
        status: 'Credited',
        reason: 'Missing items'
    },
    {
        id: 'REF-9932',
        amount: 450,
        date: 'Aug 10, 2024',
        restaurant: 'Burger King',
        status: 'Processing',
        reason: 'Order cancelled by restaurant'
    }
  ];

  return (
    <div className="min-h-screen bg-[#f4f5f7] font-sans animate-[fadeInUp_0.3s_ease-out]">
      {/* Header */}
      <div className="bg-white px-4 pt-safe-3 pb-3 flex items-center gap-3 sticky top-0 z-20 shadow-sm">
        <button onClick={onBack} className="p-2 -ml-2 bg-white rounded-full active:scale-95 transition-transform">
          <ChevronLeft className="w-6 h-6 text-slate-800" />
        </button>
        <h1 className="text-lg font-bold text-slate-900">Refunds</h1>
      </div>

      <div className="p-4 space-y-6">
          {/* Active Refund Card */}
          <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3 px-1">Active Refunds</h3>
              {refunds.filter(r => r.status === 'Processing').map(refund => (
                  <div key={refund.id} className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100 mb-3">
                      <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-amber-50 rounded-[16px] flex items-center justify-center text-amber-500">
                                  <Clock className="w-5 h-5" />
                              </div>
                              <div>
                                  <h4 className="font-bold text-slate-900 text-base">{refund.restaurant}</h4>
                                  <p className="text-xs text-slate-500 font-medium mt-0.5">ID: {refund.id}</p>
                              </div>
                          </div>
                          <span className="bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                              Processing
                          </span>
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                          <span className="text-sm font-medium text-slate-600">{refund.reason}</span>
                          <span className="text-lg font-black text-slate-900">₹{refund.amount}</span>
                      </div>
                  </div>
              ))}
          </div>

          {/* Past Refunds */}
          <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3 px-1">Past Refunds</h3>
              {refunds.filter(r => r.status === 'Credited').map(refund => (
                  <div key={refund.id} className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100 mb-3">
                      <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-[#00bd6f]/10 rounded-[16px] flex items-center justify-center text-[#00bd6f]">
                                  <CheckCircle2 className="w-5 h-5" />
                              </div>
                              <div>
                                  <h4 className="font-bold text-slate-900 text-base">{refund.restaurant}</h4>
                                  <p className="text-xs text-slate-500 font-medium mt-0.5">ID: {refund.id} • {refund.date}</p>
                              </div>
                          </div>
                          <span className="bg-[#00bd6f]/10 text-[#00bd6f] text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                              Credited
                          </span>
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                          <span className="text-sm font-medium text-slate-600">{refund.reason}</span>
                          <span className="text-lg font-black text-slate-900">₹{refund.amount}</span>
                      </div>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
};
