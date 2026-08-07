import React, { useState, useMemo } from 'react';
import { X, Plus, Minus, Trash2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { MenuItem, PricingOption, AddonGroupItem, CartItem } from "@/types";

export interface CustomizationItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  isVeg: boolean;
  inStock: boolean;
}

export interface CustomizationSection {
  id: string;
  title: string;
  subtitle: string;
  type: 'addon' | 'beverage';
  selectionLimit?: number;
  isRequired: boolean;
  items: CustomizationItem[];
}

export interface ItemVariant {
  id: string;
  name: string;
  price: number;
}

interface CustomizationCartPayload {
  item: MenuItem;
  variant?: CartItem["variant"];
  mainQuantity: number;
  selectedAddons: NonNullable<CartItem["selectedAddons"]>;
  selectedSides: NonNullable<CartItem["selectedSides"]>;
  totalPrice: number;
}

interface CustomizationBottomSheetProps {
  item: MenuItem;
  onClose: () => void;
  onAddToCart: (cartItem: CustomizationCartPayload) => void;
}

// Helper to generate dynamic variants from the item's pricing options
const getVariantsForItem = (item: MenuItem): ItemVariant[] => {
  if (item.pricing_options && item.pricing_options.length > 0) {
    return item.pricing_options.map((option: PricingOption, index: number) => ({
      id: option._id || `v${index}`,
      name: option.label || 'Regular',
      price: option.price,
    }));
  }

  // No pricing options — single-price item. Return no variants so the cart
  // never gets a static "Regular" option attached to it.
  return [];
};

// Helper to generate dynamic addons from the item's allowed addon groups
const getAddonsForItem = (item: MenuItem): CustomizationSection[] => {
  const sectionMap = new Map<string, CustomizationSection>();

  const processAddon = (addon: AddonGroupItem, defaultTitle: string, type: 'addon' | 'beverage') => {
    if (!addon) return;
    const title = addon.groupName || defaultTitle;
    const id = addon.groupId || title.toLowerCase().replace(/\s+/g, '-');
    const limit = addon.groupLimit !== undefined && addon.groupLimit !== null ? addon.groupLimit : 0;
    const optional = addon.groupOptional !== false;

    let subtitle = '';
    if (limit > 0) {
      subtitle = optional 
        ? `Select up to ${limit} • Optional` 
        : `Select up to ${limit} • Required`;
    } else {
      subtitle = optional 
        ? `Select any number • Optional` 
        : `Select at least 1 • Required`;
    }
    
    if (!sectionMap.has(id)) {
      sectionMap.set(id, {
        id,
        title,
        subtitle,
        type,
        selectionLimit: limit > 0 ? limit : undefined,
        isRequired: !optional,
        items: []
      });
    }
    
    sectionMap.get(id)!.items.push({
      id: addon.id || addon._id || addon.name,
      name: addon.name,
      price: addon.price || 0,
      isVeg: addon.isVeg ?? true,
      inStock: addon.inStock ?? true,
      image: addon.image
    });
  };

  if (Array.isArray(item.allowedAddons)) {
    item.allowedAddons.forEach((addon) => processAddon(addon, 'Addons', 'addon'));
  }
  if (Array.isArray(item.allowedToppings)) {
    item.allowedToppings.forEach((addon) => processAddon(addon, 'Toppings', 'addon'));
  }
  if (Array.isArray(item.allowedBeverages)) {
    item.allowedBeverages.forEach((addon) => processAddon(addon, 'Beverages', 'beverage'));
  }

  return Array.from(sectionMap.values());
};

export const CustomizationBottomSheet: React.FC<CustomizationBottomSheetProps> = ({ item, onClose, onAddToCart }) => {
  const variants = useMemo(() => getVariantsForItem(item), [item]);
  const sections = useMemo(() => getAddonsForItem(item), [item]);

  const [selectedVariant, setSelectedVariant] = useState<ItemVariant | null>(variants[0] ?? null);
  const [mainQuantity, setMainQuantity] = useState(1);
  const [addonQuantities, setAddonQuantities] = useState<Record<string, number>>({});
  const [selectedBeverages, setSelectedBeverages] = useState<Record<string, boolean>>({});
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleAddonIncrement = (id: string, section: CustomizationSection) => {
    if (section.selectionLimit) {
      const totalQty = section.items.reduce((sum, it) => sum + (addonQuantities[it.id] || 0), 0);
      if (totalQty >= section.selectionLimit) return;
    }
    setAddonQuantities(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleAddonDecrement = (id: string) => {
    setAddonQuantities(prev => {
      const current = prev[id] || 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: current - 1 };
    });
  };

  const toggleBeverage = (id: string, sectionItems: CustomizationItem[], limit?: number) => {
    setSelectedBeverages(prev => {
      const isSelected = prev[id];
      if (isSelected) {
        const next = { ...prev };
        delete next[id];
        return next;
      } else {
        if (limit) {
          const sectionSelectedCount = sectionItems.filter(it => prev[it.id]).length;
          if (sectionSelectedCount >= limit) {
            if (limit === 1) {
              const next = { ...prev };
              sectionItems.forEach(it => {
                delete next[it.id];
              });
              next[id] = true;
              return next;
            }
            return prev;
          }
        }
        return { ...prev, [id]: true };
      }
    });
  };

  const calculateTotalPrice = () => {
    let total = (selectedVariant?.price ?? item.price) * mainQuantity;

    sections.forEach(section => {
      section.items.forEach(addon => {
        if (section.type === 'beverage') {
          const qty = addonQuantities[addon.id] || 0;
          total += addon.price * qty;
        } else if (section.type === 'addon') {
          if (selectedBeverages[addon.id]) {
            total += addon.price;
          }
        }
      });
    });

    return total;
  };

  const handleAddToCart = () => {
    setValidationError(null);

    // Validate required sections
    for (const section of sections) {
      if (section.isRequired) {
        const selectedCount = section.items.filter(
          it => section.type === 'addon' ? selectedBeverages[it.id] : (addonQuantities[it.id] ?? 0) > 0
        ).length;
        
        if (selectedCount === 0) {
          setValidationError(`Please select at least one option from "${section.title}"`);
          return;
        }
      }
    }

    const selectedAddonsList = sections
      .filter(s => s.type === 'addon')
      .flatMap(s => s.items)
      .filter(it => selectedBeverages[it.id])
      .map(it => ({ id: it.id, name: it.name, price: it.price, quantity: 1 }));

    const selectedBeveragesList = sections
      .filter(s => s.type === 'beverage')
      .flatMap(s => s.items)
      .filter(it => (addonQuantities[it.id] ?? 0) > 0)
      .map(it => ({ id: it.id, name: it.name, price: it.price, quantity: addonQuantities[it.id] ?? 0 }));

    onAddToCart({
      item,
      variant: selectedVariant ?? undefined,
      mainQuantity,
      selectedAddons: selectedAddonsList,
      selectedSides: selectedBeveragesList,
      totalPrice: calculateTotalPrice()
    });

    onClose();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
        onClick={onClose}
      />

      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[24px] z-[70] flex flex-col max-h-[90vh]"
      >
        {/* Top Section (Item Header) */}
        <div className="p-4 border-b border-gray-100 shrink-0 relative">
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-600 active:scale-95 transition-transform z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex gap-4 pr-10">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
              <img loading="lazy" src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-[20px] font-bold text-gray-900 leading-tight mb-1">{item.name}</h2>
              <div className="flex items-center gap-2 text-[13px] text-gray-500 font-medium">
                <span>Serves 1</span>
                {item.bestseller && (
                  <>
                    <span>•</span>
                    <span className="text-[#00bd6f] font-bold">Bestseller</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 pb-32">
          {/* Variants Section (Size/Quantity/Weight) */}
          {variants.length > 1 && (
            <div className="border-b border-gray-100">
              <div className="px-4 py-4 bg-gray-50/50">
                <h3 className="text-[18px] font-bold text-gray-900">Choose Size / Quantity</h3>
                <p className="text-[13px] text-gray-500 font-medium mt-0.5">Select one option • Required</p>
              </div>
              <div className="px-4 py-3 grid grid-cols-3 gap-3">
                {variants.map((variant) => (
                  <div
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border cursor-pointer transition-all ${selectedVariant?.id === variant.id
                        ? 'border-[#00bd6f] bg-[#f4fdf8] shadow-[0_2px_10px_rgba(0,189,111,0.1)]'
                        : 'border-gray-200 bg-white shadow-sm hover:border-gray-300'
                      }`}
                  >
                    <span className={`text-[14px] font-bold mb-1 ${selectedVariant?.id === variant.id ? 'text-[#00bd6f]' : 'text-gray-700'}`}>
                      {variant.name}
                    </span>
                    <span className="text-[13px] font-bold text-gray-900">₹{variant.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add-on Sections */}
          {sections.map((section) => (
            <div key={section.id} className="border-b border-gray-100 last:border-0">
              <div className="px-4 py-4 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-[18px] font-bold text-gray-900">{section.title}</h3>
                  {section.isRequired && (
                    <span className="text-[11px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-md">Required</span>
                  )}
                </div>
                <p className="text-[13px] text-gray-500 font-medium mt-0.5">{section.subtitle}</p>
              </div>

              <div className="px-4 py-3 flex flex-col gap-3">
                {section.items.map((addon) => {
                  const isAddonSelected = (addonQuantities[addon.id] ?? 0) > 0;
                  const isBeverageSelected = selectedBeverages[addon.id];
                  const isSelected = isAddonSelected || isBeverageSelected;

                  // Section limit checks for disabling non-selected options
                  let isUnselectable = false;
                  if (section.type === 'addon') {
                    const sectionSelectedCount = section.items.filter(it => selectedBeverages[it.id]).length;
                    const isLimitReached = !!section.selectionLimit && section.selectionLimit > 1 && sectionSelectedCount >= section.selectionLimit;
                    isUnselectable = isLimitReached && !isSelected;
                  } else if (section.type === 'beverage') {
                    const totalQty = section.items.reduce((sum, it) => sum + (addonQuantities[it.id] || 0), 0);
                    const isLimitReached = !!section.selectionLimit && totalQty >= section.selectionLimit;
                    isUnselectable = isLimitReached && !isAddonSelected;
                  }

                  return (
                    <div
                      key={addon.id}
                      onClick={() => {
                        if (!addon.inStock || isUnselectable) return;
                        if (section.type === 'addon') {
                          toggleBeverage(addon.id, section.items, section.selectionLimit);
                        } else if (section.type === 'beverage' && !addonQuantities[addon.id]) {
                          handleAddonIncrement(addon.id, section);
                        }
                      }}
                      className={`relative flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${isSelected
                          ? 'border-[#00bd6f] bg-[#f4fdf8] shadow-[0_2px_10px_rgba(0,189,111,0.1)]'
                          : 'border-gray-200 bg-white'
                        } ${!addon.inStock || isUnselectable ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {/* Left: image thumbnail (no veg badge) */}
                      {addon.image ? (
                        <div className="relative w-[70px] h-[70px] rounded-xl overflow-hidden shrink-0">
                          <img loading="lazy" src={addon.image} alt={addon.name} className="w-full h-full object-cover" />
                        </div>
                      ) : null}

                      {/* Center: name + description */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[14px] font-bold text-gray-900 leading-tight">{addon.name}</h4>
                        {addon.description && (
                          <p className="text-[11px] text-gray-500 line-clamp-2 leading-snug mt-0.5">{addon.description}</p>
                        )}
                        {!addon.inStock && (
                          <span className="inline-block mt-1 text-[9px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-md uppercase tracking-wide">Out of Stock</span>
                        )}
                      </div>

                      {/* Right: price + action */}
                      {section.type === 'beverage' ? (
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <span className="text-[15px] font-bold text-gray-900 leading-none">₹{addon.price}</span>
                          {addon.inStock ? (
                            addonQuantities[addon.id] ? (
                              <div className="flex items-center justify-between bg-[#00bd6f] rounded-lg h-7 px-1 min-w-[64px] shadow-sm">
                                <button onClick={(e) => { e.stopPropagation(); handleAddonDecrement(addon.id); }} className="w-6 h-full flex items-center justify-center text-white active:scale-95">
                                  <Minus className="w-3.5 h-3.5 stroke-[3]" />
                                </button>
                                <span className="text-[12px] font-bold text-white">{addonQuantities[addon.id]}</span>
                                <button onClick={(e) => { e.stopPropagation(); handleAddonIncrement(addon.id, section); }} className="w-6 h-full flex items-center justify-center text-white active:scale-95">
                                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                                </button>
                              </div>
                            ) : (
                              <button
                                disabled={isUnselectable}
                                onClick={(e) => { e.stopPropagation(); handleAddonIncrement(addon.id, section); }}
                                className={`bg-white text-[#00bd6f] border border-[#00bd6f]/30 px-3 py-1 rounded-lg font-bold text-[12px] flex items-center gap-1 active:scale-95 transition-transform shadow-sm ${
                                  isUnselectable ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#f4fdf8]'
                                }`}
                              >
                                ADD
                              </button>
                            )
                          ) : (
                            <button disabled className="bg-gray-50 text-gray-400 border border-gray-200 px-3 py-1 rounded-lg font-bold text-[12px]">
                              ADD
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[15px] font-bold text-gray-900 leading-none">₹{addon.price}</span>
                          {/* Addon selection (Animated Checkbox matching custom styling) */}
                          <label
                            onClick={(e) => e.stopPropagation()}
                            className={`relative inline-block w-6 h-6 cursor-pointer select-none transition-transform duration-200 hover:scale-110 active:scale-85 ${
                              !addon.inStock || isUnselectable ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={!!selectedBeverages[addon.id]}
                              disabled={!addon.inStock || isUnselectable}
                              onChange={() => toggleBeverage(addon.id, section.items, section.selectionLimit)}
                              className="absolute opacity-0 w-0 h-0 peer"
                            />
                            <div className="absolute inset-0 bg-white border-2 border-gray-300 rounded-[8px] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] flex items-center justify-center peer-checked:bg-[#00bd6f] peer-checked:border-[#00bd6f] peer-checked:shadow-[0_2px_10px_rgba(0,189,111,0.4)] peer-focus-visible:outline-2 peer-focus-visible:outline-[#00bd6f] peer-focus-visible:outline-offset-2">
                              <svg
                                className="w-[65%] h-[65%] fill-none stroke-white stroke-[3.5] stroke-linecap-round stroke-linejoin-round"
                                style={{
                                  strokeDasharray: 24,
                                  strokeDashoffset: selectedBeverages[addon.id] ? 0 : 24,
                                  transition: 'stroke-dashoffset 0.3s ease 0.1s',
                                }}
                                viewBox="0 0 24 24"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </div>
                          </label>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Validation Error Toast */}
        {validationError && (
          <div className="absolute bottom-[88px] left-0 right-0 px-4 z-[80]">
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2 shadow-lg">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span className="text-[12px] font-semibold text-red-700">{validationError}</span>
            </div>
          </div>
        )}

        {/* Bottom Action Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-4">
            {/* Quantity Selector */}
            <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl h-14 px-3 min-w-[110px]">
              <button
                onClick={() => setMainQuantity(Math.max(1, mainQuantity - 1))}
                className="w-8 h-full flex items-center justify-center text-gray-600"
              >
                {mainQuantity === 1 ? <Trash2 className="w-4 h-4 text-red-500" /> : <Minus className="w-4 h-4 stroke-[3]" />}
              </button>
              <span className="text-[16px] font-bold text-gray-900">{mainQuantity}</span>
              <button
                onClick={() => setMainQuantity(mainQuantity + 1)}
                className="w-8 h-full flex items-center justify-center text-[#00bd6f]"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-[#00bd6f] text-white h-14 rounded-xl font-bold text-[16px] flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-sm"
            >
              Add to Cart • ₹{calculateTotalPrice()}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};
