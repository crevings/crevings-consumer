import { describe, it, expect } from "vitest";
import { normalizeOrderItems, joinItemNames } from "./orderItems";
import type { Order } from "@/types";

const baseOrder: Order = {
  id: "o1",
  restaurantName: "Biryani Blues",
  location: "MG Road",
  rating: 4.5,
  items: [],
  orderDate: "Aug 8, 2026",
  type: "Delivery",
  status: "NEW",
};

describe("normalizeOrderItems", () => {
  it("prefers rawItems when present", () => {
    const order: Order = {
      ...baseOrder,
      rawItems: [
        { name: "Chicken Biryani", quantity: 2, price: 200 },
      ],
      items: [{ name: "Stale", quantity: 1 }],
    };
    expect(normalizeOrderItems(order)).toEqual([
      { name: "Chicken Biryani", quantity: 2, price: 200 },
    ]);
  });

  it("returns typed array items as-is", () => {
    const order: Order = {
      ...baseOrder,
      items: [
        { name: "Chicken Biryani", quantity: 2 },
        { name: "Gulab Jamun", quantity: 1 },
      ],
    };
    expect(normalizeOrderItems(order)).toHaveLength(2);
    expect(normalizeOrderItems(order)[0]?.name).toBe("Chicken Biryani");
  });

  it("parses legacy comma-joined strings with quantity prefixes", () => {
    const order: Order = {
      ...baseOrder,
      items: "2x Chicken Biryani, Gulab Jamun, 1 X Naan" as unknown as Order["items"],
    };
    expect(normalizeOrderItems(order)).toEqual([
      { name: "Chicken Biryani", quantity: 2 },
      { name: "Gulab Jamun", quantity: 1 },
      { name: "Naan", quantity: 1 },
    ]);
  });

  it("parses legacy plain-name strings without prefixes", () => {
    const order: Order = {
      ...baseOrder,
      items: "Pizza, Pasta" as unknown as Order["items"],
    };
    expect(normalizeOrderItems(order)).toEqual([
      { name: "Pizza", quantity: 1 },
      { name: "Pasta", quantity: 1 },
    ]);
  });

  it("returns an empty array for empty/blank strings", () => {
    const order: Order = { ...baseOrder, items: "" as unknown as Order["items"] };
    expect(normalizeOrderItems(order)).toEqual([]);
  });

  it("returns an empty array when nothing is available", () => {
    expect(normalizeOrderItems(baseOrder)).toEqual([]);
  });
});

describe("joinItemNames", () => {
  it("joins names with commas", () => {
    const order: Order = {
      ...baseOrder,
      items: "2x Chicken Biryani, Gulab Jamun" as unknown as Order["items"],
    };
    expect(joinItemNames(order)).toBe("Chicken Biryani, Gulab Jamun");
  });

  it("returns empty string when no items", () => {
    expect(joinItemNames(baseOrder)).toBe("");
  });
});
