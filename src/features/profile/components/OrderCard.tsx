import React from 'react';
import { Order, Review, OrderType } from '@/types';
import { 
  Star, 
  RotateCcw, 
  MapPin, 
  Clock, 
  Navigation,
  ShoppingBag,
  ChevronRight,
  Truck,
  Package,
  Utensils,
  Zap,
  FileText,
  Activity,
  Timer,
  CheckCircle2,
  ChefHat
} from 'lucide-react';

interface OrderCardProps {
  order: Order;
  review?: Review;
  onRateClick?: (order: Order) => void;
  onViewReviewClick?: (order: Order) => void;
  onViewDetailsClick?: (order: Order) => void;
  onReorderClick?: (order: Order) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ 
  order, 
  review, 
  onRateClick, 
  onViewReviewClick, 
  onViewDetailsClick,
  onReorderClick
}) => {
  const isCompleted = (order.status as string) === 'Completed' || (order.status as string) === 'COMPLETED' || (order.status as string) === 'DELIVERED';
  const isCancelled = (order.status as string) === 'Cancelled' || (order.status as string) === 'CANCELLED';
  const isActive = order.status === 'Active';

  const getTypeConfig = (type: OrderType) => {
    switch (type) {
      case 'Delivery':
        return { icon: Truck, color: 'text-indigo-500', bg: 'bg-indigo-50', label: 'Delivery' };
      case 'Takeaway':
        return { icon: Package, color: 'text-orange-500', bg: 'bg-orange-50', label: 'Self Pickup' };
      case 'Dine-in':
        return { icon: Utensils, color: 'text-emerald-500', bg: 'bg-emerald-50', label: 'Dine-in' };
      default:
        return { icon: ShoppingBag, color: 'text-slate-500', bg: 'bg-slate-50', label: 'Order' };
    }
  };

  const typeConfig = getTypeConfig(order.type);

  if (isActive) {
    return (
      <div className="relative mb-6 animate-fadeInUp">
        <div 
          className="bg-white rounded-[2.5rem] p-7 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 relative overflow-hidden group transition-all duration-500"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Timer className="w-4 h-4 text-blue-600 animate-pulse" />
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Estimated Arrival</span>
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
                {order.timeEstimate || '15 mins'}
              </h2>
            </div>
            <div className="w-14 h-14 bg-slate-900 rounded-[1.25rem] flex flex-col items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
               <span className="text-white font-black text-xl leading-none">c.</span>
               <span className="text-white/40 text-[7px] font-black uppercase tracking-tighter">premium</span>
            </div>
          </div>

          <div className="mb-8 relative z-10">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                {order.restaurantName}
                <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-50" />
              </h3>
              <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border shadow-sm ${typeConfig.bg} ${typeConfig.color} border-current/10`}>
                {order.type}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-400 line-clamp-1 uppercase tracking-tight">
              {order.items}
            </p>
          </div>

          <div className="flex gap-3 relative z-10">
             <button 
                onClick={(e) => { e.stopPropagation(); onViewDetailsClick?.(order); }}
                className="flex-1 bg-white text-blue-600 border-2 border-blue-50 py-4 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all group/btn hover:border-blue-100 shadow-none"
             >
                <Activity className="w-4 h-4 text-blue-500 group-hover/btn:animate-spin" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Track Live Order</span>
                <ChevronRight className="w-4 h-4 text-blue-300" />
             </button>
             <button 
                className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all active:scale-90"
             >
                <FileText className="w-5 h-5" />
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[20px] p-4 border border-slate-200 relative overflow-hidden font-sans">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-3">
          <div className="pt-0.5">
            <h3 className="font-bold text-slate-900 text-[15px] leading-tight mb-0.5 flex items-center gap-1.5 flex-wrap">
              {order.restaurantName}
            </h3>
            <p className="text-[13px] text-slate-500 mb-1">
              {order.location}
            </p>
            <p className="text-[12px] text-slate-400">
              {order.status === 'Completed' ? 'Delivered' : 'Cancelled'} • {order.type}
            </p>
          </div>
        </div>

        <div className={`px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide ${
          order.status === 'Completed' 
            ? 'bg-[#00BD6F]/10 text-[#00BD6F]' 
            : 'bg-red-50 text-red-600'
        }`}>
          {order.status === 'Completed' ? 'Delivered' : 'Cancelled'}
        </div>
      </div>

      <div className="h-px bg-slate-100 w-full mb-3" />

      <div className="mb-2">
        <p className="text-[12px] font-semibold text-slate-400 mb-1">
          Order Summary
        </p>
        <div className="flex justify-between items-start">
          <p className="text-[14px] text-slate-700 font-medium line-clamp-2 pr-4 flex-1">
            {order.items}
          </p>
          <p className="text-[15px] font-bold text-slate-900 shrink-0">
            ₹{order.price || order.total || '0'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mb-4">
        <Clock className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[13px] text-slate-500">
          {order.orderDate}
        </span>
      </div>

      <div className="flex gap-2.5">
        {!isCancelled && (
          <button 
            onClick={() => onViewDetailsClick?.(order)}
            className="flex-1 flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 py-2.5 rounded-xl text-[13px] font-medium transition-colors border border-slate-200 active:scale-95"
          >
            Details
          </button>
        )}
        
        <button 
          onClick={() => onReorderClick?.(order)}
          className="flex-1 flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 py-2.5 rounded-xl text-[13px] font-medium transition-colors border border-slate-200 active:scale-95"
        >
          Reorder
        </button>

        {isCompleted && (
          (order.isRated || review) ? (
            <button 
              disabled
              className="flex-1 flex items-center justify-center gap-1.5 bg-slate-100 text-slate-400 py-2.5 rounded-xl text-[13px] font-medium border border-slate-200 cursor-not-allowed"
            >
              Rated
            </button>
          ) : (
            <button 
              onClick={() => onRateClick?.(order)}
              className="flex-1 flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 py-2.5 rounded-xl text-[13px] font-medium transition-colors border border-slate-200 active:scale-95"
            >
              Rate Order
            </button>
          )
        )}
      </div>
    </div>
  );
};
