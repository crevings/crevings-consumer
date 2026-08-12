
import React from 'react';
import { ChevronRight, Clock } from 'lucide-react';
import { Order } from "@/types";
import { joinItemNames } from "@/utils/orderItems";

interface ActiveOrderSnackbarProps {
  order: Order;
  onClick: (order: Order) => void;
}

export const ActiveOrderSnackbar: React.FC<ActiveOrderSnackbarProps> = ({ order, onClick }) => {
  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 pb-safe animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)]">
      <div 
        onClick={() => onClick(order)}
        className="bg-white rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center gap-3 active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden group border border-slate-100"
      >
        {/* Glowing background effect */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-green-50 to-transparent opacity-50 pointer-events-none" />
        
        {/* Text Content */}
        <div className="flex-1 min-w-0 pl-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-slate-900 font-bold text-[15px] truncate pr-2">
              {order.restaurantName}
            </h4>
            {order.timeEstimate && (
              <div className="flex items-center gap-1 text-green-700 bg-green-100 px-2 py-0.5 rounded-md shrink-0">
                <Clock className="w-3 h-3" />
                <span className="text-xs font-bold">{order.timeEstimate}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1.5 text-xs text-slate-500 truncate">
            <span className="text-green-600 font-bold">
              {order.statusDisplay || (
                order.status === 'PREPARING' ? 'Preparing order' :
                order.status === 'OUT_FOR_DELIVERY' || order.status === 'OUT FOR DELIVERY' ? 'Out for delivery' :
                order.status === 'DELIVERED' || order.status === 'COMPLETED' ? 'Delivered' :
                order.status === 'CANCELLED' ? 'Order cancelled' :
                'Order placed'
              )}
            </span>
            <span className="w-1 h-1 bg-slate-300 rounded-full shrink-0" />
            <span className="truncate">{joinItemNames(order)}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center shrink-0 text-slate-400 group-hover:bg-green-50 group-hover:text-green-600 transition-colors border border-slate-200 ml-1">
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
