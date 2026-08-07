import React from "react";
import { Tag, ChevronRight } from "lucide-react";
import { formatINR } from "@/utils/currency";

interface CouponRowProps {
  appliedCoupon: { code: string; discount: number } | null;
  discountAmount: number;
  onClick: () => void;
}

/** Presentational "Apply Coupon" row in checkout. */
export const CouponRow: React.FC<CouponRowProps> = ({ appliedCoupon, discountAmount, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-[20px] p-4 border border-slate-100 shadow-sm flex items-center justify-between text-left"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
          <Tag size={20} />
        </div>
        <div>
          <h4 className="text-[14px] font-bold text-slate-900">
            {appliedCoupon ? `Coupon Applied: ${appliedCoupon.code}` : "Apply Coupon"}
          </h4>
          <p
            className={`text-[12px] ${appliedCoupon ? "text-emerald-600 font-medium" : "text-slate-500"}`}
          >
            {appliedCoupon ? `Saved ${formatINR(discountAmount)}` : "View available offers"}
          </p>
        </div>
      </div>
      <ChevronRight size={20} className="text-slate-400" />
    </button>
  );
};
