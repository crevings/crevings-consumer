import React from "react";
import { Info } from "lucide-react";
import { formatAmount } from "@/utils/currency";

interface PriceBreakdownProps {
  subtotal: number;
  deliveryFee: number;
  distanceKm: number;
  discountAmount: number;
  tipAmount: number;
  taxes: number;
  platformFee: number;
  total: number;
  orderType: "Delivery" | "Takeaway";
  onShowTaxesSheet: () => void;
}

/** Presentational price breakdown card for the checkout bill. */
export const PriceBreakdown: React.FC<PriceBreakdownProps> = ({
  subtotal,
  deliveryFee,
  distanceKm,
  discountAmount,
  tipAmount,
  taxes,
  platformFee,
  total,
  orderType,
  onShowTaxesSheet,
}) => {
  return (
    <div className="bg-white border border-slate-100 rounded-[24px] shadow-sm overflow-hidden mb-6">
      <div className="p-4 flex items-start justify-between border-b border-slate-100">
        <div className="flex items-start gap-3">
          <div className="text-left">
            <h3 className="text-[17px] font-bold text-slate-800 flex items-center gap-2">
              To Pay{" "}
              {discountAmount > 0 && (
                <span className="text-slate-400 line-through font-medium">
                  ₹{formatAmount(total + discountAmount)}
                </span>
              )}{" "}
              ₹{formatAmount(total)}
            </h3>
            {discountAmount > 0 && (
              <p className="text-[14px] font-medium text-green-600 mt-0.5">
                ₹{formatAmount(discountAmount)} saved on the total!
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="flex justify-between items-center text-[15px]">
          <span className="text-slate-500">Item Total</span>
          <span className="text-slate-700 font-medium">₹{formatAmount(subtotal)}</span>
        </div>

        {orderType === "Delivery" ? (
          <div className="flex justify-between items-start text-[15px]">
            <div className="flex flex-col text-left">
              <span className="text-slate-500">
                Delivery Fee{distanceKm > 0 ? <span className="text-green-600 font-medium"> | {distanceKm} km</span> : ""}
              </span>
              <span className="text-[13px] text-slate-400 mt-2 max-w-[220px] leading-snug">
                This amount goes directly to our local rider to ensure safe and timely delivery.
              </span>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-green-600 font-medium">₹{formatAmount(deliveryFee)}</span>
            </div>
          </div>
        ) : null}

        {discountAmount > 0 && (
          <div className="flex justify-between items-center text-[15px]">
            <span className="text-slate-500">Extra discount for you</span>
            <span className="text-green-600 font-medium">- ₹{formatAmount(discountAmount)}</span>
          </div>
        )}

        <div className="border-b border-dashed border-slate-200 my-2" />

        <div className="flex justify-between items-center text-[15px]">
          <span className="text-slate-500">Delivery Tip</span>
          <span className="text-green-600 font-medium">₹{formatAmount(tipAmount)}</span>
        </div>

        <div className="flex justify-between items-center text-[15px]">
          <div
            className="flex items-center gap-1.5 cursor-pointer group"
            onClick={onShowTaxesSheet}
          >
            <span className="text-slate-500 border-b border-dashed border-slate-300 group-hover:border-slate-400">GST & Other Charges</span>
            <Info size={14} className="text-slate-400" />
          </div>
          <span className="text-slate-700 font-medium">₹{formatAmount(taxes + platformFee)}</span>
        </div>

        <div className="border-b border-dashed border-slate-200 my-2" />

        <div className="flex justify-between items-center pt-1 pb-1">
          <span className="font-bold text-slate-800 text-[17px]">To Pay</span>
          <span className="font-bold text-slate-800 text-[17px]">₹{formatAmount(total)}</span>
        </div>
      </div>
    </div>
  );
};
