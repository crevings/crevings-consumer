import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, X, Check, MapPin, Upload, ChevronRight, Download, FileText, AlertTriangle, Eye, EyeOff, ChevronDown } from 'lucide-react';

interface PartnerVideoViewProps {
  onComplete: () => void;
  onCancel: () => void;
}

const LANGUAGES = [
  { id: 'en', name: 'English', native: 'English' },
  { id: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { id: 'mr', name: 'Marathi', native: 'मराठी' },
  { id: 'bn', name: 'Bengali', native: 'বাংলা' },
  { id: 'te', name: 'Telugu', native: 'తెలుగు' },
  { id: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { id: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { id: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { id: 'ml', name: 'Malayalam', native: 'മലയാളം' },
];

export const PartnerVideoView: React.FC<PartnerVideoViewProps> = ({ onComplete, onCancel }) => {
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showLanguageSheet, setShowLanguageSheet] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  // Restaurant Info Form State
  const [restaurantLogo, setRestaurantLogo] = useState<string | null>(null);
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantContact, setRestaurantContact] = useState('');
  const [useOwnerContact, setUseOwnerContact] = useState(false);
  const [restaurantAddress, setRestaurantAddress] = useState('');
  const [cuisineType, setCuisineType] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [isRestaurantLoading, setIsRestaurantLoading] = useState(false);

  // Documents Form State
  const [gstCategory, setGstCategory] = useState('');
  const [fssaiLicense, setFssaiLicense] = useState('');
  const [fssaiExpiry, setFssaiExpiry] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [isDocumentsLoading, setIsDocumentsLoading] = useState(false);
  const [flowStep, setFlowStep] = useState<'introduction' | 'owner_info' | 'restaurant_info' | 'documents' | 'pricing' | 'agreement' | 'processing' | 'success'>('introduction');
  
  // Pricing Form State
  const [selectedPlan, setSelectedPlan] = useState('');
  const [isPricingLoading, setIsPricingLoading] = useState(false);
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [emailOtp, setEmailOtp] = useState('');
  const [usePhoneAsWhatsapp, setUsePhoneAsWhatsapp] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [cuisineInput, setCuisineInput] = useState('');
  const [services, setServices] = useState({
    delivery: false,
    takeaway: false,
    dineIn: false,
    booking: false
  });
  const [restaurantType, setRestaurantType] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);

  const handleCuisineKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      const val = cuisineInput.trim();
      if (val && !cuisines.includes(val)) {
        setCuisines([...cuisines, val]);
      }
      setCuisineInput('');
    } else if (e.key === 'Backspace' && !cuisineInput && cuisines.length > 0) {
      setCuisines(cuisines.slice(0, -1));
    }
  };

  const handleCuisineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.endsWith(' ') && val.trim()) {
      if (!cuisines.includes(val.trim())) {
        setCuisines([...cuisines, val.trim()]);
      }
      setCuisineInput('');
    } else {
      setCuisineInput(val);
    }
  };

  const removeCuisine = (tagToRemove: string) => {
    setCuisines(cuisines.filter(tag => tag !== tagToRemove));
  };

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

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration || 1;
      const currentProgress = (current / total) * 100;
      setProgress(currentProgress);
      
      // Mark as completed if we are very close to the end
      if (currentProgress > 95) {
        setIsCompleted(true);
      }
    }
  };

  const handleVideoEnd = () => {
    setIsCompleted(true);
    setProgress(100);
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black bg-opacity-95 flex flex-col pt-0 sm:pt-4 animate-in fade-in duration-300">
      <div className="relative w-full h-full sm:max-w-md sm:mx-auto sm:rounded-[24px] sm:overflow-hidden sm:h-[calc(100vh-2rem)] sm:border sm:border-slate-800 bg-black">
        {/* Header overlays */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
          <button 
            onClick={onCancel}
            className="w-10 h-10 flex items-center justify-center text-white active:scale-95 transition-transform"
          >
            <ArrowLeft size={28} />
          </button>
          
          <button 
            onClick={() => setShowLanguageSheet(true)}
            className="px-3 py-1.5 rounded-lg border border-white/20 bg-black/40 backdrop-blur-md text-white text-sm font-medium flex items-center gap-2 active:bg-black/60 transition-colors"
          >
             <span>{selectedLanguage.name}</span>
             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </button>
        </div>

        {/* Video Player */}
        <div className="w-full h-full relative flex items-center justify-center bg-zinc-900 overflow-hidden">
          <video 
            ref={videoRef}
            src="https://www.w3schools.com/html/mov_bbb.mp4" 
            className="w-full h-full object-cover scale-150"
            autoPlay
            playsInline
            muted
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnd}
          />

          {/* Subtitles / Text Overlay */}
          <div className="absolute bottom-24 left-0 right-0 px-6 z-10">
            <h2 className="text-white text-xl font-bold mb-1">Hybrid Offers</h2>
            <p className="text-white/90 text-sm">Achieving incentives is now easier than ever!</p>
          </div>
        </div>

        {/* Footer actions with progress bar embedded in Continue button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10 bg-gradient-to-t from-black via-black/80 to-transparent pt-10">
          <button 
            onClick={() => {
              if (isCompleted && !isLoadingNext) {
                // Simulate loading next screen/video
                setIsLoadingNext(true);
                setTimeout(() => {
                  setIsLoadingNext(false);
                  setFlowStep('owner_info');
                }, 1500);
              }
            }}
            disabled={!isCompleted || isLoadingNext}
            className={`relative w-full h-14 rounded-xl font-bold text-[16px] overflow-hidden transition-all ${
              isCompleted 
                ? 'active:scale-[0.98]' 
                : 'cursor-not-allowed'
            }`}
          >
            {/* Background track */}
            <div className={`absolute inset-0 ${isCompleted ? 'bg-[#1E90FF]/20' : 'bg-[#FFFFFF]/20 backdrop-blur-sm'}`} />
            
            {/* Progress fill */}
            <div 
              className={`absolute left-0 top-0 bottom-0 ${isCompleted ? 'bg-[#1E90FF]' : 'bg-[#1E90FF]'} transition-all duration-100 ease-linear`}
              style={{ width: `${progress}%` }}
            />
            
            {/* Text and loading icon on top */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`relative z-10 flex items-center justify-center gap-2 transition-colors ${
                isCompleted ? 'text-white' : 'text-white/60'
              }`}>
                {isLoadingNext ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </>
                ) : (
                  'Continue'
                )}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Language Selection Bottom Sheet */}
      {showLanguageSheet && (
        <div className="fixed inset-0 z-[2000] bg-black/60 flex flex-col justify-end">
          <div className="bg-[#FFFFFF] w-full rounded-t-[24px] overflow-hidden animate-in slide-in-from-bottom-full duration-300 pb-8 sm:pb-6 sm:max-w-md sm:mx-auto">
            {/* Sheet Header */}
            <div className="p-5 flex items-center justify-between border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">Select Language</h3>
              <button 
                onClick={() => setShowLanguageSheet(false)}
                className="w-8 h-8 flex items-center justify-center text-slate-500 rounded-full bg-slate-100 active:bg-slate-200"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Languages List */}
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => {
                    setSelectedLanguage(lang);
                    setShowLanguageSheet(false);
                  }}
                  className={`w-full p-4 flex items-center justify-between rounded-xl transition-colors ${
                    selectedLanguage.id === lang.id ? 'bg-blue-50' : 'active:bg-slate-50'
                  }`}
                >
                  <div className="flex flex-col items-start gap-0.5">
                    <span className={`text-[16px] font-semibold ${selectedLanguage.id === lang.id ? 'text-[#1E90FF]' : 'text-slate-900'}`}>
                      {lang.name}
                    </span>
                    <span className="text-[13px] text-slate-500 font-medium">
                      {lang.native}
                    </span>
                  </div>
                  {selectedLanguage.id === lang.id && (
                    <Check size={20} className="text-[#1E90FF]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Owner Info Bottom Sheet */}
      {flowStep === 'owner_info' && (
        <div className="fixed inset-0 z-[2000] bg-black/60 flex flex-col justify-end">
          <div className="bg-[#FFFFFF] w-full h-[85vh] rounded-t-[24px] flex flex-col overflow-hidden animate-in slide-in-from-bottom-full duration-300 sm:max-w-md sm:mx-auto">
            {/* Sheet Header */}
            <div className="p-5 flex items-center justify-between border-b border-slate-100 shrink-0">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Customer Details</h3>
                <p className="text-sm text-slate-500">Please provide your contact information</p>
              </div>
              <button 
                onClick={() => setFlowStep('introduction')}
                className="w-8 h-8 flex items-center justify-center text-slate-500 rounded-full bg-slate-100 active:bg-slate-200"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
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

            {/* Footer Buttons */}
            <div className="p-4 border-t border-slate-100 bg-[#FFFFFF] grid grid-cols-2 gap-3 shrink-0 pb-8 sm:pb-4">
              <button 
                onClick={() => setFlowStep('introduction')}
                className="h-12 w-full rounded-xl font-bold text-slate-700 bg-slate-100 active:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setIsRestaurantLoading(true);
                  setTimeout(() => {
                    setIsRestaurantLoading(false);
                    setFlowStep('restaurant_info');
                  }, 1500);
                }}
                disabled={isRestaurantLoading}
                className="h-12 w-full rounded-xl font-bold text-white bg-[#1E90FF] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {isRestaurantLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </>
                ) : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restaurant Info Bottom Sheet */}
      {flowStep === 'restaurant_info' && (
        <div className="fixed inset-0 z-[2000] bg-black/60 flex flex-col justify-end">
          <div className="bg-[#FFFFFF] w-full h-[88vh] rounded-t-[24px] flex flex-col overflow-hidden animate-in slide-in-from-bottom-full duration-300 sm:max-w-md sm:mx-auto">
            {/* Sheet Header */}
            <div className="p-5 flex items-center justify-between border-b border-slate-100 shrink-0">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Restaurant Info</h3>
                <p className="text-sm text-slate-500">Provide details about your restaurant</p>
              </div>
              <button 
                onClick={() => setFlowStep('owner_info')}
                className="w-8 h-8 flex items-center justify-center text-slate-500 rounded-full bg-slate-100 active:bg-slate-200"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Logo Upload */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700">Restaurant Logo (1000 × 1000 pixels)</label>
                <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-500 cursor-pointer hover:bg-slate-100 hover:border-[#1E90FF] hover:text-[#1E90FF] transition-colors relative overflow-hidden">
                  {restaurantLogo ? (
                    <img src={restaurantLogo} alt="Logo preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <Upload size={24} className="mb-1" />
                      <span className="text-[10px] font-medium uppercase tracking-wider">Upload</span>
                    </>
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setRestaurantLogo(URL.createObjectURL(e.target.files[0]));
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Restaurant Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Restaurant Name</label>
                <input 
                  type="text" 
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  placeholder="Enter restaurant name"
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] outline-none transition-all"
                />
              </div>

              {/* Primary Contact */}
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Primary Contact Number</label>
                  <input 
                    type="tel" 
                    value={restaurantContact}
                    onChange={(e) => setRestaurantContact(e.target.value)}
                    placeholder="Enter support/contact number"
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] outline-none transition-all"
                  />
                </div>
                
                <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer">
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="checkbox"
                      checked={useOwnerContact}
                      onChange={(e) => setUseOwnerContact(e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="w-6 h-6 border-2 border-slate-300 rounded-md peer-checked:bg-[#1E90FF] peer-checked:border-[#1E90FF] transition-colors" />
                    <Check size={16} className="absolute text-white scale-0 peer-checked:scale-100 transition-transform" strokeWidth={3} />
                  </div>
                  <span className="text-sm font-medium text-slate-800">Use owner contact number</span>
                </label>
              </div>

              {/* Address with Map */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Restaurant Address</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500">
                    <MapPin size={20} />
                  </div>
                  <input 
                    type="text" 
                    value={restaurantAddress}
                    onChange={(e) => setRestaurantAddress(e.target.value)}
                    placeholder="Search or pin on map"
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] outline-none transition-all"
                  />
                </div>
                <div className="h-32 bg-slate-100 rounded-xl mt-3 flex items-center justify-center relative overflow-hidden border border-slate-200">
                   <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=20.5937,78.9629&zoom=4&size=400x200&sensor=false')] bg-cover bg-center opacity-50" />
                   <button className="relative z-10 px-4 py-2 bg-[#FFFFFF] rounded-lg shadow-sm font-medium flex items-center gap-2 text-sm text-slate-700 border border-slate-200 hover:bg-slate-50">
                     <MapPin size={16} className="text-red-500" /> Choose on map
                   </button>
                </div>
              </div>

              {/* Restaurant Type */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Restaurant Type</label>
                <div className="relative">
                  <select 
                    value={restaurantType}
                    onChange={(e) => setRestaurantType(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] outline-none transition-all appearance-none bg-slate-50 font-medium text-slate-900"
                  >
                    <option value="" disabled>Select Type</option>
                    <option value="Cafe">Cafe</option>
                    <option value="Cloud Kitchen">Cloud Kitchen</option>
                    <option value="Fine Dining">Fine Dining</option>
                    <option value="QSR">QSR (Quick Service Food)</option>
                    <option value="Takeaway Only">Takeaway Only</option>
                  </select>
                  <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Cuisine Types */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Cuisine Types</label>
                <div className="min-h-[48px] p-2 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap gap-2 focus-within:border-[#1E90FF] focus-within:bg-[#FFFFFF] transition-colors">
                  {cuisines.map((tag, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-[#1E90FF] text-[13px] font-medium rounded-lg">
                      {tag}
                      <button onClick={() => removeCuisine(tag)} className="hover:bg-blue-100 p-0.5 rounded-full transition-colors">
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={cuisineInput}
                    onChange={handleCuisineChange}
                    onKeyDown={handleCuisineKeyDown}
                    placeholder={cuisines.length === 0 ? "Type and press space..." : ""}
                    className="flex-1 min-w-[120px] bg-transparent text-[15px] text-slate-900 focus:outline-none placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Service Types */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Service Types</label>
                <div className="space-y-0 border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
                   <div className="flex items-center justify-between p-3.5 bg-[#FFFFFF]">
                     <span className="text-sm font-medium text-slate-800">Delivery</span>
                     <button onClick={() => setServices({...services, delivery: !services.delivery})} className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-300 ease-in-out ${services.delivery ? 'bg-[#1E90FF]' : 'bg-slate-200'}`}>
                       <div className={`w-5 h-5 rounded-full bg-[#FFFFFF] shadow-sm transform transition-transform duration-300 ease-in-out ${services.delivery ? 'translate-x-5' : 'translate-x-0'}`} />
                     </button>
                   </div>
                   <div className="flex items-center justify-between p-3.5 bg-[#FFFFFF]">
                     <span className="text-sm font-medium text-slate-800">Takeaway</span>
                     <button onClick={() => setServices({...services, takeaway: !services.takeaway})} className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-300 ease-in-out ${services.takeaway ? 'bg-[#1E90FF]' : 'bg-slate-200'}`}>
                       <div className={`w-5 h-5 rounded-full bg-[#FFFFFF] shadow-sm transform transition-transform duration-300 ease-in-out ${services.takeaway ? 'translate-x-5' : 'translate-x-0'}`} />
                     </button>
                   </div>
                   <div className="flex items-center justify-between p-3.5 bg-[#FFFFFF]">
                     <span className="text-sm font-medium text-slate-800">Dine-in</span>
                     <button onClick={() => setServices({...services, dineIn: !services.dineIn})} className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-300 ease-in-out ${services.dineIn ? 'bg-[#1E90FF]' : 'bg-slate-200'}`}>
                       <div className={`w-5 h-5 rounded-full bg-[#FFFFFF] shadow-sm transform transition-transform duration-300 ease-in-out ${services.dineIn ? 'translate-x-5' : 'translate-x-0'}`} />
                     </button>
                   </div>
                   <div className="flex items-center justify-between p-3.5 bg-[#FFFFFF]">
                     <span className="text-sm font-medium text-slate-800">Table Booking</span>
                     <button onClick={() => setServices({...services, booking: !services.booking})} className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-300 ease-in-out ${services.booking ? 'bg-[#1E90FF]' : 'bg-slate-200'}`}>
                       <div className={`w-5 h-5 rounded-full bg-[#FFFFFF] shadow-sm transform transition-transform duration-300 ease-in-out ${services.booking ? 'translate-x-5' : 'translate-x-0'}`} />
                     </button>
                   </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-4 border-t border-slate-100 bg-[#FFFFFF] grid grid-cols-2 gap-3 shrink-0 pb-8 sm:pb-4">
              <button 
                onClick={() => setFlowStep('owner_info')}
                className="h-12 w-full rounded-xl font-bold text-slate-700 bg-slate-100 active:bg-slate-200 transition-colors"
              >
                Back
              </button>
              <button 
                onClick={() => {
                  setIsDocumentsLoading(true);
                  setTimeout(() => {
                    setIsDocumentsLoading(false);
                    setFlowStep('documents');
                  }, 1500);
                }}
                disabled={isDocumentsLoading}
                className="h-12 w-full rounded-xl font-bold text-white bg-[#1E90FF] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {isDocumentsLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </>
                ) : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Documents Bottom Sheet */}
      {flowStep === 'documents' && (
        <div className="fixed inset-0 z-[2000] bg-black/60 flex flex-col justify-end">
          <div className="bg-[#FFFFFF] w-full h-[88vh] rounded-t-[24px] flex flex-col overflow-hidden animate-in slide-in-from-bottom-full duration-300 sm:max-w-md sm:mx-auto">
            {/* Sheet Header */}
            <div className="p-5 flex items-center justify-between border-b border-slate-100 shrink-0">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Legal Documents</h3>
                <p className="text-sm text-slate-500">GST and FSSAI License Details</p>
              </div>
              <button 
                onClick={() => setFlowStep('restaurant_info')}
                className="w-8 h-8 flex items-center justify-center text-slate-500 rounded-full bg-slate-100 active:bg-slate-200"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Note */}
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">Note:</span> Our team can assist you in obtaining GST and FSSAI licenses if you don't have them yet.
                </p>
              </div>

              {/* GST */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">GST Registration</label>
                  <div className="relative">
                    <select 
                      value={gstCategory}
                      onChange={(e) => setGstCategory(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] outline-none transition-all appearance-none bg-[#FFFFFF]"
                    >
                      <option value="">Select GST option</option>
                      <option value="regular">Regular GST (18%)</option>
                      <option value="composition">Composition Scheme (5%)</option>
                      <option value="no_gst">Don't have GST yet</option>
                    </select>
                    <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" />
                  </div>
                </div>

                {gstCategory === 'no_gst' && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <label className="text-sm font-semibold text-slate-700">Owner PAN Card Number</label>
                    <input 
                      type="text" 
                      value={panNumber}
                      onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                      placeholder="Enter 10-digit PAN"
                      maxLength={10}
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] outline-none transition-all uppercase"
                    />
                  </div>
                )}
              </div>

              {/* FSSAI */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">FSSAI License</label>
                  <div className="relative">
                    <select 
                      value={fssaiLicense}
                      onChange={(e) => setFssaiLicense(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] outline-none transition-all appearance-none bg-[#FFFFFF]"
                    >
                      <option value="">Select FSSAI option</option>
                      <option value="have_fssai">I have an active FSSAI license</option>
                      <option value="applied">Applied / Processing</option>
                      <option value="no_fssai">Don't have FSSAI yet</option>
                    </select>
                    <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" />
                  </div>
                </div>

                {fssaiLicense === 'have_fssai' && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <label className="text-sm font-semibold text-slate-700">FSSAI Expiry Date</label>
                    <input 
                      type="date" 
                      value={fssaiExpiry}
                      onChange={(e) => setFssaiExpiry(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF] outline-none transition-all"
                    />
                  </div>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-900 mb-2">Terms & Conditions</h4>
                <div className="p-4 bg-slate-50 text-xs text-slate-600 rounded-xl space-y-2 border border-slate-200">
                  <p>• All uploaded licenses are subject to physical backend verification by our onboarding team.</p>
                  <p>• If FSSAI or GST documents are found invalid or expired, the listing may be temporarily suspended.</p>
                  <p>• If you choose "Don't have [license] yet", your onboarding will proceed but outlet activation remains restricted until valid documents are submitted.</p>
                  <p>• Cancellation policy applies as per the partner agreement terms upon document rejection.</p>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-4 border-t border-slate-100 bg-[#FFFFFF] grid grid-cols-2 gap-3 shrink-0 pb-8 sm:pb-4">
              <button 
                onClick={() => setFlowStep('restaurant_info')}
                className="h-12 w-full rounded-xl font-bold text-slate-700 bg-slate-100 active:bg-slate-200 transition-colors"
              >
                Back
              </button>
              <button 
                onClick={() => {
                  // Simulate loading and go to pricing
                  setIsDocumentsLoading(true);
                  setTimeout(() => {
                    setIsDocumentsLoading(false);
                    setFlowStep('pricing');
                  }, 1500);
                }}
                disabled={isDocumentsLoading}
                className="h-12 w-full rounded-xl font-bold text-white bg-[#1E90FF] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {isDocumentsLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </>
                ) : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Bottom Sheet */}
      {flowStep === 'pricing' && (
        <div className="fixed inset-0 z-[2000] bg-black/60 flex flex-col justify-end">
          <div className="bg-[#FFFFFF] w-full h-[88vh] rounded-t-[24px] flex flex-col overflow-hidden animate-in slide-in-from-bottom-full duration-300 sm:max-w-md sm:mx-auto">
            {/* Sheet Header */}
            <div className="p-5 flex items-center justify-between border-b border-slate-100 shrink-0">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Pricing & Plans</h3>
                <p className="text-sm text-slate-500">Choose a subscription to continue</p>
              </div>
              <button 
                onClick={() => setFlowStep('documents')}
                className="w-8 h-8 flex items-center justify-center text-slate-500 rounded-full bg-slate-100 active:bg-slate-200"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Special Offer Highlight */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl p-4 text-white shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Check size={20} className="text-blue-200" />
                  <h4 className="font-bold text-lg">0% Commission</h4>
                </div>
                <p className="text-blue-100 text-sm">Enjoy zero commission on all your direct food offers and promotions to customers!</p>
              </div>

              {/* Platform Fees */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Platform Fees (Delivery)</h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-sm text-left text-slate-600">
                    <thead className="bg-slate-50 text-slate-700">
                      <tr>
                        <th className="px-4 py-3 font-semibold border-b">Order Value</th>
                        <th className="px-4 py-3 font-semibold border-b text-right">Fee (+18% GST)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="px-4 py-3">₹0 - ₹200</td>
                        <td className="px-4 py-3 text-right font-medium text-slate-900">₹10</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3">₹201 - ₹400</td>
                        <td className="px-4 py-3 text-right font-medium text-slate-900">₹20</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3">₹401 and above</td>
                        <td className="px-4 py-3 text-right font-medium text-slate-900">₹30</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Subscription Plans */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Subscription Plans</h4>
                <div className="grid gap-3">
                  {/* Free Plan */}
                  <div 
                    onClick={() => setSelectedPlan('free')}
                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPlan === 'free' ? 'border-[#1E90FF] bg-blue-50/50' : 'border-slate-200 hover:border-blue-200'}`}
                  >
                    {selectedPlan === 'free' && <div className="absolute top-4 right-4 text-[#1E90FF]"><Check size={20} /></div>}
                    <h5 className="font-bold text-slate-900 text-lg mb-1">Pay As You Go</h5>
                    <div className="text-2xl font-bold text-[#1E90FF] mb-2">₹0 <span className="text-sm font-normal text-slate-500">/ month</span></div>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>✓ Standard visibility</li>
                      <li>✓ Basic analytics</li>
                      <li>✓ Support within 48h</li>
                    </ul>
                  </div>

                  {/* Pro Plan */}
                  <div 
                    onClick={() => setSelectedPlan('pro')}
                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPlan === 'pro' ? 'border-[#1E90FF] bg-blue-50/50 shadow-md shadow-blue-100' : 'border-slate-200 hover:border-blue-200'}`}
                  >
                    {selectedPlan === 'pro' && <div className="absolute top-4 right-4 text-[#1E90FF]"><Check size={20} /></div>}
                    <div className="absolute -top-3 left-4 bg-gradient-to-r from-orange-400 to-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Recommended</div>
                    <h5 className="font-bold text-slate-900 text-lg mb-1 mt-1">Growth Plan</h5>
                    <div className="text-2xl font-bold text-[#1E90FF] mb-2">₹1999 <span className="text-sm font-normal text-slate-500">/ month</span></div>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>✓ Priority listing & tags</li>
                      <li>✓ Advanced marketing tools</li>
                      <li>✓ Dedicated account manager</li>
                      <li>✓ Priority 24/7 support</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-4 border-t border-slate-100 bg-[#FFFFFF] grid grid-cols-2 gap-3 shrink-0 pb-8 sm:pb-4">
              <button 
                onClick={() => setFlowStep('documents')}
                className="h-12 w-full rounded-xl font-bold text-slate-700 bg-slate-100 active:bg-slate-200 transition-colors"
              >
                Back
              </button>
              <button 
                onClick={() => {
                  if (!selectedPlan) return;
                  setIsPricingLoading(true);
                  setTimeout(() => {
                    setIsPricingLoading(false);
                    setFlowStep('agreement');
                  }, 1500);
                }}
                disabled={!selectedPlan || isPricingLoading}
                className="h-12 w-full rounded-xl font-bold text-white bg-[#1E90FF] disabled:bg-slate-300 disabled:cursor-not-allowed active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {isPricingLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </>
                ) : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Agreement, Processing, and Success Views */}
      {(flowStep === 'agreement' || flowStep === 'processing' || flowStep === 'success') && (
        <div className="fixed inset-0 z-[2000] bg-black/60 flex flex-col justify-end">
          <div className="bg-[#FFFFFF] w-full h-[88vh] rounded-t-[24px] flex flex-col overflow-hidden animate-in slide-in-from-bottom-full duration-300 sm:max-w-md sm:mx-auto">
            {flowStep === 'agreement' && (
              <>
                <div className="p-5 flex items-center justify-between border-b border-slate-100 shrink-0">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Partner Agreement</h3>
                    <p className="text-sm text-slate-500">Please review and accept our terms</p>
                  </div>
                  <button 
                    onClick={() => setFlowStep('pricing')}
                    className="w-8 h-8 flex items-center justify-center text-slate-500 rounded-full bg-slate-100 active:bg-slate-200"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4">
                  <div className="flex-1 bg-slate-100 rounded-xl border border-slate-200 flex flex-col items-center justify-center text-slate-400 p-8 text-center relative overflow-hidden">
                    <FileText size={48} className="mb-4 text-slate-300" />
                    <p className="font-semibold text-slate-600 mb-2">Agreement_v2.1.pdf</p>
                    <p className="text-sm text-slate-500 mb-6">This document contains all legal terms and conditions for partnering with our platform.</p>
                    <button className="flex items-center gap-2 px-6 py-3 bg-[#FFFFFF] border border-slate-200 text-slate-700 rounded-xl font-semibold shadow-sm active:bg-slate-50">
                      <Download size={18} />
                      Download PDF
                    </button>
                    
                    {/* Simulated blurry text background for "PDF viewer" effect */}
                    <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MiIgaGVpZ2h0PSI0MiI+PHBhdGggZD0iTTAgMGg0MnY0MkgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDExbDQyLTEwdjEwTDAlMjd6IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9Ii4wNSIvPjwvc3ZnPg==')] bg-repeat" />
                  </div>
                </div>

                <div className="p-4 border-t border-slate-100 bg-[#FFFFFF] grid grid-cols-2 gap-3 shrink-0 pb-8 sm:pb-4">
                  <button 
                    onClick={() => {
                      if (confirm('Are you sure you want to reject the agreement and cancel onboarding?')) {
                        onCancel();
                      }
                    }}
                    className="h-12 w-full rounded-xl font-bold text-red-600 bg-red-50 active:bg-red-100 transition-colors"
                  >
                    Reject & Cancel
                  </button>
                  <button 
                    onClick={() => {
                      setFlowStep('processing');
                      setTimeout(() => {
                        setFlowStep('success');
                      }, 3000);
                    }}
                    className="h-12 w-full rounded-xl font-bold text-white bg-[#1E90FF] active:scale-[0.98] transition-all"
                  >
                    Accept & Sign
                  </button>
                </div>
              </>
            )}

            {flowStep === 'processing' && (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
                <div className="relative w-24 h-24 mb-8">
                  <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
                  <div className="absolute inset-0 border-4 border-[#1E90FF] rounded-full border-t-transparent animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center text-[#1E90FF]">
                    <FileText size={24} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Processing Details</h3>
                <p className="text-slate-500">Please wait while we verify your information and setup your partner account...</p>
              </div>
            )}

            {flowStep === 'success' && (
              <div className="flex-1 flex flex-col animate-in fade-in zoom-in-95 duration-500">
                <div className="p-5 border-b border-slate-100 shrink-0 text-center pt-8">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-green-50">
                    <Check size={40} className="stroke-[3]" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Onboarding Successful!</h3>
                  <p className="text-slate-500 text-sm">Welcome aboard! Your restaurant profile is almost ready.</p>
                </div>
                
                <div className="flex-1 overflow-y-auto p-5">
                  <h4 className="font-bold text-slate-900 mb-4 px-1 text-lg">What's Next?</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-4 p-4 rounded-xl border border-blue-100 bg-blue-50/50">
                      <div className="w-8 h-8 rounded-full bg-[#1E90FF] text-white flex items-center justify-center font-bold text-sm shrink-0">1</div>
                      <div>
                        <p className="font-bold text-slate-900">Setup Outlet Information</p>
                        <p className="text-sm text-slate-600 mt-0.5">Complete your opening/closing hours and bank account details.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 bg-[#FFFFFF]">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-bold text-sm shrink-0">2</div>
                      <div>
                        <p className="font-bold text-slate-400">Digital Menu Creation</p>
                        <p className="text-sm text-slate-400 mt-0.5">Upload menu images or enter items manually for customers.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 bg-[#FFFFFF]">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-bold text-sm shrink-0">3</div>
                      <div>
                        <p className="font-bold text-slate-400">Go Live!</p>
                        <p className="text-sm text-slate-400 mt-0.5">Start receiving orders and table bookings directly.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-slate-100 bg-[#FFFFFF] shrink-0 pb-8 sm:pb-4">
                  <button 
                    onClick={onComplete}
                    className="h-14 w-full rounded-xl font-bold text-white bg-[#1E90FF] active:scale-[0.98] transition-all shadow-md shadow-blue-500/20 text-lg"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
