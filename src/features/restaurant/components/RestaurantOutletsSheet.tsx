import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2 } from 'lucide-react';

interface RestaurantOutletsSheetProps {
  isOutletsOpen: boolean;
  setIsOutletsOpen: (open: boolean) => void;
  selectedOutlet: string;
  setSelectedOutlet: (outlet: string) => void;
}

export const RestaurantOutletsSheet: React.FC<RestaurantOutletsSheetProps> = ({
  isOutletsOpen,
  setIsOutletsOpen,
  selectedOutlet,
  setSelectedOutlet
}) => {
  const outlets = ['Koramangala', 'Indiranagar', 'HSR Layout', 'Jayanagar', 'Whitefield'];

  return (
    <AnimatePresence>
      {isOutletsOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOutletsOpen(false)}
            className="fixed inset-0 bg-black/60 z-[60]"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[70] overflow-hidden flex flex-col max-h-[80vh] pb-safe"
          >
            <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-lg font-bold text-slate-900">Select Outlet</h2>
              <button onClick={() => setIsOutletsOpen(false)} className="p-2 bg-slate-50 rounded-full text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              {outlets.map(outlet => (
                <button
                  key={outlet}
                  onClick={() => {
                    setSelectedOutlet(outlet);
                    setIsOutletsOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-4 border-b border-slate-50 last:border-0 active:bg-slate-50 transition-colors"
                >
                  <div className="flex flex-col items-start">
                    <span className={`text-base font-bold ${selectedOutlet === outlet ? 'text-blue-600' : 'text-slate-900'}`}>{outlet}</span>
                                      </div>
                  {selectedOutlet === outlet && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
