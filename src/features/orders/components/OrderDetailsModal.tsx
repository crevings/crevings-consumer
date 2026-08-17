import React from 'react';
import { 
  X, 
  Download, 
  Receipt,
  Building,
  Phone
} from 'lucide-react';
import { Order } from '@/types';
import { downloadInvoice, parseOrderItems, getOrderTotals } from "@/lib/invoice";

interface OrderDetailsModalProps {
  order: Order | null;
  onClose: () => void;
}



export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const itemsList = parseOrderItems(order);
  const { total, subtotal, deliveryFee, tax } = getOrderTotals(order);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-slate-100 animate-slideUp">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#00bd6f] flex items-center justify-center font-bold">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900 leading-tight">Order Details</h2>
              <p className="text-xs text-slate-500 font-mono">#{order.realOrderId || order.id}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Restaurant Header */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-[#00bd6f] shrink-0 font-bold text-xl">
              <Building className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-900 text-base truncate">{order.restaurantName}</h3>
              <p className="text-xs text-slate-500 truncate">{order.location || 'Restaurant Branch Address'}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {order.restaurantPhone && (
                <a
                  href={`tel:${order.restaurantPhone.replace(/[^\d+]/g, '')}`}
                  aria-label={`Call ${order.restaurantName}`}
                  className="w-8 h-8 rounded-full bg-emerald-50 text-[#00bd6f] border border-emerald-200/60 flex items-center justify-center active:scale-95 transition-all hover:bg-emerald-100"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
              )}
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0">
                {order.status}
              </span>
            </div>
          </div>

          {/* Items Summary */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Order Items</h4>
            <div className="space-y-3 bg-white rounded-2xl p-4 border border-slate-100 divide-y divide-slate-100">
              {itemsList.map((item, idx: number) => (
                <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">
                      {item.quantity || 1}x
                    </span>
                    <span className="font-semibold text-slate-800">{typeof item === 'string' ? item : item.name || ''}</span>
                  </div>
                  <span className="font-bold text-slate-900">₹{item.price ? item.price * (item.quantity || 1) : "—"}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bill Breakdown */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Bill Details</h4>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Item Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Charge</span>
                <span>₹{deliveryFee}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>GST & Taxes</span>
                <span>₹{tax}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                <span>Total Paid</span>
                <span>₹{total}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Action */}
        <div className="p-4 bg-white border-t border-slate-100 flex gap-3">
          <button 
            onClick={() => downloadInvoice(order)}
            className="flex-1 bg-[#00bd6f] hover:bg-[#00a862] text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md shadow-[#00bd6f]/20 flex items-center justify-center gap-2 active:scale-95"
          >
            <Download className="w-4 h-4" />
            Download Tax Invoice
          </button>
        </div>

      </div>
    </div>
  );
};
