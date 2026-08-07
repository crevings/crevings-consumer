import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import {
  MapPin,
  Plus,
  Minus,
  Info,
  ChevronRight,
  ChevronLeft,
  X,
  Loader2,
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
  Banknote,
  Check,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { UpiLogo } from "@/shared/components/UpiLogo";
import { useLocation as useAppLocation } from "@/contexts/LocationContext";
import { useRestaurant } from "@/contexts/RestaurantContext";
import { CartItem, OrderItem, OrderCustomer, OrderType, MenuItem, Order } from "@/types";
import { FEES } from "@/config/constants";
import { CartPreviewSheet } from "@/features/cart/components/CartPreviewSheet";
import { PriceBreakdown } from "@/features/cart/components/PriceBreakdown";
import { CouponRow } from "@/features/cart/components/CouponRow";
import { CouponSheet } from "@/features/cart/components/CouponSheet";
import { useCoupon } from "@/features/cart/hooks/useCoupon";
import { ConfirmationBottomSheet } from "@/shared/components/ConfirmationBottomSheet";
import { useRestaurantOffers } from "@/api/restaurant/index";
import { get, post } from "@/api/fetcher";
import { addOrUpdateCartItem, withQuantity } from "@/utils/cartUtils";
import { calculateFeeFromSlabs } from "@/utils/deliveryUtils";
import { formatAmount } from "@/utils/currency";

interface PlaceOrderResponse {
  success: boolean;
  message?: string;
  data: {
    items: OrderItem[];
    orderId: string;
    displayOrderId?: string;
    branchId?: string;
    type?: string;
    total?: number;
    createdAt?: string;
    pickupOtp?: string;
    customerDetails?: OrderCustomer;
    payment?: { method?: string };
  };
}

export const CheckoutView: React.FC = () => {
  const navigate = useNavigate();
  const { cart, setCart, menuItems } = useCart();
  const { currentLocation, isServiceable } = useAppLocation();
  const { setActiveOrder, selectedRestaurant } = useRestaurant();

  // Filter suggestions purely from the restaurant's menuItems (no mock data fallback for production)
  const displaySuggestions = (menuItems || [])
    .filter((m) => !cart.some((c) => c.item.id === m.id));

  const handleAddMealItem = (item: MenuItem) => {
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
    setCart((prev) => addOrUpdateCartItem(prev, newCartItem));
  };

  const { offers } = useRestaurantOffers(selectedRestaurant?.id, 20);
  const { subtotal, totalItems, totalPrice } = useMemo(() => {
    let sub = 0;
    let items = 0;
    for (const item of cart) {
      sub += item.totalPrice;
      items += item.quantity;
    }
    return { subtotal: sub, totalItems: items, totalPrice: sub };
  }, [cart]);

  const [orderType, setOrderType] = useState<"Delivery" | "Takeaway">("Delivery");
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [note, setNote] = useState("");
  const [showNoteSheet, setShowNoteSheet] = useState(false);
  const [showTaxesSheet, setShowTaxesSheet] = useState(false);
  const [tempNote, setTempNote] = useState("");
  const [showCartPreview, setShowCartPreview] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"UPI" | "COD" | null>(null);
  const [showProcessing, setShowProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<"processing" | "buffer" | "success" | "cancelling" | "cancelled">("processing");
  const [timeLeft, setTimeLeft] = useState(30);
  const [tipAmount, setTipAmount] = useState<number>(0);
  const [showCustomTip, setShowCustomTip] = useState(false);
  const [customTipInput, setCustomTipInput] = useState("");
  const [customTipError, setCustomTipError] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");

  const [_isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [_orderError, setOrderError] = useState("");

  const {
    showCouponSheet,
    setShowCouponSheet,
    appliedCoupon,
    selectedCouponDetails,
    setSelectedCouponDetails,
    couponError,
    isValidatingCoupon,
    applyCoupon,
    clearCoupon,
  } = useCoupon({
    restaurantId: selectedRestaurant?.id,
    cart,
    subtotal,
    orderType,
    offers,
  });

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (showProcessing && processingStep === "buffer" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setProcessingStep("success");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [showProcessing, processingStep, timeLeft]);



  const distanceKm = (() => {
    if (!selectedRestaurant) return 0;
    if (typeof selectedRestaurant.distanceValue === "number") {
      return selectedRestaurant.distanceValue;
    }
    if (typeof selectedRestaurant.distance === "string") {
      const parsed = parseFloat(selectedRestaurant.distance);
      if (!isNaN(parsed)) return parsed;
    }
    return 0;
  })();

  const deliveryFee = (cart.length === 0 || orderType !== "Delivery")
    ? 0
    : (typeof selectedRestaurant?.deliveryFee === "number" && selectedRestaurant.deliveryFee > 0)
      ? selectedRestaurant.deliveryFee
      : calculateFeeFromSlabs(distanceKm, selectedRestaurant?.deliveryFeeSlabs);

  const discountAmount = appliedCoupon ? Math.min(appliedCoupon.discount, subtotal) : 0;
  const platformFee = cart.length === 0 ? 0 : FEES.platformFee;

  // Calculate taxable subtotal: ONLY items where gstCategory !== 'MRP Based Item' AND gstIncluded === false
  const taxableSubtotal = cart.reduce((sum, cartItem) => {
    const isMrp = cartItem.item?.gstCategory === "MRP Based Item";
    const isGstIncluded = cartItem.item?.gstIncluded !== false; // Default is true in restaurant partner app

    // If MRP Based Item or GST Included, no additional GST is charged to consumer
    if (isMrp || isGstIncluded) {
      return sum;
    }
    return sum + cartItem.totalPrice;
  }, 0);

  const discountRatio = subtotal > 0 ? (subtotal - discountAmount) / subtotal : 1;
  const netTaxableAmount = taxableSubtotal * discountRatio;
  const rawTaxes = cart.length === 0 ? 0 : netTaxableAmount * FEES.taxRate;
  const taxes = Number(rawTaxes.toFixed(2)); // Exact float up to 2 decimal places (no Integer rounding errors)
  const rawTotal = cart.length === 0 ? 0 : Math.max(0, subtotal - discountAmount + deliveryFee + taxes + platformFee + tipAmount);
  const total = Number(rawTotal.toFixed(2));

  /** Extracts the restaurant's GeoJSON coordinates ([lng, lat]) from its address. */
  const getRestaurantCoordinates = (): { lat: number; lng: number } | null => {
    const address = selectedRestaurant?.address;
    if (typeof address !== "object" || !address?.coordinates) return null;
    const coords = Array.isArray(address.coordinates) ? address.coordinates : address.coordinates.coordinates;
    if (!Array.isArray(coords) || coords.length < 2) return null;
    return { lat: coords[1], lng: coords[0] };
  };

  const handleConfirmOrder = async () => {
    if (!selectedPaymentMethod || !selectedRestaurant) return;

    setOrderError("");
    setIsPlacingOrder(true);
    setShowPaymentSheet(false);
    setShowProcessing(true);
    setProcessingStep("processing");

    try {
      const result = await post<PlaceOrderResponse>(
        `/consumer/restaurants/${selectedRestaurant.id}/orders`,
        {
          items: cart.map(c => {
            const allAddons = [
              ...(c.selectedAddons || []),
              ...(c.selectedSides || [])
            ].map(a => ({
              id: a.id,
              name: a.name,
              price: a.price,
              quantity: a.quantity || 1
            }));

            return {
              id: c.item.id,
              name: c.item.name,
              quantity: c.quantity,
              price: c.item.price,
              category: c.item.category,
              addons: allAddons
            };
          }),
          orderType: orderType,
          paymentMethod: selectedPaymentMethod,
          deliveryAddress: orderType === "Delivery" ? (currentLocation?.address || "") : "Takeaway",
          appliedOffer: appliedCoupon ? appliedCoupon.code : undefined,
          tipAmount: tipAmount,
          notes: deliveryNote
        }
      );
      if (!result.success) {
        setOrderError(result.message || "Failed to place order");
        setShowProcessing(false);
        alert(result.message || "Failed to place order. Please try again.");
      } else {
        // Fetch the fully populated active order from the server to get restaurant/delivery coordinates
        let orderPayload: Order | null = null;
        try {
          const activeData = await get<{ success: boolean; order?: Order }>(
            "/consumer/profile/orders/active"
          );
          if (activeData.success && activeData.order) {
            orderPayload = activeData.order;
          }
        } catch (fetchErr) {
          console.error("Error pre-fetching active order details:", fetchErr);
        }

        if (!orderPayload) {
          // Fallback to client constructed order if fetch fails
          const restaurantCoordinates = getRestaurantCoordinates();
          const deliveryCoordinates = currentLocation?.coordinates
            ? { lat: currentLocation.coordinates.lat, lng: currentLocation.coordinates.lng }
            : null;
          orderPayload = {
            id: result.data.displayOrderId || result.data.orderId,
            realOrderId: result.data.orderId,
            restaurantId: selectedRestaurant?.id || result.data.branchId,
            restaurantName: selectedRestaurant?.name || "Restaurant",
            location: result.data.customerDetails?.address || "",
            rating: selectedRestaurant?.rating ?? 0,
            items: result.data.items.map((item) => ({
              name: item.name,
              quantity: item.quantity || 1,
              price: item.price,
            })),
            orderDate: result.data.createdAt
              ? new Date(result.data.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "",
            type: (result.data.type as OrderType) || "Delivery",
            status: "NEW",
            paymentMethod: result.data.payment?.method || "",
            total: result.data.total,
            createdAt: result.data.createdAt,
            pickupOtp: result.data.pickupOtp,
            restaurantCoordinates,
            deliveryCoordinates
          };
        }

        setActiveOrder(orderPayload);
        setCart([]);
        setShowProcessing(false);
        if (orderPayload.type === "Delivery") {
          navigate("/");
        } else {
          navigate("/order-tracking");
        }
      }
    } catch {
      setOrderError("An error occurred while connecting to the server.");
      setShowProcessing(false);
      alert("Failed to place order due to network issue. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };


  const handleQuantityChange = (cartItemId: string, delta: number) => {
    setCart((prev) => {
      const updated = prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return withQuantity(item, newQty);
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
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
            <Loader2 size={40} className="text-blue-600 animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Confirming Order
          </h2>
          <p className="text-slate-500">
            Please wait while we confirm your order...
          </p>
        </div>
      </div>
    );
  }

  if (cart.length === 0 && !showProcessing) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
          <ShoppingBag size={36} />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
        <p className="text-slate-500 text-sm mb-6 max-w-xs">
          Good food is always being cooked! Add items from a restaurant to start your order.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-[#00bd6f] text-white rounded-xl text-sm font-bold shadow-md active:scale-95 transition-transform"
        >
          Browse Restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-32 font-sans">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm border-b border-slate-100/50">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              if (cart.length === 0) {
                navigate("/");
              } else if (selectedRestaurant) {
                navigate(`/restaurant/${selectedRestaurant.id}`);
              } else {
                navigate("/");
              }
            }} 
            className="p-2 -ml-2 bg-white rounded-full active:scale-95 transition-transform"
          >
            <ChevronLeft className="w-6 h-6 text-slate-800" />
          </button>
          <h1 className="text-lg font-bold text-slate-900">Checkout</h1>
        </div>
        <button
          onClick={() => setShowClearConfirm(true)}
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
                    onClick={() => navigate("/location", { state: { from: "/checkout" } })}
                    className="text-[10px] font-bold text-green-600 uppercase tracking-wider active:scale-95 transition-transform bg-green-600/10 px-2 py-1 rounded"
                  >
                    Change
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed pr-4 line-clamp-2">
                {orderType === "Delivery"
                  ? (currentLocation?.address || "No delivery address added. Click 'Change' to add.")
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
loading="lazy"                         src={cartItem.item.image}
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
              onClick={() => navigate("/")}
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
loading="lazy"                         src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop"}
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

        <CouponRow
          appliedCoupon={appliedCoupon}
          discountAmount={discountAmount}
          onClick={() => setShowCouponSheet(true)}
        />

        <PriceBreakdown
          subtotal={subtotal}
          deliveryFee={deliveryFee}
          distanceKm={distanceKm}
          discountAmount={discountAmount}
          tipAmount={tipAmount}
          taxes={taxes}
          platformFee={platformFee}
          total={total}
          orderType={orderType}
          onShowTaxesSheet={() => setShowTaxesSheet(true)}
        />

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
        <div className="fixed bottom-0 left-0 right-0 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md z-40 bg-white border-t border-slate-100 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          {orderType === "Delivery" && (!currentLocation || !currentLocation.address) ? (
            <button 
              onClick={() => navigate("/location", { state: { from: "/checkout" } })}
              className="w-full flex items-center justify-center gap-1.5 font-bold text-[16px] bg-amber-600 text-white py-4 rounded-2xl active:scale-95 transition-transform"
            >
              Add Address to Proceed <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button 
              onClick={() => setShowPaymentSheet(true)}
              className="w-full flex items-center justify-center gap-1.5 font-bold text-[16px] bg-[#00bd6f] text-white py-4 rounded-2xl active:scale-95 transition-transform"
            >
              Select Payment <ChevronRight className="w-5 h-5" />
            </button>
          )}
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
          if (orderType === "Delivery" && (!currentLocation || !currentLocation.address)) {
            navigate("/location", { state: { from: "/checkout" } });
          } else if (orderType === "Delivery" && !isServiceable) {
            alert("Crevings delivery is not available in your selected location yet!");
          } else {
            setShowPaymentSheet(true);
          }
        }}
        checkoutButtonText={
          orderType === "Delivery" && (!currentLocation || !currentLocation.address)
            ? "Add Address to Proceed"
            : orderType === "Delivery" && !isServiceable
            ? "Location Not Serviceable"
            : "Select Payment"
        }
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
      <CouponSheet
        open={showCouponSheet}
        onClose={() => {
          setShowCouponSheet(false);
          setSelectedCouponDetails(null);
        }}
        offers={offers}
        orderType={orderType}
        appliedCoupon={appliedCoupon}
        onApply={(code) => applyCoupon(code)}
        onRemove={clearCoupon}
        couponError={couponError}
        isValidating={isValidatingCoupon}
        selectedDetails={selectedCouponDetails}
        onToggleDetails={(offerId) => setSelectedCouponDetails(offerId)}
      />

      {/* Taxes & Charges Bottom Sheet */}
      {showTaxesSheet && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 transition-opacity"
          onClick={() => setShowTaxesSheet(false)}
        >
          <div
            className="w-full bg-white rounded-t-[24px] p-6 animate-in slide-in-from-bottom-full duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[18px] font-bold text-slate-900">
                GST & Other Charges
              </h3>
              <button
                onClick={() => setShowTaxesSheet(false)}
                className="w-8 h-8 flex items-center justify-center text-slate-400 bg-slate-100 rounded-full"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-start text-[14px]">
                <div className="flex flex-col">
                  <span className="text-slate-700 font-medium">Restaurant GST</span>
                  <span className="text-[12px] text-slate-500 mt-1 max-w-[240px] leading-snug">
                    This is collected by the restaurant to pay to the government.
                  </span>
                </div>
                <span className="text-slate-900 font-medium">₹{formatAmount(taxes)}</span>
              </div>
              
              <div className="border-b border-slate-100" />

              <div className="flex justify-between items-start text-[14px]">
                <div className="flex flex-col">
                  <span className="text-slate-700 font-medium">Platform Fee</span>
                  <span className="text-[12px] text-slate-500 mt-1 max-w-[240px] leading-snug">
                    This helps us operate and improve the app experience for you.
                  </span>
                </div>
                <span className="text-slate-900 font-medium">₹{formatAmount(platformFee)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-[16px] font-bold text-slate-900 pt-4 border-t border-slate-200 border-dashed">
              <span>Total</span>
              <span>₹{formatAmount(taxes + platformFee)}</span>
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
      <AnimatePresence>
        {showClearConfirm && (
          <ConfirmationBottomSheet
            type="clear_cart"
            onConfirm={() => {
              setCart([]);
              setShowClearConfirm(false);
              navigate("/");
            }}
            onClose={() => setShowClearConfirm(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
