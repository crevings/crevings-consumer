
import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Star, 
  ShieldCheck, 
  Check, 
  Plus, 
  Minus,
  Truck,
  RotateCcw,
  Zap,
  CheckCircle2,
  Wallet,
  ChevronRight,
  Share2,
  Heart,
  Package,
  X
} from 'lucide-react';

interface StoreProductDetailViewProps {
  product: any;
  onBack: () => void;
}

export const StoreProductDetailView: React.FC<StoreProductDetailViewProps> = ({ product, onBack }) => {
  const [quantity, setQuantity] = useState(1);
  const [isBuying, setIsBuying] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePurchase = () => {
    setIsBuying(true);
    setTimeout(() => {
      setIsBuying(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onBack();
      }, 3000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#FFFFFF] flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden">
      
      {/* Floating Modern Header */}
      <div className="absolute top-0 inset-x-0 z-[60] px-6 py-6 flex items-center justify-between">
         <button 
           onClick={onBack} 
           className="w-12 h-12 rounded-2xl bg-[#FFFFFF]/40 backdrop-blur-xl border border-white/40 flex items-center justify-center text-slate-900 active:scale-90 transition-all"
         >
            <ArrowLeft size={22} strokeWidth={2.5} />
         </button>
         <div className="flex items-center gap-3">
            <button className="w-12 h-12 rounded-2xl bg-[#FFFFFF]/40 backdrop-blur-xl border border-white/40 flex items-center justify-center text-slate-900 active:scale-90">
               <Heart size={20} />
            </button>
            <button className="w-12 h-12 rounded-2xl bg-[#FFFFFF]/40 backdrop-blur-xl border border-white/40 flex items-center justify-center text-slate-900 active:scale-90">
               <Share2 size={20} />
            </button>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-32 bg-slate-50">
         {/* Cinematic Hero Image */}
         <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FFFFFF]">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent"></div>
            <div className="absolute bottom-10 left-6">
                <div className="px-3 py-1.5 bg-emerald-500 text-white rounded-xl text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-white/20">
                   <ShieldCheck size={12} /> Partner Verified Outlet Supply
                </div>
            </div>
         </div>

         {/* Content Architecture */}
         <div className="px-6 -mt-10 relative z-10 space-y-8">
            <div className="bg-[#FFFFFF] rounded-[40px] p-8 border border-slate-100 space-y-6">
               <div className="flex items-center gap-3">
                  <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-xl text-[8px] font-black uppercase tracking-widest border border-emerald-100/50">
                     {product.category}
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-500 text-[10px] font-black">
                     <Star size={12} fill="currentColor" /> {product.rating} <span className="text-slate-300 font-bold ml-1">({product.reviews} reviews)</span>
                  </div>
               </div>
               
               <div className="flex justify-between items-start gap-6">
                  <h1 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{product.name}</h1>
                  <div className="text-right shrink-0">
                     <p className="text-[10px] font-bold text-slate-300 line-through">₹{product.regularPrice}</p>
                     <p className="text-3xl font-black text-slate-900 tracking-tighter">₹{product.price}</p>
                     <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">/{product.unit}</p>
                  </div>
               </div>

               <div className="pt-6 border-t border-slate-50 flex flex-wrap gap-2">
                  {product.features.map((feature: string, i: number) => (
                     <div key={i} className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-50 rounded-xl text-[9px] font-black text-slate-500 uppercase tracking-wide border border-slate-100">
                        <CheckCircle2 size={12} className="text-emerald-500" />
                        {feature}
                     </div>
                  ))}
               </div>
            </div>

            {/* Spec Card */}
            <div className="space-y-4 px-2">
               <div className="flex items-center gap-2">
                  <Package size={14} className="text-slate-300" />
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Logistics Intelligence</h4>
               </div>
               <p className="text-sm font-medium text-slate-500 leading-relaxed">
                 {product.description} This supply is optimized for high-volume cycles and meets the elite partner safety standards for 2025.
               </p>
            </div>

            {/* Tactical Control Tray */}
            <div className="bg-[#FFFFFF] rounded-[32px] p-6 border border-slate-100 flex items-center justify-between">
               <div className="space-y-1">
                  <h4 className="text-sm font-black text-slate-900 tracking-tight uppercase">Order Batch</h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Max: 20 units</p>
               </div>
               <div className="flex items-center gap-5 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-xl bg-[#FFFFFF] border border-slate-100 flex items-center justify-center text-slate-400 active:scale-90 transition-all hover:bg-rose-50 hover:text-rose-500"
                  >
                     <Minus size={16} />
                  </button>
                  <span className="text-xl font-black text-slate-900 w-8 text-center">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(20, quantity + 1))}
                    className="w-10 h-10 rounded-xl bg-[#FFFFFF] border border-slate-100 flex items-center justify-center text-slate-400 active:scale-90 transition-all hover:bg-emerald-50 hover:text-emerald-500"
                  >
                     <Plus size={16} />
                  </button>
               </div>
            </div>

            {/* Utility Grid */}
            <div className="grid grid-cols-2 gap-4">
               <div className="p-5 rounded-[32px] bg-[#FFFFFF] border border-slate-100 flex items-center gap-4 group hover:border-emerald-200 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-300 flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-all border border-slate-100">
                     <Truck size={20} />
                  </div>
                  <div className="space-y-0.5">
                     <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Dispatch</p>
                     <p className="text-xs font-black text-slate-900">48h ETA</p>
                  </div>
               </div>
               <div className="p-5 rounded-[32px] bg-[#FFFFFF] border border-slate-100 flex items-center gap-4 group hover:border-indigo-200 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-300 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-all border border-slate-100">
                     <RotateCcw size={20} />
                  </div>
                  <div className="space-y-0.5">
                     <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Refund</p>
                     <p className="text-xs font-black text-slate-900">7 Day</p>
                  </div>
               </div>
            </div>

            {/* Growth Tip Banner */}
            <div className="bg-slate-900 rounded-[32px] p-6 flex items-center gap-5 border border-slate-800 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-3xl"></div>
               <div className="w-12 h-12 bg-[#FFFFFF]/5 border border-white/10 rounded-2xl flex items-center justify-center text-emerald-400 shrink-0">
                  <Zap size={24} fill="currentColor" />
               </div>
               <p className="text-[11px] font-medium text-slate-300 leading-snug uppercase tracking-wide">
                 Elite partners report a <span className="text-emerald-400 font-black">22% lift</span> in satisfaction using branded {product.name.split(' ')[0]}.
               </p>
            </div>
         </div>
      </div>

      {/* Aesthetic Summary Action Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-[#FFFFFF]/80 backdrop-blur-2xl border-t border-slate-100 px-8 py-6 z-[110]">
         <div className="max-w-md mx-auto flex items-center justify-between gap-10">
            <div className="space-y-1">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em]">Est. Procurement</p>
               <h3 className="text-2xl font-black text-slate-900 tracking-tighter">₹{(product.price * quantity).toFixed(0)}</h3>
            </div>
            
            <button 
              onClick={handlePurchase}
              disabled={isBuying}
              className="flex-1 h-[52px] bg-[#1E90FF] text-[#FFFFFF] rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all disabled:opacity-50 overflow-hidden relative group"
            >
               <div className="absolute inset-0 bg-[#FFFFFF]/10 w-0 group-hover:w-full transition-all duration-700 ease-in-out"></div>
               {isBuying ? (
                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
               ) : (
                 <>
                   <span className="font-black text-[12px] uppercase tracking-[0.2em]">Deploy Order</span>
                   <ChevronRight size={18} strokeWidth={3} />
                 </>
               )}
            </button>
         </div>
      </div>

      {/* Success Modal Architecture */}
      {showSuccess && (
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-md flex items-center justify-center px-8 animate-in fade-in duration-500">
           <div className="bg-[#FFFFFF] rounded-[48px] w-full max-w-sm p-10 text-center animate-in zoom-in duration-700 relative border border-slate-100">
              <button onClick={() => setShowSuccess(false)} className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-900 transition-all">
                <X size={20} />
              </button>
              
              <div className="w-20 h-20 bg-emerald-50 rounded-[28px] flex items-center justify-center mx-auto mb-8 border border-emerald-100">
                 <CheckCircle2 size={40} className="text-emerald-500" strokeWidth={3} />
              </div>
              
              <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-3 uppercase">Order Deployed</h3>
              <p className="text-[11px] font-medium text-slate-400 mb-10 leading-relaxed px-4">
                Your procurement request has been verified. Settlement will be adjusted automatically.
              </p>
              
              <div className="flex items-center justify-center gap-2 text-indigo-600 py-3 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                <Wallet size={16} />
                <span className="text-[10px] font-black uppercase tracking-[0.25em]">Secure Ledger Adjusted</span>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
