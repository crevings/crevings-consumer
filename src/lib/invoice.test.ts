import { describe, it, expect } from "vitest";
import { parseOrderItems, getOrderTotals, buildInvoiceHtml } from "./invoice";
import type { Order } from "@/types";

const baseOrder: Order = {
  id: "o1",
  restaurantName: "Biryani Blues",
  location: "MG Road",
  rating: 4.5,
  items: [
    { name: "Chicken Biryani", quantity: 2 },
    { name: "Gulab Jamun", quantity: 1 },
  ],
  orderDate: "Aug 8, 2026",
  type: "Delivery",
  status: "COMPLETED",
  total: 420,
};

describe("parseOrderItems", () => {
  it("prefers real rawItems with their prices", () => {
    const order: Order = {
      ...baseOrder,
      rawItems: [
        { name: "Chicken Biryani", quantity: 2, price: 200 },
        { name: "Gulab Jamun", quantity: 1, price: 20 },
      ],
    };
    expect(parseOrderItems(order)).toEqual([
      { name: "Chicken Biryani", quantity: 2, price: 200 },
      { name: "Gulab Jamun", quantity: 1, price: 20 },
    ]);
  });

  it("maps line items with price 0 instead of inventing prices", () => {
    const items = parseOrderItems(baseOrder);
    expect(items).toHaveLength(2);
    expect(items[0]).toEqual({ name: "Chicken Biryani", quantity: 2, price: 0 });
  });
});

describe("getOrderTotals", () => {
  it("uses real backend fields only", () => {
    const totals = getOrderTotals(baseOrder);
    expect(totals.total).toBe(420);
    expect(totals.deliveryFee).toBe(0);
    expect(totals.tax).toBe(0);
  });

  it("falls back to order.price for total", () => {
    const totals = getOrderTotals({ ...baseOrder, total: undefined, price: 399 });
    expect(totals.total).toBe(399);
  });
});

describe("buildInvoiceHtml", () => {
  it("contains real item names and no invented ₹120 prices", () => {
    const html = buildInvoiceHtml(baseOrder);
    expect(html).toContain("Chicken Biryani");
    expect(html).toContain("Gulab Jamun");
    expect(html).not.toContain("₹120");
    expect(html).toContain("₹420");
  });
});
