import React, { useState } from 'react';
import { ArrowLeft, Check, Eye, EyeOff } from 'lucide-react';

interface OwnerInfoViewProps {
  onBack: () => void;
}

export const OwnerInfoView: React.FC<OwnerInfoViewProps> = ({ onBack }) => {
  const [ownerName, setOwnerName] = useState('Amit Sharma');
  const [ownerPhone, setOwnerPhone] = useState('9876543210');
  const [ownerEmail, setOwnerEmail] = useState('amit@example.com');
  const [otpSent, setOtpSent] = useState(false);
  const [emailOtp, setEmailOtp] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [usePhoneAsWhatsapp, setUsePhoneAsWhatsapp] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const verifyOtp = () => {
    if (emailOtp.length === 6) {
      setIsOtpVerified(true);
    }
  };

  const calculatePasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, text: '', color: 'bg-slate-200' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    
    switch (score) {
      case 0:
      case 1: return { score, text: 'Weak', color: 'bg-red-500' };
      case 2:
      case 3: return { score, text: 'Good', color: 'bg-amber-500' };
      case 4: return { score, text: 'Strong', color: 'bg-emerald-500' };
      default: return { score: 0, text: '', color: 'bg-slate-200' };
    }
  };

  const Card = ({ title, children }: { title?: string, children: React.ReactNode }) => (
    <div className="bg-[#FFFFFF] rounded-[18px] p-4 border border-[#E5E7EB] shadow-sm mb-4">
      {title && <h3 className="text-[16px] font-bold text-slate-900 mb-4">{title}</h3>}
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFFFFF] pb-32 font-sans animate-in fade-in duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-slate-100 h-[56px] flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center -ml-2 text-slate-700 active:scale-95 transition-transform">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-[18px] font-semibold text-slate-900">Owner Info</h1>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Form Fields */}
        <Card>
          <div className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Full Name</label>
              <input 
                type="text" 
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] outline-none transition-all"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Phone Number</label>
              <input 
                type="tel" 
                value={ownerPhone}
                onChange={(e) => setOwnerPhone(e.target.value)}
                placeholder="10-digit phone number"
                className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] outline-none transition-all"
              />
            </div>

            {/* Email with OTP */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email Address</label>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  disabled={isOtpVerified}
                  placeholder="Enter email address"
                  className="flex-1 h-12 px-4 rounded-xl border border-slate-200 focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] outline-none transition-all disabled:opacity-50"
                />
                {!otpSent && (
                  <button 
                    onClick={() => setOtpSent(true)}
                    disabled={!ownerEmail}
                    className="px-4 h-12 bg-slate-100 text-[#1E90FF] font-medium rounded-xl active:bg-slate-200 disabled:opacity-50 whitespace-nowrap"
                  >
                    Send OTP
                  </button>
                )}
              </div>
              {otpSent && (
                <div className="mt-3">
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Enter 6-digit OTP</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      maxLength={6}
                      value={emailOtp}
                      onChange={(e) => setEmailOtp(e.target.value)}
                      disabled={isOtpVerified}
                      placeholder="• • • • • •"
                      className="flex-1 h-12 px-4 tracking-[0.5em] text-center rounded-xl border border-slate-200 focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] outline-none transition-all disabled:opacity-50"
                    />
                    {!isOtpVerified ? (
                      <button 
                        onClick={verifyOtp}
                        disabled={emailOtp.length !== 6}
                        className="px-6 h-12 bg-[#1E90FF] text-white font-medium rounded-xl active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 transition-all flex items-center justify-center gap-2"
                      >
                        Verify
                      </button>
                    ) : (
                      <div className="px-4 h-12 bg-emerald-50 text-emerald-600 font-medium rounded-xl flex items-center justify-center gap-2 border border-emerald-100 shrink-0">
                        <Check size={18} /> Verified
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* WhatsApp */}
            <div className="space-y-4 pt-2">
              <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer">
                <div className="relative flex items-center justify-center">
                  <input 
                    type="checkbox"
                    checked={usePhoneAsWhatsapp}
                    onChange={(e) => setUsePhoneAsWhatsapp(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="w-6 h-6 border-2 border-slate-300 rounded-md peer-checked:bg-[#1E90FF] peer-checked:border-[#1E90FF] transition-colors" />
                  <Check size={16} className="absolute text-white scale-0 peer-checked:scale-100 transition-transform" strokeWidth={3} />
                </div>
                <span className="text-sm font-medium text-slate-800">Use this contact number as WhatsApp number</span>
              </label>

              {!usePhoneAsWhatsapp && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  <label className="text-sm font-semibold text-slate-700">WhatsApp Number</label>
                  <input 
                    type="tel" 
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="Enter WhatsApp number"
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] outline-none transition-all"
                  />
                </div>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Create Password</label>
              <div className="relative">
                <input 
                  type={isPasswordVisible ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full h-12 px-4 pr-12 rounded-xl border border-slate-200 focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] outline-none transition-all"
                />
                <button 
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {password && (
                <div className="mt-2 space-y-1.5 animate-in fade-in">
                  <div className="flex gap-1 h-1.5">
                    {[1, 2, 3, 4].map((level) => (
                      <div 
                        key={level} 
                        className={`flex-1 rounded-full ${level <= calculatePasswordStrength(password).score ? calculatePasswordStrength(password).color : 'bg-slate-100'} transition-all duration-300`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs font-medium ${calculatePasswordStrength(password).score >= 4 ? 'text-emerald-600' : 'text-slate-500'}`}>
                    {calculatePasswordStrength(password).text} password
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Save Button */}
      <div className="fixed bottom-[72px] left-0 right-0 p-4 bg-[#FFFFFF] border-t border-slate-100 z-40 max-w-md mx-auto">
        <button 
          onClick={onBack}
          className="w-full h-[52px] bg-[#1E90FF] text-[#FFFFFF] rounded-[14px] font-semibold text-[16px] active:scale-[0.98] transition-all shadow-sm"
        >
          Save Details
        </button>
      </div>
    </div>
  );
};
