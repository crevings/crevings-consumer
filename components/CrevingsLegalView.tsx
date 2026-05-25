import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Scale, Zap, Sparkles, X, ChevronRight } from 'lucide-react';

interface CrevingsLegalViewProps {
  onBack: () => void;
}

export const CrevingsLegalView: React.FC<CrevingsLegalViewProps> = ({ onBack }) => {
  const [selectedPackage, setSelectedPackage] = useState(1); // Default to 'Brand Protection'

  const packages = [
    {
      title: 'Basic Registration',
      price: '₹1,999',
      duration: 'One-time',
      description: 'Get your restaurant compliant and legally established.',
      popular: false,
      included: [
        'Solo Proprietorship Registration',
        'MSME Registration',
        'FSSAI License (Apply/Renewal)',
        'GST Registration'
      ],
      notIncluded: [
        'File Trademark',
        'Pvt Ltd Registration',
        'LLP Registration'
      ]
    },
    {
      title: 'Brand Protection',
      price: '₹9,999',
      duration: 'One-time',
      description: 'Essential for ambitious brands looking to scale securely.',
      popular: true,
      included: [
        'File Trademark',
        'FSSAI License (Apply/Renewal)',
        'MSME Registration',
        'GST Registration'
      ],
      notIncluded: [
        'Pvt Ltd Registration',
        'LLP Registration'
      ]
    },
    {
      title: 'Corporate Setup',
      price: '₹19,999',
      duration: 'One-time',
      description: 'Complete legal framework for multi-outlet restaurants.',
      popular: false,
      included: [
        'Pvt Ltd or LLP Registration',
        'File Trademark',
        'FSSAI License (Apply/Renewal)',
        'GST & MSME Registration'
      ],
      notIncluded: []
    }
  ];

  return (
    <div className="fixed inset-0 z-[600] bg-[#F8FAFC] flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <div className="bg-[#FFFFFF] px-4 pt-6 pb-4 flex items-center justify-between shrink-0 shadow-sm relative z-20">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center transition-colors active:scale-95"
          >
            <ArrowLeft size={22} className="text-slate-700" />
          </button>
          <h1 className="text-[19px] font-bold text-slate-900 tracking-tight">Crevings Legal</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {/* Banner */}
        <div className="px-6 pt-8 pb-8 relative overflow-hidden flex flex-col text-center border-b border-slate-100 bg-[#FFFFFF]">
          <div className="absolute top-0 right-0 w-40 h-40 bg-teal-100/50 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-100/50 rounded-full blur-3xl -ml-16 -mb-16"></div>
          
          <div className="w-16 h-16 bg-gradient-to-tr from-teal-600 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/20 transform -rotate-3">
            <Scale size={32} className="text-white transform rotate-3" />
          </div>
          <h2 className="text-[28px] font-black text-slate-900 leading-tight mb-3 tracking-tight relative z-10">Legal Simplified</h2>
          <p className="text-[15px] font-medium text-slate-500 max-w-sm mx-auto relative z-10 leading-relaxed">
            FSSAI, Trademarks, and Registrations handled entirely by our experts off your plate.
          </p>
        </div>

        <div className="py-6 px-4 max-w-md mx-auto space-y-6">
          {/* Package Selection */}
          <div>
            <h3 className="text-[15px] font-bold text-slate-900 mb-3 tracking-tight">Select Package</h3>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
              {packages.map((pkg, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedPackage(idx)}
                  className={`min-w-[140px] flex-shrink-0 p-4 rounded-[16px] text-left border transition-all ${
                    selectedPackage === idx 
                      ? 'bg-emerald-50 border-emerald-500 shadow-sm' 
                      : 'bg-[#FFFFFF] border-slate-200 active:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                      selectedPackage === idx ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'
                    }`}>
                      {selectedPackage === idx && <CheckCircle2 size={12} strokeWidth={3} />}
                    </div>
                    {pkg.popular && (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                        POPULAR
                      </span>
                    )}
                  </div>
                  <h4 className={`text-[15px] font-bold mb-0.5 ${selectedPackage === idx ? 'text-emerald-600' : 'text-slate-900'}`}>{pkg.price}</h4>
                  <p className="text-[12px] font-medium text-slate-600">{pkg.title}</p>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{pkg.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Package Details */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h3 className="text-[15px] font-bold text-slate-900 mb-3 tracking-tight">Package Details</h3>
            <div className="bg-[#FFFFFF] rounded-[20px] border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-[18px] font-bold text-slate-900">{packages[selectedPackage].title}</h3>
                    <p className="text-[13px] text-slate-500 font-medium">{packages[selectedPackage].description}</p>
                  </div>
                </div>
                <div className="flex items-end gap-1 mt-3">
                  <span className="text-[24px] font-black text-slate-900 leading-none">{packages[selectedPackage].price}</span>
                  <span className="text-[13px] font-bold text-slate-500 pb-0.5">/{packages[selectedPackage].duration}</span>
                </div>
              </div>
              
              <div className="p-5">
                <h4 className="text-[12px] font-bold text-slate-900 uppercase tracking-wider mb-4">What's Included</h4>
                <ul className="space-y-3.5 mb-6">
                  {packages[selectedPackage].included.map((item, idxi) => (
                    <li key={idxi} className="flex gap-3 text-[14px] font-medium text-slate-700 leading-snug">
                      <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {packages[selectedPackage].notIncluded.length > 0 && (
                  <>
                    <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-4 mt-6">Not Included</h4>
                    <ul className="space-y-3.5 mb-2">
                      {packages[selectedPackage].notIncluded.map((item, idxni) => (
                        <li key={idxni} className="flex gap-3 text-[14px] font-medium text-slate-400 leading-snug">
                          <X size={18} className="text-slate-300 shrink-0" />
                          <span className="line-through decoration-slate-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <button className="w-full py-4 rounded-[16px] font-bold text-[15px] bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 transition-all active:scale-[0.98] mt-4">
            Proceed with {packages[selectedPackage].title}
          </button>
        </div>
      </div>
    </div>
  );
};
