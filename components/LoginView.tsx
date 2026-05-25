import React, { useState, useRef, useEffect } from 'react';
import { User, ArrowUpRight, Flame, Mail, ChevronDown, MessageSquare, Phone, ArrowLeft, Lock, ShieldCheck, KeyRound, Package, Sandwich, Pizza, ShoppingBag, Coffee, IceCream, Bike, Zap, Utensils, TrendingUp, CreditCard, BarChart3, Bell, Store, FileText, Shield, Tag, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LoginViewProps {
  onLogin: () => void;
  onNavigateToOnboarding: () => void;
}

type LoginStep = 'hero' | 'input' | 'otp' | 'email-method' | 'email-otp-input' | 'email-otp-verify' | 'email-password-step1' | 'email-password-step2' | 'welcome';

const WelcomeScreen: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        onLogin();
      }, 600);
    }, 2000);
    return () => clearTimeout(timer);
  }, [onLogin]);

  return (
    <div 
      className={`fixed inset-0 z-[1000] bg-[#1E90FF] flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${
        isFadingOut ? 'opacity-0 scale-105 blur-sm' : 'opacity-100 animate-in fade-in duration-700'
      }`}
    >
      <div className="flex flex-col items-center gap-6 animate-in zoom-in-95 duration-1000">
        <div className="w-24 h-24 bg-[#FFFFFF] rounded-[32px] flex items-center justify-center text-[#1E90FF] shadow-2xl shadow-blue-900/30">
          <Flame size={48} fill="currentColor" />
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase">Welcome back</h1>
          <p className="text-[11px] font-bold text-white/50 uppercase tracking-[0.4em]">Securing your connection</p>
        </div>
      </div>
      
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FFFFFF]/5 rounded-full blur-[120px] -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#FFFFFF]/5 rounded-full blur-[120px] -ml-48 -mb-48"></div>
    </div>
  );
};

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, onNavigateToOnboarding }) => {
  const [view, setView] = useState<LoginStep>('hero');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);

  // Correct OTP for demo purposes
  const VALID_OTP = '123456';

  const marqueeCardsRow1 = [
    { text: "Manage your restaurant", icon: <Utensils size={16} className="text-blue-500" />, bg: "bg-blue-50 border-blue-100 text-blue-700" },
    { text: "Grow your business", icon: <TrendingUp size={16} className="text-emerald-500" />, bg: "bg-emerald-50 border-emerald-100 text-emerald-700" },
    { text: "Instant payouts", icon: <CreditCard size={16} className="text-purple-500" />, bg: "bg-purple-50 border-purple-100 text-purple-700" },
    { text: "Track analytics", icon: <BarChart3 size={16} className="text-orange-500" />, bg: "bg-orange-50 border-orange-100 text-orange-700" },
    { text: "Digital Menu", icon: <Pizza size={16} className="text-rose-500" />, bg: "bg-rose-50 border-rose-100 text-rose-700" },
    { text: "Staff Management", icon: <User size={16} className="text-indigo-500" />, bg: "bg-indigo-50 border-indigo-100 text-indigo-700" },
  ];

  const marqueeCardsRow2 = [
    { text: "Inventory Control", icon: <Package size={16} className="text-cyan-500" />, bg: "bg-cyan-50 border-cyan-100 text-cyan-700" },
    { text: "Customer Insights", icon: <MessageSquare size={16} className="text-pink-500" />, bg: "bg-pink-50 border-pink-100 text-pink-700" },
    { text: "Marketing Tools", icon: <Zap size={16} className="text-yellow-500" />, bg: "bg-yellow-50 border-yellow-100 text-yellow-700" },
    { text: "Table Booking", icon: <Coffee size={16} className="text-teal-500" />, bg: "bg-teal-50 border-teal-100 text-teal-700" },
    { text: "Online Orders", icon: <ShoppingBag size={16} className="text-red-500" />, bg: "bg-red-50 border-red-100 text-red-700" },
    { text: "Billing & Invoicing", icon: <Sandwich size={16} className="text-lime-500" />, bg: "bg-lime-50 border-lime-100 text-lime-700" },
  ];

  const marqueeCardsRow3 = [
    { text: "Real-time Alerts", icon: <Bell size={16} className="text-amber-500" />, bg: "bg-amber-50 border-amber-100 text-amber-700" },
    { text: "Multi-Outlet", icon: <Store size={16} className="text-fuchsia-500" />, bg: "bg-fuchsia-50 border-fuchsia-100 text-fuchsia-700" },
    { text: "Custom Reports", icon: <FileText size={16} className="text-sky-500" />, bg: "bg-sky-50 border-sky-100 text-sky-700" },
    { text: "Role Access", icon: <Shield size={16} className="text-violet-500" />, bg: "bg-violet-50 border-violet-100 text-violet-700" },
    { text: "Discount Codes", icon: <Tag size={16} className="text-emerald-500" />, bg: "bg-emerald-50 border-emerald-100 text-emerald-700" },
    { text: "QR Ordering", icon: <QrCode size={16} className="text-blue-500" />, bg: "bg-blue-50 border-blue-100 text-blue-700" },
  ];

  const handleOtpChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;
    setOtpError(false);

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 6) return;

    setIsVerifying(true);
    setTimeout(() => {
      if (enteredOtp === VALID_OTP) {
        onLogin();
      } else {
        setOtpError(true);
        setIsVerifying(false);
      }
    }, 1000);
  };

  const handlePasswordLogin = () => {
    if (email && password.length >= 6) {
      onLogin();
    }
  };

  const renderMarquee = () => {
    const row1 = [...marqueeCardsRow1, ...marqueeCardsRow1];
    const row2 = [...marqueeCardsRow2, ...marqueeCardsRow2];
    const row3 = [...marqueeCardsRow3, ...marqueeCardsRow3];

    return (
      <div className="w-[calc(100%+4rem)] -mx-8 overflow-hidden mb-8 flex flex-col gap-3 relative">
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
        
        <motion.div 
          className="flex gap-3 w-max"
          animate={{ x: ["-50%", "0%"] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          {row1.map((card, i) => (
            <div key={i} className={`flex items-center gap-2 px-4 py-2.5 rounded-full border ${card.bg} whitespace-nowrap`}>
              {card.icon}
              <span className="text-[14px] font-semibold">{card.text}</span>
            </div>
          ))}
        </motion.div>

        <motion.div 
          className="flex gap-3 w-max"
          animate={{ x: ["-50%", "0%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {row2.map((card, i) => (
            <div key={i} className={`flex items-center gap-2 px-4 py-2.5 rounded-full border ${card.bg} whitespace-nowrap`}>
              {card.icon}
              <span className="text-[14px] font-semibold">{card.text}</span>
            </div>
          ))}
        </motion.div>

        <motion.div 
          className="flex gap-3 w-max"
          animate={{ x: ["-50%", "0%"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        >
          {row3.map((card, i) => (
            <div key={i} className={`flex items-center gap-2 px-4 py-2.5 rounded-full border ${card.bg} whitespace-nowrap`}>
              {card.icon}
              <span className="text-[14px] font-semibold">{card.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[500] bg-[#FFFFFF] flex flex-col font-sans overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center animate-in fade-in duration-700 pt-12">
        <h2 className="text-[16px] font-bold text-slate-900 mb-8">Business Partner</h2>
        
        {renderMarquee()}

        {view !== 'hero' && (
          <h1 className="text-[22px] font-bold text-slate-900 tracking-tight leading-[1.3] mb-2">
            The Operating System For<br/>Your <span className="text-[#7C3AED]">Food Business</span>
          </h1>
        )}
      </div>

      {/* Bottom Section */}
      <div className="px-6 pb-8">
        {view === 'hero' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <button onClick={() => setView('input')} className="w-full h-14 bg-[#1E90FF] text-white rounded-xl font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all shadow-sm">
              Login
            </button>

            <button onClick={onNavigateToOnboarding} className="w-full h-14 bg-[#FFFFFF] text-slate-900 border-[1.5px] border-slate-900 rounded-xl font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all">
              Become a Partner
            </button>
          </div>
        )}

        {view === 'input' && (
          <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
            <div className="text-left">
              <label className="text-[14px] font-medium text-slate-700">Mobile Number</label>
            </div>
            
            <div className="flex items-center h-14 border border-slate-200 rounded-xl overflow-hidden focus-within:border-[#1E90FF] focus-within:ring-1 focus-within:ring-[#1E90FF] bg-[#FFFFFF] transition-all">
              <div className="flex items-center gap-2 px-4 border-r border-slate-200 bg-[#FFFFFF] h-full">
                <img src="https://flagcdn.com/w20/in.png" alt="India" className="w-5 h-3.5 object-cover rounded-sm shadow-sm" />
                <span className="text-[15px] font-medium text-slate-700">+91</span>
              </div>
              <input 
                type="tel" 
                placeholder="Enter your phone number" 
                value={phoneNumber} 
                maxLength={10} 
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))} 
                className="flex-1 px-4 text-[15px] font-medium text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-400" 
              />
            </div>
            
            <div className="flex gap-3">
              <button onClick={() => setView('hero')} className="w-1/3 h-14 rounded-xl font-semibold text-[16px] flex items-center justify-center transition-all bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-[0.98]">
                Back
              </button>
              <button 
                onClick={() => phoneNumber.length === 10 && setView('otp')} 
                disabled={phoneNumber.length < 10} 
                className={`flex-1 h-14 rounded-xl font-semibold text-[16px] flex items-center justify-center transition-all ${phoneNumber.length === 10 ? 'bg-[#1E90FF] text-white active:scale-[0.98]' : 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'}`}
              >
                Continue
              </button>
            </div>
            
            <button onClick={() => setView('email-method')} className="w-full h-14 bg-[#FFFFFF] text-slate-700 rounded-xl font-semibold text-[15px] flex items-center justify-center gap-2 active:scale-[0.98] transition-all border border-slate-200 hover:bg-slate-50">
              <Mail size={18} className="text-slate-500" /> Login with Email
            </button>
          </div>
        )}

        {view === 'otp' && (
          <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
            <div className="text-left">
              <p className="text-[14px] text-slate-500">Code sent to <span className="font-bold text-slate-900">+91 {phoneNumber}</span></p>
            </div>
            
            <div className="flex justify-between gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (otpInputs.current[index] = el)}
                  type="tel"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className={`w-[46px] h-[54px] text-center text-xl font-bold rounded-xl border transition-all focus:outline-none ${
                    otpError 
                    ? 'border-rose-300 bg-rose-50 text-rose-600' 
                    : digit ? 'border-[#1E90FF] bg-blue-50 text-[#1E90FF]' : 'border-slate-200 bg-[#FFFFFF] focus:border-[#1E90FF]'
                  }`}
                />
              ))}
            </div>
            
            {otpError && <p className="text-rose-500 text-[13px] font-medium animate-in fade-in">Invalid code. Please try again. (Use 123456)</p>}
            
            <div className="flex gap-3 pt-2">
              <button onClick={() => setView('input')} className="w-1/3 h-14 rounded-xl font-semibold text-[16px] flex items-center justify-center transition-all bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-[0.98]">
                Back
              </button>
              <button 
                onClick={verifyOtp}
                disabled={otp.join('').length < 6 || isVerifying}
                className={`flex-1 h-14 rounded-xl font-semibold text-[16px] flex items-center justify-center transition-all ${
                  otp.join('').length === 6 && !isVerifying ? 'bg-[#1E90FF] text-white active:scale-[0.98]' : 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'
                }`}
              >
                {isVerifying ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Continue'}
              </button>
            </div>
            
            <div className="flex gap-3 w-full">
              <button className="flex-1 h-14 rounded-xl font-medium text-[14px] text-slate-700 bg-[#FFFFFF] border border-slate-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                <Phone size={18} className="text-slate-500" /> Resend SMS
              </button>
              <button className="flex-1 h-14 rounded-xl font-medium text-[14px] text-[#059669] bg-[#ECFDF5] border border-[#A7F3D0] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                <MessageSquare size={18} /> WhatsApp
              </button>
            </div>
          </div>
        )}

        {view === 'email-method' && (
          <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
            <div className="text-left">
              <label className="text-[14px] font-medium text-slate-700">Email Login</label>
            </div>
            
            <div className="space-y-3">
              <button onClick={() => setView('email-otp-input')} className="w-full p-4 border border-slate-200 rounded-xl flex items-center gap-4 hover:border-[#1E90FF] hover:bg-blue-50/50 transition-all active:scale-[0.98] text-left">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-[#1E90FF] flex items-center justify-center shrink-0"><ShieldCheck size={24} /></div>
                <div>
                  <p className="text-[16px] font-bold text-slate-900">Login with OTP</p>
                </div>
              </button>
              
              <button onClick={() => setView('email-password-step1')} className="w-full p-4 border border-slate-200 rounded-xl flex items-center gap-4 hover:border-[#1E90FF] hover:bg-blue-50/50 transition-all active:scale-[0.98] text-left">
                <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-600 flex items-center justify-center shrink-0"><KeyRound size={24} /></div>
                <div>
                  <p className="text-[16px] font-bold text-slate-900">Login with Password</p>
                </div>
              </button>
            </div>

            <button onClick={() => setView('input')} className="w-full h-14 rounded-xl font-semibold text-[16px] flex items-center justify-center transition-all bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-[0.98]">
              Back
            </button>
          </div>
        )}

        {view === 'email-otp-input' && (
          <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
            <div className="text-left">
              <label className="text-[14px] font-medium text-slate-700">Email Address</label>
            </div>
            
            <div className="flex items-center h-14 border border-slate-200 rounded-xl px-4 focus-within:border-[#1E90FF] focus-within:ring-1 focus-within:ring-[#1E90FF] bg-[#FFFFFF] transition-all">
              <Mail size={20} className="text-slate-400 mr-3" />
              <input type="email" placeholder="restaurant@crevings.com" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 text-[15px] font-medium text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-400" />
            </div>
            
            <div className="flex gap-3">
              <button onClick={() => setView('email-method')} className="w-1/3 h-14 rounded-xl font-semibold text-[16px] flex items-center justify-center transition-all bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-[0.98]">
                Back
              </button>
              <button 
                onClick={() => email && setView('email-otp-verify')}
                disabled={!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
                className={`flex-1 h-14 rounded-xl font-semibold text-[16px] flex items-center justify-center transition-all ${
                  (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) ? 'bg-[#1E90FF] text-white active:scale-[0.98]' : 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'
                }`}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {view === 'email-otp-verify' && (
          <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
            <div className="text-left">
              <p className="text-[14px] text-slate-500">Code sent to <span className="font-bold text-slate-900">{email}</span></p>
            </div>
            
            <div className="flex justify-between gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (otpInputs.current[index] = el)}
                  type="tel"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className={`w-[46px] h-[54px] text-center text-xl font-bold rounded-xl border transition-all focus:outline-none ${
                    otpError 
                    ? 'border-rose-300 bg-rose-50 text-rose-600' 
                    : digit ? 'border-[#1E90FF] bg-blue-50 text-[#1E90FF]' : 'border-slate-200 bg-[#FFFFFF] focus:border-[#1E90FF]'
                  }`}
                />
              ))}
            </div>
            
            {otpError && <p className="text-rose-500 text-[13px] font-medium animate-in fade-in">Invalid code. Please try again. (Use 123456)</p>}
            
            <div className="flex gap-3 pt-2">
              <button onClick={() => setView('email-otp-input')} className="w-1/3 h-14 rounded-xl font-semibold text-[16px] flex items-center justify-center transition-all bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-[0.98]">
                Back
              </button>
              <button 
                onClick={verifyOtp}
                disabled={otp.join('').length < 6 || isVerifying}
                className={`flex-1 h-14 rounded-xl font-semibold text-[16px] flex items-center justify-center transition-all ${
                  otp.join('').length === 6 && !isVerifying ? 'bg-[#1E90FF] text-white active:scale-[0.98]' : 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'
                }`}
              >
                {isVerifying ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Continue'}
              </button>
            </div>
            
            <button className="w-full h-14 rounded-xl font-medium text-[14px] text-slate-700 bg-[#FFFFFF] border border-slate-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              <Mail size={18} className="text-slate-500" /> Resend Email
            </button>
          </div>
        )}

        {view === 'email-password-step1' && (
          <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
            <div className="text-left">
              <label className="text-[14px] font-medium text-slate-700">Email Address</label>
            </div>
            
            <div className="flex items-center h-14 border border-slate-200 rounded-xl px-4 focus-within:border-[#1E90FF] focus-within:ring-1 focus-within:ring-[#1E90FF] bg-[#FFFFFF] transition-all">
              <Mail size={20} className="text-slate-400 mr-3" />
              <input type="email" placeholder="restaurant@crevings.com" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 text-[15px] font-medium text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-400" />
            </div>
            
            <div className="flex gap-3">
              <button onClick={() => setView('email-method')} className="w-1/3 h-14 rounded-xl font-semibold text-[16px] flex items-center justify-center transition-all bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-[0.98]">
                Back
              </button>
              <button 
                onClick={() => setView('email-password-step2')}
                disabled={!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
                className={`flex-1 h-14 rounded-xl font-semibold text-[16px] flex items-center justify-center transition-all ${
                  (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) ? 'bg-[#1E90FF] text-white active:scale-[0.98]' : 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'
                }`}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {view === 'email-password-step2' && (
          <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
            <div className="text-left">
              <p className="text-[14px] text-slate-500">Signing in as <span className="font-bold text-slate-900">{email}</span></p>
            </div>
            
            <div className="flex items-center h-14 border border-slate-200 rounded-xl px-4 focus-within:border-[#1E90FF] focus-within:ring-1 focus-within:ring-[#1E90FF] bg-[#FFFFFF] transition-all">
              <Lock size={20} className="text-slate-400 mr-3" />
              <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="flex-1 text-[15px] font-medium text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-400" />
              <button onClick={() => setShowPassword(!showPassword)} className="text-[13px] font-semibold text-[#1E90FF] ml-3">
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            
            <div className="flex gap-3">
              <button onClick={() => setView('email-password-step1')} className="w-1/3 h-14 rounded-xl font-semibold text-[16px] flex items-center justify-center transition-all bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-[0.98]">
                Back
              </button>
              <button 
                onClick={handlePasswordLogin}
                disabled={!email || password.length < 6 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
                className={`flex-1 h-14 rounded-xl font-semibold text-[16px] flex items-center justify-center transition-all ${
                  (email && password.length >= 6 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) ? 'bg-[#1E90FF] text-white active:scale-[0.98]' : 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'
                }`}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 text-center border-t border-slate-100 pt-6">
          <p className="text-[12px] text-slate-500 leading-relaxed">
            By continuing, you agree to our<br/>
            <a href="#" className="text-[#1E90FF] hover:underline">Terms of Service</a> and <a href="#" className="text-[#1E90FF] hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

