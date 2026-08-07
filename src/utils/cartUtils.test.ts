import { describe, it, expect } from "vitest";
import {
  isSameCartItem,
  consolidateCart,
  addOrUpdateCartItem,
  calculateCartItemUnitPrice,
  withQuantity,
} from "./cartUtils";
import type { CartItem, MenuItem } from "@/types";

const makeItem = (id: string, price: number): MenuItem => ({
  id,
  name: `Item ${id}`,
  price,
  rating: 4.5,
  ratingCount: "100",
  image: "",
  isVeg: true,
  category: "Main",
});

const makeCartItem = (overrides: Partial<CartItem> = {}): CartItem => ({
  cartItemId: "c1",
  item: makeItem("i1", 100),
  quantity: 1,
  totalPrice: 100,
  ...overrides,
});

describe("isSameCartItem", () => {
  it("matches identical items", () => {
    expect(isSameCartItem(makeCartItem(), makeCartItem())).toBe(true);
  });

  it("distinguishes different item ids", () => {
    const a = makeCartItem();
    const b = makeCartItem({ item: makeItem("i2", 200) });
    expect(isSameCartItem(a, b)).toBe(false);
  });

  it("distinguishes different variants", () => {
    const a = makeCartItem();
    const b = makeCartItem({
      variant: { id: "v1", name: "Large", price: 50 },
    });
    expect(isSameCartItem(a, b)).toBe(false);
  });

  it("distinguishes different addon quantities", () => {
    const a = makeCartItem({
      selectedAddons: [{ id: "a1", name: "Cheese", price: 20, quantity: 1 }],
    });
    const b = makeCartItem({
      selectedAddons: [{ id: "a1", name: "Cheese", price: 20, quantity: 2 }],
    });
    expect(isSameCartItem(a, b)).toBe(false);
  });
});

describe("consolidateCart", () => {
  it("merges identical lines and keeps unit price", () => {
    const a = makeCartItem({ quantity: 2, totalPrice: 200 });
    const b = makeCartItem({ cartItemId: "c2", quantity: 3, totalPrice: 300 });
    const merged = consolidateCart([a, b]);
    expect(merged).toHaveLength(1);
    expect(merged[0]?.quantity).toBe(5);
    expect(merged[0]?.totalPrice).toBe(500);
  });

  it("keeps distinct lines separate", () => {
    const a = makeCartItem();
    const b = makeCartItem({ item: makeItem("i2", 50) });
    expect(consolidateCart([a, b])).toHaveLength(2);
  });
});

describe("addOrUpdateCartItem", () => {
  it("adds a new line when nothing matches", () => {
    const result = addOrUpdateCartItem([], makeCartItem());
    expect(result).toHaveLength(1);
  });
});

describe("calculateCartItemUnitPrice", () => {
  it("sums base + variant + addons + sides", () => {
    const item = makeCartItem({
      item: makeItem("i1", 100),
      variant: { id: "v1", name: "Large", price: 40 },
      selectedAddons: [{ id: "a1", name: "Cheese", price: 20, quantity: 2 }],
      selectedSides: [{ id: "s1", name: "Salad", price: 10, quantity: 1 }],
    });
    expect(calculateCartItemUnitPrice(item)).toBe(100 + 40 + 40 + 10);
  });
});

describe("withQuantity", () => {
  it("recomputes the line total", () => {
    const item = makeCartItem({ quantity: 2, totalPrice: 200 });
    const updated = withQuantity(item, 5);
    expect(updated.quantity).toBe(5);
    expect(updated.totalPrice).toBe(500);
  });
});
