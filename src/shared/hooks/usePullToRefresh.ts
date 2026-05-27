import React, { useState, useRef } from "react";

export const usePullToRefresh = () => {
  const [isPullLoading, setIsPullLoading] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const pullStartY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      pullStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (pullStartY.current > 0) {
      const y = e.touches[0].clientY;
      const distance = y - pullStartY.current;
      if (distance > 0) {
        setPullDistance(Math.min(distance * 0.5, 100));
      }
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance > 60) {
      setIsPullLoading(true);
      setTimeout(() => setIsPullLoading(false), 1500);
    }
    setPullDistance(0);
    pullStartY.current = 0;
  };

  return {
    isPullLoading,
    pullDistance,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
};
