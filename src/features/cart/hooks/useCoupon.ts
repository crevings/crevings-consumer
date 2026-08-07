import { useState, useEffect, useCallback } from "react";
import { post } from "@/api/fetcher";
import { Offer } from "@/types";

interface CouponValidationResponse {
  success: boolean;
  isValid?: boolean;
  message?: string;
  discountAmount?: number;
}

export interface AppliedCoupon {
  code: string;
  discount: number;
}

interface UseCouponOptions {
  restaurantId?: string;
  cart: { item: { id: string; price: number; category?: string }; quantity: number }[];
  subtotal: number;
  orderType: "Delivery" | "Takeaway";
  offers: Offer[];
}

/**
 * Coupon selection + validation state for checkout.
 */
export const useCoupon = ({ restaurantId, cart, subtotal, orderType, offers }: UseCouponOptions) => {
  const [showCouponSheet, setShowCouponSheet] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [selectedCouponDetails, setSelectedCouponDetails] = useState<string | null>(null);
  const [couponError, setCouponError] = useState("");
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  const applyCoupon = useCallback(async (code: string) => {
    setCouponError("");
    setIsValidatingCoupon(true);
    try {
      const result = await post<CouponValidationResponse>(
        `/consumer/restaurants/${restaurantId}/offers/validate`,
        {
          code,
          items: cart.map((c) => ({
            id: c.item.id,
            price: c.item.price,
            quantity: c.quantity,
            category: c.item.category,
          })),
          subtotal,
          orderType: orderType.toLowerCase(),
        }
      );
      if (!result.success || !result.isValid) {
        setCouponError(result.message || "Failed to apply coupon");
      } else {
        setAppliedCoupon({
          code,
          discount: result.discountAmount || 0,
        });
        setShowCouponSheet(false);
      }
    } catch {
      setCouponError("Failed to validate coupon on backend");
    } finally {
      setIsValidatingCoupon(false);
    }
  }, [restaurantId, cart, subtotal, orderType]);

  // Keep the applied offer in sync with the active offer list (e.g. expiry).
  useEffect(() => {
    if (!appliedCoupon) return;
    const activeOffer = offers.find((o) => o.offerId === appliedCoupon.code);
    if (!activeOffer) return;
    const typeKey = orderType.toLowerCase() as "delivery" | "takeaway";
    const isSupported = activeOffer.orderTypes[typeKey] !== false;
    if (isSupported === false) {
      setAppliedCoupon(null);
      alert(`Coupon ${appliedCoupon.code} is not applicable for ${orderType}.`);
    }
  }, [appliedCoupon, offers, orderType]);

  const clearCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setSelectedCouponDetails(null);
    setCouponError("");
  }, []);

  return {
    showCouponSheet,
    setShowCouponSheet,
    appliedCoupon,
    setAppliedCoupon,
    selectedCouponDetails,
    setSelectedCouponDetails,
    couponError,
    setCouponError,
    isValidatingCoupon,
    applyCoupon,
    clearCoupon,
  };
};
