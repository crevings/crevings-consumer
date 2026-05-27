import React from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface OrderSortBottomSheetProps {
  onClose: () => void;
  onSelect: (mode: string) => void;
  currentSort: string;
}

const SORT_OPTIONS = [
  { id: 'date-desc', label: 'Newest First' },
  { id: 'date-asc', label: 'Oldest First' },
  { id: 'amount-desc', label: 'Amount: High to Low' },
  { id: 'amount-asc', label: 'Amount: Low to High' }
];

export const OrderSortBottomSheet: React.FC<OrderSortBottomSheetProps> = ({ onClose, onSelect, currentSort }) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 z-[100]"
      />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[110] overflow-hidden flex flex-col max-h-[80vh] w-full max-w-md mx-auto"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-lg font-semibold text-slate-900">Sort by</h2>
          <button 
            onClick={onClose} 
            className="p-2 bg-slate-50 rounded-full text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="p-4 overflow-y-auto">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onSelect(opt.id)}
              className="w-full flex items-center justify-between p-4 border-b border-slate-50 last:border-0 active:bg-slate-50 transition-colors"
            >
              <div className="flex flex-col items-start">
                <span className={`text-base font-bold ${currentSort === opt.id ? 'text-blue-600' : 'text-slate-900'}`}>
                  {opt.label}
                </span>
              </div>
              {currentSort === opt.id && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
            </button>
          ))}
        </div>
      </motion.div>
    </>
  );
};
