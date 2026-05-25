import React, { useState, useEffect } from 'react';
import { Order } from '../types';
import { Bell, MapPin, Users, CalendarClock, AlertCircle, X, Tag } from 'lucide-react';

interface NewOrderAlertProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: (prepTime: number) => void;
  onReject?: () => void;
  order: Order;
}

export const NewOrderAlert: React.FC<NewOrderAlertProps> = ({ isOpen, onClose, onAccept, onReject, order }) => {
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [prepTime, setPrepTime] = useState<number | 'custom'>(10);
  const [customTime, setCustomTime] = useState<string>('');
  const [rejectReason, setRejectReason] = useState<string>('');

  const rejectReasons = [
    "Items out of stock",
    "Store is closing",
    "Too busy / High volume",
    "Other"
  ];

  // Play sound on mount (simulated with a visual pulse for now, as audio requires user interaction)
  useEffect(() => {
    // In a real app, you might play a sound here if allowed by the browser
  }, []);

  if (!isOpen) return null;

  const handleConfirmAccept = () => {
    const time = prepTime === 'custom' ? parseInt(customTime, 10) || 10 : prepTime;
    onAccept(time);
    onClose();
  };

  const handleReject = () => {
    if (onReject) {
      onReject();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-50 flex flex-col animate-in slide-in-from-bottom-full duration-300">
      
      {/* Top Banner */}
      <div className="bg-[#1E90FF] text-white p-5 flex items-center justify-center relative shrink-0 pt-safe">
        <div className="absolute inset-0 bg-[#1E90FF] animate-pulse opacity-50"></div>
        <div className="flex items-center gap-2 relative z-10">
          <Bell className="animate-bounce" size={20} />
          <h1 className="text-lg font-bold tracking-wide">New {order.type.toLowerCase()} order received</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-4">
        {/* Order Summary Card */}
          <div className="bg-slate-50 rounded-[16px] p-4 border border-[#E5E7EB]">
            <div className="grid grid-cols-2 gap-y-4 gap-x-2">
              <div>
                <p className="text-[13px] text-slate-500 mb-0.5">Customer Name</p>
                <p className="text-[15px] font-bold text-slate-900">{order.customer}</p>
              </div>
              <div>
                <p className="text-[13px] text-slate-500 mb-0.5">Customer Type</p>
                <p className="text-[15px] font-bold text-slate-900">{order.customerType || 'Regular'}</p>
              </div>
              
              <div>
                <p className="text-[13px] text-slate-500 mb-0.5">Order Number</p>
                <p className="text-[15px] font-bold text-slate-900">{order.id}</p>
              </div>
              <div>
                <p className="text-[13px] text-slate-500 mb-0.5">Order ID</p>
                <p className="text-[15px] font-bold text-slate-900">#{Math.floor(1000 + Math.random() * 9000)}</p>
              </div>

              <div>
                <p className="text-[13px] text-slate-500 mb-0.5">Channel</p>
                <p className="text-[15px] font-bold text-slate-900">{order.channel}</p>
              </div>
              <div>
                <p className="text-[13px] text-slate-500 mb-0.5">Order Type</p>
                <div className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[13px]">
                  {order.type}
                </div>
              </div>
            </div>
          </div>

          {/* Order Items Section */}
          <div className="bg-[#FFFFFF] rounded-[16px] p-4 border border-[#E5E7EB]">
            <h2 className="text-[15px] font-bold text-slate-900 mb-3">Order Details</h2>
            <div className="space-y-3">
              {order.itemList ? (
                order.itemList.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                    <div className="flex-1 pr-4">
                      <p className="text-[15px] font-medium text-slate-900">
                        {item.quantity} × {item.name} {item.size ? `(${item.size})` : ''}
                      </p>
                      {item.addOns && item.addOns.length > 0 && (
                        <p className="text-[13px] text-slate-500 mt-0.5">
                          Add-ons: {item.addOns.join(', ')}
                        </p>
                      )}
                      {item.note && (
                        <p className="text-[13px] text-orange-600 mt-0.5 italic">
                          Note: {item.note}
                        </p>
                      )}
                    </div>
                    <div className="text-[15px] font-bold text-slate-900 shrink-0">
                      ₹{item.price ? (item.price * item.quantity).toFixed(2) : '0.00'}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex justify-between items-start">
                  <p className="text-[15px] font-medium text-slate-900">{order.items}</p>
                </div>
              )}
            </div>
            
            {order.customerNote && (
              <div className="mt-3 pt-3 border-t border-slate-100">
                <p className="text-[13px] font-medium text-slate-700 mb-1">Customer Note:</p>
                <p className="text-[14px] text-slate-600 italic bg-orange-50 p-2 rounded-lg border border-orange-100">"{order.customerNote}"</p>
              </div>
            )}
          </div>

          {/* Offer Card */}
          {order.offer && (
            <div className="bg-blue-50 rounded-[16px] p-4 border border-blue-100 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                <Tag size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="text-[13px] text-blue-600 font-medium mb-0.5">Offer Applied</p>
                <p className="text-[15px] font-bold text-blue-900">{order.offer}</p>
              </div>
            </div>
          )}

          {/* Bill Details Card */}
          <div className="bg-[#FFFFFF] rounded-[16px] p-4 border border-[#E5E7EB] shadow-sm">
            <h2 className="text-[15px] font-bold text-slate-900 mb-3">Bill Details</h2>
            <div className="space-y-2 text-[14px]">
              <div className="flex justify-between text-slate-600">
                <span>Item Total</span>
                <span>₹{order.subtotal?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Taxes & Charges</span>
                <span>₹{order.tax?.toFixed(2) || '0.00'}</span>
              </div>
              {order.discount && order.discount > 0 ? (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span>- ₹{order.discount.toFixed(2)}</span>
                </div>
              ) : null}
              <div className="flex justify-between font-bold text-slate-900 pt-2 border-t border-slate-200 mt-2">
                <span>Total Bill</span>
                <span>₹{parseFloat(order.total.replace(/,/g, '')).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Order Type Conditional Info */}
          {order.type === 'Delivery' && (
            <div className="bg-[#FFFFFF] rounded-[16px] p-4 border border-[#E5E7EB] shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={18} className="text-blue-600" />
                <h2 className="text-[15px] font-bold text-slate-900">Delivery Address</h2>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <p className="text-[14px] font-medium text-slate-900 leading-relaxed">
                  {order.address || 'Civil Lines, Prayagraj'}
                </p>
              </div>
            </div>
          )}

          {(order.type === 'Dine-in' || order.type === 'Table Booking') && (
            <div className="bg-[#FFFFFF] rounded-[16px] p-4 border border-[#E5E7EB] grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Users size={16} className="text-indigo-600" />
                </div>
                <div>
                  <p className="text-[13px] text-slate-500 mb-0.5">Table Number</p>
                  <p className="text-[15px] font-bold text-slate-900">Table T4</p>
                </div>
              </div>
              <div>
                <p className="text-[13px] text-slate-500 mb-0.5">Guests</p>
                <p className="text-[15px] font-bold text-slate-900">4 Guests</p>
              </div>
              {order.type === 'Table Booking' && (
                <div className="col-span-2 flex items-start gap-3 pt-3 border-t border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                    <CalendarClock size={16} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[13px] text-slate-500 mb-0.5">Booking Time</p>
                    <p className="text-[15px] font-bold text-slate-900">7:30 PM</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#FFFFFF] border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex gap-3 z-10">
        <button 
          onClick={() => setShowRejectModal(true)}
          className="flex-1 py-3 px-4 bg-rose-50 text-rose-600 font-semibold rounded-xl active:scale-95 transition-transform"
        >
          Reject
        </button>
        <button 
          onClick={() => setShowAcceptModal(true)}
          className="flex-1 py-3 px-4 bg-[#1E90FF] text-white font-semibold rounded-xl active:scale-95 transition-transform"
        >
          Accept
        </button>
      </div>

      {/* Accept Modal (Bottom Sheet) */}
      {showAcceptModal && (
        <div 
          className="fixed inset-0 z-[10000] flex items-end justify-center bg-black/50 sm:items-center transition-opacity"
          onClick={() => setShowAcceptModal(false)}
        >
          <div 
            className="w-full bg-[#FFFFFF] rounded-t-2xl sm:rounded-2xl sm:max-w-md p-6 animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:fade-in duration-300"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-slate-900 mb-4 text-center">Set Preparation Time</h3>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[5, 10, 20].map((time) => (
                <button
                  key={time}
                  onClick={() => setPrepTime(time)}
                  className={`h-12 rounded-xl border-2 text-sm font-semibold transition-all ${
                    prepTime === time 
                    ? 'border-[#1E90FF] bg-blue-50 text-[#1E90FF]' 
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {time} Minutes
                </button>
              ))}
              <button
                onClick={() => setPrepTime('custom')}
                className={`h-12 rounded-xl border-2 text-sm font-semibold transition-all ${
                  prepTime === 'custom' 
                  ? 'border-[#1E90FF] bg-blue-50 text-[#1E90FF]' 
                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                Custom Time
              </button>
            </div>

            {prepTime === 'custom' && (
              <div className="mb-5">
                <label className="block text-[14px] font-medium text-[#374151] mb-2">Enter minutes</label>
                <input 
                  type="number" 
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  placeholder="e.g. 15"
                  className="w-full h-[44px] bg-[#FFFFFF] border border-[#E5E7EB] rounded-[10px] px-[12px] text-[14px] text-[#111827] focus:outline-none focus:border-[#1E90FF] transition-colors"
                  autoFocus
                />
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowAcceptModal(false)}
                className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-semibold rounded-xl active:scale-95 transition-transform"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmAccept}
                className="flex-1 py-3 px-4 bg-[#1E90FF] text-white font-semibold rounded-xl active:scale-95 transition-transform"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal (Bottom Sheet) */}
      {showRejectModal && (
        <div 
          className="fixed inset-0 z-[10000] flex items-end justify-center bg-black/50 sm:items-center transition-opacity"
          onClick={() => setShowRejectModal(false)}
        >
          <div 
            className="w-full bg-[#FFFFFF] rounded-t-2xl sm:rounded-2xl sm:max-w-md p-6 animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:fade-in duration-300 text-center"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} className="text-rose-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Reject Order?</h3>
            <p className="text-slate-500 mb-6">Please select a reason for rejecting this order.</p>
            
            <div className="space-y-2 mb-6 text-left">
              {rejectReasons.map(reason => (
                <button
                  key={reason}
                  onClick={() => setRejectReason(reason)}
                  className={`w-full p-3 rounded-xl border text-sm font-medium transition-colors ${
                    rejectReason === reason
                      ? 'border-rose-500 bg-rose-50 text-rose-700'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowRejectModal(false)}
                className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-semibold rounded-xl active:scale-95 transition-transform"
              >
                Cancel
              </button>
              <button 
                onClick={handleReject}
                disabled={!rejectReason}
                className="flex-1 py-3 px-4 bg-rose-500 text-white font-semibold rounded-xl active:scale-95 transition-transform disabled:opacity-50"
              >
                Reject Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
