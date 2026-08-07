import type { DeliveryFeeSlab } from "@/types";

export type IDeliveryFeeSlab = DeliveryFeeSlab;

/**
 * Calculates delivery fee dynamically ONLY from array of fee slabs fetched from MongoDB
 */
export const calculateFeeFromSlabs = (
  distanceKm: number,
  slabs?: IDeliveryFeeSlab[]
): number => {
  if (!slabs || !Array.isArray(slabs) || slabs.length === 0) {
    return 0;
  }

  const matchingSlab = slabs.find(
    (s) => distanceKm >= s.minKm && distanceKm < s.maxKm
  );

  if (matchingSlab) {
    return matchingSlab.fee;
  }

  // If distance exceeds highest slab maxKm in DB, pick fee of highest slab in DB
  const sorted = [...slabs].sort((a, b) => b.maxKm - a.maxKm);
  return sorted[0]?.fee || 0;
};
