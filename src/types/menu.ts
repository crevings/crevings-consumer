export interface PricingOption {
  _id?: string;
  label?: string;
  price: number;
  /** Add-ons configured for this specific variant (pricing_unit === "size"). */
  allowedAddons?: AddonGroupItem[];
}

export interface AddonOption {
  id: string;
  name: string;
  price: number;
}

/** Backend addon/group shape with grouping metadata used by customization sheets. */
export interface AddonGroupItem {
  groupName?: string;
  groupId?: string;
  groupLimit?: number | null;
  groupOptional?: boolean;
  id?: string;
  _id?: string;
  name: string;
  price?: number;
  isVeg?: boolean;
  inStock?: boolean;
  image?: string;
}

export interface ComboItem {
  id?: string;
  name?: string;
  price?: number;
  quantity?: number;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  rating: number;
  ratingCount: string;
  image: string;
  isVeg: boolean;
  isEgg?: boolean;
  description?: string;
  category: string;
  bestseller?: boolean;
  spicy?: boolean;
  available?: boolean;
  hasOffer?: boolean;
  servingSize?: string;
  piecesInfo?: string;
  pricing_options?: PricingOption[];
  allowedAddons?: AddonGroupItem[];
  allowedToppings?: AddonGroupItem[];
  allowedBeverages?: AddonGroupItem[];
  comboItems?: ComboItem[];
  gstCategory?: string;
  gstIncluded?: boolean;
}

export interface CartItem {
  cartItemId: string;
  item: MenuItem;
  quantity: number;
  variant?: { id: string; name: string; price: number };
  selectedAddons?: { id: string; name: string; price: number; quantity: number }[];
  selectedSides?: { id: string; name: string; price: number; quantity: number }[];
  totalPrice: number;
}
