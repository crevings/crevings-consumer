import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MessageSquare, Loader2, ShieldCheck } from "lucide-react";
import { post, put, ResponseError } from "@/api/fetcher";
import { AuthUser } from "@/types";

interface LoginViewProps {
  onLoginSuccess?: (user: AuthUser) => void;
  onNavigateToOnboarding?: () => void;
}

type LoginStep = "input" | "otp" | "name";

/**
 * Map a failed OTP verification to a user-facing message.
 *
 * The backend distinguishes the two failure modes with an `error` code:
 *   - OTP_INCORRECT → generic "Incorrect OTP"
 *   - OTP_EXPIRED   → specific "OTP is expired"
 * Everything else falls back to the generic message. The entered digits are
 * NEVER echoed back and no hint about the expected code is shown — the raw
 * backend text is not surfaced either.
 */
const otpFailureMessage = (err: unknown): string => {
  const info = (err as ResponseError | null)?.info;
  const code =
    info && typeof info === "object" && "error" in info
      ? (info as { error?: unknown }).error
      : undefined;
  if (code === "OTP_EXPIRED") return "OTP is expired";
  return "Incorrect OTP";
};

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // The phone → OTP → name steps are UI state inside a full-screen overlay, not
  // separate routes. Mirror each step into the router history state so the
  // browser Back button steps back through them (OTP → phone, name → OTP)
  // instead of popping history under the overlay and leaving the OTP screen up.
  const [view, setViewState] = useState<LoginStep>("input");

  React.useEffect(() => {
    const step = (location.state as { loginStep?: LoginStep } | null)?.loginStep;
    setViewState(step === "otp" || step === "name" ? step : "input");
  }, [location.state]);

  const setView = (next: LoginStep) => {
    setViewState(next);
    navigate(location.pathname + location.search, {
      state: { ...((location.state as Record<string, unknown>) || {}), loginStep: next },
    });
  };
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [authenticatedUser, setAuthenticatedUser] = useState<AuthUser | null>(null);
  const [showRestoredModal, setShowRestoredModal] = useState(false);
  const [isNewUserLogin, setIsNewUserLogin] = useState(false);

  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleOtpChange = (value: string, index: number) => {
    setOtpError(null);
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
    setOtpError(null);
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
      const data = await post<{
        success: boolean;
        message?: string;
        error?: string;
        user?: AuthUser;
        isNewUser?: boolean;
        deletionCancelled?: boolean;
      }>("/consumer/auth/verify-otp", {
        phone: phoneNumber,
        otp: enteredOtp,
      });

      if (!data.success) {
        throw new Error(data.error === "OTP_EXPIRED" ? "OTP is expired" : "Incorrect OTP");
      }

      if (data.user) {
        setAuthenticatedUser(data.user);
      }

      const isNew = Boolean(data.isNewUser || !data.user?.name || data.user.name === "New User" || data.user.name === "Valued Customer");
      setIsNewUserLogin(isNew);

      if (data.deletionCancelled) {
        setShowRestoredModal(true);
      } else {
        if (isNew) {
          setView("name");
        } else {
          if (data.user && onLoginSuccess) {
            onLoginSuccess(data.user);
          }
          navigate("/");
        }
      }
    } catch (err) {
      // Generic message for wrong codes, specific one for expired codes —
      // never the backend text, never the entered digits.
      setOtpError(otpFailureMessage(err));
      setApiError(null);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSaveNameAndContinue = async () => {
    if (!nameInput.trim()) return;

    setIsSavingName(true);
    setApiError(null);

    try {
      const data = await put<{ success: boolean; message?: string }>(
        "/consumer/profile",
        { name: nameInput.trim() }
      );
      if (!data.success) {
        throw new Error(data.message || "Failed to update profile name");
      }

      if (!authenticatedUser) return;
      const updatedUser = { ...authenticatedUser, name: nameInput.trim() };
      if (onLoginSuccess) {
        onLoginSuccess(updatedUser);
      }
      // Mandatory redirect to location picker page after name entry
      navigate("/location");
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Could not save name. Please try again.");
    } finally {
      setIsSavingName(false);
    }
  };

  const triggerSendWhatsappOtp = async (targetPhone: string) => {
    try {
      const data = await post<unknown>("/consumer/auth/request-whatsapp-otp", {
        phone: targetPhone,
      });
      console.log("📱 MSG91 WhatsApp OTP response:", data);
    } catch (err) {
      console.error("Failed to trigger MSG91 WhatsApp OTP:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-[500] bg-white flex flex-col font-sans overflow-hidden max-w-md mx-auto shadow-2xl pt-safe-3">
      {/* Top Hero Section with Full Background Image */}
      <div 
        className="flex-1 w-full bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: "url('/Loginbgimg.jpeg')" }}
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
                <img loading="lazy" src="https://flagcdn.com/w20/in.png" alt="India" className="w-5 h-3.5 object-cover rounded-sm shadow-sm" />
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

            {otpError && (
              <p className="text-rose-500 text-[13px] font-medium animate-in fade-in">
                {otpError}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  // Pop the pushed "otp" history entry; the location-state
                  // effect above lands the view back on the phone input step.
                  if ((location.state as { loginStep?: LoginStep } | null)?.loginStep) {
                    navigate(-1);
                  } else {
                    setViewState("input");
                  }
                }}
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

        <div className="mt-5 text-center border-t border-slate-100 pt-3.5 px-2">
          <p className="text-[8px] text-slate-400 leading-snug">
            By continuing, you agree to receive important updates and promotional communications from CREVINGS via RCS, SMS, WhatsApp, email, and phone calls. By continuing, you also agree to our{" "}
            <button type="button" onClick={() => navigate("/privacy-policy")} className="text-[#00bd6f] hover:underline font-semibold">Privacy Policy</button>,{" "}
            <button type="button" onClick={() => navigate("/terms")} className="text-[#00bd6f] hover:underline font-semibold">Terms of Service</button>, and{" "}
            <button type="button" onClick={() => navigate("/refund-policy")} className="text-[#00bd6f] hover:underline font-semibold">Refund Policy</button>.
          </p>
        </div>
      </div>

      {/* Account Restored Custom UI Modal */}
      {showRestoredModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] p-6 max-w-sm w-full shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#00bd6f] mb-4 border border-emerald-100/60 shadow-sm">
              <ShieldCheck className="w-9 h-9" strokeWidth={2.2} />
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 mb-2">Account Restored!</h3>
            <p className="text-sm font-medium text-slate-500 mb-6 leading-relaxed">
              Welcome back! Your scheduled account deletion request has been automatically cancelled and your account is fully retained.
            </p>

            <button
              onClick={() => {
                setShowRestoredModal(false);
                if (isNewUserLogin) {
                  setView("name");
                } else {
                  if (authenticatedUser && onLoginSuccess) {
                    onLoginSuccess(authenticatedUser);
                  }
                  navigate("/");
                }
              }}
              className="w-full py-3.5 bg-[#00bd6f] text-white font-bold rounded-xl text-base shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-transform"
            >
              Continue to App
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
