import React, { useState } from 'react';
import { ArrowLeft, Copy, Share2, Gift, CheckCircle2, ChevronRight, Users, Wallet } from 'lucide-react';

interface ReferEarnViewProps {
  onBack: () => void;
}

export const ReferEarnView: React.FC<ReferEarnViewProps> = ({ onBack }) => {
  const [copied, setCopied] = useState(false);
  const referralCode = "CREVINGS2024";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join Crevings App',
        text: `Use my code ${referralCode} to get ₹500 off on your first order!`,
        url: 'https://foodie.app/invite',
      }).catch(console.error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 animate-[slideUp_0.3s_ease-out] flex flex-col">
      <div className="px-5 py-6 flex items-center gap-4 bg-white sticky top-0 z-10 border-b border-slate-100">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-bold text-xl text-slate-900">Refer & Earn</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="bg-white p-6 pb-10 rounded-b-[2.5rem] shadow-sm border-b border-slate-100 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-50/50 to-white -z-10"></div>
            <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mb-6 relative">
                <Gift className="w-16 h-16 text-blue-600" />
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-slate-900 text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                    ₹500 FREE
                </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Refer Friends & Earn</h2>
            <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
                Invite your friends to Crevings. They get <span className="font-bold text-slate-700">₹150 off</span> their first order, and you get <span className="font-bold text-blue-600">₹500</span> in your wallet!
            </p>
        </div>

        <div className="px-6 -mt-6 relative z-10">
            <div className="bg-white rounded-2xl p-5 shadow-xl shadow-slate-200/60 border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center mb-3">Your Referral Code</p>
                <div className="flex items-center gap-2 bg-slate-50 border border-dashed border-slate-300 rounded-xl p-2 pl-4">
                    <span className="flex-1 text-lg font-mono font-bold text-slate-800 tracking-widest text-center">
                        {referralCode}
                    </span>
                    <button 
                        onClick={handleCopy}
                        className={`p-2.5 rounded-lg transition-all ${copied ? 'bg-blue-500 text-white' : 'bg-white text-slate-600 shadow-sm border border-slate-200'}`}
                    >
                        {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </div>

        <div className="p-6">
            <h3 className="font-bold text-slate-900 text-lg mb-6">How it works</h3>
            <div className="space-y-6 relative">
                <div className="absolute left-[19px] top-2 bottom-4 w-0.5 bg-slate-200 -z-10"></div>
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 ring-4 ring-white">
                        <Share2 className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-sm">Invite your friends</h4>
                        <p className="text-xs text-slate-500 mt-1">Share your code via WhatsApp or SMS.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0 ring-4 ring-white">
                        <Users className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-sm">They place an order</h4>
                        <p className="text-xs text-slate-500 mt-1">Your friend signs up and orders.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 ring-4 ring-white">
                        <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-sm">You get ₹500</h4>
                        <p className="text-xs text-slate-500 mt-1">Cashback is instantly credited.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="p-6 bg-white border-t border-slate-100 sticky bottom-0 z-10">
          <button 
            onClick={handleShare}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
              <Share2 className="w-5 h-5" />
              Invite Friends
          </button>
      </div>
    </div>
  );
};