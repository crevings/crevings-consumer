
import React, { useState } from 'react';
import { ArrowLeft, Star, Phone, MessageSquare, ChevronRight, HelpCircle, CheckCircle2, Percent } from 'lucide-react';
import { Order, Review } from "@/types";
import { normalizeOrderItems, joinItemNames } from "@/utils/orderItems";
import { post } from "@/api/fetcher";
import { downloadInvoice } from "@/lib/invoice";

interface RateOrderViewProps {
  order: Order;
  onBack: () => void;
  onSubmit: (review: Review) => void;
}

export const RateOrderView: React.FC<RateOrderViewProps> = ({ order, onBack, onSubmit }) => {
  const [deliveryRating, setDeliveryRating] = useState(order.ratingData?.deliveryRating || 0);
  const [restaurantRating, setRestaurantRating] = useState(order.ratingData?.restaurantRating || 0);
  const [selectedTip, setSelectedTip] = useState<number | null>(null);
  const [itemsRating, setItemsRating] = useState<Record<string, number>>(order.ratingData?.itemRatings || {});
  const [itemsFeedback, setItemsFeedback] = useState<Record<string, string>>({});
  const [packagingRating, setPackagingRating] = useState<string | null>(null);
  const [selectedDeliveryTags, setSelectedDeliveryTags] = useState<string[]>([]);
  const [customTipAmount, setCustomTipAmount] = useState<string>('');
  const [isTipPaid, setIsTipPaid] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alreadyRated, setAlreadyRated] = useState(order.isRated || false);
  const [_errorMessage, setErrorMessage] = useState('');

  // Support unlocks once the real delivery time is 10+ minutes old.
  const deliveredAt = order.createdAt ? Date.parse(order.createdAt) : NaN;
  const isPast10Mins = Number.isFinite(deliveredAt) && Date.now() - deliveredAt > 10 * 60 * 1000;

  const deliveryPartnerName = order.deliveryPartner?.name || "Your Delivery Partner";
  const deliveryPartnerFirstName = deliveryPartnerName.split(" ")[0] || "your delivery partner";

  const foodItems = normalizeOrderItems(order).map((item) => item.name);

  const handleItemRate = (item: string, rating: number) => {
    if (alreadyRated) return;
    setItemsRating(prev => ({ ...prev, [item]: rating }));
  };

  const toggleDeliveryTag = (tag: string) => {
    if (alreadyRated) return;
    setSelectedDeliveryTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const isSubmitEnabled = !alreadyRated && !isSubmitting && (deliveryRating > 0 || restaurantRating > 0);

  const handleSubmit = async () => {
    if (!isSubmitEnabled) return;
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const orderId = order.realOrderId || order.id;
      const data = await post<{ success: boolean; message?: string }>(
        `/consumer/profile/orders/${orderId}/rate`,
        {
          restaurantRating,
          deliveryRating,
          itemRatings: itemsRating,
          comment: JSON.stringify({
            tip: selectedTip === -1 ? Number(customTipAmount) : selectedTip,
            packagingRating,
            selectedDeliveryTags,
            itemsFeedback
          })
        }
      );
      if (!data.success) {
        throw new Error(data.message || 'Failed to submit rating.');
      }

      setAlreadyRated(true);
      setShowSuccessMessage(true);
      
      const reviewData: Review = {
        itemsRating,
        deliveryRating,
        reviewText: JSON.stringify({ restaurantRating, selectedDeliveryTags }),
        selectedTags: selectedDeliveryTags,
        mediaFiles: [],
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };

      onSubmit(reviewData);

    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      console.error("Submit rating error:", err);
      setErrorMessage(message || 'Failed to submit rating. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative">
      {/* Top Navigation Bar */}
      <div className="bg-white px-4 pt-12 pb-4 sticky top-0 z-30 flex items-center justify-between shadow-sm">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full flex items-center justify-center text-slate-700 active:bg-slate-100 transition-colors shrink-0"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-base font-bold text-slate-900 flex-1 text-center pr-10 truncate">{order.restaurantName}</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-32 no-scrollbar space-y-4">
        
        {/* Delivery Details Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-800">Delivery Details</h2>
            <span className="bg-slate-50 text-slate-600 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide">
              {order.status === 'CANCELLED' || order.status === 'REJECTED'
                ? 'Cancelled'
                : order.status === 'COMPLETED' || order.status === 'DELIVERED'
                  ? 'Delivered'
                  : 'In Progress'}
            </span>
          </div>
          
          <div className="relative pl-6 space-y-4 mb-4">
            <div className="absolute left-2 top-1.5 bottom-1.5 w-[2px] bg-slate-100"></div>
            
            <div className="relative">
              <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full border-2 border-blue-600 bg-white"></div>
              <p className="text-xs font-bold text-slate-800">{order.restaurantName}</p>
              <p className="text-xs text-slate-500">{order.location || 'Restaurant Location'}</p>
            </div>
            
            <div className="relative">
              <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full border-2 border-red-500 bg-white"></div>
              <p className="text-xs font-bold text-slate-800">Home</p>
              <p className="text-xs text-slate-500 line-clamp-1">123, 4th Cross, 5th Main Rd, Sector 6, HSR Layout</p>
            </div>
          </div>
          
          <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Order delivered on <span className="font-bold text-slate-800">{order.orderDate || "—"}</span> by <span className="font-bold text-slate-800">{deliveryPartnerName}</span> in <span className="font-bold text-slate-800">{order.timeEstimate || order.prepTime || "—"}</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Section 1: Delivery Partner Card */}
        {order.type === 'Delivery' && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                   <img loading="lazy" 
                     src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&q=80" 
                     alt="Delivery Partner" 
                     className="w-full h-full object-cover"
                   />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-800">{deliveryPartnerName}</h2>
                  <p className="text-xs text-slate-500">5k+ orders delivered</p>
                </div>
              </div>
              <div className="bg-slate-100 px-2 py-1 rounded-lg flex items-center gap-1">
                <span className="text-xs font-bold text-slate-700">4.8</span>
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              </div>
            </div>

            {/* Communication Row */}
            <div className="flex items-center gap-3 mb-5 border-b border-slate-100 pb-5">
              <button disabled className="flex-1 bg-slate-50 text-slate-400 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-slate-100">
                <MessageSquare className="w-4 h-4" />
                Chat is not available
              </button>
              <button 
                disabled={isPast10Mins}
                className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-transform shrink-0 ${
                  isPast10Mins 
                    ? 'bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed' 
                    : 'bg-blue-50 text-blue-600 border-blue-100 active:scale-95'
                }`}
              >
                <Phone className="w-5 h-5" />
              </button>
            </div>

            {/* Tip Section */}
            <div className="mb-5">
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                Thank {deliveryPartnerFirstName} by leaving a tip. 100% of the amount will go to them directly.
              </p>
              <div className="flex gap-2 mb-3">
                {[15, 20, 30].map(amount => (
                  <button 
                    key={amount}
                    onClick={() => { setSelectedTip(amount); setIsTipPaid(false); }}
                    className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-all active:scale-95 ${
                      selectedTip === amount 
                        ? 'bg-blue-50 border-blue-500 text-blue-700' 
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    ₹{amount}
                  </button>
                ))}
                <button 
                  onClick={() => { setSelectedTip(-1); setIsTipPaid(false); }}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-all active:scale-95 ${
                    selectedTip === -1 
                      ? 'bg-blue-50 border-blue-500 text-blue-700' 
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  Other
                </button>
              </div>
              
              {selectedTip === -1 && !isTipPaid && (
                <div className="mb-3">
                  <input
                    type="number"
                    placeholder="Enter custom amount"
                    value={customTipAmount}
                    onChange={(e) => setCustomTipAmount(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              )}
              
              {selectedTip !== null && !isTipPaid && (
                <button
                  onClick={() => setIsTipPaid(true)}
                  disabled={selectedTip === -1 && !customTipAmount}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-bold active:scale-95 transition-transform disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                  Pay ₹{selectedTip === -1 ? customTipAmount || '0' : selectedTip}
                </button>
              )}
              
              {isTipPaid && (
                <div className="w-full py-3 bg-green-50 text-green-700 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border border-green-200">
                  <CheckCircle2 className="w-5 h-5" />
                  Tip of ₹{selectedTip === -1 ? customTipAmount : selectedTip} Paid Successfully
                </div>
              )}
            </div>

            {/* Delivery Rating */}
            <div className="flex flex-col items-center border-t border-slate-100 pt-5">
              <h3 className="text-sm font-bold text-slate-800 mb-3">Rate {deliveryPartnerFirstName}</h3>
              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star}
                    disabled={alreadyRated}
                    onClick={() => { if (!alreadyRated) setDeliveryRating(star); }}
                    className={`p-1 transition-transform ${alreadyRated ? 'cursor-default opacity-80' : 'active:scale-90'}`}
                  >
                    <Star 
                      className={`w-8 h-8 transition-colors duration-200 ${
                        star <= deliveryRating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'
                      }`} 
                    />
                  </button>
                ))}
              </div>
              
              {/* Delivery Tags */}
              {deliveryRating > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mt-2 animate-fadeInUp">
                  {['Good Nature', 'Timely delivered', 'Very fast', 'Polite'].map(tag => (
                    <button
                      key={tag}
                      disabled={alreadyRated}
                      onClick={() => toggleDeliveryTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${alreadyRated ? 'cursor-default' : ''} ${
                        selectedDeliveryTags.includes(tag)
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Section 2: Restaurant Review Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                 <img loading="lazy" 
                   src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=150&h=150&fit=crop&q=80" 
                   alt="Restaurant" 
                   className="w-full h-full object-cover"
                 />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-800 line-clamp-1">{order.restaurantName}</h2>
                <p className="text-xs text-slate-500">{order.location}</p>
              </div>
            </div>
            <button className="w-10 h-10 bg-slate-50 text-slate-600 rounded-full flex items-center justify-center border border-slate-100 active:scale-95 transition-transform shrink-0">
              <Phone className="w-4 h-4" />
            </button>
          </div>

          <div className="mb-5 border-b border-slate-100 pb-4">
            <p className="text-xs font-bold text-slate-500 mb-1">Order #{order.realOrderId || order.id}</p>
            <p className="text-sm font-medium text-slate-800">{joinItemNames(order)}</p>
          </div>

          <div className="flex flex-col items-center mb-5">
            <h3 className="text-sm font-bold text-slate-800 mb-3 text-center">Rate {order.restaurantName}</h3>
            <div className="flex gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button 
                  key={star}
                  disabled={alreadyRated}
                  onClick={() => { if (!alreadyRated) setRestaurantRating(star); }}
                  className={`p-1 transition-transform ${alreadyRated ? 'cursor-default opacity-80' : 'active:scale-90'}`}
                >
                  <Star 
                    className={`w-8 h-8 transition-colors duration-200 ${
                      star <= restaurantRating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'
                    }`} 
                  />
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 font-medium text-center">
              {alreadyRated ? 'You have already submitted feedback for this order.' : 'Thank you for your feedback! This helps us serve you better.'}
            </p>
          </div>

          {/* Rate Items */}
          <div className="border-t border-slate-100 pt-5 mb-5">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Rate your items</h3>
            <div className="space-y-4">
              {foodItems.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700 flex-1 pr-4 line-clamp-2">{item}</span>
                    <div className="flex gap-1 shrink-0">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button 
                          key={star}
                          disabled={alreadyRated}
                          onClick={() => handleItemRate(item, star)}
                          className={`p-0.5 transition-transform ${alreadyRated ? 'cursor-default opacity-80' : 'active:scale-90'}`}
                        >
                          <Star 
                            className={`w-5 h-5 transition-colors duration-200 ${
                              star <= (itemsRating[item] || 0) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'
                            }`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  {(itemsRating[item] ?? 0) > 0 && (
                    <div className="animate-fadeInUp">
                      <input
                        type="text"
                        disabled={alreadyRated}
                        placeholder="What did you like or dislike?"
                        value={itemsFeedback[item] || ''}
                        onChange={(e) => setItemsFeedback(prev => ({ ...prev, [item]: e.target.value }))}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400 text-slate-700 disabled:opacity-60"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Rate Packaging */}
          <div className="border-t border-slate-100 pt-5">
            <h3 className="text-sm font-bold text-slate-800 mb-3">Packing was good?</h3>
            <div className="flex flex-wrap gap-2">
              {['Good', 'Not good', 'Need to improve'].map(option => (
                <button
                  key={option}
                  disabled={alreadyRated}
                  onClick={() => { if (!alreadyRated) setPackagingRating(option); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${alreadyRated ? 'cursor-default' : ''} ${
                    packagingRating === option
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Order Details Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Order Details</h3>
          
          <div className="space-y-2 mb-4 text-sm">
            {order.subtotal != null && (
              <div className="flex justify-between text-slate-600">
                <span>Item Total</span>
                <span>₹{order.subtotal}</span>
              </div>
            )}
            {order.deliveryFee != null && (
              <div className="flex justify-between text-slate-600">
                <span>Delivery Fee</span>
                <span>₹{order.deliveryFee}</span>
              </div>
            )}
            {order.tax != null && (
              <div className="flex justify-between text-slate-600">
                <span>Taxes & Charges</span>
                <span>₹{order.tax}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-slate-800 pt-2 border-t border-slate-100">
              <span>Total Paid</span>
              <span>₹{order.total || order.price || 0}</span>
            </div>
            <div className="flex justify-between text-slate-500 text-xs pt-1">
              <span>{order.payment?.method ? `Paid via ${order.payment.method}` : 'Payment method not available'}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button 
              onClick={() => downloadInvoice(order)}
              className="w-full py-2.5 bg-[#00bd6f] text-white rounded-xl text-sm font-bold active:scale-95 transition-transform flex items-center justify-center gap-2 shadow-sm"
            >
              Download Invoice
            </button>
          </div>
        </div>

        {/* Offer Details Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 mb-3">Offer Details</h3>
          {order.offer ? (
            <div className="bg-green-50 rounded-xl p-3 flex items-center gap-3 border border-green-100">
              <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                <Percent className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">{order.offer} applied</p>
                <p className="text-[10px] text-slate-500">You saved money on this order!</p>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3 border border-slate-100">
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center shrink-0">
                <Percent className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700">No offer applied on this order</p>
              </div>
            </div>
          )}
        </div>

        {/* Section 4: Customer Details Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div className="mb-3">
            <h3 className="text-sm font-bold text-slate-800 mb-0.5">
              {order.customerDetails?.name || order.customer || 'Customer'}
              {order.customerDetails?.phone ? `, ${order.customerDetails.phone}` : ''}
            </h3>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-700 mb-0.5">Delivery Address</p>
            <p className="text-xs text-slate-500 leading-relaxed">
              {order.customerDetails?.address || order.location || 'Delivery Address'}
            </p>
          </div>
        </div>

        {/* Section 5: Support Card */}
        <button 
          disabled={isPast10Mins}
          className={`w-full text-left bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between ${
            isPast10Mins ? 'opacity-60 cursor-not-allowed' : 'active:bg-slate-50 transition-colors cursor-pointer'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isPast10Mins ? 'bg-slate-100 text-slate-400' : 'bg-blue-50 text-blue-600'}`}>
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 mb-0.5">Need help with your order?</h3>
              <p className="text-xs text-slate-500">{isPast10Mins ? 'Support unavailable after 10 mins' : 'Get help & support'}</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </button>

      </div>

      {/* Submit Section */}
      <div className="fixed bottom-0 left-0 right-0 px-4 pt-4 pb-safe-bottom bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40">
        <button 
          onClick={handleSubmit}
          disabled={!isSubmitEnabled}
          className={`w-full py-4 rounded-xl font-bold text-base transition-all ${
            alreadyRated
              ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
              : isSubmitEnabled 
              ? 'bg-blue-600 text-white active:bg-blue-700 shadow-md' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          {alreadyRated ? 'Already Rated' : 'Submit Feedback'}
        </button>
      </div>

      {/* Success Message Overlay */}
      {showSuccessMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Thank You!</h2>
            <p className="text-slate-500 mb-6">Your feedback has been submitted successfully.</p>
          </div>
        </div>
      )}
    </div>
  );
};
