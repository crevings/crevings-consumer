import React, { useState } from 'react';
import { ArrowLeft, Building2, CheckCircle2, ShieldCheck, Briefcase, AlertCircle, Percent, FileText, BarChart3, Sparkles } from 'lucide-react';

interface GstDetailsViewProps {
  onBack: () => void;
}

export const GstDetailsView: React.FC<GstDetailsViewProps> = ({ onBack }) => {
  const [gstin, setGstin] = useState('');
  const [error, setError] = useState<string | null>(null);

  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

  const validateGstin = (value: string) => {
    if (value.length === 15) {
      if (!gstRegex.test(value)) {
        setError('Invalid GSTIN format. Please enter a valid 15-character GST number.');
        return false;
      }
    }
    setError(null);
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setGstin(value);
    // Clear error immediately on typing as per request
    setError(null);
    
    // Real-time validation when the full length is reached
    if (value.length === 15) {
      validateGstin(value);
    }
  };

  const handleVerify = () => {
    setError(null);
    // TODO: persist GSTIN via a real profile field once the backend exposes
    // one. For now this only validates the format client-side.
    if (!gstRegex.test(gstin)) {
        setError('Invalid GSTIN format. Please enter a valid 15-character GST number.');
        return;
    }
    onBack();
  };

  const benefits = [
    {
      icon: Percent,
      title: 'Claim ITC',
      desc: 'Save up to 18% by claiming Input Tax Credit on your business orders.'
    },
    {
      icon: FileText,
      title: 'Business Invoices',
      desc: 'Get automated tax invoices with your company name and GSTIN.'
    },
    {
      icon: BarChart3,
      title: 'Expense Tracking',
      desc: 'Easily track and manage your business food expenses for audits.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 animate-[slideUp_0.3s_ease-out] flex flex-col">
      {/* Header Section */}
      <div className="bg-white pt-6 pb-6 px-5 sticky top-0 z-20 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-700 active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-xl text-slate-900">Add GST Details</h1>
        </div>
      </div>

      <div className="flex-1 px-5 py-6">
          <div className="flex flex-col items-center justify-center text-center mb-8">
             <div className="w-20 h-20 bg-[#00bd6f]/10 rounded-[24px] flex items-center justify-center mb-4 relative">
                 <Building2 className="w-10 h-10 text-[#00bd6f]" />
                 <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#00bd6f] rounded-full flex items-center justify-center border-2 border-white">
                     <CheckCircle2 className="w-4 h-4 text-white" />
                 </div>
             </div>
             <h2 className="text-2xl font-bold text-slate-900 mb-2">Business Profile</h2>
             <p className="text-slate-500 text-sm max-w-xs">Enter your GSTIN to claim ITC.</p>
          </div>

          {/* Coming Soon Banner */}
          <div className="mb-6 rounded-[24px] bg-slate-100 p-4 flex items-center justify-center gap-3 border border-slate-200">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-slate-500" />
            </div>
            <p className="font-bold text-slate-600 uppercase tracking-wider text-xs">
              This Feature Coming Soon
            </p>
          </div>

          <div className={`bg-white rounded-[24px] p-6 border mb-8 transition-all duration-300 ${error ? 'border-red-300' : 'border-slate-100'}`}>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block ml-1">GSTIN</label>
              <div className="relative">
                  <input 
                    type="text" 
                    placeholder="29ABCDE1234F1Z5" 
                    value={gstin}
                    onChange={handleInputChange}
                    maxLength={15}
                    className={`w-full bg-slate-50 border rounded-[16px] px-4 py-4 pl-12 text-sm font-bold text-slate-900 transition-all uppercase tracking-widest focus:outline-none ${error ? 'border-red-300 focus:border-red-400' : 'border-slate-200 focus:border-[#00bd6f]'}`}
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <Briefcase className="w-5 h-5" />
                  </div>
              </div>

              {error && (
                <div className="mt-3 flex items-center gap-1.5 text-red-500 animate-[fadeInUp_0.2s_ease-out] px-1">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p className="text-xs font-medium leading-tight">{error}</p>
                </div>
              )}

              <div className="mt-4 flex items-center gap-2 pt-4 border-t border-slate-100">
                  <ShieldCheck className="w-4 h-4 text-[#00bd6f] shrink-0" />
                  <p className="text-xs text-slate-500 font-medium">Your GST details are secure.</p>
              </div>
          </div>

          <div className="mb-8 space-y-4">
             <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Why add GST Details?</h3>
             <div className="space-y-3">
                {benefits.map((benefit, i) => (
                   <div key={i} className="bg-white rounded-[24px] p-5 flex items-start gap-4 border border-slate-100">
                      <div className="w-12 h-12 rounded-[16px] bg-slate-50 flex items-center justify-center text-slate-700 shrink-0">
                         <benefit.icon className="w-6 h-6" />
                      </div>
                      <div>
                         <h4 className="text-sm font-bold text-slate-900 mb-1">{benefit.title}</h4>
                         <p className="text-xs text-slate-500 font-medium leading-relaxed">{benefit.desc}</p>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          <button 
            onClick={handleVerify}
            disabled={gstin.length < 15}
            className="w-full bg-[#00bd6f] text-white font-bold py-4 rounded-[16px] active:scale-95 transition-transform disabled:opacity-50 flex items-center justify-center gap-2 mb-8"
          >
              Verify & Save GSTIN
          </button>
      </div>
    </div>
  );
};
