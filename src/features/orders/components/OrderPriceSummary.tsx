import React from "react";
import { Order } from "@/types";

interface OrderPriceSummaryProps {
  order: Order;
  paymentStatus: string;
}

/** Presentational order-details card: line items, honest totals and payment status. */
export const OrderPriceSummary: React.FC<OrderPriceSummaryProps> = ({ order, paymentStatus }) => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
      <h3 className="text-sm font-bold text-slate-900 mb-3">Order Details</h3>
      <div className="space-y-2 mb-4">
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <div className="flex gap-2">
              <span className="font-medium text-slate-700">{item.quantity}x</span>
              <span className="text-slate-600">{item.name}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="pt-3 border-t border-slate-100 space-y-2">
        {order.subtotal != null && (
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Item Total</span>
            <span className="font-medium text-slate-700">₹{order.subtotal}</span>
          </div>
        )}
        {order.tax != null && (
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Taxes & Fees</span>
            <span className="font-medium text-slate-700">₹{order.tax}</span>
          </div>
        )}
        <div className="flex justify-between text-sm font-bold pt-2 border-t border-slate-100">
          <span className="text-slate-900">Final Amount</span>
          <span className="text-slate-900">₹{order.total || 0}</span>
        </div>
        <div className="flex justify-between text-xs pt-2">
          <span className="text-slate-500">Payment Status</span>
          {paymentStatus === 'PAID' ? (
            <span className="font-bold text-[#00bd6f] bg-[#00bd6f]/10 px-2 py-0.5 rounded">PAID</span>
          ) : (
            <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">CASH ON DELIVERY</span>
          )}
        </div>
      </div>
    </div>
  );
};
