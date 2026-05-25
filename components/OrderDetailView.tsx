import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Phone, Clock, AlertTriangle, 
  Headset, X, FileText, Receipt, Printer, Tag, Plus
} from 'lucide-react';
import { Order } from '../types';
import { printKOT, printInvoice } from '../lib/print';

type OrderType = 'Delivery' | 'Offline Orders' | 'Dine-in' | 'Table Booking';

interface OrderDetailViewProps {
  order: Order;
  onBack: () => void;
  onUpdateOrder?: (order: Order) => void;
  onAddMoreItems?: (order: Order) => void;
  onUpdateOrderStatus?: (orderId: string) => void;
}

export const OrderDetailView: React.FC<OrderDetailViewProps> = ({ order, onBack, onUpdateOrder, onAddMoreItems, onUpdateOrderStatus }) => {
  const [showDelayModal, setShowDelayModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isPartnerAssigned, setIsPartnerAssigned] = useState(true);
  const [unavailableItems, setUnavailableItems] = useState<number[]>([]);

  const toggleUnavailable = (idx: number) => {
    setUnavailableItems(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  // Timer state
  const TOTAL_TIME = 15 * 60; // 15 minutes
  const [timeLeft, setTimeLeft] = useState(12 * 60 + 39); // Starts at 12:39

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const getTimerColor = (current: number, total: number) => {
    const percentage = Math.max(0, current / total);
    // Hue 120 is green, 0 is red.
    const hue = Math.floor(percentage * 120);
    return `hsl(${hue}, 85%, 45%)`;
  };

  // Map order type from the mock data to our supported types
  const orderType: OrderType = (order.type as OrderType) || 'Delivery';

  // Calculate totals based on the order data (mocking the breakdown)
  const totalAmount = parseFloat(order.total.replace(/[^0-9.]/g, '')) || 0;
  const tax = Math.round(totalAmount * 0.05);
  const subtotal = totalAmount - tax;
  
  const isResolved = order.status === 'Completed' || order.status === 'Delivered' || order.status === 'Cancelled';

  return (
    <div className="fixed inset-0 z-[150] bg-slate-50 flex flex-col animate-in slide-in-from-right duration-300 overflow-y-auto pb-24">
      {/* Dev Toggle for previewing different states (Optional, keeping it for testing) */}
      {!isResolved && (
        <div className="bg-slate-800 p-2 flex gap-2 overflow-x-auto text-xs shrink-0">
          {orderType === 'Delivery' && (
            <button 
              onClick={() => setIsPartnerAssigned(!isPartnerAssigned)}
              className="px-3 py-1.5 rounded-full whitespace-nowrap bg-slate-700 text-slate-300"
            >
              Toggle Partner
            </button>
          )}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#FFFFFF] border-b border-slate-100 sticky top-0 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 text-slate-600 active:bg-slate-50 rounded-full">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-[18px] font-semibold text-slate-900">{order.id}</h1>
            <div className="flex items-center gap-2 text-xs mt-0.5">
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md font-medium">{orderType}</span>
              <span className="text-slate-500">{order.time}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-[14px]">
        {/* Customer Info Card */}
        <div className="bg-[#FFFFFF] rounded-[16px] p-4 border border-[#E5E7EB]">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">{order.customer}</h2>
              <span className="inline-block px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-medium rounded mt-1">
                {order.customerType || 'Regular'}
              </span>
            </div>
            <button className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Phone size={18} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-y-4 text-sm">
            <div>
              <p className="text-slate-500 text-xs mb-0.5">Channel</p>
              <p className="font-medium text-slate-900">{order.channel || 'Crevings'}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs mb-0.5">Order Type</p>
              <p className="font-medium text-slate-900">{orderType}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs mb-0.5">Order Date</p>
              <p className="font-medium text-slate-900">15 Mar 2026</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs mb-0.5">Order Time</p>
              <p className="font-medium text-slate-900">{order.time}</p>
            </div>
          </div>
        </div>

        {/* Print Actions */}
        {!isResolved && (
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => printKOT(order.id, order.itemList || [], order.tableNumber, orderType)}
              className="group h-[56px] rounded-[16px] bg-[#FFFFFF] border border-slate-200 shadow-sm flex items-center justify-center gap-3 active:bg-slate-50 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center group-active:scale-95 transition-transform">
                <Printer size={16} className="text-indigo-600" />
              </div>
              <span className="text-sm font-semibold text-slate-700">Print KOT</span>
            </button>
            <button 
              onClick={() => printInvoice(order.id, order.itemList || [], totalAmount, order.customer, orderType)}
              className="group h-[56px] rounded-[16px] bg-[#FFFFFF] border border-slate-200 shadow-sm flex items-center justify-center gap-3 active:bg-slate-50 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center group-active:scale-95 transition-transform">
                <Receipt size={16} className="text-blue-600" />
              </div>
              <span className="text-sm font-semibold text-slate-700">Invoice</span>
            </button>
          </div>
        )}

        {/* Preparation Timing Card */}
        {!isResolved && orderType !== 'Offline Orders' && orderType !== 'Dine-in' && (
          <div className="bg-[#FFFFFF] rounded-[16px] p-5 border border-[#E5E7EB] shadow-sm relative overflow-hidden">
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 h-1.5 bg-slate-100 w-full">
              <div 
                className="h-full transition-all duration-1000 ease-linear" 
                style={{ 
                  width: `${(timeLeft / TOTAL_TIME) * 100}%`,
                  backgroundColor: getTimerColor(timeLeft, TOTAL_TIME)
                }}
              />
            </div>
            
            <div className="flex items-center justify-between mb-4 mt-1">
              <h2 className="text-base font-semibold text-slate-900">Preparation Time</h2>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100">
                <Clock size={14} className="text-slate-500" />
                <span className="text-xs font-medium text-slate-600">Target: 12:45 PM</span>
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center py-5 mb-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div 
                className="text-[46px] leading-none font-mono font-bold tracking-tighter transition-colors duration-1000"
                style={{ color: getTimerColor(timeLeft, TOTAL_TIME) }}
              >
                {formatTime(timeLeft)}
              </div>
              <p className="text-[11px] font-semibold text-slate-500 mt-2 uppercase tracking-widest">Minutes Remaining</p>
            </div>

            <button 
              onClick={() => setShowDelayModal(true)}
              className="w-full h-12 rounded-xl border-2 border-dashed border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 active:bg-slate-100 flex items-center justify-center gap-2 transition-colors"
            >
              <AlertTriangle size={16} />
              Request More Time
            </button>
          </div>
        )}

        {/* Offer Applied Card */}
        {order.offer && (
          <div className="bg-[#FFFFFF] rounded-[16px] p-4 border border-[#E5E7EB] shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <Tag size={12} className="text-emerald-600" />
              </div>
              <h2 className="text-base font-semibold text-slate-900">Offer Applied</h2>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
              <p className="text-sm font-semibold text-emerald-800">{order.offer}</p>
              <p className="text-xs text-emerald-600 mt-0.5">Customer applied this offer at checkout.</p>
            </div>
          </div>
        )}

        {/* Order Details Card */}
        <div className="bg-[#FFFFFF] rounded-[16px] p-4 border border-[#E5E7EB] shadow-sm">
          <h2 className="text-[15px] font-bold text-slate-900 mb-3">Order Details</h2>
          
          <div className="space-y-3">
            {order.itemList ? (
              order.itemList.map((item, idx) => {
                const isUnavailable = unavailableItems.includes(idx);
                return (
                  <div key={idx} className={`flex justify-between items-start border-b border-slate-50 pb-3 last:border-0 last:pb-0 ${isUnavailable ? 'opacity-60' : ''}`}>
                    <div className="flex-1 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded border border-green-600 flex items-center justify-center shrink-0">
                          <div className="w-2 h-2 rounded-full bg-green-600"></div>
                        </div>
                        <p className={`text-[15px] font-medium ${isUnavailable ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                          {item.quantity} × {item.name} {item.size ? `(${item.size})` : ''}
                        </p>
                      </div>
                      {item.addOns && item.addOns.length > 0 && (
                        <p className="text-[13px] text-slate-500 mt-0.5 ml-6">
                          Add-ons: {item.addOns.join(', ')}
                        </p>
                      )}
                      {item.note && (
                        <p className="text-[13px] text-orange-600 mt-0.5 ml-6 italic">
                          Note: {item.note}
                        </p>
                      )}
                      {!isResolved && (
                        <button
                          onClick={() => toggleUnavailable(idx)}
                          className={`mt-2 ml-6 text-[12px] font-semibold px-2 py-1 rounded-md transition-colors ${
                            isUnavailable 
                              ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
                              : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                          }`}
                        >
                          {isUnavailable ? 'Mark Available' : 'Mark Unavailable'}
                        </button>
                      )}
                    </div>
                    <div className={`text-[15px] font-bold ${isUnavailable ? 'text-slate-500 line-through' : 'text-slate-900'} shrink-0`}>
                      ₹{item.price ? (item.price * item.quantity).toFixed(2) : '0.00'}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border border-green-600 flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-green-600"></div>
                  </div>
                  <p className="text-[15px] font-medium text-slate-900">{order.items}</p>
                </div>
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

        {/* Bill Details Card */}
        <div className="bg-[#FFFFFF] rounded-[16px] p-4 border border-[#E5E7EB] shadow-sm">
          <h2 className="text-[15px] font-bold text-slate-900 mb-3">Bill Details</h2>
          <div className="space-y-2 text-[14px]">
            <div className="flex justify-between text-slate-600">
              <span>Item Total</span>
              <span>₹{order.subtotal?.toFixed(2) || subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Taxes & Charges</span>
              <span>₹{order.tax?.toFixed(2) || tax.toFixed(2)}</span>
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
            
            <div className="flex justify-between items-center pt-3 mt-1 border-t border-slate-100">
              <span className="text-sm text-slate-500">Payment Status</span>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium px-2 py-1 rounded-md ${order.paymentStatus === 'Unpaid' ? 'text-amber-600 bg-amber-50' : 'text-emerald-600 bg-emerald-50'}`}>
                  {order.paymentStatus || 'Prepaid'}
                </span>
                {order.paymentStatus === 'Unpaid' && (
                  <button onClick={() => setShowPaymentModal(true)} className="text-xs font-bold text-blue-600 underline">Update</button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Add More Items (Only for Offline Dine-in) */}
        {order.channel === 'offline, dine in' && (
          <button 
            onClick={() => onAddMoreItems && onAddMoreItems(order)}
            className="w-full bg-[#FFFFFF] rounded-[16px] p-4 border border-[#E5E7EB] flex items-center justify-center gap-2 text-blue-600 font-bold mb-6"
          >
            <Plus size={20} />
            Add More Items
          </button>
        )}

        {/* Delivery Partner Card */}
        {orderType === 'Delivery' && (
          <div className="bg-[#FFFFFF] rounded-[16px] p-4 border border-[#E5E7EB]">
            <h2 className="text-base font-semibold text-slate-900 mb-4">Delivery Partner</h2>
            
            {isPartnerAssigned ? (
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
                    <img src="https://i.pravatar.cc/150?u=1" alt="Partner" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Ramesh Kumar</p>
                    <p className="text-xs text-slate-500">Arriving in 5 mins</p>
                  </div>
                </div>
                <button className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Phone size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse shrink-0"></div>
                <p className="text-sm text-slate-600">Searching for delivery partner...</p>
              </div>
            )}

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">OTP</span>
              <span className="text-lg font-bold tracking-widest text-slate-900">458213</span>
            </div>
          </div>
        )}

        {/* Offline Orders OTP Box */}
        {!isResolved && orderType === 'Offline Orders' && (
          <div className="bg-[#FFFFFF] rounded-[16px] p-4 border border-[#E5E7EB]">
            <h2 className="text-base font-semibold text-slate-900 mb-2">Pickup OTP</h2>
            <p className="text-xs text-slate-500 mb-4">Ask customer for this OTP during pickup.</p>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">OTP</span>
              <span className="text-lg font-bold tracking-widest text-slate-900">458213</span>
            </div>
          </div>
        )}

        {/* Table Information */}
        {(orderType === 'Dine-in' || orderType === 'Table Booking') && (
          <div className="bg-[#FFFFFF] rounded-[16px] p-4 border border-[#E5E7EB]">
            <h2 className="text-base font-semibold text-slate-900 mb-4">Table Information</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-500 mb-1">Table Number</p>
                <p className="text-lg font-bold text-slate-900">T4</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-500 mb-1">Number of Guests</p>
                <p className="text-lg font-bold text-slate-900">4 Guests</p>
              </div>
            </div>
          </div>
        )}

        {/* Booking Information */}
        {orderType === 'Table Booking' && (
          <div className="bg-[#FFFFFF] rounded-[16px] p-4 border border-[#E5E7EB]">
            <h2 className="text-base font-semibold text-slate-900 mb-4">Booking Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Customer Name</span>
                <span className="font-medium text-slate-900">{order.customer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Booking ID</span>
                <span className="font-medium text-slate-900">BK-9821</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Table Numbers</span>
                <span className="font-medium text-slate-900">T4, T5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Number of Guests</span>
                <span className="font-medium text-slate-900">6 Guests</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Booking Type</span>
                <span className="font-medium text-slate-900">Pre-order with booking</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Booking Date</span>
                <span className="font-medium text-slate-900">16 Mar 2026</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Booking Time</span>
                <span className="font-medium text-slate-900">08:00 PM</span>
              </div>
            </div>
          </div>
        )}

        {/* Update Status Button */}
        {order.status !== 'Completed' && order.status !== 'Delivered' && order.status !== 'Cancelled' && (
          <button 
            onClick={() => {
              if (onUpdateOrderStatus) {
                onUpdateOrderStatus(order.id);
                onBack();
              }
            }}
            className="w-full h-14 bg-[#1E90FF] text-white rounded-[16px] font-bold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all mt-4"
          >
            {(orderType === 'Offline Orders' || orderType === 'Dine-in') ? 'Complete Order' : 'Update Status'}
          </button>
        )}
      </div>

      {/* Floating Support Icon */}
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-slate-900 text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform z-40">
        <Headset size={24} />
      </button>

      {/* Delay Modal */}
      {showDelayModal && (
        <DelayModal onClose={() => setShowDelayModal(false)} />
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[200] bg-black/50 flex items-end justify-center animate-in fade-in">
          <div className="bg-[#FFFFFF] w-full max-w-md rounded-t-[24px] p-6 animate-in slide-in-from-bottom-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900">Update Payment Status</h3>
              <button onClick={() => setShowPaymentModal(false)} className="p-2 bg-slate-100 rounded-full text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {['Cash', 'UPI', 'Card'].map(method => (
                <button 
                  key={method}
                  onClick={() => {
                    if (onUpdateOrder) {
                      onUpdateOrder({ ...order, paymentStatus: 'Paid' });
                    }
                    setShowPaymentModal(false);
                  }}
                  className="h-14 rounded-xl font-bold border border-slate-200 text-slate-700 hover:border-slate-300 bg-[#FFFFFF] transition-all"
                >
                  {method}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DelayModal = ({ onClose }: { onClose: () => void }) => {
  const [selectedDelay, setSelectedDelay] = useState<number | 'custom' | null>(null);
  const [customDelay, setCustomDelay] = useState('');

  const getWarningMessage = (delay: number | null) => {
    if (!delay) return null;
    if (delay <= 5) return { text: 'Minor delays are generally accepted', color: 'text-emerald-600', bg: 'bg-emerald-50' };
    if (delay <= 15) return { text: 'Slight impact on customer satisfaction', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { text: 'High risk of poor rating', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const currentDelayValue = selectedDelay === 'custom' ? parseInt(customDelay) || null : selectedDelay;
  const warning = getWarningMessage(currentDelayValue);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-[#FFFFFF] w-full sm:w-[400px] rounded-t-2xl sm:rounded-2xl p-4 pb-8 sm:pb-4 animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Delay Order</h3>
          <button onClick={onClose} className="p-2 text-slate-400 active:bg-slate-50 rounded-full">
            <X size={20} />
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[5, 10, 20].map(mins => (
            <button 
              key={mins}
              onClick={() => setSelectedDelay(mins)}
              className={`h-12 rounded-xl border font-medium text-sm transition-colors ${selectedDelay === mins ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-700 active:bg-slate-50'}`}
            >
              {mins} Minutes
            </button>
          ))}
          <button 
            onClick={() => setSelectedDelay('custom')}
            className={`h-12 rounded-xl border font-medium text-sm transition-colors ${selectedDelay === 'custom' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-700 active:bg-slate-50'}`}
          >
            Custom Delay
          </button>
        </div>

        {selectedDelay === 'custom' && (
          <div className="mb-4">
            <input 
              type="number" 
              placeholder="Enter minutes" 
              value={customDelay}
              onChange={(e) => setCustomDelay(e.target.value)}
              className="w-full h-12 rounded-xl border border-slate-200 px-4 text-sm focus:outline-none focus:border-blue-600"
            />
          </div>
        )}

        {warning && (
          <div className={`p-3 rounded-xl mb-6 flex items-start gap-2 ${warning.bg}`}>
            <AlertTriangle size={18} className={`shrink-0 mt-0.5 ${warning.color}`} />
            <p className={`text-sm font-medium ${warning.color}`}>{warning.text}</p>
          </div>
        )}

        <button 
          className="w-full h-12 bg-blue-600 text-white rounded-xl font-medium text-sm active:bg-blue-700 transition-colors disabled:opacity-50"
          disabled={!selectedDelay || (selectedDelay === 'custom' && !customDelay)}
          onClick={onClose}
        >
          Confirm Delay
        </button>
      </div>
    </div>
  );
};
