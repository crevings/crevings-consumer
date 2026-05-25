import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Star,
  Plus,
  Minus,
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Trash2
} from 'lucide-react';

interface PartnerStoreProductDetailViewProps {
  onBack: () => void;
  onAddToCart: () => void;
}

export const PartnerStoreProductDetailView: React.FC<PartnerStoreProductDetailViewProps> = ({ onBack, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  const product = {
    id: '1',
    name: 'Premium Pizza Boxes (10")',
    category: 'Packaging',
    price: '₹1,200',
    unit: 'per 100 pcs',
    rating: 4.8,
    reviews: 124,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=400&auto=format&fit=crop',
    description: 'High-quality corrugated pizza boxes designed to keep your pizzas hot and crispy during delivery. Made from 100% recycled materials and fully compostable. Features ventilation holes to prevent sogginess.',
    features: [
      'Sturdy corrugated construction',
      'Grease-resistant inner lining',
      'Ventilation holes for crispiness',
      'Eco-friendly and compostable'
    ]
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] pb-24 font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#FFFFFF]/80 backdrop-blur-md border-b border-slate-100 h-[56px] flex items-center justify-between px-4 lg:hidden">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center -ml-2 text-slate-700 active:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft size={22} />
        </button>
        <button className="w-10 h-10 flex items-center justify-center text-slate-700 active:bg-slate-100 rounded-full transition-colors relative">
          <ShoppingCart size={22} />
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
            2
          </span>
        </button>
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:flex sticky top-0 z-40 bg-[#FFFFFF] border-b border-slate-100 h-[64px] items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center -ml-2 text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-[18px] font-semibold text-slate-900">Product Details</h1>
        </div>
      </header>

      <div className="lg:max-w-4xl lg:mx-auto lg:p-8">
        <div className="bg-[#FFFFFF] lg:rounded-[24px] lg:shadow-sm lg:border lg:border-slate-100 overflow-hidden lg:flex">
          {/* Product Image */}
          <div className="w-full h-[300px] lg:h-[500px] lg:w-1/2 bg-slate-100 relative">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>

          {/* Product Details */}
          <div className="p-5 lg:p-8 lg:w-1/2 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[11px] font-bold uppercase tracking-wider rounded-md">
                {product.category}
              </span>
              <div className="flex items-center gap-1">
                <Star size={14} className="text-amber-400 fill-amber-400" />
                <span className="text-[13px] font-medium text-slate-700">{product.rating}</span>
                <span className="text-[13px] text-slate-400">({product.reviews} reviews)</span>
              </div>
            </div>

            <h1 className="text-[22px] lg:text-[28px] font-bold text-slate-900 leading-tight mb-2">
              {product.name}
            </h1>

            <div className="flex items-end gap-2 mb-6">
              <span className="text-[24px] lg:text-[32px] font-black text-blue-600 leading-none">{product.price}</span>
              <span className="text-[14px] text-slate-500 font-medium pb-1">{product.unit}</span>
            </div>

            <div className="space-y-6 flex-1">
              {/* Description */}
              <div>
                <h3 className="text-[15px] font-bold text-slate-900 mb-2">Description</h3>
                <p className="text-[14px] text-slate-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-[15px] font-bold text-slate-900 mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-[14px] text-slate-600">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                        <ShieldCheck size={12} />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Delivery Info */}
              <div className="bg-slate-50 rounded-[16px] p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FFFFFF] flex items-center justify-center text-slate-700 shadow-sm">
                    <Truck size={16} />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-slate-900">Free Delivery</p>
                    <p className="text-[12px] text-slate-500">Usually ships within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FFFFFF] flex items-center justify-center text-slate-700 shadow-sm">
                    <RotateCcw size={16} />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-slate-900">7 Days Return</p>
                    <p className="text-[12px] text-slate-500">If product is defective or damaged</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Add to Cart */}
            <div className="hidden lg:flex items-center gap-4 mt-8 pt-6 border-t border-slate-100">
              <div className="flex items-center bg-slate-100 rounded-xl h-[52px] p-1">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-full flex items-center justify-center text-slate-600 hover:bg-[#FFFFFF] rounded-lg transition-colors"
                >
                  <Minus size={18} />
                </button>
                <span className="w-12 text-center font-bold text-slate-900 text-[16px]">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-full flex items-center justify-center text-slate-600 hover:bg-[#FFFFFF] rounded-lg transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
              <button 
                onClick={onAddToCart}
                className="flex-1 h-[52px] bg-blue-600 text-white rounded-xl font-bold text-[15px] hover:bg-blue-700 transition-colors shadow-sm"
              >
                Add to Cart - ₹{(1200 * quantity).toLocaleString()}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View Cart Snackbar */}
      <div className="fixed bottom-[90px] left-4 right-4 z-50 max-w-md mx-auto lg:bottom-10 lg:left-auto lg:right-10 lg:w-[400px]">
        <div className="h-[64px] rounded-[16px] bg-[#FFFFFF] p-3 shadow-xl border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center relative border border-slate-100">
              <ShoppingCart size={20} className="text-slate-700" />
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                2
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-bold text-slate-900 leading-tight">₹2,400</span>
              <span className="text-[12px] text-slate-500 leading-tight mt-0.5">Plus taxes</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-slate-50 rounded-xl transition-colors">
              <Trash2 size={18} />
            </button>
            <button 
              onClick={onAddToCart}
              className="h-[40px] px-4 rounded-xl bg-blue-600 text-white text-[14px] font-bold active:scale-95 transition-transform flex items-center gap-1.5"
            >
              View Cart <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#FFFFFF] border-t border-slate-100 p-4 pb-safe z-50 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 rounded-xl h-[52px] p-1 shrink-0">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-full flex items-center justify-center text-slate-600 active:bg-[#FFFFFF] rounded-lg transition-colors"
            >
              <Minus size={18} />
            </button>
            <span className="w-10 text-center font-bold text-slate-900 text-[15px]">{quantity}</span>
            <button 
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-full flex items-center justify-center text-slate-600 active:bg-[#FFFFFF] rounded-lg transition-colors"
            >
              <Plus size={18} />
            </button>
          </div>
          <button 
            onClick={onAddToCart}
            className="flex-1 h-[52px] bg-blue-600 text-white rounded-xl font-bold text-[15px] active:scale-[0.98] transition-transform shadow-sm flex items-center justify-center gap-2"
          >
            Add to Cart <span className="text-blue-200">•</span> ₹{(1200 * quantity).toLocaleString()}
          </button>
        </div>
      </div>
    </div>
  );
};
