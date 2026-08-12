import React from "react";
import { Order } from "@/types";
import { normalizeOrderItems } from "@/utils/orderItems";

interface OrderPriceSummaryProps {
  order: Order;
  paymentStatus: string;
}

/** Presentational order-details card: line items, honest totals and payment status. */
export const OrderPriceSummary: React.FC<OrderPriceSummaryProps> = ({ order, paymentStatus }) => {
  const method = (order.paymentMethod || order.payment?.method || "").toLowerCase();
  const isCod = method === "cod" || method === "cash" || paymentStatus === "PENDING" || paymentStatus === "DUE";

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
      <h3 className="text-sm font-bold text-slate-900 mb-3">Order Details</h3>
      <div className="space-y-2 mb-4">
        {normalizeOrderItems(order).map((item, i) => (
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
        <div className="flex justify-between text-xs pt-2 items-center">
          <span className="text-slate-500">Payment Status</span>
          {isCod ? (
            <span className="font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded tracking-wide text-[11px]">DUE</span>
          ) : (
            <span className="font-bold text-[#00bd6f] bg-[#00bd6f]/10 px-2 py-0.5 rounded tracking-wide text-[11px]">PAID</span>
          )}
        </div>
      </div>
    </div>
  );
};
