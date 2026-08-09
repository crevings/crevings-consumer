import React from "react";
import { BadgePercent, ChevronRight, CheckCircle2 } from "lucide-react";

interface GstWaiverOfferCardProps {
  applied: boolean;
  onClick: () => void;
}

/**
 * Static frontend offer template that lets the customer opt into the
 * GST waiver. Tapping it opens the apply popup (GstWaiverSheet).
 */
export const GstWaiverOfferCard: React.FC<GstWaiverOfferCardProps> = ({ applied, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full bg-white rounded-[20px] p-4 border shadow-sm flex items-center justify-between text-left transition-colors ${
        applied ? "border-emerald-200 bg-emerald-50" : "border-slate-100"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            applied ? "bg-emerald-100 text-emerald-600" : "bg-green-50 text-green-600"
          }`}
        >
          {applied ? <CheckCircle2 size={20} /> : <BadgePercent size={20} />}
        </div>
        <div>
          <h4 className="text-[14px] font-bold text-slate-900">
            {applied ? "GST Waiver Applied" : "Flat 0% GST — Waive off all taxes"}
          </h4>
          <p className={`text-[12px] ${applied ? "text-emerald-600 font-medium" : "text-slate-500"}`}>
            {applied ? "All GST waived on this order" : "Save 100% on GST — tap to apply"}
          </p>
        </div>
      </div>
      <ChevronRight size={20} className="text-slate-400" />
    </button>
  );
};
