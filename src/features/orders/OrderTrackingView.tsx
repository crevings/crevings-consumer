import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Clock, CheckCircle2, Bike, Store, Phone, MessageSquare, HelpCircle, Map as MapIcon, Copy, AlertCircle, ChevronRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Order } from "@/types";
import { OrderChatBot } from "@/features/orders/OrderChatBot";
import { SupportMessagingView } from "@/shared/ui/SupportMessagingView";
import { LiveTrackingMap } from "@/features/orders/components/LiveTrackingMap";

interface OrderTrackingViewProps {
  order: Order;
  onBack: () => void;
  onOrderComplete: () => void;
  onCancelOrder?: () => void;
}

const CANCEL_REASONS = [
  "Ordered by mistake",
  "Delivery time is too long",
  "Changed my mind",
  "Forgot to add an item",
  "Other"
];

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({ order, onBack, onOrderComplete, onCancelOrder }) => {
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds for demo
  const [showMap, setShowMap] = useState(false);
  const [otp] = useState(Math.floor(100000 + Math.random() * 900000).toString());
  const [takeawayOtp, setTakeawayOtp] = useState('');
  const [paymentStatus, setPaymentStatus] = useState(order.paymentMethod === 'cod' ? 'PENDING' : 'PAID');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const handlePickupComplete = () => {
    if (takeawayOtp.length === 6) {
      onOrderComplete();
    }
  };

  useEffect(() => {
    // Auto-advancing progress animation disabled so the status remains static at the initial stage.
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 active:scale-95 transition-transform">
            <ArrowLeft className="w-6 h-6 text-slate-700" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Order Tracking</h1>
            <p className="text-xs text-slate-500">Order ID: {order.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsSupportOpen(true)} className="p-2 active:scale-95 transition-transform bg-blue-50 text-blue-600 rounded-full flex items-center justify-center w-10 h-10">
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showMap && order.type === 'Delivery' && (
          <motion.div 
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            className="fixed inset-0 z-50 bg-slate-100 flex flex-col"
          >
            {/* Map Background */}
            <div className="absolute inset-0 z-0">
              <LiveTrackingMap progress={progress} />
            </div>

            {/* Header */}
            <div className="pt-safe px-4 py-4 flex items-center justify-between relative z-10">
              <button onClick={() => setShowMap(false)} className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center active:scale-95 transition-transform">
                <ArrowLeft className="w-6 h-6 text-slate-800" />
              </button>
              <button onClick={() => setIsSupportOpen(true)} className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center active:scale-95 transition-transform">
                <HelpCircle className="w-6 h-6 text-slate-800" />
              </button>
            </div>

            {/* Bottom Sheet Area */}
            <div className="mt-auto relative z-10 bg-white rounded-t-[32px] shadow-[0_-8px_30px_rgba(0,0,0,0.12)] pb-safe">
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-4 mb-2" />
              
              <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
                {/* Estimate Time */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                      {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')} min
                    </h2>
                    <p className="text-sm font-medium text-slate-500 mt-1">Estimated delivery time</p>
                  </div>
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center shadow-inner">
                    <Clock className="w-8 h-8 text-blue-600" />
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-3">
                  <div className="relative h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 bg-[#00bd6f] transition-all duration-1000 rounded-full" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="text-sm font-bold text-slate-800 text-center">
                    {progress < 20 ? 'Order Confirmed' : progress < 50 ? 'Preparing your food' : progress < 80 ? 'On the way' : progress < 100 ? 'Arriving now' : 'Delivered'}
                  </p>
                </div>

                {/* Delivery Partner Card */}
                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-100 shrink-0 border-2 border-white shadow-sm">
                    <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop&q=80" alt="Delivery Partner" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-slate-900">Ramesh Kumar</h3>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">Delivery Partner • 4.8 ★</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center active:scale-95 transition-transform">
                      <Phone className="w-4 h-4" />
                    </button>
                    <button className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center active:scale-95 transition-transform">
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Restaurant Card */}
                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-50 shrink-0 flex items-center justify-center border-2 border-white shadow-sm">
                    <Store className="w-6 h-6 text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-slate-900">{order.restaurantName}</h3>
                    <p className="text-xs font-medium text-slate-500 mt-0.5 line-clamp-1">{order.location}</p>
                  </div>
                  <div className="shrink-0">
                    <div className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 text-xs font-bold text-slate-700 flex flex-col items-center">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">OTP</span>
                      <span className="text-sm tracking-widest">{otp}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto pb-safe">
        <div className="p-4 space-y-4">
          
          {/* Timer Section */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Estimated Time</p>
                <p className="text-lg font-bold text-slate-900">
                  {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')} min
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 font-medium">Status</p>
              <p className="text-sm font-bold text-[#00bd6f]">
                {progress < 20 ? 'Confirmed' : progress < 50 ? 'Preparing' : progress < 80 ? 'Picked up' : progress < 100 ? 'Arriving' : 'Delivered'}
              </p>
            </div>
          </div>

          {/* Map Card */}
          <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden relative border border-slate-100 shadow-sm">
            <img 
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=450&fit=crop" 
              alt="Live tracking map" 
              className="w-full h-full object-cover"
            />
            {/* Overlay button */}
            {order.type === 'Delivery' && (
              <button 
                onClick={() => setShowMap(true)}
                className="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-slate-800 text-sm font-bold px-4 py-2 rounded-xl shadow-md border border-slate-200 active:scale-95 transition-transform flex items-center gap-2"
              >
                <MapIcon className="w-4 h-4 text-blue-600" /> 
                Live Track
              </button>
            )}
          </div>

          {/* OTP Card (MOST IMPORTANT) */}
          {order.type === 'Takeaway' ? (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
              <h2 className="text-sm font-bold text-slate-900 mb-2">Enter Restaurant PIN</h2>
              <p className="text-xs text-slate-500 mb-4">Ask the restaurant for the 6-digit PIN to confirm your pickup</p>
              <input
                type="text"
                maxLength={6}
                value={takeawayOtp}
                onChange={(e) => setTakeawayOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full max-w-[200px] text-center text-3xl font-black tracking-[0.25em] bg-slate-50 border border-slate-200 rounded-xl py-3 focus:outline-none focus:border-[#00bd6f] focus:ring-1 focus:ring-[#00bd6f] mx-auto block"
              />
              <button
                onClick={handlePickupComplete}
                disabled={takeawayOtp.length !== 6}
                className="w-full mt-4 bg-[#00bd6f] text-white py-3 rounded-xl font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform"
              >
                Confirm Pickup
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center relative overflow-hidden">
              <h2 className="text-slate-500 text-sm font-medium mb-2 uppercase tracking-wider">
                Delivery PIN
              </h2>
              <div className="flex items-center justify-center gap-4 mb-3">
                <div className="text-5xl font-black text-slate-900 tracking-widest">
                  {otp}
                </div>
                <button 
                  onClick={() => navigator.clipboard.writeText(otp)}
                  className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center active:scale-95 transition-all hover:bg-slate-200"
                >
                  <Copy className="w-5 h-5 text-slate-600" />
                </button>
              </div>
              <p className="text-slate-500 text-sm">
                Share this PIN with the delivery partner
              </p>
            </div>
          )}

          {/* Order Status Card */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">
                {order.type === 'Delivery' ? 'Delivery Status' : 'Order Status'}
              </h2>
              {order.type === 'Delivery' && (
                <button 
                  onClick={() => setShowMap(true)}
                  className="text-sm font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors bg-blue-50 text-blue-600 active:scale-95"
                >
                  <MapIcon className="w-4 h-4" /> View Map
                </button>
              )}
            </div>
            
            <div className="relative pl-3">
              <div className="absolute left-[27px] top-3 bottom-3 w-0.5 bg-slate-100" />
              <div className="absolute left-[27px] top-3 w-0.5 bg-[#00bd6f] transition-all duration-1000" style={{ height: `${progress}%` }} />
              
              <div className="space-y-6 relative">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#00bd6f] flex items-center justify-center shrink-0 shadow-sm z-10">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <div className="pt-1">
                    <h3 className="text-sm font-bold text-slate-900">Order Confirmed</h3>
                    <p className="text-xs text-slate-500">Your order has been received</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm z-10 transition-colors ${progress >= 20 ? 'bg-[#00bd6f]' : 'bg-white border-2 border-slate-200'}`}>
                    {progress >= 20 && <CheckCircle2 className="w-5 h-5 text-white" />}
                  </div>
                  <div className="pt-1">
                    <h3 className={`text-sm font-bold ${progress >= 20 ? 'text-slate-900' : 'text-slate-500'}`}>Preparing</h3>
                    <p className="text-xs text-slate-500">The restaurant is preparing your food</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm z-10 transition-colors ${progress >= 50 ? 'bg-[#00bd6f]' : 'bg-white border-2 border-slate-200'}`}>
                    {progress >= 50 && <CheckCircle2 className="w-5 h-5 text-white" />}
                  </div>
                  <div className="pt-1">
                    <h3 className={`text-sm font-bold ${progress >= 50 ? 'text-slate-900' : 'text-slate-500'}`}>
                      {order.type === 'Delivery' ? 'Order picked by driver' : 'Ready for Pickup'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {order.type === 'Delivery' ? 'Driver has collected your order' : 'Your order is ready to be collected'}
                    </p>
                  </div>
                </div>

                {order.type === 'Delivery' && (
                  <div className="flex gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm z-10 transition-colors ${progress >= 80 ? 'bg-[#00bd6f]' : 'bg-white border-2 border-slate-200'}`}>
                      {progress >= 80 && <CheckCircle2 className="w-5 h-5 text-white" />}
                    </div>
                    <div className="pt-1">
                      <h3 className={`text-sm font-bold ${progress >= 80 ? 'text-slate-900' : 'text-slate-500'}`}>Driver is arriving soon</h3>
                      <p className="text-xs text-slate-500">Driver is near your location</p>
                    </div>
                  </div>
                )}
                
                {order.type === 'Delivery' && (
                  <div className="flex gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm z-10 transition-colors ${progress >= 100 ? 'bg-[#00bd6f]' : 'bg-white border-2 border-slate-200'}`}>
                      {progress >= 100 && <CheckCircle2 className="w-5 h-5 text-white" />}
                    </div>
                    <div className="pt-1">
                      <h3 className={`text-sm font-bold ${progress >= 100 ? 'text-slate-900' : 'text-slate-500'}`}>Delivered</h3>
                      <p className="text-xs text-slate-500">Enjoy your meal!</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Restaurant / Delivery Partner Info */}
          {order.type === 'Delivery' && (
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden">
                  <Store className="w-6 h-6 text-slate-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-slate-900">{order.restaurantName}</h3>
                  <p className="text-xs text-slate-500 line-clamp-1">{order.location}</p>
                </div>
                <div className="flex gap-2">
                  <button className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center active:scale-95 transition-transform">
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            {order.type === 'Delivery' ? (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop&q=80" alt="Delivery Partner" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-slate-900">Ramesh Kumar</h3>
                  <p className="text-xs text-slate-500">Delivery Partner • 4.8 ★</p>
                </div>
                <div className="flex gap-2">
                  <button className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center active:scale-95 transition-transform">
                    <Phone className="w-4 h-4" />
                  </button>
                  <button className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center active:scale-95 transition-transform">
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden">
                  <Store className="w-6 h-6 text-slate-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-slate-900">{order.restaurantName}</h3>
                  <p className="text-xs text-slate-500 line-clamp-1">{order.location}</p>
                </div>
                <div className="flex gap-2">
                  <button className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center active:scale-95 transition-transform">
                    <MapPin className="w-4 h-4" />
                  </button>
                  <button className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center active:scale-95 transition-transform">
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Details Summary */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Order Details</h3>
            <div className="space-y-2 mb-4">
              {order.items.split(', ').map((item, i) => {
                const match = item.match(/^(\d+)x\s+(.+)$/);
                const qty = match ? match[1] : '1';
                const name = match ? match[2] : item;
                return (
                  <div key={i} className="flex justify-between text-sm">
                    <div className="flex gap-2">
                      <span className="font-medium text-slate-700">{qty}x</span>
                      <span className="text-slate-600">{name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Item Total</span>
                <span className="font-medium text-slate-700">₹{order.total ? order.total - 49 : 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Taxes & Fees</span>
                <span className="font-medium text-slate-700">₹49</span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-2 border-t border-slate-100">
                <span className="text-slate-900">Final Amount</span>
                <span className="text-slate-900">₹{order.total || 0}</span>
              </div>
              <div className="flex justify-between text-xs pt-2">
                <span className="text-slate-500">Payment Status</span>
                {paymentStatus === 'PAID' ? (
                  <span className="font-bold text-[#00bd6f] bg-[#00bd6f]/10 px-2 py-0.5 rounded">PAID</span>
                ) : (
                  <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">CASH ON DELIVERY</span>
                )}
              </div>
              {paymentStatus === 'PENDING' && (
                <div className="pt-4">
                  <button 
                    onClick={() => {
                      setIsProcessingPayment(true);
                      setTimeout(() => {
                        setIsProcessingPayment(false);
                        setPaymentStatus('PAID');
                      }, 1500);
                    }}
                    disabled={isProcessingPayment}
                    className="w-full bg-[#00bd6f] text-white py-3 rounded-xl font-bold text-sm active:scale-95 transition-transform disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {isProcessingPayment ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      'Complete Payment Now'
                    )}
                  </button>
                  <p className="text-center text-[10px] text-slate-400 mt-2">Pay in advance for contactless delivery</p>
                </div>
              )}
            </div>
          </div>

          {/* Help & Support Section */}
          <div className="bg-white rounded-2xl p-2 shadow-sm border border-slate-100">
            <button onClick={() => setIsChatOpen(true)} className="w-full flex items-center justify-between p-3 active:bg-slate-50 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-slate-600" />
                </div>
                <span className="text-sm font-medium text-slate-700">Report an issue</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
            <button className="w-full flex items-center justify-between p-3 active:bg-slate-50 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-slate-600" />
                </div>
                <span className="text-sm font-medium text-slate-700">Call support</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Ads Section */}
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 shadow-sm text-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="font-bold mb-1">Get 50% OFF on next order!</h3>
                <p className="text-xs text-white/80 mb-3">Join Crevings Gold membership today.</p>
                <button className="bg-white text-blue-600 text-xs font-bold px-4 py-2 rounded-full active:scale-95 transition-transform">
                  Explore Now
                </button>
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20">
                <img src="https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=400&fit=crop" alt="Burger" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-4 shadow-sm text-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="font-bold mb-1">Craving something sweet?</h3>
                <p className="text-xs text-white/80 mb-3">Add a dessert to your order now.</p>
                <button className="bg-white text-orange-600 text-xs font-bold px-4 py-2 rounded-full active:scale-95 transition-transform">
                  View Desserts
                </button>
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20">
                <img src="https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&h=400&fit=crop" alt="Dessert" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {progress < 20 && (
            <button 
              onClick={() => setIsCancelConfirmOpen(true)}
              className="w-full py-3 rounded-xl font-bold text-red-500 bg-red-50 active:scale-95 transition-transform mt-4 border border-red-100"
            >
              Cancel Order
            </button>
          )}

          {/* Demo Action */}
          <button 
            onClick={onOrderComplete}
            className="w-full py-3 rounded-xl font-bold text-slate-500 bg-slate-200 active:scale-95 transition-transform mt-4"
          >
            [Demo] Complete Order
          </button>
          
        </div>
      </div>
      <OrderChatBot 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        order={order} 
        progress={progress} 
        timeLeft={timeLeft} 
      />

      <AnimatePresence>
        {isSupportOpen && (
          <SupportMessagingView 
            onBack={() => setIsSupportOpen(false)} 
            orderId={order.id} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCancelConfirmOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-center text-slate-900 mb-2">Cancel Order?</h3>
              <p className="text-center text-slate-500 text-sm mb-4">
                Please select a reason for cancellation.
              </p>

              <div className="space-y-2 mb-6">
                {CANCEL_REASONS.map((reason) => (
                  <button
                    key={reason}
                    onClick={() => setCancelReason(reason)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors border ${
                      cancelReason === reason 
                        ? 'bg-red-50 border-red-500 text-red-700' 
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setIsCancelConfirmOpen(false);
                    setCancelReason("");
                  }}
                  className="flex-1 py-3 rounded-xl font-bold text-slate-700 bg-slate-100 active:scale-95 transition-transform"
                >
                  No, Keep It
                </button>
                <button 
                  onClick={() => {
                    if (cancelReason) {
                      setIsCancelConfirmOpen(false);
                      onCancelOrder?.();
                    }
                  }}
                  disabled={!cancelReason}
                  className="flex-1 py-3 rounded-xl font-bold text-white bg-red-500 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Yes, Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
