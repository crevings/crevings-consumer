
import React from 'react';
import { ChevronLeft, Store, MessageCircle, ShieldCheck, FileText } from 'lucide-react';

interface DataSharingViewProps {
  onBack: () => void;
}

export const DataSharingView: React.FC<DataSharingViewProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-[#f4f5f7] font-sans animate-[fadeInUp_0.3s_ease-out] flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center gap-3 sticky top-0 z-20 shadow-sm border-b border-slate-100">
        <button onClick={onBack} className="p-2 -ml-2 bg-white rounded-full active:scale-95 transition-transform">
          <ChevronLeft className="w-6 h-6 text-slate-800" />
        </button>
        <h1 className="text-lg font-bold text-slate-900">Data Sharing</h1>
      </div>

      <div className="flex-1 p-4 flex flex-col">
        {/* Hero Section */}
        <div className="bg-white rounded-[24px] p-8 mb-6 flex flex-col items-center text-center border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00bd6f]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative mb-6">
                <div className="w-20 h-20 bg-slate-50 rounded-[20px] flex items-center justify-center shadow-sm border border-slate-100">
                    <Store className="w-10 h-10 text-slate-700" />
                </div>
                <div className="absolute -top-2 -right-2 w-10 h-10 bg-[#00bd6f] rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                    <MessageCircle className="w-5 h-5 text-white" />
                </div>
            </div>

            <h2 className="text-lg font-bold text-slate-900 mb-2 leading-tight">
                Share your phone number with restaurants?
            </h2>
            <p className="text-slate-500 text-sm font-medium">
                Enable this to receive exclusive offers and updates directly from the restaurants you order from.
            </p>
        </div>

        {/* Info Points */}
        <div className="bg-white rounded-[24px] p-6 space-y-6 mb-6 flex-1 shadow-sm border border-slate-100">
            <div className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-slate-300 mt-2 shrink-0"></div>
                <p className="text-slate-600 text-sm leading-relaxed font-medium">
                    You can <span className="font-bold text-slate-800">withdraw this consent anytime</span>. If you do, your phone number will not be shared on any future orders.
                </p>
            </div>
            <div className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-slate-300 mt-2 shrink-0"></div>
                <p className="text-slate-600 text-sm leading-relaxed font-medium">
                    By consenting, you agree to the <span className="underline decoration-slate-300 underline-offset-2 font-bold text-slate-800">T&C</span> and <span className="underline decoration-slate-300 underline-offset-2 font-bold text-slate-800">Privacy Policy</span> regarding data sharing.
                </p>
            </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 mt-auto pb-4">
            <button 
                onClick={onBack}
                className="w-full py-4 rounded-[16px] bg-[#00bd6f] text-white font-bold text-sm active:scale-95 transition-transform"
            >
                Share my phone number
            </button>
            <button 
                onClick={onBack}
                className="w-full py-4 rounded-[16px] bg-white border border-slate-200 text-slate-700 font-bold text-sm active:scale-95 transition-transform"
            >
                Do not share my phone number
            </button>
        </div>
      </div>
    </div>
  );
};
