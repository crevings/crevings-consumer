
import React, { useState } from 'react';
import { 
  ArrowLeft, MapPin, Phone, MessageCircle, Navigation, ChevronDown, ChevronUp, CheckCircle2, Heart, Droplets, Bike, Home, Plus
} from 'lucide-react';
import { Order } from '../types';

interface OrderDetailViewProps {
  order: Order;
  onBack: () => void;
}

export const OrderDetailView: React.FC<OrderDetailViewProps> = ({ order, onBack }) => {
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const [selectedTip, setSelectedTip] = useState<number | null>(null);
  const itemsList = order.items.split(',').map(i => i.trim());

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative">
      {/* Top Section / Header overlaying the map */}
      <div className="fixed top-0 left-0 right-0 z-20 px-4 pt-6 pb-4 bg-gradient-to-b from-white/90 via-white/70 to-transparent backdrop-blur-sm">
        <div className="flex items-start gap-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-sm active:scale-90 transition-all shrink-0"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="font-bold text-slate-800 text-sm mb-0.5">Order is on the way</h1>
            <p className="text-2xl font-black text-slate-900 tracking-tight">Arriving in 4 minutes</p>
          </div>
        </div>
      </div>

      {/* Map Section (Fixed at top) */}
      <div className="fixed top-0 left-0 right-0 h-[45vh] w-full bg-slate-200 overflow-hidden z-0">
        {/* Fake Map Background */}
        <img 
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=800&fit=crop&q=80" 
          alt="Map" 
          className="w-full h-full object-cover opacity-50 grayscale"
        />
        <div className="absolute inset-0 bg-blue-50/30 mix-blend-multiply" />
        
        {/* Route Line (SVG) */}
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
          <path 
            d="M 100 120 Q 200 80 250 280" 
            fill="none" 
            stroke="#3b82f6" 
            strokeWidth="4" 
            strokeDasharray="8 8" 
            className="animate-pulse"
          />
        </svg>

        {/* User Location Marker */}
        <div className="absolute top-[280px] left-[250px] z-10 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
            <Home className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Delivery Partner Marker */}
        <div className="absolute top-[120px] left-[100px] z-10 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-xl border-2 border-white">
            <Bike className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Map Controls */}
        <div className="absolute bottom-10 right-4 z-10 flex flex-col gap-2">
          <button className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-slate-700 active:scale-95 transition-transform">
            <Navigation className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="relative z-10 mt-[40vh] bg-slate-50 rounded-t-[2rem] shadow-[0_-8px_30px_rgba(0,0,0,0.05)] min-h-[60vh] pb-20">
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 mb-4" />
        
        <div className="px-4">
          
          {/* Delivery Partner Card */}
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 mb-4 mt-2">
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&q=80" 
                  alt="Delivery Partner" 
                  className="w-14 h-14 rounded-full object-cover border-2 border-slate-100"
                />
                <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 text-base">Manjay</h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-snug">Delivery Partner</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-700 active:scale-95 transition-transform">
                  <MessageCircle className="w-5 h-5" />
                </button>
                <button className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 active:scale-95 transition-transform">
                  <Phone className="w-5 h-5 fill-current" />
                </button>
              </div>
            </div>
          </div>

          {/* Kindness Message Section */}
          <div className="bg-blue-50/50 rounded-3xl p-4 border border-blue-100 mb-4 flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-0.5">It's a hot day!</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Show some kindness by offering a glass of water to your delivery partner.</p>
            </div>
          </div>

          {/* Tip Section */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 mb-4">
            <div className="flex items-center gap-2 mb-1">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <h3 className="font-bold text-slate-900 text-sm">Say thanks with a tip</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">Delivering happiness at your doorstep!</p>
            
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {[20, 30, 50].map(amount => (
                <button 
                  key={amount}
                  onClick={() => setSelectedTip(amount)}
                  className={`flex-1 min-w-[70px] py-2.5 rounded-2xl border flex items-center justify-center text-sm font-bold transition-all ${
                    selectedTip === amount 
                      ? 'bg-rose-50 border-rose-200 text-rose-600' 
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  ₹{amount}
                </button>
              ))}
              <button 
                onClick={() => setSelectedTip(-1)}
                className={`flex-1 min-w-[80px] py-2.5 rounded-2xl border flex items-center justify-center gap-1 text-sm font-bold transition-all ${
                  selectedTip === -1 
                    ? 'bg-rose-50 border-rose-200 text-rose-600' 
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <Plus className="w-3.5 h-3.5" /> Custom
              </button>
            </div>
          </div>

          {/* Restaurant and Order Details Section */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-4 transition-all duration-300">
            <button 
              onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
              className="w-full p-5 flex items-center justify-between bg-white active:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-slate-900 text-sm">{order.restaurantName}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Order Details & Bill</p>
                </div>
              </div>
              {isDetailsExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </button>

            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isDetailsExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="p-5 pt-0 border-t border-slate-100">
                <div className="flex justify-end mb-4 pt-4">
                  <button className="flex items-center gap-1.5 text-blue-600 text-xs font-bold bg-blue-50 px-3 py-1.5 rounded-full">
                    <Phone className="w-3.5 h-3.5" /> Call Restaurant
                  </button>
                </div>
                
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Order Summary</h4>
                <div className="space-y-3 mb-4">
                  {itemsList.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start">
                      <div className="flex items-start gap-2">
                        <div className="w-3.5 h-3.5 mt-0.5 border border-green-500 flex items-center justify-center rounded-sm shrink-0">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        </div>
                        <span className="text-sm font-medium text-slate-700">{item}</span>
                      </div>
                      <span className="text-sm font-medium text-slate-700">x1</span>
                    </div>
                  ))}
                </div>
                
                <div className="h-px bg-slate-100 w-full my-4" />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Item Total</span>
                    <span>₹{order.price || '429'}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Delivery Fee</span>
                    <span className="text-blue-500 font-medium">FREE</span>
                  </div>
                  <div className="flex justify-between pt-2 mt-2 border-t border-slate-100">
                    <span className="text-sm font-black text-slate-900">Grand Total</span>
                    <span className="text-sm font-black text-slate-900">₹{order.price || '429'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
