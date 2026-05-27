import React, { useState } from 'react';
import { MapPin, ChevronDown, User, Heart, EyeOff, Star, Clock, Music, Wind, Coffee, Utensils, Wine, Users, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface DineInViewProps {
  onRestaurantClick: (restaurant: any) => void;
  onProfileClick: () => void;
  currentLocation: { address: string };
}

const BANNERS = [
  {
    id: 1,
    title: 'Flat 20% OFF',
    subtitle: 'On Premium Dining',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&h=400&fit=crop',
  },
  {
    id: 2,
    title: 'Free Dessert',
    subtitle: 'On Table Booking',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=400&fit=crop',
  }
];

const CATEGORIES = [
  { id: 'fine-dining', label: 'Fine Dining', icon: Wine },
  { id: 'rooftop', label: 'Rooftop', icon: Wind },
  { id: 'cafes', label: 'Cafes', icon: Coffee },
  { id: 'romantic', label: 'Romantic', icon: Heart },
  { id: 'buffet', label: 'Buffet', icon: Utensils },
  { id: 'family', label: 'Family Dining', icon: Users },
];

const DINE_IN_RESTAURANTS = [
  {
    id: 'd1',
    name: 'The Olive Bistro',
    rating: 4.8,
    cuisine: 'Modern European • Italian',
    distance: '2.5 km',
    costForTwo: 2500,
    offer: 'FLAT 20% OFF',
    bookedToday: 150,
    nextSlot: '7:30 PM',
    tags: ['Outdoor Seating', 'Live Music'],
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
    fillingFast: true
  },
  {
    id: 'd2',
    name: 'Zenith Rooftop',
    rating: 4.6,
    cuisine: 'Asian • Sushi • Cocktails',
    distance: '3.8 km',
    costForTwo: 3200,
    offer: '1+1 ON DRINKS',
    bookedToday: 85,
    nextSlot: '8:00 PM',
    tags: ['Rooftop', 'Great View'],
    image: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=800&h=600&fit=crop',
    fillingFast: false
  },
  {
    id: 'd3',
    name: 'Ophelia',
    rating: 4.9,
    cuisine: 'Mediterranean • Continental',
    distance: '1.2 km',
    costForTwo: 4000,
    offer: 'COMPLIMENTARY DESSERT',
    bookedToday: 210,
    nextSlot: '9:15 PM',
    tags: ['Luxury Dining', 'Valet Parking'],
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&h=600&fit=crop',
    fillingFast: true
  }
];

export const DineInView: React.FC<DineInViewProps> = ({ onRestaurantClick, onProfileClick, currentLocation }) => {
  const [selectedCategory, setSelectedCategory] = useState('fine-dining');

  return (
    <div className="min-h-screen bg-white pb-24 font-sans">
      {/* Header */}
      <header className="px-4 py-3 sticky top-0 bg-white/80 backdrop-blur-md z-30 border-b border-slate-100">
        <div className="flex justify-between items-start mb-1">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Dine-In</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Book tables at top restaurants near you</p>
          </div>
          <button 
            onClick={onProfileClick}
            className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 active:scale-95 transition-transform"
          >
            <User className="w-5 h-5 text-slate-700" />
          </button>
        </div>
        <div className="flex items-center gap-1 mt-2 inline-flex active:scale-95 transition-transform cursor-pointer">
          <MapPin className="w-4 h-4 text-[#00BD6F]" />
          <span className="text-sm font-bold text-slate-700 truncate max-w-[200px]">{currentLocation.address.split(',')[0]}</span>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </div>
      </header>

      <main>
        {/* Banner Section */}
        <div className="mt-4 pl-4">
          <div className="flex gap-4 overflow-x-auto no-scrollbar pr-4 pb-4">
            {BANNERS.map((banner) => (
              <div 
                key={banner.id}
                className="relative w-[320px] h-[160px] rounded-[20px] overflow-hidden shrink-0 shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
              >
                <img src={banner.image} alt={banner.title} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <div>
                    <h3 className="text-white font-black text-xl leading-tight mb-1">{banner.title}</h3>
                    <p className="text-white/90 text-xs font-medium">{banner.subtitle}</p>
                  </div>
                  <button className="bg-white text-slate-900 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 active:scale-95 transition-transform">
                    Explore <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Section */}
        <div className="mt-2 pl-4">
          <div className="flex gap-3 overflow-x-auto no-scrollbar pr-4 pb-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-[14px] shrink-0 transition-colors ${
                    isSelected 
                      ? 'bg-[#00BD6F]/10 text-[#00BD6F]' 
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-bold">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Restaurant Cards */}
        <div className="mt-6 px-4 space-y-6">
          {DINE_IN_RESTAURANTS.map((restaurant) => (
            <motion.div 
              key={restaurant.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => onRestaurantClick(restaurant)}
              className="bg-white rounded-[20px] shadow-[0_6px_20px_rgba(0,0,0,0.06)] border border-slate-100 overflow-hidden cursor-pointer"
            >
              {/* Image Section */}
              <div className="relative h-[190px] w-full p-2">
                <div className="relative w-full h-full rounded-[16px] overflow-hidden">
                  <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
                  
                  {/* Top Left Overlay */}
                  <div className="absolute top-3 left-3 bg-[#E6F7EF] text-[#00BD6F] px-2.5 py-1.5 rounded-full text-[10px] font-black tracking-wide shadow-sm">
                    {restaurant.offer}
                  </div>

                  {/* Top Right Overlays */}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-700 active:scale-95 transition-transform shadow-sm">
                      <EyeOff className="w-4 h-4" />
                    </button>
                    <button className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-700 active:scale-95 transition-transform shadow-sm">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Bottom Left Overlay */}
                  <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-slate-800 flex items-center gap-1.5 shadow-sm">
                    <span className="text-sm">👤</span> {restaurant.bookedToday} booked today
                  </div>
                </div>
              </div>

              {/* Details Section */}
              <div className="p-4 pt-2">
                {/* Row 1 */}
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-[18px] font-black text-slate-900 leading-tight">{restaurant.name}</h3>
                  <div className="bg-[#E6F7EF] text-[#00BD6F] px-2 py-1 rounded-[10px] flex items-center gap-1 shrink-0">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-xs font-bold">{restaurant.rating}</span>
                  </div>
                </div>

                {/* Row 2 */}
                <p className="text-[13px] text-[#6B7280] font-medium mb-2.5">
                  {restaurant.cuisine} • {restaurant.distance}
                </p>

                {/* Tags & Urgency */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {restaurant.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                      {tag}
                    </span>
                  ))}
                  {restaurant.fillingFast && (
                    <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-md border border-orange-100 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Filling Fast
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00BD6F]" />
                  Next available slot: <span className="text-[#00BD6F]">{restaurant.nextSlot}</span>
                </div>

                <div className="h-px w-full bg-[#F1F1F1] mb-4" />

                {/* Bottom Section */}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[11px] text-[#9CA3AF] font-bold tracking-wider mb-0.5">COST FOR TWO</p>
                    <p className="text-[15px] font-black text-slate-900">₹{restaurant.costForTwo}</p>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle booking flow
                    }}
                    className="h-[44px] px-5 bg-[#0F172A] text-white rounded-xl text-sm font-bold active:scale-95 transition-transform shadow-sm"
                  >
                    Book Table
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};
