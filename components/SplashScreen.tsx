import React, { useEffect, useState } from 'react';
import { ChefHat } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 800); 
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center transition-opacity duration-700 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-50 rounded-full blur-[100px] opacity-40"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[350px] h-[350px] bg-blue-50 rounded-full blur-[80px] opacity-40"></div>

        <div className="flex flex-col items-center animate-fadeInUp relative z-10">
            <div className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-sky-400 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-blue-500/30 mb-8 transform rotate-3 animate-pulse">
                <ChefHat className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Crevings</h1>
            <div className="flex items-center gap-3">
                <div className="h-0.5 w-6 bg-blue-500/30 rounded-full"></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Premium Delivery</p>
                <div className="h-0.5 w-6 bg-blue-500/30 rounded-full"></div>
            </div>
        </div>
        
        <div className="absolute bottom-16 flex flex-col items-center gap-4">
            <div className="flex gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            </div>
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Preparing Delights</p>
        </div>
    </div>
  );
};