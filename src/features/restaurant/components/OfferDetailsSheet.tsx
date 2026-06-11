import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Percent, CheckCircle2, Info } from 'lucide-react';

interface Offer {
  title: string;
  subtitle: string;
  code: string;
}

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
  return (
    <AnimatePresence>
      {selectedOffer && (
        <>
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
              {/* SVG Pattern Background */}
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
                <h2 className="text-[24px] font-black text-white leading-tight mb-2 pr-8">{selectedOffer.title}</h2>
                <p className="text-[15px] font-medium text-white/90">{selectedOffer.subtitle}</p>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto -mt-6 bg-white rounded-t-3xl relative z-20">
              {selectedOffer.code ? (
                <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-4 mb-8 flex items-center justify-between relative">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Coupon Code</span>
                    <span className="text-[18px] font-black text-slate-900 tracking-wider font-mono">{selectedOffer.code}</span>
                  </div>
                  <button 
                    onClick={() => handleCopyCode(selectedOffer.code || '')}
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
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00bd6f] shrink-0 mt-2" />
                  <span className="text-[14px] text-slate-600 leading-snug">Valid on all payment methods including UPI, Credit Cards, and Wallets.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00bd6f] shrink-0 mt-2" />
                  <span className="text-[14px] text-slate-600 leading-snug">Applicable once per user per day during the promotional period.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0 mt-2" />
                  <span className="text-[14px] text-slate-500 leading-snug">Cannot be combined with other active restaurant offers or promo codes.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0 mt-2" />
                  <span className="text-[14px] text-slate-500 leading-snug">Restaurant partner reserves the right to modify or withdraw the offer at any time without prior notice.</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
