import React, { useState } from 'react';
import { X, ChevronRight, Truck, ShoppingBag, Utensils, Package, HelpCircle, Check, Info, Sparkles } from 'lucide-react';

interface GoldMembershipViewProps {
  onClose: () => void;
}

export const GoldMembershipView: React.FC<GoldMembershipViewProps> = ({ onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState<'trial' | 'gold'>('gold');

  const benefits = [
    {
      icon: Truck,
      title: 'Food',
      description: 'Free delivery on all restaurants up to 10 kms on orders above ₹199',
      color: 'text-orange-500',
      bg: 'bg-orange-50'
    },
    {
      icon: ShoppingBag,
      title: 'Grocery & Essentials',
      description: 'Free delivery on all restaurants on all orders above ₹249',
      color: 'text-emerald-500',
      bg: 'bg-emerald-50'
    },
    {
      icon: Utensils,
      title: 'Dine In',
      description: 'Up to flat 40% off at 5,000+ restaurants across india',
      color: 'text-blue-500',
      bg: 'bg-blue-50'
    },
    {
      icon: Package,
      title: 'Courier',
      description: 'Flat 10% off on delivery fee for all orders',
      color: 'text-amber-500',
      bg: 'bg-amber-50'
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-fadeInUp select-none">
      {/* Header with Close */}
      <div className="flex justify-end p-6 sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <button 
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-800 hover:bg-slate-200 active:scale-90 transition-all"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-32">
        {/* Illustration Section (Recreating the reference image style) */}
        <div className="flex justify-center mb-10 relative">
          <div className="w-full max-w-[280px] aspect-[4/3] relative flex items-center justify-center">
            {/* Minimalist Graphic Representation */}
            <div className="relative w-40 h-56 bg-[#f1f5f9] border border-slate-200 rounded-3xl shadow-lg flex flex-col items-center p-4">
              <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mt-4">
                 <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-black italic text-sm">420</div>
              </div>
              <div className="mt-8 space-y-2 w-full px-2">
                 <div className="h-2 w-full bg-slate-200 rounded-full" />
                 <div className="h-2 w-2/3 bg-slate-100 rounded-full" />
              </div>
              {/* Card held by hand mockup */}
              <div className="absolute top-1/2 -right-12 w-36 h-24 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl shadow-2xl rotate-[15deg] flex flex-col p-4 justify-between border-2 border-white/20">
                 <div className="flex justify-between items-start">
                    <div className="w-6 h-4 bg-yellow-300/40 rounded-sm" />
                    <Sparkles className="w-4 h-4 text-white/50" />
                 </div>
                 <div className="text-white font-black text-xs tracking-widest">GOLD</div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Selection */}
        <div className="space-y-4 mb-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Select Plan</h1>
          
          <div className="grid grid-cols-1 gap-3">
             {/* Trial Plan */}
             <button 
                onClick={() => setSelectedPlan('trial')}
                className={`relative p-5 rounded-3xl border-2 transition-all flex justify-between items-center ${
                  selectedPlan === 'trial' ? 'border-slate-900 bg-slate-50' : 'border-slate-100'
                }`}
             >
                <div className="text-left">
                   <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-black text-slate-900">Trial Plan</span>
                      <span className="bg-blue-100 text-blue-700 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Limited Offer</span>
                   </div>
                   <div className="flex items-center gap-1.5">
                      <span className="text-2xl font-black text-slate-900">₹29</span>
                      <span className="text-[10px] font-bold text-slate-400">+ GST</span>
                   </div>
                   <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">Get ₹50 Cashback on order</p>
                </div>
                {selectedPlan === 'trial' && <div className="w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center text-white"><Check className="w-4 h-4" /></div>}
             </button>

             {/* Gold Plan */}
             <button 
                onClick={() => setSelectedPlan('gold')}
                className={`relative p-5 rounded-3xl border-2 transition-all flex justify-between items-center ${
                  selectedPlan === 'gold' ? 'border-slate-900 bg-slate-50' : 'border-slate-100'
                }`}
             >
                <div className="text-left">
                   <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-black text-slate-900">Gold Membership</span>
                      <span className="bg-yellow-100 text-yellow-700 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Most Popular</span>
                   </div>
                   <div className="flex items-center gap-1.5">
                      <span className="text-2xl font-black text-slate-900">₹149</span>
                      <span className="text-[10px] font-bold text-slate-400">for 3 months</span>
                   </div>
                </div>
                {selectedPlan === 'gold' && <div className="w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center text-white"><Check className="w-4 h-4" /></div>}
             </button>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] whitespace-nowrap">Gold Benefits</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          <div className="space-y-8">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex gap-5 group">
                <div className={`w-14 h-14 rounded-2xl ${benefit.bg} flex items-center justify-center ${benefit.color} shrink-0 shadow-sm transition-transform group-hover:scale-105`}>
                  <benefit.icon className="w-7 h-7" />
                </div>
                <div className="pt-1">
                  <h3 className="font-black text-slate-900 text-lg leading-none mb-1.5">{benefit.title}</h3>
                  <p className="text-sm font-bold text-slate-500 leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="h-px bg-slate-100 mb-8" />

        {/* FAQ Button (Matching reference) */}
        <button className="w-full flex items-center justify-between p-6 bg-slate-50 rounded-3xl hover:bg-slate-100 transition-colors group">
          <div className="flex items-center gap-4">
            <HelpCircle className="w-6 h-6 text-slate-400" />
            <span className="text-base font-bold text-slate-800">Frequently Asked Questions</span>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Sticky Buy Plan Footer */}
      <div className="p-6 bg-white border-t border-slate-100 sticky bottom-0 z-[100] shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
        <button 
          className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl text-base uppercase tracking-widest shadow-2xl active:scale-95 transition-all hover:bg-slate-800"
        >
          Buy Plan
        </button>
      </div>
    </div>
  );
};