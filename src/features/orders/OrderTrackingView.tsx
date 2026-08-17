import React, { useState } from 'react';
import { ArrowLeft, MapPin, Clock, CheckCircle2, Store, Phone, MessageSquare, MessageCircle, Copy, AlertCircle, ChevronRight, X, Loader2, SkipForward } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { Order } from "@/types";
import { ACCEPTED_ORDER_STATUSES, CANCEL_WINDOW_SECONDS, ORDER_STATUS } from "@/config/constants";
import { OrderStatusTimeline } from "./components/OrderStatusTimeline";
import { OrderPriceSummary } from "./components/OrderPriceSummary";
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



export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({ order, onBack, onOrderComplete, onCancelOrder }) => {
  const [takeawayOtp, setTakeawayOtp] = useState('');
  const [paymentStatus] = useState(order.paymentMethod === 'cod' ? 'PENDING' : 'PAID');
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  // User chose to Skip the remaining cancellation window — this ends the
  // backend buffer early so the restaurant is notified immediately.
  const orderKey = order.realOrderId || order.id;
  const [isSkipped, setIsSkipped] = useState<boolean>(() => {
    try {
      return Boolean(orderKey && localStorage.getItem(`skipped_wait_${orderKey}`));
    } catch {
      return false;
    }
  });
  const [isSkippingWait, setIsSkippingWait] = useState(false);

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

  // Restaurant-set preparation time is only meaningful once the order is accepted.
  // Only show a value the restaurant actually set (via accept) — no fabricated default.
  const isOrderAccepted = ACCEPTED_ORDER_STATUSES.includes(orderStatus);
  const estimatedTime = isOrderAccepted ? (prepTime || null) : null;

  // End the 60-second cancellation buffer server-side. The restaurant is only
  // notified after this window, so skipping it means it gets the order now.
  const handleSkipWait = async () => {
    if (isSkippingWait) return;
    setIsSkippingWait(true);
    try {
      const result = await post<{ success: boolean; message?: string }>(
        `/consumer/restaurants/${order.restaurantId}/orders/${orderKey}/skip-cancel-window`,
        {}
      );
      if (result.success) {
        setIsSkipped(true);
        if (orderKey) {
          try {
            localStorage.setItem(`skipped_wait_${orderKey}`, 'true');
          } catch {}
        }
      } else {
        alert(result.message || "Failed to skip the wait.");
      }
    } catch {
      alert("Failed to skip the wait due to network issue.");
    } finally {
      setIsSkippingWait(false);
    }
  };

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
      <div className="bg-white px-4 pt-safe-3 pb-3 sticky top-0 z-30 shadow-sm">
        <div className="app-container-tracking flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 active:scale-95 transition-transform">
            <ArrowLeft className="w-6 h-6 text-slate-700" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Order Tracking</h1>
            <p className="text-xs text-slate-500">Order ID: {order.displayOrderNumber || order.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a 
            href={`mailto:support@crevings.com?subject=Support%20Request%20-%20Order%20%23${encodeURIComponent(order.displayOrderNumber || order.id)}`}
            aria-label="Contact Support via Email"
            className="px-3.5 py-1.5 active:scale-95 transition-all bg-emerald-50 text-[#00bd6f] hover:bg-emerald-100 rounded-full flex items-center border border-emerald-200/60 shadow-sm text-xs font-bold"
          >
            Help
          </a>
        </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-safe">
        <div className="p-4 space-y-4 app-container-tracking">
          
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

          {/* Estimated Time Section */}
          {estimatedTime && (
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-slate-500 font-medium">Estimated Time</p>
                  <p className="text-lg font-bold text-slate-900">{estimatedTime}</p>
                </div>
              </div>
            </div>
          )}

          {/* Cancellation Timer Card — Cancel (terminate the order) or Skip (notify the restaurant now) */}
          {cancelTimeLeft > 0 && !isCancelled && !isSkipped && (
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

              <div className="grid grid-cols-2 gap-3 w-full">
                {/* Skip — end the 60s window now and notify the restaurant immediately */}
                <button
                  onClick={handleSkipWait}
                  disabled={isSkippingWait}
                  className="py-3 bg-[#00bd6f] hover:bg-[#00a85f] text-white font-bold rounded-xl text-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-75 shadow-sm"
                >
                  {isSkippingWait ? (
                    <Loader2 className="w-4.5 h-4.5 animate-spin text-white" />
                  ) : (
                    <SkipForward className="w-4 h-4" />
                  )}
                  Skip Wait
                </button>

                {/* Cancel — terminate the order entirely within the 60s window */}
                <button
                  onClick={handleCancelOrderApi}
                  disabled={isCancellingOrder}
                  className="py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl text-sm active:scale-[0.98] transition-all border border-red-200 flex items-center justify-center gap-2 disabled:opacity-75"
                >
                  {isCancellingOrder ? (
                    <Loader2 className="w-4.5 h-4.5 animate-spin text-red-600" />
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                  Cancel Order
                </button>
              </div>

              <p className="text-[10px] text-slate-400 mt-2">
                Skipping notifies the restaurant immediately instead of waiting for the timer to finish.
              </p>
            </div>
          )}

          {/* Waiting for Restaurant Banner (Shown once the restaurant has been notified but hasn't responded) */}
          {secondsElapsed >= 60 && orderStatus === ORDER_STATUS.PENDING_ACCEPT && !isCancelled && (
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

          {/* OTP / PIN + Status Timeline — side by side on tablet+ */}
          <div className="md:grid md:grid-cols-2 md:gap-4">
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
          />
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
                  {order.restaurantPhone ? (
                    <a
                      href={`tel:${order.restaurantPhone.replace(/[^\d+]/g, '')}`}
                      aria-label={`Call ${order.restaurantName}`}
                      className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center active:scale-95 transition-transform hover:bg-green-100"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  ) : (
                    <span
                      title="Restaurant phone number not available"
                      className="w-10 h-10 bg-green-50/50 text-green-600/40 rounded-full flex items-center justify-center cursor-not-allowed"
                    >
                      <Phone className="w-4 h-4" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            {order.type === 'Delivery' ? (
              assignedPartner ? (
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
                    <a href={`tel:${assignedPartner.phone.replace(/[^\d+]/g, '')}`} className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center active:scale-95 transition-transform hover:bg-green-100">
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
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-[#00bd6f] animate-spin" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-slate-900">Searching for Delivery Partner</h3>
                    <p className="text-xs text-slate-500">Finding a nearby driver for your order</p>
                  </div>
                </div>
              )
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
                  <a
                    href={`https://maps.google.com/maps?q=${encodeURIComponent(order.restaurantName + ", " + order.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center active:scale-95 transition-transform hover:bg-blue-100"
                  >
                    <MapPin className="w-4 h-4" />
                  </a>
                  {order.restaurantPhone ? (
                    <a
                      href={`tel:${order.restaurantPhone.replace(/[^\d+]/g, '')}`}
                      aria-label={`Call ${order.restaurantName}`}
                      className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center active:scale-95 transition-transform hover:bg-green-100"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  ) : (
                    <span
                      title="Restaurant phone number not available"
                      className="w-10 h-10 bg-green-50/50 text-green-600/40 rounded-full flex items-center justify-center cursor-not-allowed"
                    >
                      <Phone className="w-4 h-4" />
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <OrderPriceSummary order={order} paymentStatus={paymentStatus} />

          {/* Help & Support Section */}
          <div className="bg-white rounded-2xl p-2 shadow-sm border border-slate-100">
            <a href="mailto:support@crevings.com" className="w-full flex items-center justify-between p-3 active:bg-slate-50 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-slate-600" />
                </div>
                <span className="text-sm font-medium text-slate-700">Report an issue</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>
            <a
              href="https://wa.me/918678842995?text=Hello"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between p-3 active:bg-slate-50 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-slate-600" />
                </div>
                <span className="text-sm font-medium text-slate-700">WhatsApp support</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>
          </div>


        </div>
      </div>

      <AnimatePresence>
        {isSupportOpen && (
          <SupportMessagingView 
            onBack={() => setIsSupportOpen(false)} 
            orderId={order.id} 
          />
        )}
      </AnimatePresence>

    </div>
  );
};
