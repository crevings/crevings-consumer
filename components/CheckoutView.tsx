import React, { useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Edit2,
  Plus,
  Minus,
  Tag,
  FileText,
  Info,
  ChevronRight,
  CreditCard,
  Banknote,
  Smartphone,
  Check,
  X,
  Loader2,
  CheckCircle2,
  Search,
} from "lucide-react";

interface PartnerStoreCheckoutViewProps {
  onBack: () => void;
  onTrackOrder: (details: {
    type: "Delivery" | "Takeaway";
    paymentMethod: "UPI" | "COD";
  }) => void;
}

export const CheckoutView: React.FC<PartnerStoreCheckoutViewProps> = ({
  onBack,
  onTrackOrder,
}) => {
  const [orderType, setOrderType] = useState<"Delivery" | "Takeaway">(
    "Delivery",
  );
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);
  const [note, setNote] = useState("");
  const [showNoteSheet, setShowNoteSheet] = useState(false);
  const [tempNote, setTempNote] = useState("");
  const [addonCategory, setAddonCategory] = useState("All");
  const [showCouponSheet, setShowCouponSheet] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  } | null>(null);
  const [selectedCouponDetails, setSelectedCouponDetails] = useState<
    string | null
  >(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "UPI" | "COD" | null
  >(null);
  const [showProcessing, setShowProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<
    "processing" | "success"
  >("processing");

  const [cartItems, setCartItems] = useState([
    {
      id: "1",
      name: 'Premium Pizza Boxes (10")',
      price: 1200,
      quantity: 2,
      image:
        "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=100&auto=format&fit=crop",
    },
  ]);

  const addons = [
    {
      id: "a1",
      name: "Pizza Tripods (100 pcs)",
      price: 150,
      category: "Packaging",
      image:
        "https://images.unsplash.com/photo-1585238342024-78d387f4a707?q=80&w=100&auto=format&fit=crop",
    },
    {
      id: "a2",
      name: "Chilli Flakes Packets",
      price: 250,
      category: "Ingredients",
      image:
        "https://images.unsplash.com/photo-1596683720379-b70018f62115?q=80&w=100&auto=format&fit=crop",
    },
  ];

  const filteredAddons =
    addonCategory === "All"
      ? addons
      : addons.filter((a) => a.category === addonCategory);

  const handleAddAddon = (addon: any) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === addon.id);
      if (existing) {
        return prev.map((item) =>
          item.id === addon.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [
        ...prev,
        {
          id: addon.id,
          name: addon.name,
          price: addon.price,
          quantity: 1,
          image: addon.image,
        },
      ];
    });
  };

  const deliveryInstructions = [
    { id: "d1", label: "Drop at door" },
    { id: "d2", label: "Avoid calling" },
    { id: "d3", label: "Leave with guard" },
    { id: "d4", label: "Do not ring bell" },
  ];

  const [selectedInstructions, setSelectedInstructions] = useState<string[]>(
    [],
  );

  const toggleInstruction = (id: string) => {
    setSelectedInstructions((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const availableOffers = [
    {
      id: "o1",
      code: "WELCOME20",
      title: "20% Off on First Order",
      desc: "Get 20% off up to ₹500 on your first supply order.",
      discount: 240,
      terms:
        "Valid only for first-time purchases. Maximum discount ₹500. Cannot be combined with other offers.",
    },
    {
      id: "o2",
      code: "BULK500",
      title: "Flat ₹500 Off",
      desc: "Flat ₹500 off on orders above ₹2000.",
      discount: 500,
      terms: "Minimum order value must be ₹2000. Valid once per user.",
    },
  ];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const deliveryFee = orderType === "Delivery" ? 150 : 0;
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const taxes = (subtotal - discountAmount) * 0.18;
  const total = subtotal - discountAmount + deliveryFee + taxes;

  if (showProcessing) {
    return (
      <div className="fixed inset-0 z-[200] bg-[#FFFFFF] flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
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
              Your order #ORD-8839 has been placed successfully.
            </p>

            <div className="w-full space-y-3">
              <button
                onClick={() => {
                  setShowProcessing(false);
                  onTrackOrder({
                    type: orderType,
                    paymentMethod: selectedPaymentMethod!,
                  });
                }}
                className="w-full h-[52px] bg-blue-600 text-white rounded-xl font-bold text-[15px] active:scale-[0.98] transition-transform shadow-sm"
              >
                Track your order
              </button>
              <button
                onClick={() => {
                  setShowProcessing(false);
                  onBack();
                }}
                className="w-full h-[52px] bg-slate-100 text-slate-700 rounded-xl font-bold text-[15px] active:scale-[0.98] transition-transform"
              >
                Back to Store
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] pb-32 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-slate-100 h-[56px] flex items-center px-4 lg:h-[64px] lg:px-8">
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center -ml-2 text-slate-700 active:bg-slate-100 rounded-full transition-colors lg:hover:bg-slate-100"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-[18px] font-semibold text-slate-900 ml-2">
          Checkout
        </h1>
      </header>

      <div className="p-4 space-y-4 lg:max-w-3xl lg:mx-auto lg:p-8 lg:space-y-6">
        {/* Order Type Toggle */}
        <div className="bg-slate-100 p-1 rounded-2xl flex relative h-[52px]">
          <div
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#FFFFFF] rounded-xl shadow-sm transition-transform duration-300 ease-in-out ${
              orderType === "Takeaway" ? "translate-x-full" : "translate-x-0"
            }`}
          />
          <button
            onClick={() => setOrderType("Delivery")}
            className={`relative z-10 flex-1 text-[14px] font-bold transition-colors ${
              orderType === "Delivery" ? "text-blue-600" : "text-slate-500"
            }`}
          >
            Delivery
          </button>
          <button
            onClick={() => setOrderType("Takeaway")}
            className={`relative z-10 flex-1 text-[14px] font-bold transition-colors ${
              orderType === "Takeaway" ? "text-blue-600" : "text-slate-500"
            }`}
          >
            Takeaway
          </button>
        </div>

        {/* Address / Pickup Location Card */}
        <div className="bg-[#FFFFFF] rounded-[20px] p-5 border border-slate-100 shadow-sm">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-blue-600" />
              <h3 className="text-[15px] font-bold text-slate-900">
                {orderType === "Delivery"
                  ? "Delivery Address"
                  : "Pickup Location"}
              </h3>
            </div>
            {orderType === "Delivery" && (
              <button className="text-blue-600 text-[13px] font-semibold flex items-center gap-1">
                <Edit2 size={12} /> Edit
              </button>
            )}
          </div>
          <div className="pl-6">
            {orderType === "Delivery" ? (
              <>
                <p className="text-[14px] font-semibold text-slate-900">
                  Gourmet Kitchen
                </p>
                <p className="text-[13px] text-slate-500 mt-0.5 leading-relaxed">
                  123, Business Park, Phase 1, Electronic City, Bangalore -
                  560100
                </p>
              </>
            ) : (
              <>
                <p className="text-[14px] font-semibold text-slate-900">
                  Partner Supply Hub
                </p>
                <p className="text-[13px] text-slate-500 mt-0.5 leading-relaxed">
                  Warehouse 4A, Industrial Area, Bangalore
                </p>
                <p className="text-[12px] font-medium text-emerald-600 mt-2">
                  Available for pickup today by 5:00 PM
                </p>
              </>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-[#FFFFFF] rounded-[20px] p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-bold text-slate-900">
              Order Summary
            </h3>
          </div>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-[14px] font-semibold text-slate-900 leading-tight mb-1">
                    {item.name}
                  </h4>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[14px] font-bold text-slate-900">
                      ₹{item.price.toLocaleString()}
                    </span>
                    <div className="flex items-center bg-slate-100 rounded-lg h-8 p-1">
                      <button
                        onClick={() =>
                          setCartItems((prev) =>
                            prev.map((i) =>
                              i.id === item.id
                                ? {
                                    ...i,
                                    quantity: Math.max(1, i.quantity - 1),
                                  }
                                : i,
                            ),
                          )
                        }
                        className="w-6 h-full flex items-center justify-center text-slate-600"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center font-bold text-slate-900 text-[13px]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          setCartItems((prev) =>
                            prev.map((i) =>
                              i.id === item.id
                                ? { ...i, quantity: i.quantity + 1 }
                                : i,
                            ),
                          )
                        }
                        className="w-6 h-full flex items-center justify-center text-slate-600"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <button
              onClick={onBack}
              className="w-full py-2.5 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <Plus className="w-3 h-3" /> Add more items
            </button>
          </div>

          {/* Add Note */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                setTempNote(note);
                setShowNoteSheet(true);
              }}
              className="w-full flex items-center justify-between bg-slate-50 rounded-xl p-3 text-left"
            >
              <div className="flex items-center gap-3">
                <FileText size={18} className="text-slate-400" />
                <span
                  className={`text-[13px] ${note ? "text-slate-900 font-medium" : "text-slate-500"}`}
                >
                  {note || "Add a note to your order (optional)"}
                </span>
              </div>
              <ChevronRight size={18} className="text-slate-400" />
            </button>
          </div>
        </div>

        {/* Add-ons */}
        <div>
          <h3 className="text-[15px] font-bold text-slate-900 mb-3 px-1">
            Frequently Bought Together
          </h3>
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0 mb-3">
            {["All", "Packaging", "Ingredients"].map((cat) => (
              <button
                key={cat}
                onClick={() => setAddonCategory(cat)}
                className={`h-[36px] px-5 rounded-full text-[13px] font-medium whitespace-nowrap transition-all border ${
                  addonCategory === cat
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-[#FFFFFF] text-slate-600 border-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0 pb-2">
            {filteredAddons.map((addon) => (
              <div
                key={addon.id}
                className="w-[200px] bg-[#FFFFFF] rounded-[16px] border border-slate-100 shadow-sm p-3 shrink-0 flex gap-3"
              >
                <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                  <img
                    src={addon.image}
                    alt={addon.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-between flex-1">
                  <h4 className="text-[12px] font-semibold text-slate-900 leading-tight line-clamp-2">
                    {addon.name}
                  </h4>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[13px] font-bold text-slate-900">
                      ₹{addon.price}
                    </span>
                    <button
                      onClick={() => handleAddAddon(addon)}
                      className="w-6 h-6 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center active:scale-95 transition-transform"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Instructions */}
        {orderType === "Delivery" && (
          <div>
            <h3 className="text-[15px] font-bold text-slate-900 mb-3 px-1">
              Delivery Instructions
            </h3>
            <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0 pb-2">
              {deliveryInstructions.map((instruction) => (
                <button
                  key={instruction.id}
                  onClick={() => toggleInstruction(instruction.id)}
                  className={`p-3 rounded-xl text-left transition-all border shrink-0 w-[130px] ${
                    selectedInstructions.includes(instruction.id)
                      ? "bg-blue-50 border-blue-200"
                      : "bg-[#FFFFFF] border-slate-200"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full mb-2 flex items-center justify-center border ${
                      selectedInstructions.includes(instruction.id)
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "border-slate-300"
                    }`}
                  >
                    {selectedInstructions.includes(instruction.id) && (
                      <Check size={12} />
                    )}
                  </div>
                  <span
                    className={`text-[13px] font-medium ${
                      selectedInstructions.includes(instruction.id)
                        ? "text-blue-900"
                        : "text-slate-700"
                    }`}
                  >
                    {instruction.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Offers */}
        <button
          onClick={() => setShowCouponSheet(true)}
          className="w-full bg-[#FFFFFF] rounded-[20px] p-4 border border-slate-100 shadow-sm flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Tag size={20} />
            </div>
            <div>
              <h4 className="text-[14px] font-bold text-slate-900">
                {appliedCoupon
                  ? `Coupon Applied: ${appliedCoupon.code}`
                  : "Apply Coupon"}
              </h4>
              <p
                className={`text-[12px] ${appliedCoupon ? "text-emerald-600 font-medium" : "text-slate-500"}`}
              >
                {appliedCoupon
                  ? `Saved ₹${appliedCoupon.discount}`
                  : "View available offers"}
              </p>
            </div>
          </div>
          <ChevronRight size={20} className="text-slate-400" />
        </button>

        {/* Billing Details */}
        <div className="bg-[#FFFFFF] rounded-[20px] p-5 border border-slate-100 shadow-sm">
          <h3 className="text-[15px] font-bold text-slate-900 mb-4">
            Billing Details
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-[13px]">
              <span className="text-slate-600">Item Total</span>
              <span className="font-medium text-slate-900">
                ₹{subtotal.toLocaleString()}
              </span>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between text-[13px]">
                <span className="text-emerald-600">Item Discount</span>
                <span className="font-medium text-emerald-600">
                  -₹{appliedCoupon.discount.toLocaleString()}
                </span>
              </div>
            )}
            {orderType === "Delivery" && (
              <div className="flex justify-between text-[13px]">
                <span className="text-slate-600">Delivery Fee</span>
                <span className="font-medium text-slate-900">
                  ₹{deliveryFee}
                </span>
              </div>
            )}
            <div className="flex justify-between text-[13px]">
              <span className="text-slate-600">Taxes (18% GST)</span>
              <span className="font-medium text-slate-900">
                ₹
                {taxes.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="h-px bg-slate-100 my-2"></div>
            <div className="flex justify-between items-center">
              <span className="text-[15px] font-bold text-slate-900">
                To Pay
              </span>
              <span className="text-[18px] font-black text-blue-600">
                ₹
                {total.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
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

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#FFFFFF] border-t border-slate-100 p-4 pb-safe z-40 lg:max-w-3xl lg:mx-auto lg:relative lg:border-none lg:bg-transparent lg:mt-4">
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="w-1/3 h-[52px] bg-slate-100 text-slate-700 rounded-xl font-bold text-[15px] active:scale-[0.98] transition-transform"
          >
            Cancel
          </button>
          <button
            onClick={() => setShowPaymentSheet(true)}
            className="flex-1 h-[52px] bg-blue-600 text-white rounded-xl font-bold text-[15px] active:scale-[0.98] transition-transform shadow-sm flex items-center justify-center gap-2"
          >
            Pay ₹
            {total.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </button>
        </div>
      </div>

      {/* Note Bottom Sheet */}
      {showNoteSheet && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 lg:items-center transition-opacity"
          onClick={() => setShowNoteSheet(false)}
        >
          <div
            className="w-full bg-[#FFFFFF] rounded-t-[24px] lg:rounded-[24px] lg:max-w-md p-6 animate-in slide-in-from-bottom-full lg:slide-in-from-bottom-0 duration-300"
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
              className="w-full h-[120px] bg-slate-50 border border-slate-200 rounded-xl p-4 text-[14px] text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none mb-6"
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
                className="flex-1 h-[52px] bg-blue-600 text-white rounded-xl font-bold text-[15px] active:scale-[0.98] transition-transform shadow-sm"
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
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 lg:items-center transition-opacity"
          onClick={() => {
            setShowCouponSheet(false);
            setSelectedCouponDetails(null);
          }}
        >
          <div
            className="w-full bg-[#FFFFFF] rounded-t-[24px] lg:rounded-[24px] lg:max-w-md p-6 animate-in slide-in-from-bottom-full lg:slide-in-from-bottom-0 duration-300 max-h-[85vh] overflow-y-auto no-scrollbar flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 sticky top-0 bg-[#FFFFFF] z-10 pb-2">
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
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search offers..."
                className="w-full h-[44px] bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            <div className="space-y-4 flex-1">
              {availableOffers.map((offer) => (
                <div
                  key={offer.id}
                  className="border-2 border-dashed border-blue-200 bg-blue-50/30 rounded-2xl p-4 relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="inline-block px-2.5 py-1 bg-blue-100 text-blue-700 text-[11px] font-black uppercase tracking-wider rounded border border-blue-200 mb-2">
                        {offer.code}
                      </span>
                      <h4 className="text-[15px] font-bold text-slate-900">
                        {offer.title}
                      </h4>
                    </div>
                    {appliedCoupon?.code === offer.code ? (
                      <button
                        onClick={() => setAppliedCoupon(null)}
                        className="text-[13px] font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg"
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
                        className="text-[13px] font-bold text-blue-600 bg-blue-100 px-3 py-1.5 rounded-lg"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                  <p className="text-[13px] text-slate-600 mb-3 leading-relaxed">
                    {offer.desc}
                  </p>

                  <div className="border-t border-blue-100 pt-3 mt-3">
                    <button
                      onClick={() =>
                        setSelectedCouponDetails(
                          selectedCouponDetails === offer.id ? null : offer.id,
                        )
                      }
                      className="text-[12px] font-semibold text-blue-600 flex items-center gap-1"
                    >
                      View Details{" "}
                      <ChevronRight
                        size={14}
                        className={`transition-transform ${selectedCouponDetails === offer.id ? "rotate-90" : ""}`}
                      />
                    </button>

                    {selectedCouponDetails === offer.id && (
                      <div className="mt-3 p-3 bg-[#FFFFFF] rounded-xl text-[12px] text-slate-600 leading-relaxed border border-blue-100">
                        <span className="font-semibold block mb-1 text-slate-900">
                          Terms & Conditions:
                        </span>
                        {offer.terms}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Payment Method Bottom Sheet */}
      {showPaymentSheet && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 lg:items-center transition-opacity"
          onClick={() => setShowPaymentSheet(false)}
        >
          <div
            className="w-full bg-[#FFFFFF] rounded-t-[24px] lg:rounded-[24px] lg:max-w-md p-6 animate-in slide-in-from-bottom-full lg:slide-in-from-bottom-0 duration-300"
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
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    selectedPaymentMethod === "UPI"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-indigo-50 text-indigo-600"
                  }`}
                >
                  <Smartphone size={24} />
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
                      ? "border-blue-600 bg-blue-600 text-white"
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
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    selectedPaymentMethod === "COD"
                      ? "bg-blue-100 text-blue-700"
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
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-300"
                  }`}
                >
                  {selectedPaymentMethod === "COD" && <Check size={12} />}
                </div>
              </button>
            </div>

            <button
              onClick={() => {
                if (selectedPaymentMethod) {
                  setShowPaymentSheet(false);
                  setShowProcessing(true);
                  setTimeout(() => {
                    setProcessingStep("success");
                  }, 2000);
                }
              }}
              disabled={!selectedPaymentMethod}
              className={`w-full mt-6 h-[52px] rounded-xl font-bold text-[15px] transition-all flex items-center justify-center gap-2 ${
                selectedPaymentMethod
                  ? "bg-blue-600 text-white active:scale-[0.98]"
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
              className="w-full mt-3 h-[52px] bg-[#FFFFFF] border border-slate-200 text-slate-700 rounded-xl font-bold text-[15px] active:scale-[0.98] transition-transform"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
