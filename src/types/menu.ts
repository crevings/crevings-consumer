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
  pricing_options?: any[];
  allowedAddons?: any[];
  allowedToppings?: any[];
  allowedBeverages?: any[];
  comboItems?: any[];
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
