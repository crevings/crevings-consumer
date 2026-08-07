import React from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

interface ComingSoonPageProps {
  title: string;
}

export const ComingSoonPage: React.FC<ComingSoonPageProps> = ({ title }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center animate-fadeInUp pt-10">
      <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
        <Sparkles className="w-10 h-10 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">{title} Page</h2>
      <p className="text-slate-500 text-sm max-w-[280px] mb-8">
        We're cooking up something exciting! This section is coming soon.
      </p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold active:scale-95 transition-all shadow-sm shadow-green-600/20"
      >
        Go Back Home
      </button>
    </div>
  );
};
