import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonLoadingViewProps {
  type: 'restaurant' | 'checkout' | 'home';
}

export const SkeletonLoadingView: React.FC<SkeletonLoadingViewProps> = ({ type }) => {
  if (type === 'restaurant') {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col overflow-y-auto no-scrollbar pb-24 animate-pulse">
        {/* Centralized Loading Spinner */}
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none bg-white/20 backdrop-blur-[1px]">
          <div className="w-10 h-10 border-4 border-[#00bd6f]/20 border-t-[#00bd6f] rounded-full animate-spin shadow-md" />
        </div>
        {/* Hero Image Skeleton */}
        <div className="relative aspect-[2/3] max-h-[500px] w-full shrink-0 bg-slate-200" />
        
        {/* Content Container */}
        <div className="relative -mt-6 bg-white rounded-t-3xl pt-6 px-4 z-20 flex-1">
          {/* Logo Skeleton */}
          <div className="flex flex-col items-center text-center gap-1.5 mb-6">
            <div className="w-16 h-16 bg-slate-200 rounded-2xl mb-2 -mt-14 z-30 relative" />
            <div className="h-8 w-48 bg-slate-200 rounded-lg mb-2" />
            <div className="h-4 w-64 bg-slate-200 rounded-lg" />
          </div>

          {/* Info Cards Skeleton */}
          <div className="flex gap-3 mb-6 overflow-x-auto no-scrollbar pb-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-1 min-w-[100px] bg-slate-100 rounded-2xl p-3 h-20" />
            ))}
          </div>

          {/* Menu Skeleton */}
          <div className="space-y-6">
            <div className="h-6 w-32 bg-slate-200 rounded-lg mb-4" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4 mb-4">
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-40 bg-slate-200 rounded-lg" />
                  <div className="h-4 w-20 bg-slate-200 rounded-lg" />
                  <div className="h-3 w-full bg-slate-200 rounded-lg" />
                </div>
                <div className="w-32 h-32 bg-slate-200 rounded-2xl shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'checkout') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col animate-pulse relative">
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none bg-white/20 backdrop-blur-[1px]">
          <div className="w-10 h-10 border-4 border-[#00bd6f]/20 border-t-[#00bd6f] rounded-full animate-spin shadow-md" />
        </div>
        {/* Header Skeleton */}
        <div className="bg-white px-4 py-3 flex items-center gap-3 sticky top-0 z-30 shadow-sm border-b border-slate-100 h-14">
          <div className="w-6 h-6 bg-slate-200 rounded-full" />
          <div className="h-5 w-32 bg-slate-200 rounded-lg" />
        </div>

        <div className="flex-1 overflow-y-auto pb-32">
          {/* Delivery Options Skeleton */}
          <div className="bg-white p-4 mb-2">
            <div className="flex gap-2 mb-4">
              <div className="flex-1 h-10 bg-slate-200 rounded-xl" />
              <div className="flex-1 h-10 bg-slate-200 rounded-xl" />
            </div>
          </div>

          {/* Items Skeleton */}
          <div className="bg-white p-4 mb-2 space-y-4">
            <div className="h-5 w-24 bg-slate-200 rounded-lg mb-2" />
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="w-16 h-16 bg-slate-200 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-slate-200 rounded-lg" />
                  <div className="h-4 w-16 bg-slate-200 rounded-lg" />
                </div>
              </div>
            ))}
          </div>

          {/* Bill Details Skeleton */}
          <div className="bg-white p-4 mb-2 space-y-3 border border-slate-100 shadow-sm rounded-2xl">
            <div className="h-5 w-1/3 bg-slate-200 rounded-lg mb-4" />
            <div className="bg-[#f8f9fa] rounded-2xl p-4 flex items-center justify-between shadow-sm border border-slate-100 mb-6 font-sans">
              <div className="flex flex-1 items-center gap-4 text-left">
                <div className="w-10 h-10 bg-slate-200 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-16 bg-slate-200 rounded-lg" />
                  <div className="h-3 w-32 bg-slate-200 rounded-lg" />
                </div>
              </div>
              <div className="w-12 h-4 bg-slate-200 rounded-lg" />
            </div>
            
            <div className="space-y-4">
              <div className="h-5 w-32 bg-slate-200 rounded-lg mb-2" />
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 w-24 bg-slate-200 rounded-lg" />
                  <div className="h-4 w-16 bg-slate-200 rounded-lg" />
                </div>
              ))}
              <div className="h-px w-full bg-slate-200 my-2" />
              <div className="flex justify-between">
                <div className="h-5 w-32 bg-slate-200 rounded-lg" />
                <div className="h-5 w-20 bg-slate-200 rounded-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar Skeleton */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 pb-safe z-50">
          <div className="h-12 w-full bg-slate-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (type === 'home') {
    return (
      <div className="min-h-screen bg-white animate-pulse relative">
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none bg-white/20 backdrop-blur-[1px]">
          <div className="w-10 h-10 border-4 border-[#00bd6f]/20 border-t-[#00bd6f] rounded-full animate-spin shadow-md" />
        </div>
        {/* Header Skeleton */}
        <div className="px-4 pt-safe pb-2 sticky top-0 bg-white/80 backdrop-blur-md z-40">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-200 rounded-full" />
              <div className="space-y-1">
                <div className="h-4 w-24 bg-slate-200 rounded-lg" />
                <div className="h-3 w-32 bg-slate-200 rounded-lg" />
              </div>
            </div>
            <div className="w-10 h-10 bg-slate-200 rounded-full" />
          </div>
          <div className="h-12 w-full bg-slate-200 rounded-2xl" />
        </div>

        {/* Categories Skeleton */}
        <div className="px-4 mt-6 mb-8">
          <div className="h-5 w-40 bg-slate-200 rounded-lg mb-4" />
          <div className="flex gap-4 overflow-x-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2 shrink-0">
                <div className="w-16 h-16 bg-slate-200 rounded-full" />
                <div className="h-3 w-12 bg-slate-200 rounded-lg" />
              </div>
            ))}
          </div>
        </div>

        {/* Restaurant Cards Skeleton */}
        <div className="px-4 space-y-6">
          <div className="h-6 w-48 bg-slate-200 rounded-lg mb-4" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-full">
              <div className="w-full h-48 bg-slate-200 rounded-3xl mb-3" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-5 w-48 bg-slate-200 rounded-lg" />
                  <div className="h-5 w-12 bg-slate-200 rounded-lg" />
                </div>
                <div className="h-4 w-32 bg-slate-200 rounded-lg" />
                <div className="h-4 w-24 bg-slate-200 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};
