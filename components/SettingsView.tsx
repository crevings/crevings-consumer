
import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Bell, MessageCircle, MessageSquare, Mail, Phone, 
  Eye, EyeOff, Volume2, CheckCircle2, Printer, MapPin, Image as ImageIcon, Mic,
  FileText, RefreshCcw, Banknote, ShieldCheck, ChevronRight
} from 'lucide-react';

interface SettingsViewProps {
  onBack?: () => void;
}

const Toggle = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
  <button
    onClick={onChange}
    className={`w-[32px] h-[18px] rounded-full p-[2px] transition-colors duration-300 relative shrink-0 ${checked ? 'bg-[#1E90FF]' : 'bg-[#D1D5DB]'}`}
  >
    <div className={`w-[14px] h-[14px] bg-[#FFFFFF] rounded-full transform transition-transform duration-300 shadow-sm ${checked ? 'translate-x-[14px]' : 'translate-x-0'}`} />
  </button>
);

const PasswordResetFlow = ({ onCancel }: { onCancel: () => void }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState('');
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let interval: any;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const validatePassword = (p: string) => p.length >= 8 && /\d/.test(p) && /[!@#$%^&*(),.?":{}|<>]/.test(p);

  const handleEmailSubmit = () => {
    if (!validateEmail(email)) {
      setError('Invalid email format');
      return;
    }
    setError('');
    setStep(2);
    setTimer(30);
  };

  const handleOtpChange = (val: string, index: number) => {
    if (isNaN(Number(val))) return;
    const newOtp = [...otp];
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);
    if (val && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = () => {
    if (otp.join('').length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }
    setError('');
    setStep(3);
  };

  const handleSavePassword = () => {
    if (!validatePassword(newPassword)) {
      setError('Password does not meet requirements');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Password must match');
      return;
    }
    setError('');
    onCancel(); // Success
  };

  return (
    <div className="space-y-4 mt-4 pt-4 border-t border-slate-100">
      {step === 1 && (
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-900">Step 1 — Enter Email</p>
          <div>
            <input 
              type="email" 
              placeholder="Registered Email Address" 
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
          <button onClick={handleEmailSubmit} className="w-full h-[52px] bg-[#1E90FF] text-[#FFFFFF] rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all">Continue</button>
          <button onClick={onCancel} className="w-full h-[52px] bg-slate-50 text-slate-700 rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all">Cancel</button>
        </div>
      )}
      {step === 2 && (
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-900">Step 2 — OTP Verification</p>
          <div className="flex justify-between gap-2">
            {otp.map((digit, i) => (
              <input 
                key={i}
                ref={el => otpRefs.current[i] = el}
                type="tel"
                maxLength={1}
                value={digit}
                onChange={e => { handleOtpChange(e.target.value, i); setError(''); }}
                onKeyDown={e => handleOtpKeyDown(e, i)}
                className="w-10 sm:w-12 h-14 text-center text-lg font-bold rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
              />
            ))}
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex gap-3">
            <button onClick={handleVerifyOtp} className="flex-1 h-[52px] bg-[#1E90FF] text-[#FFFFFF] rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all">Verify OTP</button>
            <button 
              disabled={timer > 0} 
              onClick={() => { setTimer(30); setOtp(['','','','','','']); setError(''); }}
              className="flex-1 h-[52px] bg-slate-50 text-slate-700 rounded-[16px] font-semibold text-[16px] disabled:opacity-50 active:scale-[0.98] transition-all"
            >
              {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
            </button>
          </div>
          <button onClick={onCancel} className="w-full h-[52px] bg-slate-50 text-slate-700 rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all">Cancel</button>
        </div>
      )}
      {step === 3 && (
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-900">Step 3 — Create New Password</p>
          <div className="space-y-3">
            <div className="relative">
              <input 
                type={showNew ? 'text' : 'password'}
                placeholder="New Password"
                value={newPassword}
                onChange={e => { setNewPassword(e.target.value); setError(''); }}
                className="w-full h-12 px-4 pr-12 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
              />
              <button onClick={() => setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="relative">
              <input 
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={e => { setConfirmPassword(e.target.value); setError(''); }}
                className="w-full h-12 px-4 pr-12 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
              />
              <button onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="text-xs text-slate-500 space-y-1">
              <p className={newPassword.length >= 8 ? 'text-emerald-500' : ''}>• Minimum 8 characters</p>
              <p className={/\d/.test(newPassword) ? 'text-emerald-500' : ''}>• At least 1 number</p>
              <p className={/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? 'text-emerald-500' : ''}>• At least 1 special character</p>
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
          <div className="flex gap-3">
            <button onClick={handleSavePassword} className="flex-1 h-[52px] bg-[#1E90FF] text-[#FFFFFF] rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all">Save Password</button>
            <button onClick={onCancel} className="flex-1 h-[52px] bg-slate-50 text-slate-700 rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

const ChangeAccountFlow = ({ type, currentVal, onCancel }: { type: 'Email' | 'Phone Number', currentVal: string, onCancel: () => void }) => {
  const [step, setStep] = useState(1);
  const [oldVal, setOldVal] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newVal, setNewVal] = useState('');
  const [error, setError] = useState('');
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const validatePhone = (p: string) => /^\d{10}$/.test(p.replace(/\D/g, ''));

  const handleStep1 = () => {
    if (type === 'Email' && !validateEmail(oldVal)) {
      setError('Invalid email format'); return;
    }
    if (type === 'Phone Number' && !validatePhone(oldVal)) {
      setError('Phone number must be 10 digits'); return;
    }
    if (oldVal !== currentVal) {
      setError(`Does not match registered ${type.toLowerCase()}`); return;
    }
    setError(''); setStep(2);
  };

  const handleOtpChange = (val: string, index: number) => {
    if (isNaN(Number(val))) return;
    const newOtp = [...otp];
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);
    if (val && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleStep2 = () => {
    if (otp.join('').length !== 6) {
      setError('OTP must be 6 digits'); return;
    }
    setError(''); setStep(3);
  };

  const handleStep3 = () => {
    if (type === 'Email' && !validateEmail(newVal)) {
      setError('Invalid email format'); return;
    }
    if (type === 'Phone Number' && !validatePhone(newVal)) {
      setError('Phone number must be 10 digits'); return;
    }
    setError(''); setStep(4);
  };

  return (
    <div className="space-y-4 mt-4 pt-4 border-t border-slate-100">
      {step === 1 && (
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-900">Step 1 — Enter registered {type.toLowerCase()}</p>
          <input 
            type={type === 'Email' ? 'email' : 'tel'} 
            placeholder={`Registered ${type}`} 
            value={oldVal}
            onChange={e => { setOldVal(e.target.value); setError(''); }}
            className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex gap-3">
            <button onClick={handleStep1} className="flex-1 h-[52px] bg-[#1E90FF] text-[#FFFFFF] rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all">Continue</button>
            <button onClick={onCancel} className="flex-1 h-[52px] bg-slate-50 text-slate-700 rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all">Cancel</button>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-900">Step 2 — OTP Verification</p>
          <div className="flex justify-between gap-2">
            {otp.map((digit, i) => (
              <input 
                key={i}
                ref={el => otpRefs.current[i] = el}
                type="tel"
                maxLength={1}
                value={digit}
                onChange={e => { handleOtpChange(e.target.value, i); setError(''); }}
                onKeyDown={e => handleOtpKeyDown(e, i)}
                className="w-10 sm:w-12 h-14 text-center text-lg font-bold rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
              />
            ))}
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex gap-3">
            <button onClick={handleStep2} className="flex-1 h-[52px] bg-[#1E90FF] text-[#FFFFFF] rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all">Verify OTP</button>
            <button onClick={onCancel} className="flex-1 h-[52px] bg-slate-50 text-slate-700 rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all">Cancel</button>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-900">Step 3 — Enter new {type.toLowerCase()}</p>
          <input 
            type={type === 'Email' ? 'email' : 'tel'} 
            placeholder={`New ${type}`} 
            value={newVal}
            onChange={e => { setNewVal(e.target.value); setError(''); }}
            className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex gap-3">
            <button onClick={handleStep3} className="flex-1 h-[52px] bg-[#1E90FF] text-[#FFFFFF] rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all">Continue</button>
            <button onClick={onCancel} className="flex-1 h-[52px] bg-slate-50 text-slate-700 rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all">Cancel</button>
          </div>
        </div>
      )}
      {step === 4 && (
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-900">Step 4 — Save changes</p>
          <p className="text-sm text-slate-600">New {type.toLowerCase()}: <span className="font-semibold text-slate-900">{newVal}</span></p>
          <div className="flex gap-3">
            <button onClick={onCancel} className="flex-1 h-[52px] bg-[#1E90FF] text-[#FFFFFF] rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all">Save Changes</button>
            <button onClick={onCancel} className="flex-1 h-[52px] bg-slate-50 text-slate-700 rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export const SettingsView: React.FC<SettingsViewProps> = ({ onBack }) => {
  const [showPasswordFlow, setShowPasswordFlow] = useState(false);
  const [activeAccountFlow, setActiveAccountFlow] = useState<'Email' | 'Phone Number' | null>(null);
  const [showPermissionModal, setShowPermissionModal] = useState<'location' | 'media' | 'mic' | null>(null);
  const [settings, setSettings] = useState({
    push: true,
    whatsapp: false,
    sms: true,
    email: false,
    calls: true,
    criticalSound: true,
    autoAccept: false,
    cloudPrinting: true,
  });

  const [permissions, setPermissions] = useState({
    location: true,
    media: false,
    mic: false,
  });

  const toggleSetting = (key: keyof typeof settings) => setSettings(p => ({ ...p, [key]: !p[key] }));
  const togglePermission = (key: keyof typeof permissions) => setPermissions(p => ({ ...p, [key]: !p[key] }));

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col">
      {/* Page Header */}
      <div className="h-[56px] bg-[#FFFFFF] border-b border-slate-100 flex items-center px-4 shrink-0 sticky top-0 z-20">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center -ml-2 text-slate-700 active:scale-95 transition-transform">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-[18px] font-semibold text-slate-900 ml-2">Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-[14px] pb-12 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0 lg:p-8 lg:max-w-5xl lg:mx-auto lg:w-full">
        {/* 1. Notifications Permissions Card */}
        <div className="bg-[#FFFFFF] rounded-[16px] p-4 border border-[#E5E7EB]">
          <h2 className="text-base font-semibold text-slate-900 mb-4">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Push Notifications</span>
              </div>
              <Toggle checked={settings.push} onChange={() => toggleSetting('push')} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageCircle size={20} className="text-slate-500" />
                <span className="text-sm font-medium text-slate-700">WhatsApp Notifications</span>
              </div>
              <Toggle checked={settings.whatsapp} onChange={() => toggleSetting('whatsapp')} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare size={20} className="text-slate-500" />
                <span className="text-sm font-medium text-slate-700">SMS Notifications</span>
              </div>
              <Toggle checked={settings.sms} onChange={() => toggleSetting('sms')} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Email Notifications</span>
              </div>
              <Toggle checked={settings.email} onChange={() => toggleSetting('email')} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Phone size={20} className="text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Call Alerts</span>
              </div>
              <Toggle checked={settings.calls} onChange={() => toggleSetting('calls')} />
            </div>
          </div>
        </div>

        {/* 2. Kitchen Workflow Card */}
        <div className="bg-[#FFFFFF] rounded-[16px] p-4 border border-[#E5E7EB]">
          <h2 className="text-base font-semibold text-slate-900 mb-4">Kitchen Workflow</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 size={20} className="text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Critical Sound</span>
              </div>
              <Toggle checked={settings.criticalSound} onChange={() => toggleSetting('criticalSound')} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={20} className="text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Auto-Accept Mode</span>
              </div>
              <Toggle checked={settings.autoAccept} onChange={() => toggleSetting('autoAccept')} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Printer size={20} className="text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Cloud Printing</span>
              </div>
              <Toggle checked={settings.cloudPrinting} onChange={() => toggleSetting('cloudPrinting')} />
            </div>
          </div>
        </div>

        {/* 3. Device Permissions Card */}
        <div className="bg-[#FFFFFF] rounded-[16px] p-4 border border-[#E5E7EB]">
          <h2 className="text-base font-semibold text-slate-900 mb-4">App Permissions</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin size={20} className="text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Location Access</span>
              </div>
              <Toggle checked={permissions.location} onChange={() => setShowPermissionModal('location')} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ImageIcon size={20} className="text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Media Access</span>
              </div>
              <Toggle checked={permissions.media} onChange={() => setShowPermissionModal('media')} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mic size={20} className="text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Microphone Access</span>
              </div>
              <Toggle checked={permissions.mic} onChange={() => setShowPermissionModal('mic')} />
            </div>
          </div>
        </div>

        {/* Permission Modal Bottom Sheet */}
        {showPermissionModal && (
          <div 
            className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50 sm:items-center transition-opacity"
            onClick={() => setShowPermissionModal(null)}
          >
            <div 
              className="w-full bg-[#FFFFFF] rounded-t-2xl sm:rounded-2xl sm:max-w-md p-6 animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:fade-in duration-300"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                {showPermissionModal === 'location' && <MapPin size={32} />}
                {showPermissionModal === 'media' && <ImageIcon size={32} />}
                {showPermissionModal === 'mic' && <Mic size={32} />}
              </div>
              <h3 className="text-xl font-bold text-slate-900 text-center mb-2">
                Allow {showPermissionModal === 'location' ? 'Location' : showPermissionModal === 'media' ? 'Media' : 'Microphone'} Access?
              </h3>
              <p className="text-slate-500 text-center mb-6">
                This app needs access to your {showPermissionModal === 'location' ? 'location to find nearby customers' : showPermissionModal === 'media' ? 'media to upload photos' : 'microphone for voice search'}.
              </p>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    if (showPermissionModal) {
                      togglePermission(showPermissionModal);
                    }
                    setShowPermissionModal(null);
                  }}
                  className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-xl active:scale-95 transition-transform"
                >
                  Allow Access
                </button>
                <button 
                  onClick={() => setShowPermissionModal(null)}
                  className="w-full py-3 px-4 bg-slate-100 text-slate-700 font-semibold rounded-xl active:scale-95 transition-transform"
                >
                  Deny
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 4. Password Management Card */}
        <div className="bg-[#FFFFFF] rounded-[16px] p-4 border border-[#E5E7EB]">
          <h2 className="text-base font-semibold text-slate-900 mb-4">Password</h2>
          {!showPasswordFlow ? (
            <button 
              onClick={() => setShowPasswordFlow(true)}
              className="w-full h-[52px] bg-slate-50 border border-slate-200 rounded-[16px] font-semibold text-[16px] text-slate-700 active:scale-[0.98] transition-all"
            >
              Forgot Password
            </button>
          ) : (
            <PasswordResetFlow onCancel={() => setShowPasswordFlow(false)} />
          )}
        </div>

        {/* 5. Account Information Card */}
        <div className="bg-[#FFFFFF] rounded-[16px] p-4 border border-[#E5E7EB]">
          <h2 className="text-base font-semibold text-slate-900 mb-4">Account Information</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Registered Email</p>
                <p className="text-sm font-medium text-slate-900">restaurant@email.com</p>
              </div>
              <button 
                onClick={() => setActiveAccountFlow(activeAccountFlow === 'Email' ? null : 'Email')}
                className="px-4 py-2 h-[52px] bg-slate-50 border border-slate-200 rounded-[16px] font-semibold text-[16px] text-slate-700 active:scale-[0.98] transition-all"
              >
                Change
              </button>
            </div>
            {activeAccountFlow === 'Email' && (
              <ChangeAccountFlow type="Email" currentVal="restaurant@email.com" onCancel={() => setActiveAccountFlow(null)} />
            )}

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Registered Phone Number</p>
                <p className="text-sm font-medium text-slate-900">+91 98765 43210</p>
              </div>
              <button 
                onClick={() => setActiveAccountFlow(activeAccountFlow === 'Phone Number' ? null : 'Phone Number')}
                className="px-4 py-2 h-[52px] bg-slate-50 border border-slate-200 rounded-[16px] font-semibold text-[16px] text-slate-700 active:scale-[0.98] transition-all"
              >
                Change
              </button>
            </div>
            {activeAccountFlow === 'Phone Number' && (
              <ChangeAccountFlow type="Phone Number" currentVal="9876543210" onCancel={() => setActiveAccountFlow(null)} />
            )}
          </div>
        </div>

        {/* 6. Policies Card */}
        <div className="bg-[#FFFFFF] rounded-[16px] p-4 border border-[#E5E7EB]">
          <h2 className="text-base font-semibold text-slate-900 mb-4">Policies</h2>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Terms and Conditions</span>
              </div>
              <ChevronRight size={18} className="text-slate-400" />
            </button>
            <button className="w-full flex items-center justify-between">
              <div className="flex items-center gap-3">
                <RefreshCcw size={20} className="text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Refund Policy</span>
              </div>
              <ChevronRight size={18} className="text-slate-400" />
            </button>
            <button className="w-full flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Banknote size={20} className="text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Payout Policy</span>
              </div>
              <ChevronRight size={18} className="text-slate-400" />
            </button>
            <button className="w-full flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck size={20} className="text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Privacy Policy</span>
              </div>
              <ChevronRight size={18} className="text-slate-400" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
