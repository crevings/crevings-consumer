
import React from 'react';
import { X, Heart, EyeOff, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface ConfirmationBottomSheetProps {
  type: 'favourite' | 'hide';
  restaurantName: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmationBottomSheet: React.FC<ConfirmationBottomSheetProps> = ({ 
  type, 
  restaurantName, 
  onConfirm, 
  onClose 
}) => {
  const isFav = type === 'favourite';
  const Icon = isFav ? Heart : EyeOff;
  const colorClass = isFav ? 'text-rose-500 bg-rose-50' : 'text-slate-400 bg-slate-50';
  const btnClass = isFav ? 'bg-rose-500 hover:bg-rose-600' : 'bg-slate-900 hover:bg-slate-800';

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
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] z-[110] overflow-hidden flex flex-col w-full  mx-auto shadow-2xl pb-safe"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <h2 className="text-sm font-bold text-slate-900">Confirm Action</h2>
          <button 
            onClick={onClose} 
            className="p-1.5 bg-slate-50 rounded-full text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 flex flex-col items-center text-center">
            <div className={`w-16 h-16 rounded-2xl ${colorClass} flex items-center justify-center mb-4`}>
                <Icon className="w-8 h-8" strokeWidth={2.5} />
            </div>
            
            <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight leading-tight">
                {isFav ? 'Add to Favourites?' : 'Hide Restaurant?'}
            </h3>
            <p className="text-slate-500 text-sm mb-8 px-4 leading-relaxed font-medium">
                {isFav 
                  ? `Are you sure you want to add ${restaurantName} to your favourites? You can view it later in your profile.`
                  : `Are you sure you want to hide ${restaurantName}? It will no longer appear in your feed but can be managed in profile settings.`}
            </p>
            
            <div className="flex gap-3 w-full mb-2">
                <button 
                    onClick={onClose}
                    className="flex-1 py-4 rounded-2xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all text-sm"
                >
                    Cancel
                </button>
                <button 
                    onClick={onConfirm}
                    className={`flex-1 py-4 rounded-2xl font-bold text-white ${btnClass} active:scale-95 transition-all shadow-lg flex items-center justify-center gap-1.5 text-sm`}
                >
                    {isFav ? 'Add' : 'Hide'}
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
      </motion.div>
    </>
  );
};
