import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Mic, 
  Plus, 
  MoreVertical, 
  ChevronDown,
  SlidersHorizontal,
  ArrowLeft,
  Camera,
  Check,
  CheckCircle2,
  Sparkles,
  X,
  ImageIcon,
  Trash2,
  PlusCircle,
  Flame,
  Trophy,
  ThumbsUp,
  Star,
  ChevronRight,
  Info,
  Layers,
  IndianRupee,
  UtensilsCrossed,
  Layout,
  PlusSquare,
  Hash,
  Award,
  Zap,
  Droplets,
  Leaf,
  Heart,
  Pencil,
  AlertCircle,
  Circle,
  Egg as EggIcon,
  Loader2
} from 'lucide-react';
import { VoiceSearchModal } from './VoiceSearchModal';

export interface MenuItem {
  id: number;
  itemCode?: string;
  name: string;
  category: string;
  subCategory?: string;
  description: string;
  price: number;
  isVeg: boolean;
  isAvailable: boolean;
  image: string;
  dietaryType?: 'Veg' | 'Non-Veg' | 'Egg';
  badges?: string[];
  allowedToppings?: string[];
  allowedAddons?: string[];
}

export const ALL_BADGES = [
  { id: 'bestseller', label: 'Bestseller', icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  { id: 'must-try', label: 'Must Try', icon: Star, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
  { id: 'spicy', label: 'Spicy', icon: Flame, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
  { id: 'sugar-free', label: 'Sugar Free', icon: Droplets, color: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-200' },
  { id: 'new-launch', label: 'New Launch', icon: Sparkles, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  { id: 'chef-special', label: 'Chef Special', icon: UtensilsCrossed, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200' },
  { id: 'recommended', label: 'Recommended', icon: ThumbsUp, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  { id: 'trending', label: 'Trending', icon: Zap, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
  { id: 'vegan', label: 'Vegan', icon: Leaf, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
  { id: 'healthy', label: 'Healthy', icon: Heart, color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-200' }
];

export const SAMPLE_ITEMS: MenuItem[] = [
  {
    id: 1,
    itemCode: 'PZ01',
    name: 'Margherita Pizza',
    category: 'Pizza',
    description: 'Classic delight with 100% real mozzarella cheese.',
    price: 199,
    isVeg: true,
    isAvailable: true,
    dietaryType: 'Veg',
    badges: ['bestseller'],
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 2,
    itemCode: 'PZ02',
    name: 'Farmhouse Pizza',
    category: 'Pizza',
    description: 'Delightful combination of onion, capsicum, tomato & grilled mushroom.',
    price: 399,
    isVeg: true,
    isAvailable: true,
    dietaryType: 'Veg',
    badges: ['must-try', 'healthy'],
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 3,
    itemCode: 'PZ03',
    name: 'Peppy Paneer Pizza',
    category: 'Pizza',
    description: 'Flavorful trio of juicy paneer, crisp capsicum with spicy red paprika.',
    price: 459,
    isVeg: true,
    isAvailable: true,
    dietaryType: 'Veg',
    badges: ['spicy'],
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 4,
    itemCode: 'PZ04',
    name: 'Chicken Tikka Pizza',
    category: 'Pizza',
    description: 'Traditional chicken tikka with onion, capsicum and mint mayo.',
    price: 499,
    isVeg: false,
    isAvailable: true,
    dietaryType: 'Non-Veg',
    badges: ['bestseller', 'chef-special'],
    image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 5,
    itemCode: 'PZ05',
    name: 'Pepperoni Pizza',
    category: 'Pizza',
    description: 'Classic American pizza with premium pork pepperoni.',
    price: 549,
    isVeg: false,
    isAvailable: false,
    dietaryType: 'Non-Veg',
    badges: ['trending'],
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 6,
    itemCode: 'PZ06',
    name: 'Veg Extravaganza',
    category: 'Pizza',
    description: 'Black olives, capsicum, onion, grilled mushroom, corn, tomato, jalapeno.',
    price: 499,
    isVeg: true,
    isAvailable: true,
    dietaryType: 'Veg',
    badges: ['recommended'],
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 7,
    itemCode: 'PZ07',
    name: 'BBQ Chicken Pizza',
    category: 'Pizza',
    description: 'Smoked BBQ chicken, onion, and jalapeno with a sweet & spicy sauce.',
    price: 529,
    isVeg: false,
    isAvailable: true,
    dietaryType: 'Non-Veg',
    badges: ['new-launch'],
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 8,
    itemCode: 'PZ08',
    name: 'Mushroom & Truffle',
    category: 'Pizza',
    description: 'Gourmet pizza with roasted mushrooms, truffle oil, and parmesan.',
    price: 649,
    isVeg: true,
    isAvailable: true,
    dietaryType: 'Veg',
    badges: ['chef-special'],
    image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 9,
    itemCode: 'PZ09',
    name: 'Spicy Chicken Sausage',
    category: 'Pizza',
    description: 'Chicken sausage, red paprika, and mint mayo on a thin crust.',
    price: 449,
    isVeg: false,
    isAvailable: true,
    dietaryType: 'Non-Veg',
    badges: ['spicy'],
    image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 10,
    itemCode: 'PZ10',
    name: 'Four Cheese Pizza',
    category: 'Pizza',
    description: 'Mozzarella, Cheddar, Gouda, and Parmesan cheese blend.',
    price: 599,
    isVeg: true,
    isAvailable: true,
    dietaryType: 'Veg',
    badges: ['must-try'],
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 11,
    itemCode: 'SD01',
    name: 'Garlic Breadsticks',
    category: 'Sides',
    description: 'Freshly baked garlic breadsticks with a cheesy dip.',
    price: 129,
    isVeg: true,
    isAvailable: true,
    dietaryType: 'Veg',
    badges: ['bestseller'],
    image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 12,
    itemCode: 'SD02',
    name: 'Stuffed Garlic Bread',
    category: 'Sides',
    description: 'Garlic bread stuffed with mozzarella cheese and sweet corn.',
    price: 169,
    isVeg: true,
    isAvailable: true,
    dietaryType: 'Veg',
    badges: ['must-try'],
    image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 13,
    itemCode: 'SD03',
    name: 'Chicken Wings (6 pcs)',
    category: 'Sides',
    description: 'Spicy roasted chicken wings served with ranch dip.',
    price: 249,
    isVeg: false,
    isAvailable: true,
    dietaryType: 'Non-Veg',
    badges: ['spicy', 'trending'],
    image: 'https://images.unsplash.com/photo-1569691899455-88464f6d3ab1?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 14,
    itemCode: 'SD04',
    name: 'French Fries',
    category: 'Sides',
    description: 'Crispy golden french fries salted to perfection.',
    price: 109,
    isVeg: true,
    isAvailable: true,
    dietaryType: 'Veg',
    badges: ['vegan'],
    image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 15,
    itemCode: 'SD05',
    name: 'Cheesy Jalapeno Dip',
    category: 'Sides',
    description: 'Creamy cheese dip with a spicy jalapeno kick.',
    price: 39,
    isVeg: true,
    isAvailable: true,
    dietaryType: 'Veg',
    badges: [],
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 16,
    itemCode: 'SD06',
    name: 'Potato Wedges',
    category: 'Sides',
    description: 'Oven-baked potato wedges with herbs and spices.',
    price: 139,
    isVeg: true,
    isAvailable: true,
    dietaryType: 'Veg',
    badges: ['vegan'],
    image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 17,
    itemCode: 'SD07',
    name: 'Chicken Meatballs',
    category: 'Sides',
    description: 'Juicy chicken meatballs in a tangy tomato sauce.',
    price: 199,
    isVeg: false,
    isAvailable: true,
    dietaryType: 'Non-Veg',
    badges: ['new-launch'],
    image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 18,
    itemCode: 'SD08',
    name: 'Choco Lava Cake',
    category: 'Sides',
    description: 'Chocolate cake with a gooey, molten chocolate center.',
    price: 119,
    isVeg: false,
    isAvailable: true,
    dietaryType: 'Egg',
    badges: ['bestseller'],
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 19,
    itemCode: 'BV01',
    name: 'Pepsi (500ml)',
    category: 'Beverages',
    description: 'Chilled Pepsi pet bottle.',
    price: 60,
    isVeg: true,
    isAvailable: true,
    dietaryType: 'Veg',
    badges: [],
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 20,
    itemCode: 'BV02',
    name: 'Diet Coke (330ml)',
    category: 'Beverages',
    description: 'Zero calorie cola in a can.',
    price: 60,
    isVeg: true,
    isAvailable: true,
    dietaryType: 'Veg',
    badges: ['sugar-free'],
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 21,
    itemCode: 'BV03',
    name: 'Cold Coffee',
    category: 'Beverages',
    description: 'Creamy and refreshing cold coffee.',
    price: 149,
    isVeg: true,
    isAvailable: true,
    dietaryType: 'Veg',
    badges: ['bestseller'],
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 22,
    itemCode: 'BV04',
    name: 'Lemon Iced Tea',
    category: 'Beverages',
    description: 'Refreshing iced tea with a hint of lemon.',
    price: 129,
    isVeg: true,
    isAvailable: true,
    dietaryType: 'Veg',
    badges: ['vegan'],
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 23,
    itemCode: 'BV05',
    name: 'Mango Smoothie',
    category: 'Beverages',
    description: 'Thick and creamy mango smoothie.',
    price: 179,
    isVeg: true,
    isAvailable: false,
    dietaryType: 'Veg',
    badges: ['must-try'],
    image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 24,
    itemCode: 'BV06',
    name: 'Mineral Water',
    category: 'Beverages',
    description: 'Packaged drinking water (1 Litre).',
    price: 40,
    isVeg: true,
    isAvailable: true,
    dietaryType: 'Veg',
    badges: [],
    image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 25,
    itemCode: 'BV07',
    name: 'Strawberry Milkshake',
    category: 'Beverages',
    description: 'Classic strawberry milkshake with ice cream.',
    price: 159,
    isVeg: true,
    isAvailable: true,
    dietaryType: 'Veg',
    badges: [],
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75bb699?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 26,
    itemCode: 'CB01',
    name: 'Meal for 2 (Veg)',
    category: 'Combos',
    description: '1 Medium Veg Pizza + 1 Garlic Bread + 2 Pepsi.',
    price: 699,
    isVeg: true,
    isAvailable: true,
    dietaryType: 'Veg',
    badges: ['bestseller'],
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 27,
    itemCode: 'CB02',
    name: 'Meal for 2 (Non-Veg)',
    category: 'Combos',
    description: '1 Medium Non-Veg Pizza + 1 Chicken Wings + 2 Pepsi.',
    price: 849,
    isVeg: false,
    isAvailable: true,
    dietaryType: 'Non-Veg',
    badges: ['recommended'],
    image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 28,
    itemCode: 'CB03',
    name: 'Family Feast',
    category: 'Combos',
    description: '2 Medium Pizzas + 2 Sides + 1 large Beverage.',
    price: 1299,
    isVeg: true,
    isAvailable: true,
    dietaryType: 'Veg',
    badges: ['trending'],
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 29,
    itemCode: 'CB04',
    name: 'Snack Combo',
    category: 'Combos',
    description: '1 Garlic Bread + 1 French Fries + 1 Dip.',
    price: 249,
    isVeg: true,
    isAvailable: true,
    dietaryType: 'Veg',
    badges: [],
    image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 30,
    itemCode: 'CB05',
    name: 'Party Combo',
    category: 'Combos',
    description: '4 Large Pizzas + 4 Sides + 4 Desserts + 4 Beverages.',
    price: 2999,
    isVeg: false,
    isAvailable: true,
    dietaryType: 'Non-Veg',
    badges: ['chef-special'],
    image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=500&q=80'
  }
];

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'pizza': return '🍕';
    case 'sides': return '🍟';
    case 'beverages': return '🥤';
    case 'combos': return '🍱';
    case 'desserts': return '🍰';
    default: return '';
  }
};

export const MenuView: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>(SAMPLE_ITEMS);
  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [showVoiceSearch, setShowVoiceSearch] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'edit'>('list');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [activeActionMenuId, setActiveActionMenuId] = useState<number | null>(null);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);
  
  const [categories, setCategories] = useState(['All Categories', 'Lunch', 'Dinner', 'Main Course', 'Toppings']);
  const [subCategories, setSubCategories] = useState(['All Sub Categories', 'Pizza', 'Sides', 'Beverages', 'Combos']);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAddMainCategoryOpen, setIsAddMainCategoryOpen] = useState(false);
  const [newMainCategoryName, setNewMainCategoryName] = useState('');
  const [isAddOptionsOpen, setIsAddOptionsOpen] = useState(false);
  
  const toggleAvailability = (id: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
    ));
  };

  const handleDeleteItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
    setItemToDelete(null);
  };

  const handleSaveItem = (item: any) => {
    if (viewMode === 'edit' && editingItem) {
      setItems(items.map(i => i.id === editingItem.id ? { ...item, id: editingItem.id } : i));
    } else {
      setItems([...items, { ...item, id: Date.now() }]);
    }
    setViewMode('list');
    setEditingItem(null);
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim() && !subCategories.includes(newCategoryName.trim())) {
      const newCats = [...subCategories];
      newCats.splice(1, 0, newCategoryName.trim());
      setSubCategories(newCats);
      setNewCategoryName('');
      setIsAddCategoryOpen(false);
    }
  };

  const handleAddMainCategory = () => {
    if (newMainCategoryName.trim() && !categories.includes(newMainCategoryName.trim())) {
      setCategories([...categories, newMainCategoryName.trim()]);
      setNewMainCategoryName('');
      setIsAddMainCategoryOpen(false);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesCategory = activeCategory === 'All Categories' || activeCategory === 'All Sub Categories' || item.subCategory === activeCategory || item.category === activeCategory;
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (item.itemCode && item.itemCode.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (viewMode === 'create' || viewMode === 'edit') {
    return (
      <CreateItemView 
        onBack={() => {
          setViewMode('list');
          setEditingItem(null);
        }} 
        categories={categories.filter(c => c !== 'All Categories')} 
        subCategories={subCategories.filter(c => c !== 'All Sub Categories')}
        initialItem={editingItem}
        onSave={handleSaveItem}
        allItems={items}
      />
    );
  }

  return (
    <div className="pb-32 px-6 pt-6 animate-in fade-in duration-500 bg-[#FFFFFF] min-h-screen font-sans relative lg:bg-transparent lg:px-0 lg:pt-0 lg:pb-10">
      
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" size={20} />
        <input 
          type="text" 
          placeholder="Search for dishes" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-[52px] bg-[#FFFFFF] border border-[#E5E7EB] text-[#111827] py-4 pl-12 pr-12 rounded-[16px] focus:outline-none focus:border-blue-500 text-[15px] font-medium transition-all"
        />
        <Mic 
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1E90FF] cursor-pointer" 
          size={20} 
          onClick={() => setShowVoiceSearch(true)}
        />
      </div>

      <VoiceSearchModal 
        isOpen={showVoiceSearch} 
        onClose={() => setShowVoiceSearch(false)} 
        onResult={(text) => setSearchQuery(text)}
      />

      {/* Category Filter Chips */}
      <div className="flex gap-[8px] overflow-x-auto no-scrollbar mb-3 -mx-6 px-6 lg:mx-0 lg:px-0 lg:flex-wrap">
        {categories.map(cat => (
          <button 
            key={`main-${cat}`}
            onClick={() => setActiveCategory(cat)}
            className={`h-[36px] px-[14px] rounded-[18px] text-[14px] font-medium whitespace-nowrap transition-all duration-300 flex-shrink-0 flex items-center gap-1.5 font-sans ${
              activeCategory === cat 
                ? 'bg-[#EFF6FF] text-[#1E90FF]' 
                : 'bg-[#FFFFFF] border border-[#E5E7EB] text-[#374151]'
            }`}
          >
            {getCategoryIcon(cat) && <span className="text-[18px] leading-none">{getCategoryIcon(cat)}</span>}
            {cat}
          </button>
        ))}
      </div>

      {/* Sub Category Filter Chips */}
      <div className="flex gap-[8px] overflow-x-auto no-scrollbar mb-6 -mx-6 px-6 lg:mx-0 lg:px-0 lg:flex-wrap">
        {subCategories.map(cat => (
          <button 
            key={`sub-${cat}`}
            onClick={() => setActiveCategory(cat)}
            className={`h-[36px] px-[14px] rounded-[18px] text-[14px] font-medium whitespace-nowrap transition-all duration-300 flex-shrink-0 flex items-center gap-1.5 font-sans ${
              activeCategory === cat 
                ? 'bg-[#EFF6FF] text-[#1E90FF]' 
                : 'bg-[#FFFFFF] border border-[#E5E7EB] text-[#374151]'
            }`}
          >
            {getCategoryIcon(cat) && <span className="text-[18px] leading-none">{getCategoryIcon(cat)}</span>}
            {cat}
          </button>
        ))}
      </div>

      {/* Add Sub Category Bottom Sheet */}
      {isAddCategoryOpen && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50 sm:items-center transition-opacity" onClick={() => setIsAddCategoryOpen(false)}>
          <div className="w-full bg-[#FFFFFF] rounded-t-2xl sm:rounded-2xl sm:max-w-sm p-6 animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:fade-in duration-300" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Add New Sub Category</h3>
            
            <div className="space-y-2 mb-6">
              <label className="text-[14px] font-medium text-[#374151]">Sub Category Name</label>
              <input 
                type="text" 
                placeholder="Enter sub category name" 
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                autoFocus
                className="w-full h-[44px] bg-[#FFFFFF] border border-[#E5E7EB] rounded-[10px] px-[12px] text-[14px] text-[#111827] focus:outline-none focus:border-[#1E90FF] transition-colors"
              />
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setIsAddCategoryOpen(false)}
                className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-semibold rounded-xl active:scale-95 transition-transform"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddCategory}
                disabled={!newCategoryName.trim()}
                className="flex-1 py-3 px-4 bg-[#1E90FF] text-white font-semibold rounded-xl active:scale-95 transition-transform disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Main Category Bottom Sheet */}
      {isAddMainCategoryOpen && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50 sm:items-center transition-opacity" onClick={() => setIsAddMainCategoryOpen(false)}>
          <div className="w-full bg-[#FFFFFF] rounded-t-2xl sm:rounded-2xl sm:max-w-sm p-6 animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:fade-in duration-300" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Add New Category</h3>
            
            <div className="space-y-2 mb-6">
              <label className="text-[14px] font-medium text-[#374151]">Category Name</label>
              <input 
                type="text" 
                placeholder="Enter category name" 
                value={newMainCategoryName}
                onChange={(e) => setNewMainCategoryName(e.target.value)}
                autoFocus
                className="w-full h-[44px] bg-[#FFFFFF] border border-[#E5E7EB] rounded-[10px] px-[12px] text-[14px] text-[#111827] focus:outline-none focus:border-[#1E90FF] transition-colors"
              />
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setIsAddMainCategoryOpen(false)}
                className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-semibold rounded-xl active:scale-95 transition-transform"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddMainCategory}
                disabled={!newMainCategoryName.trim()}
                className="flex-1 py-3 px-4 bg-[#1E90FF] text-white font-semibold rounded-xl active:scale-95 transition-transform disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Menu Item Cards */}
      <div className="grid grid-cols-2 gap-[14px] mb-8 lg:grid-cols-3 xl:grid-cols-4 lg:gap-6">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div key={item.id} className={`rounded-[16px] p-[8px] border border-[#E5E7EB] flex flex-col gap-2 transition-colors duration-300 ${item.isAvailable ? 'bg-[#FFFFFF]' : 'bg-slate-100 opacity-75 grayscale-[0.5]'}`}>
              {/* Image Section */}
              <div className="relative w-full h-[100px] rounded-[10px] overflow-hidden bg-slate-50 shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                
                {/* Veg/Non-Veg Icon */}
                <div className="absolute top-1.5 left-1.5 bg-[#FFFFFF] p-1 rounded-md shadow-sm">
                  <div className={`w-2.5 h-2.5 rounded-sm border flex items-center justify-center ${item.isVeg ? 'border-green-500' : 'border-red-500'}`}>
                    <div className={`w-1 h-1 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
                  </div>
                </div>

                {/* Rating Badge */}
                <div className="absolute bottom-1.5 right-1.5 bg-[#ECFDF5] text-[#065F46] px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                  <span className="text-[9px] font-medium">⭐ 4.3</span>
                </div>
              </div>

              {/* Content Section */}
              <div className="flex flex-col flex-1 px-1 pb-1">
                <div className="flex items-start justify-between gap-1 mb-1.5">
                  <h3 className="text-[14px] font-semibold text-[#111827] leading-tight flex-1 line-clamp-2">{item.name}</h3>
                  
                  {/* Action Menu */}
                  <div className="relative shrink-0">
                    <button 
                      onClick={() => setActiveActionMenuId(activeActionMenuId === item.id ? null : item.id)}
                      className="w-6 h-6 -mr-1 -mt-1 rounded-full hover:bg-slate-100 flex items-center justify-center text-[#6B7280] transition-colors"
                    >
                       <MoreVertical size={16} />
                    </button>
                    
                    {/* Action Menu Dropdown */}
                    {activeActionMenuId === item.id && (
                      <>
                        <div className="fixed inset-0 z-[100]" onClick={() => setActiveActionMenuId(null)} />
                        <div className="absolute right-0 mt-1 w-28 bg-[#FFFFFF] rounded-xl shadow-lg border border-[#E5E7EB] overflow-hidden z-[110] animate-in zoom-in-95 duration-200">
                           <button 
                             onClick={() => {
                               setEditingItem(item);
                               setViewMode('edit');
                               setActiveActionMenuId(null);
                             }}
                             className="w-full px-3 py-2 flex items-center gap-2 text-[#111827] hover:bg-slate-50 transition-colors text-[12px] font-medium"
                           >
                              <Pencil size={12} className="text-[#1E90FF]" /> Edit
                           </button>
                           <button 
                             onClick={() => {
                               setItemToDelete(item);
                               setActiveActionMenuId(null);
                             }}
                             className="w-full px-3 py-2 flex items-center gap-2 text-rose-500 hover:bg-rose-50 transition-colors text-[12px] font-medium border-t border-slate-50"
                           >
                              <Trash2 size={12} /> Delete
                           </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col gap-1 mt-auto">
                  <span className="text-[15px] font-bold text-[#111827]">₹{item.price}</span>
                  
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[9px] font-medium text-[#6B7280] uppercase tracking-wide">
                      {item.isAvailable ? 'IN STOCK' : 'OUT OF STOCK'}
                    </span>
                    <button 
                      onClick={() => toggleAvailability(item.id)}
                      className={`w-[32px] h-[18px] rounded-full p-[2px] transition-colors duration-300 relative shrink-0 ${item.isAvailable ? 'bg-[#1E90FF]' : 'bg-[#D1D5DB]'}`}
                    >
                      <div className={`w-[14px] h-[14px] bg-[#FFFFFF] rounded-full transform transition-transform duration-300 shadow-sm ${item.isAvailable ? 'translate-x-[14px]' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 lg:col-span-3 xl:col-span-4 py-20 text-center bg-[#FFFFFF] rounded-[18px] border border-dashed border-[#E5E7EB]">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#6B7280] shadow-sm">
                <Search size={24} />
             </div>
             <p className="text-[15px] font-medium text-[#111827]">No matching items</p>
             <p className="text-[13px] text-[#6B7280] mt-1">Try searching by a different name</p>
             {searchQuery && (
               <button 
                onClick={() => setSearchQuery('')}
                className="mt-4 text-[14px] font-medium text-[#1E90FF]"
               >
                 Clear Search
               </button>
             )}
          </div>
        )}
      </div>

      {/* Add Options Bottom Sheet */}
      {isAddOptionsOpen && (
        <div 
          className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50 sm:items-center transition-opacity"
          onClick={() => setIsAddOptionsOpen(false)}
        >
          <div 
            className="w-full bg-[#FFFFFF] rounded-t-2xl sm:rounded-2xl sm:max-w-sm p-6 animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:fade-in duration-300"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-slate-900 mb-6">What would you like to add?</h3>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => { setIsAddOptionsOpen(false); setViewMode('create'); }}
                className="w-full p-4 flex items-center gap-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-[#1E90FF] text-white flex items-center justify-center shrink-0 font-bold text-[16px]">
                  1
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Food Item</p>
                  <p className="text-sm text-slate-500">Add a new dish to your menu</p>
                </div>
              </button>

              <button 
                onClick={() => { setIsAddOptionsOpen(false); setIsAddMainCategoryOpen(true); }}
                className="w-full p-4 flex items-center gap-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-[#1E90FF] text-white flex items-center justify-center shrink-0 font-bold text-[16px]">
                  2
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Category</p>
                  <p className="text-sm text-slate-500">Create a new main category</p>
                </div>
              </button>

              <button 
                onClick={() => { setIsAddOptionsOpen(false); setIsAddCategoryOpen(true); }}
                className="w-full p-4 flex items-center gap-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-[#1E90FF] text-white flex items-center justify-center shrink-0 font-bold text-[16px]">
                  3
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Sub Category</p>
                  <p className="text-sm text-slate-500">Create a new sub category</p>
                </div>
              </button>
            </div>
            <button 
              onClick={() => setIsAddOptionsOpen(false)}
              className="w-full mt-4 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl active:scale-95 transition-transform"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Add Button */}
      <button 
        onClick={() => setIsAddOptionsOpen(true)}
        className="fixed bottom-[100px] right-6 lg:bottom-10 lg:right-10 z-50 px-6 h-[52px] bg-[#1E90FF] text-[#FFFFFF] rounded-[16px] font-semibold text-[16px] flex items-center justify-center shadow-lg active:scale-[0.98] transition-all"
      >
        <Plus size={20} className="mr-2" />
        Add
      </button>
    </div>
  );
};

const CreateItemView: React.FC<{ 
  onBack: () => void, 
  categories: string[],
  subCategories: string[],
  initialItem?: MenuItem | null,
  onSave: (item: any) => void,
  allItems: MenuItem[]
}> = ({ onBack, categories, subCategories, initialItem, onSave, allItems }) => {
  const [image, setImage] = useState<string | null>(initialItem?.image || null);
  const [isCropping, setIsCropping] = useState(false);
  const [name, setName] = useState(initialItem?.name || '');
  const [description, setDescription] = useState(initialItem?.description || '');
  const [dietaryType, setDietaryType] = useState<'Veg' | 'Non-Veg' | 'Egg'>(initialItem?.dietaryType || 'Veg');
  const [selectedTags, setSelectedTags] = useState<string[]>(initialItem?.badges || []);
  const [pricingType, setPricingType] = useState<'simple' | 'variety'>('simple');
  const [price, setPrice] = useState(initialItem?.price?.toString() || '');
  const [variants, setVariants] = useState<any[]>([]);
  const [isAvailable, setIsAvailable] = useState(initialItem?.isAvailable ?? true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // New states
  const [gstCategory, setGstCategory] = useState<'Freshly Prepared Item' | 'MRP Based Item'>('Freshly Prepared Item');
  const [gstIncluded, setGstIncluded] = useState(true);
  const [foodCategory, setFoodCategory] = useState(initialItem?.category || categories[0] || 'Pizza');
  const [subCategory, setSubCategory] = useState(initialItem?.subCategory || subCategories[0] || 'Pizza');
  const [enableAddons, setEnableAddons] = useState(initialItem?.allowedAddons && initialItem.allowedAddons.length > 0 ? true : false);
  const [selectedAddons, setSelectedAddons] = useState<string[]>(initialItem?.allowedAddons || []);
  
  const [enableToppings, setEnableToppings] = useState(initialItem?.allowedToppings && initialItem.allowedToppings.length > 0 ? true : false);
  const [selectedToppings, setSelectedToppings] = useState<string[]>(initialItem?.allowedToppings || []);

  const availableAddons = allItems.filter(item => item.category !== 'Toppings').map(item => item.name);
  const availableToppings = allItems.filter(item => item.category === 'Toppings').map(item => item.name);

  const toggleAddon = (addon: string) => {
    if (selectedAddons.includes(addon)) {
      setSelectedAddons(selectedAddons.filter(a => a !== addon));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const toggleTopping = (topping: string) => {
    if (selectedToppings.includes(topping)) {
      setSelectedToppings(selectedToppings.filter(t => t !== topping));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  const [enableServeInfo, setEnableServeInfo] = useState(false);
  const [servingSize, setServingSize] = useState('1-2');
  const [piecesInfo, setPiecesInfo] = useState<{name: string, count: string}[]>([]);
  const [availableFor, setAvailableFor] = useState<string[]>(['Delivery', 'Takeaway', 'Dine-In']);
  const [customTagInput, setCustomTagInput] = useState('');

  const servingSizeOptions = ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9', '9-10'];

  const tagsList = [
    'Best Seller', 'Spicy', 'Sugar Free', 'Chef Special', 'New', 
    'Recommended', 'Healthy', 'Popular', 'Kids Favourite', 'Limited Offer'
  ];

  const handleImageUpload = () => {
    // Simulate image picker
    setImage('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80');
    setIsCropping(true);
  };

  const handleCropComplete = () => {
    setIsCropping(false);
  };

  const handleSave = () => {
    setError('');
    if (!image && foodCategory !== 'Toppings') {
      setError('Food image is required');
      return;
    }
    if (!name.trim()) {
      setError('Food name is required');
      return;
    }
    
    setIsSaving(true);

    // If it's a topping, we don't need all the other fields
    if (foodCategory === 'Toppings') {
      setTimeout(() => {
        setIsSaving(false);
        onSave({
          name,
          category: foodCategory,
          subCategory,
          price: pricingType === 'simple' ? parseFloat(price) : 0,
          isAvailable,
          isVeg: dietaryType === 'Veg',
          dietaryType,
          image: image || '',
          description: '',
          badges: [],
          allowedToppings: [],
          allowedAddons: []
        });
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          onBack();
        }, 1500);
      }, 1000);
      return;
    }

    if (pricingType === 'simple' && !price) {
      setError('Price is required');
      setIsSaving(false);
      return;
    }
    if (pricingType === 'variety' && variants.length === 0) {
      setError('At least one variant is required');
      setIsSaving(false);
      return;
    }

    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => {
        onSave({
          name,
          category: foodCategory,
          subCategory,
          description,
          price: pricingType === 'simple' ? parseFloat(price) : parseFloat(variants[0]?.price || 0),
          isVeg: dietaryType === 'Veg',
          isAvailable,
          dietaryType,
          badges: selectedTags,
          image,
          allowedToppings: enableToppings ? selectedToppings : [],
          allowedAddons: enableAddons ? selectedAddons : []
        });
      }, 1500);
    }, 1000);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const addVariant = () => {
    setVariants([...variants, { id: Date.now().toString(), name: '', price: '' }]);
  };

  const updateVariant = (id: string, field: 'name' | 'price', value: string) => {
    setVariants(variants.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const removeVariant = (id: string) => {
    setVariants(variants.filter(v => v.id !== id));
  };

  const toggleAvailableFor = (option: string) => {
    setAvailableFor(prev => prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]);
  };

  const addPieceInfo = () => {
    setPiecesInfo([...piecesInfo, { name: '', count: '' }]);
  };

  const updatePieceInfo = (index: number, field: 'name' | 'count', value: string) => {
    const newPieces = [...piecesInfo];
    newPieces[index][field] = value;
    setPiecesInfo(newPieces);
  };

  const removePieceInfo = (index: number) => {
    setPiecesInfo(piecesInfo.filter((_, i) => i !== index));
  };

  const handleAddCustomTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && customTagInput.trim()) {
      e.preventDefault();
      if (!selectedTags.includes(customTagInput.trim())) {
        setSelectedTags([...selectedTags, customTagInput.trim()]);
      }
      setCustomTagInput('');
    }
  };

  const calculateFinalPrice = (basePrice: string) => {
    if (!basePrice) return 0;
    const numPrice = parseFloat(basePrice);
    if (isNaN(numPrice)) return 0;
    return gstIncluded ? numPrice : numPrice + (numPrice * 0.05);
  };

  if (isCropping) {
    return (
      <div className="fixed inset-0 z-[600] bg-black flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full aspect-square bg-slate-800 relative overflow-hidden">
            <img src={image!} alt="Crop preview" className="w-full h-full object-cover opacity-50" />
            <div className="absolute inset-4 border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]"></div>
          </div>
        </div>
        <div className="p-6 flex gap-4 bg-black">
          <button onClick={() => setIsCropping(false)} className="flex-1 h-[52px] bg-slate-50 text-slate-700 rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all">Cancel</button>
        <button onClick={handleCropComplete} className="flex-1 h-[52px] bg-[#1E90FF] text-[#FFFFFF] rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all">Crop Image</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[500] flex items-end justify-center bg-black/50 sm:items-center transition-opacity" onClick={onBack}>
      <div className="w-full h-[90vh] bg-[#FFFFFF] rounded-t-2xl sm:rounded-2xl sm:max-w-2xl flex flex-col animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:fade-in duration-300 relative overflow-hidden" onClick={e => e.stopPropagation()}>
      {showSuccess && (
        <div className="absolute top-4 left-4 right-4 z-50 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-2 shadow-lg animate-in slide-in-from-top">
          <CheckCircle2 size={20} />
          <span className="font-medium text-sm">Food item added successfully.</span>
        </div>
      )}

      <div className="px-4 py-4 flex items-center gap-3 bg-[#FFFFFF] border-b border-slate-100 sticky top-0 z-40 shrink-0">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center text-slate-700 active:bg-slate-50 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-[20px] font-[600] text-slate-900">Add Food Item</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-32 lg:pb-6">
        {error && (
          <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-sm font-medium flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* Image Upload Section */}
        {foodCategory !== 'Toppings' && (
          <div 
            onClick={handleImageUpload}
            className="h-[180px] rounded-[16px] border border-dashed border-[#D1D5DB] bg-[#F9FAFB] flex flex-col items-center justify-center gap-3 relative overflow-hidden active:bg-slate-50 transition-colors"
          >
            {image ? (
              <img src={image} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <>
                <div className="w-12 h-12 bg-[#FFFFFF] rounded-full shadow-sm flex items-center justify-center text-slate-400">
                  <ImageIcon size={24} />
                </div>
                <span className="text-sm font-medium text-slate-600">Upload Food Image</span>
              </>
            )}
          </div>
        )}

        {/* Food Item Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">{foodCategory === 'Toppings' ? 'Topping Name' : 'Food Name'}</label>
          <input 
            type="text" 
            placeholder={foodCategory === 'Toppings' ? 'Enter topping name' : 'Enter food item name'} 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-[44px] rounded-[10px] border border-[#E5E7EB] px-[12px] text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>

        {foodCategory !== 'Toppings' && (
          <>
            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Description</label>
              <textarea 
                placeholder="Write a short description about the dish" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-[90px] rounded-[10px] border border-[#E5E7EB] p-[12px] text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
              />
            </div>
          </>
        )}

        {/* Main Category */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Main Category</label>
          <select
            value={foodCategory}
            onChange={(e) => setFoodCategory(e.target.value)}
            className="w-full h-[44px] rounded-[10px] border border-[#E5E7EB] px-[12px] text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-[#FFFFFF]"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Sub Category */}
        {foodCategory !== 'Toppings' && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Sub Category</label>
            <select
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              className="w-full h-[44px] rounded-[10px] border border-[#E5E7EB] px-[12px] text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-[#FFFFFF]"
            >
              {subCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        )}

        {foodCategory !== 'Toppings' && (
          <>
            {/* GST Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">GST Category</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                  <input 
                    type="radio" 
                    checked={gstCategory === 'Freshly Prepared Item'} 
                    onChange={() => setGstCategory('Freshly Prepared Item')}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  Freshly Prepared Item
                </label>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                  <input 
                    type="radio" 
                    checked={gstCategory === 'MRP Based Item'} 
                    onChange={() => setGstCategory('MRP Based Item')}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  MRP Based Item
                </label>
              </div>
            </div>

            {/* Food Type Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Food Type</label>
              <div className="flex gap-3">
                <button 
                  onClick={() => setDietaryType('Veg')}
                  className={`flex-1 h-[44px] rounded-[10px] border flex items-center justify-center gap-2 text-sm font-medium transition-colors ${dietaryType === 'Veg' ? 'border-green-500 bg-green-50 text-green-700' : 'border-[#E5E7EB] text-slate-600'}`}
                >
                  <div className="w-3 h-3 rounded-sm border border-green-600 flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-green-600" /></div>
                  Veg
                </button>
                <button 
                  onClick={() => setDietaryType('Non-Veg')}
                  className={`flex-1 h-[44px] rounded-[10px] border flex items-center justify-center gap-2 text-sm font-medium transition-colors ${dietaryType === 'Non-Veg' ? 'border-red-500 bg-red-50 text-red-700' : 'border-[#E5E7EB] text-slate-600'}`}
                >
                  <div className="w-3 h-3 rounded-sm border border-red-600 flex items-center justify-center"><div className="w-0 h-0 border-l-[3px] border-r-[3px] border-b-[5px] border-l-transparent border-r-transparent border-b-red-600" /></div>
                  Non-Veg
                </button>
                <button 
                  onClick={() => setDietaryType('Egg')}
                  className={`flex-1 h-[44px] rounded-[10px] border flex items-center justify-center gap-2 text-sm font-medium transition-colors ${dietaryType === 'Egg' ? 'border-yellow-500 bg-yellow-50 text-yellow-700' : 'border-[#E5E7EB] text-slate-600'}`}
                >
                  <div className="w-3 h-3 rounded-sm border border-yellow-500 flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-yellow-500" /></div>
                  Egg
                </button>
              </div>
            </div>

            {/* Food Tags */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Food Tags</label>
              <input 
                type="text" 
                placeholder="Type a tag and press Enter" 
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                onKeyDown={handleAddCustomTag}
                className="w-full h-[44px] rounded-[10px] border border-[#E5E7EB] px-[12px] text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all mb-2"
              />
              <div className="flex flex-wrap gap-2">
                {[...new Set([...tagsList, ...selectedTags])].map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`h-[32px] px-4 rounded-[16px] border text-sm transition-colors ${
                      selectedTags.includes(tag) 
                        ? 'bg-[#1E90FF] border-[#1E90FF] text-white' 
                        : 'bg-[#FFFFFF] border-[#E5E7EB] text-slate-600'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Pricing Section */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-slate-900">Pricing</h3>
          
          {foodCategory !== 'Toppings' && (
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                <input 
                  type="radio" 
                  checked={pricingType === 'simple'} 
                  onChange={() => setPricingType('simple')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                Simple Price
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                <input 
                  type="radio" 
                  checked={pricingType === 'variety'} 
                  onChange={() => setPricingType('variety')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                Price by Variety
              </label>
            </div>
          )}

          {pricingType === 'simple' || foodCategory === 'Toppings' ? (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Price</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
                <input 
                  type="number" 
                  placeholder="250" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full h-[44px] rounded-[10px] border border-[#E5E7EB] pl-8 pr-[12px] text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input 
                  type="checkbox" 
                  checked={gstIncluded} 
                  onChange={(e) => setGstIncluded(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label className="text-sm text-slate-600">GST Included</label>
              </div>
              {price && (
                <p className="text-sm text-slate-500 mt-1">
                  Final Price: ₹{calculateFinalPrice(price).toFixed(2)} (incl. GST)
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex text-sm font-medium text-slate-500 px-1">
                <div className="flex-1">Variant Name</div>
                <div className="w-24">Price</div>
                <div className="w-8"></div>
              </div>
              
              {variants.map((variant) => (
                <div key={variant.id} className="flex flex-col gap-2">
                  <div className="flex gap-2 items-center">
                    <input 
                      type="text" 
                      placeholder="e.g. Small" 
                      value={variant.name}
                      onChange={(e) => updateVariant(variant.id, 'name', e.target.value)}
                      className="flex-1 h-[44px] rounded-[10px] border border-[#E5E7EB] px-[12px] text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                    <div className="relative w-24">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
                      <input 
                        type="number" 
                        placeholder="0" 
                        value={variant.price}
                        onChange={(e) => updateVariant(variant.id, 'price', e.target.value)}
                        className="w-full h-[44px] rounded-[10px] border border-[#E5E7EB] pl-7 pr-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      />
                    </div>
                    <button onClick={() => removeVariant(variant.id)} className="w-8 h-[44px] flex items-center justify-center text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  {variant.price && (
                    <p className="text-xs text-slate-500 ml-1">
                      Final Price: ₹{calculateFinalPrice(variant.price).toFixed(2)} (incl. GST)
                    </p>
                  )}
                </div>
              ))}
              
              <div className="flex items-center gap-2 mt-2">
                <input 
                  type="checkbox" 
                  checked={gstIncluded} 
                  onChange={(e) => setGstIncluded(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label className="text-sm text-slate-600">GST Included for all variants</label>
              </div>

              <button 
                onClick={addVariant}
                className="text-sm font-medium text-blue-600 flex items-center gap-1 py-2"
              >
                <Plus size={16} /> Add Variant
              </button>
            </div>
          )}
        </div>

        {/* Add-ons Section */}
        {foodCategory !== 'Toppings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-t border-slate-100">
              <label className="text-sm font-medium text-slate-700">Enable Add-ons</label>
              <button 
                onClick={() => setEnableAddons(!enableAddons)}
                className={`w-[32px] h-[18px] rounded-full p-[2px] transition-colors duration-300 relative shrink-0 ${enableAddons ? 'bg-[#1E90FF]' : 'bg-[#D1D5DB]'}`}
              >
                <div className={`w-[14px] h-[14px] bg-[#FFFFFF] rounded-full transform transition-transform duration-300 shadow-sm ${enableAddons ? 'translate-x-[14px]' : 'translate-x-0'}`} />
              </button>
            </div>

            {enableAddons && (
              <div className="space-y-2 p-4 bg-slate-50 rounded-[12px] border border-slate-100">
                <label className="text-sm font-medium text-slate-700">Select Add-ons</label>
                <div className="flex flex-wrap gap-2">
                  {availableAddons.length > 0 ? availableAddons.map(addon => (
                    <button
                      key={addon}
                      onClick={() => toggleAddon(addon)}
                      className={`h-[32px] px-4 rounded-[16px] border text-sm transition-colors ${
                        selectedAddons.includes(addon) 
                          ? 'bg-[#1E90FF] border-[#1E90FF] text-white' 
                          : 'bg-[#FFFFFF] border-[#E5E7EB] text-slate-600'
                      }`}
                    >
                      {addon}
                    </button>
                  )) : (
                    <p className="text-sm text-slate-500">No add-ons available in menu.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Toppings Section */}
        {foodCategory !== 'Toppings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-t border-slate-100">
              <label className="text-sm font-medium text-slate-700">Enable Toppings</label>
              <button 
                onClick={() => setEnableToppings(!enableToppings)}
                className={`w-[32px] h-[18px] rounded-full p-[2px] transition-colors duration-300 relative shrink-0 ${enableToppings ? 'bg-[#1E90FF]' : 'bg-[#D1D5DB]'}`}
              >
                <div className={`w-[14px] h-[14px] bg-[#FFFFFF] rounded-full transform transition-transform duration-300 shadow-sm ${enableToppings ? 'translate-x-[14px]' : 'translate-x-0'}`} />
              </button>
            </div>

            {enableToppings && (
              <div className="space-y-2 p-4 bg-slate-50 rounded-[12px] border border-slate-100">
                <label className="text-sm font-medium text-slate-700">Select Toppings</label>
                <div className="flex flex-wrap gap-2">
                  {availableToppings.length > 0 ? availableToppings.map(topping => (
                    <button
                      key={topping}
                      onClick={() => toggleTopping(topping)}
                      className={`h-[32px] px-4 rounded-[16px] border text-sm transition-colors ${
                        selectedToppings.includes(topping) 
                          ? 'bg-[#1E90FF] border-[#1E90FF] text-white' 
                          : 'bg-[#FFFFFF] border-[#E5E7EB] text-slate-600'
                      }`}
                    >
                      {topping}
                    </button>
                  )) : (
                    <p className="text-sm text-slate-500">No toppings available in menu.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Serve Info Section */}
        {foodCategory !== 'Toppings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-t border-slate-100">
              <label className="text-sm font-medium text-slate-700">Enable Serve Info</label>
              <button 
                onClick={() => setEnableServeInfo(!enableServeInfo)}
                className={`w-[32px] h-[18px] rounded-full p-[2px] transition-colors duration-300 relative shrink-0 ${enableServeInfo ? 'bg-[#1E90FF]' : 'bg-[#D1D5DB]'}`}
              >
                <div className={`w-[14px] h-[14px] bg-[#FFFFFF] rounded-full transform transition-transform duration-300 shadow-sm ${enableServeInfo ? 'translate-x-[14px]' : 'translate-x-0'}`} />
              </button>
            </div>

            {enableServeInfo && (
              <div className="space-y-4 p-4 bg-slate-50 rounded-[12px] border border-slate-100">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Serving Size</label>
                  <select
                    value={servingSize}
                    onChange={(e) => setServingSize(e.target.value)}
                    className="w-full h-[44px] rounded-[10px] border border-[#E5E7EB] px-[12px] text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-[#FFFFFF]"
                  >
                    {servingSizeOptions.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-700">Pieces Info</label>
                  {piecesInfo.map((piece, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input 
                        type="text" 
                        placeholder="Item Name (e.g. Chicken)" 
                        value={piece.name}
                        onChange={(e) => updatePieceInfo(index, 'name', e.target.value)}
                        className="flex-1 h-[44px] rounded-[10px] border border-[#E5E7EB] px-[12px] text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-[#FFFFFF]"
                      />
                      <input 
                        type="number" 
                        placeholder="Count" 
                        value={piece.count}
                        onChange={(e) => updatePieceInfo(index, 'count', e.target.value)}
                        className="w-24 h-[44px] rounded-[10px] border border-[#E5E7EB] px-[12px] text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-[#FFFFFF]"
                      />
                      <button onClick={() => removePieceInfo(index)} className="w-8 h-[44px] flex items-center justify-center text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                  
                  <button 
                    onClick={addPieceInfo}
                    className="text-sm font-medium text-blue-600 flex items-center gap-1 py-1"
                  >
                    <Plus size={16} /> Add More
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Item Availability */}
        {foodCategory !== 'Toppings' && (
          <div className="space-y-2 border-t border-slate-100 pt-4">
            <label className="text-sm font-medium text-slate-700">Available For</label>
            <div className="flex flex-wrap gap-2">
              {['Delivery', 'Takeaway', 'Dine-In'].map(option => (
                <button
                  key={option}
                  onClick={() => toggleAvailableFor(option)}
                  className={`h-[32px] px-4 rounded-[16px] border text-sm transition-colors ${
                    availableFor.includes(option) 
                      ? 'bg-[#1E90FF] border-[#1E90FF] text-white' 
                      : 'bg-[#FFFFFF] border-[#E5E7EB] text-slate-600'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Availability Toggle */}
        <div className="flex items-center justify-between py-2 border-t border-slate-100">
          <label className="text-sm font-medium text-slate-700">Active Status</label>
          <button 
            onClick={() => setIsAvailable(!isAvailable)}
            className={`w-[32px] h-[18px] rounded-full p-[2px] transition-colors duration-300 relative shrink-0 ${isAvailable ? 'bg-[#1E90FF]' : 'bg-[#D1D5DB]'}`}
          >
            <div className={`w-[14px] h-[14px] bg-[#FFFFFF] rounded-full transform transition-transform duration-300 shadow-sm ${isAvailable ? 'translate-x-[14px]' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Live Preview Card */}
        {foodCategory !== 'Toppings' && (
          <div className="space-y-2 border-t border-slate-100 pt-4">
            <label className="text-sm font-medium text-slate-700">Live Preview</label>
            <div className={`rounded-[16px] p-[8px] border border-[#E5E7EB] flex flex-col gap-2 transition-colors duration-300 ${isAvailable ? 'bg-[#FFFFFF]' : 'bg-slate-100 opacity-75 grayscale-[0.5]'}`}>
              {/* Image Section */}
              <div className="relative w-full h-[100px] rounded-[10px] overflow-hidden bg-slate-50 shrink-0">
                {image ? (
                  <img src={image} alt={name || 'Preview'} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <ImageIcon size={24} />
                  </div>
                )}
                
                {/* Veg/Non-Veg Icon */}
                <div className="absolute top-1.5 left-1.5 bg-[#FFFFFF] p-1 rounded-md shadow-sm">
                  {dietaryType === 'Veg' && (
                    <div className="w-2.5 h-2.5 rounded-sm border border-green-500 flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-green-500" />
                    </div>
                  )}
                  {dietaryType === 'Non-Veg' && (
                    <div className="w-2.5 h-2.5 rounded-sm border border-red-500 flex items-center justify-center">
                      <div className="w-0 h-0 border-l-[2px] border-r-[2px] border-b-[4px] border-l-transparent border-r-transparent border-b-red-500" />
                    </div>
                  )}
                  {dietaryType === 'Egg' && (
                    <div className="w-2.5 h-2.5 rounded-sm border border-yellow-500 flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-yellow-500" />
                    </div>
                  )}
                </div>
              </div>

              {/* Content Section */}
              <div className="flex flex-col flex-1 px-1 pb-1">
                <div className="flex items-start justify-between gap-1 mb-1.5">
                  <h3 className="text-[14px] font-semibold text-[#111827] leading-tight flex-1 line-clamp-2">
                    {name || 'Food Item Name'}
                  </h3>
                </div>
                
                <p className="text-[11px] text-[#6B7280] line-clamp-2 mb-2">
                  {description || 'Short description of the food item will appear here.'}
                </p>
                
                {selectedTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {selectedTags.slice(0, 2).map((tag, index) => (
                      <span key={index} className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-medium border border-blue-100">
                        {tag}
                      </span>
                    ))}
                    {selectedTags.length > 2 && (
                      <span className="px-1.5 py-0.5 bg-slate-50 text-slate-600 rounded text-[9px] font-medium border border-slate-200">
                        +{selectedTags.length - 2}
                      </span>
                    )}
                  </div>
                )}
                
                <div className="flex flex-col gap-1 mt-auto">
                  <span className="text-[15px] font-bold text-[#111827]">
                    ₹{pricingType === 'simple' ? (calculateFinalPrice(price) || 0).toFixed(2) : (variants[0] ? calculateFinalPrice(variants[0].price).toFixed(2) : '0.00')}
                  </span>
                  
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[9px] font-medium text-[#6B7280] uppercase tracking-wide">
                      {isAvailable ? 'IN STOCK' : 'OUT OF STOCK'}
                    </span>
                    <button className="h-[24px] px-3 bg-[#1E90FF] text-white text-[11px] font-semibold rounded-full flex items-center justify-center shadow-sm">
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-[#FFFFFF] border-t border-slate-100 flex gap-3">
        <button 
          onClick={onBack}
          className="flex-1 h-[52px] rounded-[16px] font-semibold text-[16px] flex items-center justify-center transition-all bg-slate-100 text-slate-700 active:scale-[0.98]"
        >
          Cancel
        </button>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className={`flex-1 h-[52px] rounded-[16px] font-semibold text-[16px] flex items-center justify-center transition-all ${isSaving ? 'bg-blue-400 text-white' : 'bg-[#1E90FF] text-[#FFFFFF] active:scale-[0.98]'}`}
        >
          {isSaving ? <Loader2 className="animate-spin" size={24} /> : 'Save Food Item'}
        </button>
      </div>
    </div>
  </div>
);
};