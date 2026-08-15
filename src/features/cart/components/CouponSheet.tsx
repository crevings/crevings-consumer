import { X, Search, ChevronRight, Loader2, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Offer } from "@/types";
import { formatINR } from "@/utils/currency";
import { buildOfferTerms } from "@/utils/offerTerms";
import { AppliedCoupon } from "@/features/cart/hooks/useCoupon";

interface CouponSheetProps {
  open: boolean;
  onClose: () => void;
  offers: Offer[];
  orderType: "Delivery" | "Takeaway";
  appliedCoupon: AppliedCoupon | null;
  onApply: (code: string) => void;
  onRemove: () => void;
  couponError: string;
  isValidating: boolean;
  selectedDetails: string | null;
  onToggleDetails: (offerId: string | null) => void;
}

/**
 * Bottom sheet listing the restaurant's available offers with apply/remove.
 */
export const CouponSheet: React.FC<CouponSheetProps> = ({
  open,
  onClose,
  offers,
  orderType,
  appliedCoupon,
  onApply,
  onRemove,
  couponError,
  isValidating,
  selectedDetails,
  onToggleDetails,
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full bg-white rounded-t-[24px] p-6 animate-in slide-in-from-bottom-full duration-300 max-h-[85vh] overflow-y-auto no-scrollbar flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4 sticky top-0 bg-white z-10 pb-2">
          <h3 className="text-[18px] font-bold text-slate-900">Available Offers</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-slate-400 bg-slate-100 rounded-full"
          >
            <X size={18} />
          </button>
        </div>

        <div className="relative mb-5">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search offers..."
            className="w-full h-[44px] bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 text-[14px] focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
          />
        </div>

        <div className="space-y-4 flex-1">
          {couponError && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[13px] font-medium">
              {couponError}
            </div>
          )}

          {!offers || offers.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm font-medium">
              No coupons available for this restaurant.
            </div>
          ) : (
            offers.map((offer) => {
              const isApplied = appliedCoupon?.code === offer.offerId;
              let title = offer.name;
              let desc = "";
              const terms = buildOfferTerms(offer);

              if (offer.offerType === "percentage") {
                title = `${offer.discountPercent}% OFF`;
                desc = offer.maxCap
                  ? `Get ${offer.discountPercent}% off up to ${formatINR(offer.maxCap)}`
                  : `Get ${offer.discountPercent}% off on your order`;
              } else if (offer.offerType === "flat") {
                title = `Flat ${formatINR(offer.discountAmount)} OFF`;
                desc = `Flat ${formatINR(offer.discountAmount)} off on orders above ${formatINR(offer.minOrder || 0)}`;
              } else if (offer.offerType === "bogo") {
                title = "BUY 1 GET 1";
                desc = "Buy 1 get 1 free on selected items";
              } else if (offer.offerType === "free_item") {
                title = `FREE ${offer.freeItemName}`;
                desc = `Get a free ${offer.freeItemName} on orders above ${formatINR(offer.minOrder || 0)}`;
              }

              const typeKey = orderType.toLowerCase() as "delivery" | "takeaway";
              const isTypeSupported = offer.orderTypes[typeKey] !== false;

              return (
                <div
                  key={offer.offerId}
                  className={`border-2 border-dashed rounded-2xl p-4 relative overflow-hidden transition-all duration-300 ${
                    isApplied
                      ? "border-green-500 bg-green-50"
                      : !isTypeSupported
                        ? "border-slate-200 bg-slate-50 opacity-70"
                        : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center flex-wrap gap-2 mb-2">
                        <span
                          className={`inline-block px-2.5 py-1 text-[11px] font-black uppercase tracking-wider rounded border ${
                            isApplied
                              ? "bg-green-100 text-green-700 border-green-200"
                              : "bg-slate-100 text-slate-700 border-slate-200"
                          }`}
                        >
                          {offer.offerId}
                        </span>
                        {!isTypeSupported && (
                          <span className="inline-block px-2 py-0.5 text-[10px] font-bold text-amber-700 bg-amber-100 border border-amber-200 rounded">
                            Not applicable for {orderType}
                          </span>
                        )}
                      </div>
                      <h4 className={`text-[15px] font-bold ${!isTypeSupported ? "text-slate-500" : "text-slate-900"}`}>
                        {title}
                      </h4>
                    </div>
                    {isApplied ? (
                      <button
                        onClick={onRemove}
                        className="text-[13px] font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg active:scale-95 transition-transform"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        onClick={() => onApply(offer.offerId)}
                        disabled={isValidating || !isTypeSupported}
                        className={`text-[13px] font-bold px-3 py-1.5 rounded-lg active:scale-95 transition-transform flex items-center gap-1 ${
                          !isTypeSupported
                            ? "text-slate-400 bg-slate-200 cursor-not-allowed"
                            : "text-green-600 bg-green-100"
                        }`}
                      >
                        {isValidating ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                        Apply
                      </button>
                    )}
                  </div>
                  <p className="text-[13px] text-slate-600 mb-3 leading-relaxed">{desc}</p>

                  <div className={`border-t pt-3 mt-3 ${isApplied ? "border-green-200" : "border-slate-100"}`}>
                    <button
                      onClick={() => onToggleDetails(selectedDetails === offer.offerId ? null : offer.offerId)}
                      className="text-[12px] font-semibold text-green-600 flex items-center gap-1 active:scale-95 transition-transform"
                    >
                      View Details{" "}
                      <ChevronRight
                        size={14}
                        className={`transition-transform ${selectedDetails === offer.offerId ? "rotate-90" : ""}`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {selectedDetails === offer.offerId && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div
                            className={`mt-3 p-3 bg-white rounded-xl text-[12px] text-slate-600 leading-relaxed border ${
                              isApplied ? "border-green-200" : "border-slate-100"
                            }`}
                          >
                            <span className="font-semibold block mb-2 text-slate-900">Terms & Conditions:</span>
                            {terms.length > 0 ? (
                              <ul className="space-y-1.5">
                                {terms.map((term, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <span className="w-4 h-4 rounded-full bg-green-100 text-green-600 shrink-0 mt-0.5 flex items-center justify-center">
                                      <Check size={10} strokeWidth={3} />
                                    </span>
                                    <span>{term}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <span>No additional terms.</span>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
