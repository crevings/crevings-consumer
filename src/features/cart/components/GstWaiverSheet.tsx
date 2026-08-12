import { X, BadgePercent, CheckCircle2 } from "lucide-react";
import { formatAmount } from "@/utils/currency";

interface GstWaiverSheetProps {
  open: boolean;
  applied: boolean;
  gstOnFood: number;
  gstOnDelivery: number;
  gstOnPlatform: number;
  savings: number;
  onApply: () => void;
  onRemove: () => void;
  onClose: () => void;
}

/**
 * Bottom sheet shown when the customer taps the GST waiver offer card.
 * Lets them apply (or remove) the static frontend GST waiver offer.
 */
export const GstWaiverSheet: React.FC<GstWaiverSheetProps> = ({
  open,
  applied,
  gstOnFood,
  gstOnDelivery,
  gstOnPlatform,
  savings,
  onApply,
  onRemove,
  onClose,
}) => {
  if (!open) return null;

  const rows = [
    { label: "GST on Food (5%)", amount: gstOnFood },
    { label: "GST on Delivery Fee (18%)", amount: gstOnDelivery },
    { label: "GST on Platform Fee (18%)", amount: gstOnPlatform },
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full bg-white rounded-t-[24px] p-6 animate-in slide-in-from-bottom-full duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[18px] font-bold text-slate-900">GST Waiver Offer</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-slate-400 bg-slate-100 rounded-full"
          >
            <X size={18} />
          </button>
        </div>

        {/* Offer header */}
        <div
          className={`rounded-2xl border-2 border-dashed p-4 mb-4 ${
            applied ? "border-emerald-400 bg-emerald-50" : "border-green-500 bg-green-50"
          }`}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <BadgePercent size={18} className={applied ? "text-emerald-600" : "text-green-600"} />
            <span className={`text-[11px] font-black uppercase tracking-wider ${applied ? "text-emerald-700" : "text-green-700"}`}>
              CREVINGS-GST0
            </span>
            {applied && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                <CheckCircle2 size={12} /> Applied
              </span>
            )}
          </div>
          <h4 className="text-[16px] font-bold text-slate-900">Flat 0% GST — waive off all taxes</h4>
          <p className="text-[13px] text-slate-600 mt-1 leading-relaxed">
            Get 100% off on GST. All taxes on your order are waived — no GST on food, delivery or
            platform fees.
          </p>
        </div>

        {/* Savings breakdown */}
        <p className="text-[13px] font-bold text-slate-700 mb-3">You save on:</p>
        <div className="space-y-2.5 mb-5">
          {rows.map(({ label, amount }) => (
            <div key={label} className="flex justify-between items-center text-[14px]">
              <span className="text-slate-500">{label}</span>
              <span className="flex items-center gap-2">
                <span className="text-slate-400 line-through">₹{formatAmount(amount)}</span>
                <span className="text-[#00bd6f] font-semibold text-[13px]">Waived</span>
              </span>
            </div>
          ))}
          <div className="flex justify-between items-center text-[15px] font-bold text-slate-900 pt-2 border-t border-slate-200 border-dashed">
            <span>Total savings</span>
            <span className="text-[#00bd6f]">₹{formatAmount(savings)}</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 leading-snug mb-5">
         Tax Included: We pay all applicable GST on your behalf. All listed prices are inclusive of tax, so your order total will not change at checkout.
        </p>

        {applied ? (
          <button
            onClick={onRemove}
            className="w-full h-[52px] bg-rose-50 text-rose-600 rounded-xl font-bold text-[15px] active:scale-[0.98] transition-transform"
          >
            Remove Offer
          </button>
        ) : (
          <button
            onClick={onApply}
            className="w-full h-[52px] bg-green-600 text-white rounded-xl font-bold text-[15px] active:scale-[0.98] transition-transform shadow-sm"
          >
            Apply Offer
          </button>
        )}
      </div>
    </div>
  );
};
