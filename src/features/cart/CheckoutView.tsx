import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Edit2,
  Plus,
  Minus,
  Tag,
  Info,
  ChevronRight,
  ChevronLeft,
  X,
  Loader2,
  CheckCircle2,
  Trash2,
  Bike,
  ShoppingBag,
  Clock,
  Utensils,
  MessageSquare,
  PhoneOff,
  BellOff,
  DoorClosed,
  Shield,
  Heart,
  Sparkles,
  Banknote,
  Check,
  Search,
  ShoppingCart,
} from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { UpiLogo } from "../../shared/components/UpiLogo";
import { useLocation as useAppLocation } from "../../contexts/LocationContext";
import { useRestaurant } from "../../contexts/RestaurantContext";
import { useApp } from "../../contexts/AppContext";
import { CartItem, Order } from "@/types";
import { CartPreviewSheet } from "./components/CartPreviewSheet";

export const CheckoutView: React.FC = () => {
  const navigate = useNavigate();
  const { cart, setCart, selectedRestaurant, menuItems } = useCart();
  const { currentLocation } = useAppLocation();
  const { setActiveOrder } = useRestaurant();
  const { setIsLoadingView, setLoadingViewType } = useApp();

  // Filter suggestions purely from the restaurant's menuItems (no mock data fallback for production)
  const displaySuggestions = (menuItems || [])
    .filter((m) => !cart.some((c) => c.item.id === m.id));

  const handleAddMealItem = (item: any) => {
    const newCartItem: CartItem = {
      cartItemId: `addon-${item.id}-${Date.now()}`,
      item: {
        id: item.id,
        name: item.name,
        price: Number(item.price),
        rating: item.rating || 4.5,
        ratingCount: item.ratingCount || "100+",
        image: item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop",
        isVeg: item.isVeg !== false,
        category: item.category || "Sides",
        available: true,
      },
      quantity: 1,
      totalPrice: Number(item.price),
    };
    setCart((prev) => [...prev, newCartItem]);
  };

  const [orderType, setOrderType] = useState<"Delivery" | "Takeaway">("Delivery");
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);
  const [note, setNote] = useState("");
  const [showNoteSheet, setShowNoteSheet] = useState(false);
  const [tempNote, setTempNote] = useState("");
  const [showCouponSheet, setShowCouponSheet] = useState(false);
  const [showCartPreview, setShowCartPreview] = useState(false);

  const totalItems = cart.reduce((sum, c) => sum + c.quantity, 0);
  const totalPrice = cart.reduce((sum, c) => sum + c.totalPrice, 0);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  } | null>(null);
  const [selectedCouponDetails, setSelectedCouponDetails] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"UPI" | "COD" | null>(null);
  const [showProcessing, setShowProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<"processing" | "success">("processing");
  const [tipAmount, setTipAmount] = useState<number>(0);
  const [showCustomTip, setShowCustomTip] = useState(false);
  const [customTipInput, setCustomTipInput] = useState("");
  const [customTipError, setCustomTipError] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");

  const availableOffers = [
    {
      id: "o1",
      code: "WELCOME50",
      title: "50% Off on First Order",
      desc: "Get 50% off up to ₹150 on your first food order.",
      discount: 150,
      terms: "Valid only for first-time purchases. Maximum discount ₹150.",
    },
    {
      id: "o2",
      code: "FREE49",
      title: "Flat ₹49 Off",
      desc: "Flat ₹49 off on orders above ₹200.",
      discount: 49,
      terms: "Minimum order value must be ₹200.",
    },
  ];

  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const deliveryFee = orderType === "Delivery" ? 35 : 0;
  const discountAmount = appliedCoupon ? Math.min(appliedCoupon.discount, subtotal) : 0;
  const platformFee = 5;
  const taxes = Math.round((subtotal - discountAmount) * 0.05); // 5% GST rounded
  const total = subtotal - discountAmount + deliveryFee + taxes + platformFee + tipAmount;

  const handleConfirmOrder = () => {
    if (selectedPaymentMethod) {
      setShowPaymentSheet(false);
      setShowProcessing(true);
      setTimeout(() => {
        setProcessingStep("success");
      }, 2000);
    }
  };

  const handleTrackOrder = () => {
    const itemsStr = cart.map((c) => `${c.quantity}x ${c.item.name}`).join(", ");
    const newOrder: Order = {
      id: `ORD${Math.floor(Math.random() * 100000)}`,
      restaurantName: selectedRestaurant?.name || "Restaurant",
      location: currentLocation.address,
      rating: selectedRestaurant?.rating || 4.5,
      items: itemsStr,
      orderDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      type: orderType === "Delivery" ? "Delivery" : "Takeaway",
      status: "Active",
      timeEstimate: orderType === "Delivery" ? "30 mins" : "15 mins",
      paymentMethod: selectedPaymentMethod || "UPI",
    };
    setActiveOrder(newOrder);
    setCart([]);
    setShowProcessing(false);
    navigate("/order-tracking");
  };

  const handleQuantityChange = (cartItemId: string, delta: number) => {
    setCart((prev) => {
      const updated = prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            const basePrice = item.item.price;
            const variantPrice = item.variant ? item.variant.price : 0;
            const addonsPrice = (item.selectedAddons || []).reduce((s, a) => s + a.price * a.quantity, 0);
            const sidesPrice = (item.selectedSides || []).reduce((s, a) => s + a.price * a.quantity, 0);
            const singlePrice = basePrice + variantPrice + addonsPrice + sidesPrice;
            return {
              ...item,
              quantity: newQty,
              totalPrice: singlePrice * newQty,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[];

      if (updated.length === 0) {
        setShowCartPreview(false);
      }
      return updated;
    });
  };

  if (showProcessing) {
    return (
      <div className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
        {processingStep === "processing" ? (
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
              <Loader2 size={40} className="text-blue-600 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Processing Payment
            </h2>
            <p className="text-slate-500">
              Please wait while we confirm your order...
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center w-full max-w-md animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={48} className="text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Order Confirmed!
            </h2>
            <p className="text-slate-500 mb-8">
              Your order has been placed successfully.
            </p>

            <div className="w-full space-y-3">
              <button
                onClick={handleTrackOrder}
                className="w-full h-[52px] bg-green-600 text-white rounded-xl font-bold text-[15px] active:scale-[0.98] transition-transform shadow-sm"
              >
                Track your order
              </button>
              <button
                onClick={() => {
                  setCart([]);
                  setShowProcessing(false);
                  navigate("/");
                }}
                className="w-full h-[52px] bg-slate-100 text-slate-700 rounded-xl font-bold text-[15px] active:scale-[0.98] transition-transform"
              >
                Back to Home
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-32 font-sans">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm border-b border-slate-100/50">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 bg-white rounded-full active:scale-95 transition-transform">
            <ChevronLeft className="w-6 h-6 text-slate-800" />
          </button>
          <h1 className="text-lg font-bold text-slate-900">Checkout</h1>
        </div>
        <button
          onClick={() => {
            setCart([]);
            navigate("/");
          }}
          className="p-2 bg-red-50 text-red-500 rounded-full active:scale-95 transition-transform"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-4 max-w-md mx-auto">
        {/* Order Type Toggle */}
        <div className="bg-slate-100 p-1 rounded-2xl flex relative h-[52px]">
          <div
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-xl shadow-sm transition-transform duration-300 ease-in-out ${
              orderType === "Takeaway" ? "translate-x-full" : "translate-x-0"
            }`}
          />
          <button
            onClick={() => setOrderType("Delivery")}
            className={`relative z-10 flex-1 text-[14px] font-bold flex items-center justify-center gap-2 transition-colors ${
              orderType === "Delivery" ? "text-green-600" : "text-slate-500"
            }`}
          >
            <Bike className="w-4 h-4" /> Delivery
          </button>
          <button
            onClick={() => setOrderType("Takeaway")}
            className={`relative z-10 flex-1 text-[14px] font-bold flex items-center justify-center gap-2 transition-colors ${
              orderType === "Takeaway" ? "text-green-600" : "text-slate-500"
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> Takeaway
          </button>
        </div>

        {/* Address / Pickup Location Card */}
        <div className="bg-white rounded-[20px] p-4 shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="flex items-start gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-green-600/10 flex items-center justify-center shrink-0">
              {orderType === "Delivery" ? (
                <MapPin className="w-5 h-5 text-green-600" />
              ) : (
                <Utensils className="w-5 h-5 text-green-600" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold text-slate-900">
                  {orderType === "Delivery" ? `Delivering to ${currentLocation?.type || "Home"}` : "Pickup from Restaurant"}
                </h3>
                {orderType === "Delivery" && (
                  <button
                    onClick={() => navigate("/location")}
                    className="text-[10px] font-bold text-green-600 uppercase tracking-wider active:scale-95 transition-transform bg-green-600/10 px-2 py-1 rounded"
                  >
                    Change
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed pr-4 line-clamp-2">
                {orderType === "Delivery"
                  ? currentLocation?.address
                  : `${selectedRestaurant?.name || "Restaurant"}, ${selectedRestaurant?.address || "Koramangala, Bangalore"}`}
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-slate-700 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100 w-fit">
                <Clock className="w-3 h-3 text-green-600" />
                {orderType === "Delivery" ? "30-35 mins" : "Ready in 15-20 mins"}
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-[24px] p-5 border border-slate-100 mb-6 shadow-sm">
          <h3 className="text-[17px] font-bold text-slate-900 mb-4 px-1">
            Your Order
          </h3>
          {cart.length > 0 ? (
            <div className="space-y-4">
              {cart.map((cartItem) => (
                <div key={cartItem.cartItemId} className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 relative bg-slate-50">
                      <img
                        src={cartItem.item.image}
                        alt={cartItem.item.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 right-1 bg-white/90 backdrop-blur-sm p-0.5 rounded">
                        <div className={`w-2 h-2 border flex items-center justify-center rounded-sm ${cartItem.item.isVeg ? "border-green-500" : "border-red-500"}`}>
                          <div className={`w-1 h-1 rounded-full ${cartItem.item.isVeg ? "bg-green-500" : "bg-red-500"}`} />
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 pt-0.5">
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">
                        {cartItem.item.name}
                      </h4>
                      {(cartItem.variant || (cartItem.selectedAddons && cartItem.selectedAddons.length > 0)) && (
                        <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">
                          {[
                            cartItem.variant?.name,
                            ...(cartItem.selectedAddons?.map(a => a.name) || [])
                          ].filter(Boolean).join(', ')}
                        </span>
                      )}
                      <div className="text-xs font-bold text-slate-900 mt-1">
                        ₹{cartItem.totalPrice / cartItem.quantity}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg h-8 px-1 min-w-[70px] shrink-0 mt-0.5">
                    <button
                      onClick={() => handleQuantityChange(cartItem.cartItemId, -1)}
                      className="w-6 h-full flex items-center justify-center text-green-600 active:scale-95"
                    >
                      <Minus size={12} className="stroke-[3]" />
                    </button>
                    <span className="text-xs font-bold text-slate-900">
                      {cartItem.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(cartItem.cartItemId, 1)}
                      className="w-6 h-full flex items-center justify-center text-green-600 active:scale-95"
                    >
                      <Plus size={12} className="stroke-[3]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 py-4 text-center">Your cart is empty.</p>
          )}

          <div className="mt-5 pt-4 border-t border-slate-100">
            <button
              onClick={() => navigate(-1)}
              className="w-full py-2.5 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <Plus className="w-3 h-3" /> Add more items
            </button>
          </div>

          {/* Cooking instructions inside Order Summary */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <button
              className="w-full flex items-center justify-between p-3 rounded-[16px] border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
              onClick={() => {
                setTempNote(note);
                setShowNoteSheet(true);
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <MessageSquare className="w-4 h-4 text-slate-500" />
                </div>
                <span className={`text-sm font-medium ${note ? "text-slate-900" : "text-slate-500"}`}>
                  {note || "Add cooking instructions"}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Complete your meal section (No mock data fallback) */}
        {displaySuggestions.length > 0 && (
          <div className="bg-white rounded-[24px] p-4 border border-slate-100 mb-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Complete your meal</h3>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
              {displaySuggestions
                .slice(0, 4)
                .map((item) => (
                  <div key={item.id} className="min-w-[80px] w-[80px] flex flex-col gap-1.5">
                    <div className="w-full aspect-square rounded-[16px] overflow-hidden relative bg-slate-50">
                      <img
                        src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => handleAddMealItem(item)}
                        className="absolute bottom-1 right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center text-green-600 shadow-sm active:scale-95 transition-transform"
                      >
                        <Plus size={14} className="stroke-[3]" />
                      </button>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-900 line-clamp-1 text-left">{item.name}</h4>
                      <div className="text-[10px] font-bold text-slate-500 text-left">₹{item.price}</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Delivery Preferences & Tip */}
        {orderType === "Delivery" && (
          <div className="bg-white rounded-[24px] p-5 border border-slate-100 space-y-6 mb-6 shadow-sm">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Bike className="w-4 h-4 text-slate-400" />
                Delivery Instructions
              </h3>
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-5 px-5">
                {[
                  { id: "Avoid calling", icon: PhoneOff, label: "Avoid calling" },
                  { id: "Avoid ringing bell", icon: BellOff, label: "Don't ring bell" },
                  { id: "Leave at door step", icon: DoorClosed, label: "Leave at door" },
                  { id: "Leave with security guard", icon: Shield, label: "Leave with guard" }
                ].map((instruction) => {
                  const Icon = instruction.icon;
                  const isSelected = deliveryNote === instruction.id;
                  return (
                    <button
                      key={instruction.id}
                      onClick={() => setDeliveryNote(isSelected ? "" : instruction.id)}
                      className={`min-w-[80px] flex flex-col items-center justify-center gap-2 p-3 rounded-[16px] border-2 transition-colors ${
                        isSelected ? "border-green-600 bg-green-600/5" : "border-slate-100 bg-white hover:border-slate-200"
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isSelected ? "text-green-600" : "text-slate-400"}`} />
                      <span className={`text-[10px] font-bold text-center leading-tight ${isSelected ? "text-slate-900" : "text-slate-500"}`}>
                        {instruction.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-1">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <h3 className="text-sm font-bold text-slate-900">Tip your delivery partner</h3>
              </div>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                Thank your delivery partner by leaving a tip. 100% of the amount will go to them directly.
              </p>

              <div className="flex gap-2 mb-3">
                {[15, 20, 30].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => {
                      setTipAmount((prev) => (prev === amount ? 0 : amount));
                      setShowCustomTip(false);
                    }}
                    className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-all active:scale-95 ${
                      tipAmount === amount && !showCustomTip
                        ? "bg-blue-50 border-blue-500 text-blue-700"
                        : "bg-white border-slate-200 text-slate-700"
                    }`}
                  >
                    ₹{amount}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setShowCustomTip(true);
                    setTipAmount(0);
                  }}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-all active:scale-95 ${
                    showCustomTip
                      ? "bg-blue-50 border-blue-500 text-blue-700"
                      : "bg-white border-slate-200 text-slate-700"
                  }`}
                >
                  Other
                </button>
              </div>

              {showCustomTip && (
                <div className="mb-3 animate-fadeInUp">
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-500">₹</span>
                      <input
                        type="number"
                        value={customTipInput}
                        onChange={(e) => {
                          setCustomTipInput(e.target.value);
                          setCustomTipError("");
                        }}
                        placeholder="Enter custom amount"
                        className="w-full p-3 pl-8 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        autoFocus
                      />
                    </div>
                    <button
                      onClick={() => {
                        const amount = parseInt(customTipInput);
                        if (isNaN(amount) || amount <= 0) {
                          setCustomTipError("Please enter a valid amount");
                        } else if (amount > 1000) {
                          setCustomTipError("Maximum tip is ₹1000");
                        } else {
                          setTipAmount(amount);
                          setCustomTipError("");
                        }
                      }}
                      className="bg-blue-600 text-white px-5 py-3 rounded-xl text-sm font-bold active:scale-95 transition-transform"
                    >
                      Apply
                    </button>
                  </div>
                  {customTipError && (
                    <p className="text-xs text-red-500 mt-2 ml-1 font-medium">{customTipError}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Offers & Coupons */}
        <button
          onClick={() => setShowCouponSheet(true)}
          className="w-full bg-white rounded-[20px] p-4 border border-slate-100 shadow-sm flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
              <Tag size={20} />
            </div>
            <div>
              <h4 className="text-[14px] font-bold text-slate-900">
                {appliedCoupon ? `Coupon Applied: ${appliedCoupon.code}` : "Apply Coupon"}
              </h4>
              <p
                className={`text-[12px] ${appliedCoupon ? "text-emerald-600 font-medium" : "text-slate-500"}`}
              >
                {appliedCoupon ? `Saved ₹${discountAmount}` : "View available offers"}
              </p>
            </div>
          </div>
          <ChevronRight size={20} className="text-slate-400" />
        </button>

        {/* Price Breakdown */}
        <div className="bg-white border border-slate-100 rounded-[24px] shadow-sm overflow-hidden mb-6">
          <div className="p-4 flex items-start justify-between border-b border-slate-100">
            <div className="flex items-start gap-3">
              <div className="text-left">
                <h3 className="text-[17px] font-bold text-slate-800 flex items-center gap-2">
                  To Pay{" "}
                  {discountAmount > 0 && (
                    <span className="text-slate-400 line-through font-medium">
                      ₹{total + discountAmount}
                    </span>
                  )}{" "}
                  ₹{total}
                </h3>
                {discountAmount > 0 && (
                  <p className="text-[14px] font-medium text-green-600 mt-0.5">
                    ₹{discountAmount} saved on the total!
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="p-5 space-y-4">
            <div className="flex justify-between items-center text-[15px]">
              <span className="text-slate-500">Item Total</span>
              <span className="text-slate-700 font-medium">₹{subtotal}</span>
            </div>

            {orderType === "Delivery" ? (
              <div className="flex justify-between items-start text-[15px]">
                <div className="flex flex-col text-left">
                  <span className="text-slate-500">
                    Delivery Fee | <span className="text-green-600">0.1 kms</span>
                  </span>
                  <span className="text-[13px] text-slate-400 mt-2 max-w-[220px] leading-snug">
                    This amount goes directly to our local rider to ensure safe and timely delivery.
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-green-600 font-medium">₹{deliveryFee}</span>
                </div>
              </div>
            ) : null}

            {discountAmount > 0 && (
              <div className="flex justify-between items-center text-[15px]">
                <span className="text-slate-500">Extra discount for you</span>
                <span className="text-green-600 font-medium">- ₹{discountAmount}</span>
              </div>
            )}

            <div className="border-b border-dashed border-slate-200 my-2" />

            <div className="flex justify-between items-center text-[15px]">
              <span className="text-slate-500">Delivery Tip</span>
              <span className="text-green-600 font-medium">₹{tipAmount}</span>
            </div>

            <div className="flex justify-between items-center text-[15px]">
              <span className="text-slate-500">GST & Other Charges</span>
              <span className="text-slate-700 font-medium">₹{taxes + platformFee}</span>
            </div>

            <div className="border-b border-dashed border-slate-200 my-2" />

            <div className="flex justify-between items-center pt-1 pb-1">
              <span className="font-bold text-slate-800 text-[17px]">To Pay</span>
              <span className="font-bold text-slate-800 text-[17px]">₹{total}</span>
            </div>
          </div>
        </div>

        {/* Cancellation Policy */}
        <div className="bg-slate-50 rounded-[16px] p-4 flex items-start gap-3">
          <Info size={16} className="text-slate-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-[13px] font-bold text-slate-900 mb-1">
              Cancellation Policy
            </h4>
            <p className="text-[12px] text-slate-500 leading-relaxed">
              Orders cannot be cancelled once packed. For any issues with the
              delivered items, please contact support within 24 hours.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Cart Bar */}
      {totalItems > 0 && (
        <div className="fixed bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md z-40 animate-[slideUp_0.3s_ease-out]">
          <div className="bg-white rounded-2xl p-3.5 flex items-center justify-between text-black shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100">
            <button 
              onClick={() => setShowCartPreview(true)}
              className="flex items-center gap-3 flex-1 min-w-0"
            >
              <div className="relative w-10 h-10 flex items-center justify-center bg-[#00bd6f]/10 rounded-full shrink-0">
                <ShoppingCart className="w-5 h-5 text-[#00bd6f]" />
                <span className="absolute -top-1 -right-1 bg-[#00bd6f] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-sm">{totalItems}</span>
              </div>
              <div className="text-left min-w-0">
                <div className="font-bold text-[15px] text-gray-900">{totalItems} item{totalItems > 1 ? 's' : ''}</div>
                <div className="text-[13px] font-medium text-[#00bd6f]">₹{totalPrice} · Tap to view</div>
              </div>
            </button>
            <button 
              onClick={() => setShowPaymentSheet(true)}
              className="flex items-center gap-1.5 font-bold text-[14px] bg-[#00bd6f] text-white px-4 py-2.5 rounded-xl active:scale-95 transition-transform shrink-0 ml-2"
            >
              Select Payment <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Cart Preview Bottom Sheet */}
      <CartPreviewSheet 
        showCartPreview={showCartPreview}
        setShowCartPreview={setShowCartPreview}
        cart={cart}
        setCart={setCart}
        totalItems={totalItems}
        totalPrice={totalPrice}
        handleQuantityChange={handleQuantityChange}
        onCheckoutClick={() => {
          setShowCartPreview(false);
          setShowPaymentSheet(true);
        }}
        checkoutButtonText="Select Payment"
        checkoutButtonPrice={total}
      />

      {/* Note Bottom Sheet */}
      {showNoteSheet && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 transition-opacity"
          onClick={() => setShowNoteSheet(false)}
        >
          <div
            className="w-full bg-white rounded-t-[24px] p-6 animate-in slide-in-from-bottom-full duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[18px] font-bold text-slate-900">Add Note</h3>
              <button
                onClick={() => setShowNoteSheet(false)}
                className="w-8 h-8 flex items-center justify-center text-slate-400 bg-slate-100 rounded-full"
              >
                <X size={18} />
              </button>
            </div>

            <textarea
              value={tempNote}
              onChange={(e) => setTempNote(e.target.value)}
              placeholder="Write your instructions here..."
              className="w-full h-[120px] bg-slate-50 border border-slate-200 rounded-xl p-4 text-[14px] text-slate-900 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 resize-none mb-6"
              autoFocus
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowNoteSheet(false)}
                className="flex-1 h-[52px] bg-slate-100 text-slate-700 rounded-xl font-bold text-[15px] active:scale-[0.98] transition-transform"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setNote(tempNote);
                  setShowNoteSheet(false);
                }}
                className="flex-1 h-[52px] bg-green-600 text-white rounded-xl font-bold text-[15px] active:scale-[0.98] transition-transform shadow-sm"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Coupon Bottom Sheet */}
      {showCouponSheet && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 transition-opacity"
          onClick={() => {
            setShowCouponSheet(false);
            setSelectedCouponDetails(null);
          }}
        >
          <div
            className="w-full bg-white rounded-t-[24px] p-6 animate-in slide-in-from-bottom-full duration-300 max-h-[85vh] overflow-y-auto no-scrollbar flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 sticky top-0 bg-white z-10 pb-2">
              <h3 className="text-[18px] font-bold text-slate-900">
                Available Offers
              </h3>
              <button
                onClick={() => {
                  setShowCouponSheet(false);
                  setSelectedCouponDetails(null);
                }}
                className="w-8 h-8 flex items-center justify-center text-slate-400 bg-slate-100 rounded-full"
              >
                <X size={18} />
              </button>
            </div>

            <div className="relative mb-5">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search offers..."
                className="w-full h-[44px] bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 text-[14px] focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
              />
            </div>

            <div className="space-y-4 flex-1">
              {availableOffers.map((offer) => {
                const isApplied = appliedCoupon?.code === offer.code;
                return (
                  <div
                    key={offer.id}
                    className={`border-2 border-dashed rounded-2xl p-4 relative overflow-hidden transition-all duration-300 ${
                      isApplied
                        ? "border-green-500 bg-green-50"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className={`inline-block px-2.5 py-1 text-[11px] font-black uppercase tracking-wider rounded border mb-2 ${
                          isApplied
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}>
                          {offer.code}
                        </span>
                        <h4 className="text-[15px] font-bold text-slate-900">
                          {offer.title}
                        </h4>
                      </div>
                      {isApplied ? (
                        <button
                          onClick={() => setAppliedCoupon(null)}
                          className="text-[13px] font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg active:scale-95 transition-transform"
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setAppliedCoupon({
                              code: offer.code,
                              discount: offer.discount,
                            });
                            setShowCouponSheet(false);
                          }}
                          className="text-[13px] font-bold text-green-600 bg-green-100 px-3 py-1.5 rounded-lg active:scale-95 transition-transform"
                        >
                          Apply
                        </button>
                      )}
                    </div>
                    <p className="text-[13px] text-slate-600 mb-3 leading-relaxed">
                      {offer.desc}
                    </p>

                    <div className={`border-t pt-3 mt-3 ${isApplied ? "border-green-200" : "border-slate-100"}`}>
                      <button
                        onClick={() =>
                          setSelectedCouponDetails(
                            selectedCouponDetails === offer.id ? null : offer.id
                          )
                        }
                        className="text-[12px] font-semibold text-green-600 flex items-center gap-1 active:scale-95 transition-transform"
                      >
                        View Details{" "}
                        <ChevronRight
                          size={14}
                          className={`transition-transform ${selectedCouponDetails === offer.id ? "rotate-90" : ""}`}
                        />
                      </button>

                      <AnimatePresence initial={false}>
                        {selectedCouponDetails === offer.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className={`mt-3 p-3 bg-white rounded-xl text-[12px] text-slate-600 leading-relaxed border ${
                              isApplied ? "border-green-200" : "border-slate-100"
                            }`}>
                              <span className="font-semibold block mb-1 text-slate-900">
                                Terms & Conditions:
                              </span>
                              {offer.terms}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Payment Method Bottom Sheet */}
      {showPaymentSheet && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 transition-opacity"
          onClick={() => setShowPaymentSheet(false)}
        >
          <div
            className="w-full bg-white rounded-t-[24px] p-6 animate-in slide-in-from-bottom-full duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[18px] font-bold text-slate-900">
                Select Payment Method
              </h3>
              <button
                onClick={() => setShowPaymentSheet(false)}
                className="w-8 h-8 flex items-center justify-center text-slate-400 bg-slate-100 rounded-full"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setSelectedPaymentMethod("UPI")}
                className={`w-full p-4 rounded-[16px] border flex items-center gap-4 transition-all ${
                  selectedPaymentMethod === "UPI"
                    ? "border-green-500 bg-green-50"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    selectedPaymentMethod === "UPI"
                      ? "bg-green-50 border border-green-100/50"
                      : "bg-slate-50 border border-slate-100"
                  }`}
                >
                  <UpiLogo size={24} useBrandColors={true} />
                </div>
                <div className="text-left flex-1">
                  <h4 className="text-[15px] font-bold text-slate-900">
                    Pay via UPI
                  </h4>
                  <p className="text-[13px] text-slate-500">
                    Google Pay, PhonePe, Paytm
                  </p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    selectedPaymentMethod === "UPI"
                      ? "border-green-600 bg-green-600 text-white"
                      : "border-slate-300"
                  }`}
                >
                  {selectedPaymentMethod === "UPI" && <Check size={12} />}
                </div>
              </button>

              <button
                onClick={() => setSelectedPaymentMethod("COD")}
                className={`w-full p-4 rounded-[16px] border flex items-center gap-4 transition-all ${
                  selectedPaymentMethod === "COD"
                    ? "border-green-500 bg-green-50"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    selectedPaymentMethod === "COD"
                      ? "bg-green-100 text-green-700"
                      : "bg-emerald-50 text-emerald-600"
                  }`}
                >
                  <Banknote size={24} />
                </div>
                <div className="text-left flex-1">
                  <h4 className="text-[15px] font-bold text-slate-900">
                    Cash on Delivery
                  </h4>
                  <p className="text-[13px] text-slate-500">
                    Pay when you receive
                  </p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    selectedPaymentMethod === "COD"
                      ? "border-green-600 bg-green-600 text-white"
                      : "border-slate-300"
                  }`}
                >
                  {selectedPaymentMethod === "COD" && <Check size={12} />}
                </div>
              </button>
            </div>

            <button
              onClick={handleConfirmOrder}
              disabled={!selectedPaymentMethod}
              className={`w-full mt-6 h-[52px] rounded-xl font-bold text-[15px] transition-all flex items-center justify-center gap-2 ${
                selectedPaymentMethod
                  ? "bg-green-600 text-white active:scale-[0.98] shadow-sm shadow-green-600/20"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              Confirm & Pay ₹
              {total.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </button>

            <button
              onClick={() => setShowPaymentSheet(false)}
              className="w-full mt-3 h-[52px] bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-[15px] active:scale-[0.98] transition-transform"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
