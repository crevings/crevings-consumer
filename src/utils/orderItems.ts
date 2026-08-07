import { Order, OrderItem } from "@/types";

/**
 * Normalizes an order's line items into a typed `OrderItem[]`.
 *
 * The backend's active-order/SSE payloads have historically shipped `items`
 * as a comma-joined string (e.g. "2x Chicken Biryani, Gulab Jamun") while the
 * `Order` type declares an array. This helper makes every consumer safe
 * against both shapes instead of crashing on `.map()`.
 *
 * Preference order:
 *  1. `order.rawItems` — the real backend line items with prices, when present.
 *  2. `order.items` as an array — the typed shape.
 *  3. `order.items` as a string — parsed into `{ name, quantity }` entries.
 *  4. `[]` — nothing to show.
 */
export function normalizeOrderItems(order: Order): OrderItem[] {
  if (order.rawItems && order.rawItems.length > 0) {
    return order.rawItems.map((item) => ({ ...item }));
  }

  // The declared type says OrderItem[], but the wire format can still be a
  // string — treat it as unknown so we can inspect the real runtime shape.
  const items: unknown = order.items;

  if (Array.isArray(items)) {
    return items as OrderItem[];
  }

  if (typeof items === "string" && items.trim()) {
    return items
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((entry) => {
        // "2x Chicken Biryani" → { name: "Chicken Biryani", quantity: 2 }
        const match = /^(\d+)\s*[xX]\s*(.+)$/.exec(entry);
        if (match) {
          const name = match[2]?.trim();
          if (!name) return { name: entry, quantity: 1 };
          return { name, quantity: Number(match[1]) || 1 };
        }
        return { name: entry, quantity: 1 };
      });
  }

  return [];
}

/** Comma-joined names for compact summary lines (snackbar, order cards). */
export function joinItemNames(order: Order): string {
  return normalizeOrderItems(order)
    .map((item) => item.name)
    .filter(Boolean)
    .join(", ");
}
