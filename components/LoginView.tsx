import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, User, ChefHat, ShieldCheck, Sparkles, ChevronDown } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [step, setStep] = useState<'phone' | 'otp' | 'name'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length === 10) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setStep('otp');
      }, 1200);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); 
    setOtp(newOtp);

    if (value !== '' && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.join('').length === 6) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setStep('name');
      }, 1200);
    }
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim().length > 0) {
       setIsLoading(true);
       setTimeout(() => {
           setIsLoading(false);
           onLoginSuccess();
       }, 800);
    }
  };

  return (
    <div className="min-h-screen bg-white relative font-sans overflow-hidden flex flex-col">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
            <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-100 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-[10%] right-[-10%] w-[350px] h-[350px] bg-blue-50 rounded-full blur-[80px] animate-pulse delay-1000"></div>
            <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="dot-pattern" width="30" height="30" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="currentColor" className="text-blue-900" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dot-pattern)" />
            </svg>
        </div>

        <div className="relative z-10 flex-1 flex flex-col px-8 pt-16 pb-10">
            <div className="flex flex-col items-center mb-12">
                <div className="w-14 h-14 bg-gradient-to-tr from-blue-500 to-sky-400 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20 mb-4 animate-fadeInUp">
                    <ChefHat className="w-8 h-8 text-white" />
                </div>
                <div className="text-center animate-fadeInUp delay-100">
                    <h2 className="text-slate-900 text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-2">Crevings Premium</h2>
                    <div className="h-0.5 w-6 bg-blue-500 mx-auto rounded-full"></div>
                </div>
            </div>

            <div className="flex gap-1.5 justify-center mb-12 animate-fadeInUp delay-200">
                {['phone', 'otp', 'name'].map((s, idx) => (
                    <div 
                        key={s} 
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                            (step === s) ? 'w-10 bg-blue-500' : 'w-2 bg-slate-100'
                        }`}
                    />
                ))}
            </div>

            <div className="flex-1 flex flex-col">
                {step === 'phone' && (
                    <div className="animate-fadeInUp">
                        <div className="mb-10">
                            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-3 leading-tight">
                                Your favorite food,<br/>is just a <span className="text-blue-500">tap away.</span>
                            </h1>
                            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest opacity-80">
                                Enter mobile number to begin
                            </p>
                        </div>

                        <form onSubmit={handlePhoneSubmit}>
                            <div className="group bg-slate-50 border-2 border-slate-50 rounded-[2.5rem] p-4 flex items-center gap-4 mb-10 focus-within:bg-white focus-within:border-blue-500/20 focus-within:ring-[12px] focus-within:ring-blue-500/5 transition-all shadow-sm">
                                <div className="flex items-center gap-2.5 px-4 py-3 bg-white rounded-[1.5rem] shadow-sm border border-slate-100 group-focus-within:border-blue-500/20 transition-all cursor-pointer hover:bg-slate-50 active:scale-95">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-2xl leading-none">🇮🇳</span>
                                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                                    </div>
                                    <div className="w-px h-6 bg-slate-200 mx-1"></div>
                                    <span className="text-slate-900 font-black text-lg">+91</span>
                                </div>

                                <div className="flex-1 pl-1">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1 ml-1">Mobile Number</span>
                                    <input 
                                        type="tel" 
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                        className="bg-transparent font-black text-slate-900 text-xl w-full focus:outline-none placeholder:text-slate-200 tracking-wider"
                                        placeholder="00000 00000"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit"
                                disabled={phoneNumber.length !== 10 || isLoading}
                                className="w-full bg-slate-900 text-white font-black py-5 rounded-3xl shadow-2xl shadow-slate-900/20 disabled:opacity-50 disabled:shadow-none active:scale-[0.97] transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
                            >
                                {isLoading ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        Get Verification Code
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                )}

                {step === 'otp' && (
                    <div className="animate-fadeInUp">
                        <button 
                            onClick={() => setStep('phone')}
                            className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors mb-8 active:scale-90"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="mb-10">
                            <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-3 leading-tight">Verify it's you</h1>
                            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest opacity-80 leading-relaxed">
                                We sent a 6-digit code to <br/>
                                <span className="text-slate-900">+91 {phoneNumber}</span>
                            </p>
                        </div>
                        <form onSubmit={handleOtpSubmit}>
                            <div className="flex justify-between gap-2.5 mb-10">
                                {otp.map((digit, i) => (
                                    <input
                                        key={i}
                                        id={`otp-${i}`}
                                        type="tel"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(i, e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Backspace' && digit === '' && i > 0) {
                                                document.getElementById(`otp-${i-1}`)?.focus();
                                            }
                                        }}
                                        className="w-full aspect-square max-w-[50px] bg-slate-50 border-2 border-slate-50 rounded-2xl text-center text-xl font-black text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all shadow-sm"
                                    />
                                ))}
                            </div>
                            <button 
                                type="submit"
                                disabled={otp.join('').length !== 6 || isLoading}
                                className="w-full bg-blue-500 text-white font-black py-5 rounded-3xl shadow-2xl shadow-blue-500/20 disabled:opacity-50 active:scale-[0.97] transition-all flex items-center justify-center gap-3 mb-8"
                            >
                                {isLoading ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    'Verify & Continue'
                                )}
                            </button>
                            <div className="flex flex-col items-center gap-4">
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                    Resend code in <span className="text-blue-500">00:30</span>
                                </p>
                            </div>
                        </form>
                    </div>
                )}

                {step === 'name' && (
                     <div className="animate-fadeInUp">
                        <div className="mb-10 text-center">
                            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-500 mx-auto mb-6 shadow-inner rotate-3">
                                <Sparkles className="w-10 h-10 animate-pulse" />
                            </div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">Nearly there!</h1>
                            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest opacity-80">What should we call you?</p>
                        </div>
                        <form onSubmit={handleNameSubmit}>
                            <div className="group bg-slate-50 border-2 border-slate-50 rounded-3xl p-5 flex items-center gap-4 mb-10 focus-within:bg-white focus-within:border-blue-500/20 focus-within:ring-8 focus-within:ring-blue-500/5 transition-all shadow-sm">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm border border-slate-100 group-focus-within:text-blue-500 transition-colors">
                                    <User className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Full Name</span>
                                    <input 
                                        type="text" 
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                        className="bg-transparent font-black text-slate-900 text-lg w-full focus:outline-none placeholder:text-slate-200"
                                        placeholder="Ex: John Smith"
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <button 
                                type="submit"
                                disabled={userName.trim().length === 0 || isLoading}
                                className="w-full bg-slate-900 text-white font-black py-5 rounded-3xl shadow-2xl shadow-slate-900/30 disabled:opacity-50 active:scale-[0.97] transition-all flex items-center justify-center gap-3 hover:bg-slate-800"
                            >
                                {isLoading ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        Finish Setup
                                        <Sparkles className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>
                     </div>
                )}
            </div>

            <div className="mt-auto text-center pt-10">
                <div className="flex items-center justify-center gap-2 mb-6 text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">
                    <ShieldCheck className="w-4 h-4" /> Secure Authentication
                </div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em] leading-relaxed opacity-60 max-w-[240px] mx-auto">
                    By signing up, you agree to our <br/>
                    <span className="text-slate-900 hover:text-blue-500 cursor-pointer transition-colors underline underline-offset-2">Terms of Service</span> & <span className="text-slate-900 hover:text-blue-500 cursor-pointer transition-colors underline underline-offset-2">Privacy Policy</span>
                </p>
            </div>
        </div>
    </div>
  );
};