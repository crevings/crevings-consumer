import { useState, useEffect } from "react";

export const useScrollBehavior = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isNavVisible, setIsNavVisible] = useState(true);

  useEffect(() => {
    let accumulatedScroll = 0;
    let prevScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // Back to top button logic (show after 2 screen heights)
      if (currentScrollY > windowHeight * 2) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }

      // Bottom nav visibility logic
      const diff = currentScrollY - prevScrollY;
      if (
        (diff > 0 && accumulatedScroll < 0) ||
        (diff < 0 && accumulatedScroll > 0)
      ) {
        accumulatedScroll = 0;
      }
      accumulatedScroll += diff;

      if (currentScrollY < 60) {
        setIsNavVisible(true);
      } else if (accumulatedScroll > 60) {
        setIsNavVisible(false);
        accumulatedScroll = 0;
      } else if (accumulatedScroll < -60) {
        setIsNavVisible(true);
        accumulatedScroll = 0;
      }

      prevScrollY = currentScrollY;
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return {
    showBackToTop,
    lastScrollY,
    isNavVisible,
    scrollToTop,
  };
};
