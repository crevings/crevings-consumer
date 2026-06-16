import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface WalletViewProps {
  onBack: () => void;
  isTabMode?: boolean;
}

export const WalletView: React.FC<WalletViewProps> = ({ onBack, isTabMode = false }) => {
  return (
    <div className="bg-white min-h-screen flex flex-col font-sans">
      {/* Header Section */}
      <div className="bg-white pt-6 pb-6 px-5 sticky top-0 z-20 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-700 active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-xl text-slate-900">Wallet</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <h2 className="text-2xl font-bold text-slate-950 mb-2">Crevings Wallet</h2>
        <p className="text-slate-500 text-base font-medium">Coming Soon</p>
      </div>
    </div>
  );
};
