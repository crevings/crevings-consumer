import React, { useState, useEffect, useRef } from 'react';

const PROMOTIONS = [
  {
    id: 1,
    tagline: "CELEBRATE",
    title: "Flat ₹150 OFF",
    subtitle: "ON YOUR FIRST 3 ORDERS THIS WEEK!",
    buttonText: "Order Now",
    bgColor: "bg-[#4e2718]",
    taglineColor: "text-[#e8b982] italic font-black text-xs tracking-wider uppercase",
    titleColor: "text-[#fff6e5] text-2xl sm:text-[26px] font-black leading-tight mt-1 mb-1",
    subtitleColor: "text-[#f3d9bd] text-[10px] font-extrabold tracking-wide uppercase leading-tight max-w-[145px]",
    buttonBg: "bg-[#33180d] text-[#fff6e5] hover:bg-[#281209]",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    tagline: "FRIENDS' ZONE",
    title: "Up To 50% OFF",
    subtitle: "AT TOP SPOTS THIS FRIENDSHIP DAY!",
    buttonText: "Book Now",
    bgColor: "bg-[#f4d4b3]",
    taglineColor: "text-[#8e9213] italic font-black text-xs tracking-wider uppercase",
    titleColor: "text-[#124528] text-2xl sm:text-[26px] font-black leading-tight mt-1 mb-1",
    subtitleColor: "text-[#1b4d2e] text-[10px] font-extrabold tracking-wide uppercase leading-tight max-w-[145px]",
    buttonBg: "bg-[#124528] text-white hover:bg-[#0c331c]",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&auto=format&fit=crop&q=80"
  }
];

export const PromotionsCarousel: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!scrollRef.current) return;
      
      const nextIndex = (activeIndex + 1) % PROMOTIONS.length;
      const cardWidth = 320 + 16;
      
      if (nextIndex === 0) {
        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollRef.current.scrollTo({ left: nextIndex * cardWidth, behavior: 'smooth' });
      }
      
      setActiveIndex(nextIndex);
    }, 4500);

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
    <div className="mb-8 px-4 mt-2">
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto no-scrollbar -mx-4 px-4 snap-x snap-mandatory"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {PROMOTIONS.map((promo) => (
          <div 
            key={promo.id}
            className={`w-[320px] sm:w-[340px] h-[175px] ${promo.bgColor} rounded-[32px] p-5 text-white relative overflow-hidden shrink-0 snap-start shadow-md flex items-center justify-between gap-3 border border-slate-900/5`}
          >
            <div className="flex-1 flex flex-col justify-between h-full py-0.5 z-10">
              <div>
                <p className={promo.taglineColor}>{promo.tagline}</p>
                <h3 className={promo.titleColor}>{promo.title}</h3>
                <p className={promo.subtitleColor}>{promo.subtitle}</p>
              </div>

              <div className="pt-1.5 pb-2">
                <button className={`${promo.buttonBg} px-5 py-2.5 rounded-[16px] text-xs font-bold leading-none active:scale-95 transition-transform shadow-md inline-flex items-center justify-center whitespace-nowrap mb-1.5`}>
                  {promo.buttonText}
                </button>
              </div>
            </div>

            <div className="w-[135px] h-[135px] rounded-[24px] overflow-hidden shrink-0 shadow-sm border border-white/10 relative z-10">
              <img src={promo.image} alt={promo.title} className="w-full h-full object-cover" />
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination Indicators */}
      <div className="flex justify-center gap-1.5 mt-4">
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
