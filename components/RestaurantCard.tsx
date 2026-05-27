import React from 'react';
import { Star, Plus } from 'lucide-react';
import { MOCK_MENU } from '../constants';

interface RestaurantCardProps {
  id?: string | number;
  name: string;
  cuisine: string;
  rating: number;
  time: string;
  price: string;
  image?: string;
  images?: string[];
  distance: string;
  offer?: string;
  address?: string;
  dietary?: string[];
  onClick?: () => void;
  onHide?: (id: string | number) => void;
  onFavourite?: (id: string | number) => void;
  onItemAdd?: (itemId: string) => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  id,
  name,
  cuisine,
  rating,
  time,
  price,
  image,
  images = [],
  distance,
  offer,
  address,
  dietary = [],
  onClick,
  onItemAdd,
}) => {
  // Use provided images for menu items if available, otherwise use mock
  const displayImages = images.length > 0 ? images : (image ? [image] : []);
  
  const menuItems = MOCK_MENU.filter(item => item.available !== false).slice(0, 3).map((item, index) => ({
    ...item,
    price: `₹${item.price}`,
    isPopular: item.bestseller || false,
    image: displayImages[index % displayImages.length] || item.image
  }));

  const isPureVeg = dietary.length === 1 && dietary[0] === 'veg';
  const isAd = React.useMemo(() => Math.random() > 0.7, []); // Randomly show Ad tag for demo
  const bestIn = cuisine.split(',')[0];

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-[24px] overflow-hidden border border-slate-100 shadow-sm mb-6 relative p-4 cursor-pointer"
    >
      {/* Top Section */}
      <div className="mb-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
              {isAd && <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">Ad</span>}
              {isPureVeg && <span className="bg-green-50 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">Pure Veg</span>}
              <span className="bg-orange-50 text-orange-700 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">Best in {bestIn}</span>
            </div>
            <h3 className="text-[22px] font-black text-slate-900 leading-tight tracking-tight mb-1">
              {name}
            </h3>
            <div className="text-[13px] text-slate-600 font-medium mb-0.5">
              {address || 'Koramangala'} • {distance} • {time}
            </div>
            <div className="text-[13px] text-slate-500 truncate max-w-[220px]">
              {cuisine}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center bg-green-700 rounded-xl px-2 py-1 shadow-sm shrink-0 ml-2">
            <div className="flex items-center gap-1">
              <span className="text-white font-bold text-sm">{rating}</span>
              <Star className="w-3 h-3 text-white fill-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items Carousel */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 mb-3">
        {menuItems.map((item, idx) => (
          <div key={idx} className="shrink-0 w-[140px] bg-slate-50 rounded-[16px] p-2 border border-slate-100/50">
            <div className="relative w-full aspect-[4/3] rounded-[12px] overflow-hidden mb-2">
              <img 
                src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop'} 
                alt={item.name} 
                className="w-full h-full object-cover"
              />
              {/* Gradient overlay for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              
              {item.isPopular && (
                <div className="absolute top-0 left-0 bg-white/95 backdrop-blur-sm text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-br-[10px] shadow-sm uppercase tracking-wider">
                  Bestseller
                </div>
              )}

              <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between">
                <div className="text-white font-bold text-[13px]">
                  {item.price}
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onItemAdd) onItemAdd(item.id);
                  }}
                  className="w-6 h-6 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md border border-slate-100/50 text-green-600 hover:bg-green-50 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" strokeWidth={3} />
                </button>
              </div>
            </div>
            
            <div className="px-1">
              <div className="flex items-start gap-1.5">
                <div className={`mt-0.5 w-3.5 h-3.5 border flex items-center justify-center shrink-0 rounded-sm ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                  {item.isVeg ? (
                    <div className="w-2 h-2 rounded-full bg-green-600" />
                  ) : (
                    <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-red-600" />
                  )}
                </div>
                <h4 className="text-[12px] font-bold text-slate-800 leading-tight line-clamp-2">
                  {item.name}
                </h4>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center text-[13px] text-slate-700 bg-slate-50 p-2 rounded-xl border border-slate-100">
        <div className="w-[18px] h-[18px] mr-2 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" className="w-full h-full text-green-600 fill-current">
            <path d="M12 2L14.8 5.6L19.4 6.2L18.4 10.8L20.6 14.8L17 17.6L16.4 22.2L12 20.6L7.6 22.2L7 17.6L3.4 14.8L5.6 10.8L4.6 6.2L9.2 5.6L12 2Z" />
            <path d="M10 15L14 9" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <circle cx="10.5" cy="10.5" r="1.5" fill="white" />
            <circle cx="13.5" cy="13.5" r="1.5" fill="white" />
          </svg>
        </div>
        <span className="font-medium text-slate-800">Free Delivery • Items At ₹109</span>
      </div>
    </div>
  );
};