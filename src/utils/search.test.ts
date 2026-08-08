import { describe, it, expect } from "vitest";
import {
  normalizeSearchText,
  buildRestaurantIndex,
  searchRestaurants,
  buildDishIndex,
  searchDishes,
  type DishSearchRecord,
} from "./search";
import type { Restaurant } from "@/types";

const makeRestaurant = (overrides: Partial<Restaurant>): Restaurant => ({
  id: "r1",
  name: "Dodo's Kitchen",
  cuisine: "North Indian, Pizza",
  rating: 4.5,
  time: "25 min",
  timeValue: 25,
  price: "₹200 for two",
  images: [],
  distance: "3.2 km",
  distanceValue: 3.2,
  dietary: [],
  ...overrides,
});

const makeDish = (overrides: Partial<DishSearchRecord>): DishSearchRecord => ({
  itemId: "d1",
  name: "Dodo's Paneer Wrap",
  category: "Wrap",
  description: "Our signature wrap",
  price: 180,
  images: [],
  isVeg: true,
  restaurant: { id: "r1", name: "Dodo's Kitchen", distanceKm: 3.2 },
  ...overrides,
});

describe("normalizeSearchText", () => {
  it("handles apostrophes (the reported bug: dodos vs Dodo's)", () => {
    expect(normalizeSearchText("Dodo's Kitchen")).toBe("dodo s kitchen");
    expect(normalizeSearchText("Dodo’s Kitchen")).toBe("dodo s kitchen"); // curly quote
    expect(normalizeSearchText("Dodo’s Kitchen")).toBe(normalizeSearchText("Dodo's Kitchen"));
  });

  it("collapses and trims whitespace", () => {
    expect(normalizeSearchText("  Paneer   Tikka ")).toBe("paneer tikka");
    expect(normalizeSearchText("chicken\tbiryani\n")).toBe("chicken biryani");
  });

  it("strips diacritics", () => {
    expect(normalizeSearchText("Café")).toBe("cafe");
    expect(normalizeSearchText("Döner Kebab")).toBe("doner kebab");
  });

  it("turns punctuation and symbols into spaces", () => {
    expect(normalizeSearchText("C-11/202, Ravi Ratna Park 2, Prayagraj")).toBe(
      "c 11 202 ravi ratna park 2 prayagraj"
    );
    expect(normalizeSearchText("Veg. Burger & Fries!")).toBe("veg burger fries");
  });

  it("lowercases", () => {
    expect(normalizeSearchText("BIRYANI Palace")).toBe("biryani palace");
  });

  it("returns empty string for empty / punctuation-only input", () => {
    expect(normalizeSearchText("")).toBe("");
    expect(normalizeSearchText("   ")).toBe("");
    expect(normalizeSearchText("'''---!!!")).toBe("");
    expect(normalizeSearchText(null)).toBe("");
    expect(normalizeSearchText(undefined)).toBe("");
  });
});

describe("searchRestaurants", () => {
  it("finds Dodo's Kitchen when the user types 'dodos'", () => {
    const index = buildRestaurantIndex([
      makeRestaurant({ id: "r1", name: "Dodo's Kitchen", cuisine: "Pizza" }),
      makeRestaurant({ id: "r2", name: "Burger House", cuisine: "Fast Food" }),
    ]);
    const results = searchRestaurants("dodos", index);
    expect(results.map((r) => r.name)).toContain("Dodo's Kitchen");
  });

  it("matches substrings (biryani -> Chicken Biryani) case-insensitively", () => {
    const index = buildRestaurantIndex([
      makeRestaurant({ id: "r1", name: "Chicken Biryani House", cuisine: "Mughlai" }),
      makeRestaurant({ id: "r2", name: "The Burger Bar", cuisine: "Fast Food" }),
    ]);
    expect(searchRestaurants("biryani", index).map((r) => r.name)).toEqual([
      "Chicken Biryani House",
    ]);
    expect(searchRestaurants("BIRYANI", index).length).toBe(1);
  });

  it("is forgiving about stray whitespace in the query", () => {
    const index = buildRestaurantIndex([
      makeRestaurant({ id: "r1", name: "Paneer Tikka Corner", cuisine: "North Indian" }),
    ]);
    expect(searchRestaurants("  paneer   tikka ", index).length).toBe(1);
  });

  it("ranks exact/prefix matches above fuzzy-only matches", () => {
    const index = buildRestaurantIndex([
      makeRestaurant({ id: "r1", name: "Hyderabadi Chicken Biryani", cuisine: "Mughlai" }),
      makeRestaurant({ id: "r2", name: "Biryani Palace", cuisine: "Mughlai" }),
    ]);
    const results = searchRestaurants("biryani", index);
    const [first] = results;
    expect(first?.name).toBe("Biryani Palace");
    expect(results.map((r) => r.name)).toContain("Hyderabadi Chicken Biryani");
  });

  it("handles queries containing apostrophes and quotes", () => {
    const index = buildRestaurantIndex([
      makeRestaurant({ id: "r1", name: "Dodo's Kitchen", cuisine: "Pizza" }),
    ]);
    expect(searchRestaurants("dodo's kitchen", index).length).toBe(1);
    expect(searchRestaurants("dodo’s kitchen", index).length).toBe(1);
  });

  it("matches multi-word typo queries token-by-token", () => {
    const index = buildRestaurantIndex([
      makeRestaurant({ id: "r1", name: "Chicken Biryani House", cuisine: "Mughlai" }),
      makeRestaurant({ id: "r2", name: "Dodo's Kitchen", cuisine: "Pizza" }),
      makeRestaurant({ id: "r3", name: "The Burger Bar", cuisine: "Fast Food" }),
    ]);
    expect(searchRestaurants("chicken birani", index).map((r) => r.name)).toContain(
      "Chicken Biryani House"
    );
    expect(searchRestaurants("dodo kitchen", index).map((r) => r.name)).toContain(
      "Dodo's Kitchen"
    );
  });

  it("returns no results for an empty or punctuation-only query", () => {
    const index = buildRestaurantIndex([makeRestaurant({ id: "r1", name: "Burger House" })]);
    expect(searchRestaurants("", index)).toEqual([]);
    expect(searchRestaurants("   ...  ", index)).toEqual([]);
  });

  it("returns no results when nothing matches", () => {
    const index = buildRestaurantIndex([makeRestaurant({ id: "r1", name: "Burger House" })]);
    expect(searchRestaurants("sushi", index)).toEqual([]);
  });
});

describe("searchDishes", () => {
  it("finds a dish by its restaurant's name (dodos -> Dodo's Kitchen dishes)", () => {
    const index = buildDishIndex([
      makeDish({ itemId: "d1", name: "Dodo's Paneer Wrap" }),
      makeDish({ itemId: "d2", name: "Dodo's Special Pizza" }),
      makeDish({ itemId: "d3", name: "Veg Burger", restaurant: { id: "r2", name: "Burger House", distanceKm: 1.2 } }),
    ]);
    const results = searchDishes("dodos", index);
    expect(results.map((d) => d.name)).toContain("Dodo's Paneer Wrap");
    expect(results.map((d) => d.name)).toContain("Dodo's Special Pizza");
    expect(results.map((d) => d.name)).not.toContain("Veg Burger");
  });

  it("matches dish names with punctuation", () => {
    const index = buildDishIndex([makeDish({ itemId: "d1", name: "Dodo's Paneer Wrap" })]);
    expect(searchDishes("paneer wrap", index).length).toBe(1);
    expect(searchDishes("paneer's wrap", index).length).toBe(1);
  });

  it("matches substrings and whitespace-collapsed queries", () => {
    const index = buildDishIndex([
      makeDish({ itemId: "d1", name: "Chicken Biryani", category: "Rice" }),
      makeDish({ itemId: "d2", name: "Margherita Pizza", category: "Pizza" }),
    ]);
    expect(searchDishes("biryani", index).map((d) => d.name)).toEqual(["Chicken Biryani"]);
    expect(searchDishes("  chicken   biryani ", index).length).toBe(1);
  });

  it("matches multi-word typo queries across word boundaries", () => {
    const index = buildDishIndex([
      makeDish({ itemId: "d1", name: "Dodo's Paneer Wrap", category: "Wrap" }),
      makeDish({ itemId: "d2", name: "Margherita Pizza", category: "Pizza" }),
    ]);
    expect(searchDishes("paneer wrap", index).length).toBe(1);
    expect(searchDishes("dodo paneer", index).map((d) => d.name)).toContain("Dodo's Paneer Wrap");
  });

  it("returns no results for empty queries", () => {
    const index = buildDishIndex([makeDish({ itemId: "d1", name: "Pizza" })]);
    expect(searchDishes("", index)).toEqual([]);
  });
});
