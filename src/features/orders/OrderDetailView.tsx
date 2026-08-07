import React from 'react';
import { 
  ArrowLeft, 
  Download, 
  Receipt,
  Building,
  RotateCcw,
  Star,
  Clock
} from 'lucide-react';
import { Order } from '@/types';
import { downloadInvoice, parseOrderItems, getOrderTotals } from "@/lib/invoice";

interface OrderDetailViewProps {
  order: Order;
  onBack: () => void;
  onReorderClick?: (order: Order) => void;
  onRateClick?: (order: Order) => void;
}



export const OrderDetailView: React.FC<OrderDetailViewProps> = ({ 
  order, 
  onBack,
  onReorderClick,
  onRateClick
}) => {
  if (!order) return null;

  const itemsList = parseOrderItems(order);
  const { total, subtotal, deliveryFee, tax } = getOrderTotals(order);
  const statusStr = String(order.status || '');
  const isCompleted = statusStr === 'Completed' || statusStr === 'COMPLETED' || statusStr === 'DELIVERED';
  const isCancelled = statusStr === 'Cancelled' || statusStr === 'CANCELLED';

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 max-w-md mx-auto shadow-2xl">
      {/* Top Header Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-100 px-4 py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-slate-900 text-base leading-tight">Order Details</h1>
            <p className="text-xs text-slate-500 font-mono">#{order.realOrderId || order.id}</p>
          </div>
        </div>

        <div className="w-9 h-9 rounded-full bg-emerald-50 text-[#00bd6f] flex items-center justify-center font-bold">
          <Receipt className="w-5 h-5" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 space-y-4">

        {/* Restaurant Banner Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-[#00bd6f] shrink-0 font-bold">
            <Building className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-slate-900 text-base truncate">{order.restaurantName}</h2>
            <p className="text-xs text-slate-500 truncate mt-0.5">{order.location || 'Restaurant Branch Address'}</p>
            {order.orderDate && (
              <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-400">
                <Clock className="w-3 h-3" />
                <span>{order.orderDate}</span>
              </div>
            )}
          </div>
          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shrink-0 ${
            isCompleted 
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
              : isCancelled 
              ? 'bg-red-50 text-red-600 border border-red-100' 
              : 'bg-blue-50 text-blue-600 border border-blue-100'
          }`}>
            {order.status}
          </span>
        </div>

        {/* Items Summary */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Order Items</h3>
          <div className="space-y-3 divide-y divide-slate-100">
            {itemsList.map((item, idx: number) => (
              <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                    {item.quantity || 1}x
                  </span>
                  <span className="font-semibold text-slate-800">{typeof item === 'string' ? item : item.name || ''}</span>
                </div>
                <span className="font-bold text-slate-900 shrink-0">₹{item.price ? item.price * (item.quantity || 1) : "—"}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bill Breakdown */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Bill Details</h3>
          <div className="space-y-2.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Item Subtotal</span>
              <span className="font-medium text-slate-800">₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charge</span>
              <span className="font-medium text-slate-800">₹{deliveryFee}</span>
            </div>
            <div className="flex justify-between">
              <span>GST & Taxes</span>
              <span className="font-medium text-slate-800">₹{tax}</span>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-between font-bold text-sm text-slate-900">
              <span>Total Paid</span>
              <span className="text-base text-[#00bd6f]">₹{total}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <button 
            onClick={() => downloadInvoice(order)}
            className="w-full bg-[#00bd6f] hover:bg-[#00a862] text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md shadow-[#00bd6f]/20 flex items-center justify-center gap-2 active:scale-95"
          >
            <Download className="w-4 h-4" />
            Download Tax Invoice
          </button>

          <div className="flex gap-2.5">
            {onReorderClick && (
              <button 
                onClick={() => onReorderClick(order)}
                className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-xl text-xs border border-slate-200 shadow-sm active:scale-95 transition-all"
              >
                <RotateCcw className="w-4 h-4 text-slate-500" />
                Reorder Items
              </button>
            )}

            {isCompleted && onRateClick && (
              <button 
                onClick={() => onRateClick(order)}
                className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-xl text-xs border border-slate-200 shadow-sm active:scale-95 transition-all"
              >
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                Rate Order
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
