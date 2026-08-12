import React, { useState, useEffect, useRef } from "react";
import { usePromotions } from "@/api/restaurant/index";
import { CompanyPromotion, PromotionDesign } from "@/types";

interface PromotionsCarouselProps {
  onOrderClick?: () => void;
}

/**
 * Single dynamic rendering engine for promotional cards.
 *
 * Every visual property (background, text colours, button colours, radii,
 * image, italic/uppercase treatment) comes from the backend `design` JSON —
 * NOT hardcoded. The engine resolves a design value with a sensible fallback
 * and applies it as an inline style so cards can change without a redeploy.
 */
const PromotionCard: React.FC<{ promo: CompanyPromotion; onClick: () => void }> = ({
  promo,
  onClick,
}) => {
  const d: PromotionDesign = promo.design || {};

  const taglineStyle: React.CSSProperties = {
    color: d.taglineColor || "#e8b982",
    fontStyle: d.taglineItalic === false ? "normal" : "italic",
    textTransform: d.taglineUppercase === false ? "none" : "uppercase",
  };

  return (
    <div
      onClick={onClick}
      className="w-[335px] sm:w-[360px] h-[175px] rounded-[28px] p-4 text-white relative overflow-hidden shrink-0 snap-start shadow-md flex items-center justify-between gap-2 cursor-pointer active:scale-[0.99] transition-transform md:w-full md:h-[190px]"
      style={{
        backgroundColor: d.backgroundColor || "#4e2718",
        border: `1px solid ${d.borderColor || "rgba(15,23,42,0.05)"}`,
        borderRadius: `${d.borderRadius ?? 28}px`,
      }}
    >
      <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-1 z-10 pr-1">
        <div>
          {promo.tagline && (
            <p
              className="text-xs font-black tracking-wider leading-none"
              style={taglineStyle}
            >
              {promo.tagline}
            </p>
          )}
          <h3
            className="text-2xl sm:text-[26px] font-bold leading-tight mt-1 mb-1"
            style={{ color: d.titleColor || "#fff6e5" }}
          >
            {promo.title}
          </h3>
          {promo.subtitle && (
            <p
              className="text-[10px] font-semibold tracking-wide uppercase leading-tight max-w-[145px]"
              style={{ color: d.subtitleColor || "#f3d9bd" }}
            >
              {promo.subtitle}
            </p>
          )}
        </div>

        <div className="pt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold leading-none active:scale-95 transition-transform shadow-md inline-flex items-center justify-center whitespace-nowrap"
            style={{
              backgroundColor: d.buttonBackground || "#33180d",
              color: d.buttonTextColor || "#fff6e5",
            }}
          >
            {promo.buttonText || "Order Now"}
          </button>
        </div>
      </div>

      {promo.image && (
        <div
          className="w-[115px] h-[115px] sm:w-[125px] sm:h-[125px] overflow-hidden shrink-0 shadow-sm border border-white/10 relative z-10 self-center"
          style={{ borderRadius: `${d.imageBorderRadius ?? 20}px` }}
        >
          <img loading="lazy" src={promo.image} alt={promo.title} className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  );
};

export const PromotionsCarousel: React.FC<PromotionsCarouselProps> = ({ onOrderClick }) => {
  const { promotions, isLoading } = usePromotions();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Only render ACTIVE cards — the backend already filters, but we keep the
  // client-side guard so an inactive card never flashes in.
  const activePromotions = (promotions || []).filter((p) => p.isActive !== false);

  // Reset pips when the card list changes
  useEffect(() => {
    setActiveIndex(0);
  }, [activePromotions.length]);

  useEffect(() => {
    if (activePromotions.length <= 1) return;
    const interval = setInterval(() => {
      if (!scrollRef.current) return;

      const nextIndex = (activeIndex + 1) % activePromotions.length;
      const cardWidth = 335 + 16;

      if (nextIndex === 0) {
        scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollRef.current.scrollTo({ left: nextIndex * cardWidth, behavior: "smooth" });
      }

      setActiveIndex(nextIndex);
    }, 4500);

    return () => clearInterval(interval);
  }, [activeIndex, activePromotions.length]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const cardWidth = 335 + 16;
    const newIndex = Math.round(scrollLeft / cardWidth);
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < activePromotions.length) {
      setActiveIndex(newIndex);
    }
  };

  const handleCardClick = () => {
    if (onOrderClick) {
      onOrderClick();
    } else {
      const el = document.getElementById("all-restaurants-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Nothing to show while loading or when there are no active promotions
  if (isLoading || activePromotions.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 pl-4 pr-4 mt-2">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto no-scrollbar -ml-4 px-4 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible md:snap-none md:ml-0 md:px-0 md:gap-4"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {activePromotions.map((promo) => (
          <PromotionCard key={promo.id} promo={promo} onClick={handleCardClick} />
        ))}
      </div>

      {/* Pagination Indicators (mobile carousel only) */}
      {activePromotions.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-4 md:hidden">
          {activePromotions.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === idx ? "w-5 bg-slate-800" : "w-1.5 bg-slate-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
