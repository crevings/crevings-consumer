import { Restaurant } from "@/types";

/**
 * Returns the displayable address string for a restaurant.
 * `address` may be a plain string or an object carrying coordinates —
 * only the string form is safe to render directly.
 */
export function getRestaurantAddress(restaurant: Restaurant | null | undefined): string {
  const address = restaurant?.address;
  return typeof address === "string" ? address : "";
}
