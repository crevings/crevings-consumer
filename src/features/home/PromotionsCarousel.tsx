import React, { useState, useEffect, useRef } from 'react';

const PROMOTIONS = [
  {
    id: 1,
    title: '50% OFF',
    subtitle: 'On your first 3 orders',
    badge: 'Limited Time',
    buttonText: 'Order Now',
    bgClass: 'bg-gradient-to-br from-slate-900 to-slate-800',
    badgeClass: 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30',
    buttonClass: 'bg-white text-slate-900 hover:bg-slate-50',
    images: [
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=50&h=50&fit=crop&q=80',
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=50&h=50&fit=crop&q=80',
    ],
    decorations: (
      <>
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 rounded-full blur-[60px] opacity-20 transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500 rounded-full blur-[50px] opacity-20 transform -translate-x-1/2 translate-y-1/2"></div>
      </>
    )
  },
  {
    id: 2,
    title: 'Fresh Salads',
    subtitle: 'Start at ₹149 only',
    badge: 'Healthy Eats',
    buttonText: 'Explore Menu',
    bgClass: 'bg-gradient-to-br from-blue-600 to-indigo-700',
    badgeClass: 'bg-white/20 text-white border border-white/20',
    buttonClass: 'bg-white text-blue-700 hover:bg-slate-50',
    images: [
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=50&h=50&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=50&h=50&fit=crop&q=80',
    ],
    decorations: (
      <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-[60px] opacity-20 transform translate-x-1/3 -translate-y-1/3"></div>
    )
  },
  {
    id: 3,
    title: 'Free Delivery',
    subtitle: 'On orders above ₹499',
    badge: 'Weekend Special',
    buttonText: 'Claim Now',
    bgClass: 'bg-gradient-to-br from-[#00BD6F] to-emerald-700',
    badgeClass: 'bg-white/20 text-white border border-white/20',
    buttonClass: 'bg-white text-[#00BD6F] hover:bg-slate-50',
    images: [
      'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=50&h=50&fit=crop&q=80',
      'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=50&h=50&fit=crop&q=80',
    ],
    decorations: (
      <>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full blur-[60px] opacity-20 transform translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-0 left-0 w-20 h-20 bg-yellow-400 rounded-full blur-[40px] opacity-20 transform -translate-x-1/2 -translate-y-1/2"></div>
      </>
    )
  }
];

export const PromotionsCarousel: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!scrollRef.current) return;
      
      const nextIndex = (activeIndex + 1) % PROMOTIONS.length;
      const cardWidth = 320 + 16; // w-[320px] + gap-4
      
      if (nextIndex === 0) {
        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollRef.current.scrollTo({ left: nextIndex * cardWidth, behavior: 'smooth' });
      }
      
      setActiveIndex(nextIndex);
    }, 4000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const cardWidth = 320 + 16;
    const newIndex = Math.round(scrollLeft / cardWidth);
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < PROMOTIONS.length) {
      setActiveIndex(newIndex);
    }
  };

  return (
    <div className="mb-10 pl-4 mt-2">
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto no-scrollbar pr-4 snap-x snap-mandatory"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {PROMOTIONS.map((promo) => (
          <div 
            key={promo.id}
            className={`w-[320px] h-[160px] ${promo.bgClass} rounded-[28px] p-5 text-white relative overflow-hidden shrink-0 snap-center shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-slate-700/50`}
          >
            {promo.decorations}
            <div className="relative z-10 h-full flex flex-col justify-between">
               <div>
                   <div className={`inline-block ${promo.badgeClass} text-[10px] uppercase font-black px-2.5 py-1 rounded-full mb-2 tracking-wider`}>
                     {promo.badge}
                   </div>
                   <h3 className="text-[26px] font-black leading-tight tracking-tight">{promo.title}</h3>
                   <p className="text-white/80 text-[13px] font-medium mt-1">{promo.subtitle}</p>
               </div>
               <div className="flex items-center justify-between mt-2">
                  <button className={`${promo.buttonClass} px-5 py-2.5 rounded-[14px] text-[13px] font-bold active:scale-95 transition-transform shadow-md`}>
                    {promo.buttonText}
                  </button>
                  <div className="flex -space-x-3">
                     {promo.images.map((img, idx) => (
                       <img key={idx} src={img} className="w-9 h-9 rounded-full border-2 border-slate-800/20 object-cover" />
                     ))}
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination Indicators */}
      <div className="flex justify-center gap-1.5 mt-4 pr-4">
        {PROMOTIONS.map((_, idx) => (
          <div 
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-300 ${activeIndex === idx ? 'w-5 bg-slate-800' : 'w-1.5 bg-slate-300'}`}
          />
        ))}
      </div>
    </div>
  );
};
