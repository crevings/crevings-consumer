import React, { useState } from 'react';
import { ArrowLeft, MapPin, Clock, CheckCircle2, Store, Phone, MessageSquare, HelpCircle, Copy, AlertCircle, ChevronRight, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Order } from "@/types";
import { ACCEPTED_ORDER_STATUSES, CANCEL_WINDOW_SECONDS } from "@/config/constants";
import { DeliveryPartnerCard } from "./components/DeliveryPartnerCard";
import { OrderStatusTimeline } from "./components/OrderStatusTimeline";
import { OrderPriceSummary } from "./components/OrderPriceSummary";
import { OrderChatBot } from "@/features/orders/OrderChatBot";
import { useOrderLiveUpdates } from "@/features/orders/hooks/useOrderLiveUpdates";
import { SupportMessagingView } from "@/shared/ui/SupportMessagingView";
import { LiveTrackingMap } from "@/features/orders/components/LiveTrackingMap";
import { post } from "@/api/fetcher";

interface OrderTrackingViewProps {
  onOrderComplete: () => void;
  order: Order;
  onBack: () => void;
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
  const [showMap, setShowMap] = useState(false);
  const [takeawayOtp, setTakeawayOtp] = useState('');
  const [paymentStatus] = useState(order.paymentMethod === 'cod' ? 'PENDING' : 'PAID');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const {
    progress,
    deliveryPin,
    cancelTimeLeft,
    isCancelled,
    isCancellingOrder,
    rejectionReason,
    showAcceptedBanner,
    setShowAcceptedBanner,
    orderStatus,
    assignedPartner,
    secondsElapsed,
    prepTime,
    driverLocation,
    handleCancelOrderApi,
  } = useOrderLiveUpdates(order, { onOrderComplete, onCancelOrder });

  // Real remaining time until the estimated delivery moment (order placed +
  // restaurant-set prep time). 0 when the data needed isn't available.
  const estimatedTimeLeftSeconds = (() => {
    if (!order.createdAt) return 0;
    const prepMinutes = parseInt(prepTime || "", 10);
    if (!Number.isFinite(prepMinutes) || prepMinutes <= 0) return 0;
    const etaMs = new Date(order.createdAt).getTime() + prepMinutes * 60_000;
    return Math.max(0, Math.floor((etaMs - Date.now()) / 1000));
  })();

  // Restaurant-set preparation time is only meaningful once the order is accepted.
  // Only show a value the restaurant actually set (via accept) — no fabricated default.
  const isOrderAccepted = ACCEPTED_ORDER_STATUSES.includes(orderStatus);
  const estimatedTime = isOrderAccepted ? (prepTime || null) : null;

  const handlePickupComplete = async () => {
    if (takeawayOtp.length === 6) {
      try {
        const result = await post<{ success: boolean; message?: string }>(
          `/consumer/restaurants/${order.restaurantId}/orders/${order.realOrderId || order.id}/complete`,
          { pin: takeawayOtp }
        );
        if (result.success) {
          onOrderComplete();
        } else {
          alert(result.message || "Failed to confirm pickup.");
        }
      } catch {
        alert("Failed to confirm pickup due to network issue.");
      }
    }
  };

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
              <LiveTrackingMap 
                progress={progress} 
                orderStatus={orderStatus}
                driverCoordinates={driverLocation}
                restaurantCoordinates={order.restaurantCoordinates} 
                deliveryCoordinates={order.deliveryCoordinates} 
              />
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
                {estimatedTime && (
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                        {estimatedTime}
                      </h2>
                      <p className="text-sm font-medium text-slate-500 mt-1">Estimated delivery time</p>
                    </div>
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center shadow-inner">
                      <Clock className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                )}

                {/* Progress Bar */}
                <div className="space-y-3">
                  <div className="relative h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 bg-[#00bd6f] transition-all duration-1000 rounded-full" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="text-sm font-bold text-slate-800 text-center">
                    {progress < 20 ? 'Order Confirmed' : progress < 50 ? 'Preparing your food' : progress < 100 ? 'Your order is on the way' : 'Delivered'}
                  </p>
                </div>

                <DeliveryPartnerCard partner={assignedPartner} />
                {/* Restaurant Card */}
                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-50 shrink-0 flex items-center justify-center border-2 border-white shadow-sm">
                    <Store className="w-6 h-6 text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-slate-900">{order.restaurantName}</h3>
                    <p className="text-xs font-medium text-slate-500 mt-0.5 line-clamp-1">{order.location}</p>
                  </div>
                  {(order.pickupOtp || order.customerPin) && (
                    <div className="shrink-0">
                      <div className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 text-xs font-bold text-slate-700 flex flex-col items-center">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">OTP</span>
                        <span className="text-sm tracking-widest">{order.pickupOtp || order.customerPin}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto pb-safe">
        <div className="p-4 space-y-4">
          
          {/* Order Accepted Success Banner */}
          {showAcceptedBanner && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 shadow-sm flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-bold text-emerald-950">Order Accepted!</h3>
                  <p className="text-xs text-emerald-700">The restaurant is preparing your food.</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAcceptedBanner(false)}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-100/50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg active:scale-95 transition-all"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Timer Section */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
            {estimatedTime && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-slate-500 font-medium">Estimated Time</p>
                  <p className="text-lg font-bold text-slate-900">{estimatedTime}</p>
                </div>
              </div>
            )}
            <div className={estimatedTime ? "text-right" : "text-left"}>
              <p className="text-xs text-slate-500 font-medium">Status</p>
              <p className="text-sm font-bold text-[#00bd6f]">
                {isCancelled ? (rejectionReason === 'Rejected by restaurant' ? 'Rejected' : 'Cancelled') : (
                  orderStatus === 'NEW' ? (secondsElapsed >= 60 ? 'Waiting for restaurant to accept the order' : 'Placing Order') :
                  orderStatus === 'PENDING_ACCEPT' ? 'Awaiting Restaurant' :
                  orderStatus === 'PREPARING' ? (prepTime ? `Preparing (${prepTime})` : 'Preparing') :
                  (orderStatus === 'READY' || orderStatus === 'OUT FOR DELIVERY') ? 'Your order is on the way' :
                  orderStatus === 'COMPLETED' ? 'Delivered' : orderStatus
                )}
              </p>
            </div>
          </div>

          {/* Cancellation Timer Card */}
          {cancelTimeLeft > 0 && !isCancelled && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col items-center text-center animate-in fade-in duration-300">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-green-600 animate-pulse" />
                <h3 className="text-base font-bold text-slate-900 font-sans">Placing order with restaurant...</h3>
              </div>
              <p className="text-xs text-slate-500 mb-4 px-2">
                You can cancel your order within the next {cancelTimeLeft} seconds if you want to make changes.
              </p>
              
              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-4 relative">
                <div 
                  className="bg-green-500 h-full transition-all duration-1000 ease-linear rounded-full" 
                  style={{ width: `${(cancelTimeLeft / CANCEL_WINDOW_SECONDS) * 100}%` }}
                />
              </div>

              <button
                onClick={handleCancelOrderApi}
                disabled={isCancellingOrder}
                className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl text-sm active:scale-[0.98] transition-all border border-red-200 flex items-center justify-center gap-2 disabled:opacity-75"
              >
                {isCancellingOrder ? (
                  <Loader2 className="w-4.5 h-4.5 animate-spin text-red-600" />
                ) : (
                  <X className="w-4 h-4" />
                )}
                Cancel Order
              </button>
            </div>
          )}

          {/* Waiting for Restaurant Banner (Shown after 60s of PENDING/NEW status) */}
          {secondsElapsed >= 60 && orderStatus === 'NEW' && !isCancelled && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm flex flex-col items-center text-center animate-in fade-in duration-300">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-3 text-amber-700 animate-pulse">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-amber-900 mb-1">Waiting for Restaurant response</h3>
              <p className="text-xs text-amber-700 leading-relaxed max-w-[280px]">
                The restaurant is taking longer than usual to accept your order. We are waiting for their confirmation.
              </p>
            </div>
          )}

          {/* Cancelled/Rejected Confirmation Banner */}
          {isCancelled && (
            <div className="bg-red-50 rounded-2xl p-5 shadow-sm border border-red-100 flex flex-col items-center text-center animate-in fade-in duration-300">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
                <X className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-base font-bold text-red-950 mb-1">
                {rejectionReason === 'Rejected by restaurant' ? 'Order Rejected' : 'Order Cancelled'}
              </h3>
              <p className="text-xs text-red-700 mb-4">
                {rejectionReason === 'Rejected by restaurant' 
                  ? 'The restaurant was unable to accept your order.' 
                  : 'This order has been cancelled and will not be processed.'}
              </p>
              <button
                onClick={onBack}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm active:scale-[0.98] transition-all shadow-sm"
              >
                Back to Home
              </button>
            </div>
          )}

          {/* Map Card */}
          <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden relative border border-slate-100 shadow-sm z-0">
            {order.type === 'Delivery' ? (
              <LiveTrackingMap 
                progress={isCancelled ? 0 : (cancelTimeLeft > 0 ? 0 : progress)} 
                orderStatus={orderStatus}
                driverCoordinates={driverLocation}
                restaurantCoordinates={order.restaurantCoordinates} 
                deliveryCoordinates={order.deliveryCoordinates} 
              />
            ) : (
              <iframe
                title="Restaurant Location"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(order.restaurantName + ", " + order.location)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                allowFullScreen
              />
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
                  {deliveryPin || order.customerPin || order.pickupOtp || ''}
                </div>
                <button 
                  onClick={() => navigator.clipboard.writeText(deliveryPin || order.customerPin || order.pickupOtp || '')}
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

          <OrderStatusTimeline
            orderType={order.type}
            progress={progress}
            assignedPartner={assignedPartner}
            onViewMap={() => setShowMap(true)}
          />

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
                  <img loading="lazy" src={assignedPartner?.photo || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop&q=80"} alt="Delivery Partner" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-slate-900">{assignedPartner?.name || 'Assigned Delivery Partner'}</h3>
                  <p className="text-xs text-slate-500">Delivery Partner • {assignedPartner?.rating ?? '—'} ★</p>
                </div>
                <div className="flex gap-2">
                  {assignedPartner?.phone ? (
                    <a href={`tel:${assignedPartner.phone}`} className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center active:scale-95 transition-transform">
                    <Phone className="w-4 h-4" />
                  </a>
                  ) : (
                  <span className="w-10 h-10 bg-green-50/50 text-green-600/50 rounded-full flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </span>
                  )}
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

          <OrderPriceSummary order={order} paymentStatus={paymentStatus} />

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
                <img loading="lazy" src="https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=400&fit=crop" alt="Burger" className="w-full h-full object-cover" />
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
                <img loading="lazy" src="https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&h=400&fit=crop" alt="Dessert" className="w-full h-full object-cover" />
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

          
        </div>
      </div>
      <OrderChatBot 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        order={order} 
        progress={progress} 
        timeLeft={estimatedTimeLeftSeconds} 
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
