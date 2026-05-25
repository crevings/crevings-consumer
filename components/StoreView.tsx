import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Search, 
  Plus, 
  Minus, 
  ChevronRight,
  X,
  MapPin,
  Clock,
  Package,
  History
} from 'lucide-react';

// Types
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  bulkLabel?: string;
  bulkPricing?: { range: string; price: number }[];
  images?: string[];
}

const STORE_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Branded Sealing Tape',
    category: 'Tapes & Labels',
    price: 150,
    description: 'High-quality sealing tape with Crevings branding. Ensures secure packaging for all your delivery orders.',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop',
    bulkLabel: '₹120 (Pack of 50)',
    bulkPricing: [
      { range: '1-10 units', price: 150 },
      { range: '11-50 units', price: 120 },
      { range: '51+ units', price: 100 }
    ],
    images: [
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop'
    ]
  },
  {
    id: 'p2',
    name: 'Eco-Friendly Meal Boxes',
    category: 'Packaging',
    price: 450,
    description: 'Compostable and leak-proof meal containers. Perfect for curries and rice dishes.',
    image: 'https://images.unsplash.com/photo-1620455805821-1d2f0f9b600d?q=80&w=600&auto=format&fit=crop',
    bulkLabel: '₹400 (Pack of 100)',
    bulkPricing: [
      { range: '1-5 packs', price: 450 },
      { range: '6-20 packs', price: 400 },
      { range: '21+ packs', price: 350 }
    ],
    images: [
      'https://images.unsplash.com/photo-1620455805821-1d2f0f9b600d?q=80&w=600&auto=format&fit=crop'
    ]
  },
  {
    id: 'p3',
    name: 'Chef Apron - Black',
    category: 'Staff Uniforms',
    price: 350,
    description: 'Durable cotton-blend apron with adjustable neck strap and deep front pockets.',
    image: 'https://images.unsplash.com/photo-1583947582995-14197395066a?q=80&w=600&auto=format&fit=crop',
    bulkLabel: '₹300 (Pack of 10)',
    bulkPricing: [
      { range: '1-5 units', price: 350 },
      { range: '6-20 units', price: 300 }
    ],
    images: [
      'https://images.unsplash.com/photo-1583947582995-14197395066a?q=80&w=600&auto=format&fit=crop'
    ]
  },
  {
    id: 'p4',
    name: 'Heavy Duty Trash Bags',
    category: 'Cleaning Essentials',
    price: 250,
    description: 'Tear-resistant, large capacity trash bags for commercial kitchen use.',
    image: 'https://images.unsplash.com/photo-1626245100659-009149024f2b?q=80&w=600&auto=format&fit=crop',
    bulkLabel: '₹200 (Pack of 50)',
    bulkPricing: [
      { range: '1-10 packs', price: 250 },
      { range: '11+ packs', price: 200 }
    ],
    images: [
      'https://images.unsplash.com/photo-1626245100659-009149024f2b?q=80&w=600&auto=format&fit=crop'
    ]
  },
  {
    id: 'p5',
    name: 'Paper Carry Bags (Medium)',
    category: 'Packaging',
    price: 300,
    description: 'Sturdy kraft paper bags with twisted handles. Holds up to 3kg.',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600&auto=format&fit=crop',
    bulkLabel: '₹250 (Pack of 100)',
    bulkPricing: [
      { range: '1-10 packs', price: 300 },
      { range: '11+ packs', price: 250 }
    ],
    images: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600&auto=format&fit=crop'
    ]
  },
  {
    id: 'p6',
    name: 'Kitchen Towels',
    category: 'Kitchen Supplies',
    price: 180,
    description: 'Highly absorbent, lint-free cotton towels for professional kitchens.',
    image: 'https://images.unsplash.com/photo-1584835848805-728b990e1186?q=80&w=600&auto=format&fit=crop',
    bulkLabel: '₹150 (Pack of 12)',
    bulkPricing: [
      { range: '1-5 packs', price: 180 },
      { range: '6+ packs', price: 150 }
    ],
    images: [
      'https://images.unsplash.com/photo-1584835848805-728b990e1186?q=80&w=600&auto=format&fit=crop'
    ]
  }
];

const CATEGORIES = [
  'All',
  'Packaging',
  'Tapes & Labels',
  'Kitchen Supplies',
  'Staff Uniforms',
  'Cleaning Essentials',
  'Cooking Materials'
];

export const StoreView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [view, setView] = useState<'store' | 'product' | 'cart' | 'history'>('store');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<{ [id: string]: number }>({});
  const [orderType, setOrderType] = useState<'standard' | 'express'>('standard');

  const filteredProducts = useMemo(() => {
    return STORE_PRODUCTS.filter(p => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const cartItemCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const getProductPrice = (product: Product, quantity: number) => {
    if (!product.bulkPricing) return product.price;
    
    // Simple logic: if quantity >= 11, use second tier, if >= 51 use third tier
    // In a real app, this would parse the range string
    if (quantity >= 51 && product.bulkPricing.length > 2) return product.bulkPricing[2].price;
    if (quantity >= 11 && product.bulkPricing.length > 1) return product.bulkPricing[1].price;
    return product.bulkPricing[0].price;
  };

  const cartTotal = Object.entries(cart).reduce((total, [id, qty]) => {
    const product = STORE_PRODUCTS.find(p => p.id === id);
    if (!product) return total;
    return total + (getProductPrice(product, qty) * qty);
  }, 0);

  const deliveryCharge = orderType === 'express' ? 150 : (cartTotal > 1000 ? 0 : 50);

  const handleUpdateCart = (id: string, delta: number) => {
    setCart(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      const newCart = { ...prev };
      if (next === 0) {
        delete newCart[id];
      } else {
        newCart[id] = next;
      }
      return newCart;
    });
  };

  const renderProductCard = (product: Product) => {
    const qty = cart[product.id] || 0;
    
    return (
      <div 
        key={product.id} 
        className="bg-[#FFFFFF] rounded-[16px] p-2 border border-[#E5E7EB] flex flex-col cursor-pointer"
        onClick={() => {
          setSelectedProduct(product);
          setView('product');
        }}
      >
        <div className="relative w-full aspect-square rounded-[10px] overflow-hidden bg-slate-50 shrink-0">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>
        
        <div className="flex flex-col flex-1 mt-2">
          <h3 className="text-[13px] font-semibold text-[#111827] leading-tight line-clamp-2">
            {product.name}
          </h3>
          <p className="text-[11px] text-[#6B7280] line-clamp-1 mt-1">
            {product.description}
          </p>
          
          <div className="mt-auto pt-2">
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-bold text-[#111827]">₹{product.price}</span>
            </div>
            {product.bulkLabel && (
              <div className="inline-block mt-1 px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-medium">
                {product.bulkLabel}
              </div>
            )}
            
            <div className="mt-3" onClick={e => e.stopPropagation()}>
              {qty === 0 ? (
                <button 
                  onClick={() => handleUpdateCart(product.id, 1)}
                  className="w-full h-[32px] bg-[#1E90FF] text-white rounded-[8px] text-[12px] font-medium flex items-center justify-center transition-colors active:bg-blue-700"
                >
                  Add
                </button>
              ) : (
                <div className="w-full h-[32px] bg-blue-50 rounded-[8px] flex items-center justify-between px-1 border border-blue-100">
                  <button 
                    onClick={() => handleUpdateCart(product.id, -1)}
                    className="w-7 h-7 flex items-center justify-center text-blue-600 rounded-md hover:bg-[#FFFFFF] transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-[13px] font-semibold text-blue-700">{qty}</span>
                  <button 
                    onClick={() => handleUpdateCart(product.id, 1)}
                    className="w-7 h-7 flex items-center justify-center text-blue-600 rounded-md hover:bg-[#FFFFFF] transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (view === 'cart') {
    return (
      <div className="min-h-screen bg-[#FFFFFF] flex flex-col">
        {/* Header */}
        <div className="bg-[#FFFFFF] border-b border-[#E5E7EB] px-4 h-[60px] flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setView('store')} className="p-2 -ml-2 text-[#111827]">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-[18px] font-bold text-[#111827]">Cart</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
          {cartItemCount === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                <ShoppingCart size={24} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Your cart is empty</h3>
              <p className="text-sm text-slate-500 mt-1">Add some operational supplies to get started.</p>
              <button 
                onClick={() => setView('store')}
                className="mt-6 px-6 h-[44px] bg-[#1E90FF] text-white rounded-[10px] font-medium"
              >
                Browse Store
              </button>
            </div>
          ) : (
            <>
              {/* Delivery Address */}
              <div className="bg-[#FFFFFF] rounded-[16px] p-4 border border-[#E5E7EB]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[14px] font-semibold text-[#111827] flex items-center gap-2">
                    <MapPin size={16} className="text-[#1E90FF]" />
                    Delivery Address
                  </h3>
                  <button className="text-[12px] font-medium text-[#1E90FF]">Change</button>
                </div>
                <div className="text-[13px] text-[#4B5563] leading-relaxed">
                  <p className="font-medium text-[#111827]">Crevings Restaurant (Main Branch)</p>
                  <p>123 Culinary Avenue, Food District</p>
                  <p>Mumbai, Maharashtra 400001</p>
                </div>
              </div>

              {/* Order Type */}
              <div className="bg-[#FFFFFF] rounded-[16px] p-4 border border-[#E5E7EB]">
                <h3 className="text-[14px] font-semibold text-[#111827] mb-3 flex items-center gap-2">
                  <Clock size={16} className="text-[#1E90FF]" />
                  Delivery Speed
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="delivery" 
                        checked={orderType === 'standard'}
                        onChange={() => setOrderType('standard')}
                        className="w-4 h-4 text-[#1E90FF] focus:ring-[#1E90FF]" 
                      />
                      <div>
                        <p className="text-[14px] font-medium text-[#111827]">Standard Delivery</p>
                        <p className="text-[12px] text-[#6B7280]">2-3 Business Days</p>
                      </div>
                    </div>
                    <span className="text-[13px] font-medium text-[#111827]">Free</span>
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="delivery" 
                        checked={orderType === 'express'}
                        onChange={() => setOrderType('express')}
                        className="w-4 h-4 text-[#1E90FF] focus:ring-[#1E90FF]" 
                      />
                      <div>
                        <p className="text-[14px] font-medium text-[#111827]">Express Delivery</p>
                        <p className="text-[12px] text-[#6B7280]">Tomorrow by 12 PM</p>
                      </div>
                    </div>
                    <span className="text-[13px] font-medium text-[#111827]">₹150</span>
                  </label>
                </div>
              </div>

              {/* Cart Items */}
              <div className="bg-[#FFFFFF] rounded-[16px] p-4 border border-[#E5E7EB]">
                <h3 className="text-[14px] font-semibold text-[#111827] mb-4">Items ({cartItemCount})</h3>
                <div className="space-y-4">
                  {Object.entries(cart).map(([id, qty]) => {
                    const product = STORE_PRODUCTS.find(p => p.id === id);
                    if (!product) return null;
                    const currentPrice = getProductPrice(product, qty);
                    
                    return (
                      <div key={id} className="flex gap-3 pb-4 border-b border-[#F3F4F6] last:border-0 last:pb-0">
                        <div className="w-16 h-16 rounded-[8px] bg-slate-50 overflow-hidden shrink-0">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col">
                          <h4 className="text-[13px] font-medium text-[#111827] line-clamp-2">{product.name}</h4>
                          <div className="flex items-center justify-between mt-auto">
                            <span className="text-[14px] font-bold text-[#111827]">₹{currentPrice * qty}</span>
                            <div className="w-[90px] h-[32px] bg-[#FFFFFF] rounded-[8px] flex items-center justify-between px-1 border border-[#E5E7EB]">
                              <button 
                                onClick={() => handleUpdateCart(id, -1)}
                                className="w-7 h-7 flex items-center justify-center text-[#6B7280] hover:bg-slate-50 rounded-md"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="text-[13px] font-semibold text-[#111827]">{qty}</span>
                              <button 
                                onClick={() => handleUpdateCart(id, 1)}
                                className="w-7 h-7 flex items-center justify-center text-[#1E90FF] hover:bg-blue-50 rounded-md"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Smart Suggestions */}
              <div className="pt-2">
                <h3 className="text-[14px] font-semibold text-[#111827] mb-3 px-1">Recommended for You</h3>
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                  {STORE_PRODUCTS.filter(p => !cart[p.id]).slice(0, 3).map(product => (
                    <div key={product.id} className="w-[140px] shrink-0 bg-[#FFFFFF] rounded-[12px] p-2 border border-[#E5E7EB]">
                      <div className="w-full aspect-square rounded-[8px] overflow-hidden mb-2">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <h4 className="text-[11px] font-medium text-[#111827] line-clamp-1">{product.name}</h4>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[12px] font-bold text-[#111827]">₹{product.price}</span>
                        <button 
                          onClick={() => handleUpdateCart(product.id, 1)}
                          className="w-6 h-6 bg-[#1E90FF] text-white rounded-full flex items-center justify-center"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bill Details */}
              <div className="bg-[#FFFFFF] rounded-[16px] p-4 border border-[#E5E7EB]">
                <h3 className="text-[14px] font-semibold text-[#111827] mb-3">Bill Details</h3>
                <div className="space-y-2 text-[13px]">
                  <div className="flex justify-between text-[#4B5563]">
                    <span>Item Total</span>
                    <span>₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-[#4B5563]">
                    <span>Delivery Fee</span>
                    <span>{deliveryCharge === 0 ? <span className="text-green-600 font-medium">FREE</span> : `₹${deliveryCharge}`}</span>
                  </div>
                  <div className="border-t border-[#F3F4F6] pt-2 mt-2 flex justify-between font-bold text-[#111827] text-[15px]">
                    <span>To Pay</span>
                    <span>₹{cartTotal + deliveryCharge}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Checkout Bottom Bar */}
        {cartItemCount > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-[#FFFFFF] border-t border-[#E5E7EB] p-4 pb-safe">
            <button 
              className="w-full h-[52px] bg-[#1E90FF] text-white rounded-[16px] font-semibold text-[16px] flex items-center justify-center gap-2"
            >
              Place Order • ₹{cartTotal + deliveryCharge}
            </button>
          </div>
        )}
      </div>
    );
  }

  if (view === 'product' && selectedProduct) {
    const qty = cart[selectedProduct.id] || 0;
    
    return (
      <div className="min-h-screen bg-[#FFFFFF] flex flex-col">
        {/* Header */}
        <div className="bg-[#FFFFFF] border-b border-[#E5E7EB] px-4 h-[60px] flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setView('store')} className="p-2 -ml-2 text-[#111827]">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-[18px] font-bold text-[#111827]">Product Details</h1>
          </div>
          <button 
            onClick={() => setView('cart')}
            className="relative p-2 text-[#111827]"
          >
            <ShoppingCart size={24} />
            {cartItemCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pb-32">
          {/* Image Carousel (Simplified as single image for now) */}
          <div className="w-full aspect-square bg-[#FFFFFF]">
            <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
          </div>

          <div className="p-4 space-y-6">
            {/* Title & Price */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-[20px] font-bold text-[#111827] leading-tight">
                  {selectedProduct.name}
                </h2>
              </div>
              <p className="text-[13px] text-[#6B7280] mt-1">{selectedProduct.category}</p>
              <div className="mt-3 flex items-end gap-2">
                <span className="text-[24px] font-black text-[#111827]">₹{selectedProduct.price}</span>
                {selectedProduct.bulkLabel && (
                  <span className="text-[12px] text-[#6B7280] mb-1.5">/ {selectedProduct.bulkLabel.split('(')[1]?.replace(')', '') || 'unit'}</span>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-[15px] font-semibold text-[#111827] mb-2">Description</h3>
              <p className="text-[14px] text-[#4B5563] leading-relaxed">
                {selectedProduct.description}
              </p>
            </div>

            {/* Bulk Pricing */}
            {selectedProduct.bulkPricing && (
              <div>
                <h3 className="text-[15px] font-semibold text-[#111827] mb-2">Bulk Pricing</h3>
                <div className="bg-[#FFFFFF] rounded-[12px] border border-[#E5E7EB] overflow-hidden">
                  {selectedProduct.bulkPricing.map((tier, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border-b border-[#F3F4F6] last:border-0">
                      <span className="text-[14px] text-[#4B5563]">{tier.range}</span>
                      <span className="text-[14px] font-semibold text-[#111827]">₹{tier.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-[#FFFFFF] border-t border-[#E5E7EB] p-4 pb-safe">
          {qty === 0 ? (
            <button 
              onClick={() => handleUpdateCart(selectedProduct.id, 1)}
              className="w-full h-[52px] bg-[#1E90FF] text-white rounded-[16px] font-semibold text-[16px] flex items-center justify-center"
            >
              Add to Cart
            </button>
          ) : (
            <div className="flex gap-3">
              <div className="flex-1 h-[52px] bg-blue-50 rounded-[16px] flex items-center justify-between px-4 border border-blue-100">
                <button 
                  onClick={() => handleUpdateCart(selectedProduct.id, -1)}
                  className="w-10 h-10 flex items-center justify-center text-blue-600 rounded-xl hover:bg-[#FFFFFF] transition-colors"
                >
                  <Minus size={20} />
                </button>
                <span className="text-[18px] font-bold text-blue-700">{qty}</span>
                <button 
                  onClick={() => handleUpdateCart(selectedProduct.id, 1)}
                  className="w-10 h-10 flex items-center justify-center text-blue-600 rounded-xl hover:bg-[#FFFFFF] transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
              <button 
                onClick={() => setView('cart')}
                className="flex-1 h-[52px] bg-[#1E90FF] text-white rounded-[16px] font-semibold text-[16px] flex items-center justify-center"
              >
                View Cart
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (view === 'history') {
    return (
      <div className="min-h-screen bg-[#FFFFFF] flex flex-col">
        {/* Header */}
        <div className="bg-[#FFFFFF] border-b border-[#E5E7EB] px-4 h-[60px] flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setView('store')} className="p-2 -ml-2 text-[#111827]">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-[18px] font-bold text-[#111827]">Order History</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="bg-[#FFFFFF] rounded-[16px] p-4 border border-[#E5E7EB]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-medium text-[#6B7280]">Order #ORD-8472</span>
              <span className="text-[12px] font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">Delivered</span>
            </div>
            <h3 className="text-[14px] font-semibold text-[#111827] mb-1">Eco-Friendly Meal Boxes (x2)</h3>
            <p className="text-[12px] text-[#6B7280] mb-3">Placed on 12 Oct 2023</p>
            <div className="flex items-center justify-between border-t border-[#F3F4F6] pt-3">
              <span className="text-[14px] font-bold text-[#111827]">₹900</span>
              <button className="text-[12px] font-medium text-[#1E90FF]">Reorder</button>
            </div>
          </div>

          <div className="bg-[#FFFFFF] rounded-[16px] p-4 border border-[#E5E7EB]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-medium text-[#6B7280]">Order #ORD-8391</span>
              <span className="text-[12px] font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">Delivered</span>
            </div>
            <h3 className="text-[14px] font-semibold text-[#111827] mb-1">Branded Sealing Tape (x5)</h3>
            <p className="text-[12px] text-[#6B7280] mb-3">Placed on 05 Oct 2023</p>
            <div className="flex items-center justify-between border-t border-[#F3F4F6] pt-3">
              <span className="text-[14px] font-bold text-[#111827]">₹750</span>
              <button className="text-[12px] font-medium text-[#1E90FF]">Reorder</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Store View
  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col">
      {/* Header */}
      <div className="bg-[#FFFFFF] border-b border-[#E5E7EB] px-4 h-[60px] flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 text-[#111827]">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-[18px] font-bold text-[#111827]">Partner Store</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setView('history')} className="p-2 text-[#111827]">
            <History size={20} />
          </button>
          <button 
            onClick={() => setView('cart')}
            className="relative p-2 text-[#111827]"
          >
            <ShoppingCart size={24} />
            {cartItemCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap px-4 h-[36px] rounded-[18px] text-[13px] font-medium transition-colors border ${
                activeCategory === category
                  ? 'bg-[#1E90FF] text-white border-[#1E90FF]'
                  : 'bg-[#FFFFFF] text-[#4B5563] border-[#E5E7EB]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 gap-3 pb-24">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(renderProductCard)
          ) : (
            <div className="col-span-2 py-12 text-center text-[#6B7280]">
              <Package size={32} className="mx-auto mb-3 opacity-50" />
              <p>No products found matching your search.</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Cart Button (if items in cart) */}
      {cartItemCount > 0 && view === 'store' && (
        <div className="fixed bottom-4 left-4 right-4 z-20">
          <button 
            onClick={() => setView('cart')}
            className="w-full h-[52px] bg-[#1E90FF] text-white rounded-[16px] font-semibold text-[15px] flex items-center justify-between px-4 shadow-lg"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#FFFFFF]/20 rounded-full flex items-center justify-center text-[12px]">
                {cartItemCount}
              </div>
              <span>Items added</span>
            </div>
            <div className="flex items-center gap-1">
              <span>View Cart</span>
              <ChevronRight size={18} />
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
