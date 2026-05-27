import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Info,
  TrendingUp,
  History,
  AlertCircle,
  HelpCircle as HelpIcon,
  ShieldCheck,
  Ticket,
  CheckCircle2,
  ChevronDown,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  HelpCircle,
  PartyPopper,
  Sparkles,
  X,
  Wallet
} from 'lucide-react';

interface WalletViewProps {
  onBack: () => void;
  isTabMode?: boolean;
}

type TransactionTab = 'All' | 'Earned' | 'Used' | 'Expired';

export const WalletView: React.FC<WalletViewProps> = ({ onBack, isTabMode = false }) => {
  const [activeTab, setActiveTab] = useState<TransactionTab>('All');
  const [promoCode, setPromoCode] = useState('');
  const [promoStatus, setPromoStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const transactions = [
    { id: 1, title: 'Promotional Crevings Credit', date: '13 Dec, 09:00 PM', amount: 250, type: 'credit', status: 'Success' },
    { id: 2, title: 'Crevings cash expired', date: '13 Dec, 03:16 AM', amount: 250, type: 'expired', status: 'Expired' },
    { id: 3, title: 'Promotional Crevings Credit', date: '28 Nov, 09:51 PM', amount: 250, type: 'credit', status: 'Success' },
    { id: 4, title: 'Crevings cash expired', date: '28 Nov, 03:45 AM', amount: 250, type: 'expired', status: 'Expired' },
  ];

  const faqs = [
    { q: "What is Crevings Wallet?", a: "Crevings Wallet is our exclusive reward currency that you earn on every bill payment. You can use it to get instant discounts on your future orders." },
    { q: "When does my Wallet balance expire?", a: "Promotional balance typically expires within 7-14 days. You can check the expiry date of specific credits in your transaction history." },
    { q: "How much Wallet balance can I use per order?", a: "You can use up to 50% of your available balance on any single order, subject to restaurant-specific terms." },
    { q: "Is Wallet balance transferable?", a: "No, the balance is linked to your account and cannot be transferred to other users or redeemed for physical cash." }
  ];

  const handleRedeem = () => {
    if (promoCode.toUpperCase() === 'CREV50') {
      setPromoStatus('valid');
      setShowSuccessPopup(true);
    } else {
      setPromoStatus('invalid');
    }
  };

  useEffect(() => {
    if (showSuccessPopup) {
      const timer = setTimeout(() => {
        setShowSuccessPopup(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessPopup]);

  const StepItem = ({ index, title, desc }: { index: number, title: string, desc: string }) => (
    <div className="flex gap-4 relative z-10">
      <div className="w-10 h-10 rounded-full bg-[#00bd6f]/10 text-[#00bd6f] flex items-center justify-center font-bold shrink-0 border border-[#00bd6f]/20">
        {index}
      </div>
      <div>
        <h4 className="font-bold text-slate-900 mb-1">{title}</h4>
        <p className="text-sm text-slate-500">{desc}</p>
      </div>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans relative overflow-x-hidden pb-10">
      
      {/* Header Section */}
      <div className="bg-white pt-6 pb-6 px-5 sticky top-0 z-20 border-b border-slate-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-700 active:scale-95 transition-transform"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-bold text-xl text-slate-900">Wallet</h1>
          </div>
          <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-700 active:scale-95 transition-transform">
            <HelpIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="px-5 py-6 space-y-6">
        
        {/* Balance Display */}
        <div className="bg-white rounded-[24px] p-6 border border-slate-100 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 bg-[#00bd6f]/10 px-3 py-1.5 rounded-full mb-4">
            <Wallet className="w-4 h-4 text-[#00bd6f]" />
            <span className="text-[#00bd6f] text-xs font-bold uppercase tracking-wider">Available Balance</span>
          </div>
          <div className="flex items-center justify-center text-slate-900">
            <span className="text-4xl font-bold mr-1 opacity-50 mt-1">₹</span>
            <h1 className="text-6xl font-bold tracking-tight">
              {promoStatus === 'valid' ? '300' : '250'}
            </h1>
          </div>
          <div className="mt-4 flex items-center gap-2 text-slate-500 text-sm font-medium">
            <TrendingUp className="w-4 h-4 text-[#00bd6f]" />
            <span>Worth ₹{promoStatus === 'valid' ? '300.00' : '250.00'} in your next order</span>
          </div>
        </div>

        {/* Redeem Code Section */}
        <div className="bg-white rounded-[24px] p-6 border border-slate-100">
           <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-slate-50 rounded-[16px] flex items-center justify-center text-slate-700">
                <Ticket className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Redeem Voucher</h3>
           </div>
           
           <div className="space-y-3">
              <div className="relative flex items-center">
                <input 
                  type="text" 
                  value={promoCode}
                  onChange={(e) => {
                    setPromoCode(e.target.value.toUpperCase());
                    setPromoStatus('idle');
                  }}
                  disabled={promoStatus === 'valid'}
                  placeholder="Enter Voucher Code"
                  className={`w-full bg-slate-50 border rounded-[16px] py-3.5 px-4 text-sm font-bold uppercase tracking-wider focus:outline-none transition-all ${
                    promoStatus === 'invalid' ? 'border-red-300 focus:border-red-400' : 
                    promoStatus === 'valid' ? 'border-[#00bd6f] bg-[#00bd6f]/5 text-[#00bd6f]' : 
                    'border-slate-200 focus:border-[#00bd6f]'
                  }`}
                />
                <button 
                  onClick={handleRedeem}
                  disabled={!promoCode || promoStatus === 'valid'}
                  className={`absolute right-2 px-4 py-2 rounded-[12px] text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 active:scale-95 ${
                    promoStatus === 'valid' ? 'bg-[#00bd6f] text-white' : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  {promoStatus === 'valid' ? 'Redeemed' : 'Redeem'}
                </button>
              </div>
              
              {promoStatus === 'invalid' && (
                <p className="text-xs font-medium text-red-500 flex items-center gap-1 ml-1 animate-fadeInUp">
                  <AlertCircle className="w-4 h-4" /> Invalid or expired voucher code.
                </p>
              )}

              {promoStatus !== 'valid' && (
                <p className="text-xs font-medium text-slate-500 ml-1">Use code <span className="text-slate-900 font-bold">CREV50</span> for demo validation</p>
              )}
           </div>
        </div>

        {/* How it Works Visual Timeline */}
        <div className="bg-white rounded-[24px] p-6 border border-slate-100">
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">How to use</h3>
              <div className="bg-slate-50 text-slate-500 p-2 rounded-full">
                <Info className="w-5 h-5" />
              </div>
           </div>
           
           <div className="grid grid-cols-1 gap-6 relative">
              <div className="absolute left-[19px] top-6 bottom-6 w-0.5 bg-slate-100"></div>

              <StepItem 
                index={1} 
                title="Dine & Pay" 
                desc="Pay your bill via the app at any partner restaurant." 
              />
              <StepItem 
                index={2} 
                title="Earn Balance" 
                desc="Get instant 10% cashback back in your wallet." 
              />
              <StepItem 
                index={3} 
                title="Redeem Savings" 
                desc="Apply balance on your next meal for instant discounts." 
              />
           </div>
        </div>

        {/* Activity History */}
        <div className="bg-white rounded-[24px] border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-50 rounded-[16px] flex items-center justify-center text-slate-700">
                <History className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Activity History</h3>
            </div>
            
            <div className="flex border-b border-slate-100 bg-slate-50/50 px-2">
                {(['All', 'Earned', 'Used', 'Expired'] as TransactionTab[]).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-3 text-xs font-bold transition-all uppercase tracking-wider relative ${
                            activeTab === tab 
                            ? 'text-[#00bd6f]' 
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        {tab}
                        {activeTab === tab && (
                          <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#00bd6f] rounded-t-full"></div>
                        )}
                    </button>
                ))}
            </div>

            <div className="divide-y divide-slate-100">
                {transactions.map(t => (
                    <div key={t.id} className="p-5 flex justify-between items-center bg-white hover:bg-slate-50/50 transition-colors">
                        <div className="flex gap-4 items-center">
                            <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center shrink-0 ${
                                t.type === 'credit' ? 'bg-[#00bd6f]/10 text-[#00bd6f]' : 'bg-slate-100 text-slate-500'
                            }`}>
                                {t.type === 'credit' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm mb-1">{t.title}</h4>
                                <div className="flex items-center gap-2">
                                  <p className="text-xs text-slate-500 font-medium">{t.date}</p>
                                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                  <p className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                                      t.status === 'Success' 
                                      ? 'text-[#00bd6f] bg-[#00bd6f]/10' 
                                      : 'text-slate-500 bg-slate-100'
                                  }`}>
                                      {t.status}
                                  </p>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className={`text-lg font-bold ${t.type === 'credit' ? 'text-[#00bd6f]' : 'text-slate-900'}`}>
                                {t.type === 'credit' ? '+' : '-'} ₹{t.amount}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-[24px] border border-slate-100 overflow-hidden mb-10">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-50 rounded-[16px] flex items-center justify-center text-slate-700">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">FAQ & Support</h3>
            </div>

            <div className="divide-y divide-slate-100">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-white transition-all">
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-5 flex items-center justify-between text-left group"
                  >
                    <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors pr-4">{faq.q}</span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${openFaq === idx ? 'bg-slate-100 text-slate-900 rotate-180' : 'bg-slate-50 text-slate-400'}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>
                  {openFaq === idx && (
                    <div className="px-5 pb-5 text-sm text-slate-500 leading-relaxed animate-fadeInUp">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowSuccessPopup(false)}></div>
          <div className="bg-white rounded-[24px] p-8 w-full max-w-sm relative z-10 animate-[fadeInUp_0.3s_ease-out] text-center shadow-xl">
            <button 
              onClick={() => setShowSuccessPopup(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="w-20 h-20 bg-[#00bd6f]/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
              <PartyPopper className="w-10 h-10 text-[#00bd6f]" />
              <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
            </div>
            
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Voucher Applied!</h2>
            <p className="text-slate-500 text-sm mb-6">
              ₹50 has been added to your wallet balance.
            </p>
            
            <button 
              onClick={() => setShowSuccessPopup(false)}
              className="w-full py-4 bg-[#00bd6f] text-white rounded-[16px] font-bold text-sm active:scale-95 transition-transform"
            >
              Awesome
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
