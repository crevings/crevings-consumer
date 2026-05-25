import React from 'react';
import { 
  ArrowLeft, 
  Headphones, 
  Phone, 
  MessageCircle, 
  MapPin, 
  Clock,
  CheckCircle2,
  Package,
  CreditCard,
  ChevronRight
} from 'lucide-react';

interface PartnerStoreTrackingViewProps {
  onBack: () => void;
  orderType: 'Delivery' | 'Takeaway';
  paymentMethod: 'UPI' | 'COD';
}

export const PartnerStoreTrackingView: React.FC<PartnerStoreTrackingViewProps> = ({ onBack, orderType, paymentMethod }) => {
  const deliverySteps = [
    'Order Confirmed',
    'Order Received',
    'Order Accepted by Supplier',
    'In Preparation',
    'Ready for Pickup',
    'Delivery Partner Arrived',
    'Delivery Partner Pickup',
    'On the Way',
    'Arrived at Location',
    'Delivery Done'
  ];

  const takeawaySteps = [
    'Order Confirmed',
    'Order Received',
    'Order Accepted by Supplier',
    'In Preparation',
    'Ready for Pickup',
    'Done'
  ];

  const steps = orderType === 'Delivery' ? deliverySteps : takeawaySteps;
  const currentStepIndex = 3; // "In Preparation"

  const cartItems = [
    { id: '1', name: 'Premium Pizza Boxes (10")', price: 1200, quantity: 2 },
    { id: 'a1', name: 'Pizza Tripods (100 pcs)', price: 150, quantity: 1 }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = orderType === 'Delivery' ? 150 : 0;
  const taxes = subtotal * 0.18;
  const total = subtotal + deliveryFee + taxes;

  return (
    <div className="min-h-screen bg-[#FFFFFF] pb-24 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-slate-100 h-[56px] flex items-center justify-between px-4 lg:h-[64px] lg:px-8">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center -ml-2 text-slate-700 active:bg-slate-100 rounded-full transition-colors lg:hover:bg-slate-100">
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-[18px] font-semibold text-slate-900">Track Order</h1>
        </div>
        <button className="w-10 h-10 flex items-center justify-center text-blue-600 bg-blue-50 rounded-full">
          <Headphones size={20} />
        </button>
      </header>

      <div className="p-4 space-y-4 lg:max-w-3xl lg:mx-auto lg:p-8 lg:space-y-6">
        
        {/* ETA & Status Card */}
        <div className="bg-[#FFFFFF] rounded-[20px] p-6 border border-slate-100 shadow-sm text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-600 mb-3">
            <Clock size={24} />
          </div>
          <h2 className="text-[32px] font-black text-slate-900 leading-none mb-1">
            {orderType === 'Delivery' ? '45 mins' : '20 mins'}
          </h2>
          <p className="text-[14px] text-slate-500 font-medium mb-4">Estimated {orderType} Time</p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-[14px] font-bold">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            In Preparation
          </div>
        </div>

        {/* OTP Box (Delivery Only) */}
        {orderType === 'Delivery' && (
          <div className="bg-[#FFFFFF] rounded-[20px] p-5 border border-slate-100 shadow-sm text-center">
            <h3 className="text-[14px] font-bold text-slate-900 mb-1">Delivery OTP</h3>
            <p className="text-[12px] text-slate-500 mb-4">Share this PIN with the delivery partner</p>
            <div className="flex gap-2 justify-center">
              {['1', '4', '2', '8', '5', '9'].map((digit, i) => (
                <div key={i} className="w-10 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-[20px] font-black text-slate-900 border border-slate-200 shadow-inner">
                  {digit}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="bg-[#FFFFFF] rounded-[20px] p-6 border border-slate-100 shadow-sm">
          <h3 className="text-[15px] font-bold text-slate-900 mb-6">Order Status</h3>
          <div className="relative pl-4">
            {/* Vertical Line */}
            <div className="absolute top-2 bottom-2 left-[23px] w-0.5 bg-slate-100" />
            
            <div className="space-y-6 relative z-10">
              {steps.map((step, index) => {
                const isCompleted = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const isPending = index > currentStepIndex;

                return (
                  <div key={index} className="flex gap-4">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      isCompleted ? 'bg-blue-600 text-white' : 
                      isCurrent ? 'bg-[#FFFFFF] border-4 border-blue-600' : 
                      'bg-slate-200'
                    }`}>
                      {isCompleted && <CheckCircle2 size={12} />}
                    </div>
                    <div>
                      <p className={`text-[14px] font-bold ${
                        isCompleted || isCurrent ? 'text-slate-900' : 'text-slate-400'
                      }`}>
                        {step}
                      </p>
                      {isCurrent && (
                        <p className="text-[12px] text-blue-600 font-medium mt-1">Currently happening...</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Supply Details */}
        <div className="bg-[#FFFFFF] rounded-[20px] p-5 border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
              <Package size={24} />
            </div>
            <div>
              <h4 className="text-[15px] font-bold text-slate-900">Partner Supply Hub</h4>
              <p className="text-[13px] text-slate-500">Warehouse 4A, Industrial Area</p>
            </div>
          </div>
          <button className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Phone size={18} />
          </button>
        </div>

        {/* Delivery Partner (Delivery Only) */}
        {orderType === 'Delivery' && (
          <div className="bg-[#FFFFFF] rounded-[20px] p-5 border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden shrink-0">
                <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop" alt="Delivery Partner" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="text-[15px] font-bold text-slate-900">Ramesh Kumar</h4>
                <p className="text-[13px] text-slate-500">Delivery Partner</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <MessageCircle size={18} />
              </button>
              <button className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Phone size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Order & Billing Details */}
        <div className="bg-[#FFFFFF] rounded-[20px] p-5 border border-slate-100 shadow-sm">
          <h3 className="text-[15px] font-bold text-slate-900 mb-4">Order Details</h3>
          
          <div className="space-y-3 mb-4 pb-4 border-b border-slate-100">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between text-[13px]">
                <span className="text-slate-700">{item.quantity}x {item.name}</span>
                <span className="font-medium text-slate-900">₹{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2 mb-4 pb-4 border-b border-slate-100">
            <div className="flex justify-between text-[13px]">
              <span className="text-slate-500">Item Total</span>
              <span className="font-medium text-slate-900">₹{subtotal.toLocaleString()}</span>
            </div>
            {orderType === 'Delivery' && (
              <div className="flex justify-between text-[13px]">
                <span className="text-slate-500">Delivery Fee</span>
                <span className="font-medium text-slate-900">₹{deliveryFee}</span>
              </div>
            )}
            <div className="flex justify-between text-[13px]">
              <span className="text-slate-500">Taxes</span>
              <span className="font-medium text-slate-900">₹{taxes.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <span className="text-[15px] font-bold text-slate-900">Total Paid</span>
            <span className="text-[18px] font-black text-blue-600">₹{total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
          </div>

          {/* Payment Status */}
          <div className={`p-4 rounded-xl flex items-center justify-between ${
            paymentMethod === 'UPI' ? 'bg-emerald-50 border border-emerald-100' : 'bg-amber-50 border border-amber-100'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                paymentMethod === 'UPI' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
              }`}>
                <CreditCard size={16} />
              </div>
              <div>
                <p className={`text-[13px] font-bold ${paymentMethod === 'UPI' ? 'text-emerald-800' : 'text-amber-800'}`}>
                  {paymentMethod === 'UPI' ? 'Prepaid (UPI)' : 'Unpaid (Cash on Delivery)'}
                </p>
                <p className={`text-[11px] ${paymentMethod === 'UPI' ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {paymentMethod === 'UPI' ? 'Payment received successfully' : 'Please pay at the time of delivery'}
                </p>
              </div>
            </div>
          </div>

          {/* Pay Online Button (If COD) */}
          {paymentMethod === 'COD' && (
            <button className="w-full mt-4 h-[44px] bg-blue-600 text-white rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-sm">
              Pay Online Now <ChevronRight size={16} />
            </button>
          )}

        </div>

      </div>
    </div>
  );
};
