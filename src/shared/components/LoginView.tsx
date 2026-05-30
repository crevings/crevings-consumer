import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as apiLogin, register as apiRegister } from "../../api/auth";
import { Mail, Lock, Phone, User, Loader2, ArrowRight } from "lucide-react";

interface LoginViewProps {
  onLoginSuccess: (user: any) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const payload = isSignUp
      ? { name, email, phone, password }
      : { email, password };

    try {
      const data = isSignUp
        ? await apiRegister(payload)
        : await apiLogin(payload);

      if (isSignUp) {
        // Switch to login mode after successful registration
        setIsSignUp(false);
        setErrorMsg("Registration successful! Please login with your credentials.");
      } else {
        // Successfully logged in
        onLoginSuccess(data.user);
        navigate("/");
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center px-6 py-12 max-w-md mx-auto shadow-2xl relative animate-fadeIn">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-green-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl mx-auto shadow-md shadow-green-600/20 mb-4 rotate-3 hover:rotate-0 transition-transform">
            Cr
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            {isSignUp ? "Create an Account" : "Welcome Back!"}
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-2">
            {isSignUp
              ? "Join Crevings for gourmet delivery at your doorstep."
              : "Login to order delicious food and track deliveries."}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-100/50">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
                {/* Full Name */}
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <User size={18} />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-[14px] focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all font-medium text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                {/* Phone Number */}
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Phone size={18} />
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-[14px] focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all font-medium text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </>
            )}

            {/* Email Address */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Mail size={18} />
              </span>
              <input
                type="email"
                required
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-[14px] focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all font-medium text-slate-900 placeholder:text-slate-400"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock size={18} />
              </span>
              <input
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-[14px] focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all font-medium text-slate-900 placeholder:text-slate-400"
              />
            </div>

            {/* Error/Feedback Message */}
            {errorMsg && (
              <div
                className={`p-4 rounded-2xl text-xs font-bold ${
                  errorMsg.includes("successful")
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {errorMsg}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[52px] bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold text-[15px] active:scale-[0.98] transition-all shadow-md shadow-green-600/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  {isSignUp ? "Sign Up" : "Log In"}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Toggle link */}
          <div className="text-center mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMsg(null);
              }}
              className="text-xs font-bold text-green-600 hover:text-green-700 uppercase tracking-widest transition-colors"
            >
              {isSignUp ? "Already have an account? Log In" : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
