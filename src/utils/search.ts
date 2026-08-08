/**
 * search.ts — lightweight, high-accuracy fuzzy search built on Fuse.js.
 *
 * Why this exists
 * ---------------
 * The previous search delegated entirely to a server-side regex (`new
 * RegExp(q, "i")` substring match). That fails on perfectly ordinary input:
 * `dodos` never matches `Dodo's Kitchen` because the apostrophe breaks the
 * substring, and stray whitespace / punctuation yields empty results.
 *
 * Strategy
 * --------
 * 1. Both the indexed fields AND the query are folded through
 *    `normalizeSearchText()` (unicode-fold, strip diacritics, normalize
 *    typographic quotes, replace every remaining punctuation with a space,
 *    collapse whitespace). Punctuation therefore can never break a match.
 * 2. A Fuse.js instance is built once per dataset and searched with
 *    `ignoreLocation` so terms match anywhere inside a name — not just at the
 *    start — while `threshold` keeps the result set relevant.
 * 3. Multi-word queries ("dodo's kitchen", "chicken biryani") are matched in
 *    classic whole-pattern mode first, with a per-token AND-intersection
 *    fallback so every meaningful word must hit — adding words narrows the
 *    results, and typos on one word don't hide the record.
 * 4. A deterministic relevance tie-break (exact → prefix → substring →
 *    word-prefix → fuzzy) lifts the most intuitive results to the top.
 *    `Array.prototype.sort` is stable, so Fuse's score ordering is preserved
 *    within a tier.
 *
 * The dataset is small (a single market's restaurants + dishes), so the
 * index build is O(n) once per dataset change and every keystroke only pays
 * for a Fuse search — cheap enough to run fully client-side.
 */

import Fuse from "fuse.js";
import type { Restaurant } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// Normalization
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fold arbitrary user-visible text into a stable, punctuation-free search key.
 *
 * - `normalize("NFD")` + stripping U+0300–U+036F removes diacritics (Café → cafe).
 * - Typographic quotes (’, ‘, “, ”, ‛, ʼ) become straight quotes.
 * - Everything that is not a letter or digit becomes a single space, so
 *   apostrophes, slashes, hyphens, dots and tabs can never fragment a word.
 * - Runs of whitespace collapse and leading/trailing space is trimmed.
 */
export function normalizeSearchText(input: string | null | undefined): string {
  if (!input) return "";
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u2018\u2019\u201A\u201B\u02BC]/g, "'")
    .replace(/[\u201C\u201D\u201E]/g, '"')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Shared Fuse options tuned for catalog-style name search.
 *
 * Classic (whole-pattern) matching on normalized text: apostrophes and other
 * punctuation are already gone from both sides, so substring and fuzzy
 * matching behave the way users expect.
 */
const BASE_FUSE_OPTIONS = {
  // Match anywhere in the field — the whole point of a search bar.
  ignoreLocation: true,
  // Forgiving enough for typos, strict enough to stay relevant.
  threshold: 0.4,
  distance: 100,
  // Ignore one/two character noise (keeps "a"/"of" from matching everything).
  minMatchCharLength: 2,
  shouldSort: true,
} as const;

/**
 * Deterministic relevance tiers used as a stable tie-break on top of Fuse's
 * score. Lower is better. `normalizedText` must already be normalized.
 */
function matchTier(normalizedText: string, normalizedQuery: string): number {
  if (normalizedText === normalizedQuery) return 0; // exact
  if (normalizedText.startsWith(normalizedQuery)) return 1; // prefix
  if (normalizedText.includes(normalizedQuery)) return 2; // substring
  if (normalizedText.split(" ").some((word) => word.startsWith(normalizedQuery))) return 3; // word prefix
  return 4; // fuzzy-only
}

/**
 * Core matcher shared by restaurants and dishes.
 *
 * - Single-token queries: one classic Fuse search on the whole (normalized)
 *   query — handles "dodos" → "Dodo's Kitchen" and "biryani" → "Chicken Biryani".
 * - Multi-token queries: first the classic whole-pattern search; if the query
 *   has ≥ 2 meaningful words, also intersect per-token Fuse results (AND
 *   semantics) so every word must hit. The intersection wins when non-empty
 *   (it is guaranteed to be on-topic); otherwise the classic results stand.
 *   Short tokens (< 2 chars, e.g. the "s" left over from "Dodo's") are
 *   skipped so punctuation can never starve the intersection.
 */
function searchDocs<T>(
  index: Fuse<T>,
  query: string,
  limit: number,
  idOf: (doc: T) => string
): T[] {
  const q = normalizeSearchText(query);
  if (!q) return [];

  const tokens = q.split(" ").filter((token) => token.length >= 2);

  // Single word (or punctuation-only → already empty): classic search only.
  if (tokens.length <= 1) {
    return index.search(q, { limit: limit * 3 }).map((result) => result.item);
  }

  const direct = index.search(q, { limit: limit * 3 }).map((result) => result.item);

  // Intersect every meaningful token (AND semantics).
  const firstToken = tokens[0] ?? "";
  let common = new Set(index.search(firstToken, { limit: limit * 4 }).map((r) => idOf(r.item)));
  for (let i = 1; i < tokens.length; i++) {
    const token = tokens[i];
    if (!token) continue;
    const ids = new Set(index.search(token, { limit: limit * 4 }).map((r) => idOf(r.item)));
    common = new Set([...common].filter((id) => ids.has(id)));
  }

  if (common.size === 0) return direct;

  // Rank the intersection by the first token's Fuse order, then append any
  // whole-pattern hits that weren't part of it (e.g. fuzzy phrase matches).
  const ranked = index
    .search(firstToken, { limit: limit * 4 })
    .map((result) => result.item)
    .filter((doc) => common.has(idOf(doc)));
  const rankedIds = new Set(ranked.map((doc) => idOf(doc)));
  const extras = direct.filter((doc) => !rankedIds.has(idOf(doc)));

  return [...ranked, ...extras].slice(0, limit);
}

// ─────────────────────────────────────────────────────────────────────────────
// Restaurants
// ─────────────────────────────────────────────────────────────────────────────

/** Pre-normalized search document; the original restaurant rides along. */
export interface RestaurantSearchDoc {
  id: string;
  name: string;
  cuisine: string;
  address: string;
  __restaurant: Restaurant;
}

/** Build (or rebuild) the Fuse index for a restaurant list. Memoize in the caller. */
export function buildRestaurantIndex(restaurants: ReadonlyArray<Restaurant>): Fuse<RestaurantSearchDoc> {
  const docs: RestaurantSearchDoc[] = restaurants.map((restaurant) => ({
    id: String(restaurant.id),
    name: normalizeSearchText(restaurant.name),
    cuisine: normalizeSearchText(typeof restaurant.cuisine === "string" ? restaurant.cuisine : ""),
    address: normalizeSearchText(typeof restaurant.address === "string" ? restaurant.address : ""),
    __restaurant: restaurant,
  }));

  return new Fuse(docs, {
    ...BASE_FUSE_OPTIONS,
    keys: [
      { name: "name", weight: 1 },
      { name: "cuisine", weight: 0.6 },
      { name: "address", weight: 0.3 },
    ],
  });
}

/**
 * Fuzzy-search restaurants. Returns the original `Restaurant` objects,
 * relevance-ordered (exact/prefix matches first, fuzzy matches last).
 */
export function searchRestaurants(
  query: string,
  index: Fuse<RestaurantSearchDoc>,
  limit = 20
): Restaurant[] {
  const q = normalizeSearchText(query);
  if (!q) return [];

  return searchDocs(index, query, limit, (doc) => doc.id)
    .sort((a, b) => matchTier(a.name, q) - matchTier(b.name, q))
    .slice(0, limit)
    .map((doc) => doc.__restaurant);
}

// ─────────────────────────────────────────────────────────────────────────────
// Dishes
// ─────────────────────────────────────────────────────────────────────────────

/** A dish enriched with its parent restaurant — the unit the Dishes tab renders. */
export interface DishSearchRecord {
  itemId: string;
  name: string;
  category?: string;
  description?: string;
  price?: number;
  images?: string[];
  isVeg?: boolean;
  isEgg?: boolean;
  restaurant: {
    id: string;
    name: string;
    distanceKm?: number;
  };
}

/** Pre-normalized search document for a dish. */
export interface DishSearchDoc {
  itemId: string;
  name: string;
  category: string;
  description: string;
  restaurantName: string;
  __dish: DishSearchRecord;
}

/** Build (or rebuild) the Fuse index for a dish list. Memoize in the caller. */
export function buildDishIndex(dishes: ReadonlyArray<DishSearchRecord>): Fuse<DishSearchDoc> {
  const docs: DishSearchDoc[] = dishes.map((dish) => ({
    itemId: dish.itemId,
    name: normalizeSearchText(dish.name),
    category: normalizeSearchText(dish.category),
    description: normalizeSearchText(dish.description),
    restaurantName: normalizeSearchText(dish.restaurant.name),
    __dish: dish,
  }));

  return new Fuse(docs, {
    ...BASE_FUSE_OPTIONS,
    keys: [
      { name: "name", weight: 1 },
      { name: "restaurantName", weight: 0.6 },
      { name: "category", weight: 0.4 },
      { name: "description", weight: 0.3 },
    ],
  });
}

/**
 * Fuzzy-search dishes across every restaurant. A query matching the dish name
 * OR its restaurant's name ("dodos" → Dodo's Kitchen) both surface, with the
 * dish's own name matching weighted higher.
 */
export function searchDishes(
  query: string,
  index: Fuse<DishSearchDoc>,
  limit = 24
): DishSearchRecord[] {
  const q = normalizeSearchText(query);
  if (!q) return [];

  const tier = (doc: DishSearchDoc) => Math.min(matchTier(doc.name, q), matchTier(doc.restaurantName, q));

  return searchDocs(index, query, limit, (doc) => doc.itemId)
    .sort((a, b) => tier(a) - tier(b))
    .slice(0, limit)
    .map((doc) => doc.__dish);
}
