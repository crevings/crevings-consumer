import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Upload, 
  MapPin, 
  ChevronDown, 
  X,
  Store,
  ChefHat,
  FileText,
  Eye,
  EyeOff
} from 'lucide-react';

interface OnboardingViewProps {
  onComplete: () => void;
  onBack: () => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Permissions State removed

  // Step 1 State
  const [ownershipType, setOwnershipType] = useState('');
  const [legalType, setLegalType] = useState('');
  const [cinNumber, setCinNumber] = useState('');
  const [companyPan, setCompanyPan] = useState('');
  const [panCard, setPanCard] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [headOfficeAddress, setHeadOfficeAddress] = useState('');
  const [managerName, setManagerName] = useState('');
  const [managerPhone, setManagerPhone] = useState('');
  const [managerEmail, setManagerEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [sameAsContact, setSameAsContact] = useState(true);
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [sameAsCorporatePhone, setSameAsCorporatePhone] = useState(true);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState(['', '', '', '', '', '']);
  const [emailOtp, setEmailOtp] = useState(['', '', '', '', '', '']);
  const [whatsappOtp, setWhatsappOtp] = useState(['', '', '', '', '', '']);
  const [showPhoneOtp, setShowPhoneOtp] = useState(false);
  const [showEmailOtp, setShowEmailOtp] = useState(false);
  const [showWhatsappOtp, setShowWhatsappOtp] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [whatsappVerified, setWhatsappVerified] = useState(false);
  const [ownerPhoto, setOwnerPhoto] = useState<string | null>(null);

  const phoneOtpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const emailOtpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const whatsappOtpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Step 2 State
  const [restaurantLogo, setRestaurantLogo] = useState<string | null>(null);
  const [indoorPhoto, setIndoorPhoto] = useState<string | null>(null);
  const [outdoorPhoto, setOutdoorPhoto] = useState<string | null>(null);
  const [kitchenPhoto, setKitchenPhoto] = useState<string | null>(null);
  const [restaurantName, setRestaurantName] = useState('');
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [cuisineInput, setCuisineInput] = useState('');
  const [category, setCategory] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [gstCategory, setGstCategory] = useState('');
  const [fssai, setFssai] = useState('');
  const [noFssai, setNoFssai] = useState(false);
  const [contactNumber, setContactNumber] = useState('');
  const [restaurantEmail, setRestaurantEmail] = useState('');
  
  const [services, setServices] = useState({
    delivery: true,
    takeaway: true,
    dineIn: false,
    booking: false
  });

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPartnerAgreement, setAcceptPartnerAgreement] = useState(false);
  const [acceptPayoutPolicy, setAcceptPayoutPolicy] = useState(false);
  const [acceptPrivacyPolicy, setAcceptPrivacyPolicy] = useState(false);
  const [acceptAll, setAcceptAll] = useState(false);

  useEffect(() => {
    if (acceptTerms && acceptPartnerAgreement && acceptPayoutPolicy && acceptPrivacyPolicy) {
      setAcceptAll(true);
    } else {
      setAcceptAll(false);
    }
  }, [acceptTerms, acceptPartnerAgreement, acceptPayoutPolicy, acceptPrivacyPolicy]);

  const handleAcceptAll = (checked: boolean) => {
    setAcceptAll(checked);
    setAcceptTerms(checked);
    setAcceptPartnerAgreement(checked);
    setAcceptPayoutPolicy(checked);
    setAcceptPrivacyPolicy(checked);
  };

  const Card = ({ title, children }: { title?: string, children: React.ReactNode }) => (
    <div className="bg-[#FFFFFF] rounded-[18px] p-4 border border-[#E5E7EB] shadow-sm mb-4">
      {title && <h3 className="text-[16px] font-bold text-slate-900 mb-4">{title}</h3>}
      {children}
    </div>
  );

  const InputField = ({ label, placeholder = "", type = "text", value, onChange, disabled, maxLength, className = "" }: any) => (
    <div className="space-y-1.5 mb-4">
      <label className="text-[13px] font-medium text-slate-600">{label}</label>
      <input 
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        maxLength={maxLength}
        className={`w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[15px] text-slate-900 focus:outline-none focus:border-[#1E90FF] transition-colors focus:bg-[#FFFFFF] ${className}`}
      />
    </div>
  );

  const Toggle = ({ checked, onChange, label, description }: { checked: boolean, onChange: () => void, label: string, description?: string }) => (
    <div className="flex items-center justify-between py-4">
      <div className="flex flex-col pr-4">
        <span className="text-[15px] font-semibold text-slate-800">{label}</span>
        {description && <span className="text-[13px] text-slate-500 mt-0.5 leading-snug">{description}</span>}
      </div>
      <button 
        onClick={onChange}
        className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 ease-in-out shrink-0 ${checked ? 'bg-[#1E90FF]' : 'bg-slate-200'}`}
      >
        <div className={`w-5 h-5 rounded-full bg-[#FFFFFF] shadow-sm transform transition-transform duration-300 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );

  const PhotoUpload = ({ label, photo, setPhoto }: { label: string, photo: string | null, setPhoto: (val: string | null) => void }) => (
    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50 mb-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/png, image/jpeg';
      input.onchange = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
          if (file.size > 15 * 1024 * 1024) {
            alert('File size exceeds 15MB limit.');
            return;
          }
          const reader = new FileReader();
          reader.onload = (event) => {
            setPhoto(event.target?.result as string);
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    }}>
      {photo ? (
        <img src={photo} alt={label} className="w-full h-32 rounded-xl object-cover mb-3 shadow-sm" />
      ) : (
        <div className="w-16 h-16 bg-[#FFFFFF] rounded-full flex items-center justify-center text-[#1E90FF] shadow-sm mb-3">
          <Upload size={24} />
        </div>
      )}
      <p className="text-[14px] font-semibold text-[#1E90FF]">{photo ? `Change ${label}` : `Upload ${label}`}</p>
      <p className="text-[12px] text-slate-400 mt-1">PNG, JPG up to 15MB</p>
    </div>
  );

  const handleOtpChange = (
    value: string, 
    index: number, 
    type: 'phone' | 'email' | 'whatsapp'
  ) => {
    if (isNaN(Number(value))) return;

    const newOtp = type === 'phone' ? [...phoneOtp] : type === 'email' ? [...emailOtp] : [...whatsappOtp];
    newOtp[index] = value.substring(value.length - 1);
    
    if (type === 'phone') {
      setPhoneOtp(newOtp);
      if (value && index < 5) phoneOtpRefs.current[index + 1]?.focus();
      if (newOtp.join('').length === 6) {
        setTimeout(() => setPhoneVerified(true), 500);
      }
    } else if (type === 'email') {
      setEmailOtp(newOtp);
      if (value && index < 5) emailOtpRefs.current[index + 1]?.focus();
      if (newOtp.join('').length === 6) {
        setTimeout(() => setEmailVerified(true), 500);
      }
    } else {
      setWhatsappOtp(newOtp);
      if (value && index < 5) whatsappOtpRefs.current[index + 1]?.focus();
      if (newOtp.join('').length === 6) {
        setTimeout(() => setWhatsappVerified(true), 500);
      }
    }
  };

  const handleOtpKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>, 
    index: number, 
    type: 'phone' | 'email' | 'whatsapp'
  ) => {
    const otpArray = type === 'phone' ? phoneOtp : type === 'email' ? emailOtp : whatsappOtp;
    const refs = type === 'phone' ? phoneOtpRefs : type === 'email' ? emailOtpRefs : whatsappOtpRefs;
    
    if (e.key === 'Backspace' && !otpArray[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const handleCuisineKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
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

  const removeCuisine = (cuisineToRemove: string) => {
    setCuisines(cuisines.filter(c => c !== cuisineToRemove));
  };

  const renderStep1 = () => (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1">
          Account Details
        </h1>
        <p className="text-[14px] text-slate-500">
          Tell us about your business entity.
        </p>
      </div>
      <Card title="Account Details">
        <div className="space-y-1.5 mb-4">
          <label className="text-[13px] font-medium text-slate-600">Ownership Type</label>
          <div className="flex gap-3">
            {['Individual', 'Company'].map(type => (
              <button
                key={type}
                onClick={() => setOwnershipType(type)}
                className={`flex-1 py-3 rounded-xl text-[14px] font-medium border transition-all ${ownershipType === type ? 'bg-[#1E90FF] text-white border-[#1E90FF]' : 'bg-[#FFFFFF] text-slate-700 border-slate-200'}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {ownershipType === 'Individual' && (
          <>
            <InputField 
              label="Owner Name" 
              value={ownerName}
              onChange={(e: any) => setOwnerName(e.target.value)}
              placeholder="e.g. John Doe" 
            />

            <InputField 
              label="PAN Card Number" 
              value={panCard}
              onChange={(e: any) => setPanCard(e.target.value.toUpperCase())}
              placeholder="ABCDE1234F" 
              maxLength={10}
            />

            <div className="space-y-1.5 mb-4">
              <label className="text-[13px] font-medium text-slate-600">Phone Number</label>
              <div className="relative">
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number" 
                  maxLength={10}
                  disabled={phoneVerified}
                  className={`w-full h-12 px-4 pr-28 border rounded-xl transition-colors text-[15px] font-medium focus:outline-none ${phoneVerified ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'border-slate-200 focus:border-[#1E90FF] bg-slate-50 text-slate-900 focus:bg-[#FFFFFF]'}`} 
                />
                {!phoneVerified && (
                  <button 
                    onClick={() => setShowPhoneOtp(true)}
                    disabled={phone.length < 10}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-xl font-semibold text-[13px] transition-all ${phone.length === 10 ? 'bg-[#1E90FF] text-white active:scale-95' : 'bg-slate-100 text-slate-400'}`}
                  >
                    {showPhoneOtp ? 'Resend OTP' : 'Send OTP'}
                  </button>
                )}
              </div>
            </div>

            {showPhoneOtp && !phoneVerified && (
              <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-4 animate-in fade-in zoom-in-95">
                <p className="text-[13px] font-medium text-slate-600 text-center">We sent OTP on WhatsApp to +91 {phone}</p>
                <div className="flex justify-between gap-2">
                  {phoneOtp.map((digit, index) => (
                    <input
                      key={`phone-${index}`}
                      ref={(el) => (phoneOtpRefs.current[index] = el)}
                      type="tel"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, index, 'phone')}
                      onKeyDown={(e) => handleOtpKeyDown(e, index, 'phone')}
                      className="w-10 h-12 text-center text-xl font-bold rounded-xl border border-slate-200 bg-[#FFFFFF] text-slate-900 focus:border-[#1E90FF] focus:outline-none shadow-sm"
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-1.5 mb-4">
              <label className="text-[13px] font-medium text-slate-600">Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@restaurant.com" 
                  disabled={emailVerified}
                  className={`w-full h-12 px-4 pr-28 border rounded-xl transition-colors text-[15px] font-medium focus:outline-none ${emailVerified ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'border-slate-200 focus:border-[#1E90FF] bg-slate-50 text-slate-900 focus:bg-[#FFFFFF]'}`} 
                />
                {!emailVerified && (
                  <button 
                    onClick={() => setShowEmailOtp(true)}
                    disabled={!email.includes('@')}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-xl font-semibold text-[13px] transition-all ${email.includes('@') ? 'bg-[#1E90FF] text-white active:scale-95' : 'bg-slate-100 text-slate-400'}`}
                  >
                    {showEmailOtp ? 'Resend OTP' : 'Send OTP'}
                  </button>
                )}
              </div>
            </div>

            {showEmailOtp && !emailVerified && (
              <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-4 animate-in fade-in zoom-in-95">
                <p className="text-[13px] font-medium text-slate-600 text-center">We sent OTP to {email}</p>
                <div className="flex justify-between gap-2">
                  {emailOtp.map((digit, index) => (
                    <input
                      key={`email-${index}`}
                      ref={(el) => (emailOtpRefs.current[index] = el)}
                      type="tel"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, index, 'email')}
                      onKeyDown={(e) => handleOtpKeyDown(e, index, 'email')}
                      className="w-10 h-12 text-center text-xl font-bold rounded-xl border border-slate-200 bg-[#FFFFFF] text-slate-900 focus:border-[#1E90FF] focus:outline-none shadow-sm"
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-1.5 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={sameAsContact} 
                  onChange={(e) => setSameAsContact(e.target.checked)} 
                  className="w-4 h-4 rounded border-slate-300 text-[#1E90FF] focus:ring-[#1E90FF]" 
                />
                <span className="text-[13px] font-medium text-slate-700">WhatsApp number same as contact number</span>
              </label>
            </div>

            {!sameAsContact && (
              <>
                <div className="space-y-1.5 mb-4">
                  <label className="text-[13px] font-medium text-slate-600">WhatsApp Number</label>
                  <div className="relative">
                    <input 
                      type="tel" 
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="10-digit WhatsApp number" 
                      maxLength={10}
                      disabled={whatsappVerified}
                      className={`w-full h-12 px-4 pr-28 border rounded-xl transition-colors text-[15px] font-medium focus:outline-none ${whatsappVerified ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'border-slate-200 focus:border-[#1E90FF] bg-slate-50 text-slate-900 focus:bg-[#FFFFFF]'}`} 
                    />
                    {!whatsappVerified && (
                      <button 
                        onClick={() => setShowWhatsappOtp(true)}
                        disabled={whatsappNumber.length < 10}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-xl font-semibold text-[13px] transition-all ${whatsappNumber.length === 10 ? 'bg-[#1E90FF] text-white active:scale-95' : 'bg-slate-100 text-slate-400'}`}
                      >
                        {showWhatsappOtp ? 'Resend OTP' : 'Send OTP'}
                      </button>
                    )}
                  </div>
                </div>

                {showWhatsappOtp && !whatsappVerified && (
                  <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-4 animate-in fade-in zoom-in-95">
                    <p className="text-[13px] font-medium text-slate-600 text-center">We sent OTP on WhatsApp to +91 {whatsappNumber}</p>
                    <div className="flex justify-between gap-2">
                      {whatsappOtp.map((digit, index) => (
                        <input
                          key={`whatsapp-${index}`}
                          ref={(el) => (whatsappOtpRefs.current[index] = el)}
                          type="tel"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(e.target.value, index, 'whatsapp')}
                          onKeyDown={(e) => handleOtpKeyDown(e, index, 'whatsapp')}
                          className="w-10 h-12 text-center text-xl font-bold rounded-xl border border-slate-200 bg-[#FFFFFF] text-slate-900 focus:border-[#1E90FF] focus:outline-none shadow-sm"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="mt-6 pt-6 border-t border-slate-100">
              <h4 className="text-[15px] font-bold text-slate-900 mb-4">Owner Photo</h4>
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50 mb-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e: any) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setOwnerPhoto(event.target?.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                };
                input.click();
              }}>
                {ownerPhoto ? (
                  <img src={ownerPhoto} alt="Owner" className="w-24 h-24 rounded-full object-cover mb-3 border-4 border-white shadow-sm" />
                ) : (
                  <div className="w-16 h-16 bg-[#FFFFFF] rounded-full flex items-center justify-center text-[#1E90FF] shadow-sm mb-3">
                    <Upload size={24} />
                  </div>
                )}
                <p className="text-[14px] font-semibold text-[#1E90FF]">{ownerPhoto ? 'Change Photo' : 'Upload Owner Photo'}</p>
                <p className="text-[12px] text-slate-400 mt-1">Clear front-facing photo</p>
              </div>
            </div>
          </>
        )}

        {ownershipType === 'Company' && (
          <>
            <div className="space-y-1.5 mb-4">
              <label className="text-[13px] font-medium text-slate-600">Legal Type</label>
              <div className="relative">
                <select 
                  value={legalType}
                  onChange={(e) => setLegalType(e.target.value)}
                  className="w-full h-12 px-4 border border-slate-200 rounded-xl appearance-none focus:border-[#1E90FF] bg-slate-50 focus:bg-[#FFFFFF] transition-colors text-[15px] font-medium text-slate-900 focus:outline-none"
                >
                  <option value="" disabled>Select Legal Type</option>
                  <option value="Private Limited">Private Limited</option>
                  <option value="Limited">Limited</option>
                  <option value="LLP">LLP</option>
                </select>
                <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {legalType && (
              <>
                <InputField 
                  label={legalType === 'LLP' ? 'LLPIN Number' : 'CIN Number'} 
                  value={cinNumber}
                  onChange={(e: any) => setCinNumber(e.target.value.toUpperCase())}
                  placeholder={legalType === 'LLP' ? 'AAA-1234' : 'U12345MH2023PTC123456'} 
                  maxLength={21}
                />
                <InputField 
                  label="Company PAN Number" 
                  value={companyPan}
                  onChange={(e: any) => setCompanyPan(e.target.value.toUpperCase())}
                  placeholder="ABCDE1234F" 
                  maxLength={10}
                />
              </>
            )}

            <InputField 
              label="Company Name" 
              value={ownerName}
              onChange={(e: any) => setOwnerName(e.target.value)}
              placeholder="e.g. Foodies Pvt Ltd" 
            />
            <InputField 
              label="Brand Name" 
              value={brandName}
              onChange={(e: any) => setBrandName(e.target.value)}
              placeholder="e.g. Domino's" 
            />

            <div className="space-y-1.5 mb-4">
              <label className="text-[13px] font-medium text-slate-600">Corporate Phone</label>
              <div className="relative">
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number" 
                  maxLength={10}
                  disabled={phoneVerified}
                  className={`w-full h-12 px-4 pr-28 border rounded-xl transition-colors text-[15px] font-medium focus:outline-none ${phoneVerified ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'border-slate-200 focus:border-[#1E90FF] bg-slate-50 text-slate-900 focus:bg-[#FFFFFF]'}`} 
                />
                {!phoneVerified && (
                  <button 
                    onClick={() => setShowPhoneOtp(true)}
                    disabled={phone.length < 10}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-xl font-semibold text-[13px] transition-all ${phone.length === 10 ? 'bg-[#1E90FF] text-white active:scale-95' : 'bg-slate-100 text-slate-400'}`}
                  >
                    {showPhoneOtp ? 'Resend OTP' : 'Send OTP'}
                  </button>
                )}
              </div>
            </div>

            {showPhoneOtp && !phoneVerified && (
              <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-4 animate-in fade-in zoom-in-95">
                <p className="text-[13px] font-medium text-slate-600 text-center">We sent OTP on WhatsApp to +91 {phone}</p>
                <div className="flex justify-between gap-2">
                  {phoneOtp.map((digit, index) => (
                    <input
                      key={`phone-${index}`}
                      ref={(el) => (phoneOtpRefs.current[index] = el)}
                      type="tel"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, index, 'phone')}
                      onKeyDown={(e) => handleOtpKeyDown(e, index, 'phone')}
                      className="w-10 h-12 text-center text-xl font-bold rounded-xl border border-slate-200 bg-[#FFFFFF] text-slate-900 focus:border-[#1E90FF] focus:outline-none shadow-sm"
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-1.5 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={sameAsCorporatePhone} 
                  onChange={(e) => setSameAsCorporatePhone(e.target.checked)} 
                  className="w-4 h-4 rounded border-slate-300 text-[#1E90FF] focus:ring-[#1E90FF]" 
                />
                <span className="text-[13px] font-medium text-slate-700">Registration number same as corporate phone</span>
              </label>
            </div>

            {!sameAsCorporatePhone && (
              <InputField 
                label="Registration Number (Login ID)" 
                value={registrationNumber}
                onChange={(e: any) => setRegistrationNumber(e.target.value)}
                placeholder="10-digit mobile number" 
                type="tel"
                maxLength={10}
              />
            )}

            <div className="space-y-1.5 mb-4">
              <label className="text-[13px] font-medium text-slate-600">Corporate Email</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="corporate@company.com" 
                  disabled={emailVerified}
                  className={`w-full h-12 px-4 pr-28 border rounded-xl transition-colors text-[15px] font-medium focus:outline-none ${emailVerified ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'border-slate-200 focus:border-[#1E90FF] bg-slate-50 text-slate-900 focus:bg-[#FFFFFF]'}`} 
                />
                {!emailVerified && (
                  <button 
                    onClick={() => setShowEmailOtp(true)}
                    disabled={!email.includes('@')}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-xl font-semibold text-[13px] transition-all ${email.includes('@') ? 'bg-[#1E90FF] text-white active:scale-95' : 'bg-slate-100 text-slate-400'}`}
                  >
                    {showEmailOtp ? 'Resend OTP' : 'Send OTP'}
                  </button>
                )}
              </div>
            </div>

            {showEmailOtp && !emailVerified && (
              <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-4 animate-in fade-in zoom-in-95">
                <p className="text-[13px] font-medium text-slate-600 text-center">We sent OTP to {email}</p>
                <div className="flex justify-between gap-2">
                  {emailOtp.map((digit, index) => (
                    <input
                      key={`email-${index}`}
                      ref={(el) => (emailOtpRefs.current[index] = el)}
                      type="tel"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, index, 'email')}
                      onKeyDown={(e) => handleOtpKeyDown(e, index, 'email')}
                      className="w-10 h-12 text-center text-xl font-bold rounded-xl border border-slate-200 bg-[#FFFFFF] text-slate-900 focus:border-[#1E90FF] focus:outline-none shadow-sm"
                    />
                  ))}
                </div>
              </div>
            )}

            <InputField 
              label="Head Office Address" 
              value={headOfficeAddress}
              onChange={(e: any) => setHeadOfficeAddress(e.target.value)}
              placeholder="Full address" 
            />

            <div className="mt-6 pt-6 border-t border-slate-100">
              <h4 className="text-[15px] font-bold text-slate-900 mb-4">Authorized Manager</h4>
              <InputField 
                label="Manager Name" 
                value={managerName}
                onChange={(e: any) => setManagerName(e.target.value)}
                placeholder="e.g. Rahul Verma" 
              />
              <InputField 
                label="Manager Phone" 
                value={managerPhone}
                onChange={(e: any) => setManagerPhone(e.target.value)}
                placeholder="10-digit mobile number" 
                type="tel" 
                maxLength={10} 
              />
              <InputField 
                label="Manager Email" 
                value={managerEmail}
                onChange={(e: any) => setManagerEmail(e.target.value)}
                placeholder="manager@company.com" 
                type="email" 
              />
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100">
              <h4 className="text-[15px] font-bold text-slate-900 mb-4">Owner Photo</h4>
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50 mb-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e: any) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setOwnerPhoto(event.target?.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                };
                input.click();
              }}>
                {ownerPhoto ? (
                  <img src={ownerPhoto} alt="Owner" className="w-24 h-24 rounded-full object-cover mb-3 border-4 border-white shadow-sm" />
                ) : (
                  <div className="w-16 h-16 bg-[#FFFFFF] rounded-full flex items-center justify-center text-[#1E90FF] shadow-sm mb-3">
                    <Upload size={24} />
                  </div>
                )}
                <p className="text-[14px] font-semibold text-[#1E90FF]">{ownerPhoto ? 'Change Photo' : 'Upload Owner Photo'}</p>
                <p className="text-[12px] text-slate-400 mt-1">Clear front-facing photo</p>
              </div>
            </div>
          </>
        )}

        <div className="space-y-1.5 mb-4 mt-6">
          <label className="text-[13px] font-medium text-slate-600">Create Password</label>
          <div className="relative">
            <input 
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full h-12 px-4 pr-12 border border-slate-200 rounded-xl focus:border-[#1E90FF] bg-slate-50 transition-colors text-[15px] font-medium text-slate-900 focus:outline-none focus:bg-[#FFFFFF]" 
            />
            <button 
              onClick={() => setShowPassword(!showPassword)} 
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="text-xs text-slate-500 space-y-1 ml-1 mt-2">
            <p className={password.length >= 8 ? 'text-emerald-500' : ''}>• Minimum 8 characters</p>
            <p className={/\d/.test(password) ? 'text-emerald-500' : ''}>• At least 1 number</p>
            <p className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-emerald-500' : ''}>• At least 1 special character</p>
          </div>
        </div>
      </Card>

      <button 
        onClick={() => {
          setRestaurantEmail(email);
          setStep(2);
        }}
        disabled={!ownershipType || !ownerName || !phoneVerified || !emailVerified || !password}
        className={`w-full h-[52px] rounded-[16px] font-semibold text-[16px] flex items-center justify-center transition-all mt-6 ${
          ownershipType && ownerName && phoneVerified && emailVerified && password 
            ? 'bg-[#1E90FF] text-[#FFFFFF] active:scale-[0.98]' 
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
        }`}
      >
        Continue
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <Card title="Basic Information">
        {/* Logo Upload */}
        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50 mb-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/png, image/jpeg';
          input.onchange = (e: any) => {
            const file = e.target.files?.[0];
            if (file) {
              if (file.size > 15 * 1024 * 1024) {
                alert('File size exceeds 15MB limit.');
                return;
              }
              const img = new Image();
              const objectUrl = URL.createObjectURL(file);
              img.onload = () => {
                if (img.width > 1000 || img.height > 1000) {
                  alert('Image dimensions must be 1000x1000 pixels or smaller.');
                  URL.revokeObjectURL(objectUrl);
                  return;
                }
                const reader = new FileReader();
                reader.onload = (event) => {
                  setRestaurantLogo(event.target?.result as string);
                };
                reader.readAsDataURL(file);
                URL.revokeObjectURL(objectUrl);
              };
              img.src = objectUrl;
            }
          };
          input.click();
        }}>
          {restaurantLogo ? (
            <img src={restaurantLogo} alt="Restaurant Logo" className="w-24 h-24 rounded-full object-cover mb-3 border-4 border-white shadow-sm" />
          ) : (
            <div className="w-16 h-16 bg-[#FFFFFF] rounded-full flex items-center justify-center text-[#1E90FF] shadow-sm mb-3">
              <Upload size={24} />
            </div>
          )}
          <p className="text-[14px] font-semibold text-[#1E90FF]">{restaurantLogo ? 'Change Logo' : 'Upload Restaurant Logo'}</p>
          <p className="text-[12px] text-slate-400 mt-1">PNG, JPG up to 15MB (Max 1000x1000px)</p>
        </div>

        <InputField 
          label="Restaurant Name" 
          value={restaurantName}
          onChange={(e: any) => setRestaurantName(e.target.value)}
          placeholder="e.g. Gourmet Kitchen" 
        />

        <div className="space-y-1.5 mb-4">
          <label className="text-[13px] font-medium text-slate-600">Restaurant Type</label>
          <div className="relative">
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-12 px-4 border border-slate-200 rounded-xl appearance-none focus:border-[#1E90FF] bg-slate-50 focus:bg-[#FFFFFF] transition-colors text-[15px] font-medium text-slate-900 focus:outline-none"
            >
              <option value="" disabled>Select Type</option>
              <option value="Cafe">Cafe</option>
              <option value="Cloud Kitchen">Cloud Kitchen</option>
              <option value="Fine Dining">Fine Dining</option>
              <option value="QSR">QSR</option>
              <option value="Takeaway Only">Takeaway Only</option>
            </select>
            <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-1.5 mb-4">
          <label className="text-[13px] font-medium text-slate-600">Cuisine Types</label>
          <div className="min-h-[48px] border border-slate-200 rounded-xl p-2 focus-within:border-[#1E90FF] bg-slate-50 focus-within:bg-[#FFFFFF] transition-colors flex flex-wrap gap-2 items-center">
            {cuisines.map(cuisine => (
              <span key={cuisine} className="px-3 py-1.5 bg-[#FFFFFF] border border-slate-200 text-slate-700 rounded-full text-[13px] font-medium flex items-center gap-1 shadow-sm">
                {cuisine}
                <button onClick={() => removeCuisine(cuisine)} className="text-slate-400 hover:text-slate-600"><X size={14} /></button>
              </span>
            ))}
            <input 
              type="text" 
              value={cuisineInput}
              onChange={handleCuisineChange}
              onKeyDown={handleCuisineKeyDown}
              placeholder={cuisines.length === 0 ? "Type and press space..." : ""}
              className="flex-1 min-w-[120px] h-8 bg-transparent text-[14px] font-medium text-slate-900 focus:outline-none px-2" 
            />
          </div>
        </div>
      </Card>

      <Card title="Restaurant Photos">
        <PhotoUpload label="Indoor Photo" photo={indoorPhoto} setPhoto={setIndoorPhoto} />
        <PhotoUpload label="Outdoor Photo" photo={outdoorPhoto} setPhoto={setOutdoorPhoto} />
        <PhotoUpload label="Kitchen Photo" photo={kitchenPhoto} setPhoto={setKitchenPhoto} />
      </Card>

      <Card title="Address Details">
        <InputField 
          label="Street Address" 
          value={street}
          onChange={(e: any) => setStreet(e.target.value)}
          placeholder="Full street address" 
        />
        <InputField 
          label="City" 
          value={city}
          onChange={(e: any) => setCity(e.target.value)}
          placeholder="City" 
        />
        <InputField 
          label="Pincode" 
          value={pincode}
          onChange={(e: any) => setPincode(e.target.value)}
          placeholder="Pincode" 
        />
        <div className="space-y-1.5 mb-4">
          <label className="text-[13px] font-medium text-slate-600">State</label>
          <div className="relative">
            <select 
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full h-12 px-4 border border-slate-200 rounded-xl appearance-none focus:border-[#1E90FF] bg-slate-50 focus:bg-[#FFFFFF] transition-colors text-[15px] font-medium text-slate-900 focus:outline-none"
            >
              <option value="" disabled>Select State</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Delhi">Delhi</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Gujarat">Gujarat</option>
            </select>
            <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
        <button className="w-full h-12 bg-slate-100 text-[#1E90FF] font-semibold rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
          <MapPin size={20} className="text-[#1E90FF]" />
          Pin on Map
        </button>
      </Card>

      <Card title="Business License">
        <div className="space-y-3 mb-4">
          <label className="text-[13px] font-medium text-slate-600">GST Category</label>
          <div className="grid grid-cols-1 gap-3">
            {[
              { label: 'Freshly Prepared Food', desc: 'We collect GST from consumer' },
              { label: 'MRP Packed Items', desc: 'We don\'t take GST from consumer' },
              { label: 'Hybrid (Both)', desc: 'We take GST only on freshly prepared items' }
            ].map(opt => (
              <label key={opt.label} onClick={() => setGstCategory(opt.label)} className={`flex items-start p-3 border rounded-2xl cursor-pointer transition-all ${gstCategory === opt.label ? 'border-[#1E90FF] bg-blue-50' : 'border-slate-200 bg-[#FFFFFF]'}`}>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 mt-0.5 shrink-0 ${gstCategory === opt.label ? 'border-[#1E90FF]' : 'border-slate-300'}`}>
                  {gstCategory === opt.label && <div className="w-2.5 h-2.5 rounded-full bg-[#1E90FF]" />}
                </div>
                <div>
                  <p className={`text-[14px] font-medium ${gstCategory === opt.label ? 'text-[#1E90FF]' : 'text-slate-700'}`}>{opt.label}</p>
                  <p className={`text-[12px] mt-0.5 ${gstCategory === opt.label ? 'text-blue-600/80' : 'text-slate-500'}`}>{opt.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-1.5 mb-4">
          <label className="text-[13px] font-medium text-slate-600">FSSAI License</label>
          <input 
            type="text" 
            value={fssai}
            onChange={(e) => setFssai(e.target.value)}
            disabled={noFssai}
            placeholder="14-digit FSSAI number" 
            className={`w-full h-12 px-4 border rounded-xl transition-colors text-[15px] font-medium focus:outline-none ${noFssai ? 'bg-slate-100 border-slate-200 text-slate-400' : 'border-slate-200 focus:border-[#1E90FF] bg-slate-50 text-slate-900 focus:bg-[#FFFFFF]'}`} 
          />
          <div className="flex flex-col gap-2 mt-2 px-1">
            <p className="text-[11px] text-slate-400">Required for full visibility on platform</p>
            <label className="flex items-center gap-2 cursor-pointer w-max">
              <input type="checkbox" checked={noFssai} onChange={(e) => { setNoFssai(e.target.checked); if(e.target.checked) setFssai(''); }} className="w-4 h-4 rounded border-slate-300 text-[#1E90FF] focus:ring-[#1E90FF]" />
              <span className="text-[12px] font-medium text-slate-600">Don't have FSSAI yet</span>
            </label>
          </div>
        </div>

        <InputField 
          label="Restaurant Contact Number" 
          type="tel"
          value={contactNumber}
          onChange={(e: any) => setContactNumber(e.target.value)}
          placeholder="For customer calls" 
        />

        <InputField 
          label="Restaurant Email" 
          type="email"
          value={restaurantEmail}
          onChange={(e: any) => setRestaurantEmail(e.target.value)}
          placeholder="For order updates" 
        />
      </Card>

      <Card title="Services">
        <div className="divide-y divide-slate-100">
          <Toggle 
            label="Delivery" 
            checked={services.delivery} 
            onChange={() => setServices({...services, delivery: !services.delivery})} 
          />
          <Toggle 
            label="Takeaway" 
            checked={services.takeaway} 
            onChange={() => setServices({...services, takeaway: !services.takeaway})} 
          />
          <Toggle 
            label="Dine-in" 
            checked={services.dineIn} 
            onChange={() => setServices({...services, dineIn: !services.dineIn})} 
          />
          <Toggle 
            label="Table Booking" 
            checked={services.booking} 
            onChange={() => setServices({...services, booking: !services.booking})} 
          />
        </div>
      </Card>

      <Card title="Agreements & Policies">
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer pb-3 border-b border-slate-100">
            <input type="checkbox" checked={acceptAll} onChange={(e) => handleAcceptAll(e.target.checked)} className="w-5 h-5 rounded border-slate-300 text-[#1E90FF] focus:ring-[#1E90FF]" />
            <span className="text-[14px] font-bold text-slate-900">Accept All</span>
          </label>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} className="w-5 h-5 rounded border-slate-300 text-[#1E90FF] focus:ring-[#1E90FF]" />
            <span className="text-[13px] font-medium text-slate-700">Terms and Conditions</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={acceptPartnerAgreement} onChange={(e) => setAcceptPartnerAgreement(e.target.checked)} className="w-5 h-5 rounded border-slate-300 text-[#1E90FF] focus:ring-[#1E90FF]" />
            <span className="text-[13px] font-medium text-slate-700">Restaurant Partner Agreement</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={acceptPayoutPolicy} onChange={(e) => setAcceptPayoutPolicy(e.target.checked)} className="w-5 h-5 rounded border-slate-300 text-[#1E90FF] focus:ring-[#1E90FF]" />
            <span className="text-[13px] font-medium text-slate-700">Payout Policy</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={acceptPrivacyPolicy} onChange={(e) => setAcceptPrivacyPolicy(e.target.checked)} className="w-5 h-5 rounded border-slate-300 text-[#1E90FF] focus:ring-[#1E90FF]" />
            <span className="text-[13px] font-medium text-slate-700">Privacy Policy</span>
          </label>
        </div>
      </Card>

      <button 
        onClick={() => {
          setIsSubmitting(true);
          setStep(3);
          setTimeout(() => {
            setIsSubmitting(false);
          }, 2000);
        }}
        disabled={!restaurantName || cuisines.length === 0 || !category || !street || !city || !state || !pincode || !gstCategory || (!fssai && !noFssai) || !contactNumber || !restaurantEmail || !acceptAll}
        className={`w-full h-[52px] rounded-[16px] font-semibold text-[16px] flex items-center justify-center transition-all mt-6 ${
          restaurantName && cuisines.length > 0 && category && street && city && state && pincode && gstCategory && (fssai || noFssai) && contactNumber && restaurantEmail && acceptAll
            ? 'bg-[#1E90FF] text-[#FFFFFF] active:scale-[0.98]' 
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
        }`}
      >
        Continue
      </button>
    </div>
  );

  const renderStep3 = () => {
    if (isSubmitting) {
      return (
        <div className="fixed inset-0 z-[700] bg-[#FFFFFF] flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-[#1E90FF] rounded-full animate-spin mb-4"></div>
          <p className="text-[16px] font-semibold text-slate-700">Loading, please wait...</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center py-8 animate-in zoom-in-95 duration-700">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6">
          <CheckCircle2 size={40} strokeWidth={2.5} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-3 text-center">Request Received!</h2>
        <p className="text-[15px] text-slate-500 text-center max-w-[300px] leading-relaxed mb-8">
          Our team is now verifying your details and setting up your profile. We will inform you shortly.
        </p>
        
        <div className="w-full bg-[#FFFFFF] border border-slate-200 rounded-[20px] p-5 mb-8 shadow-sm">
          <h3 className="text-[16px] font-bold text-slate-900 mb-4">What's next?</h3>
          <ul className="space-y-3">
            {[
              'Add other important outlet info',
              'Add bank account',
              'Upload digital copy of your menu',
              'Set-up your menu',
              'Add tables',
              'Ready to go online'
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-50 text-[#1E90FF] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[12px] font-bold">{idx + 1}</span>
                </div>
                <span className="text-[14px] font-medium text-slate-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <button 
          onClick={onComplete}
          className="w-full h-[52px] bg-[#1E90FF] text-[#FFFFFF] rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all"
        >
          Go to Dashboard
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[600] bg-slate-50 flex flex-col font-sans overflow-hidden">
      {/* Header */}
      {step < 3 && (
        <header className="flex items-center justify-between px-4 h-[60px] border-b border-slate-200 bg-[#FFFFFF] shrink-0 shadow-sm">
          <button 
            onClick={() => step === 1 ? onBack() : setStep(step - 1)} 
            className="w-10 h-10 flex items-center justify-center -ml-2 text-slate-700 active:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft size={22} />
          </button>
          <div className="flex gap-1.5">
            {[1, 2].map(i => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-6 bg-[#1E90FF]' : i < step ? 'w-2 bg-[#1E90FF]' : 'w-2 bg-slate-200'}`} />
            ))}
          </div>
          <div className="w-10" /> {/* Spacer for centering */}
        </header>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-12">
        {step > 0 && step < 3 && (
          <div className="px-4 pt-6 pb-4">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1">
              {step === 1 ? 'Account Setup' : 'Restaurant Setup'}
            </h1>
            <p className="text-[14px] text-slate-500">
              {step === 1 ? 'Create your partner account' : 'Tell us about your business'}
            </p>
          </div>
        )}

        <div className="px-4">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>
      </div>
    </div>
  );
};
