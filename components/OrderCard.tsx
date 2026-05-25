import React from 'react';
import { Clock } from 'lucide-react';
import { Order } from '../types';

interface OrderCardProps {
  order: Order;
  onClick: () => void;
  onUpdateStatus: (e: React.MouseEvent) => void;
  isCompact?: boolean;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onClick, onUpdateStatus, isCompact = false }) => {
  // Parse time to determine urgency
  let timeRemaining = parseInt(order.time.split(':')[0]);
  if (isNaN(timeRemaining)) timeRemaining = 15; // fallback
  
  let timerBg = 'bg-[#EFF6FF]';
  let timerText = 'text-[#1E90FF]';
  
  if (timeRemaining < 0) {
    timerBg = 'bg-red-50';
    timerText = 'text-red-600';
  } else if (timeRemaining < 5) {
    timerBg = 'bg-orange-50';
    timerText = 'text-orange-600';
  }

  const isHighPriority = timeRemaining < 5 && timeRemaining >= 0;
  const isRushOrder = timeRemaining < 0;

  const btnText = order.status === 'Incoming' ? 'Accept Order' : 
                  order.status === 'Preparing' ? 'Mark as Ready' : 
                  'Handover Order';
                  
  const btnBg = order.status === 'Incoming' ? 'bg-[#1E90FF]' : 
                order.status === 'Preparing' ? 'bg-[#22C55E]' : 
                'bg-[#6366F1]';

  const itemCount = order.itemList ? order.itemList.reduce((acc, item) => acc + item.quantity, 0) : 0;

  return (
    <div 
      onClick={onClick}
      className={`bg-[#FFFFFF] rounded-[20px] border border-[#E5E7EB] shadow-sm mb-5 mx-4 cursor-pointer active:scale-[0.98] transition-all flex flex-col ${isCompact ? 'p-[16px]' : 'p-[22px] min-h-[260px]'}`}
    >
      {/* Top Section */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-[18px] font-bold text-slate-900">{order.id}</h3>
            {isRushOrder && <span className="text-[12px] font-bold text-red-600">⚡ Rush Order</span>}
            {isHighPriority && <span className="text-[12px] font-bold text-orange-600">🔥 High Priority</span>}
          </div>
          <p className="text-[13px] text-[#6B7280]">Today • 12:42 PM</p>
        </div>
        
        <div className={`h-[36px] px-[12px] rounded-full flex items-center gap-1.5 ${timerBg} ${timerText}`}>
          <Clock size={16} />
          <span className="font-semibold text-[14px]">{order.time}</span>
        </div>
      </div>

      {/* Status Row */}
      <div className="flex items-center gap-2 mb-4">
        <div className={`h-[28px] px-[10px] rounded-full flex items-center text-[12px] font-medium ${
          order.status === 'Preparing' ? 'bg-[#FEF3C7] text-[#92400E]' : 
          order.status === 'Ready' ? 'bg-[#D1FAE5] text-[#065F46]' :
          'bg-slate-100 text-slate-700'
        }`}>
          {order.status}
        </div>
        <div className="h-[28px] px-[10px] rounded-full flex items-center text-[12px] font-medium bg-[#DBEAFE] text-[#1E90FF]">
          {order.type}
        </div>
      </div>

      {/* Customer + Amount Row */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-[15px] font-medium text-slate-900">{order.customer}</span>
        <span className="text-[16px] font-bold text-slate-900">₹{order.total}</span>
      </div>

      {!isCompact && (
        <>
          {/* Items Section */}
          <div className="mb-4">
            <p className="text-[13px] text-[#6B7280] mb-2">Items • {itemCount || order.items.split(',').length}</p>
            <div className="space-y-[8px]">
              {order.itemList && order.itemList.length > 0 ? (
                order.itemList.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                    <p className="text-[14px] text-slate-800 leading-snug">
                      {item.name} ×{item.quantity}
                    </p>
                  </div>
                ))
              ) : (
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                  <p className="text-[14px] text-slate-800 leading-snug">{order.items}</p>
                </div>
              )}
            </div>
          </div>

          {/* Source Section */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[13px] text-[#6B7280]">Source</span>
            <span className="text-[13px] font-medium text-slate-700">{order.channel}</span>
          </div>
        </>
      )}

      {/* CTA Button */}
      <button 
        onClick={onUpdateStatus}
        className={`w-full h-[48px] rounded-[14px] text-white font-semibold text-[15px] flex items-center justify-center active:scale-[0.98] transition-all mt-auto ${btnBg}`}
      >
        {btnText}
      </button>
    </div>
  );
};
