import React from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { MenuItem } from '@/types';
import { MenuItemCard } from '@/features/restaurant/components/MenuItemCard';

export interface CustomMenuSection {
  menuId: string;
  name: string;
  itemCount?: number;
  items: MenuItem[];
}

interface Category {
  name: string;
  count: number;
}

interface RestaurantMenuListProps {
  customMenus?: CustomMenuSection[];
  filteredMenu: MenuItem[];
  categories: Category[];
  expandedCategories: Record<string, boolean>;
  toggleCategory: (categoryName: string) => void;
  getItemQuantity: (id: string) => number;
  handleAdd: (id: string) => void;
  handleRemove: (id: string) => void;
  onItemClick: (item: MenuItem) => void;
}

export const RestaurantMenuList: React.FC<RestaurantMenuListProps> = ({
  customMenus = [],
  filteredMenu,
  expandedCategories,
  toggleCategory,
  getItemQuantity,
  handleAdd,
  handleRemove,
  onItemClick
}) => {
  if (filteredMenu.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Search className="w-12 h-12 text-slate-300 mb-4" />
        <h3 className="text-lg font-bold text-slate-900 mb-1">Search item is not available</h3>
        <p className="text-sm text-slate-500">Try searching for something else or clear filters.</p>
      </div>
    );
  }

  const filteredItemIds = new Set(filteredMenu.map((i) => i.id));

  return (
    <div className="space-y-6">
      {/* 1. Custom Menu Sections (Show menu items first in arranged order with menu name) */}
      {customMenus.map((menu) => {
        const isExpanded = expandedCategories[menu.name] !== false;
        // Keep arranged order of items in this menu while respecting active filters
        const sectionItems = (menu.items || []).filter((item) => filteredItemIds.has(item.id));

        if (sectionItems.length === 0) return null;

        return (
          <div
            key={`custom-${menu.menuId || menu.name}`}
            data-menu-section={menu.name}
            className="border-b border-gray-100 pb-6 last:border-0 scroll-mt-24"
          >
            <button
              onClick={() => toggleCategory(menu.name)}
              className="w-full flex items-center justify-between px-4 py-4 bg-gray-50/50 rounded-xl mb-4"
            >
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <h3 className="text-[18px] font-bold text-gray-900">{menu.name}</h3>
                </div>
                <p className="text-[13px] text-gray-500 font-medium mt-0.5">{sectionItems.length} items</p>
              </div>
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {isExpanded && (
              <div className="flex flex-col gap-4 pb-4 px-4 -mx-4">
                {sectionItems.map((item) => (
                  <MenuItemCard
                    key={`custom-${menu.name}-${item.id}`}
                    item={item}
                    getItemQuantity={getItemQuantity}
                    handleAdd={handleAdd}
                    handleRemove={handleRemove}
                    onItemClick={onItemClick}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
