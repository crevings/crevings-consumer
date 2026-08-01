import { CartItem } from "@/types";

export function isSameCartItem(a: CartItem, b: CartItem): boolean {
  if (a.item.id !== b.item.id) return false;

  const aVarId = a.variant?.id || null;
  const bVarId = b.variant?.id || null;
  if (aVarId !== bVarId) return false;

  const aAddons = (a.selectedAddons || []).map((x) => `${x.id}:${x.quantity}`).sort().join(",");
  const bAddons = (b.selectedAddons || []).map((x) => `${x.id}:${x.quantity}`).sort().join(",");
  if (aAddons !== bAddons) return false;

  const aSides = (a.selectedSides || []).map((x) => `${x.id}:${x.quantity}`).sort().join(",");
  const bSides = (b.selectedSides || []).map((x) => `${x.id}:${x.quantity}`).sort().join(",");
  if (aSides !== bSides) return false;

  return true;
}

export function consolidateCart(cartItems: CartItem[]): CartItem[] {
  const result: CartItem[] = [];
  for (const item of cartItems) {
    const existingIdx = result.findIndex((c) => isSameCartItem(c, item));
    if (existingIdx !== -1) {
      const existing = result[existingIdx];
      const newQty = existing.quantity + item.quantity;
      const unitPrice = existing.totalPrice / (existing.quantity || 1);
      result[existingIdx] = {
        ...existing,
        quantity: newQty,
        totalPrice: unitPrice * newQty,
      };
    } else {
      result.push({ ...item });
    }
  }
  return result;
}

export function addOrUpdateCartItem(prevCart: CartItem[], newItem: CartItem): CartItem[] {
  return consolidateCart([...prevCart, newItem]);
}
