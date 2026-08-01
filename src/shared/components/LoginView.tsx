import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Loader2 } from "lucide-react";
import { BASE_URL } from "../../api/fetcher";

interface LoginViewProps {
  onLoginSuccess?: (user: any) => void;
  onNavigateToOnboarding?: () => void;
}

type LoginStep = "input" | "otp" | "name";

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [view, setView] = useState<LoginStep>("input");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [authenticatedUser, setAuthenticatedUser] = useState<any>(null);

  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleOtpChange = (value: string, index: number) => {
    setOtpError(false);
    setApiError(null);

    const digitsOnly = value.replace(/\D/g, "");

    // Handle multi-digit entry (e.g. browser autofill)
    if (digitsOnly.length > 1) {
      const newOtp = [...otp];
      const chars = digitsOnly.slice(0, 6 - index).split("");
      chars.forEach((char, i) => {
        if (index + i < 6) {
          newOtp[index + i] = char;
        }
      });
      setOtp(newOtp);
      const nextFocus = Math.min(index + chars.length, 5);
      otpInputs.current[nextFocus]?.focus();
      return;
    }

    // Single digit entry
    const newOtp = [...otp];
    newOtp[index] = digitsOnly;
    setOtp(newOtp);

    // Auto shift to next block seamlessly if digit entered
    if (digitsOnly && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>, startIndex: number) => {
    e.preventDefault();
    setOtpError(false);
    setApiError(null);

    const pastedText = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pastedText) return;

    const newOtp = [...otp];
    const digits = pastedText.slice(0, 6).split("");
    const targetStart = digits.length === 6 ? 0 : startIndex;

    digits.forEach((char, i) => {
      if (targetStart + i < 6) {
        newOtp[targetStart + i] = char;
      }
    });

    setOtp(newOtp);

    const nextFocusIndex = Math.min(targetStart + digits.length, 5);
    otpInputs.current[nextFocusIndex]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        e.preventDefault();
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        otpInputs.current[index - 1]?.focus();
      } else if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      otpInputs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault();
      otpInputs.current[index + 1]?.focus();
    }
  };

  const verifyOtpAndLogin = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) return;

    setIsVerifying(true);
    setApiError(null);

    try {
      const response = await fetch(`${BASE_URL}/consumer/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          phone: phoneNumber,
          otp: enteredOtp
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Invalid or expired OTP");
      }

      setAuthenticatedUser(data.user);

      // Check if first-time user without a custom name
      if (data.isNewUser || !data.user?.name || data.user.name === "Valued Customer") {
        setView("name");
      } else {
        if (onLoginSuccess) {
          onLoginSuccess(data.user);
        }
        navigate("/");
      }
    } catch (err: any) {
      setOtpError(true);
      setApiError(err.message || "OTP verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSaveNameAndContinue = async () => {
    if (!nameInput.trim()) return;

    setIsSavingName(true);
    setApiError(null);

    try {
      const res = await fetch(`${BASE_URL}/consumer/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: nameInput.trim() })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update profile name");
      }

      const updatedUser = { ...authenticatedUser, name: nameInput.trim() };
      if (onLoginSuccess) {
        onLoginSuccess(updatedUser);
      }
      // Mandatory redirect to location picker page after name entry
      navigate("/location");
    } catch (err: any) {
      setApiError(err.message || "Could not save name. Please try again.");
    } finally {
      setIsSavingName(false);
    }
  };

  const triggerSendWhatsappOtp = async (targetPhone: string) => {
    try {
      const res = await fetch(`${BASE_URL}/consumer/auth/request-whatsapp-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: targetPhone })
      });
      const data = await res.json();
      console.log("📱 MSG91 WhatsApp OTP response:", data);
    } catch (err) {
      console.error("Failed to trigger MSG91 WhatsApp OTP:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-[500] bg-white flex flex-col font-sans overflow-hidden max-w-md mx-auto shadow-2xl">
      {/* Top Hero Section with Full Background Image */}
      <div 
        className="flex-1 w-full bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: "url('/Loginbgimg.jpg.jpeg')" }}
      />

      {/* Bottom Action Sheet */}
      <div className="px-6 pb-8 bg-white border-t border-slate-100 pt-4 relative z-20 shadow-lg">
        {apiError && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs font-semibold text-center">
            {apiError}
          </div>
        )}

        {view === "input" && (
          <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
            <div className="text-left">
              <label className="text-[14px] font-medium text-slate-700">
                Mobile Number
              </label>
            </div>

            <div className="flex items-center h-14 border border-slate-200 rounded-xl overflow-hidden focus-within:border-[#00bd6f] focus-within:ring-1 focus-within:ring-[#00bd6f] bg-white transition-all">
              <div className="flex items-center gap-2 px-4 border-r border-slate-200 bg-white h-full shrink-0">
                <img src="https://flagcdn.com/w20/in.png" alt="India" className="w-5 h-3.5 object-cover rounded-sm shadow-sm" />
                <span className="text-[15px] font-medium text-slate-700">+91</span>
              </div>
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={phoneNumber}
                maxLength={10}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                className="flex-1 px-4 text-[15px] font-medium text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-400"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                if (phoneNumber.length === 10) {
                  setView("otp");
                  triggerSendWhatsappOtp(phoneNumber);
                }
              }}
              disabled={phoneNumber.length < 10}
              className={`w-full h-14 rounded-xl font-semibold text-[16px] flex items-center justify-center transition-all ${
                phoneNumber.length === 10
                  ? "bg-[#00bd6f] text-white active:scale-[0.98] shadow-md shadow-emerald-500/20"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          </div>
        )}

        {view === "otp" && (
          <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
            <div className="text-left">
              <p className="text-[14px] text-slate-500">
                Code sent to <span className="font-bold text-slate-900">+91 {phoneNumber}</span>
              </p>
            </div>

            <div className="flex justify-between gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    otpInputs.current[index] = el;
                  }}
                  type="tel"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={(e) => handleOtpPaste(e, index)}
                  onFocus={(e) => e.target.select()}
                  className={`w-[46px] h-[54px] text-center text-xl font-bold rounded-xl border transition-all focus:outline-none ${
                    otpError
                      ? "border-rose-300 bg-rose-50 text-rose-600"
                      : digit
                      ? "border-[#00bd6f] bg-emerald-50 text-[#00bd6f]"
                      : "border-slate-200 bg-white focus:border-[#00bd6f]"
                  }`}
                />
              ))}
            </div>

            {otpError && <p className="text-rose-500 text-[13px] font-medium animate-in fade-in">Invalid code. Please try again (Use 123456).</p>}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setView("input")}
                className="w-1/3 h-14 rounded-xl font-semibold text-[16px] flex items-center justify-center transition-all bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-[0.98]"
              >
                Back
              </button>
              <button
                onClick={verifyOtpAndLogin}
                disabled={otp.join("").length < 6 || isVerifying}
                className={`flex-1 h-14 rounded-xl font-semibold text-[16px] flex items-center justify-center transition-all ${
                  otp.join("").length === 6 && !isVerifying
                    ? "bg-[#00bd6f] text-white active:scale-[0.98] shadow-md shadow-emerald-500/20"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                {isVerifying ? <Loader2 size={22} className="animate-spin text-white" /> : "Verify & Continue"}
              </button>
            </div>

            <div className="w-full">
              <button
                type="button"
                onClick={() => {
                  if (phoneNumber) triggerSendWhatsappOtp(phoneNumber);
                }}
                className="w-full h-12 rounded-xl font-medium text-[13px] text-[#059669] bg-[#ECFDF5] border border-[#A7F3D0] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare size={16} /> Resend WhatsApp OTP
              </button>
            </div>
          </div>
        )}

        {view === "name" && (
          <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
            <div className="text-left">
              <h3 className="text-[18px] font-bold text-slate-900 mb-1">What should we call you?</h3>
              <p className="text-[13px] text-slate-500">Please enter your name to complete your profile.</p>
            </div>

            <div className="flex items-center h-14 border border-slate-200 rounded-xl overflow-hidden focus-within:border-[#00bd6f] focus-within:ring-1 focus-within:ring-[#00bd6f] bg-white transition-all px-4">
              <input
                type="text"
                placeholder="Enter your full name"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="flex-1 text-[15px] font-medium text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-400"
              />
            </div>

            <button
              type="button"
              onClick={handleSaveNameAndContinue}
              disabled={!nameInput.trim() || isSavingName}
              className={`w-full h-14 rounded-xl font-semibold text-[16px] flex items-center justify-center transition-all ${
                nameInput.trim() && !isSavingName
                  ? "bg-[#00bd6f] text-white active:scale-[0.98] shadow-md shadow-emerald-500/20"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              {isSavingName ? <Loader2 size={22} className="animate-spin text-white" /> : "Save & Continue"}
            </button>
          </div>
        )}

        <div className="mt-6 text-center border-t border-slate-100 pt-4">
          <p className="text-[12px] text-slate-500 leading-relaxed">
            By continuing, you agree to our<br />
            <a href="#" className="text-[#00bd6f] hover:underline font-medium">Terms of Service</a> and <a href="#" className="text-[#00bd6f] hover:underline font-medium">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};
