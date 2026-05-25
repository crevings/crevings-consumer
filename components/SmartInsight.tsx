import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, ArrowRight } from 'lucide-react';
import { getSmartBusinessInsight } from '../services/geminiService';

interface SmartInsightProps {
  isOnline: boolean;
  rushHour: boolean;
}

export const SmartInsight: React.FC<SmartInsightProps> = ({ isOnline, rushHour }) => {
  const [insight, setInsight] = useState<string>("Analyzing real-time data...");
  const [loading, setLoading] = useState<boolean>(false);

  const fetchInsight = async () => {
    if (!process.env.API_KEY) {
      setInsight("API Key missing. Cannot generate insights.");
      return;
    }
    setLoading(true);
    const weather = "Partly Cloudy, 24°C"; 
    const orders = 42; 
    
    const tip = await getSmartBusinessInsight(weather, orders, rushHour);
    setInsight(tip);
    setLoading(false);
  };

  useEffect(() => {
    fetchInsight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rushHour, isOnline]);

  return (
    <div className="relative">
      <div className="relative bg-slate-900 rounded-[22px] p-5 overflow-hidden border border-slate-800">
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2 bg-[#FFFFFF]/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/5">
              <Sparkles size={12} className="text-indigo-300" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-100">AI Assistant</span>
            </div>
            <button 
              onClick={fetchInsight} 
              disabled={loading}
              className={`p-2 rounded-full hover:bg-[#FFFFFF]/10 text-slate-400 hover:text-white transition-all ${loading ? 'animate-spin' : ''}`}
            >
              <RefreshCw size={14} />
            </button>
          </div>
          
          <p className="text-sm font-medium text-slate-200 leading-relaxed mb-1">
            {loading ? "Crunching the numbers..." : insight}
          </p>

          <div className="mt-3 flex justify-end">
            <button className="text-xs font-semibold text-indigo-400 flex items-center group-hover:text-indigo-300 transition-colors">
              View Analysis <ArrowRight size={12} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};