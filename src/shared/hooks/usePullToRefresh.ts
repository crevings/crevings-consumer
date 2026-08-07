import React, { useState, useRef } from "react";

/**
 * Pull-to-refresh that runs a real refresh callback instead of faking latency.
 * Pass `onRefresh` (e.g. an SWR `mutate`) to reload actual data.
 */
export const usePullToRefresh = (onRefresh?: () => Promise<unknown> | void) => {
  const [isPullLoading, setIsPullLoading] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const pullStartY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      pullStartY.current = e.touches[0]?.clientY ?? 0;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (pullStartY.current > 0) {
      const y = e.touches[0]?.clientY ?? 0;
      const distance = y - pullStartY.current;
      if (distance > 0) {
        setPullDistance(Math.min(distance * 0.5, 100));
      }
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance > 60) {
      setIsPullLoading(true);
      try {
        await onRefresh?.();
      } finally {
        setIsPullLoading(false);
      }
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
