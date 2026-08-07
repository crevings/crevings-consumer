import React from "react";
import { MapIcon, CheckCircle2 } from "lucide-react";
import { OrderType, DeliveryPartner } from "@/types";

interface OrderStatusTimelineProps {
  orderType: OrderType;
  progress: number;
  assignedPartner: DeliveryPartner | null;
  onViewMap: () => void;
}

/** Presentational order-status timeline with progress rail. */
export const OrderStatusTimeline: React.FC<OrderStatusTimelineProps> = ({
  orderType,
  progress,
  assignedPartner,
  onViewMap,
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-900">
          {orderType === 'Delivery' ? 'Delivery Status' : 'Order Status'}
        </h2>
        {orderType === 'Delivery' && (
          <button 
            onClick={onViewMap}
            className="text-sm font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors bg-blue-50 text-blue-600 active:scale-95"
          >
            <MapIcon className="w-4 h-4" /> View Map
          </button>
        )}
      </div>
      
      <div className="relative pl-3">
        <div className="absolute left-[27px] top-3 bottom-3 w-0.5 bg-slate-100" />
        <div className="absolute left-[27px] top-3 w-0.5 bg-[#00bd6f] transition-all duration-1000" style={{ height: `${progress}%` }} />
        
        <div className="space-y-6 relative">
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-[#00bd6f] flex items-center justify-center shrink-0 shadow-sm z-10">
        <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div className="pt-1">
        <h3 className="text-sm font-bold text-slate-900">Order Confirmed</h3>
        <p className="text-xs text-slate-500">Your order has been received</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm z-10 transition-colors ${progress >= 20 ? 'bg-[#00bd6f]' : 'bg-white border-2 border-slate-200'}`}>
        {progress >= 20 && <CheckCircle2 className="w-5 h-5 text-white" />}
            </div>
            <div className="pt-1">
        <h3 className={`text-sm font-bold ${progress >= 20 ? 'text-slate-900' : 'text-slate-500'}`}>Preparing</h3>
        <p className="text-xs text-slate-500">The restaurant is preparing your food</p>
            </div>
          </div>

          {orderType === 'Delivery' && (
            <div className="flex gap-4">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm z-10 transition-colors ${progress >= 50 ? 'bg-[#00bd6f]' : 'bg-white border-2 border-slate-200'}`}>
          {progress >= 50 && <CheckCircle2 className="w-5 h-5 text-white" />}
        </div>
        <div className="pt-1">
          <h3 className={`text-sm font-bold ${progress >= 50 ? 'text-slate-900' : 'text-slate-500'}`}>Driver Assigned</h3>
          <p className="text-xs text-slate-500">Driver is heading to restaurant</p>
        </div>
            </div>
          )}
          
          <div className="flex gap-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm z-10 transition-colors ${progress >= 75 ? 'bg-[#00bd6f]' : 'bg-white border-2 border-slate-200'}`}>
        {progress >= 75 && <CheckCircle2 className="w-5 h-5 text-white" />}
            </div>
            <div className="pt-1">
        <h3 className={`text-sm font-bold ${progress >= 75 ? 'text-slate-900' : progress >= 45 ? (assignedPartner ? 'text-slate-900' : 'text-amber-600') : 'text-slate-500'}`}>
          {orderType === 'Delivery' 
            ? (progress >= 75 
                ? 'Order picked by driver' 
                : progress >= 45 
            ? (assignedPartner ? 'Food Ready • Driver Assigned' : 'Food Ready • Searching for Driver') 
            : 'Awaiting Driver') 
            : 'Ready for Pickup'}
        </h3>
        <p className="text-xs text-slate-500">
          {orderType === 'Delivery' 
            ? (progress >= 75 
                ? 'Driver has collected your order' 
                : progress >= 45 
            ? (assignedPartner ? 'Driver is at the restaurant to pick up' : 'Kitchen has prepared your order') 
            : 'Assigning nearest driver') 
            : 'Your order is ready to be collected'}
        </p>
            </div>
          </div>

          {orderType === 'Delivery' && (
            <div className="flex gap-4">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm z-10 transition-colors ${progress >= 85 ? 'bg-[#00bd6f]' : 'bg-white border-2 border-slate-200'}`}>
          {progress >= 85 && <CheckCircle2 className="w-5 h-5 text-white" />}
        </div>
        <div className="pt-1">
          <h3 className={`text-sm font-bold ${progress >= 85 ? 'text-slate-900' : 'text-slate-500'}`}>Driver is arriving soon</h3>
          <p className="text-xs text-slate-500">Driver is near your location</p>
        </div>
            </div>
          )}
          
          {orderType === 'Delivery' && (
            <div className="flex gap-4">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm z-10 transition-colors ${progress >= 100 ? 'bg-[#00bd6f]' : 'bg-white border-2 border-slate-200'}`}>
          {progress >= 100 && <CheckCircle2 className="w-5 h-5 text-white" />}
        </div>
        <div className="pt-1">
          <h3 className={`text-sm font-bold ${progress >= 100 ? 'text-slate-900' : 'text-slate-500'}`}>Delivered</h3>
          <p className="text-xs text-slate-500">Enjoy your meal!</p>
        </div>
            </div>
          )}
        </div>
      </div>
    </div>

  );
};
