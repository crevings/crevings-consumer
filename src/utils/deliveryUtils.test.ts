import { describe, it, expect } from "vitest";
import { calculateFeeFromSlabs } from "./deliveryUtils";

const slabs = [
  { minKm: 0, maxKm: 2, fee: 20 },
  { minKm: 2, maxKm: 5, fee: 35 },
  { minKm: 5, maxKm: 10, fee: 50 },
];

describe("calculateFeeFromSlabs", () => {
  it("returns the matching slab fee", () => {
    expect(calculateFeeFromSlabs(1.5, slabs)).toBe(20);
    expect(calculateFeeFromSlabs(3, slabs)).toBe(35);
  });

  it("uses the highest slab when distance exceeds the range", () => {
    expect(calculateFeeFromSlabs(99, slabs)).toBe(50);
  });

  it("returns 0 with no slabs", () => {
    expect(calculateFeeFromSlabs(3, undefined)).toBe(0);
    expect(calculateFeeFromSlabs(3, [])).toBe(0);
  });
});
