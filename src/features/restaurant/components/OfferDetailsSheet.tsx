import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Percent, CheckCircle2, Info } from 'lucide-react';
import { Offer } from "@/types";
import { formatINR } from "@/utils/currency";

interface OfferDetailsSheetProps {
  selectedOffer: Offer | null;
  setSelectedOffer: (offer: Offer | null) => void;
  handleCopyCode: (code: string) => void;
  isCopied: boolean;
}

export const OfferDetailsSheet: React.FC<OfferDetailsSheetProps> = ({
  selectedOffer,
  setSelectedOffer,
  handleCopyCode,
  isCopied
}) => {
  if (!selectedOffer) return null;

  let title = selectedOffer.name;
  let subtitle = selectedOffer.description || "";
  let code = selectedOffer.offerId;
  const minOrder = selectedOffer.minOrder || 0;

  if (selectedOffer.offerType === 'percentage') {
    title = `${selectedOffer.discountPercent}% OFF`;
    subtitle = selectedOffer.maxCap 
      ? `Upto ${formatINR(selectedOffer.maxCap)} | Min order ${formatINR(minOrder)}` 
      : `On all orders | Min order ${formatINR(minOrder)}`;
  } else if (selectedOffer.offerType === 'flat') {
    title = `Flat ${formatINR(selectedOffer.discountAmount)} OFF`;
    subtitle = `On orders above ${formatINR(minOrder)}`;
  } else if (selectedOffer.offerType === 'bogo') {
    title = "BUY 1 GET 1";
    subtitle = "BOGO on selected items";
  } else if (selectedOffer.offerType === 'free_item') {
    title = `FREE ${selectedOffer.freeItemName}`;
    subtitle = `On orders above ${formatINR(minOrder)}`;
  }

  // Generate dynamic terms and conditions
  const terms: string[] = [];
  if (minOrder > 0) {
    terms.push(`Minimum order value to qualify is ${formatINR(minOrder)}.`);
  }
  if (selectedOffer.offerType === 'percentage' && selectedOffer.maxCap) {
    terms.push(`Maximum discount is capped at ${formatINR(selectedOffer.maxCap)}.`);
  }
  if (selectedOffer.applicableScope === 'category') {
    terms.push(`Applicable only on items from categories: ${selectedOffer.applicableIds.join(', ')}.`);
  } else if (selectedOffer.applicableScope === 'items') {
    terms.push(`Applicable only on specific selected items.`);
  } else {
    terms.push(`Applicable across all items on the menu.`);
  }
  if (selectedOffer.paymentMode === 'prepaid') {
    terms.push(`Valid only on online prepaid payment options.`);
  } else {
    terms.push(`Valid on all payment methods including UPI, Card, and Cash on Delivery.`);
  }
  if (!selectedOffer.allowClubbing) {
    terms.push(`Cannot be combined with other active restaurant offers or promo codes.`);
  }
  terms.push(`Applicable once per user during the campaign validity.`);

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
        onClick={() => setSelectedOffer(null)}
      />
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[70] pb-8 overflow-hidden max-h-[85vh] flex flex-col"
      >
        <div className="bg-[#00bd6f] p-6 pt-8 pb-10 relative shrink-0">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '12px 12px' }}></div>
          <button 
            onClick={() => setSelectedOffer(null)}
            className="absolute top-4 right-4 w-8 h-8 bg-black/10 hover:bg-black/20 rounded-full flex items-center justify-center text-white transition-colors active:scale-95 z-30"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm">
              <Percent className="w-6 h-6 text-[#00bd6f]" />
            </div>
            <h2 className="text-[24px] font-bold text-white leading-tight mb-2 pr-8">{title}</h2>
            <p className="text-[15px] font-medium text-white/90">{subtitle}</p>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto -mt-6 bg-white rounded-t-3xl relative z-20">
          {code ? (
            <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-4 mb-8 flex items-center justify-between relative">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Coupon Code</span>
                <span className="text-[18px] font-semibold text-slate-900 tracking-wider font-mono">{code}</span>
              </div>
              <button 
                onClick={() => handleCopyCode(code)}
                className="bg-[#00bd6f] text-white px-5 py-2.5 rounded-xl font-bold text-[14px] shadow-sm active:scale-95 transition-all"
              >
                {isCopied ? 'COPIED' : 'COPY'}
              </button>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mb-8 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#00bd6f] shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span className="text-[15px] font-bold text-slate-900 mb-0.5">Offer auto-applied</span>
                <p className="text-[13px] text-slate-600 font-medium leading-snug">No coupon code required. The discount will be applied automatically at checkout.</p>
              </div>
            </div>
          )}
          
          <h3 className="text-[16px] font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Info className="w-4 h-4 text-slate-400" /> Terms & Conditions
          </h3>
          <ul className="space-y-4">
            {terms.map((term, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00bd6f] shrink-0 mt-2" />
                <span className="text-[14px] text-slate-600 leading-snug">{term}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
